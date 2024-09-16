import { VirtualScrollVirtualList } from "/@/components/virtualScrollVirtualList/index";
import { defineAsyncComponent } from "vue";
const RollingCard = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/tennis/components/rollingCard/rollingCard.vue"));
const ChampionshipCard = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/tennis/components/championshipCard/championshipCard.vue"));
const SelectCard = defineAsyncComponent(() => import("/@/views/sports/components/selectCard/selectCard.vue"));
export { RollingCard, ChampionshipCard, SelectCard, VirtualScrollVirtualList };
