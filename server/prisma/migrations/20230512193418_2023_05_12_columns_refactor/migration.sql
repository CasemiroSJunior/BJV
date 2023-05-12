/*
  Warnings:

  - You are about to drop the column `celular` on the `Empresas` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Empresas` table. All the data in the column will be lost.
  - You are about to drop the column `nome_fantasia` on the `Empresas` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Empresas` table. All the data in the column will be lost.
  - You are about to drop the column `celular` on the `Alunos` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Alunos` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Alunos` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Alunos` table. All the data in the column will be lost.
  - You are about to drop the column `celular` on the `Funcionarios` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Funcionarios` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Funcionarios` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Funcionarios` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Empresas" (
    "usersId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cnpj" TEXT NOT NULL,
    "telefone" TEXT,
    CONSTRAINT "Empresas_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Empresas" ("cnpj", "telefone", "usersId") SELECT "cnpj", "telefone", "usersId" FROM "Empresas";
DROP TABLE "Empresas";
ALTER TABLE "new_Empresas" RENAME TO "Empresas";
CREATE UNIQUE INDEX "Empresas_cnpj_key" ON "Empresas"("cnpj");
CREATE TABLE "new_Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" INTEGER NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT,
    "celular" TEXT,
    "email" TEXT,
    "foto" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Users" ("created_At", "foto", "id", "senha", "tipo", "updated_At") SELECT "created_At", "foto", "id", "senha", "tipo", "updated_At" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE TABLE "new_Alunos" (
    "usersId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rm" INTEGER NOT NULL,
    "data_nascimento" DATETIME NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT,
    "curso_tecnico_Id" INTEGER,
    "curso_ensino_medio_Id" INTEGER,
    CONSTRAINT "Alunos_curso_tecnico_Id_fkey" FOREIGN KEY ("curso_tecnico_Id") REFERENCES "cursos_tecnicos" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Alunos_curso_ensino_medio_Id_fkey" FOREIGN KEY ("curso_ensino_medio_Id") REFERENCES "cursos_ensino_medio" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Alunos_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Alunos" ("cpf", "curso_ensino_medio_Id", "curso_tecnico_Id", "data_nascimento", "rm", "telefone", "usersId") SELECT "cpf", "curso_ensino_medio_Id", "curso_tecnico_Id", "data_nascimento", "rm", "telefone", "usersId" FROM "Alunos";
DROP TABLE "Alunos";
ALTER TABLE "new_Alunos" RENAME TO "Alunos";
CREATE UNIQUE INDEX "Alunos_rm_key" ON "Alunos"("rm");
CREATE UNIQUE INDEX "Alunos_cpf_key" ON "Alunos"("cpf");
CREATE TABLE "new_Funcionarios" (
    "usersId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf" TEXT NOT NULL,
    CONSTRAINT "Funcionarios_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Funcionarios" ("cpf", "usersId") SELECT "cpf", "usersId" FROM "Funcionarios";
DROP TABLE "Funcionarios";
ALTER TABLE "new_Funcionarios" RENAME TO "Funcionarios";
CREATE UNIQUE INDEX "Funcionarios_cpf_key" ON "Funcionarios"("cpf");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
