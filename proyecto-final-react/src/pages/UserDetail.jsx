import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import api from '../services/api.js'
import {
  EMAIL_PATTERN,
  EMAIL_PATTERN_MESSAGE,
  GENDER_OPTIONS,
  PHONE_PATTERN,
  PHONE_PATTERN_MESSAGE,
} from '../constants/userFields.js'

const DEFAULT_VALUES = {
  name: '',
  email: '',
  phone: '',
  website: '',
  gender: 'femenino',
  gender_other: '',
  birthdate: '',
}

const buildPayload = (values) => {
  const website = values.website?.trim()
  return {
    ...values,
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    website: website || undefined,
    gender_other: values.gender === 'otro' ? values.gender_other : undefined,
  }
}

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
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES })

  const genderValue = watch('gender')

  useEffect(() => {
    if (genderValue !== 'otro') {
      setValue('gender_other', '')
    }
  }, [genderValue, setValue])

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
          website: data.website ?? '',
          gender: data.gender,
          gender_other: data.gender === 'otro' ? data.gender_other ?? '' : '',
          birthdate: data.birthdate ? data.birthdate.slice(0, 10) : '',
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

  const onUpdate = async (formValues) => {
    try {
      const payload = buildPayload(formValues)
      await api.put(`/users/${id}`, payload)
      navigate('/usuarios', { state: { toast: 'Usuario actualizado' } })
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
                {...register('email', { required: 'Requerido', pattern: { value: EMAIL_PATTERN, message: EMAIL_PATTERN_MESSAGE } })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Teléfono"
                type="tel"
                inputProps={{ maxLength: 10 }}
                InputLabelProps={{ shrink: true }}
                {...register('phone', { required: 'Requerido', pattern: { value: PHONE_PATTERN, message: PHONE_PATTERN_MESSAGE } })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
              <TextField
                label="Género"
                select
                InputLabelProps={{ shrink: true }}
                {...register('gender', { required: 'Requerido' })}
                error={!!errors.gender}
                helperText={errors.gender?.message}
              >
                {GENDER_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {genderValue === 'otro' && (
                <TextField
                  label="Describe el género"
                  InputLabelProps={{ shrink: true }}
                  {...register('gender_other', { required: 'Describe el género seleccionado' })}
                  error={!!errors.gender_other}
                  helperText={errors.gender_other?.message}
                />
              )}
              <TextField
                label="Fecha de nacimiento"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('birthdate', { required: 'Requerido' })}
                error={!!errors.birthdate}
                helperText={errors.birthdate?.message}
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

