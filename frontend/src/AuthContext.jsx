import { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('wellverse_token')
    if (token) {
      api.getMe().then(setUser).catch(() => localStorage.removeItem('wellverse_token')).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.login({ email, password })
    localStorage.setItem('wellverse_token', res.access_token)
    setUser(res.user)
    return res.user
  }

  const register = async (email, password, full_name) => {
    const res = await api.register({ email, password, full_name })
    localStorage.setItem('wellverse_token', res.access_token)
    setUser(res.user)
    return res.user
  }

  const logout = () => {
    localStorage.removeItem('wellverse_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
