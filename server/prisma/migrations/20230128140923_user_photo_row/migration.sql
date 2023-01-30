/*
  Warnings:

  - You are about to drop the column `foto` on the `cursos_ensino_medio` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Funcionarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN "foto" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cursos_ensino_medio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "duracao" INTEGER,
    "periodo" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_cursos_ensino_medio" ("duracao", "id", "nome", "periodo", "status") SELECT "duracao", "id", "nome", "periodo", "status" FROM "cursos_ensino_medio";
DROP TABLE "cursos_ensino_medio";
ALTER TABLE "new_cursos_ensino_medio" RENAME TO "cursos_ensino_medio";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Funcionarios_cpf_key" ON "Funcionarios"("cpf");
