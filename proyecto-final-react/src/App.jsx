import React from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { AuthProvider } from './context/AuthContext.jsx'
import AppRouter from './routes/Router.jsx'

const theme = createTheme({
  palette: { mode: 'light' },
  shape: { borderRadius: 16 },
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  )
}
