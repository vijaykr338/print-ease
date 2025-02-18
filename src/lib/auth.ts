
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./db"





export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt", // Alternatively, "database" for MongoDB session storage
  },
  callbacks: {
    async session({ session, token }) {
      // Include user ID in the session for client-side use
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

})


