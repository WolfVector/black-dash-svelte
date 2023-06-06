-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MqttFields" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keyField" TEXT NOT NULL,
    "fieldTitle" TEXT NOT NULL,
    "fieldUnits" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    CONSTRAINT "MqttFields_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "MqttTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MqttFields" ("fieldTitle", "fieldUnits", "id", "keyField", "topicId") SELECT "fieldTitle", "fieldUnits", "id", "keyField", "topicId" FROM "MqttFields";
DROP TABLE "MqttFields";
ALTER TABLE "new_MqttFields" RENAME TO "MqttFields";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
