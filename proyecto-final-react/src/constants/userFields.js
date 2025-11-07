const GENDER_OPTIONS = [
  { value: 'femenino', label: 'Femenino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'otro', label: 'Otro' },
]

const EMAIL_ALLOWED_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com']
const EMAIL_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@(gmail|hotmail|outlook|yahoo|live)\.com$/i
const EMAIL_PATTERN_MESSAGE = `El email debe comenzar con letra o número y terminar en: ${EMAIL_ALLOWED_DOMAINS.join(', ')}`

const PHONE_PATTERN = /^[1-9]\d{9}$/
const PHONE_PATTERN_MESSAGE = 'El teléfono debe tener 10 dígitos numéricos y no puede iniciar con 0'

const formatGenderLabel = (gender, otherValue) => {
  if (gender === 'otro') return otherValue || 'Otro'
  if (gender === 'femenino') return 'Femenino'
  if (gender === 'masculino') return 'Masculino'
  return gender
}

const formatBirthdate = (isoString) => {
  if (!isoString) return 'Sin registrar'
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString
  return date.toLocaleDateString('es-AR', { timeZone: 'UTC' })
}

export {
  EMAIL_ALLOWED_DOMAINS,
  EMAIL_PATTERN,
  EMAIL_PATTERN_MESSAGE,
  GENDER_OPTIONS,
  PHONE_PATTERN,
  PHONE_PATTERN_MESSAGE,
  formatBirthdate,
  formatGenderLabel,
}

