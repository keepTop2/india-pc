<template>
	<div class="wrapper2">
		<div class="flex_space-between Text_s p_24">
			<svg-icon name="common-arrow_left" width="13px" height="24px" class="curp" @click="emit('update:modelValue', 0)"></svg-icon>
			<span class="fs_18">勋章收藏者</span>
			<svg-icon name="common-close" size="30px" class="curp" @click="useModalStore().closeModal()"></svg-icon>
		</div>
		<div class="content">
			<div class="treasureChest">
				<div class="boxList">
					<div
						v-for="(item, index) in medalRewardRespVOS"
						class="box"
						@click="openMedalReward(item)"
						:class="medalRewardRespVOS.filter((item: any) => item.openStatus !== 2).length  > index ? 'active' : ''"
					>
						<img :src="imgObj['status' + item.openStatus + '_' + (index + 1)]" alt="" />
						<div>{{ item.unlockMedalNum }}</div>
					</div>
				</div>

				<div class="progress mb_14">
					<div class="value" :style="{ width: (findInterval() > 0 ? findInterval() : 0) + '%' }"></div>
				</div>
				<div class="medalRewardList">
					<div v-for="(item, index) in medalRewardRespVOS" class="pl_16">
						<div>
							解锁<span class="color_Theme">{{ item.unlockMedalNum }}枚</span> 勋章:获得 {{ useUserStore().getUserInfo.platCurrencySymbol }} {{ item.rewardAmount }}
						</div>
					</div>
					<div class="mark">
						<ClickTooltip class="ml_5 curp" right="true" width="100">
							<template v-slot:icon>
								<svg-icon name="mark " size="20px"></svg-icon>
							</template>
							<template v-slot:message>
								宝箱奖励流水倍数{{
									medalRewardRespVOS.find((item: any) => item.openStatus !== 1)?.typingMultiple || medalRewardRespVOS[medalRewardRespVOS.length - 1]?.typingMultiple
								}}为倍
							</template>
						</ClickTooltip>
					</div>
				</div>
			</div>
			<div class="title flex_space-between Text_s">
				<span>已解锁 <span class="fs_14 Text1" v-if="hasUnlockList.length < 1">(您还未获得任何勋章，积极玩游戏获得更多勋章)</span></span>
			</div>
			<medalCard :medalList="hasUnlockList" class="mt_12" @gotoDetails="gotoDetails"></medalCard>
			<div class="line"></div>
			<div class="title flex_space-between Text_s">
				<span>未解锁 <span class="fs_14 Text1">(提示：点击勋章图标查看勋章奖励和详情)</span></span>
			</div>
			<medalCard :medalList="notUnlockList" class="mt_12" @gotoDetails="gotoDetails" @updateList="getUserMedalInfo"></medalCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from "/@/stores/modules/user";
import medalCard from "./medalCard.vue";
import { onMounted, ref } from "vue";
import { MedalApi } from "/@/api/medal";
import { useModalStore } from "/@/stores/modules/modalStore";
import status0_1 from "./image/status0_1.png";
import status0_2 from "./image/status0_2.png";
import status0_3 from "./image/status0_3.png";
import status0_4 from "./image/status0_4.png";
import status0_5 from "./image/status0_5.png";
import status1_1 from "./image/status1_1.png";
import status1_2 from "./image/status1_2.png";
import status1_3 from "./image/status1_3.png";
import status1_4 from "./image/status1_4.png";
import status1_5 from "./image/status1_5.png";
import status2_1 from "./image/status2_1.png";
import status2_2 from "./image/status2_2.png";
import status2_3 from "./image/status2_3.png";
import status2_4 from "./image/status2_4.png";
import status2_5 from "./image/status2_5.png";
import showToast from "/@/hooks/useToast";

