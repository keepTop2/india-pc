<template>
  <div class="container">
    <div class="head">
      <p>{{ $t(`bonus['奖金']`) }}</p>
      <div class="handle">
        <el-input v-model="code" size="large" :placeholder="$t(`bonus['请输入奖金兑换码']`)"></el-input>
        <el-button size="large" @click="conversion">{{ $t(`bonus['兑换']`) }}</el-button>
      </div>
    </div>
    <div class="balance-info bg">
      <div class="balance">
        <img :src="balance1" alt="">
        <div>
          <p>{{ $t(`bonus['余额']`) }}</p>
          <span>$ {{ balanceInfo.balance }}</span>
        </div>
      </div>
      <div>
        <p>{{ $t(`bonus['一般奖金']`) }}</p>
        <span>$ {{ balanceInfo.general }}</span>
      </div>
      <div>
        <p>{{ $t(`bonus['VIP奖金']`) }}</p>
        <span>$ {{ balanceInfo.VIP }}</span>
      </div>
      <el-button size="large" @click="detailVisible = true">{{ $t(`bonus['详情']`) }}</el-button>
    </div>
    <!--一般奖金-->
    <div class="general bg">
      <div class="card-title">{{ $t(`bonus['一般奖金']`) }}</div>
      <div class="card-list">
        <card-general :data="generalInfo"/>
      </div>
    </div>

    <div class="general bg">
      <div class="card-title">{{ $t(`bonus['VIP奖金']`) }}</div>
      <div class="card-list">
        <card-general :data="VIPInfo"/>
      </div>
    </div>

  </div>

  <Dialog v-model="detailVisible" :title="$t(`bonus['奖金详情']`)" width="800" top="2%" :showFooter="false">
    <div class="detail">
      <div class="type">
        <p class="sub-title">{{ $t(`bonus['奖金类别']`) }}</p>
        <div class="list">
          <div class="item" v-for="item in typeList">
            <div>
              <img :src="item.icon" alt="">
              <span>{{ item.name }}</span>
            </div>
            <p>$ {{ item.num }}</p>
          </div>
        </div>
      </div>
      <div class="record">
        <p class="sub-title">{{ $t(`bonus['奖金记录']`) }}</p>
        <p class="remark">{{ $t(`bonus['注：仅显示最近60天记录']`) }}</p>
        <div class="table-style">
          <el-table :data="recordTableData" border :cell-class-name="'table-cell'"
                    :header-cell-class-name="'table-header-cell'">
            <el-table-column :label="$t(`bonus['类型']`)" align="center">
              <template #default="{ row }">
                <div style="display: flex;align-items: center;gap: 5px;margin-left: 30px;">
                  <img :src="row.icon" alt="" style="width: 22px;">
                  <span>{{ row.type }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="total" :label="$t(`bonus['总量']`)" align="center">
              <template #default="{ row }">
                <span>$ {{ row.total }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="time" :label="$t(`bonus['奖金发放时间']`)" align="center"></el-table-column>
          </el-table>
        </div>
        <pagination :total="total"/>
      </div>
    </div>
  </Dialog>

</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import CardGeneral from "/@/views/frontPage/bonus/components/CardGeneral.vue";
import {ElMessage} from "element-plus";
import Dialog from "/@/components/Dialog/Dialog.vue";
import Pagination from "/@/views/wallet/views/transaction/components/pagination/pagination.vue";
import icon1 from "/@/assets/zh/default/bonus/icon1.png"
import icon2 from "/@/assets/zh/default/bonus/icon2.png"
import icon3 from "/@/assets/zh/default/bonus/icon3.png"
import icon4 from "/@/assets/zh/default/bonus/icon4.png"
import icon5 from "/@/assets/zh/default/bonus/icon5.png"
import icon6 from "/@/assets/zh/default/bonus/icon6.png"
import icon7 from "/@/assets/zh/default/bonus/icon7.png"
import icon8 from "/@/assets/zh/default/bonus/icon8.png"
import balance1 from "/@/assets/zh/default/bonus/balance-1.png"

const code = ref(''); //兑换码
const conversion = () => { //兑奖码兑换回调
  ElMessage.error('兑奖码不存在')
}

const balanceInfo = reactive({ //余额信息
  balance: 0.00, //余额
  general: 0.00, //一般奖金
  VIP: 0.00, //VIP奖金
})

const generalInfo = reactive([
  { //存款奖金
    title: '存款奖金',
    data: [
      ['第一次存款', 180],
      ['第二次存款', 180],
      ['第三次存款', 180],
      ['第四次存款', 180],
    ],
    btn: '首次存款',
    hasViewDetail: true
  },
  { //每周五返还奖金
    title: '每周五返还奖金',
    remark: '注：完成每日任务、每周任务、每月任务',
    data: [
      ['每周五返还', '100%'],
      ['每周五返还', '100%'],
      ['每周五返还', '100%'],
    ],
    btn: '完成任务'
  },
  { //幸运转盘
    title: '幸运转盘',
    tip: '达到特定投注金额后，您每天将获得 1 次免费旋转从注册开始，每次VIP升级您将获得一次免费旋转，并且您可以获得的旋转次数没有限制。',
    data: [
      ['可旋转次数', '0'],
      ['每日旋转', '100'],
      ['每日投注时间', '23:59:59 ~ 24:00:00'],
      ['贵宾旋转', 'VIP升级']
    ],
    btn: '免费旋转'
  }
])

const VIPInfo = reactive([
  { //VIP奖金
    title: '升级奖励',
    remark: '升级可以获得独家奖励',
    data: [
      ['当前VIP级别', 'VIP0'],
      ['当前经验值', '10'],
      ['当前经验值', '10'],
      ['奖励', '0'],
    ],
    btn: 'VIP3解锁',
    isDisabled: true
  },
  { //VIP每周五返还奖金
    title: 'VIP每周五返还奖金',
    remark: '每周五发放',
    tip: '达到特定投注金额后，您每天将获得 1 次免费旋转从注册开始，每次VIP升级您将获得一次免费旋转，并且您可以获得的旋转次数没有限制。',
    data: [
      ['每日任务', '0/5'],
      ['每周任务', '0/3'],
      ['每月任务', '0/1'],
    ],
    btn: 'VIP8解锁',
    isDisabled: true
  },
  { //每周返还奖金
    title: '每月15日发放',
    tip: '达到特定投注金额后，您每天将获得 1 次免费旋转从注册开始，每次VIP升级您将获得一次免费旋转，并且您可以获得的旋转次数没有限制。',
    data: [
      ['需要下注', '$ 100.00'],
      ['奖金', '0'],
      ['上月奖金', '0'],
    ],
    btn: 'VIP2解锁',
    isDisabled: true
  }
])

// 详情弹窗
const detailVisible = ref(false)
const getImg = (url: string) => {
  return new URL(url, import.meta.url).href
}

const typeList = reactive([
  {icon: icon1, name: '存款奖金', num: 0},
  {icon: icon2, name: '幸运转盘', num: 0},
  {icon: icon3, name: '投注比赛', num: 0},
  {icon: icon4, name: '充值', num: 0},
  {icon: icon5, name: '每周奖金', num: 0},
  {icon: icon6, name: '每月奖金', num: 0},
  {icon: icon7, name: '升级奖金', num: 0},
  {icon: icon8, name: '兑换奖金', num: 0},
])
const recordTableData = reactive([
  {type: '任务', icon: icon1, total: 4.00, time: '2021-09-01 12:00:00'},
  {type: '幸运转盘', icon: icon2, total: 4.00, time: '2021-09-01 12:00:00'},
  {type: '投注比赛', icon: icon3, total: 4.00, time: '2021-09-01 12:00:00'},
  {type: '充值', icon: icon4, total: 4.00, time: '2021-09-01 12:00:00'},
  {type: '每周奖金', icon: icon5, total: 4.00, time: '2021-09-01 12:00:00'},
  {type: '每月奖金', icon: icon6, total: 4.00, time: '2021-09-01 12:00:00'},
  {type: '升级奖金', icon: icon7, total: 4.00, time: '2021-09-01 12:00:00'},
])
const total = ref(0)


</script>

<style lang="scss" scoped>
.container {
  width: 1200px;

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;

    p {
      @include themeify {
        color: themed('Text_a');
      }
    }

    .handle {
      display: flex;
      align-items: center;
      gap: 10px;

      :deep() {
        .el-input__wrapper {
          box-shadow: none;

          @include themeify {
            background-color: themed('Bg1');
          }

          input {
            @include themeify {
              color: themed('Text2_1');
            }

            &::placeholder {
              @include themeify {
                color: themed('Text2_1');
              }
            }
          }
        }
      }

      button {
        border: none;
        width: 160px;

        @include themeify {
          background-color: themed('Theme');
          color: themed('Text_a');
        }
      }
    }
  }

  .bg {
    @include themeify {
      background-color: themed('Bg1');
    }

    border-radius: 5px;
    margin: 10px 0;
  }

  .card-title {
    padding: 15px 20px;
    font-size: 18px;
    box-shadow: 0px 1px 0px 0px #1A1C20;

    @include themeify {
      color: themed('Text_a');
    }
  }

  .card-list {
    padding: 20px;
  }

  .balance-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;

    .balance {
      display: flex;
      align-items: center;

      img {
        width: 62px;
      }

      & > div {
        display: grid;
        gap: 3px;


        span {
          @include themeify {
            color: themed('f1');
          }
        }
      }
    }

    & > div {
      p {
        font-size: 14px;

        @include themeify {
          color: themed('Text1');
        }
      }

      span {
        font-weight: 700;
        font-size: 18px;

        @include themeify {
          color: themed('Text_s');
        }
      }
    }

    & > div:not(.balance) {
      display: grid;
      gap: 3px;
    }

    button {
      border: none;
      width: 120px;

      @include themeify {
        background-color: themed('Bg3');
        color: themed('Theme');
      }
    }
  }

  .general {
  }
}

