FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
ENV MAVEN_OPTS="-Xmx512m -XX:MaxMetaspaceSize=256m"
RUN mvn clean package -DskipTests

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/*.jar"]