/**
 * @description 体育赛事相关的钩子函数
 * @returns {Object} 返回一个包含各种方法和状态的对象
 */
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSportsBetEventStore } from '/@/stores/modules/sports/sportsBetData';
import { useSportMorningTradingStore } from '/@/stores/modules/sports/sportMorningTrading';
import { usePopularLeague } from '/@/stores/modules/sports/popularLeague';
import { useSportAttentionStore } from '/@/stores/modules/sports/sportAttention';
import { useShopCatControlStore } from '/@/stores/modules/sports/shopCatControl';
import { useSportLeagueSearchStore } from '/@/stores/modules/sports/sportLeagueSearch';
import { useSportsInfoStore } from '/@/stores/modules/sports/sportsInfo';
import { useToolsHooks } from '/@/views/sports/hooks/scoreboardTools';
import SportsCommonFn from '/@/views/sports/utils/common';
import { sportTabPushActions, sportsEventDetailPush } from '/@/views/sports/utils/sportsMap/sportsSSERequestMap';
import { WorkerName, SportViewProcessWorkerCommandType } from '/@/enum/workerTransferEnum';
import pubSub from '/@/pubSub/pubSub';
import moment from 'moment';
import { betTypes } from '/@/views/sports/utils/sportsMap/sportsBetType';
import workerManage from '/@/webWorker/workerManage';
import { useSidebarStore } from '/@/stores/modules/sports/sidebarData';

