<template>
  <div class="container">
    <div class="box" v-if="UserStore.token">
      <div class="left">

        <div class="col1">
          <img :src="topImg1" alt="">
          <div>
            <p>{{ $t(`allianceMenu['获得总金额']`) }}</p>
            <p>$4.99</p>
          </div>
        </div>

        <div class="col2">
          <img :src="topImg2" alt="">
          <div>
            <p>{{ $t(`allianceMenu['推荐好友总数']`) }}</p>
            <p>0</p>
          </div>
        </div>

        <div class="col3">
          <div>
            <div><img :src="tjjl_icon" alt=""> {{ $t(`allianceMenu['推荐奖励']`) }}</div>
            <div @click="referralRewardVisible = true">{{ $t(`allianceMenu['详情']`) }}
              <el-icon>
                <ArrowRight/>
              </el-icon>
            </div>
          </div>
          <p>$0.00</p>
        </div>

        <div class="col4">
          <div>
            <div><img :src="tjjl_icon" alt=""> {{ $t(`allianceMenu['佣金奖励']`) }}</div>
            <div @click="commissionRewardVisible = true">{{ $t(`allianceMenu['详情']`) }}
              <el-icon>
                <ArrowRight/>
              </el-icon>
            </div>
          </div>
          <p>$0.00</p>
        </div>

        <div class="col5">
          <p class="title">奖励列表</p>
          <div class="darkly-table" v-if="awardList.length">
            <el-table :data="awardList" border>
              <el-table-column prop="username" label="用户名" align="center"></el-table-column>
              <el-table-column prop="deposit" label="总存款(过去7天)" align="center"></el-table-column>
              <el-table-column prop="bet" label="总投注(过去7天)" align="center"></el-table-column>
              <el-table-column prop="lv" label="VIP等级" align="center"></el-table-column>
              <el-table-column prop="registerTime" label="注册日期" align="center"></el-table-column>
              <el-table-column prop="amountOfBonus" label="奖励金额" align="center"></el-table-column>
            </el-table>
            <el-button size="large" @click="awardVisible = true">{{ $t(`allianceMenu['查看全部']`) }}</el-button>
          </div>
          <div v-else class="empty">
            <img :src="kzt_img" alt="">
            <span>{{ $t(`allianceMenu['暂无信息']`) }}</span>
            <span>{{ $t(`allianceMenu['立即邀请好友加入']`) }}</span>
          </div>
        </div>

      </div>

      <div class="right">
        <div class="top">
          <div>
            <p class="title">{{ $t(`allianceMenu['邀请好友,您将获得丰富的奖励']`) }}</p>
            <p class="tj"><span>$1000.00</span>{{ $t(`allianceMenu['推荐奖励']`) }}</p>
            <p class="yj"><span>25%</span>{{ $t(`allianceMenu['佣金奖励']`) }}</p>
          </div>
          <img :src="topImg3" alt="">
        </div>
        <div class="bottom">
          <div class="item">
            <p class="title">{{ $t(`allianceMenu['推荐码']`) }}</p>
            <el-input v-model="referralCode" readonly size="large">
              <template #suffix>
                <div class="copy" @click="copy(referralCode)">{{ $t(`allianceMenu['复制']`) }}</div>
              </template>
            </el-input>
          </div>

          <div class="item">
            <p class="title">{{ $t(`allianceMenu['推荐链接']`) }}</p>
            <el-input v-model="referralLink" readonly size="large">
              <template #suffix>
                <div class="copy" @click="copy(referralLink)">{{ $t(`allianceMenu['复制']`) }}</div>
              </template>
            </el-input>
          </div>

          <div class="btn-group">
            <el-button size="large" @click="createCodeVisible = true">{{
                $t(`allianceMenu['创建新的推荐码']`)
              }}
            </el-button>
            <el-button size="large" @click="shareVisible = true">{{ $t(`allianceMenu['通过社交体分享']`) }}</el-button>
          </div>
        </div>
      </div>
    </div>

    <template v-else>

      <div class="not-auth-box">
        <div class="left">
          <p class="p1">{{ $t(`allianceMenu['邀请好友即可赚取']`) }}</p>
          <p class="p2">
            <span class="s1">$1000.00</span>+<span class="s2">25%</span>的佣金
          </p>
          <el-button type="primary">{{ $t(`allianceMenu['注册并赚取']`) }}</el-button>
          <p class="p3">{{ $t(`allianceMenu['推荐条款和条件']`) }}</p>
        </div>
        <div class="right">
          <img :src="hand" alt="">
        </div>
      </div>

      <div class="part">
        <div class="left">
          <div class="con">
            <div>
              <p>获得<span>$1000.00</span>{{ $t(`allianceMenu['推荐奖励']`) }}</p>
              <p>{{ $t(`allianceMenu['邀请一个好友即可获得，邀请越多获得越多']`) }}</p>
            </div>
            <el-button>查看详情</el-button>
          </div>
          <img :src="img_1000" alt="">
        </div>

        <div class="right">
          <div class="con">
            <div>
              <p>获得<span>25%</span>{{ $t(`allianceMenu['佣金奖励']`) }}</p>
              <p>{{ $t(`allianceMenu['您的好友每次下注，都会获得佣金奖励']`) }}</p>
            </div>
            <el-button>{{ $t(`allianceMenu['查看详情']`) }}</el-button>
          </div>
          <img :src="img2_1000" alt="">
        </div>
      </div>

    </template>


    <div class="details">
      <img :src="detail" alt="">
      <div class="content">
        <div>
          <p class="type">{{ $t(`allianceMenu['详细了解我们']`) }}</p>
          <div class="item">
            <p class="title">{{ $t(`allianceMenu['如果您有大量的观众和推广渠道，我们会为您定制适合您的推荐方案']`) }}</p>
            <p class="desc">
              {{
                $t(`allianceMenu['如果您的玩家堵住金额达到10亿美元及以上，您可以获得属于您自己的定制赌场，您可以使用自己的域名和设计风格设置赌场网站，免费的技术支持和定制化服务。']`)
              }}</p>
          </div>
        </div>

        <div class="contact">
          <p class="type">{{ $t(`allianceMenu['联系方式']`) }}</p>
          <div class="item">
            <p class="title">{{ $t(`allianceMenu['业务邮箱']`) }}</p>
            <p class="desc">baidu@gmail.com</p>
          </div>
          <div class="item">
            <p class="title">业务Telegram：</p>
            <p class="desc">@baidu.com</p>
          </div>
        </div>
      </div>
    </div>
    <Problem/>
  </div>

  <Dialog v-model="referralRewardVisible" title="推荐奖励规则" width="820">
    <div class="tjj">
      <p class="title">
        <img :src="titleL" alt="">
        <span>{{ $t(`allianceMenu['如何获得推荐奖励']`) }}</span>
        <img :src="titleR" alt="">
      </p>
      <div class="step">
        <div>
          <p class="num">1</p>
          <div class="content">
            <p class="title">{{ $t(`allianceMenu['分享给好友']`) }}</p>
            <p class="desc">{{ $t(`allianceMenu['将您的推荐链接或推荐码分享给您的朋友']`) }}</p>
          </div>
        </div>
        <div>
          <p class="num">2</p>
          <div class="content">
            <p class="title">推荐1000美金的奖励</p>
            <p class="desc">{{ $t(`allianceMenu['您的奖励将暂时被锁定']`) }}</p>
          </div>
        </div>
        <div>
          <p class="num">3</p>
          <div class="content">
            <p class="title">{{ $t(`allianceMenu['升级和领奖']`) }}</p>
            <p class="desc">{{ $t(`allianceMenu['您朋友的VIP等级将解锁您的奖励']`) }}</p>
          </div>
        </div>
      </div>

      <p class="title">
        <img :src="titleL" alt="">
        <span>{{ $t(`allianceMenu['解锁规则']`) }}</span>
        <img :src="titleR" alt="">
      </p>

      <div class="darkly-table">
        <el-table class="darkly-table" :data="ruleList" border>
          <el-table-column prop="lv" label="好友等级" align="center"></el-table-column>
          <el-table-column prop="bet" label="总投注额" align="center"></el-table-column>
          <el-table-column prop="unlock" label="解锁金额" align="center"></el-table-column>
        </el-table>
      </div>

    </div>
  </Dialog>

  <Dialog v-model="awardVisible" title="奖励列表" width="900">
    <div class="award">
      <div class="darkly-table">
        <el-table :data="awardList" border v-if="awardList.length">
          <el-table-column prop="username" label="用户名" align="center"></el-table-column>
          <el-table-column prop="deposit" label="总存款(过去7天)" align="center"></el-table-column>
          <el-table-column prop="bet" label="总投注(过去7天)" align="center"></el-table-column>
          <el-table-column prop="lv" label="VIP等级" align="center"></el-table-column>
          <el-table-column prop="registerTime" label="注册日期" align="center"></el-table-column>
          <el-table-column prop="amountOfBonus" label="奖励金额" align="center"></el-table-column>
        </el-table>
        <div v-else class="empty">
          <img :src="kzt_img" alt="">
          <span>{{ $t(`allianceMenu['暂无信息']`) }}</span>
          <span>{{ $t(`allianceMenu['立即邀请好友加入']`) }}</span>
        </div>
      </div>
    </div>
  </Dialog>

  <Dialog v-model="commissionRewardVisible" title="佣金奖励规则详情" width="780">
    <div class="yjjl">
      <p class="remark">{{ $t(`allianceMenu['佣金比例取决于不同游戏']`) }}：</p>
      <div class="item" v-for="(item, idx) in list">
        <div class="top">
          <span class="num">{{ item.proportion }}%</span>

          <el-tooltip effect="dark">
            <div class="icon">
              <el-icon>
                <QuestionFilled/>
              </el-icon>
            </div>
            <template #content>
              <div class="remark">
                <p>{{ $t(`allianceMenu['计算示例']`) }}：</p>
                <p>{{ item.remark }}</p>
              </div>
            </template>
          </el-tooltip>
          <span class="info">{{ item.bet }}%的投注</span>
        </div>
        <div class="bottom">
          <span>{{ $t(`allianceMenu['游戏']`) }}：</span>
          <span class="game">{{ item.name }}</span>
        </div>
        <img :src="item.bgImg" alt="">
      </div>

      <div class="contact">
        <p>{{ $t(`allianceMenu['自定义佣金比例']`) }}</p>
        <el-button>{{ $t(`allianceMenu['联系客服']`) }}</el-button>
      </div>
    </div>
  </Dialog>

  <Dialog v-model="createCodeVisible" title="创建代码" width="480">
    <div class="create-code">
      <div class="create">
        <el-input v-model="code" placeholder="请输入" size="large" @focus="isFocus = true" @blur="isFocus = false"
                  :class="isFocus && 'avctiveIpt'"></el-input>
        <p class="hint">{{ $t(`allianceMenu['注：只允许输入字母和数字，6-15个字符']`) }}</p>
      </div>
      <div class="btn">
        <el-button @click="handleCreate" size="large">{{ $t(`allianceMenu['创建']`) }}</el-button>
      </div>
    </div>
  </Dialog>

  <Dialog v-model="shareVisible" title="分享" width="480">
    <div class="share">
      <p class="remark">{{ $t(`allianceMenu['将您的推荐链接和推荐码分享到社交社区']`) }}</p>
      <div class="logo-list">
        <img :src="item" alt="" v-for="item in logoList">
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {ElMessage} from 'element-plus';
import {reactive, ref} from 'vue';
import Problem from "/@/components/Problem/Problem.vue";
import Dialog from "/@/components/Dialog/Dialog.vue";
import {useUserStore} from '/@/stores/modules/user';
import topImg1 from "/@/assets/zh/default/alliance/topImg1.png"
import topImg2 from "/@/assets/zh/default/alliance/topImg2.png"
import topImg3 from "/@/assets/zh/default/alliance/topImg3.png"
import tjjl_icon from "/@/assets/zh/default/alliance/tjjl_icon.png"
import kzt_img from "/@/assets/zh/default/alliance/kzt_img.png"
import hand from "/@/assets/zh/default/alliance/hand.png"
import img_1000 from "/@/assets/zh/default/alliance/1000_img.png"
import img2_1000 from "/@/assets/zh/default/alliance/1000_img2.png"
import detail from "/@/assets/zh/default/alliance/detail.png"
import titleL from "/@/assets/zh/default/alliance/titleL.png"
import titleR from "/@/assets/zh/default/alliance/titleR.png"
import yjjlgz_img1 from "/@/assets/zh/default/alliance/yjjlgz_img1.png"
import yjjlgz_img2 from "/@/assets/zh/default/alliance/yjjlgz_img2.png"
import yjjlgz_img3 from "/@/assets/zh/default/alliance/yjjlgz_img3.png"
import logo1 from "/@/assets/zh/default/alliance/logo1.png"
import logo2 from "/@/assets/zh/default/alliance/logo2.png"
import logo3 from "/@/assets/zh/default/alliance/logo3.png"
import logo4 from "/@/assets/zh/default/alliance/logo4.png"
import logo5 from "/@/assets/zh/default/alliance/logo5.png"
import logo6 from "/@/assets/zh/default/alliance/logo6.png"
import logo7 from "/@/assets/zh/default/alliance/logo7.png"
import logo8 from "/@/assets/zh/default/alliance/logo8.png"
import logo9 from "/@/assets/zh/default/alliance/logo9.png"

