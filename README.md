# The Ingestion project

### Database to run locally

- You can launch a local MongoDB instance by running the command `docker-compose up`, which will run a mongodb container with the credentials listed in the [docker-compose.yml](/docker-compose.yml) file.

## Installation

```bash
npm install
```

## Running Database Locally

```bash
npm run mongodb:start
```

## Running Seed

```bash
ts-node ./src/seeder/index.ts --import
```

## Testing

```bash
npm run test
```

# curve-test
