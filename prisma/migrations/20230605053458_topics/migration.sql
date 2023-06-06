-- CreateTable
CREATE TABLE "MqttTopic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topic" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MqttFields" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    CONSTRAINT "MqttFields_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "MqttTopic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MqttFields_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "MqttTopic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MqttFields_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "MqttTopic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MqttTopic_topic_key" ON "MqttTopic"("topic");

-- CreateIndex
CREATE INDEX "MqttTopic_topic_idx" ON "MqttTopic"("topic");
