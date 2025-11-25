import React, { useEffect, useMemo } from 'react'
import { Box, Button, MenuItem, TextField } from '@mui/material'
import {
  EMAIL_PATTERN,
  EMAIL_PATTERN_MESSAGE,
  GENDER_OPTIONS,
  PHONE_PATTERN,
  PHONE_PATTERN_MESSAGE,
} from '../constants/userFields.js'

export const DEFAULT_USER_VALUES = {
  name: '',
  email: '',
  phone: '',
  website: '',
  gender: '',
  gender_other: '',
  birthdate: '',
}

const getTodayString = () => {
  const today = new Date()
  const offsetMs = today.getTimezoneOffset() * 60_000
  return new Date(today.getTime() - offsetMs).toISOString().slice(0, 10)
}

export default function UserForm({
  onSubmit,
  handleSubmit,
  register,
  watch,
  setValue,
  errors,
  isSubmitting,
  submitLabel = 'Guardar',
  submittingLabel = 'Guardando...',
  onDelete,
  deleteLabel = 'Eliminar',
  shrinkLabels = false,
}) {
  const genderValue = watch('gender')
  const todayString = useMemo(getTodayString, [])

  useEffect(() => {
    if (genderValue !== 'otro') {
      setValue('gender_other', '')
    }
  }, [genderValue, setValue])

  const labelSlotProps = shrinkLabels ? { inputLabel: { shrink: true } } : {}

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2 }}>
      <TextField
        label="Nombre"
        slotProps={labelSlotProps}
        {...register('name', { required: 'Requerido' })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Email"
        type="email"
        slotProps={labelSlotProps}
        {...register('email', {
          required: 'Requerido',
          pattern: { value: EMAIL_PATTERN, message: EMAIL_PATTERN_MESSAGE },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Telefono"
        type="tel"
        slotProps={{ ...labelSlotProps, htmlInput: { maxLength: 10 } }}
        {...register('phone', {
          required: 'Requerido',
          pattern: { value: PHONE_PATTERN, message: PHONE_PATTERN_MESSAGE },
        })}
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />
      <TextField
        label="Genero"
        select
        slotProps={labelSlotProps}
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
          label="Describe el genero"
          slotProps={labelSlotProps}
          {...register('gender_other', { required: 'Describe el genero seleccionado' })}
          error={!!errors.gender_other}
          helperText={errors.gender_other?.message}
        />
      )}
      <TextField
        label="Fecha de nacimiento"
        type="date"
        slotProps={{ inputLabel: { shrink: true } }}
        {...register('birthdate', {
          required: 'Requerido',
          validate: {
            notToday: (value) => value !== todayString || 'La fecha de nacimiento no puede ser la fecha actual',
          },
        })}
        error={!!errors.birthdate}
        helperText={errors.birthdate?.message}
      />
      <TextField label="Website" slotProps={labelSlotProps} {...register('website')} />
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
        {onDelete && (
          <Button type="button" color="error" variant="outlined" onClick={onDelete} disabled={isSubmitting}>
            {deleteLabel}
          </Button>
        )}
      </Box>
    </Box>
  )
}
