import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma"; // Adjust the path to your Prisma setup

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET, // Secret for token encryption
  session: {
    strategy: "jwt", // Using JWT for session strategy
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role; // Store the role in the session token
        session.user.id = token.sub; // Add the user ID to the session from the token
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
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
        secure: true,
        httpOnly: true,
        sameSite: "none", // Set to 'none' for cross-site requests
        path: "/",
      },
    },
    state: {
      name: "oauth_state",
      options: {
        secure: true,
        httpOnly: true,
        sameSite: "none", // Set to 'none' for cross-site requests
        path: "/",
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
