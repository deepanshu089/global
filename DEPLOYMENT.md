# Backend Deployment Guide

This guide will help you deploy the Node.js/Express backend to **Render.com** (a popular free hosting platform) and set up a **MongoDB Atlas** cloud database.

## Part 1: MongoDB Atlas (Cloud Database)

1.  **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up.
2.  **Create a Cluster**: 
    *   Build a Database.
    *   Choose the **FREE** (Shared) option.
    *   Select your region (e.g., AWS / N. Virginia).
    *   Click "Create Cluster".
3.  **Setup Security**:
    *   **Username/Password**: Create a database user (e.g., `admin` / `securepassword123`). **Remember this password!**
    *   **IP Access List**: Choose "Allow Access from Anywhere" (`0.0.0.0/0`) for simplicity, or just your IP if you want to be strict (but Render needs access, so 0.0.0.0/0 is easiest for beginners).
4.  **Get Connection String**:
    *   Go to "Database" -> "Connect".
    *   Choose "Drivers" (Node.js).
    *   Copy the connection string. It looks like:
        `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    *   Replace `<password>` with your actual password.

---

## Part 2: Deploy to Render.com

1.  **Create Account**: Sign up at [Render.com](https://render.com) using your GitHub account.
2.  **New Web Service**:
    *   Click "New +" -> "Web Service".
    *   Select "Build and deploy from a Git repository".
    *   Connect your repository: `deepanshu089/global`.
3.  **Configure Service**:
    *   **Name**: `task-manager-api` (or similar).
    *   **Region**: Choose one close to you.
    *   **Branch**: `main`.
    *   **Root Directory**: `task-manager/server` (IMPORTANT: This must be set because your server is in a subfolder).
    *   **Runtime**: Node.js.
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
4.  **Environment Variables**:
    Scroll down to "Environment Variables" and add these:
    *   `MONGODB_URI`: Paste your MongoDB Atlas connection string from Part 1.
    *   `JWT_SECRET`: A long random string (e.g., `mysecuresecretkey123`).
    *   `PORT`: `5000` (Optional, Render sets this automatically, but safe to add).
5.  **Deploy**:
    *   Click "Create Web Service".
    *   Render will start building your app. Watch the logs.
    *   Once "Live", copy the URL (e.g., `https://task-manager-api.onrender.com`).

---

## Part 3: Connecting Frontend

Once your backend is live, you need to update your Frontend to talk to the live server instead of `localhost`.

1.  **Update Frontend Code**:
    *   Replace `http://localhost:5000` with your new Render URL in your frontend API calls.
    *   *Tip: Use environment variables in Vite (`VITE_API_URL`) to switch between localhost and production automatically.*

2.  **Deploy Frontend**:
    *   You can deploy the `client` folder to **Vercel** or **Netlify** similarly by setting the Root Directory to `task-manager/client`.
