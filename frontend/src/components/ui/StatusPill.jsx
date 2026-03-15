import { LuCircle } from 'react-icons/lu'
import { tonePatterns } from '@/styles/theme'
import TonePill from './TonePill'

export default function StatusPill({ label, tone = 'neutral', icon = null }) {
  return (
    <TonePill
      className={tonePatterns.statusClassNames[tone] ?? tonePatterns.statusClassNames.neutral}
      icon={icon ?? <LuCircle aria-hidden="true" className="h-3 w-3 fill-current stroke-[2.5]" />}
    >
      {label}
    </TonePill>
  )
}
