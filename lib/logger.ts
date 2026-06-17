const isDev = process.env.NODE_ENV === 'development'

export interface LogContext {
  correlationId?: string
  [key: string]: unknown
}

export function devLog(module: string, message: string, context?: LogContext): void {
  if (!isDev) return
  const entry = {
    time: new Date().toISOString(),
    level: 'debug',
    module,
    message,
    ...context,
  }
  // eslint-disable-next-line no-console -- dev-only structured logger; silenced in production by isDev guard
  console.log(JSON.stringify(entry))
}
