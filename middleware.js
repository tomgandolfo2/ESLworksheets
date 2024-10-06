import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Define the secret for JWT token
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  // Get the token from the request
  const token = await getToken({ req, secret });

  // Redirect to home page if there's no token or user is not an admin
  if (!token || token.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/upload"], // Protect the "/upload" route
};
