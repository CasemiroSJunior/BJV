/*
  Warnings:

  - The primary key for the `Alunos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Alunos` table. All the data in the column will be lost.
  - The primary key for the `Funcionarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Funcionarios` table. All the data in the column will be lost.
  - You are about to drop the column `permission` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `permission_name` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `created_At` on the `cursos_tecnicos` table. All the data in the column will be lost.
  - You are about to drop the column `updated_At` on the `cursos_tecnicos` table. All the data in the column will be lost.
  - You are about to drop the column `created_At` on the `cursos_ensino_medio` table. All the data in the column will be lost.
  - You are about to drop the column `updated_At` on the `cursos_ensino_medio` table. All the data in the column will be lost.
  - The primary key for the `Empresas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Empresas` table. All the data in the column will be lost.
  - Added the required column `cursos_ensino_medioId` to the `Alunos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cursos_tecnicosId` to the `Alunos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersId` to the `Alunos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersId` to the `Funcionarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersId` to the `Empresas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "inscricoes_vaga" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usersId" INTEGER NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vagasId" INTEGER NOT NULL,
    CONSTRAINT "inscricoes_vaga_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inscricoes_vaga_vagasId_fkey" FOREIGN KEY ("vagasId") REFERENCES "vagas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "cursos_tecnicosId" INTEGER NOT NULL,
    "cursos_ensino_medioId" INTEGER NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Alunos_cursos_tecnicosId_fkey" FOREIGN KEY ("cursos_tecnicosId") REFERENCES "cursos_tecnicos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Alunos_cursos_ensino_medioId_fkey" FOREIGN KEY ("cursos_ensino_medioId") REFERENCES "cursos_ensino_medio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Alunos_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Alunos" ("celular", "cpf", "created_At", "data_nascimento", "email", "nome", "rm", "status", "telefone", "updated_At") SELECT "celular", "cpf", "created_At", "data_nascimento", "email", "nome", "rm", "status", "telefone", "updated_At" FROM "Alunos";
DROP TABLE "Alunos";
ALTER TABLE "new_Alunos" RENAME TO "Alunos";
CREATE UNIQUE INDEX "Alunos_rm_key" ON "Alunos"("rm");
CREATE TABLE "new_Funcionarios" (
    "usersId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "celular" TEXT,
    "email" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Funcionarios_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Funcionarios" ("celular", "cpf", "created_At", "email", "nome", "status", "updated_At") SELECT "celular", "cpf", "created_At", "email", "nome", "status", "updated_At" FROM "Funcionarios";
DROP TABLE "Funcionarios";
ALTER TABLE "new_Funcionarios" RENAME TO "Funcionarios";
CREATE TABLE "new_Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" INTEGER NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Users" ("created_At", "id", "updated_At") SELECT "created_At", "id", "updated_At" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE TABLE "new_cursos_tecnicos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "duracao" INTEGER,
    "periodo" TEXT,
    "status" INTEGER NOT NULL
);
INSERT INTO "new_cursos_tecnicos" ("duracao", "id", "nome", "periodo", "status") SELECT "duracao", "id", "nome", "periodo", "status" FROM "cursos_tecnicos";
DROP TABLE "cursos_tecnicos";
ALTER TABLE "new_cursos_tecnicos" RENAME TO "cursos_tecnicos";
CREATE TABLE "new_cursos_ensino_medio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "duracao" INTEGER,
    "periodo" TEXT,
    "status" INTEGER NOT NULL
);
INSERT INTO "new_cursos_ensino_medio" ("duracao", "id", "nome", "periodo", "status") SELECT "duracao", "id", "nome", "periodo", "status" FROM "cursos_ensino_medio";
DROP TABLE "cursos_ensino_medio";
ALTER TABLE "new_cursos_ensino_medio" RENAME TO "cursos_ensino_medio";
CREATE TABLE "new_Empresas" (
    "usersId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_fantasia" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "celular" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Empresas_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Empresas" ("celular", "cnpj", "created_At", "email", "nome_fantasia", "status", "telefone", "updated_At") SELECT "celular", "cnpj", "created_At", "email", "nome_fantasia", "status", "telefone", "updated_At" FROM "Empresas";
DROP TABLE "Empresas";
ALTER TABLE "new_Empresas" RENAME TO "Empresas";
CREATE UNIQUE INDEX "Empresas_cnpj_key" ON "Empresas"("cnpj");
CREATE TABLE "new_vagas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "salario" INTEGER,
    "status" INTEGER NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_termino" DATETIME NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresasUsersId" INTEGER,
    CONSTRAINT "vagas_empresasUsersId_fkey" FOREIGN KEY ("empresasUsersId") REFERENCES "Empresas" ("usersId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_vagas" ("created_At", "data_inicio", "data_termino", "descricao", "id", "salario", "status", "titulo", "updated_At") SELECT "created_At", "data_inicio", "data_termino", "descricao", "id", "salario", "status", "titulo", "updated_At" FROM "vagas";
DROP TABLE "vagas";
ALTER TABLE "new_vagas" RENAME TO "vagas";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "inscricoes_vaga_usersId_vagasId_key" ON "inscricoes_vaga"("usersId", "vagasId");
