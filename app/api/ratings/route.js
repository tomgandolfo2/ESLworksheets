import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    // Fetch worksheets and associated ratings from DownloadHistory
    const worksheets = await prisma.worksheet.findMany({
      select: {
        id: true,
        title: true,
        downloads: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate the average rating and count of reviews for each worksheet
    const ratingsData = worksheets.map((worksheet) => {
      const ratings = worksheet.downloads.filter((d) => d.rating !== null); // Get non-null ratings
      const totalRatings = ratings.reduce(
        (sum, download) => sum + download.rating,
        0
      );
      const reviewCount = ratings.length;
      const averageRating =
        reviewCount > 0 ? (totalRatings / reviewCount).toFixed(1) : 0;

      return {
        worksheetId: worksheet.id,
        averageRating,
        reviewCount,
      };
    });

    return new Response(JSON.stringify(ratingsData), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return new Response("Failed to fetch ratings", { status: 500 });
  }
}
