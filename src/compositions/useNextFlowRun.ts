import { SubscriptionOptions } from '@prefecthq/vue-compositions'
import merge from 'lodash.merge'
import { computed, ComputedRef, MaybeRef, MaybeRefOrGetter, toValue } from 'vue'
import { useCan } from '@/compositions/useCan'
import { UseFlowRuns, useFlowRuns } from '@/compositions/useFlowRuns'
import { FlowRun, FlowRunsFilter, UnionFilter } from '@/models'

export type UseNextFlowRun = Pick<UseFlowRuns, 'subscription'> & {
  flowRun: ComputedRef<FlowRun | undefined>,
}

export function useNextFlowRun(filter: MaybeRefOrGetter<UnionFilter | null | undefined>, options?: MaybeRef<SubscriptionOptions>): UseNextFlowRun {
  const can = useCan()

  const getter = (): FlowRunsFilter | null => {
    if (!can.read.flow_run) {
      return null
    }

    const filterValue = toValue(filter)
    const nextFlowRunFilter: FlowRunsFilter = {
      flowRuns: {
        state: {
          name: ['Scheduled'],
        },
      },
      sort: 'EXPECTED_START_TIME_ASC',
      limit: 1,
    }

    return merge({}, filterValue, nextFlowRunFilter)
  }

  const { flowRuns, subscription } = useFlowRuns(getter, options)
  const flowRun = computed(() => flowRuns.value.at(0))

  return {
    subscription,
    flowRun,
  }
}