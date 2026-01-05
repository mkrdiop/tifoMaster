
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { label: 'Photo', icon: '📸' },
    { label: 'Équipe', icon: '⚽' },
    { label: 'Tifo', icon: '🎨' },
  ];

  return (
    <div className="flex justify-center mb-12">
      <div className="flex items-center w-full max-w-md">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="relative flex flex-col items-center flex-1">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 transition-all duration-300 ${
                  currentStep >= idx + 1 
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20 shadow-lg' 
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {step.icon}
              </div>
              <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                currentStep >= idx + 1 ? 'text-emerald-400' : 'text-slate-500'
              }`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 transition-all duration-500 ${
                currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-slate-800'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
