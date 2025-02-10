import React from 'react';

export default function Stepper({ activeStep, setActiveStep }) {
  const steps = [
    { id: 1, label: 'Upload Product' },
    { id: 2, label: 'Product List' },
    { id: 3, label: 'Order List' },
  ];

  return (
<div className="w-64 h-[calc(100vh-80px)] bg-gray-800 text-white fixed top-20 left-0 shadow-lg overflow-y-auto">
  <ul className="space-y-2 mt-4">
    {steps.map((step) => (
      <li key={step.id}>
        <button
          onClick={() => setActiveStep(step.id)}
          className={`w-full py-3 px-4 text-left text-lg font-semibold transition ${
            activeStep === step.id
              ? 'bg-blue-600'
              : 'hover:bg-blue-500 hover:text-white'
          }`}
        >
          {step.label}
        </button>
      </li>
    ))}
  </ul>
</div>

  );
}
