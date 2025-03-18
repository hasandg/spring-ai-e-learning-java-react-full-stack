'use client'

import { Box, Button, Container, Grid, Paper, Typography, Card, CardContent, CardMedia, Stack, useTheme } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import SchoolIcon from '@mui/icons-material/School'
import DevicesIcon from '@mui/icons-material/Devices'
import GroupIcon from '@mui/icons-material/Group'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import StarIcon from '@mui/icons-material/Star'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

// Sample featured courses for the UI
const featuredCourses = [
  {
    id: 1,
    title: 'Introduction to Web Development',
    instructor: 'John Smith',
    price: 49.99,
    rating: 4.8,
    students: 1543,
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 2,
    title: 'Advanced JavaScript Concepts',
    instructor: 'Sarah Johnson',
    price: 59.99,
    rating: 4.9,
    students: 1203,
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 3,
    title: 'Python for Data Science',
    instructor: 'Michael Chen',
    price: 69.99,
    rating: 4.7,
    students: 2311,
    image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

export default function HomePage() {
  const theme = useTheme();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const username = user?.username || 'unknown user';
  const router = useRouter();
  
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  // Always redirect if user is authenticated (dev mode or not)
  if (isAuthenticated) {
    router.push('/courses');
    return null;
  }
  
  // Dev mode banner disabled - no longer needed
  // const isDevAuth = isAuthenticated && isDev;

  return (
    <Box sx={{ 
      color: 'black', 
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      {/* NavBar */}
      <Navbar />
      
      {/* Dev Mode Banner removed */}
      
      {/* Hero Section with Image */}
      <Box
        sx={{
          position: 'relative',
          height: '80vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1
            },
            '& img': {
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Students learning"
          />
        </Box>

        {/* Hero Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ color: 'white', textAlign: 'left', maxWidth: '600px' }}>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              sx={{ 
                mb: 3, 
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: 'white'
              }}
            >
              Transform Your Future Through Learning
            </Typography>
            <Typography
              variant="h5"
              sx={{ 
                mb: 5, 
                textShadow: '0 2px 5px rgba(0,0,0,0.3)',
                maxWidth: '80%',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                color: 'white'
              }}
            >
              Join thousands of students learning new skills and advancing their careers with our expert-led courses.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                href="/register"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                }}
              >
                Register Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                href="/login"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          sx={{ mb: 6, color: 'black' }}
        >
          Why Choose Our Platform
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
              <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" sx={{ color: 'black' }}>
                Expert Instructors
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ color: '#333' }}>
                Learn from industry professionals with years of experience and passion for teaching.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
              <DevicesIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" sx={{ color: 'black' }}>
                Flexible Learning
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ color: '#333' }}>
                Access content anywhere, anytime. Learn at your own pace on any device.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
              <GroupIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" sx={{ color: 'black' }}>
                Community Support
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ color: '#333' }}>
                Join a community of learners for discussions, collaboration, and networking.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Courses Section */}
      <Box sx={{ backgroundColor: '#f7f9fc', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            sx={{ mb: 6, color: 'black' }}
          >
            Featured Courses
          </Typography>

          <Grid container spacing={4}>
            {featuredCourses.map((course) => (
              <Grid item key={course.id} xs={12} sm={6} md={4}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  },
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography gutterBottom variant="h5" component="h3" fontWeight="bold" sx={{ color: 'black' }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Instructor: {course.instructor}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon sx={{ color: '#FFD700', mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                          {course.rating}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({course.students} students)
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="h6" component="p" fontWeight="bold" sx={{ color: 'primary.main' }}>
                        ${course.price}
                      </Typography>
                      <Button 
                        variant="contained" 
                        startIcon={<PlayArrowIcon />}
                        component={Link}
                        href="/login"
                        sx={{ borderRadius: 2 }}
                      >
                        Start Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              component={Link}
              href="/login"
              sx={{ 
                px: 4, 
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 600
              }}
            >
              View All Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom sx={{ color: 'black' }}>
          Ready to Start Learning?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
          Join our community of learners and advance your career with our expert-led courses.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          component={Link}
          href="/register"
          sx={{ 
            px: 6, 
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
          }}
        >
          Get Started Today
        </Button>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 6, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} E-Learning Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
} 