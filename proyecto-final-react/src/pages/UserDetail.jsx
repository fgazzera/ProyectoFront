import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, Card, CardContent, TextField, Typography, Snackbar } from '@mui/material'
import { useForm } from 'react-hook-form'
import api from '../services/api.js'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [toast, setToast] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    ;(async () => {
      const { data } = await api.get(`/users/${id}`)
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone,
        website: data.website,
      })
    })()
  }, [id, reset])

  const onUpdate = async (payload) => {
    await api.put(`/users/${id}`, payload)
    setToast('Usuario actualizado (simulado)')
  }

  return (
    <Box sx={{ p: 2, display: 'grid', gap: 2 }}>
      <Button onClick={() => navigate(-1)}>Volver</Button>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Editar usuario #{id}
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onUpdate)} sx={{ display: 'grid', gap: 2, maxWidth: 520 }}>
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
              InputLabelProps={{ shrink: true }}
              {...register('phone', { required: 'Requerido' })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <TextField
              label="Website"
              InputLabelProps={{ shrink: true }}
              {...register('website')}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={!!toast} onClose={() => setToast('')} autoHideDuration={3000} message={toast} />
    </Box>
  )
}
