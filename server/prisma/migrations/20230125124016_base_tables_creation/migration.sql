-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "permission" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Alunos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "rm" INTEGER NOT NULL,
    "data_nascimento" DATETIME NOT NULL,
    "cpf" INTEGER NOT NULL,
    "celular" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Funcionarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" INTEGER NOT NULL,
    "celular" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Empresas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_fantasia" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "cursos_tecnicos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "periodo" TEXT NOT NULL,
    "status" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "cursos_ensino_medio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "periodo" TEXT NOT NULL,
    "status" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Alunos_id_key" ON "Alunos"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionarios_id_key" ON "Funcionarios"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Empresas_id_key" ON "Empresas"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Empresas_cnpj_key" ON "Empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_tecnicos_id_key" ON "cursos_tecnicos"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_ensino_medio_id_key" ON "cursos_ensino_medio"("id");
