# 1. 빌드 스테이지
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app
COPY . .
# gradlew에 실행 권한 부여 및 빌드 (테스트 생략)
RUN chmod +x ./gradlew
RUN ./gradlew clean build -x test

# 2. 실행 스테이지
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# 빌드된 jar 파일을 복사
COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]