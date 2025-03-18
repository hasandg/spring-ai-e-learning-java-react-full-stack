'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress,
  IconButton,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import aiService from '@/services/aiService';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';

const AiAssistant = ({ courseId = null, context = null, onClose }) => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useSelector(state => state.auth);
  const chatEndRef = useRef(null);
  
  // Scroll to the bottom of the chat on new messages
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);
  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    // Add user question to conversation
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    
    setConversation(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);
    
    try {
      // Call the AI service
      const response = await aiService.askQuestion(question, courseId, context);
      
      // Add AI response to conversation
      const aiMessage = {
        type: 'ai',
        content: response.answer,
        timestamp: response.timestamp,
        questionId: response.questionId,
      };
      
      setConversation(prev => [...prev, aiMessage]);
      setQuestion('');
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError('Sorry, I encountered an error. Please try again.');
      
      // Add error message to conversation
      const errorMessage = {
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to render a message
  const renderMessage = (message, index) => {
    const isUser = message.type === 'user';
    const isError = message.type === 'error';
    
    return (
      <Box
        key={index}
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 2,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            maxWidth: '80%',
            backgroundColor: isUser 
              ? 'primary.light' 
              : isError 
                ? 'error.light' 
                : 'background.paper',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
          }}
        >
          {isUser ? (
            <Typography variant="body1">{message.content}</Typography>
          ) : (
            <Box className="markdown-content">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </Box>
          )}
          <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
        </Paper>
      </Box>
    );
  };
  
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 350,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SmartToyIcon sx={{ mr: 1 }} />
          <Typography variant="h6">AI Assistant</Typography>
        </Box>
        <IconButton
          color="inherit"
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      {/* Messages area */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          overflow: 'auto',
          backgroundColor: 'grey.50',
        }}
      >
        {conversation.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              opacity: 0.7,
            }}
          >
            <SmartToyIcon fontSize="large" color="primary" />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Hi! I'm your AI assistant. Ask me anything about your courses.
            </Typography>
          </Box>
        ) : (
          conversation.map(renderMessage)
        )}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={chatEndRef} />
      </Box>
      
      <Divider />
      
      {/* Input area */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          display: 'flex',
          backgroundColor: 'background.paper',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask something..."
          value={question}
          onChange={handleQuestionChange}
          disabled={loading || !isAuthenticated}
          size="small"
          sx={{ mr: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !question.trim() || !isAuthenticated}
          sx={{ minWidth: 'auto' }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default AiAssistant; 