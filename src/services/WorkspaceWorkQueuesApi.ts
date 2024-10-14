import { FlowRun, FlowRunResponse, WorkPoolQueueCreate, WorkPoolQueueEdit, WorkPoolQueueResponse } from '@/models'
import { WorkPoolQueuesFilter } from '@/models/Filters'
import { WorkPoolQueue } from '@/models/WorkPoolQueue'
import { BatchProcessor } from '@/services/BatchProcessor'
import { mapper } from '@/services/Mapper'
import { WorkspaceApi } from '@/services/WorkspaceApi'
import { toMap } from '@/utilities'

/**
 * API for interacting directly with work queues at a workspace level.
 * Compared to the `WorkspaceWorkPoolQueuesApi`, this API is older and works
 * with queues as flattened, top-level objects rather than as children of work pools.
 * Once upon a time, work queues roamed free throughout the lands of Prefect,
 * but everything changed when the work pools attacked.
 *
 * Should generally use the `WorkspaceWorkPoolQueuesApi` instead, but in case you need
 * to interact with work queues directly (without a work pool), this API is available.
 *
 * For example, this API supports getting a work queue directly by id without the
 * need to know the parent work pool.
 */
export class WorkspaceWorkQueuesApi extends WorkspaceApi {

  protected override routePrefix = '/work_queues'

  protected readonly idBatcher = new BatchProcessor<string, WorkPoolQueue>(async ids => {
    if (ids.length === 1) {
      const [id] = ids
      const { data } = await this.get<WorkPoolQueueResponse>(`/${id}`)

      return () => mapper.map('WorkPoolQueueResponse', data, 'WorkPoolQueue')
    }

    const workQueues = await this.getWorkQueues({
      workQueues: {
        id: ids,
      },
    })

    return toMap(workQueues, 'id')
  }, { maxBatchSize: 200 })

  protected readonly nameBatcher = new BatchProcessor<string, WorkPoolQueue>(async names => {
    if (names.length === 1) {
      const [name] = names
      const { data } = await this.get<WorkPoolQueueResponse>(`/name/${name}`)

      return () => mapper.map('WorkPoolQueueResponse', data, 'WorkPoolQueue')
    }

    const workQueues = await this.getWorkQueues({
      workQueues: {
        name: names,
      },
    })

    return toMap(workQueues, 'id')
  }, { maxBatchSize: 200 })

  public getWorkQueue(workQueueId: string): Promise<WorkPoolQueue> {
    return this.idBatcher.batch(workQueueId)
  }

  public getWorkQueueByName(workQueueName: string): Promise<WorkPoolQueue> {
    return this.nameBatcher.batch(workQueueName)
  }

  public async getWorkQueues(filter: WorkPoolQueuesFilter): Promise<WorkPoolQueue[]> {
    const request = mapper.map('WorkPoolQueuesFilter', filter, 'WorkPoolQueuesFilterRequest')
    const { data } = await this.post<WorkPoolQueueResponse[]>('/filter', request)

    return mapper.map('WorkPoolQueueResponse', data, 'WorkPoolQueue')
  }

  /** @deprecated Prefer `WorkspaceWorkPoolQueuesApi.createWorkPoolQueue` */
  public async createWorkQueue(request: WorkPoolQueueCreate): Promise<WorkPoolQueue> {
    const body = mapper.map('WorkPoolQueueCreate', request, 'WorkPoolQueueCreateRequest')
    const { data } = await this.post<WorkPoolQueueResponse>('/', body)

    return mapper.map('WorkPoolQueueResponse', data, 'WorkPoolQueue')
  }

  /** @deprecated Prefer `WorkspaceWorkPoolQueuesApi.pauseWorkPoolQueue` */
  public pauseWorkQueue(id: string): Promise<void> {
    return this.patch(`/${id}`, { 'is_paused': true })
  }

  /** @deprecated Prefer `WorkspaceWorkPoolQueuesApi.resumeWorkPoolQueue` */
  public resumeWorkQueue(id: string): Promise<void> {
    return this.patch(`/${id}`, { 'is_paused': false })
  }

  /** @deprecated Prefer `WorkspaceWorkPoolQueuesApi.updateWorkPoolQueue` */
  public updateWorkQueue(id: string, request: WorkPoolQueueEdit): Promise<void> {
    const body = mapper.map('WorkPoolQueueEdit', request, 'WorkPoolQueueEditRequest')

    return this.patch(`/${id}`, body)
  }

  /** @deprecated Prefer `WorkspaceWorkPoolQueuesApi.deleteWorkPoolQueue` */
  public deleteWorkQueue(id: string): Promise<void> {
    return this.delete(`/${id}`)
  }

  public async getRuns(id: string): Promise<FlowRun[]> {
    const { data } = await this.post<FlowRunResponse[]>(`/${id}/get_runs`)

    return mapper.map('FlowRunResponse', data, 'FlowRun')
  }
}