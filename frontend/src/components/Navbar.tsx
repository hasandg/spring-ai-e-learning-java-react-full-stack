'use client'

import { useState, useEffect } from 'react'
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
  ListItemText,
  Avatar,
  Tooltip,
  Divider
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { usePathname, useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { logout } from '@/store/slices/authSlice'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { AppDispatch } from '@/store'

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  
  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false)
  
  // State for user menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  
  // For client-side auth state detection
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    dispatch(logout())
    router.push('/login')
  }

  const handleProfile = () => {
    handleClose()
    // Future implementation
    console.log('Navigate to profile')
  }

  // Mobile menu component
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700 }}>
        E-LEARNING
      </Typography>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              sx={{ textAlign: 'center' }}
              component={Link}
              href={item.href}
              className={cn(
                "transition-colors",
                pathname === item.href 
                  ? "text-primary-main font-medium" 
                  : "text-gray-700 hover:text-primary-main"
              )}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {!isAuthenticated && (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                sx={{ textAlign: 'center' }}
                component={Link}
                href="/login"
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                sx={{ textAlign: 'center' }}
                component={Link}
                href="/register"
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  )

  // If not mounted yet, don't show auth-dependent UI to prevent hydration mismatch
  if (!mounted) {
    return (
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            E-Learning Platform
          </Typography>
        </Toolbar>
      </AppBar>
    )
  }

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0}
      sx={{ 
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: { xs: 1, sm: 0 }
            }}
            className="text-primary-main"
          >
            E-LEARNING
          </Typography>
          
          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, ml: 4 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                component={Link}
                href={item.href}
                sx={{ 
                  my: 2, 
                  display: 'block',
                  mr: 1,
                  color: pathname === item.href ? 'primary.main' : 'text.primary',
                  fontWeight: pathname === item.href ? 'medium' : 'normal',
                }}
                className={cn(
                  "transition-colors hover:text-primary-main",
                  pathname === item.href && "border-b-2 border-primary-main"
                )}
              >
                {item.name}
              </Button>
            ))}
          </Box>
          
          {/* Auth buttons or user menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open user menu">
                  <IconButton
                    onClick={handleMenu}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar 
                      alt={user?.username || 'User'} 
                      sx={{ bgcolor: 'primary.main' }}
                    >
                      {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleProfile}>My Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Button 
                  component={Link}
                  href="/login"
                  variant="text"
                  sx={{ color: 'text.primary', mr: 1 }}
                  className="hover:text-primary-main transition-colors"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  color="primary"
                  className="shadow-sm"
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  )
} 