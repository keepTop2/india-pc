<template>
  <div class="container">
    <div class="title">{{ $t(`userDropDown['设置']`) }}</div>
    <div class="drop">
      <div class="drop-left">
        <div :class="`menu ${menu.name === route.name ? 'ac-color' : 'bg-color'}`" v-for="(menu, index) in dropMenuList"
             :key="index" @click="switchDrop(menu.name, index)">
          {{ menu.label }}
        </div>
      </div>
      <router-view/>
    </div>
  </div>
</template>
<script setup lang="ts">
import router from '/@/router';
import {useRoute} from "vue-router"
import {ref} from 'vue';

const route = useRoute()
const dropMenuList = [
  {
    label: '账户信息',
    name: 'accountInfo',
  },
  {
    label: '全局设置',
    name: 'globalConfig',
  },
];
const switchDrop = (name: string, index: number) => {
  router.replace({name});
};
</script>
<style scoped lang="scss">
@import 'index';

.container {
  box-sizing: border-box;
  width: 1200px;
  margin-top: 20px;

  .title {
    //color: white;
    font-size: 20px;
    width: 40px;

    @include themeify {
      color: themed('Text_a');
    }
  }

  .drop {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 20px;
    margin-top: 20px;

    .drop-left {
      width: 200px;
      height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      border-radius: $radius;
      //background: $bg-color;
      padding: 8px 0 8px 0;

      @include themeify {
        background: themed('Bg1');
      }

      .menu {
        width: 90%;
        display: flex;
        justify-content: center;
        height: 40px;
        line-height: 40px;
        color: white;
        font-size: 16px;
        border-radius: $radius;
        cursor: pointer;
      }
    }
  }
}
</style>
