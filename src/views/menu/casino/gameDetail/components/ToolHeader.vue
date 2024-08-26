<!--
 * @Author: WangMingxin
 * @Description:游戏详细页-头部；
-->
<template>
  <div class="header-container">
    <div class="breadcrumb-plan">
      <el-breadcrumb :separator-icon="ArrowRight">
        <template v-for="(item, index) in breadcrumbData" :key="index">
          <el-breadcrumb-item v-if="index == breadcrumbData.length - 1">
            <template v-if="item?.meta?.isServer">
              {{ item.meta.title }}
            </template>
            <template v-else> {{ $t(item.meta.title) }} </template>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-else :to="item">
            <template v-if="item?.meta?.isServer">
              {{ item.meta.title }}
            </template>
            <template v-else> {{ $t(item.meta.title) }} </template>
          </el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <div class="tool-plan">
      <div v-for="(tool, index) in tools" :key="index" class="tooltip-container" @click="handleClick(tool.action)">
        <SvgIcon :class="tool.className" :iconName="tool.iconName" :size="12" />
        <span class="tooltip-text">{{ tool.tooltipText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';
import { onMounted, reactive, computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '/@/stores/modules/menu';
const MenuStore = useMenuStore();
import { useUserStore } from '/@/stores/modules/user';
const UserStore = useUserStore();
import { CasionApi } from '/@/api/menu/casion/casion';
import { useI18n } from 'vue-i18n';
import { i18n } from '/@/i18n/index';
import Common from '/@/utils/common';
const $: any = i18n.global;

// const i18n = useI18n();
const route = useRoute();
const router = useRouter();

const gameId = ref(route.query.id);
const gameCollect = ref(route.query.collect === 'true');

const emits = defineEmits(['onFormChange', 'toggleFullScreen', 'openPage', 'refreshPage'],);

const openPage = () => {
  // window.open('https://www.baidu.com', '_blank');
  emits('openPage');
}
const refreshPage = () => {
  window.location.reload();
  emits('refreshPage');
}
const closePage = () => {
  router.go(-1);
}
const toggleFullScreen = () => {
  emits('toggleFullScreen');
}



interface HeaderData {
  isSort?: boolean; //是否有排序
  isSupplier?: boolean; //是否有供应商
}

const props = withDefaults(defineProps<HeaderData>(), {
  isSort: true,
  isSupplier: true,
});

// 生成数组数据
const breadcrumbData: any = ref([]);
const getBreadcrumbData = () => {
  const arr = route.matched.filter((item) => {
    return item?.meta && item.meta?.title;
  })
  breadcrumbData.value = arr;
};
// 监听路由发生改变时触发
watch(
  route,
  () => {
    getBreadcrumbData();
  },
  {
    immediate: true,
  }
);

/**游戏收藏或者取消收藏 */
const clickCollect = async () => {
  const { token } = UserStore.getUserInfo;
  if (token) {
    let params: any = {
      gameId: gameId.value,
      type: !gameCollect.value,
    };
    const res: any = await CasionApi.gameCollection(params).catch((err: any) => err);
    const { code, data } = res;
    if (code == Common.ResCode.SUCCESS) {
      if (data == 1) {
        gameCollect.value = !gameCollect.value;
        const collectStatus = gameCollect.value ? '2' : '';
        updateToolStatus(collectStatus);
      }

    }
  } else {
    // showLogin();
  }
  // emits('clickCollect', props.CardItem);
};

const updateToolStatus = (collectStatus: string) => {
  const collectText = collectStatus ? '取消收藏' : '收藏';
  const collectIcon = collectStatus ? 'uncollected2' : 'uncollected';
  const collectClassName = collectStatus ? 'close2' : 'close';

  Object.assign(tools[3], {
    iconName: collectIcon,
    className: collectClassName,
    tooltipText: collectText,
  });
};


const tools = reactive([
  {
    className: 'close',
    iconName: 'new_window',
    tooltipText: '新窗口打开',
    action: openPage
  },
  {
    className: 'close',
    iconName: 'enlargement',
    tooltipText: '全屏',
    action: toggleFullScreen
  },
  {
    className: 'close',
    iconName: 'refresh',
    tooltipText: '刷新',
    action: refreshPage
  },
  {
    className: gameCollect.value ? 'close2' : 'close',
    iconName: gameCollect.value ? 'uncollected2' : 'uncollected',
    tooltipText: gameCollect.value ? '取消收藏' : '收藏',
    action: clickCollect
  },
  {
    className: 'close',
    iconName: 'close',
    tooltipText: '关闭',
    action: closePage
  }
]);

const handleClick = (action: () => void) => {
  if (typeof action === 'function') {
    action();
  }
};

onMounted(() => {
  MenuStore.setCollapse(true);
});
</script>

<style lang="scss" scoped>
$el-breadcrumb: 'el-breadcrumb';

.header-container {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  padding-top: 32px;
  // padding-bottom: 20px;
  background: transparent;
  //margin-left: -35px;
  align-items: end;
  padding-bottom: 5px;

  .breadcrumb-plan {
    border-radius: 4px;

    // background: var(--Bg1-1, #24262b);
    @include themeify {
      // background-color: themed('Bg1');
    }

    // padding: 10px 17px;
    :deep() {
      .el-breadcrumb {
        .el-breadcrumb__item {
          .el-breadcrumb__inner {
            // color: var(--Text1-1, #98a7b5);
            text-align: right;
            font-family: 'PingFang SC';
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            cursor: pointer;

            @include themeify {
              color: themed('Text1');
            }
          }

          &:last-child {
            .el-breadcrumb__inner {
              // color: var(--text-s, #fff);
              font-family: 'PingFang SC';
              font-size: 14px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
              cursor: default;

              @include themeify {
                color: themed('Text_s');
              }

              &a,
              &a:hover,
              &:hover {
                font-family: 'PingFang SC';
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;

                @include themeify {
                  color: themed('Text_s');
                }
              }
            }
          }
        }
      }
    }
  }

  .tool-plan {
    display: flex;
    align-items: end;
  }
}

.close {
  margin-right: 4px;
  padding: 8px;
  border-radius: 4px;
  color: #fff;

  @include themeify {
    background: themed('Bg1');
  }
}

.close2 {
  margin-right: 4px;
  padding: 8px;
  border-radius: 4px;

  @include themeify {
    color: themed('Warn');
    background: themed('Bg1');
  }
}


.close:hover {
  @include themeify {
    background: themed('icon');
  }
}

.close2:hover {
  @include themeify {
    background: themed('icon');
  }
}


.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip-text {
  visibility: hidden;
  text-align: center;
  padding: 4px;
  position: absolute;
  z-index: 1;
  bottom: 110%;
  /* 调整这个值以适应您的图标大小 */
  left: 50%;
  transform: translateX(-55%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
  /* 防止文本换行 */

  border-radius: 2px;
  background: rgba(0, 0, 0, 0.50);
  color: #FFF;
  font-family: "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 12px;
  /* 100% */
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
