export interface User {
  id: number
  did: string
  handle: string
  name: string
  displayName?: string | null
  avatar: string | null
}
