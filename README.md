# AI Chatbot Application

This repository contains a complete chatbot application with three main components:

1. **Frontend**: React/Vite application with authentication and protected routes
2. **Backend**: Express.js API server for user authentication and request handling
3. **AI Service**: FastAPI service using LangChain to integrate with Google's Gemini AI

## Deployment Status

- Frontend: Deployed at https://unil-chatbot.windsurf.build

## Project Structure

```
/chatbot
├── frontend/          # React/Vite frontend application
├── backend/           # Express.js backend API
└── langchain/         # FastAPI service for AI integration
```

## Complete Deployment Guide

### Step 1: Deploy the Frontend (Already Done)

The frontend has been deployed to Netlify and is available at:
https://unil-chatbot.windsurf.build

To update the frontend deployment:
1. Make changes to the frontend code
2. Redeploy with the same project ID:
   `5fae520e-2422-4304-926e-5e8b9f89ef16`

### Step 2: Deploy the Backend API

Follow the detailed deployment instructions in `/backend/README.md`.

Options:
- Deploy to Heroku
- Deploy to Render
- Other Node.js-compatible hosting services

### Step 3: Deploy the FastAPI AI Service

Follow the detailed deployment instructions in `/langchain/README.md`.

Options:
- Deploy to Heroku
- Deploy to Render
- Other Python-compatible hosting services

### Step 4: Connect All Services

After deploying all components:

1. Update the frontend `.env` file with your backend API URL:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

2. Update the backend to communicate with your AI service:
   Ensure your backend has the correct URL configured for the AI service.

3. Redeploy your frontend with the updated environment variables.

## Authentication

The frontend includes protected routes that require authentication. Only users with a valid "uid" token stored in localStorage can access the home page and chat functionality.

## Further Help

Each component folder contains its own README with specific deployment instructions.
