import ShopCart from "./shopCart/shopCart.vue";
// import ChampionCart from "./championCart/championCart.vue";
import { defineAsyncComponent } from "vue";
// const ShopCart = defineAsyncComponent(() => import("/@/layout/components/sportsShopCart/components/shopCart/shopCart.vue"));
const ChampionCart = defineAsyncComponent(() => import("/@/layout/components/sportsShopCart/components/championCart/championCart.vue"));
export { ShopCart, ChampionCart };
