# MusicStore
Repository for Music Store application in Spring and React

## Creator
Marek Kopania

## Requirements
You need Java 17 JDK and Maven to run the backend applications \
You need Node to run the frontend application

## Local setup
To run the project locally you will need to setup three docker containers, to which the backend services will connect.
First run these commands to create PostgreSQL database
1. `docker pull postgres`
2. `docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=lapunia2121 -d postgres`

Secondly run these commands to create MySQL database
1. `docker pull mysql`
2. `$ docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=lapunia2121 -d mysql`

Thirdly run these commands to create Azurite Blob Storage Emulator
1. `docker pull mcr.microsoft.com/azure-storage/azurite`
2. `docker run -p 10000:10000 mcr.microsoft.com/azure-storage/azurite azurite-blob --blobHost 0.0.0.0`

## Important requirements for testing the backend microservices
You are required to have the Azurite docker container running during the testing.
The tests written for the azure-service microservice are integration tests
and they require a connection to blob storage provided by Azurite.

## Installing and running tests

In order to install the backend project, or generate Maven site it is required that the Azurite Docker container is running. \
To install the entire backend project or generate sites you need to be in the folder <project_root>/Backend/musicstore-backend \
From there you can run this command to generate maven sites: `mvn clean verify site site:stage`. It will run the tests as well. \
To access the layered report you need to open the index.html file inside the directory '<project_root>/Backend/musicstore-backend/target/staging' 

To install the frontend project navigate to '<project_root>/Frontend/musicstore-frontend/' \
Next run the following command `npm install` \
To run the application run the following command `npm run dev` 

## Changing local properties of backend applications
The backend applications' properties files are located in the config-server resources folder. \
To change the previously set database connections or any other settings edit the 'yml' files for the default spring profile.

## Credentials for databases
### Local

Mysql: \
    Username: root \
    Password: lapunia2121 
    
PostgreSQL: \
    Username: postgres \
    Password: lapunia2121
    
### Kubernetes

Mysql: \
    Username: root \
    Password: admin
    
PostgreSQL: \
    Username: admin \
    Password: admin

## Additional setup of databases

This is only required for running application locally

1. Connect to MySQL database - Username: root; Password: lapunia2121
2. Run the following commands to create databases:

    `CREATE DATABASE shoppingcarts`\
    `CREATE DATABASE orders`\
    `CREATE DATABASE products`
   
## Gaining admin account

To gain admin priviledges in the application you need to act as a DBA.\
First you can register an account through the application GUI and enable you account via the activation email.\
Next, connect to the PostgreSQL database.\
Run the command `SELECT * FROM users` to check your record 'id'\
Finally run this command `UPDATE users SET user_role='ADMIN' WHERE id=<your_id>`

## Kubernetes setup

The container images required to run kubernetes cluster are already in the Docker Hub\
repositories. You will need a kubernetes cluster running locally.\
\
To create deployments follow these steps:
1. Navigate to <project_root>/Backend/musicstore-backend/kubernetes/infra
2. Run - `kubectl apply -f ./`
3. Navigate to <project_root>/Backend/musicstore-backend/kubernetes/services
4. Run `kubectl apply -f ./`

### Port forwarding

The following port forwarding rules are mandatory
1. frontend must be forwarded to port 4000:80
2. api-gateway must be forwarded to port 8222:80
3. grafana must be forwarded to port 3000:3000

It is advised to forward postgresql to port 5432:5432.
This way you will be able to connect to the database and give yourself admin permissions,
according to the steps described in 'Gaining admin account' section.

### Accessing the applications

To access the GUI (frontend) open the following URL in the browser: http://localhost:4000 

To access the API Gateway admin endpoints open the following URLs in the browser
1. http://localhost:8222/eureka/web - for Eureka server
2. http://localhost:8222/swagger-ui.html - for OpenAPI documentation

To access Grafana open the following URL in the browser: http://localhost:3000

Default login credentials are 

Username: admin \
Password: admin

## Building the projects container images

You will need to be logged into Docker.

Backend:

To build the backend project you will need to edit the main pom.xml file in the musicstore-backend folder. \
Change the jib maven plugin <image></image> tag to contain your Docker username. \
Then from the backend project root run the following command: \
`mvn clean compile jib:build`

Frontend:

To build frontend application you need to be in the musicstore-frontend folder. \
In the file vite.config.js change these variables: 
1. port: 80
2. hmr: { port: 80 }

Then run the following commands: \
`docker build -t <your-docker-username>/frontend .` \
`docker push <your-docker-username>/frontend:latest`

Then you will need to change kubernetes yaml files located in \
<project_root>/Backend/musicstore-backend/kubernetes/services \
and change the image locations for your Docker Hub user repositories 


## Useful additional software
Kube Forwarder - available for download at https://kube-forwarder.pixelpoint.io/ \
Microsoft Azure Explorer - available for download at https://azure.microsoft.com/en-us/products/storage/storage-explorer
