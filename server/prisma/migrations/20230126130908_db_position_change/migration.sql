/*
  Warnings:

  - You are about to alter the column `status` on the `Empresas` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `cursos_ensino_medioId` on the `Alunos` table. All the data in the column will be lost.
  - You are about to drop the column `cursos_tecnicosId` on the `Alunos` table. All the data in the column will be lost.
  - Added the required column `curso_tecnico_Id` to the `Alunos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Empresas" (
    "usersId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_fantasia" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "celular" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Empresas_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Empresas" ("celular", "cnpj", "created_At", "email", "nome_fantasia", "status", "telefone", "updated_At", "usersId") SELECT "celular", "cnpj", "created_At", "email", "nome_fantasia", "status", "telefone", "updated_At", "usersId" FROM "Empresas";
DROP TABLE "Empresas";
ALTER TABLE "new_Empresas" RENAME TO "Empresas";
CREATE UNIQUE INDEX "Empresas_cnpj_key" ON "Empresas"("cnpj");
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
    "curso_tecnico_Id" INTEGER NOT NULL,
    "curso_ensino_medio_Id" INTEGER,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Alunos_curso_tecnico_Id_fkey" FOREIGN KEY ("curso_tecnico_Id") REFERENCES "cursos_tecnicos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Alunos_curso_ensino_medio_Id_fkey" FOREIGN KEY ("curso_ensino_medio_Id") REFERENCES "cursos_ensino_medio" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Alunos_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Alunos" ("celular", "cpf", "created_At", "data_nascimento", "email", "nome", "rm", "status", "telefone", "updated_At", "usersId") SELECT "celular", "cpf", "created_At", "data_nascimento", "email", "nome", "rm", "status", "telefone", "updated_At", "usersId" FROM "Alunos";
DROP TABLE "Alunos";
ALTER TABLE "new_Alunos" RENAME TO "Alunos";
CREATE UNIQUE INDEX "Alunos_rm_key" ON "Alunos"("rm");
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
CREATE TABLE "new_cursos_tecnicos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "duracao" INTEGER,
    "periodo" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_cursos_tecnicos" ("duracao", "id", "nome", "periodo", "status") SELECT "duracao", "id", "nome", "periodo", "status" FROM "cursos_tecnicos";
DROP TABLE "cursos_tecnicos";
ALTER TABLE "new_cursos_tecnicos" RENAME TO "cursos_tecnicos";
CREATE TABLE "new_vagas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "salario" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "empresasUsersId" INTEGER,
    "data_inicio" DATETIME NOT NULL,
    "data_termino" DATETIME NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vagas_empresasUsersId_fkey" FOREIGN KEY ("empresasUsersId") REFERENCES "Empresas" ("usersId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_vagas" ("created_At", "data_inicio", "data_termino", "descricao", "empresasUsersId", "id", "salario", "status", "titulo", "updated_At") SELECT "created_At", "data_inicio", "data_termino", "descricao", "empresasUsersId", "id", "salario", "status", "titulo", "updated_At" FROM "vagas";
DROP TABLE "vagas";
ALTER TABLE "new_vagas" RENAME TO "vagas";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
