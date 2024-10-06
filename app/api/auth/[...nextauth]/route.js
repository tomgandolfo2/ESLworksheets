import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma"; // Adjust the path to your Prisma setup

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET, // Secret for token encryption
  session: {
    strategy: "jwt", // Using JWT for session strategy
  },
  callbacks: {
    async session({ session, token }) {
      console.log("Session callback called with session:", session);
      console.log("Session callback called with token:", token);

      if (session?.user) {
        session.user.role = token.role; // Store the role in the session token
        session.user.id = token.sub; // Add the user ID to the session from the token
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback called with token:", token);
      if (user) {
        console.log("User found in JWT callback:", user);
        token.role = user.role; // Store role in the token when the user signs in
        token.sub = user.id; // Store user ID in the token
      }
      return token;
    },
  },
  cookies: {
    csrfToken: {
      name: "csrfToken",
      options: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // `lax` in development
        path: "/",
      },
    },
    state: {
      name: "oauth_state", // Ensure the `state` cookie has a distinct name
      options: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // `lax` in development
        path: "/",
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
