import { memo } from 'react'
import { agentSteps } from '../../data/research'

export const AgentRail = memo(function AgentRail({ activeStep, isRunning }) {
  return (
    <div className="agent-rail" aria-label="Agent execution path">
      {agentSteps.map((step, index) => {
        const Icon = step.icon
        const state = index < activeStep || (!isRunning && index === agentSteps.length - 1)
          ? 'done'
          : index === activeStep
            ? 'active'
            : ''

        return (
          <div className={`agent-step ${state}`} key={step.agent}>
            <span className="agent-icon"><Icon aria-hidden="true" /></span>
            <div>
              <strong>{step.agent}</strong>
              <small>{step.action}</small>
            </div>
          </div>
        )
      })}
    </div>
  )
})
