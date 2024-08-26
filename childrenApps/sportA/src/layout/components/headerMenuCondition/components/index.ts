// import wButton from './wButton/wButton.vue'
// import wSwitch from './wSwitch/wSwitch.vue'
import { defineAsyncComponent } from "vue";

const wButton = defineAsyncComponent(() => import("/@/layout/components/headerMenuCondition/components/wButton/wButton.vue"));
const wSwitch = defineAsyncComponent(() => import("/@/layout/components/headerMenuCondition/components/wSwitch/wSwitch.vue"));
export { wButton, wSwitch };
