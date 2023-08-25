# Transfer Request Management API

## Introduction

This is a simple API for a transfer request anagement built using Node.js, MongoDB, and JWT for authentication and authorization. The project follows the MVC architecture and makes use of middleware for common operations like authentication and database connection.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Folder Structure](#folder-structure)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

- Node.js
- MongoDB
- Postman (or another API client)
- Git (optional)

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/m-istighfar/week-10-m-istighfar.git
   ```
2. Install dependencies:

   ```sh
   cd project_folder
   npm install
   ```

3. Create an `.env` file in the root directory and add the following:

   ```env
   JWT_SIGN='your_secret_key'
   ```

4. Start MongoDB:
   ```sh
   mongod
   ```

## Running the Application

Start the application by running:

```sh
npm start
```

This will launch the server at `http://localhost:3000/`.

## API Documentation

For a more detailed guide to using the API, navigate to `https://shy-pear-scarab-garb.cyclic.cloud/api-docs/`.

## Testing

### Overview

Our application uses [Jest](https://jestjs.io/) as the testing framework for both unit and integration tests. The testing suites cover functionalities including user authentication and financial transfers.

### File Structure

- `create.test.js`: Tests the `createTransfer` function for creating financial transfers.
- `login.test.js`: Tests the `login` function for user login functionality.
- `register.test.js`: Tests the `register` function for registering new users.
- `update.test.js`: Tests the `updateTransfer` function for updating the status of financial transfers.

### Running Tests

To run all the tests:

```bash
npm run test
```

To run a specific test file:

```bash
npm test <test-file-name>
```
