# Build the application
FROM --platform=linux/amd64 maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the JAR file
RUN mvn clean package -DskipTests

# Run the application
FROM --platform=linux/amd64 openjdk:17-jdk-slim
WORKDIR /app

# Copy the JAR from the build stage to the current stage

COPY --from=build /app/target/*.jar app.jar

# Expose the port
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]