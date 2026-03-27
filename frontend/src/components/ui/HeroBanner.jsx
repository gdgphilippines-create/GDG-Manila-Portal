export default function HeroBanner({
  altText,
  className = '',
  framed = true,
  height,
  imageUrl,
  imageFit = 'cover',
}) {
  const frameClassName = framed ? 'rounded-[28px] border border-divider bg-card' : ''
  const imageFitClassName = imageFit === 'contain' ? 'object-contain' : 'object-cover'
  const imageStyle = height == null ? undefined : { height: typeof height === 'number' ? `${height}px` : height }

  return (
    <div className={`overflow-hidden ${frameClassName} ${className}`.trim()}>
      <img
        alt={altText}
        className={`w-full ${imageFitClassName}`.trim()}
        src={imageUrl}
        style={imageStyle}
      />
    </div>
  )
}
