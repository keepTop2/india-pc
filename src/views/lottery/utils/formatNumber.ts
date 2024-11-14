export function formatNumberMax3Digits(n: number) {
	return n.toLocaleString(undefined, { maximumFractionDigits: 3 });
}
