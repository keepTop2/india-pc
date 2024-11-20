/**
 * @description 为 playsConfig 提供选择球数据的
 * @param length 返回数组长度
 * @param hasZero 球的格式为 "1" 还是 "01"
 * @param startIndex 起始需要
 * @returns
 */
export function generateBalls({ length, hasZero, startIndex } = { length: 9, hasZero: false, startIndex: 0 }) {
	return new Array(length).fill(1).map((v, i) => {
		const n: number = startIndex + i;
		if (!hasZero) return `${n}`;
		return addZero(n);
	}) as any[];
}

export function addZero(n: number) {
	return n < 10 ? `0${n}` : `${n}`;
}
