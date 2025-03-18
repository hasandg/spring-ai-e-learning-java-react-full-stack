import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, Grid, Button, TextField } from '@mui/material';
import DraggableList from '@/components/dnd/DraggableList';

// Define the task type
interface Task {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export default function DragAndDropExample() {
  // Sample tasks data
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Complete React Project', priority: 'high', completed: false },
    { id: 2, title: 'Learn TypeScript', priority: 'medium', completed: true },
    { id: 3, title: 'Study Material UI', priority: 'medium', completed: false },
    { id: 4, title: 'Implement Authentication', priority: 'high', completed: false },
    { id: 5, title: 'Set Up Testing', priority: 'low', completed: false },
  ]);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Function to render task item
  const renderTask = (task: Task) => (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
      <Box>
        <Typography
          variant="body1"
          sx={{
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? 'text.secondary' : 'text.primary',
          }}
        >
          {task.title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Chip
          label={task.priority}
          size="small"
          color={
            task.priority === 'high'
              ? 'error'
              : task.priority === 'medium'
              ? 'warning'
              : 'success'
          }
          sx={{ mr: 1 }}
        />
        <Chip
          label={task.completed ? 'Completed' : 'Pending'}
          size="small"
          color={task.completed ? 'success' : 'default'}
        />
      </Box>
    </Box>
  );

  // Function to handle task reordering
  const handleReorder = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  // Function to toggle task completion status
  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function to handle adding a new task
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
      title: newTaskTitle,
      priority: newTaskPriority,
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Drag and Drop Task Manager
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Task List (Drag to Reorder)
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Drag and drop tasks to prioritize them. Click a task to toggle its completion status.
            </Typography>
            
            <DraggableList
              items={tasks}
              onReorder={handleReorder}
              renderItem={(task) => (
                <Box
                  onClick={() => toggleTaskCompletion(task.id)}
                  sx={{ width: '100%', cursor: 'pointer' }}
                >
                  {renderTask(task)}
                </Box>
              )}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add New Task
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Task Title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                margin="normal"
                variant="outlined"
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Priority
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {(['high', 'medium', 'low'] as const).map((priority) => (
                  <Chip
                    key={priority}
                    label={priority}
                    color={
                      priority === 'high'
                        ? 'error'
                        : priority === 'medium'
                        ? 'warning'
                        : 'success'
                    }
                    onClick={() => setNewTaskPriority(priority)}
                    variant={newTaskPriority === priority ? 'filled' : 'outlined'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}
              </Box>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
              fullWidth
            >
              Add Task
            </Button>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Statistics
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                Total Tasks: {tasks.length}
              </Typography>
              <Typography variant="body2">
                Completed: {tasks.filter((task) => task.completed).length}
              </Typography>
              <Typography variant="body2">
                Pending: {tasks.filter((task) => !task.completed).length}
              </Typography>
              <Typography variant="body2">
                High Priority: {tasks.filter((task) => task.priority === 'high').length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 