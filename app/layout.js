import ClientProvider from "@/components/ClientProvider";
import NavLinks from "@/components/NavLinks"; // NavLinks will include the mobile menu logic
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import "./globals.css"; // Global styles

export const metadata = {
  title: "ESL Worksheet Website",
  description: "A platform to upload and browse ESL worksheets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Basic Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="A platform to upload and browse ESL worksheets for English learners and teachers."
        />
        <meta
          name="keywords"
          content="ESL worksheets, English as a second language, English learning, ESL resources, teaching materials"
        />
        <meta name="author" content="ESL Worksheet Hub" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags (for social media) */}
        <meta property="og:title" content="ESL Worksheet Hub" />
        <meta
          property="og:description"
          content="Upload, download, and browse ESL worksheets for English learners."
        />
        <meta
          property="og:image"
          content="/path-to-your-image.jpg" // Add the path to your social media image (should be 1200x630px)
          alt="ESL Worksheet Hub Preview" // Accessibility for images
        />
        <meta property="og:url" content="https://www.your-website.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ESL Worksheet Hub" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ESL Worksheet Hub" />
        <meta
          name="twitter:description"
          content="Upload, download, and browse ESL worksheets for English learners."
        />
        <meta
          name="twitter:image"
          content="/path-to-your-image.jpg" // Add the path to your social media image
          alt="ESL Worksheet Hub Twitter Card" // Accessibility for Twitter card image
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.your-website.com" />

        <title>ESL Worksheet Website</title>
      </head>
      <body className="min-h-screen flex flex-col">
        <ClientProvider>
          {/* Global Header */}
          <header
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-6 shadow-md"
            aria-label="Global Navigation"
          >
            <div className="container mx-auto flex justify-between items-center px-4">
              {/* Website Name/Logo Link */}
              <a
                href="/"
                aria-label="Home"
                className="text-3xl font-bold tracking-wide"
              >
                ESL Worksheet Hub
              </a>
              {/* Use the NavLinks component here */}
              <NavLinks />
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-grow container mx-auto p-4" aria-live="polite">
            {children}
          </main>

          {/* Global Footer */}
          <footer className="w-full bg-gray-800 text-white p-4">
            <div className="container mx-auto text-center">
              <p>
                &copy; {new Date().getFullYear()} ESL Worksheet Hub. All rights
                reserved.
              </p>
            </div>
          </footer>
        </ClientProvider>

        {/* Toast Container for displaying notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}
