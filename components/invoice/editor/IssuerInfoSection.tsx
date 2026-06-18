import { Input, Textarea } from '@/components/ui'

export interface IssuerInfoSectionProps {
  issuerName:    string
  issuerAddress: string
  onChange:      (field: 'issuerName' | 'issuerAddress', value: string) => void
}

export function IssuerInfoSection({ issuerName, issuerAddress, onChange }: IssuerInfoSectionProps) {
  return (
    <div className="flex flex-col gap-md">
        <Input
          id="issuer-name"
          label="ORGANIZATION NAME"
          type="text"
          value={issuerName}
          placeholder="Acme Inc."
          onChange={(e) => onChange('issuerName', e.target.value)}
        />
        <Textarea
          id="issuer-address"
          label="ORGANIZATION ADDRESS"
          rows={2}
          value={issuerAddress}
          placeholder="123 Business Ave, San Francisco, CA"
          resize="none"
          onChange={(e) => onChange('issuerAddress', e.target.value)}
        />
    </div>
  )
}
