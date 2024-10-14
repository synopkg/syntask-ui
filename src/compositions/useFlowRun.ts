import { SubscriptionOptions, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
import { computed, MaybeRefOrGetter, toRef, toValue } from 'vue'
import { useCan } from '@/compositions/useCan'
import { useWorkspaceApi } from '@/compositions/useWorkspaceApi'
import { WorkspaceFlowRunsApi } from '@/services'
import { Getter } from '@/types/reactivity'
import { UseEntitySubscription } from '@/types/useEntitySubscription'

export type UseFlowRun = UseEntitySubscription<WorkspaceFlowRunsApi['getFlowRun'], 'flowRun'>

export function useFlowRun(flowRunId: MaybeRefOrGetter<string | null | undefined>, options?: SubscriptionOptions): UseFlowRun {
  const api = useWorkspaceApi()
  const can = useCan()

  const getter: Getter<[string] | null> = () => {
    if (!can.read.flow_run) {
      return null
    }

    const id = toValue(flowRunId)

    if (!id) {
      return null
    }

    return [id]
  }

  const parameters = toRef(getter)

  const subscription = useSubscriptionWithDependencies(api.flowRuns.getFlowRun, parameters, options)

  const flowRun = computed(() => subscription.response)

  return {
    subscription,
    flowRun,
  }
}