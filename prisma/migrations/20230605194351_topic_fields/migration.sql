/*
  Warnings:

  - Added the required column `fieldTitle` to the `MqttFields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fieldUnits` to the `MqttFields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keyField` to the `MqttFields` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MqttFields" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keyField" TEXT NOT NULL,
    "fieldTitle" TEXT NOT NULL,
    "fieldUnits" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    CONSTRAINT "MqttFields_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "MqttTopic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MqttFields" ("id", "topicId") SELECT "id", "topicId" FROM "MqttFields";
DROP TABLE "MqttFields";
ALTER TABLE "new_MqttFields" RENAME TO "MqttFields";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
