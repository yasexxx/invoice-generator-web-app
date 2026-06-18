import { Input } from '@/components/ui'

export interface TaxDiscountSectionProps {
  taxPercent:       number
  discount:         number
  onTaxChange:      (v: number) => void
  onDiscountChange: (v: number) => void
}

export function TaxDiscountSection({ taxPercent, discount, onTaxChange, onDiscountChange }: TaxDiscountSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-lg">
      <Input
        label="TAX (%)"
        icon="percent"
        type="number"
        min={0}
        value={taxPercent}
        onChange={(e) => onTaxChange(Number(e.target.value))}
      />
      <Input
        label="DISCOUNT ($)"
        icon="sell"
        type="number"
        min={0}
        value={discount}
        onChange={(e) => onDiscountChange(Number(e.target.value))}
      />
    </div>
  )
}