const UserStore = useUserStore();

const awardList = reactive([
  {
    username: 'Goubu',
    deposit: '$8000.00',
    bet: '$4000.00',
    lv: 'VIP1',
    registerTime: '2023-12-24 12:00:00',
    amountOfBonus: '$40.00'
  },
  {
    username: 'Goubu',
    deposit: '$8000.00',
    bet: '$4000.00',
    lv: 'VIP1',
    registerTime: '2023-12-24 12:00:00',
    amountOfBonus: '$40.00'
  },
  {
    username: 'Goubu',
    deposit: '$8000.00',
    bet: '$4000.00',
    lv: 'VIP1',
    registerTime: '2023-12-24 12:00:00',
    amountOfBonus: '$40.00'
  },
  {
    username: 'Goubu',
    deposit: '$8000.00',
    bet: '$4000.00',
    lv: 'VIP1',
    registerTime: '2023-12-24 12:00:00',
    amountOfBonus: '$40.00'
  },
  {
    username: 'Goubu',
    deposit: '$8000.00',
    bet: '$4000.00',
    lv: 'VIP1',
    registerTime: '2023-12-24 12:00:00',
    amountOfBonus: '$40.00'
  },
])
// const awardList = reactive([])

const referralCode = ref('sdadasdas') //推荐码
const referralLink = ref('https://www.baidu.com') //推荐链接
const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success('复制成功')
  } catch (err) {
    console.error('拷贝失败:', err);
    ElMessage.error('复制失败')
  }
};

