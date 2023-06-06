/*
  Warnings:

  - Added the required column `title` to the `MqttTopic` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MqttTopic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MqttTopic" ("createdAt", "id", "topic", "updatedAt") SELECT "createdAt", "id", "topic", "updatedAt" FROM "MqttTopic";
DROP TABLE "MqttTopic";
ALTER TABLE "new_MqttTopic" RENAME TO "MqttTopic";
CREATE UNIQUE INDEX "MqttTopic_topic_key" ON "MqttTopic"("topic");
CREATE INDEX "MqttTopic_topic_idx" ON "MqttTopic"("topic");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
