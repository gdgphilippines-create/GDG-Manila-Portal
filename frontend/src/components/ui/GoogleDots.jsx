const dotClassNames = ['bg-google-blue', 'bg-google-red', 'bg-google-yellow', 'bg-google-green']

export default function GoogleDots({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`.trim()}>
      {dotClassNames.map((dotClassName, index) => (
        <span
          className={`h-2.5 w-2.5 rounded-full ${dotClassName} animate-[pulse_1.5s_ease-in-out_infinite]`}
          key={dotClassName}
          style={{ animationDelay: `${index * 0.2}s` }}
        />
      ))}
    </div>
  )
}