// 推荐奖励规则弹框
const referralRewardVisible = ref(false)
const ruleList = reactive([
  {lv: 'Vip1', bet: '1000', unlock: '$0.50'},
  {lv: 'Vip2', bet: '1000', unlock: '$0.50'},
  {lv: 'Vip3', bet: '1000', unlock: '$0.50'},
  {lv: 'Vip4', bet: '1000', unlock: '$0.50'},
  {lv: 'Vip5', bet: '1000', unlock: '$0.50'},
  {lv: 'Vip6', bet: '1000', unlock: '$0.50'},
])

// 奖励列表弹框
const awardVisible = ref(false)

// 佣金奖励规则详情
const commissionRewardVisible = ref(false)
const list = reactive([
  {proportion: 7, bet: 1, name: '原创游戏', remark: '佣金=100*1%*7%=0.07', bgImg: yjjlgz_img1},
  {proportion: 15, bet: 1, name: '第三方老虎机、真人娱乐场', remark: '佣金=100*1%*7%=0.07', bgImg: yjjlgz_img2},
  {proportion: 25, bet: 1, name: '第三方老虎机、真人娱乐场', remark: '佣金=100*1%*7%=0.07', bgImg: yjjlgz_img3},
])

// 创建代码弹框
const createCodeVisible = ref(false)
const code = ref('')
const regex = /^[a-zA-Z0-9]{6,15}$/;
const handleCreate = () => {
  if (!regex.test(code.value)) return ElMessage.error('输入不符合要求')
}
const isFocus = ref(false)

