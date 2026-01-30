
import React from 'react';
import { Step } from '../types';

interface StepCardProps {
  step: Step;
}

const StepCard: React.FC<StepCardProps> = ({ step }) => {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-2xl">
        {step.icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Kadam {step.id}</span>
          {step.title}
        </h3>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
};

export default StepCard;
