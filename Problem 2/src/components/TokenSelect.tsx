import { Token } from "../types/token";

interface TokenSelectProps {
	tokens: Token[];
	selectedToken: Token | null;
	onSelect: (token: Token) => void;
	label: string;
}

export const TokenSelect = ({
	tokens,
	selectedToken,
	onSelect,
	label,
}: TokenSelectProps) => {
	return (
		<div className='flex flex-col gap-2'>
			<label className='text-sm font-medium text-gray-700'>{label}</label>
			<div className='relative'>
				<div className='relative flex items-center'>
					{selectedToken && (
						<img
							src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${selectedToken.currency}.svg`}
							alt={selectedToken.currency}
							className='absolute left-3 w-6 h-6'
						/>
					)}
					<select
						className='w-full p-3 pl-12 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
						value={selectedToken?.currency || ""}
						onChange={(e) => {
							const token = tokens.find(
								(t) => t.currency === e.target.value,
							);
							if (token) onSelect(token);
						}}
					>
						<option value=''>Select token</option>
						{tokens.map((token) => (
							<option key={token.currency} value={token.currency}>
								{token.currency} - ${token.price?.toFixed(2)}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};
