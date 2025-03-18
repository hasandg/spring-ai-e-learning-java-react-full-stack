# Kafka with KRaft Mode for E-Learning Platform

This directory contains the configuration for running Apache Kafka in KRaft mode (without ZooKeeper) for the e-learning platform.

## What is KRaft Mode?

KRaft (Kafka Raft) is a consensus protocol that eliminates the need for ZooKeeper in Kafka. This simplifies the architecture, improves performance, and reduces operational complexity.

Key benefits:
- Simplified architecture (no need for ZooKeeper)
- Better scalability
- Reduced operational complexity
- Improved security
- Better failure handling

## Directory Structure

- `docker-compose.yml` - Docker Compose configuration for running Kafka in KRaft mode
- `init-kafka.sh` - Script to initialize Kafka topics
- `kafka-config.properties` - Default Kafka configuration for Spring Boot services
- `README.md` - This file

## Usage

### Starting Kafka

From the e-learning-platform root directory:

```bash
cd backend
docker-compose up -d kafka kafka-ui
```

### Accessing Kafka UI

The Kafka UI is available at: http://localhost:8090

### Topics

The following topics are automatically created:

#### User-related Topics
- `user-events` - Events related to user actions
- `user-notifications` - Notifications to be sent to users

#### Course-related Topics
- `course-events` - Events related to course changes (create, update, delete)
- `enrollment-events` - Events related to course enrollments

#### Video-related Topics
- `video-events` - Events related to video changes
- `video-progress` - Events related to user progress in videos

#### Analytics Topics
- `user-activity` - User activity events for analytics
- `platform-metrics` - Platform-wide metrics

## Integration with Spring Boot Services

To use Kafka in your service:

1. Add the Kafka dependency to your service's `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

2. Use the shared `KafkaConfig` class from the common-lib or configure Kafka in your `application.properties`:

```properties
# Producer config
spring.kafka.producer.bootstrap-servers=kafka:29092
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer

# Consumer config
spring.kafka.consumer.bootstrap-servers=kafka:29092
spring.kafka.consumer.group-id=${spring.application.name}-group
spring.kafka.consumer.auto-offset-reset=earliest
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.springframework.kafka.support.serializer.JsonDeserializer
spring.kafka.consumer.properties.spring.json.trusted.packages=*
```

3. Create a producer:

```java
@Service
public class MyEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public MyEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    
    public void publishEvent(String key, MyEvent event) {
        kafkaTemplate.send("my-topic", key, event);
    }
}
```

4. Create a consumer:

```java
@Service
public class MyEventConsumer {
    @KafkaListener(topics = "my-topic", groupId = "my-service-group")
    public void consume(MyEvent event) {
        // Process the event
    }
}
```

## Troubleshooting

If you encounter issues with Kafka:

1. Check Kafka's logs:
```bash
docker logs kafka
```

2. Verify Kafka is running:
```bash
docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --list
```

3. Verify topic creation:
```bash
docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --describe --topic course-events
``` 