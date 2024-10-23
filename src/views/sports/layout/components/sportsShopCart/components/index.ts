import { defineAsyncComponent } from "vue";
const ShopCart = defineAsyncComponent(() => import("/@/views/sports/layout/components/sportsShopCart/components/shopCart/shopCart.vue"));
const ChampionCart = defineAsyncComponent(() => import("/@/views/sports/layout/components/sportsShopCart/components/championCart/championCart.vue"));
export { ShopCart, ChampionCart };
