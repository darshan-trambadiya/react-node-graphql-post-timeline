# Post Timeline Web App

## Project Summary

Post Timeline Web App is a full-stack application where users can register, log in, and create posts. The app includes authentication, status updates, post creation, image uploads, and pagination. It is built with React 19 on the frontend and Node.js with GraphQL and MongoDB on the backend.

## Project Structure

```
root/
│-- client/      # React 19 Frontend
│-- server/      # Node.js, Express, GraphQL, MongoDB Backend
│-- README.md    # Project Documentation
```

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- MongoDB (cloud instance)
- npm or yarn

## Installation

Clone the repository:

```sh
git clone https://github.com/darshan-trambadiya/react-node-graphql-post-timeline.git
cd react-node-graphql-post-timeline
```

### Client Setup

```sh
cd client
npm install
npm start
```

Runs the frontend React app on `http://localhost:3000/`.

### Server Setup

```sh
cd server
npm install
npm start
```

Runs the backend on `http://localhost:8080/`.

---

# Client (Frontend)

## Tech Stack

- React 19
- React Router 7
- Fetch API (GraphQL queries)

## Available Scripts

### Start Development Server

```sh
npm start
```

Runs the app on `http://localhost:3000/`.

### Features

- **Authentication:** Signup/Login with email & password.
- **Post Timeline Page:**
  - Update status (default: "I am new!").
  - Create new posts with title, image, and content.
  - View, edit, delete posts (with pagination).
- **GraphQL API Integration:** Uses fetch API for GraphQL queries.

### Environment Variables

Update a `.env` file in the `client/` folder with the server URL (default is http://localhost:8080) if needed:

```
REACT_APP_API_URL=http://localhost:8080
```

---

# Server (Backend)

## Tech Stack

- Node.js
- Express.js
- GraphQL
- MongoDB with Mongoose
- JWT Authentication
- Multer for Image Upload
- Bcrypt for Password Hashing

## Available Scripts

### Start Server

```sh
npm start
```

Runs the server on `http://localhost:8080/`.

### Features

- **User Authentication:** Signup & Login with JWT (1h expiration).
- **Password Security:** Hashed storage using bcrypt.
- **GraphQL API:** Handles all queries and mutations.
- **Image Upload:** Uses multer for local storage.

### Environment Variables

Update a `.env` file in the `server/` folder with your MongoDB connection string:

```
MONGODB_CONNECTION_STRING=mongodb+srv://<user>:<password>@xxx.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=<app-name>
PORT=8080
JWT_SECRET=yourjwtsecret
NODE_ENV=development
```

---

# License

This project is open-source and available under the MIT License.
