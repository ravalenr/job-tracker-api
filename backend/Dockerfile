# Build the application using Maven
FROM --platform=linux/amd64 maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only the pom.xml first to leverage Docker layer caching
COPY pom.xml .

# Copy the source code
COPY src ./src

# Build the JAR file
RUN mvn clean package -DskipTests

# Run the application
FROM --platform=linux/amd64 eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the JAR from the build stage

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]