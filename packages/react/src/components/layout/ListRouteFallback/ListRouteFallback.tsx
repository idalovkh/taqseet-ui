import { PageContent, type PageContentVariant } from '../PageContent'
import './ListRouteFallback.css'

export interface ListRouteFallbackProps {
  className?: string
  minHeight?: number
  variant?: Extract<PageContentVariant, 'default' | 'detail' | 'hub'>
}

/** Stable placeholder while lazy routes load — matches target page shell */
export function ListRouteFallback({
  className,
  minHeight = 938,
  variant = 'default',
}: ListRouteFallbackProps) {
  return (
    <PageContent variant={variant} className={className}>
      <div className="list-route-fallback" style={{ minHeight }} aria-hidden="true" />
    </PageContent>
  )
}