.detail {
  padding: 0 20px;

  & > * {
    margin: 20px 0;
  }

  .sub-title {
    @include themeify {
      color: themed('Text_s');
    }

    margin-bottom: 10px;
  }

  .type {
    .list {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      padding: 20px;
      border-radius: 5px;

      @include themeify {
        background: themed('Bg2');
      }

      .item {
        & > div {
          display: flex;
          align-items: center;
          gap: 3px;

          @include themeify {
            color: themed('Text1');
          }

          img {
            width: 22px;
          }
        }

        p {
          font-size: 18px;

          @include themeify {
            color: themed('Text_s');
          }
        }
      }
    }
  }

  .record {
    .sub-title {
      margin-bottom: 5px;
    }

    .remark {
      margin-bottom: 10px;

      @include themeify {
        color: themed('Text2_1');
      }
    }
  }
}

.table-style {
  :deep(.el-table) {
    border-radius: 4px 4px 0px 0px;
    background-color: transparent;

    .table-header-cell {
      height: 44px;
      min-height: 44px;

      @include themeify {
        border-right-color: themed('Bg4');
        border-bottom-color: themed('Bg3');
        color: themed('Text1');
      }

      font-family: 'PingFang SC';
      font-size: 14px;
      font-weight: 400;
    }

    .table-cell {
      height: 44px;
      min-height: 44px;

      @include themeify {
        border-color: themed('Bg3');
        color: themed('Text1');
      }

      font-family: 'PingFang SC';
      font-size: 14px;
      font-weight: 400;
    }

    th.el-table__cell {
      @include themeify {
        background-color: themed('Bg3');
      }
    }

    tr {
      background-color: transparent;
    }

    .el-table__row:hover {
      .el-table__cell {
        background-color: transparent;
      }
    }

    .el-table__inner-wrapper::after,
    .el-table__inner-wrapper::before,
    .el-table__border-left-patch {
      @include themeify {
        background-color: themed('Bg3');
      }
    }
  }

  :deep(.el-table--border::after),
  :deep(.el-table--border::before) {
    @include themeify {
      background-color: themed('Bg3');
    }
  }
}
</style>
