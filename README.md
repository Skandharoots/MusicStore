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
    `CREATE DATABASE products`\
    `CREATE DATABASE favorites`\
    `CREATE DATABASE opinions`\
   
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
Microsoft Azure Explorer - available for download at https://azure.microsoft.com/en-us/products/storage/storage-explorer\
\
\
\
\
![Screenshot 2025-05-12 at 14-02-38 Fancy Strings](https://github.com/user-attachments/assets/0a37eeeb-8925-48f2-8359-e79daf9a4dce)
![Screenshot 2025-05-12 at 14-02-52 Guitars](https://github.com/user-attachments/assets/92d39674-ae70-4c1b-a6bb-246bba6c2db6)
![Screenshot 2025-05-12 at 14-04-04 Place an order](https://github.com/user-attachments/assets/39161c2e-19ff-465a-adde-7362ba6b9daf)
![Screenshot 2025-05-12 at 14-04-04 Place an order](https://github.com/user-attachments/assets/949842af-c245-42aa-af47-9cc439c08fae)

![Screenshot 2025-05-12 at 14-03-06 Guitars](https://github.com/user-attachments/assets/4a38c68f-7e82-40fa-85c9-f6b5dbfee428)
![Screenshot 2025-05-12 at 14-04-04 Place an order](https://github.com/user-attachments/assets/5d1e0748-96d3-44aa-bf51-a2fb3311642b)
![Screenshot 2025-05-12 at 14-04-04 Place an order](https://github.com/user-attachments/assets/ef1466a4-3649-4fcf-b72d-b73d00136fcf)
![Screenshot 2025-05-12 at 14-04-42 My orders](https://github.com/user-attachments/assets/f5aca09b-850c-4d91-83c3-e82ab77967f8)
![Screenshot 2025-05-12 at 14-04-55 My orders](https://github.com/user-attachments/assets/97721c7e-f3b5-4695-a34c-20aa01e9c51d)
![Screenshot 2025-05-12 at 14-05-14 My orders](https://github.com/user-attachments/assets/5c93facb-019b-47fa-8392-ab982bdd8805)
![Screenshot 2025-05-12 at 14-05-25 My opinions](https://github.com/user-attachments/assets/ac4df52b-8f83-471a-88d4-bdb39fb7bbef)
![Screenshot 2025-05-12 at 14-05-48 Product - Fender Stratocaster Player Redburst](https://github.com/user-attachments/assets/0caa51f4-d2d4-442a-a193-b7579032b61f)
![Screenshot 2025-05-12 at 14-06-07 Account Settings](https://github.com/user-attachments/assets/2a1a9774-5443-41e2-b58e-e0fbc1502360)
![Screenshot 2025-05-12 at 14-06-17 Account Settings](https://github.com/user-attachments/assets/b612e828-724c-4dd7-853f-786c9fb9095a)
![Screenshot 2025-05-12 at 14-06-27 Account Settings](https://github.com/user-attachments/assets/a17b74a0-5331-4680-adbc-a4c40cf8ce49)
![Screenshot 2025-05-12 at 14-06-50 Fancy Strings](https://github.com/user-attachments/assets/22f62073-b823-4c30-ae3c-8aa728556cc8)
![Screenshot 2025-05-12 at 14-07-08 Manufacturer management](https://github.com/user-attachments/assets/1ce4e5f5-56bd-423d-838f-f9eea605ea77)
![Screenshot 2025-05-12 at 14-07-24 Orders management](https://github.com/user-attachments/assets/89595f23-0764-4083-910f-c123e2361cf3)
![Screenshot 2025-05-12 at 14-08-02 Orders management](https://github.com/user-attachments/assets/bf76db00-e19d-413c-a073-d830bfde6bf2)
![Screenshot 2025-05-12 at 14-08-21 Product management](https://github.com/user-attachments/assets/d491ac5e-f5cc-4b04-b907-008d2a645b34)
![Screenshot 2025-05-12 at 14-08-31 Edit Product](https://github.com/user-attachments/assets/2c91dbda-6ddc-4b4f-8d5d-4fec57268536)
![Screenshot 2025-05-12 at 14-08-57 Product management](https://github.com/user-attachments/assets/9e53c129-be5c-43c6-813d-a8a4b71f7039)
![Screenshot 2025-05-12 at 14-09-17 Product search - a](https://github.com/user-attachments/assets/4fb3c365-c3c6-45d8-a138-46d5852d1c7f)
![Screenshot 2025-05-12 at 14-12-41 Swagger UI](https://github.com/user-attachments/assets/e93885eb-b0b3-46a9-a178-6ec1ff896d7a)
![Screenshot 2025-05-12 at 14-13-01 Eureka](https://github.com/user-attachments/assets/5010af64-dd9b-4f9e-890f-24ec25c24363)
![Screenshot 2025-05-12 at 14-14-30 Explore - Loki - Grafana](https://github.com/user-attachments/assets/f5fdb813-7392-4ea7-8c81-7b5483b93c02)
![Screenshot 2025-05-12 at 14-15-39 Spring Boot Statistics - Dashboards - Grafana](https://github.com/user-attachments/assets/d727f5c4-3552-4276-8fef-e36b339ba256)
![Screenshot 2025-05-12 at 14-15-52 Spring Boot Statistics - Dashboards - Grafana](https://github.com/user-attachments/assets/88f648a3-6f1c-4ef4-a6d9-8af61e788c72)
