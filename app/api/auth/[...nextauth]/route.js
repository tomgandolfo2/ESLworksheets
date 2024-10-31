import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma"; // Adjust the path if needed

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Using JWT for session strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Store role in the token when the user signs in
        token.sub = user.id; // Store user ID in the token
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role; // Add the role to the session
        session.user.id = token.sub; // Add the user ID to the session
      }
      return session;
    },
  },
  debug: true, // Enable debugging for detailed logs
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
