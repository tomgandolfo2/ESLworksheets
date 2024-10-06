"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head"; // For SEO

const DownloadedWorksheets = () => {
  const { data: session, status } = useSession();
  const [downloadedWorksheets, setDownloadedWorksheets] = useState([]);
  const [userRatings, setUserRatings] = useState({}); // Store ratings locally
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchDownloadedWorksheets = async () => {
      setLoading(true); // Set loading state before fetching data
      try {
        const response = await fetch("/api/downloaded-worksheets");
        const data = await response.json();
        setDownloadedWorksheets(data);

        // Extract ratings into an object for quick access
        const ratingsObj = {};
        data.forEach((entry) => {
          ratingsObj[entry.worksheet.id] = entry.rating || 0; // Set to 0 if not rated
        });
        setUserRatings(ratingsObj);
      } catch (error) {
        console.error("Failed to fetch downloaded worksheets:", error);
        toast.error("Failed to load downloaded worksheets.");
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    if (session) {
      fetchDownloadedWorksheets();
    }
  }, [session]);

  const handleRatingChange = (worksheetId, rating) => {
    setUserRatings({
      ...userRatings,
      [worksheetId]: rating,
    });
  };

  const submitRating = async (worksheetId) => {
    const rating = userRatings[worksheetId];
    if (rating) {
      try {
        await fetch("/api/rate", {
          method: "POST",
          body: JSON.stringify({
            worksheetId,
            rating,
          }),
          headers: { "Content-Type": "application/json" },
        });

        // Show success toast message
        toast.success("Thank you for your rating!", {
          position: "top-right",
          autoClose: 3000,
        });

        setUserRatings((prevRatings) => ({
          ...prevRatings,
          [worksheetId]: rating,
        }));
      } catch (error) {
        console.error("Error submitting rating:", error);
        toast.error("Failed to submit rating", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You must be signed in to view your downloaded worksheets.</p>;
  }

  return (
    <>
      {/* SEO meta tags */}
      <Head>
        <title>Your Downloaded Worksheets - ESL Worksheet Hub</title>
        <meta
          name="description"
          content="View and manage your downloaded ESL worksheets."
        />
      </Head>

      <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          Your Downloaded Worksheets
        </h1>

        {loading ? (
          <p>Loading your downloaded worksheets...</p>
        ) : downloadedWorksheets.length === 0 ? (
          <p className="text-center text-gray-600">
            No worksheets downloaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {downloadedWorksheets.map((entry) => (
              <div
                key={entry.id}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {entry.worksheet.title}
                </h2>
                <p className="text-gray-600 mb-1">
                  Level: {entry.worksheet.level}
                </p>
                <p className="text-gray-600 mb-1">
                  Skill: {entry.worksheet.skill}
                </p>
                <p className="text-gray-600 mb-4">
                  {entry.worksheet.description}
                </p>

                {/* Download Again Button */}
                <a
                  href={entry.worksheet.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 block text-center"
                >
                  Download Again
                </a>

                {/* Rating Section */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Your rating:{" "}
                    {userRatings[entry.worksheet.id] || "Not rated yet"}
                  </p>
                  <div className="flex mt-2 justify-center sm:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`mx-1 p-1 ${
                          star <= userRatings[entry.worksheet.id]
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        onClick={() =>
                          handleRatingChange(entry.worksheet.id, star)
                        }
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {userRatings[entry.worksheet.id] > 0 && (
                    <button
                      className="mt-2 bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 w-full sm:w-auto"
                      onClick={() => submitRating(entry.worksheet.id)}
                    >
                      Submit Rating
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
};

export default DownloadedWorksheets;
