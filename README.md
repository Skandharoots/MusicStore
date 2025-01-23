# MusicStore
Repository for Music Store application in Spring and React

## Creator
Marek Kopania

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

## Additional setup of databases
1. Connect to MySQL database - Username: root; Password: lapunia2121
2. Run the following commands to create databases:

    `CREATE DATABASE shoppingcarts`\
    `CREATE DATABASE orders`\
    `CREATE DATABASE products`
   
## Gaining admin account

To gain admin priviledges in the application you need to act as a DBA.\
First you can register in the application and enable you account via the activation email.\
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
according to the steps described in 'Additional setup of databases' section.

## Useful additional software
Kube Forwarder - available for download at https://kube-forwarder.pixelpoint.io/ \
Microsoft Azure Explorer - available for download at https://azure.microsoft.com/en-us/products/storage/storage-explorer