export function useSportEvents() {
  const route = useRoute();
  const router = useRouter();
  const sportsBetEvent = useSportsBetEventStore();
  const SportMorningTradingStore = useSportMorningTradingStore();
  const popularLeague = usePopularLeague();
  const SportAttentionStore = useSportAttentionStore();
  const ShopCatControlStore = useShopCatControlStore();
  const SportLeagueSearchStore = useSportLeagueSearchStore();
  const SportsInfoStore = useSportsInfoStore();
  const SidebarStore = useSidebarStore();
  const { getSidebarEventSSEPush, getSidebarMarketSSEPush, getPromotions } = useToolsHooks();

  /**
   * @description 当前体育类型
   */
  const sportType = computed(() => route.query.sportType as string);

  /**
   * @description 当前活动标签
   */
  const tabActive = ref('');

  /**
   * @description 路由映射表
   */
  const routeMap = {
    "/sports/todayContest/rollingBall": "rollingBall",
    "/sports/todayContest/notStarted": "todayContest",
    "/sports/morningTrading": "morningTrading",
    "/sports/champion": "champion",
  } as const;

  /**
   * @description 监听路由变化，更新活动标签
   */
  watch(() => route.path, (newPath) => {
    tabActive.value = routeMap[newPath as keyof typeof routeMap] || '';
  }, { immediate: true });

  /**
   * @description 处理体育赛事推送
   * @param {string} type - 体育类型
   */
  const handleSportEventsPush = async (type = "1") => {
    const params = {
      apiUrl: SportsCommonFn.getSportPushApiUrl(),
      token: SportsInfoStore.getSportsToken,
      language: SportsCommonFn.getSportLanguage(),
    };

    const pushActions = {
      rollingBall: () => sendWorkerCommand(sportTabPushActions.rollingBall.openEvents(type), params),
      todayContest: () => sendWorkerCommand(sportTabPushActions.todayContest.openEvents(type), params),
      morningTrading: () => {
        const { startDate, endDate } = SportMorningTradingStore.getTimeInterval;
        const queryParams = SportMorningTradingStore.getActiveDate
          ? {
              query: `$filter= sportType in (${type})`,
              from: startDate,
              until: endDate,
              includeMarkets: `$filter=bettype in (${betTypes})`,
            }
          : {
              query: `$filter= sportType in (${type})`,
              includeMarkets: `$filter=bettype in (${betTypes})`,
              from: moment.utc().add(8 - 5 / 24, "day").startOf("day").add(5, "hour").format("YYYY-MM-DDTHH:mm:ss"),
            };
        sendWorkerCommand(sportTabPushActions.morningTrading.openEvents(type), params, { params: queryParams });
      },
      champion: () => sendWorkerCommand(sportTabPushActions.champion.openEvents(type), params),
    };

    const action = pushActions[tabActive.value as keyof typeof pushActions];
    if (action) {
      action();
    }
  };

  /**
   * @description 打开体育推送
   * @param {string | undefined} type - 体育类型
   */
  const openSportPush = async (type?: string | undefined) => {
    sportsBetEvent.clearHotLeagueList();
    pubSub.publish("clearHotLeagueList", "on");
    clearStore();
    closeSportViewProcessWorker();
    openSportViewProcessWorker();

    await handleSportPush();

    if (route.path === "/sports/collect") {
      await openAttentionSSE();
    } else if (route.path === "/sports/detail") {
      getSidebarEventSSEPush(route.query.eventId);
      getSidebarMarketSSEPush(route.query.eventId);
    } else {
      await handleSportEventsPush(type || sportType.value);
    }
  };

  /**
   * @description 处理体育推送
   */
  const handleSportPush = async () => {
    const params = {
      apiUrl: SportsCommonFn.getSportPushApiUrl(),
      token: SportsInfoStore.getSportsToken,
      language: SportsCommonFn.getSportLanguage(),
    };
    const action = sportTabPushActions[tabActive.value as keyof typeof sportTabPushActions]?.openSport || sportTabPushActions.rollingBall.openSport;
    sendWorkerCommand(action, params);
  };

  /**
   * @description 发送worker命令
   * @param {any} action - 动作
   * @param {Object} params - 参数
   * @param {Object} additionalParams - 额外参数
   */
  const sendWorkerCommand = (action: any, params = {}, additionalParams = {}) => {
    pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sportViewProcessWorker;
    pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sportEventSource;
    pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, action, params, additionalParams);
    pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
  };

  /**
   * @description 打开关注SSE
   */
  const openAttentionSSE = async () => {
    const attentionSwitch = SportAttentionStore.attentionType;
    attentionSwitch === "event" ? openAttentionEventSSE() : openAttentionOutrightSSE();
  };

  /**
   * @description 打开关注赛事SSE
   */
  const openAttentionEventSSE = () => {
    const params = {
      apiUrl: SportsCommonFn.getSportPushApiUrl(),
      token: SportsInfoStore.getSportsToken,
      language: SportsCommonFn.getSportLanguage(),
    };

    const attentionParams = {
      params: {
        query: `$filter= eventId in (${SportAttentionStore.attentionEventIdList.join()})&$orderby=globalShowTime asc `,
        includeMarkets: `$filter=bettype in (${betTypes})`,
      },
    };
    sendWorkerCommand(sportTabPushActions.attention.openEvents, { ...params, ...attentionParams });
  };

  /**
   * @description 打开关注冠军赛事SSE
   */
  const openAttentionOutrightSSE = () => {
    const params = {
      apiUrl: SportsCommonFn.getSportPushApiUrl(),
      token: SportsInfoStore.getSportsToken,
      language: SportsCommonFn.getSportLanguage(),
    };

    const attentionParams = {
      params: {
        query: `$filter= leagueId in (${SportAttentionStore.attentionLeagueIdList.join()})&$orderby=eventDate asc `,
        includeMarkets: `$filter=bettype in (${betTypes})`,
      },
    };

    sendWorkerCommand(sportTabPushActions.attention.openOutright, { ...params, ...attentionParams });
  };

  /**
   * @description 清除store
   */
  const clearStore = () => {
    SportLeagueSearchStore.clearLeagueSelect();
    SidebarStore.clearEventsInfo();
  };

  /**
   * @description 关闭体育视图处理worker
   */
  const closeSportViewProcessWorker = () => {
    try {
      if (workerManage.getWorkerList().length) {
        // 关闭列表events线程
        workerManage.stopWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
        // 关闭侧边栏events线程
        workerManage.stopWorker(workerManage.WorkerMap.sidebarWorker.workerName);
      }
    } catch (error) {
      console.error("关闭体育视图处理线程失败", error);
    }
  };

  /**
   * @description 打开体育视图处理worker
   */
  const openSportViewProcessWorker = () => {
    // console.log("触发了几次开启线程的操作");
    try {
      // 开启列表events线程
      workerManage.startWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
      // 开启侧边栏events线程
      workerManage.startWorker(workerManage.WorkerMap.sidebarWorker.workerName);
    } catch (error) {
      // console.error("开启体育视图处理线程失败", error);
    }
  };

  return {
    sportType,
    tabActive,
    handleSportEventsPush,
    openSportPush,
    handleSportPush,
    sendWorkerCommand,
    openAttentionSSE,
  };
}