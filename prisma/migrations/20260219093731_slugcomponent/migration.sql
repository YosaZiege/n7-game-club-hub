/*
  Warnings:

  - Added the required column `slug` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "zipUrl" TEXT NOT NULL,
    "creatorImage" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "Game_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("approved", "createdAt", "creatorId", "creatorImage", "description", "id", "imageUrl", "title", "zipUrl") SELECT "approved", "createdAt", "creatorId", "creatorImage", "description", "id", "imageUrl", "title", "zipUrl" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
