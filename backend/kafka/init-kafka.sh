#!/bin/bash

# Wait for Kafka to be ready
echo "Waiting for Kafka to be ready..."
until kafka-topics --bootstrap-server kafka:9092 --list > /dev/null 2>&1; do
  echo "Kafka not ready, waiting 5 seconds..."
  sleep 5
done

# Create topics
echo "Creating Kafka topics..."

# User related topics
kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists --topic user-events --partitions 3 --replication-factor 1
kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists --topic user-notifications --partitions 3 --replication-factor 1

# Course related topics
kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists --topic course-events --partitions 3 --replication-factor 1
kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists --topic enrollment-events --partitions 3 --replication-factor 1

# Video related topics
kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists --topic video-events --partitions 3 --replication-factor 1
kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists --topic video-progress --partitions 3 --replication-factor 1

# Analytics topics
kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists --topic user-activity --partitions 3 --replication-factor 1
kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists --topic platform-metrics --partitions 3 --replication-factor 1

echo "Topics created successfully!"

# List all topics
echo "Available topics:"
kafka-topics --bootstrap-server kafka:9092 --list 