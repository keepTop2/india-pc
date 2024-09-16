// import TeamInfoCard from "./components/teamInfoCard/teamInfoCard.vue";
// import MarketCard from "./components/marketCard/marketCard.vue";
// import EventItem from "./components/eventItem/eventItem.vue";
// import MarketColumn from "./components/marketColumn/marketColumn.vue";
import { defineAsyncComponent } from "vue";

const TeamInfoCard = defineAsyncComponent(()=>import("./components/teamInfoCard/teamInfoCard.vue"));
const MarketCard = defineAsyncComponent(()=>import("./components/marketCard/marketCard.vue"));
const EventItem = defineAsyncComponent(()=>import("./components/eventItem/eventItem.vue"));
const MarketColumn = defineAsyncComponent(()=>import("./components/marketColumn/marketColumn.vue"));
export { MarketCard, TeamInfoCard, EventItem, MarketColumn };
