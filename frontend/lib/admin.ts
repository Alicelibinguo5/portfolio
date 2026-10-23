import { useEffect, useState } from 'react'

// The admin token lives only in this browser's localStorage. The backend
// checks it on every write (X-Admin-Token), so hiding UI is cosmetic.
const STORAGE_KEY = 'adminToken'

export function getAdminToken(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function setAdminToken(token: string) {
  try {
    if (token) localStorage.setItem(STORAGE_KEY, token)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage unavailable (private mode); token just won't persist
  }
}

export function adminHeaders(token: string = getAdminToken()): Record<string, string> {
  return token ? { 'X-Admin-Token': token } : {}
}

export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    setIsAdmin(Boolean(getAdminToken()))
  }, [])
  return isAdmin
}
