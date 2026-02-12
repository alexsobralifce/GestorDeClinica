import { Check } from 'lucide-react';

interface StepperStep {
  id: string;
  label: string;
}

interface StepperMobileProps {
  steps: StepperStep[];
  currentStep: string;
}

export function StepperMobile({ steps, currentStep }: StepperMobileProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="stepper-mobile">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.id} style={{ display: 'contents' }}>
            <div className={`stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="stepper-step-number">
                {isCompleted ? <Check size={16} /> : index + 1}
              </div>
              <span className="stepper-step-label">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`stepper-connector ${index < currentIndex ? 'active' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
