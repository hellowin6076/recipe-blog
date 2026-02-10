-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "category" TEXT,
ADD COLUMN     "difficulty" INTEGER NOT NULL DEFAULT 3;
