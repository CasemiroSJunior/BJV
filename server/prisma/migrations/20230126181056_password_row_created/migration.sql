/*
  Warnings:

  - You are about to drop the column `created_At` on the `Alunos` table. All the data in the column will be lost.
  - You are about to drop the column `updated_At` on the `Alunos` table. All the data in the column will be lost.
  - You are about to drop the column `created_At` on the `Empresas` table. All the data in the column will be lost.
  - You are about to drop the column `updated_At` on the `Empresas` table. All the data in the column will be lost.
  - You are about to drop the column `created_At` on the `Funcionarios` table. All the data in the column will be lost.
  - You are about to drop the column `updated_At` on the `Funcionarios` table. All the data in the column will be lost.
  - Added the required column `senha` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cursos_ensino_medio" ADD COLUMN "foto" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" INTEGER NOT NULL,
    "senha" TEXT NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Users" ("created_At", "id", "tipo", "updated_At") SELECT "created_At", "id", "tipo", "updated_At" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE TABLE "new_Alunos" (
    "usersId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "rm" INTEGER NOT NULL,
    "data_nascimento" DATETIME NOT NULL,
    "cpf" TEXT NOT NULL,
    "celular" TEXT,
    "telefone" TEXT,
    "email" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "curso_tecnico_Id" INTEGER,
    "curso_ensino_medio_Id" INTEGER,
    CONSTRAINT "Alunos_curso_tecnico_Id_fkey" FOREIGN KEY ("curso_tecnico_Id") REFERENCES "cursos_tecnicos" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Alunos_curso_ensino_medio_Id_fkey" FOREIGN KEY ("curso_ensino_medio_Id") REFERENCES "cursos_ensino_medio" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Alunos_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Alunos" ("celular", "cpf", "curso_ensino_medio_Id", "curso_tecnico_Id", "data_nascimento", "email", "nome", "rm", "status", "telefone", "usersId") SELECT "celular", "cpf", "curso_ensino_medio_Id", "curso_tecnico_Id", "data_nascimento", "email", "nome", "rm", "status", "telefone", "usersId" FROM "Alunos";
DROP TABLE "Alunos";
ALTER TABLE "new_Alunos" RENAME TO "Alunos";
CREATE UNIQUE INDEX "Alunos_rm_key" ON "Alunos"("rm");
CREATE UNIQUE INDEX "Alunos_cpf_key" ON "Alunos"("cpf");
CREATE TABLE "new_Empresas" (
    "usersId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_fantasia" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "celular" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Empresas_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Empresas" ("celular", "cnpj", "email", "nome_fantasia", "status", "telefone", "usersId") SELECT "celular", "cnpj", "email", "nome_fantasia", "status", "telefone", "usersId" FROM "Empresas";
DROP TABLE "Empresas";
ALTER TABLE "new_Empresas" RENAME TO "Empresas";
CREATE UNIQUE INDEX "Empresas_cnpj_key" ON "Empresas"("cnpj");
CREATE TABLE "new_Funcionarios" (
    "usersId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "celular" TEXT,
    "email" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Funcionarios_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Funcionarios" ("celular", "cpf", "email", "nome", "status", "usersId") SELECT "celular", "cpf", "email", "nome", "status", "usersId" FROM "Funcionarios";
DROP TABLE "Funcionarios";
ALTER TABLE "new_Funcionarios" RENAME TO "Funcionarios";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
