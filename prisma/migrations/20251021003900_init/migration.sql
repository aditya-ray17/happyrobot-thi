-- CreateTable
CREATE TABLE "Load" (
    "id" SERIAL NOT NULL,
    "load_id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "pickup_datetime" TIMESTAMP(3) NOT NULL,
    "delivery_datetime" TIMESTAMP(3) NOT NULL,
    "equipment_type" TEXT NOT NULL,
    "loadboard_rate" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "weight" DOUBLE PRECISION NOT NULL,
    "commodity_type" TEXT NOT NULL,
    "num_of_pieces" INTEGER NOT NULL,
    "miles" DOUBLE PRECISION NOT NULL,
    "dimensions" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Load_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallRecord" (
    "id" SERIAL NOT NULL,
    "call_id" TEXT NOT NULL,
    "mc_number" TEXT NOT NULL,
    "carrier_name" TEXT,
    "transcript" TEXT,
    "classification" TEXT,
    "sentiment" TEXT,
    "negotiated_price" DOUBLE PRECISION,
    "loadboard_rate" DOUBLE PRECISION,
    "load_id" TEXT,
    "duration" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extracted_data" JSONB,

    CONSTRAINT "CallRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Load_load_id_key" ON "Load"("load_id");

-- CreateIndex
CREATE UNIQUE INDEX "CallRecord_call_id_key" ON "CallRecord"("call_id");

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_load_id_fkey" FOREIGN KEY ("load_id") REFERENCES "Load"("load_id") ON DELETE SET NULL ON UPDATE CASCADE;
