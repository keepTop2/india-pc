// import SieveOfCases from "./components/sieveOfCases.vue";
import { defineAsyncComponent } from "vue";
const SieveOfCases = defineAsyncComponent(() => import("./components/sieveOfCases.vue"));
export { SieveOfCases };
