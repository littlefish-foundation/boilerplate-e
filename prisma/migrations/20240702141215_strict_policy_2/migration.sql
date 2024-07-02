-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "strictPolicy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
