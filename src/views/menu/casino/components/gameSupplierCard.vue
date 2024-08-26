<!--
 * @Author: wangmingxin
 * @Description: 供应商卡片
-->
<template>
	<div class="gameSupplierCard" @click="onCardClick">
		<div class="img_plan">
			<el-image :src="imgUrl" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { url } from 'inspector';
import { ref, reactive, watch, computed } from 'vue';

//商人卡片
interface SupplierCard {
	width?: number;
	height?: number;
	item?: any;
}

const props = withDefaults(defineProps<SupplierCard>(), {
	width: 158,
	height: 60,
	item: {
		id: '10',
		name: 'PG',
		pcIcon: '',
		status: 1,
		remark: null,
		sort: null,
		maintenanceStartTime: 1713283200000,
		maintenanceEndTime: 1711987200000,
		collect: false,
	},
});

const imgUrl = computed(() => {
	const url = props.item.pcIcon || props.item.iconCode;
	return url;
});

const emit = defineEmits(['cardClick']);

const onCardClick = () => {
	emit('cardClick', props.item);
};
</script>

<style lang="scss" scoped>
.gameSupplierCard {
	@include themeify {
		background-color: themed('Bg1');
	}
	display: flex;
	width: v-bind('props.width+"px"');
	height: v-bind('props.height+"px"');
	padding: 7px 11px;
	justify-content: center;
	align-items: center;
	border-radius: 6px;
	/* background: var(--Bg1-1, #24262b); */
	box-sizing: border-box;
	cursor: pointer;

	.img_plan {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
}
</style>
