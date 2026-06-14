import { memo } from 'react'

export const FeaturePanel = memo(function FeaturePanel({ icon: Icon, title, text }) {
  return (
    <article className="feature-panel">
      <Icon aria-hidden="true" />
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  )
})
