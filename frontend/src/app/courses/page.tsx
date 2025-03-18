'use client'

import { useEffect, useState } from 'react'
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Box,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Divider,
  IconButton,
  Tab,
  Tabs
} from '@mui/material'
import { useRouter } from 'next/navigation'
import courseService from '@/services/courseService'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category?: string;
  level?: string;
  instructorName?: string;
  progress: number;
  averageRating?: number;
  enrollmentCount?: number;
}

export default function CoursesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)
  
  // Define categories
  const categories = ['All', 'Programming', 'Web Development', 'Mobile', 'Data Science', 'Cloud', 'Security']
  
  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const fetchedCourses = await courseService.getAllCourses()
        setCourses(fetchedCourses)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching courses:", error)
        // If API call fails, the courseService will return fallback data
        setLoading(false)
      }
    }
    
    fetchCourses()
  }, [])

  const handleCourseClick = (courseId: number) => {
    // In the future, this will navigate to the course details page
    console.log(`Navigating to course ${courseId}`)
    // router.push(`/courses/${courseId}`)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === 'All' ? null : category)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Filter courses based on search term and selected category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || course.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Sort courses based on selected tab
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (tabValue === 1) { // Most Popular
      return (b.enrollmentCount || 0) - (a.enrollmentCount || 0)
    } else if (tabValue === 2) { // Highest Rated
      return (b.averageRating || 0) - (a.averageRating || 0)
    } else if (tabValue === 3) { // In Progress
      return (b.progress || 0) - (a.progress || 0)
    }
    return 0 // Default - no sorting
  })

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh' 
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      {/* Hero Banner Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
          color: 'white',
          py: 5,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                Explore Your Learning Journey
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 3, opacity: 0.9 }}>
                Discover top-quality courses designed to enhance your skills and advance your career.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search for courses..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'transparent',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
                alt="Learning"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Category Filter */}
        <Paper sx={{ mb: 4, p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => handleCategoryClick(category)}
                variant={(!selectedCategory && category === 'All') || selectedCategory === category ? 'filled' : 'outlined'}
                color={(!selectedCategory && category === 'All') || selectedCategory === category ? 'primary' : 'default'}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ width: '100%' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              aria-label="course sorting tabs"
            >
              <Tab label="All Courses" />
              <Tab label="Most Popular" />
              <Tab label="Highest Rated" />
              <Tab label="In Progress" />
            </Tabs>
          </Box>
        </Paper>

        {/* Course Results */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            {selectedCategory ? `${selectedCategory} Courses` : 'All Courses'} 
            <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
              ({sortedCourses.length} results)
            </Typography>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ mr: 1 }}>
              <FilterListIcon />
            </IconButton>
            <IconButton size="small">
              <SortIcon />
            </IconButton>
          </Box>
        </Box>
      
        <Grid container spacing={4}>
          {sortedCourses.map((course) => (
            <Grid item key={course.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                    cursor: 'pointer'
                  },
                  borderRadius: 2
                }}
                onClick={() => handleCourseClick(course.id)}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={course.imageUrl}
                  alt={course.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" fontWeight="bold">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                  
                  {course.level && (
                    <Box sx={{ mt: 1, display: 'inline-block', bgcolor: 'primary.light', color: 'white', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.75rem' }}>
                      {course.level}
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '70%' }}>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          backgroundColor: '#e0e0e0', 
                          borderRadius: 5,
                          height: 8
                        }}
                      >
                        <Box
                          sx={{
                            width: `${course.progress || 0}%`,
                            height: '100%',
                            borderRadius: 5,
                            backgroundColor: 'primary.main',
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {course.progress || 0}%
                      </Typography>
                    </Box>
                    
                    <Button 
                      size="small" 
                      variant="outlined" 
                      sx={{ 
                        minWidth: 'auto', 
                        borderRadius: 2,
                        fontSize: '0.7rem'
                      }}
                    >
                      {course.progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                  </Box>
                  
                  {course.instructorName && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Instructor: {course.instructorName}
                    </Typography>
                  )}
                  
                  {course.averageRating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Rating: {course.averageRating.toFixed(1)} • {course.enrollmentCount?.toLocaleString()} enrolled
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
} 