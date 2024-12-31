import { useState, useCallback } from "react";
import { ArrowDownUp } from "lucide-react";
import { TokenSelect } from "./components/TokenSelect";
import { AmountInput } from "./components/AmountInput";
import { useTokens } from "./hooks/useTokens";
import { SwapFormData, Token } from "./types/token";
import { Toaster, toast } from "react-hot-toast";

const App = () => {
	const { tokens, loading, error: tokensError } = useTokens();
	const [formData, setFormData] = useState<SwapFormData>({
		fromToken: null,
		toToken: null,
		fromAmount: "",
		toAmount: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [isSwapping, setIsSwapping] = useState(false);

	const updateToAmount = useCallback(
		(
			fromAmount: string,
			fromToken: Token | null,
			toToken: Token | null,
		) => {
			if (!fromToken || !toToken || !fromAmount) {
				return "";
			}
			const amount = parseFloat(fromAmount);
			if (isNaN(amount)) return "";
			return ((amount * fromToken.price!) / toToken.price!).toFixed(6);
		},
		[],
	);

	const handleSwap = async () => {
		if (!formData.fromToken || !formData.toToken || !formData.fromAmount) {
			toast.error("Please fill in all fields");
			return;
		}

		setError(null);
		setIsSwapping(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			toast.success("Tokens swapped successfully!");
		} catch (err) {
			console.error(err);
			toast.error("Failed to swap tokens");
		} finally {
			setIsSwapping(false);
			setFormData({
				fromToken: null,
				toToken: null,
				fromAmount: "",
				toAmount: "",
			});
		}
	};

	const handleFromAmountChange = (value: string) => {
		setFormData((prev) => ({
			...prev,
			fromAmount: value,
			toAmount: updateToAmount(value, prev.fromToken, prev.toToken),
		}));
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent'></div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
			<Toaster position='top-right' />
			{tokensError && (
				<div className='text-red-500'>{toast.error(tokensError)}</div>
			)}
			<div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6'>
				<h1 className='text-2xl font-bold text-gray-900 text-center'>
					Swap Tokens
				</h1>

				<div className='space-y-4'>
					<TokenSelect
						tokens={tokens}
						selectedToken={formData.fromToken}
						onSelect={(token) =>
							setFormData((prev) => ({
								...prev,
								fromToken: token,
								toAmount: updateToAmount(
									prev.fromAmount,
									token,
									prev.toToken,
								),
							}))
						}
						label='From'
					/>

					<AmountInput
						value={formData.fromAmount}
						onChange={handleFromAmountChange}
						label='Amount'
						error={error || undefined}
					/>

					<div className='flex justify-center'>
						<button
							className='p-2 hover:bg-gray-100 rounded-full transition-colors'
							onClick={() =>
								setFormData((prev) => ({
									fromToken: prev.toToken,
									toToken: prev.fromToken,
									fromAmount: prev.toAmount,
									toAmount: prev.fromAmount,
								}))
							}
						>
							<ArrowDownUp className='w-6 h-6 text-gray-600 hover:text-indigo-500' />
						</button>
					</div>

					<TokenSelect
						tokens={tokens.filter(
							(t) => t.currency !== formData.fromToken?.currency,
						)}
						selectedToken={formData.toToken}
						onSelect={(token) =>
							setFormData((prev) => ({
								...prev,
								toToken: token,
								toAmount: updateToAmount(
									prev.fromAmount,
									prev.fromToken,
									token,
								),
							}))
						}
						label='To'
					/>

					<AmountInput
						value={formData.toAmount}
						onChange={() => {}}
						label="You'll receive"
						disabled
					/>
				</div>

				<button
					onClick={handleSwap}
					disabled={
						isSwapping ||
						!formData.fromToken ||
						!formData.toToken ||
						!formData.fromAmount
					}
					className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
            ${
				isSwapping ||
				!formData.fromToken ||
				!formData.toToken ||
				!formData.fromAmount
					? "bg-indigo-300 cursor-not-allowed"
					: "bg-indigo-600 hover:bg-indigo-700"
			}`}
				>
					{isSwapping ? (
						<div className='flex items-center justify-center gap-2'>
							<div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
							<span>Swapping...</span>
						</div>
					) : (
						"Swap Tokens"
					)}
				</button>
			</div>
		</div>
	);
};

export default App;