// 分享
const shareVisible = ref(false)
const logoList = reactive([
  logo1,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6,
  logo7,
  logo8,
  logo9,

])
</script>

<style scoped lang="scss">
.container {
  width: 1200px;

  .box {
    display: grid;
    grid-template-columns: calc(65% - 7.5px) calc(35% - 7.5px);
    margin-top: 20px;
    gap: 15px;

    .left {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;

      & > div {
        border-radius: 5px;

        @include themeify {
          background-color: themed('Bg1');
        }
      }

      .col1,
      .col2 {
        display: flex;
        align-items: center;
        padding: 0 20px;

        img {
          width: 90px;
        }

        div {
          & > p:first-child {
            @include themeify {
              color: themed('Text1');
            }
          }

          & > p:last-child {
            font-size: 20px;
            font-weight: 700;

            @include themeify {
              color: themed('f1');
            }
          }
        }
      }

      .col3,
      .col4 {
        padding: 10px;
        height: 150px;

        & > div {
          display: flex;
          justify-content: space-between;
          align-items: center;

          & > div:first-child {
            display: flex;
            align-items: center;
            font-size: 20px;

            @include themeify {
              color: themed('Text_s');
            }
          }

          & > div:last-child {
            display: flex;
            align-items: center;
            cursor: pointer;

            @include themeify {
              color: themed('Theme');
            }
          }
        }

        & > p {
          font-weight: 700;
          font-size: 20px;
          text-align: center;
          margin-top: 42px;

          @include themeify {
            color: themed('f1');
          }
        }
      }

      .col5 {
        grid-column-end: span 2;
        padding: 10px;
        min-height: 400px;
        display: grid;
        grid-template-rows: auto 1fr;

        .title {
          font-size: 20px;
          margin-bottom: 10px;

          @include themeify {
            color: themed('Text_s');
          }
        }

        .darkly-table {
          height: 100%;

          button {
            border: none;
            width: 100%;
            margin: 20px 0;

            @include themeify {
              background-color: themed('Bg3');
              color: themed('Theme');
            }
          }
        }

        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;

          @include themeify {
            color: themed('Text2_1');
          }

          img {
            margin-bottom: 10px;
          }
        }
      }
    }

    .right {
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 15px;

      & > div {
        border-radius: 5px;
        padding: 20px;
        box-sizing: border-box;

        @include themeify {
          background-color: themed('Bg1');
        }
      }

      .top {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;

        div {
          @include themeify {
            color: themed('Text_s');
          }

          & > p {
            margin: 2px 0;
          }

          .title {
            font-size: 24px;
            font-weight: 700;
          }

          .tj {
            font-size: 16px;

            span {
              font-weight: 700;

              @include themeify {
                color: themed('f1');
              }
            }
          }

          .yj {
            span {
              font-weight: 700;

              @include themeify {
                color: themed('Theme');
              }
            }
          }
        }

        img {
          width: 154px;
        }
      }

      .bottom {
        height: 100%;

        .item {
          margin-bottom: 20px;

          .title {
            font-size: 20px;
            margin-bottom: 15px;

            @include themeify {
              color: themed('Text_s');
            }
          }
        }

        :deep {
          .el-input__wrapper {
            border: none;
            box-shadow: none;

            input {
              font-size: 16px;

              @include themeify {
                color: themed('Text_s');
              }
            }

            @include themeify {
              background: themed('Bg2');
            }
          }
        }

        .copy {
          cursor: pointer;

          @include themeify {
            color: themed('Theme');
          }
        }

        .btn-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 50px;

          button {
            border: none;

            @include themeify {
              background: themed('Theme');
              color: themed('Text_a');
            }
          }
        }
      }
    }
  }

  .not-auth-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;

    @include themeify {
      background-color: themed('Bg1');
    }

    .left {
      font-size: 24px;
      font-weight: 700;
      color: #FFF;

      .p2 {
        margin: 8px 0 20px 0;

        .s1 {
          @include themeify {
            color: themed('f1');
          }
        }

        .s2 {
          @include themeify {
            color: themed('Theme');
          }
        }
      }

      .el-button {
        width: 200px;
      }

      .p3 {
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        margin-top: 8px;
        width: 200px;

        @include themeify {
          color: themed('Theme');
        }
      }
    }

    .right {
      width: 246px;
      height: 246px;
      margin: 10px 0;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .part {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 15px;

    & > div {
      @include themeify {
        background-color: themed('Bg1');
      }
    }

    .left,
    .right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;

      .con {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;

        & > div {
          & > p:first-child {
            font-size: 24px;
            font-weight: 700;

            span {
              @include themeify {
                color: themed('f1');
              }
            }

            @include themeify {
              color: themed('Text_s');
            }
          }

          & > p:last-child {
            font-size: 16px;
            margin-top: 6px;

            @include themeify {
              color: themed('Text_s');
            }
          }
        }

        .el-button {
          width: 200px;

          @include themeify {
            background-color: themed('Bg3');
            color: themed('Theme');
          }
        }
      }

      img {
        width: 240px;
        height: 240px;
        margin: 60px 0;
      }
    }
  }

  .details {
    display: flex;
    align-items: center;
    gap: 30px;
    margin: 15px 0;
    border-radius: 5px;
    // padding-right: 20px;
    // padding-left: 20px;
    padding: 20px 30px 20px 20px;

    @include themeify {
      background-color: themed('Bg1');
    }

    img {
      width: 256px;
    }

    & > div {
      .type {
        font-size: 20px;
        margin-bottom: 10px;

        @include themeify {
          color: themed('Text_s');
        }
      }

      .item {
        .title {
          margin-bottom: 5px;
          font-size: 16px;

          @include themeify {
            color: themed('Text1');
          }
        }

        .desc {
          font-size: 14px;

          @include themeify {
            color: themed('Text2_1');
          }
        }
      }
    }

    .contact {
      margin-top: 20px;

      .item {
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
  }
}

.darkly-table {
  :deep() {
    .el-table {
      --el-table-border-color: #373A40;

      .el-table__row {
        @include themeify {
          background: themed('Bg1');

          &:hover {
            .el-table__cell {
              background: themed('Bg3');
            }
          }
        }

        td .cell {
          @include themeify {
            color: themed('Text1');
          }
        }
      }

      thead {
        th.el-table__cell {
          font-weight: normal;

          @include themeify {
            background: themed('Bg2');
          }
        }

        @include themeify {
          color: themed('Text_s');
        }
      }
    }

    .el-table__inner-wrapper {
      &::before {
        display: none;
      }
    }
  }
}

.tjj {
  padding: 20px;

  & > * {
    margin-bottom: 20px;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 18px;

    @include themeify {
      color: themed('Text_s');
    }

  }

  .step {
    display: flex;
    align-items: center;

    & > div {
      display: flex;
      align-items: center;
      gap: 5px;
      width: 270px;
      height: 90px;
      padding: 0 10px;

      .num {
        font-size: 36px;
        font-weight: 700;

        @include themeify {
          color: themed('Theme');
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        align-items: baseline;
        gap: 5px;

        .title {
          font-size: 16px;
          text-align: left;

          @include themeify {
            color: themed('Text1');
          }
        }

        .desc {
          @include themeify {
            color: themed('Text2_1');
          }
        }
      }
    }

    & > div:first-child {
      background-image: url('./images/tjjl_img1_bg.png');
      background-size: 100% 100%;
    }

    & > div:nth-of-type(2) {
      background-image: url('./images/tjjl_img2_bg.png');
      background-size: 100% 100%;
      padding: 0 30px;
    }

    & > div:last-child {
      background-image: url('./images/tjjl_img3_bg.png');
      background-size: 100% 100%;
      padding: 0 30px;
    }
  }
}

.award {
  padding: 20px;
}

.yjjl {
  padding: 0 20px 20px 20px;

  & > div {
    margin-bottom: 15px;
  }

  .remark {
    font-size: 16px;

    @include themeify {
      color: themed('Text1');
    }
  }

  .item {
    padding: 15px;
    border-radius: 5px;
    margin: 15px 0;
    position: relative;
    height: 90px;
    box-sizing: border-box;

    @include themeify {
      background: themed('Bg2');
    }

    .top {
      display: flex;
      gap: 5px;
      align-items: center;
      margin: 2px 0;

      .num {
        font-size: 24px;
        font-weight: 700;

        @include themeify {
          color: themed('f1');
        }
      }

      .icon {
        align-self: start;
        font-size: 16px;
        cursor: pointer;

        @include themeify {
          color: themed('icon');
        }
      }

      .info {
        font-size: 16px;

        @include themeify {
          color: themed('Text1');
        }
      }
    }

    .bottom {
      font-size: 16px;
      margin: 2px 0;

      @include themeify {
        color: themed('Text2_1');
      }

      .game {
        @include themeify {
          color: themed('Text1');
        }
      }
    }

    & > img {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .contact {
    padding: 15px;
    border-radius: 5px;

    @include themeify {
      background: themed('Bg2');
      color: themed('Text1');
      font-size: 16px;
    }

    button {
      margin-top: 10px;
      border: none;

      @include themeify {
        background: themed('Theme');
        color: themed('Text_s');
      }
    }
  }
}

.remark {
  p {
    font-size: 16px;
    margin: 2px 0;

    @include themeify {
      color: themed('Text1');
    }
  }
}

.create-code {
  padding: 0 20px 20px 20px;

  .create {
    :deep {
      .el-input__wrapper {
        box-shadow: none;
        transition: .2s;

        input {
          font-size: 16px;

          @include themeify {
            color: themed('Text_s');
          }
        }

        @include themeify {
          background: themed('Bg2');
        }
      }
    }

    .avctiveIpt {
      :deep(.el-input__wrapper) {
        @include themeify {
          box-shadow: 0 0 0 1px themed('Theme') !important;
        }
      }
    }

    .hint {
      margin-top: 5px;

      @include themeify {
        color: themed('Text2_1');
      }
    }
  }

  .btn {
    margin-top: 30px;
    display: flex;
    justify-content: center;

    button {
      border: none;
      width: 70%;


      @include themeify {
        background: themed('Theme');
        color: themed('Text_a');
      }
    }
  }

}

.share {
  padding: 0 20px 20px 20px;

  @include themeify {
    color: themed('Text1');
  }

  .logo-list {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px 22px;

    img {
      flex-shrink: 0;
      cursor: pointer;
    }
  }
}
</style>
