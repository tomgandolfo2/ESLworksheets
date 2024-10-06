"use client"; // This tells Next.js it's a client-side component

import { useSession, signIn, signOut } from "next-auth/react";
import { FaSpinner } from "react-icons/fa"; // Spinner for loading state

export default function AuthButton() {
  const { data: session, status } = useSession();

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center" role="status" aria-live="polite">
        <FaSpinner
          className="animate-spin text-gray-500 mr-2"
          aria-hidden="true"
        />
        <p>Loading...</p>
      </div>
    );
  }

  // If user is signed in
  if (session) {
    return (
      <div className="flex items-center">
        <p className="mr-4">Signed in as {session.user?.email || "unknown"}</p>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white py-1 px-3 rounded ml-4 hover:bg-red-600 transition duration-300 ease-in-out"
          aria-label="Sign Out"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // If user is not signed in
  return (
    <button
      onClick={() => signIn("google")}
      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-300 ease-in-out"
      aria-label="Sign In with Google"
    >
      Sign In with Google
    </button>
  );
}
