<template>
	<div class="controller">
		<div class="left" :class="collapse ? 'collapse' : ''"></div>
		<div class="right">
			<div class="placeholder_plan">
				<div class="position_plan">
					<div class="reset_position">
						<div class="scroll">
							<div class="icon" v-if="backTopFlag" @click="backTop">
								<SvgIcon iconName="arrowTop" :size="26" />
							</div>
						</div>
						<div class="waiter">
							<div class="icon">
								<SvgIcon iconName="vipjlb_kef_icon" :size="34" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { useMenuStore } from '/@/stores/modules/menu';
const MenuStore = useMenuStore();
const collapse = computed(() => {
	const val = MenuStore.getCollapse;
	return val;
});
const backTopFlag = ref(false); //用来判断样式
const domeDiv = ref();
const backTop = () => {
	let top = domeDiv.value.scrollTop; //获取点击时页面的滚动条纵坐标位置
	const timeTop = setInterval(() => {
		domeDiv.value.scrollTop = top -= 50; //一次减 50 往上滑动
		if (top <= 0) {
			clearInterval(timeTop);
		}
	}, 5); //定时调用函数使其更顺滑
};
const handleScroll = () => {
	if (domeDiv.value.scrollTop > 20) {
		backTopFlag.value = true;
	} else {
		backTopFlag.value = false;
	}
	//往下滑超过 20 则显示 否则则不显示按钮
};
onMounted(() => {
	nextTick(() => {
		domeDiv.value = window.document.querySelector('.layout1_right');
		domeDiv.value.addEventListener('scroll', handleScroll);
	});
}); //监听滚动事件
onUnmounted(() => {
	domeDiv.value.removeEventListener('scroll', handleScroll);
}); //离开页面时移除监听事件
</script>

<style lang="scss" scoped>
.controller {
	position: fixed;
	width: 100%;
	z-index: 1;
	left: 0px;
	bottom: 150px;
	display: flex;
	justify-content: center;
	.left {
		width: 260px;
		&.collapse {
			width: 64px;
			overflow-x: hidden;
		}
	}
	.right {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		.placeholder_plan {
			width: 1200px;
			height: 0px;
			position: relative;
			.position_plan {
				position: absolute;
				width: 60px;
				height: 136px;
				right: -76px;
				bottom: 0px;
				z-index: 1000;
				.reset_position {
					position: relative;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 100%;
					width: 100%;
					.scroll,
					.waiter {
						width: 60px;
						height: 60px;
						border-radius: 26px;
						overflow: hidden;
						border-radius: 26px;
						.icon {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 100%;
							height: 100%;
							border-radius: 26px;
							@include themeify {
								background-color: themed('Bg3');
								color: themed('icon');
							}
						}
					}
					.waiter {
						.icon {
							@include themeify {
								background-color: themed('Theme');
								// color: themed('Text_a');
								color: #fff;
							}
						}
					}
				}
			}
		}
	}
}
</style>
