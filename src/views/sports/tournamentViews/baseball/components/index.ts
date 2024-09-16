import { VirtualScrollVirtualList } from "/@/components/virtualScrollVirtualList/index";
import { defineAsyncComponent } from "vue";

const RollingCard = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/baseball/components/rollingCard/rollingCard.vue"));
const SelectCard = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/baseball/components/selectCard/selectCard.vue"));

export { RollingCard, SelectCard, VirtualScrollVirtualList };
