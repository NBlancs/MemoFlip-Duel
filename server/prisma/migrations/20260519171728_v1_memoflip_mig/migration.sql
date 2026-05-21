-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchSession" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "moves" INTEGER NOT NULL,
    "elapsedSeconds" INTEGER NOT NULL,
    "gridRows" INTEGER NOT NULL,
    "gridCols" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");

-- CreateIndex
CREATE INDEX "MatchSession_playerId_difficulty_idx" ON "MatchSession"("playerId", "difficulty");

-- CreateIndex
CREATE INDEX "MatchSession_difficulty_elapsedSeconds_idx" ON "MatchSession"("difficulty", "elapsedSeconds");

-- CreateIndex
CREATE INDEX "MatchSession_difficulty_moves_idx" ON "MatchSession"("difficulty", "moves");

-- AddForeignKey
ALTER TABLE "MatchSession" ADD CONSTRAINT "MatchSession_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
