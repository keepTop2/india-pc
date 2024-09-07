<!--
 * @Author: WangMingxin
 * @Description: 无数据处理
-->
<template>
	<div class="noneData_container">
		<div class="center">
			<div class="icon" v-if="themed == 'default'">
				<SvgIcon :iconName="iconSvg" size="120px" />
			</div>
			<div class="icon" v-if="themed == 'dark'">
				<SvgIcon :iconName="iconSvgLight" size="120px" />
			</div>
		</div>
		<div class="text_content">
			<p>{{ title || $t('common["哎呀"]') }}</p>
			<p>{{ center || $t('common["还没有数据"]') }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemesStore } from "/@/stores/modules/themes";
const ThemesStore = useThemesStore();
const themed = computed(() => {
	return ThemesStore.getTheme;
});
/**无数据接口 */
interface NoneData {
	/**svg名称 */
	iconSvg?: string;
	iconSvgLight?: string;
	/** 标题 */
	title?: string;
	/**内容 */
	center?: string;
}
const props = withDefaults(defineProps<NoneData>(), {
	iconSvg: "kzt_img",
	iconSvgLight: "kzt_img_light",
	title: "",
	center: "",
});
</script>

<style lang="scss" scoped>
.noneData_container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon {
		size: 80px;
	}

	.text_content {
		margin-top: 14px;

		p {
			text-align: center;
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
			color: var(--Text2_1);
		}
	}
}
</style>
