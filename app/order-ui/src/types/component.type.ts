export interface ISidebarDrawerProps {
  minimized?: boolean
}

export interface IconWrapperProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> // Ensure Icon is a component SVG
  className?: string
}
