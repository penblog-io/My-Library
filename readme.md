# My Library
This app is just a demonstration on how to use ExpressJS and PassportJS to build microservices
that implement OAuth2 authorization flow.

## Docker
This demo app requires Docker and Docker Compose installed on your computer.

## Build
Build NodeJS image:
```
docker build -t my-library .
```

## Run
After you have built all necessary images for the application, you can start running
by using following command:
```
docker-compose up -d
```

## Access Swagger UI
```
http://localhost:3005/api-docs
```

## Development
For development, you may want to run node cli on "server" app, you can use
the following command to connect to the container:
```
docker exec -it my-library bash
```