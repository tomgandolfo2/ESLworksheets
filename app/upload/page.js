"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head"; // For SEO

const UploadWorksheet = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState("A1");
  const [skill, setSkill] = useState("reading");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure file is selected before submitting
    if (!file) {
      toast.error("Please upload a file.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("level", level);
    formData.append("skill", skill);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Worksheet uploaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        // Reset form fields
        setTitle("");
        setDescription("");
        setFile(null);
        setLevel("A1");
        setSkill("reading");
      } else {
        toast.error("Failed to upload worksheet.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Error occurred during upload.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Upload Worksheet - ESL Worksheet Hub</title>
        <meta
          name="description"
          content="Upload a new ESL worksheet including its title, description, level, and skill."
        />
      </Head>

      <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          Upload Worksheet
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="Enter the worksheet title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="Enter a short description"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              required
            />
          </div>

          {/* Level Dropdown */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>

          {/* Skill Dropdown */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Skill
            </label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="reading">Reading</option>
              <option value="writing">Writing</option>
              <option value="listening">Listening</option>
              <option value="use of english">Use of English</option>
              <option value="speaking">Speaking</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-green-400 text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full"
          >
            Upload Worksheet
          </button>
        </form>

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

export default UploadWorksheet;
