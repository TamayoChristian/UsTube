FROM openjdk:17-jdk-alpine

EXPOSE 8080

WORKDIR /root

COPY ./pom.xml /root/
COPY ./.mvn /root/.mvn
COPY ./mvnw /root

RUN ./mvnw dependency:go-offline
COPY ./src /root/src

RUN ./mvnw clean install -DskipTests

ENTRYPOINT [ "java", "-jar", "/root/target/USTUBE-0.0.1-SNAPSHOT.jar" ]
