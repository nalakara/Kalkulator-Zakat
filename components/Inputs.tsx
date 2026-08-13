
import React, { FC } from 'react';

// --- Helper to parse numeric values from string input ---
const parseNumericValue = (str: string): number => {
    const numbers = str.replace(/[^0-9]/g, '');
    return numbers ? parseInt(numbers, 10) : 0;
};

// --- Props Definitions ---
interface CurrencyInputProps {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    id: string;
}

interface NumberInputProps {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    id: string;
    unit: string;
}

// --- Component Definitions ---

export const CurrencyInput: FC<CurrencyInputProps> = ({ label, value, onValueChange, id }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(parseNumericValue(e.target.value));
    };

    const formattedValue = new Intl.NumberFormat('id-ID').format(value);

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-500 sm:text-sm">Rp</span>
                </div>
                <input
                    type="text"
                    name={id}
                    id={id}
                    className="block w-full rounded-md border-slate-300 py-2 pl-9 pr-3 text-slate-900 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="0"
                    value={formattedValue}
                    onChange={handleChange}
                    inputMode="numeric"
                />
            </div>
        </div>
    );
};


export const NumberInput: FC<NumberInputProps> = ({ label, value, onValueChange, id, unit }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(parseNumericValue(e.target.value));
    };

    const formattedValue = new Intl.NumberFormat('id-ID').format(value);

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <div className="relative rounded-md shadow-sm">
                <input
                    type="text"
                    name={id}
                    id={id}
                    className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-16 text-slate-900 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="0"
                    value={formattedValue}
                    onChange={handleChange}
                    inputMode="numeric"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-slate-500 sm:text-sm">{unit}</span>
                </div>
            </div>
        </div>
    );
};
