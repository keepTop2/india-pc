// import MarketCard from "./marketCard/marketCard.vue"; //卡片详细
// import MarketColumn from "./marketColumn/marketColumn.vue"; //卡片详细
// import HeaderDetail from "./headerDetail/headerDetail.vue"; // 头部数据
import { defineAsyncComponent } from "vue";

const MarketCard = defineAsyncComponent(() => import("/@/views/baseball/detail/components/marketCard/marketCard.vue"));
const MarketColumn = defineAsyncComponent(() => import("/@/views/baseball/detail/components/marketColumn/marketColumn.vue"));
const HeaderDetail = defineAsyncComponent(() => import("/@/views/baseball/detail/components/headerDetail/headerDetail.vue"));
export { MarketCard, HeaderDetail, MarketColumn };
