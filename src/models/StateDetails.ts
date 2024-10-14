import { FlowRunInputKeyset } from '@/models/FlowRunInputKeyset'

export type StateDetails = {
  flowRunId?: string | null,
  taskRunId?: string | null,
  childFlowRunId?: string | null,
  scheduledTime?: Date | null,
  cacheKey?: string | null,
  cacheExpiration?: Date | null,
  pauseTimeout?: Date | null,
  pauseReschedule?: boolean | null,
  runInputKeyset?: FlowRunInputKeyset | null,
}
