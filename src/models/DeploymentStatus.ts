import { createTuple } from '@/utilities'

export const { values: deploymentStatus, isValue: isDeploymentStatus } = createTuple(['ready', 'not_ready', 'disabled'])

export type DeploymentStatus = typeof deploymentStatus[number]
export type ServerDeploymentStatus = Uppercase<typeof deploymentStatus[number]>

export function getDeploymentStatusLabel(status: DeploymentStatus): string {
  switch (status) {
    case 'not_ready':
      return 'Not Ready'
    case 'ready':
      return 'Ready'
    case 'disabled':
      return 'Disabled'
    default:
      const exhaustive: never = status
      throw new Error(`getDeploymentStatusLabel missing case for status: ${exhaustive}`)
  }
}