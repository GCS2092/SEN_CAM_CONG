import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withRateLimit, handleServerError } from "@/lib/api-helpers";
import {
  fallbackPerformances,
  paginateArray,
  sortByDate,
} from "@/lib/fallback-data";

async function getPerformances(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || limit || "10");
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [performances, total] = await Promise.all([
      prisma.performance.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              date: true,
            },
          },
          media: true,
          _count: {
            select: {
              media: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
        skip,
        take: pageSize,
      }),
      prisma.performance.count({ where }),
    ]);

    return NextResponse.json(
      {
        performances,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.warn("Database unavailable, using fallback data", error);

    // Get searchParams from request for fallback
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(
      searchParams.get("pageSize") || searchParams.get("limit") || "10",
    );

    // Fallback avec données statiques
    let filteredPerformances = [...fallbackPerformances];

    // Trier par date (plus récent en premier)
    filteredPerformances = sortByDate(filteredPerformances, false);

    // Paginer
    const result = paginateArray(filteredPerformances, page, pageSize);

    return NextResponse.json(
      {
        performances: result.items,
        totalCount: result.totalCount,
        hasMore: result.hasMore,
      },
      { status: 200 },
    );
  }
}

export const GET = withRateLimit(getPerformances);

async function createPerformance(request: NextRequest) {
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

    const { verifyTokenOrSupabase } = await import("@/lib/auth");
    const payload = await verifyTokenOrSupabase(token);
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    // Seuls ADMIN et ARTIST peuvent créer des performances
    if (payload.role !== "ADMIN" && payload.role !== "ARTIST") {
      return NextResponse.json(
        { error: "Accès refusé. Admin ou Artiste uniquement." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { performanceSchema } = await import("@/lib/validations");
    const { handleValidationError, handleServerError } =
      await import("@/lib/api-helpers");

    // Pour les ARTIST, forcer le userId à leur propre ID
    const userId =
      payload.role === "ARTIST" ? payload.id : body.userId || payload.id;

    const validation = performanceSchema.safeParse({
      ...body,
      userId,
    });

    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    const data = validation.data;
    const performance = await prisma.performance.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        location: data.location,
        videoUrl: data.videoUrl,
        imageUrl: data.imageUrl,
        userId: data.userId,
        eventId: data.eventId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ performance }, { status: 201 });
  } catch (error) {
    return handleServerError(
      error,
      "Erreur lors de la création de la performance",
    );
  }
}

export const POST = withRateLimit(createPerformance, {
  windowMs: 60 * 1000,
  max: 10,
});
