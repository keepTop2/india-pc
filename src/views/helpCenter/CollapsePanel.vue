<template>
	<div class="collapse-panel">
		<div class="header pr_24" @click="handleClick" :class="isOpen ? 'isOpen' : ''">
			<div>
				<span>{{ panel.name }}</span>
			</div>
			<!-- <svg-icon :name="!isOpen ? 'arrow_down' : 'arrow_up_on'" size="14px" /> -->
		</div>
		<div v-show="isOpen" class="collapse-content">
			<div v-for="(item, index) in panel?.subset" class="cell" @click="selectClass(index)" :class="subindex == index ? 'active' : ''">
				<div class="fs_16">
					{{ item?.name }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	isOpen: boolean; // 是否展开，由父组件控制
	subindex: number;
	panel: {};
}>();
const emit = defineEmits(["toggle", "selectClass"]); // 发送 toggle 事件
const selectClass = (index) => {
	emit("selectClass", index);
};
const handleClick = () => {
	emit("toggle"); // 点击时触发 toggle 事件
};
</script>

<style scoped lang="scss">
.collapse-panel {
	border-radius: 4px;
	margin-bottom: 16px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	font-weight: bold;
	height: 44px;
	font-size: 14px;
	color: var(--Text_s);
	line-height: 44px;
	background: var(--Bg3);
	border-radius: 4px;
	padding-left: 24px;
	img {
		margin-right: 10px;
		width: 4px;
		height: 26px;
	}
}
.header.isOpen {
	border-radius: 4px 4px 0 0;
}

.arrow {
	transition: transform 0.3s ease;
}

.arrow.open {
	transform: rotate(180deg); /* 展开时箭头向上 */
}

.collapse-content {
	background: var(--Bg4);
	padding: 8px;
	> div {
		height: 46px;
		line-height: 46px;
		border-radius: 8px;
		color: var(--Text1);
		padding-left: 20px;
		cursor: pointer;
		> div {
			flex: 1;
		}
		img {
			width: 22.261px;
			height: 21.217px;
		}
		.flex-center {
			gap: 3px;
		}
	}
	> div:hover {
		background: var(--Bg2);
	}
	.cell.active {
		background: var(--Bg2);
	}
}
</style>
