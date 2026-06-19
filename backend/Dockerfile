# Build the Spring Boot jar inside the image so we do not depend on a local target/ artifact.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/target/backend-0.0.1-SNAPSHOT.jar ./backend.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "backend.jar"]