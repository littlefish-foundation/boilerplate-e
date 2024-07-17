-- CreateTable
CREATE TABLE "ADAHandle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "handleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ADAHandle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ADAHandle_handleId_key" ON "ADAHandle"("handleId");

-- AddForeignKey
ALTER TABLE "ADAHandle" ADD CONSTRAINT "ADAHandle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
