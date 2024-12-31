import { useState, useEffect } from "react";
import { Token } from "../types/token";

export const useTokens = () => {
	const [tokens, setTokens] = useState<Token[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTokens = async () => {
			try {
				const response = await fetch(
					"https://interview.switcheo.com/prices.json",
				);
				const data: Token[] = await response.json();
				console.log(data);
				// Creating a map to handle duplicate symbols
				const tokenMap = new Map<string, Token>();

				data.forEach((item) => {
					if (item.price) {
						const price = parseFloat(
							item.price as unknown as string,
						);
						const symbol = item.currency;

						// If symbol exists, keep the one with the higher price
						if (tokenMap.has(symbol)) {
							const existing = tokenMap.get(symbol)!;
							if (price > existing.price!) {
								tokenMap.set(symbol, {
									currency: item.currency,
									date: item.date,
									price,
								});
							}
						} else {
							tokenMap.set(symbol, {
								currency: item.currency,
								date: item.date,
								price,
							});
						}
					}
				});

				setTokens(Array.from(tokenMap.values()));
			} catch (error) {
				console.error(error);
				setError("Failed to fetch tokens");
			} finally {
				setLoading(false);
			}
		};

		fetchTokens();
	}, []);

	return { tokens, loading, error };
};
