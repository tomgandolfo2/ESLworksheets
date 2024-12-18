// app/layout.js

import ClientProvider from "@/components/ClientProvider";
import NavLinks from "@/components/NavLinks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata = {
  title: "ESL Worksheet Hub",
  description:
    "Upload, download, and browse ESL worksheets for English learners and teachers.",
  keywords: [
    "ESL worksheets",
    "English as a second language",
    "English learning",
    "ESL resources",
    "teaching materials",
  ],
  authors: [{ name: "ESL Worksheet Hub" }],
  openGraph: {
    title: "ESL Worksheet Hub",
    description:
      "Upload, download, and browse ESL worksheets for English learners.",
    url: "https://eslworksheets.vercel.app/",
    siteName: "ESL Worksheet Hub",
    images: [
      {
        url: "/path-to-your-image.jpg",
        width: 1200,
        height: 630,
        alt: "ESL Worksheet Hub Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ESL Worksheet Hub",
    description:
      "Upload, download, and browse ESL worksheets for English learners.",
    images: ["/path-to-your-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://eslworksheets.vercel.app/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ClientProvider>
          <header
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-6 shadow-md"
            aria-label="Global Navigation"
          >
            <div className="container mx-auto flex justify-between items-center px-4">
              <a
                href="/"
                aria-label="Home"
                className="text-3xl font-bold tracking-wide"
              >
                ESL Worksheet Hub
              </a>
              <NavLinks />
            </div>
          </header>
          <main className="flex-grow container mx-auto p-4" aria-live="polite">
            {children}
          </main>
          <footer className="w-full bg-gray-800 text-white p-4">
            <div className="container mx-auto text-center">
              <p>
                &copy; {new Date().getFullYear()} ESL Worksheet Hub. All rights
                reserved.
              </p>
            </div>
          </footer>
        </ClientProvider>
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
