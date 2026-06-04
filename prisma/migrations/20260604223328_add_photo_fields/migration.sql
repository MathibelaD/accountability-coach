-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProgressPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'update',
    "caption" TEXT,
    "shared" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProgressPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProgressPhoto_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProgressPhoto" ("challengeId", "id", "imageUrl", "uploadedAt", "userId") SELECT "challengeId", "id", "imageUrl", "uploadedAt", "userId" FROM "ProgressPhoto";
DROP TABLE "ProgressPhoto";
ALTER TABLE "new_ProgressPhoto" RENAME TO "ProgressPhoto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
