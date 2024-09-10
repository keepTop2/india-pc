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
				<!-- 有可能显示接受赔率变化的情况 -->
				<template v-if="showAccept">
					<!-- 接受赔率变动需要接受赔率按钮 -->
					<template v-if="isChange">
						<el-button @click="onChangeAccept"> 接受赔率变化</el-button>
					</template>
					<template v-else>
						<el-button @click="onBetting" :disabled="btnDisabled">
							<div class="center">
								<span>投注</span>
								<span class="center_buttom">最高可赢{{ Common.formatFloat(maxWinnable) }}</span>
							</div>
						</el-button>
					</template>
				</template>

				<!-- 接受赔率变化 直接投注 -->
				<template v-else>
					<el-button @click="onBetting" :disabled="btnDisabled">
						<div class="center">
							<span>投注</span>
							<span class="center_buttom">最高可赢{{ Common.formatFloat(maxWinnable) }}</span>
						</div>
					</el-button>
				</template>
			</template>
			<!-- 按钮不可点击 -->
			<template v-else>
				<el-button class="isClose" :disabled="btnDisabled">
					<!-- 1.盘口关闭 -->
					<div v-if="!handicapClose()">
						<!-- 盘口是否支持串关 -->
						<template v-if="!judgeCrossBorder()">
							<!-- 暂时不支持投注 -->
							<template v-if="sportsBetEvent.getNobetsMarketIds.length > 0">
								<span> 暂时不支持投注 </span>
							</template>
							<template v-else>
								<!-- 盘口场次过多 -->
								<template v-if="sportsBetEvent.sportsBetEventData.length > maxSelect">
									<span class="max-select">最多选择{{ maxSelect }}场比赛</span>
								</template>
								<!-- 盘口场次过少 -->
								<template v-if="sportsBetEvent.sportsBetEventData.length < sportsBetEvent.combo">
									<span class="max-select">至少选择{{ sportsBetEvent.combo }}场比赛</span>
								</template>
							</template>
						</template>
						<template v-else>
							<!-- <span> 不支持串关 </span> -->
							<div class="center">
								<!-- 盘口已关闭 -->
								<span>投注</span>
								<span class="center_buttom">最高可赢{{ Common.formatFloat(maxWinnable) }}</span>
							</div>
						</template>
					</div>
					<div v-else class="center">
						<!-- 盘口已关闭 -->
						<span>投注</span>
						<span class="center_buttom">最高可赢{{ Common.formatFloat(maxWinnable) }}</span>
					</div>
					<!-- <div v-else　class="center">
						<span>投注</span>
						<span class="center_buttom">最高可赢{{ Common.formatFloat(maxWinnable) }}</span>
					</div> -->
				</el-button>
			</template>
		</div>
		<el-button class="btn-cuan" @click="click_chuan">+ 串</el-button>
	</div>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { computed, inject, onMounted, ref, watch, nextTick } from "vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import sportsApi from "/@/api/sports/sports";
import Common from "/@/utils/common";
import { useRouter } from "vue-router";

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";

const ShopCatControlStore = useShopCatControlStore();
const emits = defineEmits(["onBetting", "setDisabled"]);
const sportsBetEvent = useSportsBetEventStore();
const router = useRouter();

const props = withDefaults(
	defineProps<{
		/**所有下注额度 */
		maxWinnable: number | string;
	}>(),
	{
		maxWinnable: 0,
	}
);

const showAccept = computed(() => {
	if (sportsBetEvent.getOddsOption == 2 || sportsBetEvent.getPriceOption == 1) {
		return true;
	} else {
		return false;
	}
});

const isAccept = defineModel("isAccept"); //暂时就串关可用

const vendorTransId = defineModel("vendorTransId");

const isChange = defineModel("isChange");

/*串关最大选择数量*/
const maxSelect = 10;

/** 判断是否显示删除按钮 */
const isBtnClose = computed(() => {
	return sportsBetEvent.sportsBetEventData.length > 1;
});

// const getTofixed = (value: any) => {
// 	return value.toFixed(2);
// };
/*加串*/
const click_chuan = () => {
	ShopCatControlStore.setShopCatShow(false);
};

/**
 * @description:接受赔率变化（显示下单按钮）
 * @return {*}
 */
const onChangeAccept = () => {
	isChange.value = false;
	// isAccept.value = true;
};

/**
 * @description: 底部按钮空购物车(不隐藏)
 */
const handleClose = () => {
	sportsBetEvent.clearShopCart();
};

onMounted(() => {
	nextTick(() => {});
});

/**
 * 判断支持串关
 */
const judgeCrossBorder = () => {
	const result = sportsBetEvent.sportsBetEventData.find((v) => {
		if (v.betMarketInfo?.differentBalls || v.betMarketInfo?.combo == 0) {
			return true;
		}
	});
	return result;
};

/**
 * 判断有无盘口关闭
 */
const handicapClose = () => {
	const result = sportsBetEvent.sportsBetEventData.find((v) => {
		if (v.eventStatus !== "running" || v.betMarketInfo?.marketStatus !== "running") {
			return true;
		}
	});
	return result;
};

/**
 * @description: : 进行投注事件激活
 */
const onBetting = () => {
	emits("onBetting");
};

/**
 * @description: 判断投注按钮是否可点击；(便利查询购物车是否拥有异常情况)
 * @return {*}
 */
const btnDisabled = computed(() => {
	if (
		sportsBetEvent.sportsBetEventData.length > maxSelect ||
		sportsBetEvent.sportsBetEventData.length < sportsBetEvent.combo ||
		handicapClose() ||
		judgeCrossBorder() ||
		sportsBetEvent.getNobetsMarketIds.length
	) {
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
</script>

<style scoped lang="scss">
.btn-plan {
	display: flex;
	gap: 5px;
	margin-top: 10px;
	:deep(.el-button) {
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

		:deep(.el-button) {
			border-radius: 4px;
			height: 48px;
			width: 100%;
			border: 1px solid var(--Theme);
			background: var(--Theme);
			color: var(--Text_a);

			.center {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				color: var(--Text_a);
				font-family: "PingFang SC";
				font-size: 16px;
				font-weight: 500;
				line-height: 22px;
				.center_buttom {
					color: var(--Text_a);
					font-family: "PingFang SC";
					font-size: 12px;
					font-weight: 400;
					line-height: 16px;
				}
			}
		}
	}

	.isClose {
		border-radius: 4px;
		height: 48px;
		width: 100%;
		border: 1px solid var(--butter) !important ;
		background: var(--butter) !important ;
		color: var(--Text_a);
	}
}

.max-select {
	font-size: 16px !important;
}
</style>
