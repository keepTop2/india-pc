<!--
 * @Author: herry
 * @Description: NeedLoginDialog；
-->
<template>
  <div class="interDivDialog">
    <Dialog v-model="loginVisible" width="380" :showClose="false" :append-to-body="false" :close-on-click-modal="false">
      <div class="content_title">{{ $t(`isLogin['温馨提示']`) }}</div>
      <div class="content_text">{{ $t(`isLogin['你还没登录，请先登录']`) }}</div>
      <div class="dialog-footer">
        <el-button type="primary" @click="showLogin">{{ $t(`isLogin['登 录']`) }}</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed, onUnmounted } from 'vue';
import { useUserStore } from '/@/stores/modules/user';
import Dialog from '/@/components/Dialog/Dialog.vue';
import pubSub from '/@/pubSub/pubSub';
const UserStore = useUserStore();
const loginVisible = ref(true);
onMounted(() => {
  if (!UserStore.token) {
    loginVisible.value = true
  }
})

const showLogin = () => {
  //发布登陆弹窗事件
  pubSub.publish(pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.eventName, pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.params[1]);
  // loginVisible.value = false
}

// const Left = ref("255px")
// let viewportWidth = window.innerWidth;

// getLeft()

// function getLeft() {
//   if (viewportWidth < 1460) {
//     Left.value = "64px"
//   } else {
//     Left.value = "255px"
//   }
// }
// window.addEventListener('resize', function (e) {
//   let viewportWidth = window.innerWidth;
//   console.log("=>(NeedLoginDialog.vue:40) viewportWidth", viewportWidth);
//   getLeft()
// });

</script>

<style lang="scss" scoped>
.interDivDialog {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;

  :deep() {
    .el-overlay {
      position: relative;
      width: 100%;
      height: 100%;

      // :deep(.el-overlay-dialog) {
      //   left: v-bind(Left);
      //   top: 130px;
      // }
      .el-overlay-dialog {
        position: absolute;
        height: 100%;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }

  }



}


.content_title {
  color: #fff;
  font-size: 20px;
  height: 68px;
  line-height: 68px;
  text-align: center;
}

.content_text {
  text-align: center;
  color: #98A7B5;
  font-size: 16px;
  height: 92px;
  text-align: center;
  line-height: 92px;
}

.el-button {
  height: 48px;
  width: 134px;
}
</style>
