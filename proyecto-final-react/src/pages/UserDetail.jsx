import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import api from '../services/api.js'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    const loadUser = async () => {
      setError('')
      setLoading(true)
      try {
        const { data } = await api.get(`/users/${id}`)
        reset({
          name: data.name,
          email: data.email,
          phone: data.phone,
          website: data.website,
        })
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar el usuario')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [id, reset])

  const onUpdate = async (payload) => {
    try {
      const { data } = await api.put(`/users/${id}`, payload)
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone,
        website: data.website,
      })
      setToast('Usuario actualizado')
    } catch (err) {
      console.error(err)
      setToast('No se pudo actualizar el usuario')
    }
  }

  const onDelete = async () => {
    if (!window.confirm('¿Eliminar este usuario?')) return
    try {
      await api.delete(`/users/${id}`)
      navigate('/usuarios', { state: { toast: 'Usuario eliminado' } })
    } catch (err) {
      console.error(err)
      setToast('No se pudo eliminar el usuario')
    }
  }

  return (
    <Box sx={{ p: 2, display: 'grid', gap: 2 }}>
      <Button onClick={() => navigate(-1)}>Volver</Button>
      <Card sx={{ maxWidth: 640 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Editar usuario #{id}
          </Typography>
          {loading ? (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit(onUpdate)} sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="Nombre"
                InputLabelProps={{ shrink: true }}
                {...register('name', { required: 'Requerido' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                label="Email"
                type="email"
                InputLabelProps={{ shrink: true }}
                {...register('email', { required: 'Requerido' })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Teléfono"
                type="tel"
                InputLabelProps={{ shrink: true }}
                {...register('phone', { required: 'Requerido' })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
              <TextField label="Website" InputLabelProps={{ shrink: true }} {...register('website')} />
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <Button type="button" color="error" variant="outlined" onClick={onDelete} disabled={isSubmitting}>
                  Eliminar
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
      <Snackbar open={!!toast} onClose={() => setToast('')} autoHideDuration={3000} message={toast} />
    </Box>
  )
}

