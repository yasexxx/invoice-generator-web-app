import styles from './DataTable.module.css'

export interface Column<T> {
  key: keyof T
  header: string
  align?: 'left' | 'right' | 'center'
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  rows: T[]
  className?: string
  keyExtractor: (row: T, index: number) => string | number
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  className,
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={styles.th}
                style={{ textAlign: col.align ?? 'left' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={keyExtractor(row, i)} className={styles.tr}>
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={styles.td}
                  style={{ textAlign: col.align ?? 'left' }}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
