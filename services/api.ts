import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies()
let isRefreshing = false
let failedRequesQueue = []

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["nextauth.token"]}`,
  },
});

// Renew token case expired
api.interceptors.response.use(response => {
  return response
}, (error: AxiosError) => {
  if (error.response.status === 401) {
    if (error.response.data?.code === "token.expired") {
      const cookies = parseCookies();

      const {'nextauth.refreshToken': refreshToken} = cookies
      const originaConfig = error.config

      if (!isRefreshing) {
        isRefreshing = true

        api.post('/refresh', {
          refreshToken,
        }).then(response => {
          const { token } = response.data
  
          setCookie(null, "nextauth.token", token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
          });
    
          setCookie(null, "nextauth.refreshToken", response.data.refreshToken, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
          });  
  
          api.defaults.headers['Authorization'] = `Bearer ${token}`

          failedRequesQueue.forEach(request => request.onSuccess(token))
          failedRequesQueue = []
        }).catch(error => {
          failedRequesQueue.forEach(request => request.onFailure(error))
          failedRequesQueue = []
        }).finally(() => {
          isRefreshing = false
        })
      }

      return new Promise((resolve, reject) => {
        failedRequesQueue.push({
          onSuccess: (token: string) => {
            originaConfig.headers['Authorization'] = `Bearer ${token}`

            resolve(api(originaConfig))
          },
          onFailure: (error: AxiosError) => {
            reject(error)
          }
        })
      })
    } else {

    }
  }
})