-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "permission" INTEGER NOT NULL,
    "permission_name" TEXT NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Users" ("id", "permission", "permission_name") SELECT "id", "permission", "permission_name" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE TABLE "new_vagas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "salario" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_termino" DATETIME NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_vagas" ("data_inicio", "data_termino", "descricao", "id", "salario", "status", "titulo") SELECT "data_inicio", "data_termino", "descricao", "id", "salario", "status", "titulo" FROM "vagas";
DROP TABLE "vagas";
ALTER TABLE "new_vagas" RENAME TO "vagas";
CREATE TABLE "new_cursos_ensino_medio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "periodo" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_cursos_ensino_medio" ("duracao", "id", "nome", "periodo", "status") SELECT "duracao", "id", "nome", "periodo", "status" FROM "cursos_ensino_medio";
DROP TABLE "cursos_ensino_medio";
ALTER TABLE "new_cursos_ensino_medio" RENAME TO "cursos_ensino_medio";
CREATE TABLE "new_cursos_tecnicos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "periodo" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_cursos_tecnicos" ("duracao", "id", "nome", "periodo", "status") SELECT "duracao", "id", "nome", "periodo", "status" FROM "cursos_tecnicos";
DROP TABLE "cursos_tecnicos";
ALTER TABLE "new_cursos_tecnicos" RENAME TO "cursos_tecnicos";
CREATE TABLE "new_Empresas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_fantasia" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Empresas" ("celular", "cnpj", "email", "id", "nome_fantasia", "status", "telefone") SELECT "celular", "cnpj", "email", "id", "nome_fantasia", "status", "telefone" FROM "Empresas";
DROP TABLE "Empresas";
ALTER TABLE "new_Empresas" RENAME TO "Empresas";
CREATE UNIQUE INDEX "Empresas_cnpj_key" ON "Empresas"("cnpj");
CREATE TABLE "new_Alunos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "rm" INTEGER NOT NULL,
    "data_nascimento" DATETIME NOT NULL,
    "cpf" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Alunos" ("celular", "cpf", "data_nascimento", "email", "id", "nome", "rm", "status", "telefone") SELECT "celular", "cpf", "data_nascimento", "email", "id", "nome", "rm", "status", "telefone" FROM "Alunos";
DROP TABLE "Alunos";
ALTER TABLE "new_Alunos" RENAME TO "Alunos";
CREATE UNIQUE INDEX "Alunos_rm_key" ON "Alunos"("rm");
CREATE TABLE "new_Funcionarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Funcionarios" ("celular", "cpf", "email", "id", "nome", "status") SELECT "celular", "cpf", "email", "id", "nome", "status" FROM "Funcionarios";
DROP TABLE "Funcionarios";
ALTER TABLE "new_Funcionarios" RENAME TO "Funcionarios";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
