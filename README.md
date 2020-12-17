### Nest starter

### Installation

`yarn install`

### Running the project

#### Local

To start the database server run the following command

```bash
docker-compose -f docker-compose.local.yml up
```

It will run mongodb, mongo-express, will create a folder `mongodb` with mongodb data files.  
Access [http://localhost:8081/](http://localhost:8081/) for mongo express

To start API server run the following command

```bash
yarn start:local:dev
```

#### Production

To start the server run the following command

```bash
docker-compose -f docker-compose.production.yml up
```
