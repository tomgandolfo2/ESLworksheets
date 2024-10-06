import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { worksheetId } = await req.json();

    // Ensure worksheetId is provided
    if (!worksheetId) {
      return new Response("Invalid data", { status: 400 });
    }

    // Use upsert to avoid duplicate download entries
    const downloadHistoryEntry = await prisma.downloadHistory.upsert({
      where: {
        userId_worksheetId: {
          userId: session.user.id,
          worksheetId,
        },
      },
      update: {}, // If an entry exists, just return it without updating anything
      create: {
        userId: session.user.id,
        worksheetId,
      },
    });

    return new Response(JSON.stringify(downloadHistoryEntry), {
      status: 200,
    });
  } catch (error) {
    console.error("Error logging download:", error);
    return new Response("Failed to log download", { status: 500 });
  }
}
