<template>
  <div class="card">
    <div class="common bg" v-for="(item, i) in props.data" :key="i">
      <div class="title">
        {{ item.title }}
        <div class="right">
          <span class="viewDetail" v-if="item.hasViewDetail" @click="viewDetail(item)">
            {{ $t(`bonus['查看详情']`) }}<el-icon>
              <ArrowRightBold/>
            </el-icon>
          </span>
          <Popover :text-content="item.tip"></Popover>
        </div>
      </div>
      <div class="remark" v-if="item.remark">{{ item.remark }}</div>
      <div class="list">
        <div class="item" v-for="(d, i) in item.data" :key="i">
          <span>{{ d[0] }}</span>
          <span>{{ d[1] }}</span>
        </div>
      </div>
      <div class="btn">
        <el-button size="large" :disabled="item.isDisabled" :class="item.isDisabled && 'disabled'"
                   @click="submitBtn(item)">
          {{ item.btn }}
        </el-button>
      </div>
    </div>
  </div>

  <Dialog v-model="detailVisible2" :title="$t(`bonus['奖金详情']`)" width="580" top="5%">
    <div class="detail2">
      <p>
        不容错过的四重存款奖励！[平台名称]独特的奖金系统将您的存款转化为丰厚的奖励。无论您存入多少，都将得到超乎想象的回报。立即行动
        , 快速增加您的加密货币持有量，赢取巨额奖金！
      </p>
      <div class="list">
        <div class="item" v-for="item in list" :style="{ backgroundImage: `url(${item.bg})` }">
          <p class="title">{{ item.name }}</p>
          <span class="icon">+</span>
          <p class="bonus">{{ item.bonus }}</p>
          <p class="text">{{ $t(`bonus['奖金']`) }}</p>
          <div class="balance">
            <div>
              <span>{{ $t(`bonus['最低存款额']`) }}</span>
              <span>$ {{ item.floor }}</span>
            </div>
            <div>
              <span>{{ $t(`bonus['最高奖金']`) }}</span>
              <span>$ {{ item.ceil }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
  <Dialog v-model="firstDepositVisible" :title="$t(`bonus['首存奖金']`)" width="480">
    <div class="first-deposit">
      <div class="item">
        <span>第一次存款</span>
        <span>180.00$</span>
      </div>
      <div class="item">
        <span>第二次存款</span>
        <span>240%</span>
      </div>
      <div class="item">
        <span>第三次存款</span>
        <span>240%</span>
      </div>
      <div class="item">
        <span>第四次存款</span>
        <span>240%</span>
      </div>
      <div class="btn">
        <el-button size="large">二次存款</el-button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
// 枚举数组
import Dialog from '/@/components/Dialog/Dialog.vue';
import {ref, reactive} from 'vue';
import {Popover} from "/@/components/gameCard/commoments/popover/index";
import bg1 from "/@/assets/zh/default/bonus/bg1.png"
import bg2 from "/@/assets/zh/default/bonus/bg2.png"
import bg3 from "/@/assets/zh/default/bonus/bg3.png"
import bg4 from "/@/assets/zh/default/bonus/bg4.png"

interface Item {
  title: string;
  remark?: string;
  tip?: string;
  data: [string, string][];
  btn: string;
  isDisabled?: boolean;
  hasViewDetail?: boolean;
}

interface Props {
  data: Item[];
}

const props = defineProps<Props>();
const getImg = (url: string) => {
  return new URL(url, import.meta.url).href;
};

//奖金详情弹框
const detailVisible2 = ref(false);
const list = reactive([
  {name: '第一次存款', bonus: '180%', floor: '548', ceil: '20.000', bg: bg1},
  {name: '第二次存款', bonus: '240%', floor: '548', ceil: '20.000', bg: bg2},
  {name: '第三次存款', bonus: '300%', floor: '548', ceil: '20.000', bg: bg3},
  {name: '第四次存款', bonus: '360%', floor: '548', ceil: '20.000', bg: bg4},
]);
const viewDetail = (item: Item) => {
  //查看详情
  if (item.title === '存款奖金') {
    detailVisible2.value = true;
  }
};

// 首存奖金弹框
const firstDepositVisible = ref(false);
const submitBtn = (item: Item) => {
  if (item.btn === '首次存款') {
    firstDepositVisible.value = true;
  }
};
</script>

<style scoped lang="scss">
.card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  .bg {
    border-radius: 5px;
    padding: 2px;

    @include themeify {
      background: themed('Bg2');
    }
  }

  .title {
    @include themeify {
      color: themed('Text_s');
    }

    padding: 10px 10px 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .right {
      display: flex;
      gap: 5px;

      & > * {
        flex-shrink: 0;
      }

      .viewDetail {
        display: flex;
        align-items: center;
        gap: 3px;
        cursor: pointer;

        @include themeify {
          color: themed('Theme');
        }
      }

      .tip {
        cursor: pointer;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        text-align: center;
        line-height: 22px;
        font-weight: 700;
        font-size: 18px;

        @include themeify {
          background: themed('icon');
          color: themed('Bg2');
        }
      }
    }
  }

  .common {
    display: grid;

    .remark {
      padding-left: 10px;
      font-size: 14px;

      @include themeify {
        color: themed('Text2');
      }
    }

    .list {
      margin-top: 10px;

      .item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        font-size: 12px;
        transition: 0.2s;

        @include themeify {
          color: themed('Text1');
        }

        &:hover {
          border-radius: 5px;

          @include themeify {
            background: themed('Bg3');
          }
        }
      }
    }

    .btn {
      padding: 10px;
      align-self: end;

      button {
        border: none;
        width: 100%;

        @include themeify {
          background-color: themed('Bg3');
          color: themed('Theme');
        }
      }

      .disabled {
        @include themeify {
          color: themed('Text2');
        }
      }
    }
  }
}

