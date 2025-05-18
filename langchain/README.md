# LangChain FastAPI Service Deployment

This folder contains the FastAPI service that integrates with Google's Gemini AI through LangChain.

## Deployment Instructions

### Option 1: Deploy to Heroku

1. Create a Heroku account if you don't have one
2. Install the Heroku CLI: `brew install heroku/brew/heroku`
3. Login to Heroku: `heroku login`
4. Create a new Heroku app: `heroku create unil-chatbot-ai`
5. Deploy the app:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```
6. Set up environment variables on Heroku:
   ```
   heroku config:set GEMINI_API_KEY=your_api_key_here
   ```
   (Add any other environment variables from your .env file)

### Option 2: Deploy to Render

1. Create a Render account at https://render.com
2. Create a new Web Service
3. Connect your GitHub repository or use direct deployment
4. Configure as:
   - Name: unil-chatbot-ai
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host=0.0.0.0 --port=$PORT`
5. Add environment variables from your .env file
6. Deploy

## After Deployment

Update your backend service to point to your new AI service URL:

Update the API endpoint URL in your backend configuration to point to your deployed FastAPI service. This will allow your main backend to forward chat requests to the AI service.
