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
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import api from '../services/api.js'
import UserForm, { DEFAULT_USER_VALUES } from '../components/UserForm.jsx'

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
  } = useForm({ defaultValues: DEFAULT_USER_VALUES })

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
            <UserForm
              onSubmit={onUpdate}
              handleSubmit={handleSubmit}
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              isSubmitting={isSubmitting}
              submitLabel="Guardar cambios"
              submittingLabel="Guardando..."
              onDelete={onDelete}
              deleteLabel="Eliminar"
              shrinkLabels
            />
          )}
        </CardContent>
      </Card>
      <Snackbar open={!!toast} onClose={() => setToast('')} autoHideDuration={3000} message={toast} />
    </Box>
  )
}
