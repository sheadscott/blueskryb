import { CookiePreferencesButton } from '@/components/ui/cookie-preferences-button'
import StyledLink from '@/components/ui/styled-link'

export default function Footer() {
  return (
    <footer className="flex justify-between w-full mt-auto min-h-8 md:min-h-16">
      <CookiePreferencesButton />
      <nav>
        <StyledLink href="/privacy">Privacy Policy</StyledLink>
      </nav>
    </footer>
  )
}
