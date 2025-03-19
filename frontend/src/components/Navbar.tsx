'use client'

import React, { useState, useEffect, MouseEvent } from 'react'
import { 
  AppBar, 
  Box, 
  Button, 
  Container, 
  Toolbar, 
  Typography, 
  IconButton, 
  Menu,
  MenuItem, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import HomeIcon from '@mui/icons-material/Home'
import SchoolIcon from '@mui/icons-material/School'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import BookIcon from '@mui/icons-material/Book'
import Logo from './Logo'

// Define types for our menu items and event handlers
type MenuItemType = {
  text: string;
  icon: JSX.Element;
  path: string;
  protected?: boolean;
  authRequired?: boolean;
};

const navigationItems = [
  { name: 'Home', href: '/', icon: <HomeIcon /> },
  { name: 'Courses', href: '/courses', icon: <SchoolIcon /> },
  { name: 'About', href: '/about', icon: null },
]

const Navbar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInitial, setUserInitial] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
      setIsAuthenticated(!!token)
      
      // Get user data and extract first letter of name or username
      if (token) {
        try {
          const userData = localStorage.getItem('user')
          if (userData) {
            const user = JSON.parse(userData)
            const initial = user.name || user.username || user.email || ''
            setUserInitial(initial.charAt(0).toUpperCase())
          }
        } catch (error) {
          console.error('Error parsing user data:', error)
          setUserInitial('U')
        }
      }
    }
    
    // Initial check
    checkAuth()
    
    // Listen for storage events to update auth state
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('auth_token')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    
    // Also clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    
    // Trigger storage event for other components to detect auth change
    window.dispatchEvent(new Event('storage'))
    
    // Redirect directly to home page instead of login
    window.location.href = '/'
  }

  const handleLogin = () => {
    // Use direct location change with bypass parameter to prevent middleware redirection
    window.location.href = '/login?bypass_redirect=true'
  }

  const handleRegister = () => {
    // Use direct location change with bypass parameter to prevent middleware redirection
    window.location.href = '/register?bypass_redirect=true'
  }

  const handleNavigation = (path: string, isProtected: boolean = false) => {
    // Close drawer if open (mobile)
    if (drawerOpen) {
      setDrawerOpen(false)
    }
    
    // If trying to access protected route while not authenticated, go to login
    if (isProtected && !isAuthenticated) {
      router.push('/login')
      return
    }
    
    // For authenticated routes, use auth param
    if (isProtected) {
      window.location.href = `${path}?auth=true`
      return
    }
    
    // For non-protected routes, use router
    router.push(path)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    handleProfileMenuClose()
    handleNavigation('/profile', true)
  }

  // Public menu items always visible
  const publicMenuItems: MenuItemType[] = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Courses', icon: <SchoolIcon />, path: '/courses' },
  ]
  
  // Protected menu items only visible when authenticated
  const protectedMenuItems: MenuItemType[] = [
    { text: 'My Learning', icon: <BookIcon />, path: '/my-courses', protected: true, authRequired: true },
    { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile', protected: true, authRequired: true },
  ]
  
  // Get the appropriate menu items based on authentication status
  const menuItems = [...publicMenuItems, ...(isAuthenticated ? protectedMenuItems : [])]

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <Box 
        sx={{ p: 2, display: 'flex', justifyContent: 'center', cursor: 'pointer' }} 
        onClick={() => handleNavigation('/')}
      >
        <Logo size="medium" />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem disablePadding key={item.text}>
            <ListItemButton 
              onClick={() => handleNavigation(item.path, item.protected)}
              selected={pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleProfileClick}>
              <ListItemIcon><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogin}>
                <ListItemIcon><LoginIcon /></ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleRegister}>
                <ListItemIcon><PersonAddIcon /></ListItemIcon>
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 1 }}>
        <Toolbar>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          
          <Box 
            sx={{ flexGrow: isMobile ? 1 : 0, mr: 2, cursor: 'pointer' }} 
            onClick={() => handleNavigation('/')}
          >
            <Logo size={isMobile ? 'small' : 'medium'} variant={isMobile ? 'compact' : 'full'} />
          </Box>
          
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.text}
                  color="inherit" 
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path, item.protected)}
                  sx={{ 
                    color: pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    },
                    position: 'relative',
                    '&::after': pathname === item.path ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: theme.palette.primary.main
                    } : {}
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          {!isMobile && (
            <>
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                        {userInitial || 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    color="inherit"
                    onClick={handleLogin}
                    startIcon={<LoginIcon />}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained"
                    color="primary"
                    onClick={handleRegister}
                    startIcon={<PersonAddIcon />}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>

      {/* Add profile menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileClick}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{userInitial || 'U'}</Avatar> My Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default Navbar 