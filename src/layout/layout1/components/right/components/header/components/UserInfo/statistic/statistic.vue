<template>
	<div>
		<div class="card bg_Bg3 statistic">
			<div class="title flex_space-between">
				<span class="flex_space-between color_Text_s fs_16"><img width="18" height="18" :src="tongji" alt="" /> {{ $t("home.统计数据") }}</span>
				<span class="color_Theme flex_space-between more" @click="moreStatisticsSwitch">{{ $t("home.更多") }} <SvgIcon iconName="arrowRight" /></span>
			</div>
			<div class="content flex_space-between" style="gap: 18px">
				<ul class="flex_space-between">
					<li>
						<h3>{{ $t("home.总胜注单") }}</h3>
						<p>0</p>
					</li>
					<li>
						<h3>{{ $t("home.总注单") }}</h3>
						<p>99.00$</p>
					</li>
					<li>
						<h3>{{ $t("home.总投注") }}</h3>
						<p>99.00$</p>
					</li>
				</ul>
			</div>
		</div>
		<Dialog title="明细" width="480" v-model="statisticsVisible">
			<template #header>
				<div class="my-header">
					<h4 class="color_Text_s fs_20 fw_500">
						<SvgIcon @click="goBack()" iconName="back_icon" width="20" height="20" alt="" />
						明细
					</h4>
					<SvgIcon
						class="close"
						@click="
							() => {
								moreStatisticsSwitch();
								emit('close');
							}
						"
						iconName="dialog_close"
					/>
				</div>
			</template>
			<div class="statisticsDetail">
				<Selector />
				<div class="card bg_Bg3 mb_12">
					<ul class="flex_space-between">
						<li>
							<h3>{{ $t("home.总胜注单") }}</h3>
							<p>0</p>
						</li>
						<li>
							<h3>{{ $t("home.总注单") }}</h3>
							<p>99.00$</p>
						</li>
						<li>
							<h3>{{ $t("home.总投注") }}</h3>
							<p>99.00$</p>
						</li>
					</ul>
				</div>
				<div class="card bg_Bg3 mb_12">
					<Table :tableData="defaultProps.data" :columns="defaultProps.columns">
						<template #cell-type="{ data }">
							<span>{{ data.type }}</span>
						</template>
						<template #cell-completedAmount="{ data }">
							<span>{{ data.completedAmount }}</span>
						</template>
						<template #cell-award="{ data }">
							<span>{{ data.award }}</span>
						</template>
					</Table>
				</div>
			</div>
		</Dialog>
	</div>
</template>
<script setup>
import { ref } from "vue";
import Dialog from "/@/components/Dialog/Dialog.vue";
import tongji from "/@/assets/zh/default/UserInfo/tongji.png";
import Table from "./Table/Table.vue";
import Selector from "./selector/selector.vue";
const statisticsVisible = ref(false);
const emit = defineEmits(["close"]);
const defaultProps = {
	// 表格数据
	data: [
		{
			type: "12",
			completedAmount: "10",
			award: "10$",
		},
		{
			type: "7",
			completedAmount: "89",
			award: "89$",
		},
	],

	// 列定义
	columns: [
		{ field: "type", label: "赢" },
		{ field: "completedAmount", label: "注单数" },
		{ field: "award", label: "奖金" },
	],
};
const moreStatisticsSwitch = () => {
	console.log("moreStatistics");
	statisticsVisible.value = !statisticsVisible.value;
};
const goBack = () => {
	statisticsVisible.value = false;
};
</script>
<style lang="scss" scoped>
.statisticsDetail {
	padding: 0 20px;
	.card {
		padding: 16px;
	}
}
.statistic,
.statisticsDetail {
	@include themeify {
		ul {
			gap: 6px;
			li {
				box-sizing: border-box;
				list-style: none;
				text-align: center;
				width: 132px;
				height: 86px;
				background-color: themed("Bg1");
				border-radius: 6px;
				padding: 16px 0;
				h3 {
					font-size: 14px;
					font-weight: 400;
					color: themed("Text_1");
					margin-bottom: 8px;
				}
				p {
					font-size: 16px;
					font-weight: 500;
					color: themed("Text_s");
				}
			}
		}
	}
}
.my-header {
	padding: 28px 32px;
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.my-header {
	h4 {
		@include flex_align_center;
		gap: 10px;
		svg {
			@include themeify {
				color: themed("icon");
			}
		}
	}
}
.statisticsDetail {
	height: 634px;
}
</style>
