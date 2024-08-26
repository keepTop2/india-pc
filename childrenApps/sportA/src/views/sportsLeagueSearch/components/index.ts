// import MarketCard from './marketCard.vue'
// import SearchInput from "./searchInput.vue";
import { defineAsyncComponent } from "vue";

const MarketCard = defineAsyncComponent(() => import("/@/views/sportsLeagueSearch/components/marketCard.vue"));
const SearchInput = defineAsyncComponent(() => import("/@/views/sportsLeagueSearch/components/searchInput.vue"));

export { MarketCard, SearchInput };
