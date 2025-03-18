'use client';

import { useState } from 'react';
import { Fab, Tooltip, Badge } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AiAssistant from './AiAssistant';
import { useSelector } from 'react-redux';

const AiAssistantButton = ({ courseId = null, context = null }) => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const handleToggle = () => {
    setOpen(prev => !prev);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <>
      <Tooltip 
        title={isAuthenticated ? "AI Learning Assistant" : "Login to use AI Assistant"} 
        placement="left"
      >
        <Badge
          color="secondary"
          variant="dot"
          invisible={!isAuthenticated}
        >
          <Fab
            color="primary"
            size="medium"
            onClick={handleToggle}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <SmartToyIcon />
          </Fab>
        </Badge>
      </Tooltip>
      
      {open && (
        <AiAssistant 
          courseId={courseId} 
          context={context} 
          onClose={handleClose} 
        />
      )}
    </>
  );
};

export default AiAssistantButton; 