.tip-con {
  max-width: 370px;

  & > p:last-child {
    @include themeify {
      color: themed('Text1');
    }
  }
}

.detail2 {
  padding: 0 50px 50px 50px;

  & > p {
    @include themeify {
      color: themed('Text1');
    }
  }

  .list {
    display: grid;
    grid-template-columns: repeat(2, auto);
    justify-content: center;
    column-gap: 30px;
    row-gap: 20px;
    margin-top: 20px;

    .item {
      position: relative;
      width: 222px;
      height: 246px;
      border-radius: 20px;
      overflow: hidden;
      background-size: 100% 100%;
      text-align: center;

      .title {
        font-size: 16px;
        margin: 20px 0 10px 0;
        font-weight: 600;

        @include themeify {
          color: themed('Bg1');
        }
      }

      .icon {
        width: 18px;
        height: 18px;
        background: #767676;
        font-weight: 700;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px auto;
        padding: 0 2px 3px 2px;
        font-size: 22px;

        @include themeify {
          color: themed('Text_a');
        }
      }

      .bonus {
        font-size: 28px;
        font-weight: 700;
        color: black;
        margin: 10px 0;
      }

      .text {
        color: black;
        font-size: 16px;
        font-weight: 700;
      }

      .balance {
        //align-self: end;
        margin-top: 40px;

        & > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          margin: 5px 0;

          span {
            font-size: 12px;
            font-weight: 700;

            @include themeify {
              color: themed('Bg1');
            }
          }
        }
      }
    }
  }
}

.first-deposit {
  padding: 0 20px 20px;

  .active {

    //background: #2d3c2a;
    @include themeify {
      color: themed('Text_a');
    }
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 10px;
    border-radius: 5px;
    margin: 8px 0;
    transition: 0.2s;

    @include themeify {
      background: themed('Bg3');
      color: themed('Text_s');
    }

    &:hover {
      @include themeify {
        color: themed('Text_a');
        background: themed('Theme');
      }
    }
  }

  .btn {
    margin: 150px 0 50px 0;
    display: flex;
    justify-content: center;

    button {
      border: none;
      width: 220px;

      @include themeify {
        background: themed('Theme');
        color: themed('Text_a');
      }
    }
  }
}
</style>
