-- CreateTable
CREATE TABLE "MqttConnector" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "portType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MqttConnector_url_key" ON "MqttConnector"("url");

-- CreateIndex
CREATE INDEX "MqttConnector_url_idx" ON "MqttConnector"("url");
