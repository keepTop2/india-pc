<!--
 * @Author: WangMingxin
 * @Description: 静态图片、svg 资源使用及获取,可在不同主题语言下使用同名称的不同图片、svg； 
-->
<template>
	<component
		v-if="type == `svg` && moudelExameple"
		:is="moudelExameple"
		class="svg-icon"
		:width="props.size"
		:height="props.height ? props.height : props.size"
		:class="iconClass ? iconClass : ''"
		aria-hidden="true"
		viewBox="0 0 32 32"
	></component>
	<img v-if="type != `svg` && imgUrl" class="png-icon" :class="iconClass ? iconClass : ''" :src="imgUrl" alt="" />
</template>

<script setup lang="ts">
import { onMounted, ref, defineAsyncComponent, shallowRef, computed, watch } from "vue";
import { useThemesStore } from "/@/stores/modules/themes";
import { useUserStore } from "/@/stores/modules/user";

const UserStore = useUserStore();

const ThemesStore = useThemesStore();

const imgUrl: any = shallowRef(null);
const moudelExameple: any = shallowRef(null);

type Props = {
	/** svg名称 */
	iconName?: string;
	/** 完整链接地址 */
	src?: string;
	/** 大小 */
	size?: number | string;
	/** 高度 */
	height?: number | string;
	/** svgClass  */
	iconClass?: string;
	/** 类型  svg|png|jpg|jpeg */
	type?: string;
	/** 是否有语言匹配 */
	isLang?: boolean;
	/** 是否有主题匹配 */
	isTheme: boolean;
};

const props = withDefaults(defineProps<Props>(), {
	size: 80,
	// iconName: "ty_icon_dzjj",
	// src: "/src/assets/zh/default/menu/sports/ty_icon_dzjj.svg",
	type: "svg",
	isLang: false,
	isTheme: false,
});
/**获取主题 */
const getTheme = computed(() => {
	return ThemesStore.getTheme;
});

watch(
	() => getTheme.value,
	(newValue, oldValue) => {
		loadUrl();
	}
);
/** 获取语言 */
const getLang = computed(() => {
	return UserStore.getLang;
});

watch(
	() => getLang.value,
	(newValue, oldValue) => {
		loadUrl();
	}
);
/**当使用地址svg或图片时 */
const linkSrc = computed(() => {
	if (props.src) {
		const keyStrArr = props.src.split("/");
		/** 文件名称获取文件后缀 */
		// const lastStrArr = keyStrArr[keyStrArr.length - 1].split(".");
		// const flileType = lastStrArr[lastStrArr.length - 1];
		if (props.isTheme && !props.isLang) {
			/**有主题无语言  */
			keyStrArr.splice(4, 1, getTheme.value);
		} else if (!props.isTheme && props.isLang) {
			keyStrArr.splice(3, 1, getLang.value);
			/**无主题有语言  */
		} else if (props.isTheme && props.isLang) {
			keyStrArr.splice(3, 2, getLang.value, getTheme.value);
			/**有主题 有语言 */
		} else if (!props.isTheme && !props.isLang) {
			/**无主题 无语言 */
			return props.src;
		}
		const str = keyStrArr.join("/");
		return str;
	} else {
		return "";
	}
});

onMounted(() => {
	loadUrl();
});

/**获取所有的静态文件模型 */
const getModelFiles = () => {
	let model = [];
	//只能使用相对路径 而且用 ./ 或者/ 开头
	const modelFiles = import.meta.glob("/src/assets/**/**", {
		eager: false,
		// query: "?url",
		// import: "default",
	});
	const keys = Object.keys(modelFiles);

	for (let k = 0; k < keys.length; k++) {
		const key = keys[k];
		const keyStrArr = key.split("/");
		const urlTheme = keyStrArr[4];
		const urllang = keyStrArr[3];
		/** 文件名称获取文件后缀 */
		const lastStrArr = keyStrArr[keyStrArr.length - 1].split(".");
		const flileType = lastStrArr[lastStrArr.length - 1];
		if (flileType == props.type) {
			if (props.isTheme && !props.isLang) {
				/**有主题无语言  */
				if (urlTheme == getTheme.value) {
					model.push(modelFiles[key]);
				}
			} else if (!props.isTheme && props.isLang) {
				/**无主题有语言  */
				if (urllang == getLang.value) {
					model.push(modelFiles[key]);
				}
			} else if (props.isTheme && props.isLang) {
				/**有主题 有语言 */
				if (urlTheme == getTheme.value && urllang == getLang.value) {
					model.push(modelFiles[key]);
				}
			} else if (!props.isTheme && !props.isLang) {
				/**无主题无语言*/
				model.push(modelFiles[key]);
			}
		}
	}
	return model;
};
/**
 * @description: 加载组件或者图片地址；
 * @return {*}
 */
const loadUrl = () => {
	const modelFiles = getModelFiles();
	let modelComponent: any = null;
	try {
		modelFiles &&
			modelFiles.forEach((model) => {
				if (props.iconName) {
					const keyStrArr = model.name.split("/");
					const lastStr = keyStrArr[keyStrArr.length - 1];
					if (lastStr.indexOf(props.iconName) != -1) {
						modelComponent = model;
						throw new Error();
					}
				}

				if (model.name == linkSrc.value) {
					modelComponent = model;
					throw new Error();
				}
			});
	} catch (error) {}

	if (modelComponent) {
		if (props.type == "svg") {
			const ComponeTest = defineAsyncComponent(modelComponent);
			moudelExameple.value = ComponeTest;
		} else {
			modelComponent()
				.then((result) => {
					imgUrl.value = result.default;
					return result;
				})
				.catch((err) => {});
		}
	} else {
		moudelExameple.value = null;
		imgUrl.value = null;
	}
};
</script>

<style scoped lang="scss">
.svg-icon {
	fill: currentColor;
	vertical-align: middle;
	cursor: pointer;
}

.png-icon {
	min-width: 10px;
	min-height: 10px;
}
</style>
