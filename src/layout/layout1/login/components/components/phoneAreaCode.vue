<template>
	<div>
		<div class="phone-area-code" @click.stop="areaCodeSelection">
			<span style="margin-right: 2px; flex: 1">{{ props.areaCode }}</span>
			<SvgIcon class="transition_transition_0_2" :class="{ rotate_180: areaCodeSelectionShow }" iconName="arrow"
				:size="18" />
			<i></i>
		</div>

		<div v-on-click-outside.bubble="closeCodeModal"
			:style="{ height: areaCodeSelectionShow ? '287px' : '0px', opacity: areaCodeSelectionShow ? 1 : 0 }"
			class="area-code-selection">
			<div class="selection-header">
				<FromInput v-model="areaCodeValue" type="text" :placeholder="$t(`login['搜索']`)" @input="inputValueChange">
					<template v-slot:left>
						<SvgIcon style="margin-right: 5px" iconName="search" :size="22" />
					</template>
				</FromInput>
			</div>
			<div class="selection-options">
				<el-scrollbar>
					<div :class="props.areaCode == item.code ? 'cell-active' : 'cell'"
						v-for="(item, index) in searchAreaCode.data" :key="index" @click="onSelection(item)">
						<div class="label">{{ item.cn }}</div>
						<div class="value">{{ item.code }}</div>
					</div>
				</el-scrollbar>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import areaCodeData from '/@/utils/country-code.json';
import FromInput from '/@/components/Input/fromInput.vue';

const emit = defineEmits(['select', 'visible-change']);

const props = withDefaults(
	defineProps<{
		areaCode?: string | number;
	}>(),
	{
		areaCode: '',
	}
);

const areaCodeValue = ref('');
let areaCodeSelectionShow = ref(false);

const searchAreaCode = reactive({
	data: areaCodeData.data,
});

const inputValueChange = () => {
	searchAreaCode.data = areaCodeData.data.filter(
		(item: any) => item.code.includes(areaCodeValue.value) || item.cn.includes(areaCodeValue.value) || item.en.includes(areaCodeValue.value)
	);
};

const onSelection = (item: any) => {
	emit('select', item);
};

const areaCodeSelection = () => {
	areaCodeSelectionShow.value = !areaCodeSelectionShow.value;
	emit('visible-change', areaCodeSelectionShow.value);
};

function closeCodeModal() {
	areaCodeSelectionShow.value = false;
}
</script>

<style scoped lang="scss">
.phone-area-code {
	width: 70px;
	display: flex;
	align-items: center;

	@include themeify {
		color: themed('Text_s');
	}

	font-family: 'PingFang SC';
	font-size: 14px;
	font-weight: 400;
	cursor: pointer;

	i {
		display: block;
		width: 1px;
		height: 20px;

		@include themeify {
			background: themed('Line');
		}

		margin-left: 10px;
	}
}

.area-code-selection {
	position: absolute;
	top: calc(100% + 6px);
	left: 0;
	width: 100%;
	max-height: 287px;

	@include themeify {
		background-color: themed('Bg2');
	}

	transition: all 0.2s;
	border-radius: 4px;
	z-index: 10;
	overflow: hidden;

	.selection-header {
		height: 46px;
		border-bottom: 1px solid;

		@include themeify {
			border-color: themed('Line');
		}
	}

	.selection-options {
		height: calc(100% - 47px);
		// max-height: calc(100% - 47px);
		// padding: 0px 7px;
		overflow: hidden;

		// overflow: scroll;
		:deep(.el-scrollbar) {
			.el-scrollbar__view {
				padding: 0px 7px;
			}
		}

		.cell {
			width: 100%;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 8px;
			border-radius: 4px;
			box-sizing: border-box;
			border: 1px solid transparent;

			@include themeify {
				color: themed('Text1');
			}

			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
			cursor: pointer;
		}

		.cell-active {
			width: 100%;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 8px;
			border-radius: 4px;
			box-sizing: border-box;
			border: 1px solid;

			@include themeify {
				border-color: themed('Theme');
				background-color: themed('Bg1');
				color: themed('Text_s');
			}

			font-family: 'PingFang SC';
			font-size: 14px;
			font-weight: 400;
			cursor: pointer;
		}

		.cell:hover {
			@include themeify {
				background-color: themed('Bg1');
			}
		}
	}
}
</style>
