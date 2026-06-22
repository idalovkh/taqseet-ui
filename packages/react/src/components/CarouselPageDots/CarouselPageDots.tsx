import './CarouselPageDots.css'

const MAX_DOTS = 9

function getDotIndices(count: number, activeIndex: number): number[] {
  if (count <= MAX_DOTS) {
    return Array.from({ length: count }, (_, index) => index)
  }

  const half = Math.floor(MAX_DOTS / 2)
  let start = Math.max(0, activeIndex - half)
  const end = Math.min(count - 1, start + MAX_DOTS - 1)
  start = Math.max(0, end - MAX_DOTS + 1)

  return Array.from({ length: end - start + 1 }, (_, offset) => start + offset)
}

interface CarouselPageDotsProps {
  count: number
  activeIndex: number
}

export function CarouselPageDots({ count, activeIndex }: CarouselPageDotsProps) {
  if (count <= 1) return null

  const indices = getDotIndices(count, activeIndex)

  return (
    <div className="carousel-page-dots" aria-hidden="true">
      {indices.map((index) => (
        <span
          key={index}
          className={`carousel-page-dots__dot${index === activeIndex ? ' is-active' : ''}`}
        />
      ))}
    </div>
  )
}
