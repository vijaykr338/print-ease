# PrintEase

PrintEase is a campus-focused printing workflow that lets students upload PDFs or image collages, configure print options, pay via Razorpay, and pick up prints without queues. It runs on Next.js App Router with Google SSO, Razorpay checkout, Azure Blob Storage for files, and MongoDB for persistence.

## Why it is interview-ready
- Modern stack: Next.js 15 App Router, React 19, TypeScript, Tailwind, MUI/HeroUI, Zustand, NextAuth (Google), Razorpay, Azure Blob, MongoDB.
- End-to-end user flow: upload, configure pricing, preview, pay, create print jobs, and view history.
- Real integrations: Razorpay order creation/signature verification, Azure Blob uploads, MongoDB models for files and print jobs.
- UX touches: animated hero with typewriter/flip words, drag-and-drop uploads with limits and validation, PDF preview, collage builder, shimmer and gradient buttons, loaders during payment/upload.

## Architecture snapshot
- App Router pages: landing [src/app/page.tsx](src/app/page.tsx), upload entry [src/app/Start/page.tsx](src/app/Start/page.tsx), configuration [src/app/new-order/page.tsx](src/app/new-order/page.tsx), summary and payment [src/app/order-summary/page.tsx](src/app/order-summary/page.tsx), order history [src/app/my-prints/page.tsx](src/app/my-prints/page.tsx).
- State: lightweight global store via Zustand for files plus per-file configs [src/store/filesStore.ts](src/store/filesStore.ts).
- Auth: Google SSO with JWT sessions and MongoDB adapter [src/lib/auth.ts](src/lib/auth.ts); Navbar gates signed-in flows and sign-out [src/components/Navbar.tsx](src/components/Navbar.tsx).
- Payments: Razorpay order creation and signature validation [src/app/api/razorpay/create_order/route.ts](src/app/api/razorpay/create_order/route.ts) and [src/app/api/razorpay/verify_payment/route.ts](src/app/api/razorpay/verify_payment/route.ts); client checkout in order summary.
- Files: uploads land in Azure Blob Storage via server utility [src/lib/server/utils.ts](src/lib/server/utils.ts); metadata stored in MongoDB [src/app/api/file/route.ts](src/app/api/file/route.ts) and [src/app/api/file/[id]/route.ts](src/app/api/file/[id]/route.ts).
- Print jobs: PrintDoc records tie files to a user and payment [src/app/api/printdoc/route.ts](src/app/api/printdoc/route.ts) with CRUD by id [src/app/api/printdoc/[id]/route.ts](src/app/api/printdoc/[id]/route.ts); order history consumes this.

## Core user flows
1) Landing -> Start: CTA enforces Google SSO then opens Start upload.
2) Upload: drag/drop PDFs (3 max, size and type checks) or build a collage (react-rnd + html2canvas + jsPDF to PDF). Files are staged in Zustand with default configs.
3) Configure: per-file PDF preview, print options (color/BW, orientation, sided, ranges, copies, remarks) and price calculator (2 for BW, 8 for color, range-aware, double-sided aware). All files must be configured before proceeding.
4) Summary and pay: shows line items and total; Razorpay checkout spins up an order. On success the client verifies signature, uploads files to Azure through form data, creates File docs, then creates a PrintDoc.
5) History: authenticated users fetch their PrintDoc list and see status, cost, and timestamp.

## API surface (App Router routes)
- POST /api/razorpay/create_order – create Razorpay order from total price.
- POST /api/razorpay/verify_payment – validate signature for payment_id/order_id.
- POST /api/file_upload – handle FormData: upload files to Azure, create File docs, then a PrintDoc.
- CRUD /api/file and /api/file/[id] – store per-file metadata (link, options, user).
- POST, GET /api/printdoc – create or list print jobs by user_id query.
- CRUD /api/printdoc/[id] – manage jobs and cascade-delete associated files in Azure.
- NextAuth routes: /api/auth/[...nextauth] backed by MongoDB.

## Data model notes
- File: userId, link (Azure blob URL), color, orientation, sided, remarks, copies, specificRange, pagesToPrint.
- PrintDoc: userID, fileID[], storeID, status, type, cost, createdAt, paymentId.
Both collections live in the PrintEase database (see db wiring in [src/lib/db.ts](src/lib/db.ts)).

## Environment
Create a .env.local with (example values):
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
NEXT_PUBLIC_RAZORPAY_KEY_SECRET=xxx
NEXT_PUBLIC_ACCOUNT_NAME=yourazureaccount
# Azure DefaultAzureCredential inputs (one of):
AZURE_TENANT_ID=...
AZURE_CLIENT_ID=...
AZURE_CLIENT_SECRET=...
```
Notes: Azure uses DefaultAzureCredential; ensure the identity has write/delete permissions on container user-files. NextAuth also needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (standard NextAuth envs).

## Running locally
1) Install: `npm install`
2) Dev server (Turbopack): `npm run dev`
3) Lint: `npm run lint`
4) Build: `npm run build` then `npm start`
Requires Node 18+ and access to MongoDB, Razorpay sandbox keys, and Azure credentials. For local blob testing you can swap DefaultAzureCredential with a connection string in [src/lib/server/utils.ts](src/lib/server/utils.ts).

## What to highlight in an interview
- Integration depth: demonstrates auth + payments + storage + DB coordination in a single flow.
- UX: PDF previews, error handling, capped uploads, loaders, animated hero, responsive layout, collage creation.
- Safety checks: ID validation via ObjectId, request body validation in API routes, signature verification for payments.
- Extensibility: clear separation between file metadata and print jobs, Zustand store decoupled from UI, Azure helpers factored into server utils.

## Known gaps and next steps
- Add refund/cancellation handling on payment or upload failure paths in /api/file_upload.
- Add admin/store dashboard for status transitions and printing queues.
- Harden validation and schema typing (zod) on API inputs and configs.
- Add unit/integration tests (API routes and pricing), plus e2e happy path.
- Rate-limit and auth-guard API routes beyond client checks; lock down CORS if exposed.
- Observability: add logging/metrics around upload and payment flows.
