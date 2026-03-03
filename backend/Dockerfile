# STAGE 1: Build the application using Maven
FROM --platform=linux/amd64 maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# LIMIT MAVEN MEMORY USAGE
ENV MAVEN_OPTS="-Xmx512m -XX:MaxMetaspaceSize=256m"

# Build the JAR file
RUN mvn clean package -DskipTests

# STAGE 2: Run the application
FROM --platform=linux/amd64 eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]