export interface Token {
	price: number;
	currency: string;
	date: string;
}

export interface SwapFormData {
	fromToken: Token | null;
	toToken: Token | null;
	fromAmount: string;
	toAmount: string;
}
