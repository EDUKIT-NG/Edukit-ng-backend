# Edukit NIgeria

```bash
edukit-ng-backend.up.railway.app
```

## Description

Edukit Nigeria is an educational platform designed to provide resources and tools for students and educators. It aims to enhance learning experiences through interactive content and community engagement.

## Project Setup Instructions

Follow these instructions to set up the development environment

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

```bash
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
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
COOKIE_KEY=your_cookie_key
```

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
