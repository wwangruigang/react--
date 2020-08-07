import React from 'react'
import axios from 'axios'
import { BASE_URL } from './url'
import { getToken } from './token'

axios.defaults.baseURL = BASE_URL

// 通过请求拦截器，携带toke过去
axios.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

React.Component.prototype.$axios = axios

export { axios }
