// 最多保留三位小数
export function formatNumberMax3Digits(n: number) {
	return n.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

// 个位数字补 0，如 3 返回 "03"，20 返回 "20"
export function addZero(n: number): string {
	if (n < 10) {
		return "0" + n;
	}
	return String(n);
}
