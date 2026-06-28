import type { ReactNode } from 'react'

export interface SettingsSectionProps {
  label: string
  footnote?: string
  children: ReactNode
}

export function SettingsSection({ label, footnote, children }: SettingsSectionProps) {
  const sectionId = label.replace(/\s+/g, '-').toLowerCase()

  return (
    <section className="settings-section" aria-labelledby={`settings-section-${sectionId}`}>
      <h3 className="settings-section__label" id={`settings-section-${sectionId}`}>
        {label}
      </h3>
      {children}
      {footnote ? <p className="settings-section__footnote">{footnote}</p> : null}
    </section>
  )
}
