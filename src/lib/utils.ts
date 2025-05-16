import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl(env: string) {
  if (env === 'production') {
    return 'https://blueskryb.cloud'
  }
  if (env === 'preview') {
    return 'https://blueskryb-git-dev-shea-scotts-projects.vercel.app'
  }
  return 'http://127.0.0.1:3000'
}
