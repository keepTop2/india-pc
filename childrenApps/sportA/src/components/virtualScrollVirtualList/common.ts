import Decimal from "decimal.js";
class Common {
	/**
	 * @description 加法
	 * @param a
	 * @param b
	 * @returns 加出来的和
	 */
	static add = (a: string | number, b: string | number) => Number(new Decimal(Number(a)).add(new Decimal(Number(b))));
	/**
	 * @description 减法
	 * @param a
	 * @param b
	 * @returns
	 */
	static sub = (a: string | number, b: string | number) => Number(new Decimal(Number(a)).sub(new Decimal(Number(b))));
	/**
	 * @description 乘法
	 * @param a
	 * @param b
	 * @returns
	 */
	static mul = (a: string | number, b: string | number) => Number(new Decimal(Number(a)).mul(new Decimal(Number(b))));
	/**
	 * @description 除法
	 * @param a
	 * @param b
	 * @returns
	 */
	static div = (a: string | number, b: string | number) => Number(new Decimal(Number(a)).div(new Decimal(Number(b))));

	/**
	 * @description 保留n位小数 截断
	 * @param num 值
	 * @param n 几位小数
	 * @returns
	 */
	static formatFloat = (num: number | string, n: number = 2) => {
		const f_x = parseFloat(num as string);
		if (isNaN(f_x)) {
			return 0;
		}
		let s_x = num.toString();
		let pos_decimal = s_x.indexOf(".");
		if (pos_decimal < 0) {
			pos_decimal = s_x.length;
			if (n != 0) {
				s_x += ".";
			} else {
				return s_x;
			}
		}
		if (s_x.length <= pos_decimal + n) {
			while (s_x.length <= pos_decimal + n) {
				s_x += "0";
			}
		} else {
			s_x = s_x.substring(0, pos_decimal + n + 1);
		}
		return s_x;
	};
}

export default Common;
