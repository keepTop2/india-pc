<!--
 * @Author: Relax
 * @Description: 优惠活动—促销活动
-->
<template>
	<div class="base-container">
		<div class="container-main">
			<div class="title">{{ $t(`menu.specialOffer['促销活动']`) }}</div>
			<div class="box">
				<el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
					<el-tab-pane :label="$t(`menu.specialOffer['最新活动']`)" name="first">
						<div v-if="filteredList.length != 0" class="content">
							<div class="activityList">
								<div class="activityList_item" v-for="item in filteredList" :key="item.id" @click="onToDeatils(item)">
									<img :src="item.imageUrl" alt="" />
									<div class="text_container">
										<div class="date">
											<div class="deadline">{{ $t(`menu.specialOffer['截止于']`) }} {{ item.deadline }}</div>
											<div class="activity_name">{{ item.activityName }}</div>
										</div>
										<button class="but">{{ item.status == '1' ? $t(`menu.specialOffer['进行中']`) : 0 }}</button>
									</div>
								</div>
							</div>
						</div>
						<NoneData v-else></NoneData>
					</el-tab-pane>
					<el-tab-pane :label="$t(`menu.specialOffer['过期活动']`)" name="second">
						<div v-if="expiredActivities.length != 0" class="content">
							<div class="activityList">
								<div class="activityList_item" v-for="item in expiredActivities" :key="item.id">
									<img :src="item.imageUrl" alt="" />
									<div class="text_container">
										<div class="date">
											<div class="deadline">{{ $t(`menu.specialOffer['截止于']`) }} {{ item.deadline }}</div>
											<div class="activity_name">{{ item.activityName }}</div>
										</div>
										<button class="expiredBut">{{ item.status }}</button>
									</div>
								</div>
							</div>
						</div>
						<NoneData v-else></NoneData>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import specialOffer12 from '/@/assets/zh/default/menu/specialOffer/specialOffer12.png';
import specialOffer13 from '/@/assets/zh/default/menu/specialOffer/specialOffer13.png';
import specialOffer14 from '/@/assets/zh/default/menu/specialOffer/specialOffer14.png';
import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();

const activeName = ref('first');

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
};

//跳转活动详情
const onToDeatils = (item: any) => {
	console.log('跳转活动详情');

	const routeParam = {
		path: '/specialOffer/activityParticulars',
		query: { id: item.id, name: item.name },
	};

	router.push(routeParam);
};

const filteredList = [
	{
		id: 1,
		imageUrl: specialOffer12,
		deadline: '2024年1月2日 24:00:00',
		activityName: '假数据活动1',
		status: '1',
	},
	{
		id: 2,
		imageUrl: specialOffer13,
		deadline: '2024年1月4日 24:00:00',
		activityName: '假数据活动2',
		status: '0',
	},
	{
		id: 3,
		imageUrl: specialOffer14,
		deadline: '2024年1月6日 24:00:00',
		activityName: '冰雪对决：排名挑战长标题展示效果11111',
		status: '1',
	},
	{
		id: 4,
		imageUrl: specialOffer12,
		deadline: '2024年1月8日 24:00:00',
		activityName: '假数据活动4',
		status: '1',
	},
	{
		id: 5,
		imageUrl: specialOffer13,
		deadline: '2024年1月10日 24:00:00',
		activityName: '11111111111111111111111111效果',
		status: '1',
	},
	{
		id: 6,
		imageUrl: specialOffer14,
		deadline: '2024年1月12日 24:00:00',
		activityName: '假数据活动6',
		status: '1',
	},
	{
		id: 7,
		imageUrl: specialOffer12,
		deadline: '2024年1月14日 24:00:00',
		activityName: '假数据活动7',
		status: '1',
	},
];
const expiredActivities = [
	// {
	// 	id: 1,
	// 	imageUrl: specialOffer12,
	// 	deadline: '2024年1月2日 24:00:00',
	// 	activityName: '假数据活动1',
	// 	status: '活动结束',
	// },
	// {
	// 	id: 2,
	// 	imageUrl: specialOffer13,
	// 	deadline: '2024年1月4日 24:00:00',
	// 	activityName: '假数据活动2',
	// 	status: '活动结束',
	// },
];
</script>

<style lang="scss" scoped>
.title {
	@include themeify {
		color: themed('Text_s');
	}

	font-family: 'PingFang SC';
	font-size: 20px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	text-transform: uppercase;
	margin-top: 30px;
}

:deep(.el-tabs--card > .el-tabs__header) {
	border: none;
	margin: 34px 0;
}

.box:deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
	border: none;

	@include themeify {
		color: themed('Text2_1');
		background: themed('Bg2');
	}

	font-family: 'PingFang SC';
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	text-transform: uppercase;
	border-radius: 4px;
}

.box:deep(.el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:last-child) {
	border: none;
	padding: 13px 58px;
}

.box:deep(.el-tabs__item.is-active) {
	border: none;
	border-radius: 4px;

	@include themeify {
		background: themed('Bg3');
		color: themed('Text_s');
	}

	font-family: 'PingFang SC';
	font-size: 16px;
	font-style: normal;
	font-weight: 600;
	line-height: normal;
	text-transform: uppercase;
	padding: 13px 58px;
}

.activityList {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;

	.activityList_item {
		width: calc(33.33% - 10px);
		margin-bottom: 20px;
		border-radius: 12px;

		@include themeify {
			background: themed('Bg1');
		}

		img {
			width: 392px;
			height: 160px;
			flex-shrink: 0;
			border-radius: 12px;
			-webkit-user-drag: none;
		}

		.text_container {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 18px 14px 26px 14px;

			.date {
				.deadline {
					@include themeify {
						color: themed('Text2_1');
					}

					font-family: 'PingFang SC';
					font-size: 14px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;
					text-transform: uppercase;
				}

				.activity_name {
					width: 238px;

					@include themeify {
						color: themed('Text1');
					}

					font-family: 'PingFang SC';
					font-size: 14px;
					font-style: normal;
					font-weight: 600;
					line-height: normal;
					text-transform: uppercase;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 1;
					display: -webkit-box;
					-webkit-box-orient: vertical;
				}
			}

			.but {
				padding: 8px 29px;
				border-radius: 4px;

				@include themeify {
					background: themed('Bg3');
					color: themed('Theme');
				}

				border: none;
				text-align: center;
				font-family: 'PingFang SC';
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				text-transform: uppercase;
			}

			.expiredBut {
				padding: 8px 29px;
				border-radius: 4px;

				@include themeify {
					background: themed('Bg3');
					color: themed('Text1');
				}

				border: none;
				text-align: center;
				font-family: 'PingFang SC';
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				text-transform: uppercase;
			}
		}
	}
}

.base-container {
	display: flex;
	justify-content: center;

	.container-main {
		width: 1200px;
	}
}

.box:deep(.el-tabs__item):hover {
	@include themeify {
		color: themed('Text2_1');
	}
}

.box:deep(.el-tabs__item) {
	border: none;
	padding: 13px 58px;

	@include themeify {
		color: themed('Text2_1');
	}
}
</style>
