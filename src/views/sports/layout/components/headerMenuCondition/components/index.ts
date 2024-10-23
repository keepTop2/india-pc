import { defineAsyncComponent } from "vue";

const wButton = defineAsyncComponent(() => import("/@/views/sports/layout/components/headerMenuCondition/components/wButton/wButton.vue"));
const wSwitch = defineAsyncComponent(() => import("/@/views/sports/layout/components/headerMenuCondition/components/wSwitch/wSwitch.vue"));
export { wButton, wSwitch };
