-- CreateEnum
CREATE TYPE "roles" AS ENUM ('admin', 'manager', 'staff');

-- CreateEnum
CREATE TYPE "notifStatus" AS ENUM ('read', 'unread');

-- CreateEnum
CREATE TYPE "archiveTab" AS ENUM ('user', 'expFolder', 'category', 'item');

-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "roles" NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "archive" (
    "archiveID" TEXT NOT NULL,
    "archive" BOOLEAN NOT NULL,
    "tab" "archiveTab" NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,
    "expFolderID" TEXT,
    "categoryID" TEXT,
    "itemsiD" TEXT,

    CONSTRAINT "archive_pkey" PRIMARY KEY ("archiveID")
);

-- CreateTable
CREATE TABLE "notification" (
    "notificationID" TEXT NOT NULL,
    "notification" TEXT NOT NULL,
    "notifStatus" "notifStatus" NOT NULL DEFAULT 'unread',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("notificationID")
);

-- CreateTable
CREATE TABLE "expFolder" (
    "expFolderID" TEXT NOT NULL,
    "exFolder" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "expFolder_pkey" PRIMARY KEY ("expFolderID")
);

-- CreateTable
CREATE TABLE "expense" (
    "expenseID" TEXT NOT NULL,
    "expense" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "mod" TEXT NOT NULL,
    "payDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expFolderID" TEXT,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("expenseID")
);

-- CreateTable
CREATE TABLE "salary" (
    "salaryID" TEXT NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "salary_pkey" PRIMARY KEY ("salaryID")
);

-- CreateTable
CREATE TABLE "Profile" (
    "profileID" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birthday" DATE NOT NULL,
    "userID" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profileID")
);

-- CreateTable
CREATE TABLE "category" (
    "categoryID" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("categoryID")
);

-- CreateTable
CREATE TABLE "items" (
    "itemsID" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "dosage" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("itemsID")
);

-- CreateTable
CREATE TABLE "storeInfo" (
    "storeinfoID" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expiredDate" DATE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemsID" TEXT,

    CONSTRAINT "storeInfo_pkey" PRIMARY KEY ("storeinfoID")
);

-- CreateTable
CREATE TABLE "OrederListitem" (
    "orderListItemID" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderID" TEXT,

    CONSTRAINT "OrederListitem_pkey" PRIMARY KEY ("orderListItemID")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderID" TEXT NOT NULL,
    "order" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderID")
);

-- CreateTable
CREATE TABLE "logs" (
    "logsID" TEXT NOT NULL,
    "logs" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" TEXT,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("logsID")
);

-- CreateTable
CREATE TABLE "_categoryToitems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrederListitemToitems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "salary_userID_key" ON "salary"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userID_key" ON "Profile"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "storeInfo_itemsID_key" ON "storeInfo"("itemsID");

-- CreateIndex
CREATE UNIQUE INDEX "_categoryToitems_AB_unique" ON "_categoryToitems"("A", "B");

-- CreateIndex
CREATE INDEX "_categoryToitems_B_index" ON "_categoryToitems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrederListitemToitems_AB_unique" ON "_OrederListitemToitems"("A", "B");

-- CreateIndex
CREATE INDEX "_OrederListitemToitems_B_index" ON "_OrederListitemToitems"("B");

-- AddForeignKey
ALTER TABLE "archive" ADD CONSTRAINT "archive_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive" ADD CONSTRAINT "archive_expFolderID_fkey" FOREIGN KEY ("expFolderID") REFERENCES "expFolder"("expFolderID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive" ADD CONSTRAINT "archive_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "category"("categoryID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive" ADD CONSTRAINT "archive_itemsiD_fkey" FOREIGN KEY ("itemsiD") REFERENCES "items"("itemsID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expFolder" ADD CONSTRAINT "expFolder_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_expFolderID_fkey" FOREIGN KEY ("expFolderID") REFERENCES "expFolder"("expFolderID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary" ADD CONSTRAINT "salary_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storeInfo" ADD CONSTRAINT "storeInfo_itemsID_fkey" FOREIGN KEY ("itemsID") REFERENCES "items"("itemsID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrederListitem" ADD CONSTRAINT "OrederListitem_orderID_fkey" FOREIGN KEY ("orderID") REFERENCES "Order"("orderID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_categoryToitems" ADD CONSTRAINT "_categoryToitems_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("categoryID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_categoryToitems" ADD CONSTRAINT "_categoryToitems_B_fkey" FOREIGN KEY ("B") REFERENCES "items"("itemsID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrederListitemToitems" ADD CONSTRAINT "_OrederListitemToitems_A_fkey" FOREIGN KEY ("A") REFERENCES "OrederListitem"("orderListItemID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrederListitemToitems" ADD CONSTRAINT "_OrederListitemToitems_B_fkey" FOREIGN KEY ("B") REFERENCES "items"("itemsID") ON DELETE CASCADE ON UPDATE CASCADE;
