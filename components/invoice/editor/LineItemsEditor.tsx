import type { LineItem } from '../invoice.types'

export interface LineItemsEditorProps {
  lineItems:      LineItem[]
  onAdd:          () => void
  onUpdate:       (id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => void
  onRemove:       (id: string) => void
}

const BORDER_INPUT = 'w-full bg-transparent border-b border-outline-variant/20 py-1 focus:border-primary outline-none'

export function LineItemsEditor({ lineItems, onAdd, onUpdate, onRemove }: LineItemsEditorProps) {
  return (
    <div className="space-y-md">
      <LineItemsHeader onAdd={onAdd} />
      <div className="space-y-sm">
        {lineItems.map((item) => (
          <LineItemRow key={item.id} item={item} onUpdate={onUpdate} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}

function LineItemsHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onAdd}
        className="text-primary label-md flex items-center gap-xs hover:bg-primary-container/20 px-sm py-1 rounded transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        ADD ITEM
      </button>
    </div>
  )
}

interface LineItemRowProps {
  item:     LineItem
  onUpdate: (id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => void
  onRemove: (id: string) => void
}

function LineItemRow({ item, onUpdate, onRemove }: LineItemRowProps) {
  const lineTotal = item.qty * item.rate

  return (
    <div className="glass-panel p-md rounded-xl space-y-sm">
      <div className="grid grid-cols-12 gap-md">
        <div className="col-span-12">
          <input
            type="text"
            value={item.description}
            placeholder="Add description..."
            onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
            className={`${BORDER_INPUT} font-medium text-on-surface`}
          />
        </div>

        <div className="col-span-4">
          <label className="block text-[10px] text-text-muted font-bold tracking-widest mb-1">QTY</label>
          <input
            type="number"
            min={0}
            value={item.qty}
            onChange={(e) => onUpdate(item.id, 'qty', e.target.value)}
            className={BORDER_INPUT}
          />
        </div>

        <div className="col-span-4">
          <label className="block text-[10px] text-text-muted font-bold tracking-widest mb-1">RATE ($)</label>
          <input
            type="number"
            min={0}
            value={item.rate}
            onChange={(e) => onUpdate(item.id, 'rate', e.target.value)}
            className={BORDER_INPUT}
          />
        </div>

        <div className="col-span-3 flex flex-col justify-end text-right">
          <div className={`font-semibold ${lineTotal > 0 ? 'text-primary' : 'text-text-muted'}`}>
            ${lineTotal.toFixed(2)}
          </div>
        </div>

        <div className="col-span-1 flex items-end justify-center">
          <button
            onClick={() => onRemove(item.id)}
            className="text-on-surface-variant hover:text-error hover:bg-error/10 p-1 rounded transition-colors"
            aria-label="Remove line item"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
