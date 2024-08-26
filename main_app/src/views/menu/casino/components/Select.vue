<template>
	<el-select
		ref="selectRef"
		v-model="selectVal"
		:multiple="multiple"
		:collapse-tags="collapseTags"
		:collapse-tags-tooltip="collapseTagsTooltip"
		:placeholder="placeholder"
		@change="selectChange"
		class="select_plan"
		:teleported="true"
		:clearable="clearable"
		:value-key="valueKey"
		popper-class="select-popper"
		:suffix-icon="SuffixIcon"
	>
		<el-option v-for="item in options" :key="item[valueField]" :label="item[labelField]" :value="item[valueField]" :class="selectOptionClass">
			<slot :item="item"></slot>
		</el-option>
	</el-select>
</template>

<script setup lang="ts">
import { SuffixIcon } from './components';
import { defineProps, defineEmits, ref, reactive, computed } from 'vue';
const props = defineProps({
	modelValue: {
		type: [String, Array],
		// default: false
	},
	options: {
		type: Array,
		default: () => [],
	},
	placeholder: {
		type: String,
		default: '请选择',
	},
	multiple: {
		type: Boolean,
		default: false,
	},
	collapseTags: {
		//多选时是否将选中值按文字的形式展示
		type: Boolean,
		default: false,
	},
	collapseTagsTooltip: {
		type: Boolean,
		default: false,
	},
	selectOptionClass: {
		type: String,
		default: 'select-option',
	},
	//作为 value 唯一标识的键名，绑定值为对象类型时必填
	valueKey: {
		type: String,
		default: 'value',
	},
	clearable: {
		//可清空
		type: Boolean,
		default: false,
	},
	valueField: {
		//值字段
		type: String,
		default: 'value',
	},
	labelField: {
		//label 字段
		type: String,
		default: 'label',
	},
});

const selectRef = ref();
const emits = defineEmits(['update:modelValue', 'onChangeSelect']);
const selectVal = computed({
	get() {
		return props.modelValue;
	},
	set(val) {
		if (selectRef) {
			console.info(selectRef.value);
			// selectRef.value.open();
		}
		emits('update:modelValue', val);
	},
});

const selectChange = (val: any) => {
	console.info(val);
	emits('onChangeSelect', val);
};
</script>

<style lang="scss">
.select-popper {
	border-radius: 4px;
	// background: var(--Bg2-2, #1a1c20) !important;
	// border-color: var(--Bg2-2, #1a1c20) !important;
	.el-select-dropdown__list {
		box-sizing: border-box;
		padding: 0 4px !important;

		.el-select-dropdown__item {
			border-radius: 4px;
			border: 1px solid;
			padding: 0px;
			min-height: 40px;
			box-sizing: border-box;
			@include themeify {
				border-color: themed('Bg2');
			}
			&.is-hovering,
			&.hover,
			&:hover {
				border-radius: 4px;
				@include themeify {
					border-color: themed('Bg3');
					background-color: themed('Bg3');
				}
			}

			&.is-hovering,
			&.hover {
				border-radius: 4px;
				@include themeify {
					border-color: themed('Theme');
					background-color: themed('Bg3');
				}
			}
			&.is-selected {
				font-weight: 400;
				@include themeify {
					color: themed('Text_s') !important;
					background-color: themed('Bg2') !important;
				}
				&:after {
					display: none;
				}
			}
		}
	}
	@include themeify {
		background-color: themed('Bg2') !important;
		border-color: themed('Bg2') !important;
	}
}

