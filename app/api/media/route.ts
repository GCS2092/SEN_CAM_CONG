import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fallback data for when database is unavailable
const fallbackMedia = [
  {
    id: "1",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    title: "Performance culturelle",
    description: "Une magnifique performance",
    performanceId: null,
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
    description: "Danse traditionnelle",
    performanceId: null,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const limit = searchParams.get("limit");
    const performanceId = searchParams.get("performanceId");

    const where: any = {};
    if (type) {
      where.type = type.toUpperCase();
    }
    if (performanceId) {
      where.performanceId = performanceId;
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ media }, { status: 200 });
  } catch (error) {
    console.warn("Database unavailable, using fallback media data", error);

    // Use fallback data
    let filteredMedia = [...fallbackMedia];

    // Apply filters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const limit = searchParams.get("limit");
    const performanceId = searchParams.get("performanceId");

    if (type) {
      filteredMedia = filteredMedia.filter(
        (m) => m.type === type.toUpperCase(),
      );
    }
    if (performanceId) {
      filteredMedia = filteredMedia.filter(
        (m) => m.performanceId === performanceId,
      );
    }
    if (limit) {
      filteredMedia = filteredMedia.slice(0, parseInt(limit));
    }

    return NextResponse.json({ media: filteredMedia }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification (ADMIN ou ARTIST)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || null;

    if (!token) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 },
      );
    }

    const { verifyToken } = await import("@/lib/auth");
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    // Seuls ADMIN et ARTIST peuvent créer des médias
    if (payload.role !== "ADMIN" && payload.role !== "ARTIST") {
      return NextResponse.json(
        { error: "Accès refusé. Admin ou Artiste uniquement." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { type, url, thumbnailUrl, title, description, performanceId } = body;

    if (!type || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Si performanceId est fourni, vérifier que l'artiste en est propriétaire
    if (performanceId && payload.role === "ARTIST") {
      const performance = await prisma.performance.findUnique({
        where: { id: performanceId },
      });

      if (!performance) {
        return NextResponse.json(
          { error: "Performance non trouvée" },
          { status: 404 },
        );
      }

      if (performance.userId !== payload.id) {
        return NextResponse.json(
          {
            error:
              "Vous ne pouvez ajouter des médias qu'à vos propres performances",
          },
          { status: 403 },
        );
      }
    }

    const media = await prisma.media.create({
      data: {
        type: type.toUpperCase(),
        url,
        thumbnailUrl,
        title,
        description,
        performanceId: performanceId || null,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: "Failed to create media" },
      { status: 500 },
    );
  }
}
