'use client'

import { InvoicePrefixSection }   from './InvoicePrefixSection'
import { InvoiceDefaultsSection } from './InvoiceDefaultsSection'
import type { InvoiceSettingsData } from '@/app/settings/invoice-settings-actions'
import type { InvoicePreferences }  from '@/app/settings/invoice-preferences-actions'

export interface InvoiceSettingsSectionProps {
  initialData:        InvoiceSettingsData | null
  initialPreferences: InvoicePreferences | null
}

export function InvoiceSettingsSection({ initialData, initialPreferences }: InvoiceSettingsSectionProps) {
  return (
    <div className="flex flex-col gap-xl">
      <InvoicePrefixSection initialData={initialData} />
      <InvoiceDefaultsSection initialPreferences={initialPreferences} />
    </div>
  )
}
