import Worksheets from "./WorksheetsClient";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Function to fetch worksheets with filters applied using Prisma's query builder
const getWorksheets = async (level, skill, search) => {
  // Build Prisma query
  const query = {
    where: {},
    take: 10, // Initially fetch only 10 worksheets for pagination performance
  };

  if (search) {
    query.where.title = {
      contains: search.toLowerCase(), // Convert search term to lowercase for case-insensitivity
    };
  }

  if (level) {
    query.where.level = level; // Filter worksheets by the selected level
  }

  if (skill) {
    query.where.skill = skill; // Filter worksheets by the selected skill
  }

  try {
    return await prisma.worksheet.findMany(query); // Fetch filtered worksheets
  } catch (error) {
    console.error("Error fetching worksheets:", error);
    return []; // Return an empty array if the query fails
  }
};

// Main page component
export default async function WorksheetsPage({ searchParams }) {
  const session = await getServerSession(authOptions); // Retrieve user session data
  const { level = "", skill = "", search = "" } = searchParams || {}; // Extract filters from query parameters

  const worksheets = await getWorksheets(level, skill, search); // Fetch worksheets based on the filters

  return (
    <>
      {/* Pass initial worksheets and session data to the client component */}
      <Worksheets initialWorksheets={worksheets} session={session} />
    </>
  );
}
