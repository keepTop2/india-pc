<template>

  <el-dialog :model-value="props.visible" :show-close="false" :align-center="true" width="480" style="height: 650px"
             :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="deposit-dialog">
      <div class="head">
        <div class="label">{{ props.title }}</div>
        <SvgIcon class="dialog_close" iconName="dialog_close" :size="30" @click="emits('close')"/>
      </div>

      <div class="content">
        <div class="center">
          <div class="top">
            <div class="part1">
              <el-image :src="KeyImage"></el-image>
            </div>
            <div class="part2">{{ $t(`userDropDown['修改密码']`) }}</div>
            <div class="part3">{{
                $t(`userDropDown['为了您的安全，我们需要先验证您的原密码。']`)
              }}
            </div>
          </div>
        </div>
        <div class="input-box">
          <div>{{ $t(`userDropDown['旧密码']`) }}</div>
          <el-input v-model="params.oldPassword" :type="passwordFieldType"
                    :placeholder="$t(`userDropDown['请输入密码']`)">
            <template #suffix>
              <div @click="togglePasswordVisibility">
                <el-icon v-show="passwordFieldType === 'text'">
                  <View/>
                </el-icon>
                <el-icon v-show="passwordFieldType === 'password'">
                  <Hide/>
                </el-icon>
              </div>
            </template>
          </el-input>
        </div>
        <div class="input-box">
          <div>{{ $t(`userDropDown['新密码']`) }}</div>
          <el-input v-model="params.newPassword" :type="passwordFieldType"
                    :placeholder="$t(`userDropDown['请输入密码']`)">
            <template #suffix>
              <div @click="togglePasswordVisibility">
                <el-icon v-show="passwordFieldType === 'text'">
                  <View/>
                </el-icon>
                <el-icon v-show="passwordFieldType === 'password'">
                  <Hide/>
                </el-icon>
              </div>
            </template>
          </el-input>
        </div>
        <div class="input-box">
          <div>{{ $t(`userDropDown['确认密码']`) }}</div>
          <el-input v-model="params.confirmPassword" :type="passwordFieldType"
                    :placeholder="$t(`userDropDown['请输入密码']`)">
            <template #suffix>
              <div @click="togglePasswordVisibility">
                <el-icon v-show="passwordFieldType === 'text'">
                  <View/>
                </el-icon>
                <el-icon v-show="passwordFieldType === 'password'">
                  <Hide/>
                </el-icon>
              </div>
            </template>
          </el-input>
        </div>
        <div class="btn">
          <el-button type="success" @click="handleConfirm">{{ $t(`userDropDown['确定']`) }}</el-button>
        </div>
      </div>

    </div>
  </el-dialog>


  <!--  <Dialog @close="onClose" v-model="props.visible" :title="props.title" width="480" style="height: 600px">-->
  <!--  </Dialog>-->

</template>
<script setup lang="ts">
import {reactive, ref} from 'vue';
import {View, Hide} from '@element-plus/icons-vue';
import KeyImage from '/@/assets/zh/default/config/key.svg';
import Dialog from "/@/components/Dialog/Dialog.vue";
import BankTransfer
  from "/@/views/wallet/views/deposit/components/depositDialog/components/bankTransfer/bankTransfer.vue";
import {userApi} from "/@/api/user/user";
import {ElMessage} from "element-plus";

const props = defineProps<{
  title?: string;
  visible: boolean;
}>();
const emits = defineEmits(['update:visible', 'close']);
const onClose = () => {
  emits('update:visible', false);
};

const params = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordFieldType = ref('password');

const togglePasswordVisibility = () => {
  console.log('togglePasswordVisibility');
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

const handleConfirm = async () => {
  let res = await userApi.changePassword(params)
  ElMessage.success(res.message)
  emits('update:visible', false)
}
</script>
<style scoped lang="scss">
@import '../index';

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 15px;

  .top {
    width: 80%;

    .part1 {
      margin-top: 10px;

      .el-image {
        width: 48px;
        height: 48px;
      }
    }

    .part2 {
      font-size: 18px;
      margin-top: 10px;
      @include themeify {
        color: themed("Text_s");
      }
    }

    .part3 {
      color: #98a7b5;
      margin-top: 10px;
      @include themeify {
        color: themed("Text1");
      }
    }

    div {
      @include center;
    }
  }

  .input-box {
    margin: 0 auto;
    width: 80%;
    color: white;

    :deep {
      .el-input {
        margin-top: 10px;
        height: 48px;
      }

      .el-input__wrapper {
        box-shadow: none;
        @include themeify {
          background: themed("Bg2");
        }

        input {
          @include themeify {
            color: themed("Text2_1");
          }

          &::placeholder {
            @include themeify {
              color: themed("Text2_1");
            }
          }
        }
      }
    }
  }

  .btn {
    width: 200px;
    height: 48px;
    margin: 30px auto auto;

    .el-button {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
