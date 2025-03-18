FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp

# Copy the pre-built jar file
COPY target/*.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8084/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java","-jar","/app.jar"] 