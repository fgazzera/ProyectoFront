import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api, { adminApi } from '../services/api.js'
import {
  EMAIL_PATTERN,
  EMAIL_PATTERN_MESSAGE,
  GENDER_OPTIONS,
  PHONE_PATTERN,
  PHONE_PATTERN_MESSAGE,
  formatBirthdate,
  formatGenderLabel,
} from '../constants/userFields.js'

const DEFAULT_FORM_VALUES = {
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

export default function Users() {
  const [users, setUsers] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const [error, setError] = useState('')
  const [adminError, setAdminError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showAdminSection, setShowAdminSection] = useState(true)
  const [showBasicSection, setShowBasicSection] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_FORM_VALUES })

  const genderValue = watch('gender')

  useEffect(() => {
    if (genderValue !== 'otro') {
      setValue('gender_other', '')
    }
  }, [genderValue, setValue])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/users')
      setUsers(data)
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAdminUsers = useCallback(async () => {
    setAdminLoading(true)
    setAdminError('')
    try {
      const { data } = await adminApi.get('/users')
      setAdminUsers(data)
    } catch (err) {
      console.error(err)
      setAdminError('No se pudieron cargar los administradores')
    } finally {
      setAdminLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
    fetchAdminUsers()
  }, [fetchUsers, fetchAdminUsers])

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast)
      navigate(location.pathname, { replace: true })
    }
  }, [location, navigate])

  const onCreate = async (formValues) => {
    try {
      const payload = buildPayload(formValues)
      const { data } = await api.post('/users', payload)
      setToast(`Usuario "${data.name}" creado`)
      reset(DEFAULT_FORM_VALUES)
      setShowForm(false)
      await fetchUsers()
    } catch (err) {
      console.error(err)
      setToast('No se pudo crear el usuario')
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`¿Eliminar al usuario "${user.name}"?`)) return
    try {
      await api.delete(`/users/${user.id}`)
      setToast(`Usuario "${user.name}" eliminado`)
      await fetchUsers()
    } catch (err) {
      console.error(err)
      setToast('No se pudo eliminar el usuario')
    }
  }

  return (
    <Box sx={{ p: 2, display: 'grid', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h4">Usuarios</Typography>
        <Button variant={showForm ? 'outlined' : 'contained'} onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'Ocultar formulario' : 'Nuevo usuario'}
        </Button>
      </Box>

      {showForm && (
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
                {...register('email', { required: 'Requerido', pattern: { value: EMAIL_PATTERN, message: EMAIL_PATTERN_MESSAGE } })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Teléfono"
                type="tel"
                inputProps={{ maxLength: 10 }}
                {...register('phone', { required: 'Requerido', pattern: { value: PHONE_PATTERN, message: PHONE_PATTERN_MESSAGE } })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
              <TextField
                label="Género"
                select
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
              <TextField label="Website" {...register('website')} />
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'grid', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Usuarios Administradores
          </Typography>
          <IconButton onClick={() => setShowAdminSection((prev) => !prev)} size="small" aria-label="toggle-admins">
            {showAdminSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Estos usuarios provienen del servicio externo y solo pueden visualizarse.
        </Typography>
        <Collapse in={showAdminSection}>
          {adminLoading ? (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 160 }}>
              <CircularProgress size={32} />
            </Box>
          ) : adminError ? (
            <Alert severity="warning">{adminError}</Alert>
          ) : adminUsers.length === 0 ? (
            <Typography>No hay administradores disponibles.</Typography>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {adminUsers.map((admin) => (
                <Grid item key={`admin-${admin.id}`} xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ display: 'grid', gap: 0.5 }}>
                      <Typography variant="h6">{admin.name}</Typography>
                      <Typography variant="body2">{admin.email}</Typography>
                      <Typography variant="body2">{admin.phone}</Typography>
                      {admin.website && (
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {admin.website}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Solo lectura
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Collapse>
      </Box>

      <Box sx={{ display: 'grid', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Usuarios Básicos
          </Typography>
          <IconButton onClick={() => setShowBasicSection((prev) => !prev)} size="small" aria-label="toggle-basic">
            {showBasicSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Estos son los usuarios internos que podés crear, editar o eliminar.
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Collapse in={showBasicSection}>
          {loading ? (
            <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : users.length === 0 ? (
            <Typography>No hay usuarios aún. Creá el primero con el botón "Nuevo usuario".</Typography>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {users.map((u) => (
                <Grid item key={u.id} xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent sx={{ display: 'grid', gap: 1 }}>
                      <Typography variant="h6">{u.name}</Typography>
                      <Typography variant="body2">{u.email}</Typography>
                      <Typography variant="body2">{u.phone}</Typography>
                      <Typography variant="body2">Género: {formatGenderLabel(u.gender, u.gender_other)}</Typography>
                      <Typography variant="body2">Nacimiento: {formatBirthdate(u.birthdate)}</Typography>
                      {u.website && (
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {u.website}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        <Button component={Link} to={`/usuarios/${u.id}`} variant="outlined" size="small">
                          Ver detalle
                        </Button>
                        <Button variant="text" size="small" color="error" onClick={() => handleDelete(u)}>
                          Eliminar
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Collapse>
      </Box>

      <Snackbar open={!!toast} onClose={() => setToast('')} autoHideDuration={3000} message={toast} />
    </Box>
  )
}
