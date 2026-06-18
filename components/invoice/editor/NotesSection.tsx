import { Textarea } from '@/components/ui'

export interface NotesSectionProps {
  notes:    string
  onChange: (v: string) => void
}

export function NotesSection({ notes, onChange }: NotesSectionProps) {
  return (
    <Textarea
      id="invoice-notes"
      rows={3}
      value={notes}
      placeholder="Please pay within 15 days…"
      resize="none"
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
