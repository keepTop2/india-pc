// import MarketCard from "./components/marketCard/marketCard.vue"; //卡片详细
// import MarketColumn from "./components/marketColumn/marketColumn.vue"; //卡片详细
// import Detail from "/@/views/competitionDetails/components/detail.vue"; // 头部数据
import { defineAsyncComponent } from "vue";
const MarketCard = defineAsyncComponent(() => import("/@/views/competitionDetails/components/marketCard/marketCard.vue"));
const MarketColumn = defineAsyncComponent(() => import("/@/views/competitionDetails/components/marketColumn/marketColumn.vue"));
const Detail = defineAsyncComponent(() => import("/@/views/competitionDetails/components/detail.vue"));
export { MarketCard, Detail, MarketColumn };
