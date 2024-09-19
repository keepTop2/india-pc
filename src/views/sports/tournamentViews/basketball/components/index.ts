import { VirtualScrollVirtualList } from "/@/components/virtualScrollVirtualList/index";
import { defineAsyncComponent } from "vue";
const RollingCard = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/basketball/components/rollingCard/rollingCard.vue"));
const SelectCard = defineAsyncComponent(() => import("/@/views/sports/components/selectCard/selectCard.vue"));
export { RollingCard, SelectCard, VirtualScrollVirtualList };
