"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // For redirecting
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify for toasts and container
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const Home = () => {
  const { data: session, status } = useSession(); // Get session data
  const router = useRouter();

  // Function to handle upload click with admin check
  const handleUploadClick = () => {
    if (session?.user?.role === "admin") {
      // If the user is an admin, allow navigation to the upload page
      router.push("/upload");
    } else {
      // If the user is not an admin, show the toast notification
      toast.error(
        "Only admin accounts can upload worksheets. Contact support to contribute.",
        {
          position: "top-center",
          autoClose: 3000, // Reduced autoClose time for better UX
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  // Add a loading state while session data is being fetched
  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to My ESL Worksheet Website
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Browse, upload, and download customized ESL worksheets for English
          learners.
        </p>
      </header>

      {/* Links to key sections */}
      <div className="flex space-x-6">
        <a
          href="/worksheets"
          className="px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          aria-label="View ESL worksheets"
          rel="noopener noreferrer"
        >
          View Worksheets
        </a>
        {/* Adjust the Upload button to use the handleUploadClick function */}
        <button
          onClick={handleUploadClick}
          className="px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600"
          aria-label="Upload ESL worksheet"
        >
          Upload Worksheet
        </button>
      </div>

      {/* ToastContainer for displaying notifications */}
      <ToastContainer />
    </div>
  );
};

export default Home;
