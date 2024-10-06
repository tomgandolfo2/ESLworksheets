"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi"; // Import menu icon

export default function NavLinks() {
  const { data: session } = useSession(); // Get session data
  const [menuOpen, setMenuOpen] = useState(false); // State to manage mobile menu
  const menuRef = useRef(null); // Ref for detecting outside clicks

  // Handle click outside the mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // Re-enable background scroll
    };
  }, [menuOpen]);

  return (
    <nav aria-label="Primary" className="relative">
      {/* Mobile menu icon */}
      <div className="flex justify-between items-center md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl p-2"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <FiMenu />
        </button>
      </div>

      {/* Desktop links - Hidden on mobile */}
      <div className="hidden md:flex md:space-x-4 items-center">
        <Link href="/worksheets" className="hover:underline text-white">
          Worksheets
        </Link>
        {session?.user?.role === "admin" && (
          <Link href="/upload" className="hover:underline text-white">
            Upload
          </Link>
        )}
        {session?.user && (
          <Link
            href="/downloaded-worksheets"
            className="hover:underline text-white"
          >
            Downloaded Worksheets
          </Link>
        )}
        <Link href="/contact" className="hover:underline text-white">
          Contact
        </Link>

        {/* Sign In/Sign Out button for large screens */}
        <div className="ml-4">
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300 ease-in-out"
              aria-label="Sign Out"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-300 ease-in-out"
              aria-label="Sign In with Google"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="absolute top-12 right-0 bg-white shadow-md md:hidden z-50 p-4 w-60 rounded-lg"
        >
          {/* Mobile links */}
          <Link
            href="/worksheets"
            className="block py-2 hover:underline text-black text-center"
          >
            Worksheets
          </Link>
          {session?.user?.role === "admin" && (
            <Link
              href="/upload"
              className="block py-2 hover:underline text-black text-center"
            >
              Upload
            </Link>
          )}
          {session?.user && (
            <Link
              href="/downloaded-worksheets"
              className="block py-2 hover:underline text-black text-center"
            >
              Downloaded Worksheets
            </Link>
          )}
          <Link
            href="/contact"
            className="block py-2 hover:underline text-black text-center"
          >
            Contact
          </Link>

          {/* Sign In/Sign Out button (ONLY in mobile menu) */}
          <div className="mt-4">
            {session ? (
              <button
                onClick={() => signOut()}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 ease-in-out"
                aria-label="Sign Out"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 ease-in-out"
                aria-label="Sign In with Google"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
