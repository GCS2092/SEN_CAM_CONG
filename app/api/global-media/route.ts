import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withRateLimit, handleServerError } from "@/lib/api-helpers";
import { verifyTokenOrSupabase } from "@/lib/auth";

// Fallback data for when database is unavailable
const fallbackGlobalMedia = [
  {
    id: "1",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    title: "Galerie culturelle",
    description: "Collection d'images culturelles",
    category: "gallery",
    order: 0,
    active: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    title: "Spectacle de danse",
    description: "Performances artistiques",
    category: "gallery",
    order: 1,
    active: true,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
];

async function getGlobalMedia(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const active = searchParams.get("active");

    const where: any = {};
    if (category) where.category = category;
    if (type) where.type = type.toUpperCase();
    if (active !== null) where.active = active === "true";

    const media = await prisma.globalMedia.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ media }, { status: 200 });
  } catch (error) {
    console.warn(
      "Database unavailable, using fallback global media data",
      error,
    );

    // Use fallback data
    let filteredMedia = [...fallbackGlobalMedia];

    // Apply filters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const active = searchParams.get("active");

    if (category) {
      filteredMedia = filteredMedia.filter((m) => m.category === category);
    }
    if (type) {
      filteredMedia = filteredMedia.filter(
        (m) => m.type === type.toUpperCase(),
      );
    }
    if (active !== null) {
      filteredMedia = filteredMedia.filter(
        (m) => m.active === (active === "true"),
      );
    }

    // Sort by order and createdAt
    filteredMedia.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return NextResponse.json({ media: filteredMedia }, { status: 200 });
  }
}

export const GET = withRateLimit(getGlobalMedia);

async function createGlobalMedia(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || null;

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const payload = await verifyTokenOrSupabase(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await request.json();
    const {
      type,
      url,
      thumbnailUrl,
      title,
      description,
      category,
      order = 0,
      active = true,
    } = body;

    if (!type || !url) {
      return NextResponse.json(
        { error: "Le type et l'URL sont requis" },
        { status: 400 },
      );
    }

    const media = await prisma.globalMedia.create({
      data: {
        type: type.toUpperCase(),
        url,
        thumbnailUrl,
        title,
        description,
        category,
        order,
        active,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    return handleServerError(error, "Erreur lors de la création du média");
  }
}

export const POST = withRateLimit(createGlobalMedia, {
  windowMs: 60 * 1000,
  max: 10,
});
