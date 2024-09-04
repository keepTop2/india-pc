// import TeamInfoCard from "./components/teamInfoCard/teamInfoCard.vue";
// import MarketCard from "./components/marketCard/marketCard.vue";
// import EventItem from "./components/eventItem/eventItem.vue";
// import MarketColumn from "./components/marketColumn/marketColumn.vue";
import { defineAsyncComponent } from "vue";

const TeamInfoCard = defineAsyncComponent(() => import("/@/views/sports/views/football/components/footballCard/components/teamInfoCard/teamInfoCard.vue"));
const MarketCard = defineAsyncComponent(() => import("/@/views/sports/views/football/components/footballCard/components/marketCard/marketCard.vue"));
const EventItem = defineAsyncComponent(() => import("/@/views/sports/views/football/components/footballCard/components/eventItem/eventItem.vue"));
const MarketColumn = defineAsyncComponent(() => import("/@/views/sports/views/football/components/footballCard/components/marketColumn/marketColumn.vue"));

export { MarketCard, TeamInfoCard, EventItem, MarketColumn };
