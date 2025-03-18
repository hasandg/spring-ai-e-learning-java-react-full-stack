'use client'

import { useState, useEffect } from 'react'
import { Box, Typography, Paper, Container, Grid, CircularProgress, Button, Divider, Chip, Card, CardContent } from '@mui/material'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import courseService from '@/services/courseService'

// Dynamically import the AI assistant to avoid hydration issues
const AiAssistantButton = dynamic(
  () => import('@/components/ai/AiAssistantButton'),
  { ssr: false }
)

// Course type definition
interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  instructor: string;
  duration: number;
  enrollments?: number;
  rating?: number;
  createdAt: string;
  topics?: string[];
}

export default function CourseDetail() {
  const params = useParams()
  const { id } = params
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const data = await courseService.getCourseById(id as string)
        setCourse(data)
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Failed to load course details')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchCourse()
    }
  }, [id])
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }
  
  if (error || !course) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            {error || 'Course not found'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            href="/courses"
            sx={{ mt: 2 }}
          >
            Back to Courses
          </Button>
        </Paper>
      </Container>
    )
  }
  
  // Prepare context for the AI assistant based on course details
  const aiContext = `
    Course: ${course.title}
    Description: ${course.description}
    Level: ${course.level}
    Category: ${course.category}
    Instructor: ${course.instructor}
    Topics covered in this course include: ${course.topics ? course.topics.join(', ') : 'various subjects'}
  `
  
  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {course.title}
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Instructor: {course.instructor}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
              <Chip label={course.category} color="primary" size="small" />
              <Chip label={course.level} color="secondary" size="small" />
              <Chip label={`${course.duration} hours`} variant="outlined" size="small" />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course Information
                </Typography>
                
                <Typography variant="body2">
                  <strong>Enrollment:</strong> {course.enrollments || 0} students
                </Typography>
                
                <Typography variant="body2">
                  <strong>Rating:</strong> {course.rating || 'Not rated yet'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Last Updated:</strong> {new Date(course.createdAt).toLocaleDateString()}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                  >
                    Start Learning
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Course Contents
      </Typography>
      
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="body1">
          Content modules coming soon!
        </Typography>
      </Paper>
      
      {/* Course-specific AI Assistant */}
      <AiAssistantButton courseId={id as string} context={aiContext} />
    </Container>
  )
} 