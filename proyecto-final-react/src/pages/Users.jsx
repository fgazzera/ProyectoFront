import React, { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Snackbar, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import api from '../services/api.js'
import { Link } from 'react-router-dom'

export default function Users() {
  const [users, setUsers] = useState([])
  const [toast, setToast] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const fetchUsers = async () => {
    const { data } = await api.get('/users')
    setUsers(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const onCreate = async (payload) => {
    const { data } = await api.post('/users', payload)
    setToast(`Usuario creado (id simulado: ${data.id || 'nuevo'})`)
    reset()
  }

  return (
    <Box sx={{ p: 2, display: 'grid', gap: 3 }}>
      <Typography variant="h4">Usuarios</Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Crear nuevo usuario
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onCreate)} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Nombre"
              {...register('name', { required: 'Requerido' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Email"
              type="email"
              {...register('email', { required: 'Requerido' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Teléfono"
              {...register('phone', { required: 'Requerido' })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
            <TextField label="Website" {...register('website')} />
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Creando…' : 'Crear'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {users.map((u) => (
          <Grid item key={u.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{u.name}</Typography>
                <Typography variant="body2">{u.email}</Typography>
                <Typography variant="body2">{u.phone}</Typography>
                <Typography variant="body2">{u.website}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Button component={Link} to={`/usuarios/${u.id}`} variant="outlined" size="small">
                    Ver detalle
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={!!toast} onClose={() => setToast('')} autoHideDuration={3000} message={toast} />
    </Box>
  )
}
