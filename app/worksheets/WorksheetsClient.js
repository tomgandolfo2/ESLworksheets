"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Head from "next/head";

const Worksheets = ({ initialWorksheets = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Extract applied filters from URL
  const appliedLevel = searchParams.get("level") || "";
  const appliedSkill = searchParams.get("skill") || "";
  const appliedSearch = searchParams.get("search") || "";

  // State for filters and worksheet data
  const [worksheets, setWorksheets] = useState(initialWorksheets);
  const [selectedLevel, setSelectedLevel] = useState(appliedLevel);
  const [selectedSkill, setSelectedSkill] = useState(appliedSkill);
  const [searchQuery, setSearchQuery] = useState(appliedSearch);
  const [pendingLevel, setPendingLevel] = useState(appliedLevel);
  const [pendingSkill, setPendingSkill] = useState(appliedSkill);
  const [pendingSearch, setPendingSearch] = useState(appliedSearch);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false); // Add error handling state
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);
  const [ratingsData, setRatingsData] = useState({});
  const observerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Effect to update state when URL parameters change
  useEffect(() => {
    setSelectedLevel(appliedLevel);
    setSelectedSkill(appliedSkill);
    setSearchQuery(appliedSearch);
    setPage(1); // Reset page when filters change
    fetchWorksheets(1); // Refetch when filters change
  }, [appliedLevel, appliedSkill, appliedSearch]);

  // Fetch worksheets based on filters
  const fetchWorksheets = async (pageNum) => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(
        `/api/worksheets?level=${pendingLevel || selectedLevel}&skill=${
          pendingSkill || selectedSkill
        }&search=${pendingSearch || searchQuery}&limit=10&offset=${
          (pageNum - 1) * 10
        }`
      );

      if (!response.ok) throw new Error("Failed to load worksheets.");

      const { worksheets: newWorksheets } = await response.json();

      if (pageNum === 1) {
        setWorksheets(newWorksheets);
        setHasMore(newWorksheets.length > 0);
      } else {
        setWorksheets((prev) => [...prev, ...newWorksheets]);
        setHasMore(newWorksheets.length > 0);
      }
    } catch (error) {
      console.error("Error fetching worksheets:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchWorksheets(page);
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading, hasMore]);

  // Fetch ratings on initial render
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch("/api/ratings");
        const data = await response.json();
        const ratingsObj = {};

        data.forEach((rating) => {
          ratingsObj[rating.worksheetId] = {
            average: rating.averageRating,
            reviews: rating.reviewCount,
          };
        });

        setRatingsData(ratingsObj);
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
      }
    };

    fetchRatings();
  }, []);

  // Apply the filters only when the "Apply Filters" button is clicked
  const handleFilter = useCallback(() => {
    const query = new URLSearchParams();
    if (pendingLevel) query.append("level", pendingLevel);
    if (pendingSkill) query.append("skill", pendingSkill);
    if (pendingSearch) query.append("search", pendingSearch);

    router.push(`/worksheets?${query.toString()}`);
    setSelectedLevel(pendingLevel);
    setSelectedSkill(pendingSkill);
    setSearchQuery(pendingSearch);
    setPage(1);
    fetchWorksheets(1);
  }, [pendingLevel, pendingSkill, pendingSearch, router]);

  // Debounce search input to avoid excessive API calls
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setPendingSearch(value);
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      handleFilter();
    }, 300); // 300ms delay for debounce
  };

  // Remove a filter and refetch the worksheets immediately
  const removeFilter = (filterType) => {
    const query = new URLSearchParams(searchParams);

    if (filterType === "level") {
      setSelectedLevel("");
      setPendingLevel("");
      query.delete("level");
    }
    if (filterType === "skill") {
      setSelectedSkill("");
      setPendingSkill("");
      query.delete("skill");
    }
    if (filterType === "search") {
      setSearchQuery("");
      setPendingSearch("");
      query.delete("search");
    }

    router.push(`/worksheets?${query.toString()}`);
    setPage(1);
    fetchWorksheets(1);
  };

  // Handle download and log the download history
  const handleDownload = async (worksheet) => {
    if (!session) {
      alert("You must be signed in to download worksheets.");
      return;
    }

    try {
      await fetch("/api/download", {
        method: "POST",
        body: JSON.stringify({
          worksheetId: worksheet.id,
          userId: session.user.id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      window.open(worksheet.fileUrl, "_blank");
    } catch (error) {
      console.error("Failed to log download:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Head>
        <title>
          {selectedWorksheet ? selectedWorksheet.title : "Worksheets"}
        </title>
        <meta
          name="description"
          content={
            selectedWorksheet
              ? selectedWorksheet.description
              : "Browse, search, and download ESL worksheets"
          }
        />
      </Head>

      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Uploaded Worksheets
      </h1>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-center items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          value={pendingSearch}
          onChange={handleSearchChange}
          placeholder="Search worksheets..."
          className="p-2 border rounded w-full sm:w-1/3"
        />
        <select
          value={pendingLevel}
          onChange={(e) => setPendingLevel(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        >
          <option value="">All Levels</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </select>

        <select
          value={pendingSkill}
          onChange={(e) => setPendingSkill(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        >
          <option value="">All Skills</option>
          <option value="reading">Reading</option>
          <option value="writing">Writing</option>
          <option value="listening">Listening</option>
          <option value="use of english">Use of English</option>
          <option value="speaking">Speaking</option>
        </select>

        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          Apply Filters
        </button>
      </div>

      {/* Active Filters Display */}
      {(selectedLevel || selectedSkill || searchQuery) && (
        <div className="flex justify-center space-x-4 mb-8">
          {searchQuery && (
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded flex items-center space-x-2">
              <span>Search: {searchQuery}</span>
              <button
                onClick={() => removeFilter("search")}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}
          {selectedLevel && (
            <div className="bg-blue-100 text-blue-800 p-2 rounded flex items-center space-x-2">
              <span>Level: {selectedLevel}</span>
              <button
                onClick={() => removeFilter("level")}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}
          {selectedSkill && (
            <div className="bg-green-100 text-green-800 p-2 rounded flex items-center space-x-2">
              <span>Skill: {selectedSkill}</span>
              <button
                onClick={() => removeFilter("skill")}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Display worksheets */}
      {loading && <p>Loading worksheets...</p>}
      {error && <p className="text-red-500">Error loading worksheets.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && worksheets.length === 0 ? (
          <p className="text-center text-gray-600">
            No worksheets available for the selected filters.
          </p>
        ) : (
          worksheets.map((worksheet) => (
            <div
              key={worksheet.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {worksheet.title}
              </h2>
              <p className="text-gray-600 mb-1">Level: {worksheet.level}</p>
              <p className="text-gray-600 mb-1">Skill: {worksheet.skill}</p>
              <p className="text-gray-600 mb-4">{worksheet.description}</p>

              {/* Display average rating and number of reviews */}
              {ratingsData[worksheet.id] && (
                <div className="text-gray-600 mb-2">
                  <span>
                    Average Rating: {ratingsData[worksheet.id].average}
                  </span>{" "}
                  | <span>Reviews: {ratingsData[worksheet.id].reviews}</span>
                </div>
              )}

              {/* Show PDF preview */}
              <iframe
                src={`https://docs.google.com/gview?url=${worksheet.fileUrl}&embedded=true`}
                width="100%"
                height="150px"
                className="mb-4"
                title="Worksheet Preview"
              />

              <button
                onClick={() => handleDownload(worksheet)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Download Worksheet
              </button>
            </div>
          ))
        )}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerRef} className="h-12 flex justify-center items-center">
        {loading && !error && <p>Loading more worksheets...</p>}
      </div>
    </div>
  );
};

export default Worksheets;
