# Notes Server

This project is a TypeScript application built with the NestJS framework. It uses Prisma as an ORM for database management and Jest for testing. The project is managed with npm and follows the coding standards enforced by ESLint and Prettier.

## Tech Stack

- [NestJS](https://nestjs.com/): A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- [TypeScript](https://www.typescriptlang.org/): A strongly typed superset of JavaScript that adds static types.
- [Prisma](https://www.prisma.io/): An open-source database ORM.
- [PostgreSQL](https://www.postgresql.org/): A powerful, open source object-relational database

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- pnpm
- git
- PostgreSQL database

### Installation

1. Clone the repository:

  ```sh
  git clone https://github.com/Dank-del/speer-backend-assesment.git
  ```

2. Install the dependencies:

 ```sh
 pnpm install
 ```

3. Add a `.env` file to the root of the project with the following contents:

  ```sh
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notes" # your database url
  PORT=3000 # the port the server will run on
  JWT_SECRET=secret # the secret used to sign JWTs
  ```

4. Run the Prisma migration to create the database schema:

  ```sh
  npx prisma db push
  ```

### Running the Application

Start the application by running:

```sh
pnpm start:dev
```

The application will be running at <http://localhost:3000>.

### Running the Tests

Run the tests by executing:

```sh
pnpm test
```

### Deployment

To build the application for production, run:

```sh
pnpm build
```

This will create a `dist` directory with the compiled JavaScript files.

## API Documentation

The API documentation is available at <http://localhost:3000/api>.
