// import ChampionshipCard from "./championshipCard/championshipCard.vue"; //冠军卡片
// import RollingCard from "./footballCard/footballCard.vue"; //足球卡片
// import SelectCard from "./selectCard/selectCard.vue"; //足球卡片筛选
import { VirtualScrollVirtualList } from "/@/components/virtualScrollVirtualList/index";
import { defineAsyncComponent } from "vue";

const RollingCard = defineAsyncComponent(() => import("/@/views/sports/views/iceHockey/components/rollingCard/rollingCard.vue"));
const ChampionshipCard = defineAsyncComponent(() => import("/@/views/sports/views/iceHockey/components/championshipCard/championshipCard.vue"));
const SelectCard = defineAsyncComponent(() => import("/@/views/sports/views/iceHockey/components/selectCard/selectCard.vue"));

export { RollingCard, ChampionshipCard, SelectCard, VirtualScrollVirtualList };
