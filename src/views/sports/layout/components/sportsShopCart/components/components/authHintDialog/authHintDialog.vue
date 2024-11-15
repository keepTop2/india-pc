<template>
	<div class="tips" @click="onRadio">
		<div class="icon">
			<svg-icon :name="sportsBetEvent.radioStatus ? 'common-check_icon_on' : 'common-check_icon'" size="14px" />
		</div>
		<div class="text">自动接受更好的赔率</div>
	</div>

	<Dialog append-to-body v-model="hintVisible" width="380" class="hint-dialog">
		<template #header>
			<div class="dialog-header">温馨提示</div>
		</template>

		<div class="dialog-body">取消后您将“自动接受任何赔率”即无论下注时的赔率如何变化，系统都将默认您可以接受，页面会出现赔率变化提示，但不会中断您的下注行为。</div>

		<div class="know">
			<el-button @click="hintVisible = false">我知道了</el-button>
		</div>
	</Dialog>
</template>
<script setup lang="ts">
import { ElButton } from "element-plus";
import Dialog from "/@/components/Dialog/Dialog.vue";
import Common from "/@/utils/common";
import sportsApi from "/@/api/sports/sports";
import { getPublicSetting } from "/@/views/sports/utils/commonFn";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
const sportsBetEvent = useSportsBetEventStore();
const sportsInfoStore = useSportsInfoStore();

const hintVisible: any = defineModel();

const saveSetting = async () => {
	const params = {
		type: "sport_odds",
		value: sportsBetEvent.radioStatus ? 1 : 0,
	};
	const res = await sportsApi.saveSetting(params).catch((err) => err);
	if (res.code == Common.ResCode.SUCCESS) {
		getPublicSetting();
	}
};

const onRadio = () => {
	if (!sportsInfoStore.sportRadioStatus && sportsBetEvent.radioStatus) {
		sportsInfoStore.setSportRadioStatus();
		hintVisible.value = true;
	}
	sportsBetEvent.radioStatus = !sportsBetEvent.radioStatus;
	saveSetting();
};
</script>

<style scoped lang="scss">
.tips {
	width: fit-content;
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 10px;
	cursor: pointer;
	.icon {
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--Theme);
	}
	.text {
		color: var(--Text-1);
		font-family: "PingFang SC";
		font-size: 14px;
		font-weight: 400;
	}
}

.hint-dialog {
	:deep() {
		.el-dialog__body {
			padding: 20px;
		}
	}
}

.dialog-header {
	font-size: 20px;
	padding: 20px;
	text-align: center;
	color: var(--Text-s);
}

.dialog-body {
	font-size: 16px;
	line-height: 26px;
	padding: 16px 40px;
	color: var(--Text-1);
}
.know {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px 0;

	:deep(.el-button) {
		margin: 5px 0;
		border-radius: 4px;
		width: 130px;
		height: 48px;
		border: 1px solid var(--Theme);
		background: var(--Theme);
		color: var(--Text-a);
	}
}
</style>
