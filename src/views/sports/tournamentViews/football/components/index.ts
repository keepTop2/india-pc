import { defineAsyncComponent } from "vue";
import { VirtualScrollVirtualList } from "/@/components/virtualScrollVirtualList/index";
const FootballCard = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/football/components/footballCard/footballCard.vue"));
const SelectCard = defineAsyncComponent(() => import("/@/views/sports/components/selectCard/selectCard.vue"));
export { FootballCard, SelectCard, VirtualScrollVirtualList };
