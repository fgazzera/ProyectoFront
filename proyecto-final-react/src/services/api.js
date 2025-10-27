import axios from 'axios'

const api = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com' })

api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API ERROR]', err?.response || err)
    return Promise.reject(err)
  }
)

export default api
