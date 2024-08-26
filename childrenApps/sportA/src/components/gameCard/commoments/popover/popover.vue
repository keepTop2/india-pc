<template>
	<div class="tooltip">
		<!-- :title="title" -->
		<el-popover :placement="placement" :width="width" :trigger="trigger" popper-class="popper-card-wmx" :effect="effect"
			:popper-options="popperOptions">
			<slot>
				<div class="tooltiptext">
					<h3>{{ title }}</h3>
					<div class="text">
						<p>{{ textContent }}</p>
					</div>
				</div>
			</slot>
			<template #reference>
				<slot name="reference">
					<div class="icon">
						<SvgIcon iconName="help" class="collectSvg" />
					</div>
				</slot>
			</template>
		</el-popover>
	</div>
</template>

<script setup lang="ts">
interface PopoverCard {
	title?: string; //标题
	textContent?: string; //文本内容
	placement?: string; //处事位置
	width?: number | string; //宽度
	trigger?: string; //激活方式
	effect?: string; //主题
	popperOptions?: any; //弹出设置
}
const props = withDefaults(defineProps<PopoverCard>(), {
	title: '游戏备注',
	textContent: '1.这里是备注这里是备注这里是备注',
	placement: 'top',
	width: 252,
	trigger: 'hover',
	effect: 'customized',
	popperOptions: {
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [-68, 10],
				},
			},
		],
	},
});
</script>
<style lang="scss">
.popper-card-wmx {
	border-radius: 4px;

	@include themeify {
		background-color: themed('Bg3') !important;
		border-color: themed('Bg3') !important;
	}

	.tooltiptext {
		@include themeify {
			color: themed('Text_s');
			background-color: themed('Bg3');
		}

		// }
		h3 {
			// color: var(--text-s, #fff);
			font-family: 'PingFang SC';
			font-size: 16px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			text-align: left;
			margin-bottom: 5px;

			@include themeify {
				color: themed('Text_s');
			}
		}

		.text {
			// color: var(--Text1-1, #98a7b5);
			font-family: 'PingFang SC';
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;

			@include themeify {
				color: themed('Text1');
			}
		}
	}
}

.popper-card-wmx .el-popper__arrow::before {
	@include themeify {
		background-color: themed('Bg3') !important;
		border-color: themed('Bg3') !important;
	}
}
</style>
<style lang="scss" scoped>
.tooltip {
	position: relative;
	display: inline-block;
	cursor: pointer;

	.icon {

		// color: #67707b;
		@include themeify {
			color: themed('icon');
		}

		&:hover {

			// color: #ffffff;
			@include themeify {
				color: themed('Text_s');
				// background-color: themed('Bg3');
			}
		}
	}
}
</style>