const imgObj: any = {
	status0_1,
	status0_2,
	status0_3,
	status0_4,
	status0_5,
	status1_1,
	status1_2,
	status1_3,
	status1_4,
	status1_5,
	status2_1,
	status2_2,
	status2_3,
	status2_4,
	status2_5,
};
const vipInfo: any = ref({});
const notUnlockList = ref([]);
const medalRewardRespVOS: any = ref([]);
const hasUnlockList = ref([]);
const rewardRemarkList = ref([]);
const emit = defineEmits(["update:modelValue", "setCurrentMedal"]);
onMounted(async () => {
	await getUserMedalInfo();
	findInterval();
});

const getUserMedalInfo = async () => {
	await MedalApi.getUserMedalInfo().then((res) => {
		notUnlockList.value = res.data.notUnlockList;
		medalRewardRespVOS.value = res.data.medalRewardRespVOS;
		hasUnlockList.value = res.data.hasUnlockList;
		rewardRemarkList.value = res.data.rewardRemarkList;
	});
};
const gotoDetails = (item: any) => {
	emit("setCurrentMedal", item);
	emit("update:modelValue", 2);
};

const findInterval = () => {
	const intervals = medalRewardRespVOS.value.map((item: any) => item.unlockMedalNum);

	const num = hasUnlockList.value.length;

	if (num < 0) {
		return 0;
	}

	let index = 0;
	let max = 0;
	let min = 0;
	for (let i = 0; i < intervals.length - 1; i++) {
		if (intervals[i] <= num && num <= intervals[i + 1]) {
			max = intervals[i + 1];
			min = intervals[i];
			index = i + 1;
		}
	}
	const index2 = ((num - min) / (max - min)) * 20;
	return index * 20 + index2;
};
const openMedalReward = (item: any) => {
	if (item.openStatus === 0) {
		MedalApi.openMedalReward({ rewardNo: item.rewardNo }).then(async (res) => {
			showToast(`恭喜你获得${res.data.unlockMedalNum}个勋章，解锁宝箱，奖励${useUserStore().getUserInfo.platCurrencySymbol} ${res.data.rewardAmount}已发送到您的账号`);
			await getUserMedalInfo();
			findInterval();
		});
	}
};
</script>

<style scoped lang="scss">
.wrapper2 {
	width: 480px;
	height: 720px;
	overflow: hidden;
	border-radius: 12px;
	background: url("./image/bg.png") no-repeat;
	background-size: 100% auto;
	.title {
		margin-top: 22px;
		margin-bottom: 14px;
	}
	.treasureChest {
		height: 243px;
		border-radius: 12px;
		background-image: linear-gradient(180deg, #212530 0%, #24262b 100%);
		.boxList {
			display: flex;
			gap: 15px;
			margin-left: 60px;
			padding-top: 14px;
			flex-wrap: wrap;
			.box {
				text-align: center;
				position: relative;
			}
			.box::after {
				content: url("./image/jiantou.svg");
				width: 10px;
				height: 10px;
				position: absolute;
				bottom: 0px;
				left: 50%;
				transform: translateX(-50%);
			}
			.active.box::after {
				content: url("./image/jiantou_active.svg");
				width: 10px;
				height: 10px;
				position: absolute;
				bottom: 0px;
				left: 50%;
				transform: translateX(-50%);
			}
			img {
				width: 55.769px;
				height: 51.865px;
			}
		}
		.medalRewardList {
			line-height: 1.6;
			color: var(--Text-s);
			font-size: 15px;
			position: relative;
		}
		.mark {
			position: absolute;
			right: 14px;
			top: 0;
			cursor: pointer;
		}
		.progress {
			height: 2px;
			height: 8px;
			border-radius: 7.385px;
			background: var(--Bg-2);
			margin: 5px 41px 0 16px;
			.value {
				height: 100%;
				background: red;
				border-radius: 7.385px;
			}
		}
	}
	.content {
		height: calc(720px - 100px);
		overflow-y: auto;
		padding: 24px;
		overflow-x: hidden;
	}
}
.line {
	background: var(--Line-2);
	border-radius: 4.8px;
	height: 1px;
}
</style>
