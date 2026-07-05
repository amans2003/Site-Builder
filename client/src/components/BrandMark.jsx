export function BrandMark({ size = 'md', className = '' }) {
  const sizes = {
    sm: { box: 'w-6 h-6', text: 'text-sm', rounded: 'rounded-[6px]' },
    md: { box: 'w-8 h-8', text: 'text-lg', rounded: 'rounded-lg' },
    lg: { box: 'w-11 h-11', text: 'text-2xl', rounded: 'rounded-xl' },
  }[size]

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${sizes.box} ${sizes.rounded} bg-indigo-600 flex flex-col items-center justify-center gap-[3px] shrink-0`}
        aria-hidden="true"
      >
        <span className="block w-3/5 h-[2px] rounded-full bg-white" />
        <span className="block w-2/5 h-[2px] rounded-full bg-white/85 self-start ml-[22%]" />
        <span className="block w-1/2 h-[2px] rounded-full bg-white/65 self-start ml-[22%]" />
      </div>
      <span className={`${sizes.text} font-semibold text-gray-900 tracking-tight`}>Site Builder</span>
    </div>
  )
}
