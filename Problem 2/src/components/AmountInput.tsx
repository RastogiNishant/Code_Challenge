import { useState } from "react";

interface AmountInputProps {
	value: string;
	onChange: (value: string) => void;
	label: string;
	error?: string;
	disabled?: boolean;
}

export const AmountInput = ({
	value,
	onChange,
	label,
	error,
	disabled,
}: AmountInputProps) => {
	const [touched, setTouched] = useState(false);

	const showError = touched && !value && "This field is required";

	return (
		<div className='flex flex-col gap-2'>
			<label className='text-sm font-medium text-gray-700'>{label}</label>
			<input
				type='number'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onBlur={() => setTouched(true)}
				className={`w-full p-3 border rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
					(error || showError) && !disabled
						? "border-red-500"
						: "border-gray-300"
				}`}
				placeholder='0.00'
				min='0'
				step='any'
				disabled={disabled}
			/>
			{(error || showError) && !disabled && (
				<p className='text-sm text-red-500'>{error || showError}</p>
			)}
		</div>
	);
};
