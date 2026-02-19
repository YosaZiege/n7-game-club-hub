import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs"; // required for fs
function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function randomId() {
  return crypto.randomBytes(12).toString("hex");
}

function extLower(name: string) {
  return path.extname(name).toLowerCase();
}

function isAllowedImageExt(ext: string) {
  return [".png", ".jpg", ".jpeg", ".webp"].includes(ext);
}

async function saveFileToPublic(file: File, folder: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = extLower(file.name);
  const filename = `${randomId()}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const fullPath = path.join(uploadDir, filename);
  await fs.writeFile(fullPath, buffer);

  return `/uploads/${folder}/${filename}`;
}

function parseTags(tagsRaw: string): string[] {
  try {
    const parsed = JSON.parse(tagsRaw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((t) => String(t).trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 8);
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
   console.log(session)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();

  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim() || null;

  const tagsRaw = String(form.get("tags") ?? "[]");
  const tags = parseTags(tagsRaw);

  const zip = form.get("zip");
  if (!(zip instanceof File)) {
    return NextResponse.json({ error: "Missing zip file" }, { status: 400 });
  }
  if (!zip.name.toLowerCase().endsWith(".zip")) {
    return NextResponse.json({ error: "Only .zip files are allowed" }, { status: 400 });
  }
  const maxZipBytes = 100 * 1024 * 1024; // 100MB
  if (zip.size > maxZipBytes) {
    return NextResponse.json({ error: "ZIP too large (max 100MB)" }, { status: 400 });
  }

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (tags.length === 0) {
    return NextResponse.json({ error: "At least 1 tag is required" }, { status: 400 });
  }

  // Optional files
  const thumbnail = form.get("thumbnail");
  const creatorImage = form.get("creator_image");

  // Save required zip
  const zipUrl = await saveFileToPublic(zip, "games");
const baseSlug = slugify(title);

let slug = baseSlug;
let i = 1;
while (await prisma.game.findUnique({ where: { slug } })) {
  slug = `${baseSlug}-${i++}`;
}

  // Save optional images
  let imageUrl: string | null = null;
  if (thumbnail instanceof File && thumbnail.size > 0) {
    const ext = extLower(thumbnail.name);
    if (!isAllowedImageExt(ext)) {
      return NextResponse.json({ error: "Thumbnail must be png/jpg/webp" }, { status: 400 });
    }
    imageUrl = await saveFileToPublic(thumbnail, "thumbnails");
  }

  let creatorImageUrl: string | null = null;
  if (creatorImage instanceof File && creatorImage.size > 0) {
    const ext = extLower(creatorImage.name);
    if (!isAllowedImageExt(ext)) {
      return NextResponse.json({ error: "Creator image must be png/jpg/webp" }, { status: 400 });
    }
    creatorImageUrl = await saveFileToPublic(creatorImage, "creators");
  }

  // Create Game + tags (SQLite-safe many-to-many)
  const game = await prisma.game.create({
    data: {
      title,
      description,
      imageUrl,
      slug,
      zipUrl,
      creatorImage: creatorImageUrl,
      creatorId: session.user.id,
      approved: false,
      tags: {
        create: tags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
    },
    select: {
      id: true,
      title: true,
      approved: true,
      createdAt: true,
    },
  });

  return NextResponse.json(game, { status: 201 });
}

