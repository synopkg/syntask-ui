import { AutomationActionType, AutomationActionWithType, isAutomationActionType } from '@/automations/types/actions'
import { ServerStateType } from '@/models/StateType'
import { SchemaValues } from '@/schemas/types/schemaValues'
import { Equals } from '@/types/utilities'
import { isRecord } from '@/utilities'

export type AutomationActionResponse =
| AutomationActionCancelFlowRunResponse
| AutomationActionSuspendFlowRunResponse
| AutomationActionResumeFlowRunResponse
| AutomationActionChangeFlowRunStateResponse
| AutomationActionRunDeploymentResponse
| AutomationActionPauseDeploymentResponse
| AutomationActionResumeDeploymentResponse
| AutomationActionPauseWorkQueueResponse
| AutomationActionResumeWorkQueueResponse
| AutomationActionPauseWorkPoolResponse
| AutomationActionResumeWorkPoolResponse
| AutomationActionPauseAutomationResponse
| AutomationActionResumeAutomationResponse
| AutomationActionSendNotificationResponse
| AutomationActionDoNothingResponse

export type AutomationActionRequest = AutomationActionResponse

/*
 * if this is giving you a type error you forgot to add a response type for your action to the AutomationActionResponse type
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const automationActionResponseHasAllActionTypes: Equals<AutomationActionResponse['type'], AutomationActionType> = true

export function isAutomationActionResponse(value: unknown): value is AutomationActionResponse {
  return isRecord(value) && isAutomationActionType(value.type)
}

/*
 * Cancel a flow run
 */
export type AutomationActionCancelFlowRunResponse = AutomationActionWithType<'cancel-flow-run'>

/*
 * Suspend a flow run
 */
export type AutomationActionSuspendFlowRunResponse = AutomationActionWithType<'suspend-flow-run'>

/*
 * Change a flow run's state
 */
export type AutomationActionChangeFlowRunStateResponse = AutomationActionWithType<'change-flow-run-state', {
  name?: string | null,
  state: ServerStateType,
  message?: string | null,
}>

/*
 * Resume a paused flow run
 */
export type AutomationActionResumeFlowRunResponse = AutomationActionWithType<'resume-flow-run'>


/*
 * Run a deployment
 */
export type AutomationActionRunDeploymentSelectedResponse = {
  source: 'selected',
  deployment_id: string,
  parameters: SchemaValues | null,
  job_variables?: Record<string, unknown>,
}

export type AutomationActionRunDeploymentInferredResponse = {
  source: 'inferred',
}

export type AutomationActionRunDeploymentResponse = AutomationActionWithType<'run-deployment', AutomationActionRunDeploymentSelectedResponse | AutomationActionRunDeploymentInferredResponse>

/*
 * Pause a deployment
 */
export type AutomationActionPauseDeploymentSelectedResponse = {
  source: 'selected',
  deployment_id: string,
}

export type AutomationActionPauseDeploymentInferredResponse = {
  source: 'inferred',
}

export type AutomationActionPauseDeploymentResponse = AutomationActionWithType<'pause-deployment', AutomationActionPauseDeploymentSelectedResponse | AutomationActionPauseDeploymentInferredResponse>

/*
 * Resume a deployment
 */
export type AutomationActionResumeDeploymentSelectedResponse = {
  source: 'selected',
  deployment_id: string,
}

export type AutomationActionResumeDeploymentInferredResponse = {
  source: 'inferred',
}

export type AutomationActionResumeDeploymentResponse = AutomationActionWithType<'resume-deployment', AutomationActionResumeDeploymentSelectedResponse | AutomationActionResumeDeploymentInferredResponse>

/*
 * Pause a work queue
 */
export type AutomationActionPauseWorkQueueSelectedResponse = {
  source: 'selected',
  work_queue_id: string,
}

export type AutomationActionPauseWorkQueueInferredResponse = {
  source: 'inferred',
}

export type AutomationActionPauseWorkQueueResponse = AutomationActionWithType<'pause-work-queue', AutomationActionPauseWorkQueueSelectedResponse | AutomationActionPauseWorkQueueInferredResponse>

/*
 * Resume a work queue
 */
export type AutomationActionResumeWorkQueueSelectedResponse = {
  source: 'selected',
  work_queue_id: string,
}

export type AutomationActionResumeWorkQueueInferredResponse = {
  source: 'inferred',
}

export type AutomationActionResumeWorkQueueResponse = AutomationActionWithType<'resume-work-queue', AutomationActionResumeWorkQueueSelectedResponse | AutomationActionResumeWorkQueueInferredResponse>

/*
 * Pause a work pool
 */
export type AutomationActionPauseWorkPoolSelectedResponse = {
  source: 'selected',
  work_pool_id: string,
}

export type AutomationActionPauseWorkPoolInferredResponse = {
  source: 'inferred',
}

export type AutomationActionPauseWorkPoolResponse = AutomationActionWithType<'pause-work-pool', AutomationActionPauseWorkPoolSelectedResponse | AutomationActionPauseWorkPoolInferredResponse>

/*
 * Resume a work pool
 */
export type AutomationActionResumeWorkPoolSelectedResponse = {
  source: 'selected',
  work_pool_id: string,
}

export type AutomationActionResumeWorkPoolInferredResponse = {
  source: 'inferred',
}

export type AutomationActionResumeWorkPoolResponse = AutomationActionWithType<'resume-work-pool', AutomationActionResumeWorkPoolSelectedResponse | AutomationActionResumeWorkPoolInferredResponse>

/*
 * Pause an automation
 */
export type AutomationActionPauseAutomationSelectedResponse = {
  source: 'selected',
  automation_id: string,
}

export type AutomationActionPauseAutomationInferredResponse = {
  source: 'inferred',
}

export type AutomationActionPauseAutomationResponse = AutomationActionWithType<'pause-automation', AutomationActionPauseAutomationSelectedResponse | AutomationActionPauseAutomationInferredResponse>

/*
 * Resume an automation
 */
export type AutomationActionResumeAutomationSelectedResponse = {
  source: 'selected',
  automation_id: string,
}

export type AutomationActionResumeAutomationInferredResponse = {
  source: 'inferred',
}

export type AutomationActionResumeAutomationResponse = AutomationActionWithType<'resume-automation', AutomationActionResumeAutomationSelectedResponse | AutomationActionResumeAutomationInferredResponse>

/*
 * Send a notification
 */
export type AutomationActionSendNotificationResponse = AutomationActionWithType<'send-notification', {
  block_document_id: string,
  subject: string,
  body: string,
}>

/**
 * Do nothing
 */
export type AutomationActionDoNothingResponse = AutomationActionWithType<'do-nothing'>
