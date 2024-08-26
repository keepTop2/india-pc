<template>
  <div class="hot-container">
    <div class="title">热门推荐</div>
    <div class="content">
      <div class="country-pk">
        <div class="country">
          <div class="badge">
            <img :src="country" alt="">
          </div>
          <div class="name">圣埃蒂安</div>
        </div>

        <div class="info">
          <div>韩国K甲组联赛</div>
          <div>05月15日 02:30</div>
        </div>

        <div class="country">
          <div class="badge">
            <img :src="country" alt="">
          </div>
          <div class="name">圣埃蒂安</div>
        </div>
      </div>
      <div class="base part1">
        <div v-for="item in 2" class="item">
          <span>-0/0.5</span>
          <span>2.06</span>
        </div>
      </div>
      <div class="base part2">
        <div @click="active=!active">
          <img :src="active?startActive:start" alt="">
        </div>
        <div>
          <span>+124</span>
          <img :src="arrow_right" alt="">
        </div>
      </div>
      <div class="base part3">
        <img :src="ty_btn_rm_jt_xt" alt="" class="left">
        <img :src="ty_btn_rm_jt_xt" alt="">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import country from "/@/assets/zh/default/components/country.png"
import startActive from "/@/assets/zh/default/components/start_active.png"
import start from "/@/assets/zh/default/components/start.png"
import arrow_right from "/@/assets/zh/default/components/arrow_right.png"
import ty_btn_rm_jt_xt from "/@/assets/zh/default/components/ty_btn_rm_jt_xt.png"

const active = ref(false)
const getImg = (url: string) => {
  return new URL(url, import.meta.url).href
}
</script>

<style scoped lang="scss">
.hot-container {
  width: 366px;
  height: 333px;
  border-radius: 4px;
  @include themeify {
    background: themed('Bg4');
  }

  & > .title {
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;

    @include themeify {
      color: themed('Text_s');
    }

    &::before {
      content: '';
      display: inline-block;
      border-radius: 0px 4px 4px 0px;
      width: 4px;
      height: 22px;

      @include themeify {
        background-color: themed('Theme');
      }
    }
  }

  .country-pk {
    display: flex;
    justify-content: space-around;
    //align-items: center;
    margin: 22px 0;

    .country {
      @include themeify {
        color: themed('Text_s');
      }

      .badge {
        padding: 12px;
        border-radius: 50%;
        margin-bottom: 8px;
        @include themeify {
          background: themed('Bg1');
        }
      }
    }

    .info {
      transform: translateY(12px);

      & > div:first-child {
        @include themeify {
          color: themed('Text_s');
        }
      }

      & > div:last-child {
        @include themeify {
          color: themed('Text1');
        }
      }
    }
  }

  .base {
    padding: 0 18px;
    margin-bottom: 10px;

    & > div {
      border-radius: 4px;
      @include themeify {
        background: themed('Bg3');
      }
    }
  }

  .part1 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;

    .item {
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;

      span {
        font-size: 12px;
      }

      & > span:first-child {
        @include themeify {
          color: themed('Text1');
        }
      }

      & > span:last-child {
        @include themeify {
          color: themed('Text_s');
        }
      }
    }
  }

  .part2 {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 10px;
    height: 44px;

    & > div:first-child {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    & > div:last-child {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      @include themeify {
        color: themed('Text1');
      }
    }
  }

  .part3 {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      transform: rotate(180deg);
    }
  }
}
</style>