'use client'
import { useEffect, useRef } from 'react'

interface BookshopWidgetProps {
  isbn13: string
}

export function BookshopWidget({ isbn13 }: BookshopWidgetProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Remove any previous script for this widget
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current)
    }
    // Create the widget script
    const script = document.createElement('script')
    script.src = 'https://bookshop.org/widgets.js'
    script.setAttribute('data-type', 'book_button')
    script.setAttribute('data-affiliate-id', '113619')
    script.setAttribute('data-sku', isbn13)
    script.async = true
    scriptRef.current = script
    // Append to this component's container
    const container = document.getElementById(`bookshop-widget-${isbn13}`)
    if (container) {
      container.appendChild(script)
    }
    // Cleanup
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
    }
  }, [isbn13])

  return <div id={`bookshop-widget-${isbn13}`} />
}
