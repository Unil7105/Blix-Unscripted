# Backend Service Deployment

This folder contains the Node.js/Express backend for the AI chatbot application.

## Deployment Instructions

### Option 1: Deploy to Heroku

1. Create a Heroku account if you don't have one
2. Install the Heroku CLI: `brew install heroku/brew/heroku`
3. Login to Heroku: `heroku login`
4. Create a new Heroku app: `heroku create unil-chatbot-backend`
5. Add a MongoDB add-on or configure your own database URL in the env variables
6. Deploy the app:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```
7. Set up environment variables on Heroku:
   ```
   heroku config:set JWT_SECRET_KEY=unil@1234
   heroku config:set CORS_ORIGIN=https://unil-chatbot.windsurf.build
   ```
   (Add any other environment variables from your .env file)

### Option 2: Deploy to Render

1. Create a Render account at https://render.com
2. Create a new Web Service
3. Connect your GitHub repository or use direct deployment
4. Configure as:
   - Name: unil-chatbot-backend
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node index.js`
5. Add environment variables from your .env file
6. Deploy

## After Deployment

Update your frontend environment variables to point to your new backend URL:

```
VITE_API_URL=https://your-backend-url.com
```

Then redeploy your frontend with the updated environment variables.
