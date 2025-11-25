import React, { useMemo, useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { AuthProvider } from './context/AuthContext.jsx'
import AppRouter from './routes/Router.jsx'

export default function App() {
  const [mode, setMode] = useState('dark')

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        shape: { borderRadius: 16 },
      }),
    [mode],
  )

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRouter mode={mode} onToggleMode={toggleMode} />
      </AuthProvider>
    </ThemeProvider>
  )
}
