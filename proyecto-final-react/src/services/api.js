import axios from 'axios'

const sanitizeBaseUrl = (url) => url.replace(/\/$/, '')

const baseURL = sanitizeBaseUrl(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')
const adminBaseURL = sanitizeBaseUrl(import.meta.env.VITE_ADMIN_API_URL || 'https://jsonplaceholder.typicode.com')

const api = axios.create({ baseURL })
const adminApi = axios.create({ baseURL: adminBaseURL })

const registerInterceptors = (instance, label) => {
  instance.interceptors.request.use((config) => {
    console.log(`[${label}] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  })

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      console.error(`[${label} ERROR]`, err?.response || err)
      return Promise.reject(err)
    }
  )
}

registerInterceptors(api, 'API')
registerInterceptors(adminApi, 'ADMIN API')

export { adminApi }
export default api
