import { VirtualScrollVirtualList } from "/@/components/virtualScrollVirtualList/index";
import { defineAsyncComponent } from "vue";
const RollingCard = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/iceHockey/components/rollingCard/rollingCard.vue"));
const ChampionshipCard = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/iceHockey/components/championshipCard/championshipCard.vue"));
const SelectCard = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/iceHockey/components/selectCard/selectCard.vue"));
export { RollingCard, ChampionshipCard, SelectCard, VirtualScrollVirtualList };
