'use client'

import type React from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface TruncatedTooltipTextProps {
  text: string | null | undefined
  maxLength?: number
  className?: string
}

export const TruncatedTooltipText: React.FC<TruncatedTooltipTextProps> = ({
  text,
  maxLength = 40,
  className = '',
}) => {
  const safeText = text ?? ''
  const truncated = safeText.length > maxLength
  const displayText = truncated ? safeText.slice(0, maxLength) + '\u2026' : safeText

  if (truncated) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={className + ' truncate'}>{displayText}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>{text}</span>
        </TooltipContent>
      </Tooltip>
    )
  }
  return <span className={className}>{displayText}</span>
}
