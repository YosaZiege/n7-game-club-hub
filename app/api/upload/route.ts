import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";
import AdmZip from "adm-zip";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs"; // required for fs/unzip

function slugify(str: string) {
   return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove symbols
      .replace(/\s+/g, "-"); // spaces -> dashes
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

async function saveFileToPublic(file: File, folder: string) {
   const bytes = await file.arrayBuffer();
   const buffer = Buffer.from(bytes);

   const ext = extLower(file.name);
   const filename = `${randomId()}${ext}`;

   const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
   await fs.mkdir(uploadDir, { recursive: true });

   const diskPath = path.join(uploadDir, filename);
   await fs.writeFile(diskPath, buffer);

   return {
      url: `/uploads/${folder}/${filename}`,
      diskPath,
   };
}

async function extractZipToPublicGames(zipDiskPath: string, slug: string) {
   const outDir = path.join(process.cwd(), "public", "games", slug);

   // Ensure folder exists and is empty-ish (optional)
   await fs.mkdir(outDir, { recursive: true });

   const zip = new AdmZip(zipDiskPath);
   zip.extractAllTo(outDir, true);

   const entries = zip.getEntries().filter((e) => !e.isDirectory);

   const indexEntry =
      entries.find((e) => e.entryName.toLowerCase().endsWith("index.html")) ?? null;

   const htmlEntry =
      indexEntry ??
      entries.find((e) => e.entryName.toLowerCase().endsWith(".html")) ??
      null;

   if (!htmlEntry) {
      throw new Error("No .html file found inside the ZIP (Godot HTML export required).");
   }

   // Can be nested like "web/index.html" — we keep it as relative path.
   return htmlEntry.entryName.replaceAll("\\", "/");
}

async function removeDirIfExists(dirPath: string) {
   try {
      await fs.rm(dirPath, { recursive: true, force: true });
   } catch {
      // ignore
   }
}

export async function POST(req: Request) {
   const session = await getServerSession(authOptions as any);

   if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   const form = await req.formData();

   const title = String(form.get("title") ?? "").trim();
   const description = String(form.get("description") ?? "").trim() || null;

   const tagsRaw = String(form.get("tags") ?? "[]");
   const tags = parseTags(tagsRaw);

   if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
   }
   if (tags.length === 0) {
      return NextResponse.json({ error: "At least 1 tag is required" }, { status: 400 });
   }

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

   // Optional files
   const thumbnail = form.get("thumbnail");
   const creatorImage = form.get("creator_image");

   // Unique slug
   const baseSlug = slugify(title);
   let slug = baseSlug;
   let i = 1;
   while (await prisma.game.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
   }

   // Save zip first
   const savedZip = await saveFileToPublic(zip, "games");
   const zipUrl = savedZip.url;

   // Extract zip to /public/games/<slug>/ and find entry html
   let entryFile: string;
   const extractedDir = path.join(process.cwd(), "public", "games", slug);

   try {
      entryFile = await extractZipToPublicGames(savedZip.diskPath, slug);
   } catch (err: any) {
      // cleanup extracted folder if extraction failed
      await removeDirIfExists(extractedDir);
      return NextResponse.json(
         { error: err?.message ?? "Failed to extract ZIP" },
         { status: 400 }
      );
   }

   // Save optional images (IMPORTANT: take .url!)
   let imageUrl: string | null = null;
   if (thumbnail instanceof File && thumbnail.size > 0) {
      const ext = extLower(thumbnail.name);
      if (!isAllowedImageExt(ext)) {
         return NextResponse.json({ error: "Thumbnail must be png/jpg/webp" }, { status: 400 });
      }
      const savedThumb = await saveFileToPublic(thumbnail, "thumbnails");
      imageUrl = savedThumb.url;
   }

   let creatorImageUrl: string | null = null;
   if (creatorImage instanceof File && creatorImage.size > 0) {
      const ext = extLower(creatorImage.name);
      if (!isAllowedImageExt(ext)) {
         return NextResponse.json({ error: "Creator image must be png/jpg/webp" }, { status: 400 });
      }
      const savedCreator = await saveFileToPublic(creatorImage, "creators");
      creatorImageUrl = savedCreator.url;
   }

   // Create Game + tags
   const game = await prisma.game.create({
      data: {
         title,
         slug,
         description,
         imageUrl,                 // string | null ✅
         zipUrl,                   // string ✅
         creatorImage: creatorImageUrl, // string | null ✅
         entryFile,                // string ✅
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
         slug: true,
         entryFile: true,
         approved: true,
         createdAt: true,
      },
   });

   return NextResponse.json(game, { status: 201 });
}

