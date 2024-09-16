// import MarketCard from "./components/marketCard/marketCard.vue"; //卡片详细
// import MarketColumn from "./components/marketColumn/marketColumn.vue"; //卡片详细
import { defineAsyncComponent } from "vue";
const MarketCard  = defineAsyncComponent(()=>import("./components/marketCard/marketCard.vue"));
const MarketColumn  = defineAsyncComponent(()=>import("./components/marketColumn/marketColumn.vue"));
export { MarketCard, MarketColumn };
