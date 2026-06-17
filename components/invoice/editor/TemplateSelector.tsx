import type { TemplateId } from '../invoice.types'

interface Template {
  id: TemplateId
  label: string
  isPro: boolean
  previewClass: string
}

const TEMPLATES: Template[] = [
  { id: 'minimalist',   label: 'Minimalist',   isPro: false, previewClass: 'bg-white' },
  { id: 'corporate',    label: 'Corporate',    isPro: true,  previewClass: 'bg-gradient-to-br from-surface-container to-surface-container-highest' },
  { id: 'modern-dark',  label: 'Modern Dark',  isPro: true,  previewClass: 'bg-gradient-to-tr from-surface-container-low to-surface-container-highest' },
  { id: 'classic',      label: 'Classic',      isPro: false, previewClass: 'bg-gray-50' },
]

interface TemplateSelectorProps {
  selected: TemplateId
  onChange: (id: TemplateId) => void
}

export function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between text-primary">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined">palette</span>
          <h2 className="title-md">Template Style</h2>
        </div>
        <span className="label-sm text-text-muted uppercase tracking-widest">
          {TEMPLATES.length} Styles Available
        </span>
      </div>
      <div className="grid grid-cols-2 gap-md">
        {TEMPLATES.map((t) => (
          <TemplateCard key={t.id} template={t} isSelected={selected === t.id} onSelect={onChange} />
        ))}
      </div>
    </div>
  )
}

interface TemplateCardProps {
  template: Template
  isSelected: boolean
  onSelect: (id: TemplateId) => void
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  const { id, label, isPro, previewClass } = template

  return (
    <button
      onClick={() => onSelect(id)}
      className={`relative group flex flex-col gap-sm text-left transition-opacity ${
        isSelected ? '' : 'opacity-60 hover:opacity-100'
      }`}
    >
      <div
        className={`aspect-[1/1.414] w-full rounded border-2 overflow-hidden transition-all ${previewClass} ${
          isSelected
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-outline-variant/30 group-hover:border-primary/50'
        }`}
      />
      <div className="flex justify-between items-center">
        <span className={`label-sm font-bold ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
          {label}
        </span>
        {isPro ? <ProBadge /> : <span className="label-sm text-text-muted">Free</span>}
      </div>
      {isSelected && <SelectedCheck />}
    </button>
  )
}

function ProBadge() {
  return (
    <div className="flex items-center gap-xs bg-tertiary-container/30 text-tertiary px-xs rounded">
      <span className="material-symbols-outlined text-[10px]">crown</span>
      <span className="text-[8px] font-bold uppercase">PRO</span>
    </div>
  )
}

function SelectedCheck() {
  return (
    <div className="absolute -top-2 -right-2 bg-primary text-on-primary-fixed rounded-full p-0.5">
      <span className="material-symbols-outlined text-[14px] block">check</span>
    </div>
  )
}
