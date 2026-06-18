FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine AS runtime
RUN addgroup -S invoicely && adduser -S invoicely -G invoicely
WORKDIR /app
COPY --from=build --chown=invoicely:invoicely /app/target/*.jar app.jar
COPY --chown=invoicely:invoicely entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh
USER invoicely
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8081/actuator/health || exit 1
ENTRYPOINT ["./entrypoint.sh"]
