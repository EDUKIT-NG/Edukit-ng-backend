# Project Setup Instructions

Welcome to the Project! Follow these instructions to set up the development environment

## Clone the Project

To clone the project, run:

```bash
git clone https://github.com/yourusername/your-repo-name.git
```

## Navigate to Project Directory

Change into the project directory:

```bash
cd your-repo-name/server
```

## Install Dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

## Create a .env File

This file should contain:

PORT=5000
MONGO_URI=your-mongodb-atlas-connection-string
ORIGIN=http://localhost:3000
SECRET_KEY=your-secret-key
PASSWORD_RESET_TOKEN_EXPIRATION=2m
LOGIN_TOKEN_EXPIRATION=7d
PRODUCTION=false
COOKIE_EXPIRATION_DAYS=7
EMAIL=youremail@gmail.com
PASSWORD=your-email-password
OTP_EXPIRATION_TIME=120000

## Start the Server

To start the server, use:

```bash
npm start
```

## Server URL

The server runs on:

```url
http://localhost:5000
```

## Environment Setup

### Prerequisites

- Node.js version: 22.x or higher
- npm version: 11.x or higher

## Usage Examples

After starting the server, you can interact with the API using tools like Postman or curl. For example, to get a welcome message:

```bash
curl http://localhost:5000/
```

## Troubleshooting Section

### Common Issues

- **Error: EADDRINUSE**: This means the port is already in use. Try changing the port in your server configuration or stopping the process using that port.
- **Error: Cannot find module**: Ensure all dependencies are installed by running `npm install`.
