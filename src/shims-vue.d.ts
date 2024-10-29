import { VNode } from "vue";

declare global {
	namespace JSX {
		interface Element extends VNode {}
		interface ElementClass {
			$props: any;
		}
		interface IntrinsicElements {
			[elem: string]: any;
		}
	}
}

declare module "svg-icon" {
	import { DefineComponent } from "vue";
	const SvgIcon: DefineComponent<{
		name: string;
		width?: string | number;
		height?: string | number;
	}>;
	export default SvgIcon;
}
