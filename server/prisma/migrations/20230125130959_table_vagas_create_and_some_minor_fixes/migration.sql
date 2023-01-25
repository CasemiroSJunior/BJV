/*
  Warnings:

  - Added the required column `permission_name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Empresas_id_key";

-- DropIndex
DROP INDEX "cursos_ensino_medio_id_key";

-- DropIndex
DROP INDEX "cursos_tecnicos_id_key";

-- CreateTable
CREATE TABLE "vagas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "salario" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_termino" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Funcionarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Funcionarios" ("celular", "cpf", "email", "id", "nome", "status") SELECT "celular", "cpf", "email", "id", "nome", "status" FROM "Funcionarios";
DROP TABLE "Funcionarios";
ALTER TABLE "new_Funcionarios" RENAME TO "Funcionarios";
CREATE TABLE "new_Alunos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "rm" INTEGER NOT NULL,
    "data_nascimento" DATETIME NOT NULL,
    "cpf" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Alunos" ("celular", "cpf", "data_nascimento", "email", "id", "nome", "rm", "status", "telefone") SELECT "celular", "cpf", "data_nascimento", "email", "id", "nome", "rm", "status", "telefone" FROM "Alunos";
DROP TABLE "Alunos";
ALTER TABLE "new_Alunos" RENAME TO "Alunos";
CREATE UNIQUE INDEX "Alunos_rm_key" ON "Alunos"("rm");
CREATE TABLE "new_Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "permission" INTEGER NOT NULL,
    "permission_name" TEXT NOT NULL
);
INSERT INTO "new_Users" ("id", "permission") SELECT "id", "permission" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
