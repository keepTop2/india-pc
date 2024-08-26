/*
 * @Author: WangMingxin
 * @Description: 菜单管理；
 */
import { defineStore } from 'pinia';


interface LayoutConfig {
  /** 右侧内容区域是否最大屏幕*/
  bigScreen: boolean,
}
export const useLayoutStore = defineStore('Layout', {
  state: (): LayoutConfig => {
    return {
      bigScreen: false,
    };
  },
  getters: {
    /**
     * @description: 右侧内容区域是否最大屏幕
     * @return {*}
     */
    getBigScreen(): boolean {
      return this.bigScreen;
    },
  },
  actions: {
    /**
     * @description: 右侧内容区域是否最大屏幕
     * @return {*}
     */
    setBigScreen(data?: boolean) {
      this.bigScreen = data || false;
    },
  },

  persist: {
  },
});
