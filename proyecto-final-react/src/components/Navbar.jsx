import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

export default function Navbar({ mode, onToggleMode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const currentMode = mode === 'light' ? 'light' : 'dark'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleToggleTheme = () => {
    if (onToggleMode) {
      onToggleMode()
    }
  }

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Gestión de Usuarios
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton
            color="inherit"
            size="small"
            aria-label="Cambiar tema"
            onClick={handleToggleTheme}
          >
            {currentMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/usuarios">
                Usuarios
              </Button>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {user.name}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Salir
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
