import { defineAsyncComponent } from "vue";
// import VirtualScrollVirtualList from "./virtualScrollVirtualList.vue";

const VirtualScrollVirtualList = defineAsyncComponent(() => import("/@/components/virtualScrollVirtualList/virtualScrollVirtualList.vue"));

export { VirtualScrollVirtualList };
