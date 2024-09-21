<template>
  <div class="competition">
    <spinner-wrap :model-value="loading" :top="200">
      <HeaderDetail
        v-if="!isEmpty(eventDetail)"
        @filter="filterData"
        :sportInfo="eventDetail"
        :loading="loading"
        @refresh="refresh"
        :expandAndCollapse="expandAndCollapse"
        @toggleAll="toggleAllDisplay"
      ></HeaderDetail>
      <div class="competition_two">
        <div class="box_team" v-if="eventDetail?.markets !== ''">
          <MarketItem :markets="markets" />
        </div>
        <div class="nonedata" v-else>
          <NoneData></NoneData>
        </div>
      </div>
    </spinner-wrap>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watchEffect } from "vue";
import { isEmpty } from "lodash-es";
import { LocationQueryValue, useRoute } from "vue-router";
import { SpinnerWrap } from "/@/components/Spinner";
import pubSub from "/@/pubSub/pubSub";
import HeaderDetail from "./components/headerDetail/headerDetail.vue";
import MarketItem from "./marketItem/marketItem.vue";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useUserStore } from "/@/stores/modules/user";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";
import { SportViewProcessWorkerCommandType, WorkerName } from "/@/enum/workerTransferEnum";
import { sportsEventDetailPush } from "/@/views/sports/utils/sportsMap/sportsSSERequestMap";
import workerManage from "/@/webWorker/workerManage";
import { watch } from "fs";

const UserStore = useUserStore();
const sportsInfoStore = useSportsInfoStore();

const { initSportPubsub, unSubSport, clearState, sportsLogin } = useSportPubSubEvents();
const route = useRoute();

const loading = ref(false);
const expandAndCollapse = ref(false);
const showMarkets = ref<Array<boolean>>([]);

const state = reactive({
  filtrateBetType: 0 as number,
});

/**
 * @description 获取赛事列表下的赛事
 * @returns 赛事数组
 */
const eventsList = computed(() => {
	const childrenViewData = viewSportPubSubEventData.viewSportData.childrenViewData;
	console.log(childrenViewData, "childrenViewData");
	if (childrenViewData) {
    return childrenViewData[0]?.events;
  }
  return [];
});

/**
 * @description 根据路由中的事件ID计算事件详情
 * @returns 事件详情对象
 */
const eventDetail = computed(() => {
  const { eventId } = route.query;
	const events = eventsList.value;
	console.log(events,'======events')
  return events?.filter((item: { eventId: LocationQueryValue | LocationQueryValue[]; }) => item.eventId == eventId)[0];
});

/**
 * @description 计算并组织市场数据
 * @returns 组织和排序后的市场数据
 */
const markets = computed(() => {
  let marketData: any = [];
  if (eventDetail.value) {
    const markets = eventDetail.value?.markets;
    for (const key in markets) {
      const market = markets[key];
      const { betTypeName, marketId, betType } = market;
      const existingMarketData = marketData.find((data: { betTypeName: any; }) => data.betTypeName === betTypeName);
      if (existingMarketData) {
        existingMarketData.markets[key] = market;
      } else {
        const newData: any = {
          betTypeName: betTypeName,
          marketId: marketId,
          betType: betType,
          markets: {
            [key]: market,
          },
        };
        marketData.push(newData);
      }
    }
  }
  marketData.sort((a: { betType: number; marketId: number; }, b: { betType: number; marketId: number; }) => {
    if (a.betType === b.betType) {
      return a.marketId - b.marketId;
    }
    return a.betType - b.betType;
  });
  return marketData;
});

const openSportPush = inject('openSportPush') as () => void;

watchEffect(() => {
  const { eventId } = route.query;
  if (eventId) {
    openSportPush();
  }
});

// 监听效果
watchEffect(() => {
  if (markets.value) {
    showMarkets.value = Array(markets.value.length).fill(false);
  }
});

/**
 * @description 根据提供的过滤项过滤数据
 * @param filterItem 要应用的过滤项
 */
const filterData = (filterItem: number) => {
  state.filtrateBetType = filterItem;
};

/**
 * @description 切换所有市场的显示状态
 */
const toggleAllDisplay = () => {
  expandAndCollapse.value = !expandAndCollapse.value;
  showMarkets.value = markets.value.map(() => !expandAndCollapse.value);
};

/**
 * @description 刷新体育数据
 */
const refresh = () => {
  loading.value = true;
};
</script>

<style scoped lang="scss">
.oddsUp {
  color: var(--Theme) !important;
}
.oddsDown {
  color: var(--Success) !important;
}
.competition {
  display: flex;
  flex-direction: column;
  min-height: 400px;
  overflow-y: auto;
  height: calc(100vh - 155px);
}
.competition::-webkit-scrollbar {
  display: none;
}
.competition_two {
  .box_team {
    .team {
      width: 100%;
      margin: 6px 0 8px 0;
      border-radius: 8px 8px 0px 0px;
      background: var(--Bg1-1, #24262b);
      box-shadow: 0px 1px 0px 0px var(--Bg1-1, #24262b) inset;
      .record {
        display: flex;
        align-items: center;
        padding: 12px 0;
        .record_one {
          width: 4px;
          height: 22px;
          border-radius: 0px 4px 4px 0px;
          background: var(--Theme, #3bc116);
          margin-right: 12px;
        }
        .record_two {
          color: var(--Text1-1, #98a7b5);
          font-family: "PingFang SC";
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
  }
  .nonedata {
    margin-top: 20%;
  }
}
</style>
