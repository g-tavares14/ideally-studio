-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('DECORACAO', 'MESA', 'UTILITARIO');

-- CreateTable
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "precoCent" INTEGER NOT NULL,
    "altura" TEXT NOT NULL,
    "prazo" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materiais" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "deltaCent" INTEGER NOT NULL,
    "rough" DOUBLE PRECISION NOT NULL,
    "metal" DOUBLE PRECISION NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "materiais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "hex" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "cores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tamanhos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cm" TEXT NOT NULL,
    "mult" DOUBLE PRECISION NOT NULL,
    "fator" DOUBLE PRECISION NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "tamanhos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "produtos_ordem_key" ON "produtos"("ordem");

-- CreateIndex
CREATE UNIQUE INDEX "materiais_ordem_key" ON "materiais"("ordem");

-- CreateIndex
CREATE UNIQUE INDEX "cores_ordem_key" ON "cores"("ordem");

-- CreateIndex
CREATE UNIQUE INDEX "tamanhos_ordem_key" ON "tamanhos"("ordem");
