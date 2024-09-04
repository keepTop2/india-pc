<template>
	<div class="btn-plan">
		<el-button v-if="isBtnClose" class="btn-close" @click="handleClose">
			<el-icon size="18">
				<Delete />
			</el-icon>
		</el-button>
		<div class="btn-touzhu">
			<!-- 判断按钮是否禁用（可点击） -->
			<template v-if="!btnDisabled">
				<!-- 不接接受赔率变动需要接受赔率按钮 -->
				<template v-if="!isAccept">
					<el-button @click="onChangeAccept"> 接受赔率变化</el-button>
				</template>
				<!-- 接受赔率变化 直接投注 -->
				<template v-else>
					<el-button @click="onBetting" :disabled="btnDisabled">
						<div class="center">
							<span>投注</span>
							<span class="center_buttom">最高可赢{{ maxWinnable }}</span>
						</div>
					</el-button>
				</template>
			</template>
			<!-- 按钮不可点击 -->
			<template v-else>
				<el-button class="isClose" :disabled="btnDisabled">
					<!-- 1.盘口关闭 -->
					<div v-if="examineEventsStatus">
						<!-- 盘口场次过多 -->
						<template v-if="ChampionShopCartStore.outrightBetData.length > maxSelect">
							<span class="max-select">最多选择{{ maxSelect }}场比赛</span>
						</template>
						<!-- 盘口场次过少 -->
						<template v-if="ChampionShopCartStore.outrightBetData.length > 1">
							<div class="center">
								<span>投注</span>
								<span class="center_buttom">最高可赢{{ maxWinnable }}</span>
							</div>
						</template>
						<template v-else>
							<span> 不支持串关 </span>
						</template>
					</div>
					<div v-else class="center">
						<span>投注</span>
						<span class="center_buttom">最高可赢{{ maxWinnable }}</span>
					</div>
				</el-button>
			</template>
		</div>
		<!-- <el-button class="btn-cuan" @click="click_chuan">+ 串</el-button> -->
	</div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, watch, nextTick } from "vue";
import { ElButton } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import sportsApi from "/@/api/sports/sports";
import Common from "/@/utils/common";
import { useRouter } from "vue-router";
import { useChampionShopCartStore } from "/@/stores/modules/sports/championShopCart";

const ChampionShopCartStore = useChampionShopCartStore();

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
const ShopCatControlStore = useShopCatControlStore();

const emits = defineEmits(["onBetting", "setDisabled"]);
const sportsBetEvent = useSportsBetEventStore();
const props = withDefaults(
	defineProps<{
		/**所有下注额度 */
		maxWinnable: number | string;
	}>(),
	{
		maxWinnable: 0,
	}
);

const isAccept = defineModel("isAccept");
const vendorTransId = defineModel("vendorTransId");
const isChange = defineModel("isChange");

// 赛事信息状态 默认为支持串关状态
const EventsStatus = reactive({
	text: "",
	closeStatus: null as null | boolean,
});

/*串关最大选择数量*/
const maxSelect = 10;

/** 判断是否显示删除按钮 */
const isBtnClose = computed(() => {
	return ChampionShopCartStore.outrightBetData.length > 1;
});

// const getTofixed = (value: any) => {
// 	return value.toFixed(2);
// };

/*加串*/
const click_chuan = () => {
	ShopCatControlStore.setShopCatShow(false);
};

/**
 * @description: 改变是否接受赔率变化状态
 * @return {*}
 */
const onChangeAccept = () => {
	isAccept.value = true;
};

/**
 * @description: 底部按钮空购物车(不隐藏)
 */
const handleClose = () => {
	ChampionShopCartStore.clearOutrightShopCart();
};

onMounted(() => {
	nextTick(() => {});
});

/**
 * @description 判断盘口是否关闭；
 */
const examineEventsStatus = computed(() => {
	EventsStatus.text = "";
	EventsStatus.closeStatus = null;
	const outrightBetData = ChampionShopCartStore.getOutrightBetData;
	for (let i = 0; i < outrightBetData.length; i++) {
		const v = outrightBetData[i];
		if (v?.oddsStatus !== "running" && v?.oddsStatus !== "Running") {
			EventsStatus.text = "盘口已关闭";
			EventsStatus.closeStatus = true; // 改变盘口关闭状态
			break;
		}
	}
	// 如果已有盘口关闭，就退出，没有继续检查是否支持串关
	if (EventsStatus.closeStatus) {
		return false;
	} else {
		// 都支持则返回true
		return true;
	}
});
/**
 * @description: 判断投注按钮是否可点击；(便利查询购物车是否拥有异常情况)
 * @return {*}
 */
const btnDisabled = computed(() => {
	if (ChampionShopCartStore.outrightBetData.length > maxSelect || ChampionShopCartStore.outrightBetData.length > 1 || !examineEventsStatus.value) {
		return true;
	} else {
		return false;
	}
});
watch(
	() => btnDisabled.value,
	(newValue, oldValue) => {
		emits("setDisabled", newValue);
	}
);

/**
 * @description: : 进行投注事件激活
 */
const onBetting = () => {
	emits("onBetting");
};
</script>

<style scoped lang="scss">
.btn-plan {
	display: flex;

	:deep(.el-button) {
		margin: 5px 0;
		border-radius: 4px;
		height: 48px;
		border: 1px solid var(--Theme);
		background: var(--Theme);
		color: var(--Text_a);
	}

	.btn-close,
	.btn-cuan {
		width: 112px;
	}

	.btn-touzhu {
		flex: 1;
		margin: 0 5px;

		:deep(.el-button) {
			margin: 5px 0;
			border-radius: 4px;
			height: 48px;
			width: 100%;
			border: 1px solid var(--Theme);
			background: var(--Theme);
			color: var(--Text_a);
		}
	}

	.el-button:first-child {
		margin-left: 0;
	}

	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--Text_a);

		& > span:last-child {
			font-size: 12px;
		}

		.center_buttom {
			margin-top: 5px;
		}
	}

	.isClose {
		margin: 5px 0;
		border-radius: 4px;
		height: 48px;
		width: 100%;
		border: 1px solid var(--icon) !important ;
		background: var(--icon) !important ;
		color: var(--Text_a);
	}
}

.max-select {
	font-size: 16px !important;
}
</style>
<style lang="scss">
.custom-confirm-class {
	.el-message-box__btns {
		display: flex !important;
	}
	.button {
		width: 100px !important;
	}
}
</style>
