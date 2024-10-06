// app/api/worksheets/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET handler for fetching worksheets
export async function GET(req) {
  const { searchParams } = new URL(req.url); // Use URL to parse query params
  const level = searchParams.get("level") || "";
  const skill = searchParams.get("skill") || "";
  const search = searchParams.get("search") || "";
  const limit = parseInt(searchParams.get("limit") || 10);
  const offset = parseInt(searchParams.get("offset") || 0);

  const where = {};
  if (level) where.level = level;
  if (skill) where.skill = skill;
  if (search) where.title = { contains: search.toLowerCase() };

  try {
    const worksheets = await prisma.worksheet.findMany({
      where,
      skip: offset,
      take: limit,
    });

    const total = await prisma.worksheet.count({ where });

    return NextResponse.json({ worksheets, total });
  } catch (error) {
    console.error("Failed to fetch worksheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch worksheets" },
      { status: 500 }
    );
  }
}
