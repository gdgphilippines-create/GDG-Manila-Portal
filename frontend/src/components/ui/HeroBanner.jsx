export default function HeroBanner({
  altText,
  className = '',
  height = 250,
  imageUrl,
}) {
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height

  return (
    <div className={`overflow-hidden rounded-[28px] border border-divider bg-card ${className}`.trim()}>
      <img
        alt={altText}
        className="w-full object-cover"
        src={imageUrl}
        style={{ height: resolvedHeight }}
      />
    </div>
  )
}
