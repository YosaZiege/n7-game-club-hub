"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, UploadCloud, FileArchive, ImageIcon, UserCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

type UploadPayload = {
  title: string;
  creator: string;
  tags: string[];
  // file uploads:
  zip?: File;
  thumbnail?: File;
  creator_image?: File;
};

function isZip(file: File) {
  const nameOk = file.name.toLowerCase().endsWith(".zip");
  // Some browsers may not set a useful type; accept by extension
  return nameOk;
}

function fileToObjectUrl(file?: File | null) {
  if (!file) return null;
  return URL.createObjectURL(file);
}

export default function Page() {
  // Required
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const session = useSession();
   console.log(session);
  const creatorLocked = session?.data?.user?.username || "Unknown";
  // Optional extra info
  const [description, setDescription] = useState("");

  // Tags
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Files
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [creatorImageFile, setCreatorImageFile] = useState<File | null>(null);

  const zipPickerRef = useRef<HTMLInputElement | null>(null);
  const thumbPickerRef = useRef<HTMLInputElement | null>(null);
  const creatorPickerRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // Previews
  const thumbnailPreview = useMemo(() => fileToObjectUrl(thumbnailFile), [thumbnailFile]);
  const creatorPreview = useMemo(() => fileToObjectUrl(creatorImageFile), [creatorImageFile]);

  // Cleanup object URLs
  React.useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      if (creatorPreview) URL.revokeObjectURL(creatorPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addTag(raw: string) {
    const cleaned = raw.trim();
    if (!cleaned) return;
    if (cleaned.length > 20) return setErrorMsg("Tag too long (max 20 chars).");
    if (tags.includes(cleaned)) return;
    if (tags.length >= 8) return setErrorMsg("Max 8 tags.");
    setTags((prev) => [...prev, cleaned]);
    setTagInput("");
    setErrorMsg(null);
  }

  function removeTag(t: string) {
    setTags((prev) => prev.filter((x) => x !== t));
  }

  function handleZipSelect(file: File | null) {
    setErrorMsg(null);
    setOkMsg(null);
    if (!file) return;

    if (!isZip(file)) {
      setZipFile(null);
      setErrorMsg("Please upload a .zip file (Godot export).");
      return;
    }
    // Optional: basic size check (100MB example)
    const maxBytes = 100 * 1024 * 1024;
    if (file.size > maxBytes) {
      setZipFile(null);
      setErrorMsg("ZIP is too large (max 100MB).");
      return;
    }
    setZipFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] ?? null;
    handleZipSelect(file);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function validate(payload: UploadPayload) {
    if (!payload.zip) return "Please add your game .zip file.";
    if (!payload.title.trim()) return "Title is required.";
    // if (!payload.creator.trim()) return "Creator name is required.";
    if (payload.tags.length === 0) return "Add at least 1 tag.";
    return null;
  }

  async function submit() {
    setErrorMsg(null);
    setOkMsg(null);

    const payload: UploadPayload = {
      title,
      creator,
      tags,
      zip: zipFile ?? undefined,
      thumbnail: thumbnailFile ?? undefined,
      creator_image: creatorImageFile ?? undefined,
    };

    const v = validate(payload);
    if (v) {
      setErrorMsg(v);
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", payload.title);
      fd.append("creator", creatorLocked);
      fd.append("tags", JSON.stringify(payload.tags));
      fd.append("description", description);

      fd.append("zip", payload.zip!);
      if (payload.thumbnail) fd.append("thumbnail", payload.thumbnail);
      if (payload.creator_image) fd.append("creator_image", payload.creator_image);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Upload failed.");
      }

      setOkMsg("Uploaded successfully! 🎉");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
      
    <div className="w-full h-min-screen max-w-6xl mx-auto px-8 py-8 ">
      <div className="mb-6 mt-20 pt-6">
        <h1 className="text-2xl font-bold">Upload Your Game</h1>
        <p className="text-muted-foreground text-sm">Share your Godot creation with the community.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base">Upload Tips</CardTitle>
            <CardDescription>Make your game easier to discover.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Upload a <span className="font-medium text-foreground">ZIP</span> of your exported game.</p>
            <p>• Add a thumbnail (optional but recommended).</p>
            <p>• Add 1–8 tags to help people find it.</p>
            <p>• Creator image is optional.</p>
          </CardContent>
        </Card>

        {/* Main form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upload Game Files</CardTitle>
            <CardDescription>ZIP + details. Thumbnail and creator image are optional.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ZIP dropzone */}
            <div>
              <Label className="mb-2 block">Game ZIP (required)</Label>

              <div
                onDrop={handleDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={[
                  "rounded-xl border border-dashed p-6 transition",
                  "flex flex-col items-center justify-center text-center gap-2",
                  isDragging ? "bg-muted/60" : "bg-muted/30",
                ].join(" ")}
              >
                <UploadCloud className="w-8 h-8" />
                <div className="text-sm">
                  <p className="font-medium">Drag & drop your .zip file</p>
                  <p className="text-muted-foreground">or click to browse</p>
                </div>

                <input
                  ref={zipPickerRef}
                  type="file"
                  accept=".zip,application/zip"
                  className="hidden"
                  onChange={(e) => handleZipSelect(e.target.files?.[0] ?? null)}
                />

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => zipPickerRef.current?.click()}
                >
                  Browse ZIP
                </Button>

                {zipFile && (
                  <div className="mt-3 w-full flex items-center justify-between rounded-lg bg-background p-3 border">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileArchive className="w-5 h-5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{zipFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(zipFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setZipFile(null)}
                      aria-label="Remove zip"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Title + Creator */}
            <div className="grid grid-cols-1 md:grid-cols-3 p-2 gap-6 space-y-2">
              <div className="space-y-2 ">
                <Label htmlFor="title">Title (required)</Label>
                <Input
                  id="title"
                  placeholder="e.g. Cyber Runner 2084"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creator">Creator (required)</Label>
                 <Input id="creator"  value={creatorLocked} disabled/>
              </div>
            </div>

            {/* Description (optional) */}
            <div className="space-y-2">
              <Label htmlFor="desc">Description (optional)</Label>
              <Textarea
                id="desc"
                placeholder="Short description of your game..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[90px]"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2 p-2">
              <Label>Tags (required)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag and press Enter (e.g. platformer)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => addTag(tagInput)}
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-2 py-1">
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="opacity-70 hover:opacity-100"
                      aria-label={`Remove tag ${t}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <p className="text-xs text-muted-foreground">No tags yet.</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">1–8 tags, max 20 chars each.</p>
            </div>

            {/* Optional images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Thumbnail */}
              <div className="space-y-2">
                <Label>Thumbnail (optional)</Label>
                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-5 h-5" />
                    <p className="text-sm font-medium">Game thumbnail</p>
                  </div>

                  <input
                    ref={thumbPickerRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
                  />

                  <div className="flex items-center gap-3">
                    <Button type="button" variant="secondary" onClick={() => thumbPickerRef.current?.click()}>
                      Choose image
                    </Button>
                    {thumbnailFile && (
                      <Button type="button" variant="ghost" onClick={() => setThumbnailFile(null)}>
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="mt-3">
                    {thumbnailPreview ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-background">
                        <Image
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No thumbnail selected.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Creator image */}
              <div className="space-y-2">
                <Label>Creator image (optional)</Label>
                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCircle2 className="w-5 h-5" />
                    <p className="text-sm font-medium">Profile image</p>
                  </div>

                  <input
                    ref={creatorPickerRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setCreatorImageFile(e.target.files?.[0] ?? null)}
                  />

                  <div className="flex items-center gap-3">
                    <Button type="button" variant="secondary" onClick={() => creatorPickerRef.current?.click()}>
                      Choose image
                    </Button>
                    {creatorImageFile && (
                      <Button type="button" variant="ghost" onClick={() => setCreatorImageFile(null)}>
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    {creatorPreview ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border bg-background">
                        <Image
                          src={creatorPreview}
                          alt="Creator image preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full border bg-background flex items-center justify-center">
                        <UserCircle2 className="w-8 h-8 opacity-60" />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Optional. If you skip this, you can use your account avatar later.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-lg text-red-500 ">
                {errorMsg} yolo
              </div>
            )}
            {okMsg && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">
                {okMsg}
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setTitle("");
                  setCreator("");
                  setDescription("");
                  setTags([]);
                  setTagInput("");
                  setZipFile(null);
                  setThumbnailFile(null);
                  setCreatorImageFile(null);
                  setErrorMsg(null);
                  setOkMsg(null);
                }}
                disabled={isSubmitting}
              >
                Reset
              </Button>

              <Button type="button" onClick={submit} disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Publish"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

