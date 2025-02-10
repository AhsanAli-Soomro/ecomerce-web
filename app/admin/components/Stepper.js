import React from 'react';
import { Cog6ToothIcon, ListBulletIcon, ShoppingBagIcon, Squares2X2Icon } from '@heroicons/react/20/solid';


export default function Stepper({ activeStep, setActiveStep }) {
    const steps = [
        { id: 1, label: 'Upload Product', icon:<Squares2X2Icon className='w-6 h-6'/> },
        { id: 2, label: 'Product List', icon:<ListBulletIcon className='w-6 h-6'/> },
        { id: 3, label: 'Order List', icon:<ShoppingBagIcon className='w-6 h-6'/> },
        { id: 4, label: 'Manage Admin', icon:<Cog6ToothIcon className='w-6 h-6'/> },
    ];

    return (
        <div className="w-64 h-[calc(100vh-80px)] bg-gray-800 text-white fixed top-20 left-0 shadow-lg overflow-y-auto">
            <ul className="space-y-2 mt-4">
                {steps.map((step) => (
                    <li key={step.id}>
                        <button
                            onClick={() => setActiveStep(step.id)}
                            className={`w-full py-3 px-4 text-left text-lg font-semibold transition ${activeStep === step.id
                                ? 'bg-yellow-600'
                                : 'hover:bg-yellow-500 hover:text-white'
                                }`}
                        >
                            <div className='flex items-center gap-2'>
                                {step.icon}
                                {step.label}
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>

    );
}
