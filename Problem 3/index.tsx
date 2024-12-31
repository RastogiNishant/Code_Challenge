// we need to add BoxProps definition either import it from somewhere or define it
interface BoxProps {
	children: React.ReactNode;
}

interface WalletBalance {
	currency: string;
	amount: number;
	blockchain: string;
}
interface FormattedWalletBalance extends WalletBalance {
	// as we have interface WalletBalance, we can extend it without using them separately
	formatted: string;
}

interface Props extends BoxProps {}

type BlockchainPriority = {
	[key: string]: number;
};

const blockchainPriority: BlockchainPriority = {
	Osmosis: 100,
	Ethereum: 50,
	Arbitrum: 30,
	Zilliqa: 20,
	Neo: 20,
} as const;

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
	// we can destructure children and rest from props rather than using props and then destructuring it and no need to define the props type again and again
	const balances = useWalletBalances(); // we are using the useWalletBalances hook to get the balances so we need to define its type
	const prices = usePrices(); // we are using the usePrices hook to get the prices so we need to define its type

	const getPriority = (blockchain: string): number => {
		return blockchainPriority[blockchain] ?? -99; // we have created a blockchainPriority object(as record) and we are using it to get the priority of the blockchain
	};

	const sortedBalances = useMemo(
		() =>
			balances
				.filter(({ blockchain, amount }: WalletBalance) => {
					const balancePriority = getPriority(blockchain);
					// balancePriority > -99 and amount > 0 can be combined into a single return statement
					return balancePriority > -99 && amount > 0;
				})
				.sort((lhs: WalletBalance, rhs: WalletBalance) => {
					const leftPriority = getPriority(lhs.blockchain);
					const rightPriority = getPriority(rhs.blockchain);
					// simplified sorting logic, but ensuring it handles equal priorities correctly
					return leftPriority - rightPriority;
				}),
		[balances],
	);

	const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
		({
			amount,
			...balance
		}: // destructuring the amount and rest of the balance to improve readability
		WalletBalance) => ({
			...balance,
			formatted: amount.toFixed(2), // formatting to two decimal places for consistency
		}),
	);

	const rows = formattedBalances.map(({ currency, amount, formatted }) => {
		const price = prices[currency] ?? 0;
		const usdValue = price * amount;
		return (
			<WalletRow
				className={classes.row}
				key={currency} // using a unique identifier instead of index for better keying
				amount={amount}
				usdValue={usdValue}
				formattedAmount={formatted}
			/>
		);
	});

	return <div {...rest}>{rows}</div>;
};
