export interface ActionState {
  error: string | null
  submitted?: boolean
}

export const INITIAL_ERROR: ActionState = { error: null }
