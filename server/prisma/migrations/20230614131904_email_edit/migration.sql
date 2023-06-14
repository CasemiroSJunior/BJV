/*
  Warnings:

  - Made the column `email` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" INTEGER NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT,
    "celular" TEXT,
    "email" TEXT NOT NULL,
    "foto" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Users" ("celular", "created_At", "email", "foto", "id", "nome", "senha", "status", "tipo", "updated_At") SELECT "celular", "created_At", "email", "foto", "id", "nome", "senha", "status", "tipo", "updated_At" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
