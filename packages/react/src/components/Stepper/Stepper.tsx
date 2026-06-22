import React from 'react'
import './Stepper.css'

interface StepperProps {
  steps: string[]
  currentStep: number
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep

        return (
          <div key={index} className={`stepper-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
            <div className="stepper-number">
              {isCompleted ? '✓' : stepNumber}
            </div>
            <div className="stepper-label">{step}</div>
            {index < steps.length - 1 && <div className="stepper-line" />}
          </div>
        )
      })}
    </div>
  )
}