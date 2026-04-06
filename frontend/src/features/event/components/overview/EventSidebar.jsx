import { BsFacebook, BsInstagram, BsLinkedin } from 'react-icons/bs'
import { SiBevy } from 'react-icons/si'
import { LuCalendarDays, LuMapPin } from 'react-icons/lu'
import { socialLinks } from '@/constants/social'
import { socialLinkChipClassName } from '@/styles/theme'

const socialIconMap = {
  instagram: BsInstagram,
  facebook: BsFacebook,
  linkedin: BsLinkedin,
  bevy: SiBevy,
}

export default function EventSidebar({ dateRange, location }) {
  return (
    <aside className="lg:col-span-4" data-purpose="event-sidebar">
      <div className="border-t border-divider pt-6 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
        <p className="type-label tracking-label-wide">
          Event Details
        </p>
        <div className="mt-4 space-y-3">
          {location ? (
            <div className="flex items-start gap-3">
              <LuMapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted" />
              <span className="type-body">{location}</span>
            </div>
          ) : null}
          {dateRange ? (
            <div className="flex items-start gap-3">
              <LuCalendarDays aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted" />
              <span className="type-body">{dateRange}</span>
            </div>
          ) : null}
        </div>

        {socialLinks.length > 0 ? (
          <div className="mt-6 border-t border-divider pt-5">
            <p className="type-label tracking-label-wide">
              Connect with us
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              {socialLinks.map((link) => {
                const Icon = socialIconMap[link.id]

                return (
                  <a
                    aria-label={link.ariaLabel}
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-type-caption font-medium transition ${socialLinkChipClassName}`.trim()}
                    href={link.href}
                    key={link.id}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {Icon ? (
                      <Icon
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-muted"
                      />
                    ) : null}
                    <span>{link.label}</span>
                  </a>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
