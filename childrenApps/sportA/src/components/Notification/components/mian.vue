<template>
	<div class="Notification_plan">
		<div class="text_plan">
			<h3 v-if="title" class="title">{{ title }}</h3>
			<div class="content">{{ contentCom }}</div>
		</div>

		<div class="progress">
			<el-progress type="circle" :percentage="state.percentage" :width="18" :stroke-width="5" striped striped-flow indeterminate :show-text="false"> </el-progress>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Check } from '@element-plus/icons-vue';
import { computed, onMounted, onUnmounted, reactive } from 'vue';
import { i18n } from '/@/i18n/index';
const $: any = i18n.global;

/**通知数据 */
interface Notification {
	title?: string;
	/**内容 */
	content?: string;
	type?: string;
	duration?: number;
	onClose: Function;
}

const state = reactive({
	percentage: 50,
	timeTag: 0,
	time: '' as any,
});

const props = withDefaults(defineProps<Notification>(), {
	title: '',
	content: '',
	duration: 4500,
});

const contentCom = computed(() => {
	if (props.content) {
		return props.content;
	} else {
		return $.t('common["还没有数据"]');
	}
});

const intervalTime = computed((): number => {
	return props.duration / 100;
});

const setCloseTime = () => {
	//时间为 0 时不执行；
	if (!props.duration) return;
	state.percentage = 0;
	state.time = window.setInterval(() => {
		if (state.timeTag >= 100) {
			window.clearInterval(state.time);
			props.onClose();
		}
		state.percentage = state.timeTag;
		state.timeTag = state.timeTag + 1;
	}, intervalTime.value);
};

onMounted(() => {
	setCloseTime();
});

// window.setTimeout(() => {
// 	props.onClose();
// }, 2000);

onUnmounted(() => {
	try {
		window.clearInterval(state.time);
	} catch (error) {}
});
</script>

<style lang="scss" scoped>
.Notification_plan {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	@include themeify {
		background-color: themed('Bg3');
	}
	padding: 20px 25px;
	box-sizing: border-box;

	.text_plan {
		@include themeify {
			color: themed('Text1');
			.title {
			}
			.content {
			}
		}
	}

	.progress {
		display: flex;
		align-items: center;
		justify-content: center;

		:deep() {
			.el-progress {
				padding: 3px;
				border-radius: 50%;
				@include themeify {
					background-color: themed('Bg4');
					.el-progress-circle {
						//圆背景
						.el-progress-circle__track {
							stroke: themed('Bg4');
						}
						//圆进度
						.el-progress-circle__path {
							stroke: themed('Theme');
							// stroke: url(#write); // #write 此处的 id 就是定义的 svg 标签 id 做替换即可（svg 替换）
						}
					}
				}

				.el-progress__text {
					display: none;
				}
			}
		}
	}
}
</style>
