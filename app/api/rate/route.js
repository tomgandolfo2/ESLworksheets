import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { worksheetId, rating } = await req.json();

    if (!worksheetId || !rating) {
      return new Response("Invalid data", { status: 400 });
    }

    const downloadHistoryEntry = await prisma.downloadHistory.upsert({
      where: {
        userId_worksheetId: {
          userId: session.user.id,
          worksheetId,
        },
      },
      update: { rating },
      create: {
        userId: session.user.id,
        worksheetId,
        downloadedAt: new Date(),
        rating,
      },
    });

    return new Response(JSON.stringify(downloadHistoryEntry), { status: 200 });
  } catch (error) {
    console.error("Error updating rating:", error);
    return new Response("Failed to update rating", { status: 500 });
  }
}
