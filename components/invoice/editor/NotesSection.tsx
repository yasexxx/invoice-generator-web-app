import { Textarea } from '@/components/ui'

interface NotesSectionProps {
  notes:    string
  onChange: (v: string) => void
}

export function NotesSection({ notes, onChange }: NotesSectionProps) {
  return (
    <div className="space-y-sm">
      <div className="flex items-center gap-sm label-md text-text-muted">
        <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
        NOTES &amp; TERMS
      </div>
      <Textarea
        id="invoice-notes"
        rows={3}
        value={notes}
        placeholder="Please pay within 15 days…"
        resize="none"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
