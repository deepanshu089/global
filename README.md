# Task Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing tasks with secure user authentication.

## Features
- 🔐 **Authentication**: Secure Login and Signup functionality using JWT.
- 🛡️ **Private Tasks**: User-specific data isolation - users can only see their own tasks.
- ✨ **Premium UI**: Modern glassmorphism design with smooth animations.
- 📱 **Responsive**: Fully responsive layout for all devices.
- 🔄 **CRUD Operations**: Create, Read, Update, and Delete tasks.
- 📊 **Status Tracking**: Track tasks (Pending, In Progress, Completed).

## Tech Stack
### Frontend
- **Framework**: React (Vite)
- **Styling**: TailwindCSS, PostCSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JsonWebToken (JWT), BcryptJS (Password Hashing)
- **CORS**: Cross-Origin Resource Sharing

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on default port (27017) or update `.env`.

### 1. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:5000
```
(Ensure MongoDB is running before starting)

### 2. Frontend Setup
Open a new terminal, navigate to the client directory:
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to start the application.

## Environment Variables
The server needs a `.env` file. A default one is created, but for production, you should update the secrets.

**`server/.env`**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key_here
```
*(Note: If `JWT_SECRET` is not provided, the app uses a fallback development key)*

## API Endpoints

### Auth
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `POST /api/users/tokenIsValid` - Verify JWT token
- `GET /api/users/` - Get current user info

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Deployment
- **Backend**: Ready for deployment on Render/Heroku/Railway.
- **Frontend**: Ready for Vercel/Netlify.
