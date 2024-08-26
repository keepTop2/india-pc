<template>
	<div class="CurrenciesList">
		<div class="list" v-for="(item, index) in data" :key="index">
			<SvgIcon :iconName="item.icon || 'btc'" :size="28" />
			&nbsp;&nbsp;
			<span class="name">{{ item.name }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	data: {
		type: Array,
		required: true,
	},
});
</script>

<style lang="scss" scoped>
.CurrenciesList {
	padding: 0px 20px;
	display: flex;
	flex-wrap: wrap;
	// overflow: scroll;
	.list {
		@include themeify {
			width: 184px;
			height: 48px;
			display: flex;
			align-items: center;
			margin-right: 10px;
			margin-bottom: 12px;
			padding: 0 10px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			border-radius: 2px;
			color: themed('Text1');

			&:nth-child(4n) {
				margin-right: 0;
			}

			.coin {
				width: 24px;
				height: 24px;
				margin-right: 10px;
			}

			.name {
				font-size: 14px;
				color: themed('Text1');
				span {
					color: themed('Text2_1');
				}
			}

			.alias {
				margin-left: 5px;
				font-size: 14px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			&:not(.none) {
				cursor: pointer;

				&.activeList {
					background: themed('Bg3');

					.name {
						color: themed('Text_s');
					}
				}
			}

			&.lang-list:hover {
				background: themed('Bg3');
				.name {
					color: themed('Text_s');
				}
			}
		}
	}
}
</style>
