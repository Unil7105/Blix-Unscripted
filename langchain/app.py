from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
# from jose import JWTError, jwt  # JWT authentication commented out
from pydantic import BaseModel
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
# JWT authentication commented out
# SECRET_KEY = "unil@1234"
# ALGORITHM = "HS256"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

# JWT Verification - Commented out
# def verify_jwt(request: Request):
#     # Get token from multiple sources (in order of priority)
#     token = None
#     
#     # 1. Try to get from Authorization header first (Bearer token)
#     auth_header = request.headers.get('Authorization')
#     if auth_header and auth_header.startswith('Bearer '):
#         token = auth_header.replace('Bearer ', '')
#     
#     # 2. Try to get from cookies if header is not available
#     if not token:
#         token = request.cookies.get('uid')
#     
#     # 3. If frontend is using localStorage, check for token in query params as fallback
#     if not token:
#         token_param = request.query_params.get('token')
#         if token_param:
#             token = token_param
#     
#     # Return 401 if no token is found
#     if not token:
#         raise HTTPException(status_code=401, detail="Missing authentication token")
#     
#     try:
#         # Verify and decode the token
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         return payload
#     except JWTError as e:
#         print("JWT error:", e)
#         raise HTTPException(status_code=403, detail="Invalid or expired token")

# Mock user function to replace JWT verification
def get_mock_user():
    return {"email": "anonymous", "sub": "mock-user-id"}

# Comic and Manga Storyteller System Prompt
STORYTELLER_PROMPT = """
You're an expert fanfiction and comic book storyteller who reimagines alternate universe "What If" storylines across iconic franchises like Marvel, DC, Naruto, One Piece, My Hero Academia, and more. Your specialty is turning speculative scenarios into deeply engaging, emotionally powerful stories in a Wattpad/light novel style — not script or panel format.

When given a What If scenario, you will:

Write a fully fleshed-out narrative in prose form, like a light novel or a Wattpad fanfic chapter (not a script or comic script).

Stay true to the voice, tone, and themes of the original franchise, using accurate character behavior, powers, and dynamics.

Use dramatic storytelling, inner monologue, intense confrontations, emotional stakes, and well-paced action that reads like a published side story or alternate canon arc.

Add twists, callbacks, or easter eggs that fans of the original series would deeply appreciate.

End on a powerful emotional beat, plot reveal, or cliffhanger that makes readers desperate for the next chapter.

Use clear paragraph formatting, short dialogue bursts, and vivid scene-setting — just like how top-performing Wattpad fanfics or light novels are written.

Do not break the story into comic panels or script format. Focus on cinematic storytelling in prose, blending action, dialogue, and character thoughts smoothly.

Example input:

"What if Itachi never massacred the Uchiha Clan?"

"What if Spider-Man was trained by Batman?"

"What if Deku was quirkless but joined the League of Villains?"

Always aim to deliver something emotionally impactful, lore-accurate, and thrilling.

"""

# LangChain with Gemini (Google Generative AI)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.8,  # Slightly higher temperature for more creative stories
)

# Initialize conversation with proper memory formatting for chat models
from langchain.prompts import (ChatPromptTemplate, SystemMessagePromptTemplate, 
                             HumanMessagePromptTemplate, AIMessagePromptTemplate,
                             MessagesPlaceholder)
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

# Initialize conversation memory for chat messages format
memory = ConversationBufferMemory(memory_key="history", return_messages=True)

# Create chat prompt template with system prompt
prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template(STORYTELLER_PROMPT),
    MessagesPlaceholder(variable_name="history"),
    HumanMessagePromptTemplate.from_template("{input}")
])

# Create conversation chain with system prompt
conversation = ConversationChain(
    llm=llm, 
    memory=memory,
    prompt=prompt,
    verbose=True  # Show the prompts for debugging
)

@app.post("/generate")
async def generate_story(data: PromptRequest): # JWT authentication commented out
    try:
        # Log incoming request for debugging
        print(f"Received prompt: {data.prompt[:50]}... from user: anonymous") 
        
        # Process with LangChain
        response = conversation.invoke(data.prompt)
        
        # Extract text from response if it's in a nested format
        response_text = response
        if isinstance(response, dict) and 'response' in response:
            response_text = response['response']
            print(response_text)
        
        # Return formatted response
        return {
            "user": "anonymous",
            "response": response_text
        }
    except Exception as e:
        # Log the error
        print(f"Error processing request: {str(e)}")
        # Return a more helpful error response
        raise HTTPException(
            status_code=500,
            detail=f"Error processing your request: {str(e)}"
        )
