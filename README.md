# Apollo Back

Server start on port 4000 and expect front on port 3000.

Require a mongo database exposed on default port 27017 (use docker command bellow).

## Install

npm install

## Start

npm start

## Create docker mongo database

sudo docker run -p 27017:27017 --name apollo-mongo -d mongo