import { AutomationTriggerEvent } from '@/automations/types/automationTriggerEvent'
import { AutomationTrigger } from '@/automations/types/triggers'
import { WorkPool, WorkPoolCreateRequest, WorkPoolEdit, WorkPoolEditRequest, WorkPoolResponse, WorkPoolCreate, createObjectLevelCan } from '@/models'
import { MapFunction } from '@/services/Mapper'

export const mapWorkPoolResponseToWorkPool: MapFunction<WorkPoolResponse, WorkPool> = function(source) {
  return new WorkPool({
    id: source.id,
    created: this.map('string', source.created, 'Date'),
    updated: this.map('string', source.updated, 'Date'),
    name: source.name,
    description: source.description,
    type: source.type,
    isPaused: source.is_paused ?? false,
    isPushPool: source.is_push_pool ?? false,
    isMexPool: source.is_mex_pool ?? false,
    concurrencyLimit: source.concurrency_limit,
    defaultQueueId: source.default_queue_id,
    baseJobTemplate: source.base_job_template,
    can: createObjectLevelCan(),
    status: this.map('ServerWorkPoolStatus', source.status, 'WorkPoolStatus'),
  })
}

export const mapWorkPoolToWorkPoolResponse: MapFunction<WorkPool, WorkPoolResponse> = function(source) {
  return {
    id: source.id,
    created: this.map('Date', source.created, 'string'),
    updated: this.map('Date', source.updated, 'string'),
    name: source.name,
    description: source.description,
    type: source.type,
    is_paused: source.isPaused,
    is_push_pool: source.isPushPool,
    is_mex_pool: source.isMexPool,
    concurrency_limit: source.concurrencyLimit,
    default_queue_id: source.defaultQueueId,
    base_job_template: source.baseJobTemplate,
    status: this.map('WorkPoolStatus', source.status, 'ServerWorkPoolStatus'),
  }
}

export const mapWorkPoolCreateToWorkPoolCreateRequest: MapFunction<WorkPoolCreate, WorkPoolCreateRequest> = function(source) {
  const baseJobTemplateSchema = this.map(
    'WorkerSchemaProperty',
    { values: source.defaultVariableValues ?? {}, schema: source.baseJobTemplate ?? {} },
    'WorkerSchemaPropertyRequest',
  )

  return {
    name: source.name,
    description: source.description,
    type: source.type,
    is_paused: source.isPaused,
    concurrency_limit: source.concurrencyLimit,
    base_job_template: baseJobTemplateSchema,
  }
}

export const mapWorkPoolEditToWorkPoolEditRequest: MapFunction<WorkPoolEdit, WorkPoolEditRequest> = function(source) {
  const baseJobTemplateSchema = this.map(
    'WorkerSchemaProperty',
    { values: source.updatedDefaultVariableValues ?? {}, schema: source.baseJobTemplate ?? {} },
    'WorkerSchemaPropertyRequest',
  )

  return {
    description: source.description,
    is_paused: source.isPaused,
    concurrency_limit: source.concurrencyLimit,
    base_job_template: baseJobTemplateSchema,
  }
}

export const mapWorkPoolToAutomationTrigger: MapFunction<WorkPool, AutomationTrigger> = function(workPool) {
  return new AutomationTriggerEvent({
    'posture': 'Reactive',
    'match': {
      'prefect.resource.id': `prefect.work-pool.${workPool.id}`,
    },
    'forEach': ['prefect.resource.id'],
    'expect': ['prefect.work-pool.not-ready'],
  })
}