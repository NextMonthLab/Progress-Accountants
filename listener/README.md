# NextMonth Dev Listener

A simple Express server that listens for messages from NextMonth Dev.

## Setup

```bash
# Install dependencies
npm install

# Start the server
npm start

# For development with auto-restart
npm run dev
```

## Endpoints

- GET `/`: Simple message to confirm the server is running
- POST `/listen`: Endpoint to receive JSON messages

## Usage

Send POST requests to `/listen` with a JSON body. The server will log the full payload to the console and respond with `{ "status": "received" }`.

Example using curl:

```bash
curl -X POST http://localhost:3000/listen \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from NextMonth Dev", "data": {"key": "value"}}'
```

## Purpose

This server acts as a permanent communication channel from NextMonth Dev to the Progress Accountants Replit instance.