.select-popper .el-popper__arrow::before {
	@include themeify {
		background-color: themed('Bg2') !important;
		border-color: themed('Bg2') !important;
	}
}
</style>
<style lang="scss" scoped>
.select_plan {
	min-width: 240px;
	width: 100%;
	height: 100%;
	border-radius: 4px;

	@include themeify {
		$Bg1: themed('Bg1');
		$Bg2: themed('Bg2');
		$test1: themed('Text1');
		$test2: themed('Text2_1');
		background-color: $Bg2;
	}
	// --el-input-text-color: $test1;
	// --el-fill-color-blank: $Bg1;
	// --el-input-border: $Bg2;

	:deep() {
		.el-select__wrapper {
			--el-fill-color-blank: $Bg2;
			--el-border-color: $Bg2;
			align-items: center;
			background-color: var(--el-fill-color-blank);
			border-radius: var(--el-border-radius-base);
			box-shadow: 0 0 0 1px var(--el-border-color) inset;
			transition: var(--el-transition-duration);
			line-height: 40px;
			height: 100%;
			width: 100%;
		}

		.el-select__selected-item {
			.el-tag.el-tag--info {
				--el-tag-bg-color: $Bg1;
				--el-tag-border-color: var(--el-color-info-light-8);
				--el-tag-hover-color: var(--el-color-info);
			}
		}

		.select-trigger {
			.el-select__tags {
				.el-tag--info {
					@include themeify {
						background-color: themed('Bg1');
					}
				}
				.el-select-tags-wrapper {
					.el-tag.el-tag--info {
						--el-tag-bg-color: var(--el-color-info-light-9);
						--el-tag-border-color: var(--el-color-info-light-8);
						--el-tag-hover-color: var(--el-color-info);
					}
				}
			}

			.el-input {
				@include themeify {
					--el-input-text-color:$Bg1
					--el-input-hover-border: $Bg2;
					--el-input-focus-border: $Bg2;
					--el-input-transparent-border: 0 0 0 1px transparent inset;
					--el-input-border-color: $Bg2;
					--el-input-border-radius: var(--el-border-radius-base);
					--el-input-bg-color: $Bg2;
					--el-input-icon-color: themed('icon');
					--el-input-placeholder-color: ;
					--el-input-hover-border-color: $Bg2;
					--el-input-clear-hover-color: $Bg2;
					--el-input-focus-border-color: $Bg2;
					--el-select-input-focus-border-color: $Bg2;
				}

				&.is-focus {
					.el-input__wrapper {
					}
				}

				.el-input__wrapper {
					display: inline-flex;
					flex-grow: 1;
					align-items: center;
					justify-content: center;
					padding: 1px 11px;
					background-image: none;
					// border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
					transition: var(--el-transition-box-shadow);
					transform: translate3d(0, 0, 0);
					box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;

					min-width: 240px;
					min-height: 40px;
					// border-radius: 4px;
					// background-color: var(--Bg2-2, #1a1c20);
					// border-color: var(--Bg2-2, #1a1c20);
					@include themeify {
						border-color: themed('Bg2');
						background-color: themed('Bg2');
					}
					.el-input__inner {
						@include themeify {
							color: themed('Text1');
						}
					}
				}
			}
		}
	}
}

.select-option {
	&.el-select-dropdown__item {
		border-radius: 4px;
		border: 1px solid;
		padding: 0px;
		min-height: 40px;
		@include themeify {
			border-color: themed('Bg2');
			// background-color: themed('Bg2');
		}
		&.is-hovering,
		&.hover,
		&:hover {
			border-radius: 4px;
			// border: 1px solid var(--Theme-, #3bc116);
			// background-color: var(--Bg2-2, #1a1c20);
			@include themeify {
				border-color: themed('Theme');
				background-color: themed('Bg2');
			}
		}
	}
	&.is-hovering,
	&.hover {
		// background: red;
		border-radius: 4px;
		@include themeify {
			border-color: themed('Theme');
			background-color: themed('Bg2');
		}
	}
	&.selected {
		// background-color: var(--Bg2-2, #1a1c20) !important;
		// color: var(--text-s, #fff) !important;
		font-weight: 400;
		@include themeify {
			border-color: themed('Theme');
			color: themed('Text_s') !important;
			background-color: themed('Bg2') !important;
		}
		&:after {
			display: none;
		}
	}
}

.select-checked-option {
	&.el-select-dropdown__item {
		border-radius: 4px;
		border: 1px solid;
		padding: 0px;
		min-height: 40px;
		box-sizing: border-box;
		@include themeify {
			border-color: themed('Bg2');
		}
		&.is-hovering,
		&.hover,
		&:hover {
			border-radius: 4px;
			@include themeify {
				border-color: themed('Bg3');
				background-color: themed('Bg3');
			}
		}
	}
	&.is-hovering,
	&.hover {
		border-radius: 4px;
		@include themeify {
			border-color: themed('Theme');
			background-color: themed('Bg3');
		}
	}
	&.selected {
		font-weight: 400;
		@include themeify {
			color: themed('Text_s') !important;
			background-color: themed('Bg2') !important;
		}
		&:after {
			display: none;
		}
	}
}
</style>
