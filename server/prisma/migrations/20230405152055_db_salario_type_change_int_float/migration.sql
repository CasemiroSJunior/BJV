/*
  Warnings:

  - You are about to alter the column `salario` on the `vagas` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vagas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "salario" REAL,
    "tipo" INTEGER NOT NULL DEFAULT 0,
    "remunerado" INTEGER NOT NULL DEFAULT 0,
    "confidencial_nome" INTEGER NOT NULL DEFAULT 0,
    "confidencial_salario" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "empresasUsersId" INTEGER,
    "data_inicio" DATETIME NOT NULL,
    "data_termino" DATETIME NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vagas_empresasUsersId_fkey" FOREIGN KEY ("empresasUsersId") REFERENCES "Empresas" ("usersId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_vagas" ("confidencial_nome", "confidencial_salario", "created_At", "data_inicio", "data_termino", "descricao", "empresasUsersId", "id", "remunerado", "salario", "status", "tipo", "titulo", "updated_At") SELECT "confidencial_nome", "confidencial_salario", "created_At", "data_inicio", "data_termino", "descricao", "empresasUsersId", "id", "remunerado", "salario", "status", "tipo", "titulo", "updated_At" FROM "vagas";
DROP TABLE "vagas";
ALTER TABLE "new_vagas" RENAME TO "vagas";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
