import { defineStore } from "pinia";

interface svgHoverStore {
	hoverIcon: String;
}

export const useSvgHoverStore = defineStore("svgHover", {
	state: (): svgHoverStore => {
		return {
			hoverIcon: "",
		};
	},
	getters: {
		gethoverIcon(): any {
			return this.hoverIcon;
		},
	},
	actions: {
		onMouseover(str: string) {
			this.hoverIcon = str;
		},
		onMouseout() {
			this.hoverIcon = "";
		},
	},
});
