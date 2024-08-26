<template>
  <!-- 联盟 -->
  <div class="content">
    <div class="content_one">
      <div class="invitation">{{ $t(`alliance['邀请好友赚取']`) }}</div>
      <div class="box">
        <div>
          <div class="box_one">$ 1000.00</div>
          <span class="box_two">{{ $t(`alliance['推荐奖励']`) }}</span>
        </div>
        <div>
          <div class="box_one">25%</div>
          <span class="box_two">{{ $t(`alliance['佣金奖励']`) }}</span>
        </div>
      </div>
      <div class="referral">
        <div class="referral_code">{{ $t(`alliance['推荐码']`) }}</div>
        <div class="referral_input">
          <input type="text"/>
          <SvgIcon iconName="copy" size="6"/>
        </div>
      </div>
      <div class="referral">
        <div class="referral_code">{{ $t(`alliance['推荐链接']`) }}</div>
        <div class="referral_input">
          <input type="text"/>
          <SvgIcon iconName="copy" size="6"/>
        </div>
      </div>
      <div class="share">
        <Button class="mt_40" @click="homeBack">{{ $t(`alliance['创建新的推荐码']`) }}</Button>
        <div class="share_text">{{ $t(`alliance['通过社交媒体分享']`) }}</div>
        <div class="share_icon">
          <!-- shareSoftware -->
          <SvgIcon class="share_svg" iconName="shareSoftware1" size="6"/>
          <SvgIcon class="share_svg" iconName="shareSoftware2" size="6"/>
          <SvgIcon class="share_svg" iconName="shareSoftware3" size="6"/>
          <SvgIcon class="share_svg" iconName="shareSoftware4" size="6"/>
          <SvgIcon class="share_svg" iconName="shareSoftware5" size="6"/>
          <SvgIcon class="share_svg" iconName="shareSoftware6" size="6"/>
        </div>
      </div>

      <div class="amount">
        <div class="amount_one">
          <div class="amount_two">
            <span class="box_two">{{ $t(`alliance['获得总奖励']`) }}</span>
            <div class="box_one">$ 56,010</div>
          </div>
          <div class="amount_three">
            <span class="box_two">{{ $t(`alliance['推荐好友总数']`) }}</span>
            <div class="box_one">6</div>
          </div>
        </div>
        <div class="amount_one">
          <div class="amount_two">
            <span class="box_two">{{ $t(`alliance['推荐奖励']`) }}</span>
            <div class="box_one">$ 1000.00</div>
          </div>
          <div class="amount_three">
            <span class="box_two">{{ $t(`alliance['佣金奖励']`) }}</span>
            <div class="box_one">$ 1000.00</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content_three">
      <div class="list">
        <div class="title">
          <span class="value">{{ $t(`alliance['奖励记录']`) }}</span>
          <!-- <span class="value">查看全部<img class="rightArrow" :src="rightArrowTwo" alt="" /></span> -->
        </div>
        <div ref="cellList" class="cell-list">
          <div class="cell" v-for="(item, index) in datalist" :key="index">
            <div class="value">{{ item.data }}</div>
            <div class="value">{{ item.status }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content_three">
      <div class="recommend">{{ $t(`alliance['联盟']`) }}</div>
      <div class="recommend_content">
        {{ $t(`alliance['推荐计划']`) }}<br/>
        {{ $t(`alliance['定制赌场']`) }}<br/>
        {{ $t(`alliance['了解更多']`) }}
        <span class="relation"> {{ $t(`alliance['联系我们']`) }}</span>
      </div>
      <div class="content_input">
        <input type="text"/>
        <span @click="printMessage" class="green-text">{{ $t(`alliance['现在发送']`) }}</span>
      </div>
    </div>
    <div class="content_three">
      <div class="recommend">{{ $t(`alliance['常见问题']`) }}</div>
      <div class="info" v-for="(item, index) in state.aaa" :key="index">
        <div @click="toggleExpand()">
          <div class="text"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {reactive} from 'vue';

const router = useRouter();
const printMessage = () => {
  console.log('111');
};
const datalist = [
  {data: '推荐奖励', status: '$100.00'},
  {data: '佣金奖励', status: '$100.00'},
  {data: '推荐奖励', status: '$100.00'},
  {data: '佣金奖励', status: '$100.00'},
];

const state = reactive({
  list: [] as any,
  shareShow: false,
  aaa: [
    {
      a: '推荐好友如何操作？',

      b: '当您与您的任何朋友、家人分享您的推荐链接或在我们的网站上宣传该链接和玩家注册时，该玩家将成为您的推荐人，他们将为您赚取佣金和佣金。玩 [平台名称] 即可获得额外奖励。',
      c: '1',
    },
    {
      a: '我可以从我的推荐中赚取多少收入？',
      b: '我们想提请您注意有关我们平台上 $ICP 存款地址的重要更新。',
      c: '2',
    },
    {
      a: '我可以查看我的推荐数据吗？',
      b: '我们想提请您注意有关我们平台上 $ICP 存款地址的重要更新。我们想提请您注意有关我们平台上 $ICP 存款地址的重要更新。我们想提请您注意有关我们平台上 $ICP 存款地址的重要更新。',
      c: '3',
    },
  ] as any,
  unreadCount: {
    announcementUnread: 200,
    messageUnread: 9,
  },
  params: {
    noticeType: null as null | string,
    pageNumber: 0,
    pageSize: 10,
  },
  noticeList: [],
});

const homeBack = () => {
  console.log('登录');
};
const toggleExpand = () => {
  router.push({path: '/invite/commonProblem'});
};
</script>

<style lang="scss" scoped>
.content {
  padding: 24px;

  .content_one {
    padding: 24px;

    @include themeify {
      background: themed('BG3');
    }

    .invitation {
      text-align: center;

      @include themeify {
        color: themed('TB');
      }

      font-family: 'PingFang SC';
      font-size: 56px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    .box {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 20px 0 24px 0;
    }

    .box_one {
      @include themeify {
        color: themed('Hint-P');
      }

      font-family: 'DIN Alternate';
      font-size: 48px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    .box_two {
      @include themeify {
        color: themed('TB');
      }

      font-family: 'PingFang SC';
      font-size: 28px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    .referral {
      padding: 16px 0;

      .referral_code {
        @include themeify {
          color: themed('T1');
        }

        font-family: 'PingFang SC';
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        line-height: 36px;
        /* 150% */
        text-transform: uppercase;
      }

      .referral_input {
        margin-top: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        border-radius: 12px;

        @include themeify {
          border: 1px solid themed('Theme-P');
        }

        @include themeify {
          background: themed('BG2');
        }

        input {
          @include themeify {
            background: themed('BG2');
          }

          width: 600px;
          height: 68px;
          margin-left: 12px;
          border: none;

          @include themeify {
            color: themed('T1');
          }

          font-family: 'PingFang SC';
          font-size: 26px;
          font-style: normal;
          font-weight: 400;
          line-height: 36px;
          /* 138.462% */
        }
      }
    }

    .share {
      padding: 32px 41px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .clause {
        margin-top: 32px;
        display: flex;
        align-items: center;

        @include themeify {
          color: themed('T1');
        }

        font-family: 'PingFang SC';
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        line-height: 36px;
        /* 150% */
        text-transform: uppercase;
      }

      .share_text {
        margin: 40px 0 20px 0;

        @include themeify {
          color: themed('T1');
        }

        font-family: 'PingFang SC';
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-transform: uppercase;
      }

      .share_icon {
        width: 480px;
        display: flex;
        justify-content: space-around;
      }

      .mt_40 {
        display: flex;
        width: 620px;
        height: 86px;
        padding: 10px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 80px;

        @include themeify {
          background: themed('Theme-P');
        }
      }
    }

    .amount {
      margin-top: 24px;

      .amount_one {
        padding: 32px 0;
        display: flex;

        .amount_two {
          width: 50%;
        }

        .amount_three {
          border-left: 1px solid #373a40;
          padding: 0 24px;
        }
      }

      .amount_one:nth-child(1) {
        border-bottom: 1px solid #373a40;
      }
    }
  }

  .list {
    width: 654px;
    border-radius: 16px;

    @include themeify {
      background: themed('BG3');
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .value {
        @include themeify {
          color: themed('TB');
        }

        font-family: 'PingFang SC';
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: 42px;
        /* 131.25% */
      }

      .value:nth-child(2) {
        display: flex;
        align-items: center;

        @include themeify {
          color: themed('Theme-P');
        }

        /* Text3-文本3 */
        font-family: 'PingFang SC';
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: 38px;
        /* 135.714% */
      }
    }

    .cell-list {
      .cell {
        margin-top: 24px;

        height: 68px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .value {
          @include themeify {
            color: themed('T1');
          }

          text-align: center;
          font-family: 'PingFang SC';
          font-size: 24px;
          font-style: normal;
          font-weight: 400;
          line-height: 34px;
          /* 141.667% */
        }
      }
    }
  }

  .content_three {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 40px;
    gap: 24px;
    border-radius: 16px;
    margin-top: 24px;

    @include themeify {
      background: themed('BG3');
    }

    .content_input {
      display: flex;
      width: 622px;
      justify-content: space-between;
      align-items: center;
      border-radius: 12px;

      @include themeify {
        border: 1px solid themed('Theme-P');
      }

      input {
        width: 450px;
        height: 94px;
        margin-left: 12px;

        @include themeify {
          background: themed('BG3');
        }

        border: none;
        color: #ffffff;
      }

      .green-text {
        margin-right: 24px;

        @include themeify {
          color: themed('Theme-P');
        }

        font-family: 'PingFang SC';
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: 38px;
        /* 135.714% */
      }
    }
  }
}

:deep(.van-button__content .van-button__text) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rightArrow {
  margin-left: 10px;
  width: 32px;
  height: 32px;
}

.recommend {
  @include themeify {
    color: themed('TB');
  }

  font-family: 'PingFang SC';
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: 42px;

  /* 131.25% */
  .award {
    @include themeify {
      color: themed('Hint-P');
    }

    font-family: 'DIN Alternate';
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 42px;
  }
}

.recommend_content {
  @include themeify {
    color: themed('T1');
  }

  /* Text1-文本1 */
  font-family: 'PingFang SC';
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px;
  /* 141.667% */
}

.relation {
  @include themeify {
    color: themed('Theme-P');
  }
}

.info {
  width: 100%;
  border-bottom: 1px solid #373a40;

  .text {
    .text_title {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @include themeify {
        color: themed('T1');
      }

      font-family: 'PingFang SC';
      font-size: 30px;
      font-style: normal;
      font-weight: 500;
      line-height: 40px;
      /* 133.333% */
      margin: 24px 0;

      .icon {
        width: 32px;
        height: 32px;
        margin-left: 10px;
      }
    }

    .text_one {

      // width: 654px;
      @include themeify {
        color: themed('T1');
      }

      text-align: justify;

      /* Text1-文本1 */
      font-family: 'PingFang SC';
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: 34px;
      /* 141.667% */
      display: none;

      &.expanded {
        display: block;
      }
    }
  }

  .unfold {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    @include themeify {
      color: themed('T1');
    }

    text-align: right;
    font-family: 'PingFang SC';
    font-size: 26px;
    font-style: normal;
    font-weight: 400;
    line-height: 36px;
    /* 138.462% */
    text-transform: uppercase;
  }
}
</style>
