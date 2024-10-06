import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Fetch the download history for the logged-in user
    const downloadHistory = await prisma.downloadHistory.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        worksheet: true, // Include the worksheet data in the response
      },
    });

    return new Response(JSON.stringify(downloadHistory), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching downloaded worksheets:", error);
    return new Response("Failed to fetch downloaded worksheets", {
      status: 500,
    });
  }
}
