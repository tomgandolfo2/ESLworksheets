"use client";
import { useState } from "react";
import Head from "next/head";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setSuccessMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true); // Start loading state

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ name, email, message }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setSuccessMessage("Your message has been sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setSuccessMessage("Failed to send your message. Please try again.");
    }

    setLoading(false); // Stop loading state
  };

  return (
    <>
      {/* Add SEO tags for the Contact page */}
      <Head>
        <title>Contact Us - ESL Worksheet Hub</title>
        <meta
          name="description"
          content="Contact us for inquiries or support regarding ESL worksheets."
        />
      </Head>

      {/* Main Contact Page Layout */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Contact Us
        </h1>

        {/* Success/Error Message */}
        {successMessage && (
          <p className="mb-4 text-center text-green-500" aria-live="polite">
            {successMessage}
          </p>
        )}

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              required
            ></textarea>
          </div>

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-lg w-full sm:w-auto ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </>
  );
}
