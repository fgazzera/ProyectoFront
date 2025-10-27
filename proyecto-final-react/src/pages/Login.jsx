import React from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    await login(data)
    navigate('/usuarios')
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70vh', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Iniciar sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              {...register('email', { required: 'El email es obligatorio' })}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
            <TextField
              label="Contraseña"
              type="password"
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 4, message: 'Mínimo 4 caracteres' },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando…' : 'Ingresar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
