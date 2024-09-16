import { defineAsyncComponent } from "vue";

const TeamInfoCard = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/football/components/footballCard/components/teamInfoCard/teamInfoCard.vue"));
const MarketCard = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/football/components/footballCard/components/marketCard/marketCard.vue"));
const EventItem = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/football/components/footballCard/components/eventItem/eventItem.vue"));
const MarketColumn = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/football/components/footballCard/components/marketColumn/marketColumn.vue"));

export { MarketCard, TeamInfoCard, EventItem, MarketColumn };
