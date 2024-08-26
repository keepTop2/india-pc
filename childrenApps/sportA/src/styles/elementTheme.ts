import Common from "../utils/common";
import { ThemeKey, ElementObj } from "/@/models/commonInterface";
import { useCssVar } from "@vueuse/core";

/**
 * element主题色类
 */
class ElementThemes {
	private default = {
		//主色/盈利
		Theme: "#3bc116",
		//警告/提示/取消/失败/亏损
		Warn: "#ff0000",
		//温馨提示themes
		Hint: "#ff7a00",
		//收藏
		Favorites: "#ff007a",
		//标签1
		Tag1: "#31333a",
		//文本/文本1
		Text1: "#98a7b5",
		//文本/文本2
		Text2: "#4d565e",
		//文本/文本3
		Text3: "#687083",
		//分割线
		Line: "#373a40",
		//背景/卡片1
		Bg1: "#24262b",
		//背景/卡片2
		Bg2: "#1a1c20",
		//背景/卡片3
		Bg3: "#2e3035",
		//背景/卡片4
		Bg4: "#1c1e22",
		//背景/卡片5
		Bg5: "#364139",
	};

	private dark = {
		//主色/盈利
		Theme: "#ff0cae",
		//警告/提示/取消/失败/亏损
		Warn: "#ff0000",
		//温馨提示
		Hint: "#ff7a00",
		//收藏
		Favorites: "#ff007a",
		//标签1
		Tag1: "#31333a",
		//文本/文本1
		Text1: "#98a7b5",
		//文本/文本2
		Text2: "#4d565e",
		//文本/文本3
		Text3: "#687083",
		//分割线
		Line: "#373a40",
		//背景/卡片1
		Bg1: "#24262b",
		//背景/卡片2
		Bg2: "#1a1c20",
		//背景/卡片3
		Bg3: "#2e3035",
		//背景/卡片4
		Bg4: "#1c1e22",
		//背景/卡片5
		Bg5: "#364139",
	};

	/**
	 *
	 * @param colorNameList element主题色名字集合
	 * @param color 替换后的颜色
	 */
	private setLightOrDark(colorNameList: Array<ElementObj>) {
		colorNameList.forEach((item) => {
			useCssVar(item.elementThemeName).value = item.color;
			for (let i = 1; i <= 9; i++) {
				useCssVar(`${item.elementThemeName}-light-${i}`).value = this.mixColor(item.color, "#fff", Common.div(i, 10));
			}
		});
	}

	/**
	 * @description element颜色阶梯计算
	 * @param color1
	 * @param color2
	 * @param weight
	 * @returns
	 */
	private mixColor(color1: string, color2: string, weight: string | number): string {
		weight = Math.max(Math.min(Number(weight), 1), 0);
		const r1 = parseInt(color1.substring(1, 3), 16);
		const g1 = parseInt(color1.substring(3, 5), 16);
		const b1 = parseInt(color1.substring(5, 7), 16);
		const r2 = parseInt(color2.substring(1, 3), 16);
		const g2 = parseInt(color2.substring(3, 5), 16);
		const b2 = parseInt(color2.substring(5, 7), 16);
		let r: string | number = Math.round(r1 * (1 - weight) + r2 * weight);
		let g: string | number = Math.round(g1 * (1 - weight) + g2 * weight);
		let b: string | number = Math.round(b1 * (1 - weight) + b2 * weight);
		r = ("0" + (r || 0).toString(16)).slice(-2);
		g = ("0" + (g || 0).toString(16)).slice(-2);
		b = ("0" + (b || 0).toString(16)).slice(-2);
		return "#" + r + g + b;
	}

	/**
	 * @description 设置element主题色
	 * @param themeKey
	 */
	public setElementThemes(themeKey?: ThemeKey) {
		//--el-color-white
		//--el-color-black

		if (themeKey) {
			const colorNameList: Array<ElementObj> = [
				{
					elementThemeName: "--el-color-primary",
					color: this[themeKey].Theme,
				},
				{
					elementThemeName: "--el-border-color",
					color: this[themeKey].Theme,
				},
				{
					elementThemeName: "--el-bg-color",
					color: this[themeKey].Theme,
				},
				{
					elementThemeName: "--el-text-color-primary",
					color: this[themeKey].Theme,
				},
				{
					elementThemeName: "--el-color-success",
					color: this[themeKey].Theme,
				},
				{
					elementThemeName: "--el-color-warning",
					color: this[themeKey].Warn,
				},
				{
					elementThemeName: "--el-color-danger",
					color: this[themeKey].Warn,
				},
				{
					elementThemeName: "--el-color-error",
					color: this[themeKey].Warn,
				},
				{
					elementThemeName: "--el-color-info",
					color: this[themeKey].Warn,
				},
			];
			this.setLightOrDark(colorNameList);
		} else {
			const colorNameList: Array<ElementObj> = [
				{
					elementThemeName: "--el-color-primary",
					color: this.default.Theme,
				},
				{
					elementThemeName: "--el-border-color",
					color: this.default.Theme,
				},
				{
					elementThemeName: "--el-bg-color",
					color: this.default.Theme,
				},
				{
					elementThemeName: "--el-text-color-primary",
					color: this.default.Theme,
				},
				{
					elementThemeName: "--el-color-success",
					color: this.default.Theme,
				},
				{
					elementThemeName: "--el-color-warning",
					color: this.default.Warn,
				},
				{
					elementThemeName: "--el-color-danger",
					color: this.default.Warn,
				},
				{
					elementThemeName: "--el-color-error",
					color: this.default.Warn,
				},
				{
					elementThemeName: "--el-color-info",
					color: this.default.Warn,
				},
			];
			this.setLightOrDark(colorNameList);
		}
	}
}

export default ElementThemes;
