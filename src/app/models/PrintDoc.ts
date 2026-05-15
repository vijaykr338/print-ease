import mongoose, {Schema, Document} from "mongoose";
import { generate_otp } from "@/utils/generate_otp";

export interface PrintDoc extends Document{
    userID: mongoose.Types.ObjectId;
    fileID: mongoose.Types.ObjectId[];
    storeID: mongoose.Types.ObjectId;
    state: 'draft'|'uploading'|'uploaded'|'payment_processing'|'paid'|'queued'|'processing'|'completed'|'cancelled'|'expired'|'failed';
    type: string;
    cost: number;
    createdAt: Date;
    paymentId:string;
    idempotency_key?: string;
    failure_reason?: string;
    failure_code?: string;
    failure_stage?: string;
    retry_count?: number;
    otp:string;
}

const PrintDocSchema: Schema<PrintDoc> = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    fileID: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "File", 
        required: true,
    },
    storeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store", 
        required: true,
    },
    state: {
        type: String,
        enum: ["draft","uploading","uploaded","payment_processing","paid","queued","processing","completed","cancelled","expired","failed"],
        required: true,
        default: "draft",
    },
    type: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default : Date.now(),
        required:true
    },
    paymentId:{
        type:String,
        required : true
    },
    idempotency_key: {
        type: String,
        required: false,
    },
    failure_reason: {
        type: String,
        required: false,
    },
    failure_code: {
        type: String,
        required: false,
    },
    failure_stage: {
        type: String,
        required: false,
    },
    retry_count: {
        type: Number,
        default: 0,
    },
    otp:{
        type:String,
        required:true,
        default:"A0"      
    }
})

// Indexes for queries
PrintDocSchema.index({ state: 1 });
PrintDocSchema.index({ userID: 1, state: 1 });

const PrintDocModel = (mongoose.models.PrintDoc as mongoose.Model<PrintDoc>) || mongoose.model<PrintDoc>("PrintDoc", PrintDocSchema)

export default PrintDocModel;