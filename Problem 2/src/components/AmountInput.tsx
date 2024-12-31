import { useState, useEffect } from "react";
import { z } from "zod";

interface AmountInputProps {
	value: string;
	onChange: (value: string) => void;
	label: string;
	error?: string;
	disabled?: boolean;
	isSwapping?: boolean;
}

const amountSchema = z.string().refine(
	(val) => {
		const num = parseFloat(val);
		return !isNaN(num) && num >= 0;
	},
	{ message: "Please enter a valid number" },
);

export const AmountInput = ({
	value,
	onChange,
	label,
	error,
	disabled,
	isSwapping,
}: AmountInputProps) => {
	const [touched, setTouched] = useState(false);
	const [validationError, setValidationError] = useState<string>("");

	const showError = touched && !value && "This field is required";

	useEffect(() => {
		if (isSwapping) {
			setTouched(false);
			setValidationError("");
		}
	}, [isSwapping]);

	const handleChange = (newValue: string) => {
		try {
			amountSchema.parse(newValue);
			setValidationError("");
		} catch (err) {
			if (err instanceof z.ZodError) {
				setValidationError(err.errors[0].message);
			}
		}
		onChange(newValue);
	};

	const displayError = validationError || error || showError;

	return (
		<div className='flex flex-col gap-2'>
			<label className='text-sm font-medium text-gray-700'>{label}</label>
			<input
				type='number'
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				onBlur={() => setTouched(true)}
				className={`w-full p-3 border rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
					displayError && !disabled && !isSwapping
						? "border-red-500"
						: "border-gray-300"
				}`}
				placeholder='0.00'
				min='0'
				step='any'
				disabled={disabled}
			/>
			{displayError && !disabled && !isSwapping && (
				<p className='text-sm text-red-500'>{displayError}</p>
			)}
		</div>
	);
};
