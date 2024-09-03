// import wTooltip from './wTooltip/wTooltip.vue'
import { defineAsyncComponent } from "vue";

const wTooltip = defineAsyncComponent(() => import("/@/layout/components/headerMenuNav/components/wTooltip/wTooltip.vue"));
export { wTooltip };
