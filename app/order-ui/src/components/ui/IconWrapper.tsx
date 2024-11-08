import React from 'react'
import { IconWrapperProps } from '@/types'

export const IconWrapper: React.FC<IconWrapperProps> = ({ Icon, className, ...props }) => (
  <Icon className={className} {...props} />
)
