import { useState, useEffect } from "react";

interface AmountInputProps {
	value: string;
	onChange: (value: string) => void;
	label: string;
	error?: string;
	disabled?: boolean;
	isSwapping?: boolean;
}

export const AmountInput = ({
	value,
	onChange,
	label,
	error,
	disabled,
	isSwapping,
}: AmountInputProps) => {
	const [touched, setTouched] = useState(false);

	const showError = touched && !value && "This field is required";

	useEffect(() => {
		if (isSwapping) {
			setTouched(false);
		}
	}, [isSwapping]);

	return (
		<div className='flex flex-col gap-2'>
			<label className='text-sm font-medium text-gray-700'>{label}</label>
			<input
				type='number'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onBlur={() => setTouched(true)}
				className={`w-full p-3 border rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
					(error || showError) && !disabled && !isSwapping
						? "border-red-500"
						: "border-gray-300"
				}`}
				placeholder='0.00'
				min='0'
				step='any'
				disabled={disabled}
			/>
			{(error || showError) && !disabled && !isSwapping && (
				<p className='text-sm text-red-500'>{error || showError}</p>
			)}
		</div>
	);
};
