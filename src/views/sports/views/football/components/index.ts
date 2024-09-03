// import ChampionshipCard from "./championshipCard/championshipCard.vue"; //冠军卡片
// import FootballCard from "./footballCard/footballCard.vue"; //足球卡片
// import SelectCard from "./selectCard/selectCard.vue"; //足球卡片筛选
import { VirtualScrollVirtualList } from "/@/components/virtualScrollVirtualList/index";
// import DateSelector from "./dateSelector/dateSelector.vue";
import { defineAsyncComponent } from "vue";

const FootballCard = defineAsyncComponent(() => import("/@/views/football/components/footballCard/footballCard.vue"));
const ChampionshipCard = defineAsyncComponent(() => import("/@/views/football/components/championshipCard/championshipCard.vue"));
const SelectCard = defineAsyncComponent(() => import("/@/views/football/components/selectCard/selectCard.vue"));
const DateSelector = defineAsyncComponent(() => import("/@/views/football/components/dateSelector/dateSelector.vue"));

export { FootballCard, ChampionshipCard, SelectCard, VirtualScrollVirtualList, DateSelector };
