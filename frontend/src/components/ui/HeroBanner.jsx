export default function HeroBanner({
  altText,
  className = '',
  framed = true,
  height = 250,
  imageUrl,
}) {
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height
  const frameClassName = framed ? 'rounded-[28px] border border-divider bg-card' : ''

  return (
    <div className={`overflow-hidden ${frameClassName} ${className}`.trim()}>
      <img
        alt={altText}
        className="w-full object-cover"
        src={imageUrl}
        style={{ height: resolvedHeight }}
      />
    </div>
  )
}
