<template>
	<div class="collapse-panel">
		<div class="header pr_24" @click="handleClick" :class="isOpen ? 'isOpen' : ''">
			<div class="ellipsis" style="width: 150px">
				<img v-lazy-load="panel.icon" alt="" />
				<span>{{ panel.name }}</span>
			</div>
			<svg-icon v-if="panel?.subset?.length > 0" :name="!isOpen ? 'common-arrow_down' : 'common-arrow_up_on'" size="14px" />
		</div>
		<div v-show="isOpen && panel?.subset?.length > 0" class="collapse-content">
			<div v-for="(item, index) in panel?.subset" class="cell" @click="selectClass(index)" :class="subindex == index ? 'active' : ''">
				<div class="fs_14 ellipsis">
					<img v-lazy-load="item.icon" alt="" />
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
	panel: any;
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
	margin-bottom: 8px;
	width: 216px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	font-weight: bold;
	height: 44px;
	font-size: 14px;
	color: var(--Text-1);
	line-height: 44px;

	border-radius: 4px;
	padding-left: 24px;
	img {
		margin-right: 10px;
		height: 18px;
	}
}
.header.isOpen {
	border-radius: 4px 4px 0 0;
	background: var(--Bg-3);
}

.arrow {
	transition: transform 0.3s ease;
}

.arrow.open {
	transform: rotate(180deg); /* 展开时箭头向上 */
}

.collapse-content {
	background: var(--Bg-4);
	padding: 8px;
	height: auto;
	> div {
		height: 46px;
		line-height: 46px;
		border-radius: 4px;
		color: var(--Text-1);
		padding-left: 24px;
		cursor: pointer;
		width: 200px;
		> div {
			flex: 1;
		}
		img {
			width: 18px;
			height: 18px;
		}
		.flex-center {
			gap: 3px;
		}
	}
	> div:hover {
		background: var(--Bg-2);
	}
	.cell.active {
		background: var(--Bg-2);
	}
}
</style>
