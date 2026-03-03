# STAGE 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

# Keep the memory limit to prevent Railway from crashing the build!
ENV MAVEN_OPTS="-Xmx512m -XX:MaxMetaspaceSize=256m"

RUN mvn clean package -DskipTests

# STAGE 2: Run the application
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]