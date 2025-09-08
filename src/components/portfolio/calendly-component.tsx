"use client"

import { useState, useEffect } from "react"
import { Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CalendlyComponentProps {
  calendlyUrl?: string
  isEditMode?: boolean
  onEdit?: () => void
}

export function CalendlyComponent({ calendlyUrl, isEditMode = false, onEdit }: CalendlyComponentProps) {
  const [isEmbedLoaded, setIsEmbedLoaded] = useState(false)
  const [embedError, setEmbedError] = useState(false)

  // Extract Calendly username and event type from URL
  const getCalendlyInfo = (url: string) => {
    try {
      // Handle various Calendly URL formats
      const match = url.match(/calendly\.com\/([^\/]+)(?:\/([^\/\?]+))?/)
      if (match) {
        return {
          username: match[1],
          eventType: match[2] || 'meeting',
          cleanUrl: url.split('?')[0] // Remove query parameters for cleaner display
        }
      }
    } catch (error) {
      console.error('Error parsing Calendly URL:', error)
    }
    return null
  }

  const calendlyInfo = calendlyUrl ? getCalendlyInfo(calendlyUrl) : null

  // Load Calendly embed script
  useEffect(() => {
    if (!calendlyUrl || !calendlyInfo || isEditMode) return

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    script.onload = () => setIsEmbedLoaded(true)
    script.onerror = () => setEmbedError(true)
    
    document.head.appendChild(script)

    return () => {
      // Clean up script when component unmounts
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [calendlyUrl, calendlyInfo, isEditMode])

  // Don't render anything if no Calendly URL
  if (!calendlyUrl || !calendlyInfo) {
    if (isEditMode) {
      return (
        <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden border-dashed border-gray-300">
          <CardContent className="p-6 text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Add Calendly Booking</h3>
            <p className="text-xs text-gray-600 mb-3">Let visitors book meetings with you</p>
            <Button
              onClick={onEdit}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Add Calendly Link
            </Button>
          </CardContent>
        </Card>
      )
    }
    return null
  }

  // Edit mode - show editable version
  if (isEditMode) {
    return (
      <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Book a Meeting</h3>
                <p className="text-xs text-gray-600 truncate">{calendlyInfo.cleanUrl}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="p-1 h-8 w-8"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // View mode - show booking options
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border-0 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Let's Connect</h3>
            <p className="text-sm text-gray-600 mb-3">
              Book a meeting to discuss opportunities or just say hello
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => window.open(calendlyUrl, '_blank', 'noopener,noreferrer')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book a Meeting
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              {isEmbedLoaded && !embedError && (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Trigger Calendly popup
                    if (window.Calendly) {
                      window.Calendly.initPopupWidget({
                        url: calendlyUrl
                      })
                    }
                  }}
                  className="bg-white hover:bg-gray-50"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Quick Book
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Embedded Calendly Widget - Optional */}
        {isEmbedLoaded && !embedError && (
          <div className="mt-6">
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 mb-3 text-center">Or book directly below:</p>
              <div 
                className="calendly-inline-widget" 
                data-url={calendlyUrl}
                style={{ minWidth: '320px', height: '630px' }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Extend Window interface for Calendly
declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: { url: string }) => void
    }
  }
}
