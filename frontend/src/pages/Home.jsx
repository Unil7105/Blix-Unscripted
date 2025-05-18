import { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Copy, Check, RefreshCw, Zap } from 'lucide-react';
// import Logout from '../components/Logout';
import axios from 'axios';

function Home() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const inputContainerRef = useRef(null);
  
  // Example prompts for users - comic and manga themed
  const examplePrompts = [
    "What if Superman landed in Gotham instead of Metropolis?",
    "What if the Avengers existed in the Attack on Titan universe?",
    "What if Goku never hit his head as a child?",
    "What if Batman joined the Justice League with Joker powers?",
    // "What if Naruto was raised by the Uchiha clan?",
    // "What if One Piece's Devil Fruits appeared in our world?"
  ];
  
  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        Math.max(textareaRef.current.scrollHeight, 40), 
        120
      )}px`;
    }
  }, [message]);
  
  // Scroll to bottom of chat when conversation updates
  useEffect(() => {
    scrollToBottom();
  }, [conversation, isLoading]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to conversation
    const userMessage = { sender: 'user', text: message.trim() };
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    setMessage('');
    
    try {
      // console.log('Making API request to:', `http://127.0.0.1:8000/generate`);
      
      // Make API request to your FastAPI service (Authentication removed)
      const response = await axios.post(`https://blix-unscripted.onrender.com/generate`, {
        prompt: message.trim()
      }, {
        // Add timeout and better error handling
        timeout: 30000 // 30 seconds timeout
      });
      
      console.log('API response:', response.data);
      
      // Handle the response safely
      let responseText = '';
      
      if (response.data) {
        if (typeof response.data === 'string') {
          responseText = response.data;
        } else if (response.data.response) {
          responseText = response.data.response;
          // Handle nested response object
          if (typeof responseText === 'object' && responseText.response) {
            responseText = responseText.response;
          }
        } else if (response.data.text) {
          responseText = response.data.text;
        } else if (response.data.message) {
          responseText = response.data.message;
        }
      }
      
      // Fallback if response format is unexpected
      if (!responseText) {
        responseText = 'Received response from AI but couldn\'t parse the content. Please try again.';
      }
      
      const botMessage = { sender: 'bot', text: responseText };
      setConversation(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Get detailed error message
      let errorMessage = 'Sorry, there was an error processing your request. Please try again later.';
      
      if (error.response) {
        // Server responded with a non-2xx status code
        console.error('Error response:', error.response.data);
        if (error.response.data && error.response.data.detail) {
          errorMessage = `Error: ${error.response.data.detail}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received');
        errorMessage = 'No response received from the server. Please check your internet connection.';
      } else if (error.message && error.message.includes('timeout')) {
        errorMessage = 'Request timed out. The server took too long to respond.';
      }
      
      // Add error message to conversation
      setConversation(prev => [...prev, { 
        sender: 'bot', 
        text: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle text copy to clipboard
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  // Clear conversation history
  const clearConversation = () => {
    setConversation([]);
  };
  
  // Handle textarea resize and submit on Enter (without shift)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  return (
    <div className="flex flex-col h-screen font-comic relative z-10">
      {/* Header with title and buttons */}
      <header className=" bg-transparent  shadow-md py-3 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="UNSCRIPTED Logo" className="h-16 w-auto" />
          {/* <h1 className="text-xl font-extrabold text-white" style={{fontFamily: "'Bangers', cursive"}}>UN<span className="">SCRIPTED</span></h1> */}
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={clearConversation}
            className="text-gray-400 hover:text-white flex items-center gap-1 text-xs py-1 px-2 rounded-full backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all"
          >
            <RefreshCw size={12} />
            <span>New Chat</span>
          </button>
          {/* <Logout /> */}
        </div>
      </header>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-6 space-y-8 text-white bg-transparent ">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-auto my-40 px-4 max-w-4xl mx-auto ">
            <h1 className="text-7xl tracking-widest mb-10 font-extrabold text-white" style={{fontFamily: "'Bangers', cursive"}}>UNSCRIPTED</h1>
            {/* <div className="glass p-8 rounded-2xl w-full max-w-3xl mx-auto mb-12 relative backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-full shadow-lg">
                <Sparkles size={24} className="text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white text-center mt-4 mb-6">
                Welcome to <span style={{fontFamily: "'Bangers', cursive"}} className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 text-3xl">UNCRIPTED</span>
              </h2>
              
              <p className="text-gray-200 text-center mb-6 text-sm leading-relaxed max-w-2xl mx-auto">
                Explore imaginative &ldquo;What If&rdquo; scenarios and alternative storylines. I&apos;ll craft captivating narratives from your favorite comics, manga, and fictional worlds.
              </p>
              
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center gap-2 text-sm text-green-300 bg-white/5 px-4 py-2 rounded-full shadow-inner">
                  <Zap size={14} className="text-green-400" />
                  <span>Ask me to reimagine any story or universe</span>
                </div>
              </div>
            </div> */}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl ">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setMessage(prompt);
                    if (textareaRef.current) {
                      textareaRef.current.style.height = 'auto';
                      textareaRef.current.style.height = `${Math.min(Math.max(textareaRef.current.scrollHeight, 40), 120)}px`;
                      textareaRef.current.focus();
                    }
                    handleSendMessage();
                  }}
                  className="text-left px-5 py-4 rounded-2xl glass backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#6A22FC] transition-all text-white shadow-md font-medium flex items-start gap-3 group"
                >
                  <div className="mt-0.5 bg-[#6A22FC] rounded-full p-1.5 shadow-lg flex-shrink-0">
                    <Sparkles size={13} className="text-white" />
                  </div>
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          conversation.map((msg, index) => (
            <div key={index} className="max-w-3xl mx-auto w-full">
              <div className={`flex items-start gap-3 mb-6 ${msg.sender === 'user' ? 'user-message' : 'bot-message'} relative`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${msg.sender === 'user' ? 'glass bg-white/5' : 'glass bg-gradient-to-br from-purple-500/30 to-green-500/30'} p-2 rounded-full shadow-md relative z-10`}>
                  {msg.sender === 'user' ? (
                    <User size={18} className="text-white" />
                  ) : (
                    <div className="relative">
                      <Sparkles size={18} className="text-purple-300" />
                    </div>
                  )}
                </div>
                
                {/* Message content */}
                <div className="flex-1 relative">
                  {/* Name tag */}
                  <div className="text-sm text-gray-300 mb-1 flex items-center">
                    {msg.sender === 'user' ? (
                      'You'
                    ) : (
                      <div className="flex items-center">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500 p-2" style={{fontFamily: "'Bangers', cursive"}}>BLIX</span>
                        <Zap size={12} className="text-purple-400 ml-1" />
                      </div>
                    )}
                  </div>
                  
                  {/* Message bubble */}
                  <div className={`relative ${msg.sender === 'user' ? 'glass bg-white/5' : 'glass backdrop-blur-md bg-white/10'} px-6 py-5 rounded-2xl shadow-md`}>
                    {/* Message text with improved formatting for bot responses */}
                    <div className="prose prose-invert max-w-none prose-p:my-1.5 prose-headings:text-green-300">
                      <div className={`whitespace-pre-wrap leading-relaxed ${msg.sender === 'user' ? 'text-sm font-medium' : 'text-sm'} text-white`}>
                        {msg.sender === 'user' ? (
                          msg.text
                        ) : (
                          <div className="response-text text-sm leading-relaxed">
                            {msg.text.split('\n').map((paragraph, i) => {
                              if (!paragraph.trim()) {
                                return <div key={i} className="h-2"></div>; // Empty line spacing
                              }
                              
                              // Check if this is a header-like line (all caps or ending with : or starting with # or ##)
                              const isHeader = /^[A-Z0-9\s]{5,}$/.test(paragraph) || 
                                              paragraph.endsWith(':') || 
                                              paragraph.startsWith('#');
                              
                              // Check if this is a scene transition or action line
                              const isAction = paragraph.includes('*') && paragraph.lastIndexOf('*') !== paragraph.indexOf('*');
                              
                              // Check if this is dialog (starts with character name and colon)
                              const isDialog = /^[A-Za-z\s]+:\s/.test(paragraph);
                              
                              // Check if this has emphasis like quotes
                              const hasQuotes = paragraph.includes('"') && paragraph.lastIndexOf('"') !== paragraph.indexOf('"');
                              
                              return (
                                <p key={i} className={`mb-3 ${isHeader ? 'font-bold text-green-300 uppercase text-sm tracking-wide' : ''} 
                                                         ${isAction ? 'italic text-blue-200' : ''}
                                                         ${isDialog ? 'ml-4' : ''}
                                                         ${hasQuotes ? 'text-yellow-100' : ''}`}>
                                  {isDialog ? (
                                    <>
                                      <span className="font-bold">{paragraph.split(':', 1)[0]}:</span>
                                      <span>{paragraph.substring(paragraph.indexOf(':') + 1)}</span>
                                    </>
                                  ) : paragraph}
                                </p>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  
                    {/* Copy button for bot messages */}
                    {msg.sender === 'bot' && (
                      <button 
                        onClick={() => copyToClipboard(msg.text, index)}
                        className="absolute top-2 right-2 p-1 rounded-md glass bg-white/10 hover:bg-white/20 text-gray-200 transition-all"
                        aria-label="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 glass bg-gradient-to-br from-green-500/30 to-green-600/30 p-2 rounded-full shadow-md relative z-10">
                <div className="relative">
                  <Sparkles size={18} className="text-green-300" />
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="text-sm text-gray-300 mb-1 flex items-center">
                  <div className="flex items-center">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600" style={{fontFamily: "'Bangers', cursive"}}>UNSCRIPTED</span>
                    <Zap size={12} className="text-green-400 ml-1" />
                  </div>
                </div>
                <div className="relative glass backdrop-blur-md bg-white/10 px-5 py-4 rounded-2xl shadow-md">
                  <div className="flex items-center justify-center py-2">
                    <div className="flex gap-2 items-center">
                      <div className="text-sm text-gray-300 font-medium">Crafting your story</div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce delay-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="  bg-black/10 px-4 py-4 sticky bottom-0 shadow-lg">
        <div className="max-w-3xl mx-auto">
          
          <div ref={inputContainerRef} className="flex items-end gap-3 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="flex-1 rounded-2xl overflow-hidden glass bg-white/5 border border-white/10 focus-within:border-[#6A22FC] focus-within:shadow-green-500/10 focus-within:shadow-lg transition-all shadow-lg hover:shadow-md">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any 'What If' scenario..."
                className="resize-none w-full bg-transparent text-white placeholder-gray-300 py-4 px-5 outline-none min-h-[50px] max-h-[120px] font-medium"
                rows="1"
                style={{fontSize: '15px', lineHeight: '1.5'}}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              className={`rounded-full p-3.5 ${isLoading ? 'glass bg-white/5' : 'glass bg-gradient-to-r from-green-500/80 to-green-600/80 hover:from-green-500/90 hover:to-green-600/90'} text-white flex-none transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Send message"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
