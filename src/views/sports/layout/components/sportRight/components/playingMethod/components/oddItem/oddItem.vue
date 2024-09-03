<template>
	<div :class="['odd-item', layout, { isCheck, locked: computedLocked }]" @click="onSetSportsEventData">
		<SvgIcon class="sport_lock" iconName="sport_lock" :size="16" v-if="computedLocked" />

		<template v-else>
			<div class="odd-name-group" v-if="oddInfo?.keyName || oddInfo?.point">
				<span v-if="oddInfo?.keyName && marketInfo.betType !== 1" class="odd-name">{{ oddInfo?.keyName }}</span>
				<span v-if="Object.prototype.hasOwnProperty.call(oddInfo, 'point')" class="odd-point">
					<span v-if="shouldShowPoint(marketInfo.betType) && oddInfo.key !== 'x' && Number(oddInfo?.point) > 0">+</span>{{ oddInfo.point }}
				</span>
			</div>
			<div :class="['odd-price', computedPriceType]">{{ oddInfo?.oddsPrice?.decimalPrice }}</div>
			<RiseOrFall :time="3000" :status="oddsChange" @animationEnd="animationEnd" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, watch, ref, onBeforeMount, watchEffect } from "vue";
import { RiseOrFall } from "/@/components/Sport/index";
import { Selection, Market, SportsRootObject } from "/@/models/interface";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { shouldShowPoint } from "/@/utils/sports/formattingViewData";

/**
 * 由于子组件定义的数字，故跟随处理
 */
enum PriceChangeTypeEnum {
	Up = 1,
	Down = 2,
	Normal = 3,
}

interface OddItemType {
	eventInfo: SportsRootObject; // 赛事详情
	marketInfo: Market; // 玩法详情
	oddInfo: Selection; // 玩法内子项 赔率相关详情
	layout?: "center" | "between"; // 布局类型
}

const props = withDefaults(defineProps<OddItemType>(), {
	layout: "between",
});

const sportsBetEvent = useSportsBetEventStore();

const oddsChange = ref<PriceChangeTypeEnum>(PriceChangeTypeEnum.Normal);
const isCheck = ref(false);
/**
 * 计算投注项目是否 已锁定
 */
const computedLocked = computed(() => props.oddInfo?.oddsPrice?.decimalPrice === 0);

/**
 * 计算赔率class类型
 */
const computedPriceType = computed(() => {
	const priceClass = {
		[PriceChangeTypeEnum.Up]: "up",
		[PriceChangeTypeEnum.Down]: "down",
		[PriceChangeTypeEnum.Normal]: "normal",
	};
	return priceClass[oddsChange.value];
});

/**
 * 监听赔率变化
 */
watch(
	() => props.oddInfo?.oddsPrice?.decimalPrice,
	(newValue, oldValue) => {
		if (newValue && oldValue) {
			if (newValue > oldValue) {
				oddsChange.value = PriceChangeTypeEnum.Up;
			} else if (newValue < oldValue) {
				oddsChange.value = PriceChangeTypeEnum.Down;
			} else {
				oddsChange.value = PriceChangeTypeEnum.Normal;
			}
		}
	}
);

/**
 * @description 动画结束恢复oddsChange字段状态
 */
const animationEnd = () => {
	oddsChange.value = PriceChangeTypeEnum.Normal;
};

/**
 * @description 判断当前盘口是否存在pinia中
 */
const setIsCheck = () => {
	const { oddInfo, marketInfo } = props;
	isCheck.value = sportsBetEvent.getEventInfo[marketInfo.eventId]?.listKye === `${marketInfo?.marketId}-${oddInfo?.key}`;
};

onBeforeMount(() => {
	watchEffect(() => {
		setIsCheck();
	});
});

/**
 * @description 处理盘口高亮状态，拼接 marketid 与 selection key 作为唯一标识，存储值pinia中
 */
const onSetSportsEventData = () => {
	const { oddInfo, marketInfo, eventInfo } = props;
	//存储盘口唯一标识
	if (isCheck.value) {
		// 删除Pinia数据
		sportsBetEvent.removeEventCart(props.marketInfo);
	} else {
		sportsBetEvent.storeEventInfo(marketInfo.eventId, {
			marketId: marketInfo.marketId,
			betType: marketInfo.betType,
			selectionKey: oddInfo.key,
		});
		// 存储Pinia数据
		sportsBetEvent.addEventToCart(JSON.parse(JSON.stringify(eventInfo)));
	}
};
</script>

<style scoped lang="scss">
.up {
	@include themeify {
		color: themed("Warn") !important;
	}
}

.down {
	@include themeify {
		color: themed("Theme") !important;
	}
}

.odd-item {
	position: relative;
	width: 100%;
	display: inline-flex;
	align-items: center;
	padding: 0 12px;
	box-sizing: border-box;
	height: 44px;
	cursor: pointer;
	border-radius: 4px;
	@include themeify {
		background: themed("Bg3");

		&.isCheck {
			background: themed("Bg5");
		}
	}

	&:not(.isCheck):hover {
		@include themeify {
			background: themed("Line");
		}
	}

	&.locked {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: default;

		.svg-icon {
			cursor: default;
		}
	}

	&.between {
		justify-content: space-between;
	}

	&.center {
		justify-content: center;
	}

	.odd-price {
		font-size: 14px;

		@include themeify {
			color: themed("Text_s");
		}
	}

	.odd-name-group {
		font-size: 12px;
		display: flex;
		align-items: center;

		.odd-name {
			display: inline-block;
			max-width: 100px;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;

			@include themeify {
				color: themed("Text1");
			}
		}

		.odd-point {
			padding-left: 4px;
			@include themeify {
				color: themed("Text_s");
			}
		}
	}
}
</style>
