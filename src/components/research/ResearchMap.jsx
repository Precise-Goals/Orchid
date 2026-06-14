import { memo } from 'react'
import { agentSteps } from '../../data/research'

export const ResearchMap = memo(function ResearchMap() {
  return (
    <div className="research-map" aria-label="ORCHIDE orchestration map">
      <div className="map-core">
        <span>ORCHIDE</span>
        <small>orchestrator</small>
      </div>
      {agentSteps.map((step, index) => {
        const Icon = step.icon
        return (
          <div className={`map-node node-${index + 1}`} key={step.agent}>
            <Icon aria-hidden="true" />
            <span>{step.agent}</span>
          </div>
        )
      })}
    </div>
  )
})
