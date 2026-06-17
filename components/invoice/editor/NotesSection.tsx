interface NotesSectionProps {
  notes:    string
  onChange: (v: string) => void
}

export function NotesSection({ notes, onChange }: NotesSectionProps) {
  return (
    <div className="space-y-sm">
      <label
        className="flex items-center gap-sm label-md text-text-muted"
        htmlFor="invoice-notes"
      >
        <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
        NOTES &amp; TERMS
      </label>
      <textarea
        id="invoice-notes"
        rows={3}
        value={notes}
        placeholder="Please pay within 15 days..."
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-md py-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all resize-none"
      />
    </div>
  )
}
