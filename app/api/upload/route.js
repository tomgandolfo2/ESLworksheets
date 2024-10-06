import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjusted path for authOptions
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  // Ensure the user is an admin
  if (!session || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 403 });
  }

  const formData = await req.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const file = formData.get("file");
  const level = formData.get("level");
  const skill = formData.get("skill");

  const cleanTitle = title.replace(/\s+/g, "_").toLowerCase();

  const fileUrl = await uploadFileToCloudinary(file, cleanTitle);

  const worksheet = await prisma.worksheet.create({
    data: {
      title,
      description,
      fileUrl,
      level,
      skill,
    },
  });

  return new Response(JSON.stringify(worksheet), { status: 201 });
}
