const INPUT_CLS = 'w-full bg-surface-container border border-outline-variant/40 rounded-lg px-md py-sm text-on-surface outline-none'

interface TaxDiscountSectionProps {
  taxPercent:      number
  discount:        number
  onTaxChange:     (v: number) => void
  onDiscountChange:(v: number) => void
}

export function TaxDiscountSection({ taxPercent, discount, onTaxChange, onDiscountChange }: TaxDiscountSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-lg">
      <NumericField
        label="TAX (%)"
        icon="percent"
        value={taxPercent}
        onChange={onTaxChange}
      />
      <NumericField
        label="DISCOUNT ($)"
        icon="sell"
        value={discount}
        onChange={onDiscountChange}
      />
    </div>
  )
}

interface NumericFieldProps {
  label:    string
  icon:     string
  value:    number
  onChange: (v: number) => void
}

function NumericField({ label, icon, value, onChange }: NumericFieldProps) {
  return (
    <div className="space-y-sm">
      <label className="flex items-center gap-sm label-md text-text-muted">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
        {label}
      </label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={INPUT_CLS}
      />
    </div>
  )
}
