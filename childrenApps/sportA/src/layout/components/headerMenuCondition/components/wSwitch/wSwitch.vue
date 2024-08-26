<!--
 * @Author: WangMingxin
 * @Description: 自定义体育-switch组件；
-->
<template>
  <div class="btn-container" :class="disabled ? 'disabled' : ''">
    <label class="switch btn-color-mode-switch">
      <input value="1" ref="colorModeRef" :id="domeId" :name="domeId" type="checkbox" @click="getValue"
        :disabled="disabled">
      <label class="btn-color-mode-switch-inner" :data-off="switchObj?.off?.label" :data-on="switchObj?.on?.label"
        :for="domeId">
      </label>
    </label>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid';
export interface onOffType {
  label: string;
  type: string;
  active: boolean;
}

export interface SwitchObjType {
  /**
   * @description: 状态为true时显示对象
   */
  on?: onOffType;
  /**
 * @description: 状态为false时显示对象
 */
  off?: onOffType;
}
export interface wSwitchType {
  /** @description: 选中状态*/
  disabled?: boolean;
  /** @description: 开关选可选者对象*/
  switchObj?: SwitchObjType;
}

const props = withDefaults(defineProps<wSwitchType>(), {
  disabled: false,
  switchObj: () => ({
    on: { label: "未开赛", type: "rollingBall", active: true, },
    off: { label: "滚球", type: "todayContest", active: false, },
  }),
});

/**
 * @description: 生成指定长度的UUID；
 * @param {*} length
 * @return {*}
 */
const generateShortUUID = (length: number): string => {
  const fullUUID: string = uuidv4(); // 生成完整的 UUID
  return fullUUID.replace(/-/g, '').substring(0, length); // 删除连接符，并截取指定长度的子串
}

const uuidDiv = generateShortUUID(8);

const domeId = ref('color_mode' + uuidDiv)

const colorModeRef = ref()
const emit = defineEmits(['selected']);

const getValue = () => {
  if (colorModeRef.value && !props.disabled) {
    const val = colorModeRef.value?.checked
    emit('selected', val);
  }
}

/**
 * @description: 上层对象改动时响应变动值
 * @return {*}
 */
const setSwicthVal = () => {
  if (colorModeRef.value) {
    if (props.switchObj?.on?.active) {
      colorModeRef.value.checked = true;
    } else {
      colorModeRef.value.checked = false;
    }
  }
}

watch(
  () => props.switchObj,
  (newValue, oldValue) => {
    setSwicthVal();
  },
  {
    deep: true,
  }
)

onMounted(() => {
  setSwicthVal()
})

</script>

<style scoped lang="scss">
.btn-color-mode-switch input[type="checkbox"] {
  cursor: pointer;
  width: 90px;
  height: 40px;
  opacity: 0;
  position: absolute;
  top: 0;
  z-index: 1;
  margin: 0px;
}

.btn-color-mode-switch input[type="checkbox"]:checked+label.btn-color-mode-switch-inner {

  // background-color: #fcce8a;
  @include themeify {
    background-color: themed('Bg3');
    color: themed('Text1');
  }

}

.btn-color-mode-switch input[type="checkbox"]:checked+label.btn-color-mode-switch-inner:after {
  content: attr(data-on);
  left: 90px;
}

.btn-color-mode-switch input[type="checkbox"]:checked+label.btn-color-mode-switch-inner:before {
  content: attr(data-off);
  right: auto;
  top: 50%;
  transform: translateY(-50%);
  left: 15%;
}

.btn-container {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  height: 40px;
  overflow: hidden;

  .btn-color-mode-switch {
    display: inline-block;
    margin: 0px;
    position: relative;

    >label.btn-color-mode-switch-inner {
      margin: 0px;
      width: 180px;
      height: 40px;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
      display: block;
      cursor: pointer;

      @include themeify {
        background-color: themed('Bg3');
        color: themed('Text1');
      }

      &:before {
        content: attr(data-on);
        position: absolute;
        font-size: 14px;
        font-weight: 400;
        top: 50%;
        transform: translateY(-50%);
        right: 15%;

        @include themeify {
          color: themed('Text1');
        }
      }

      &:after {
        content: attr(data-off);
        width: 90px;
        height: 40px;
        // background: #fff;
        border-radius: 26px;
        position: absolute;
        font-size: 14px;
        display: flex;
        justify-content: center;
        left: 0px;
        top: 0px;
        text-align: center;
        transition: all 0.3s ease;
        // box-shadow: 0px 0px 6px -2px #111;
        // padding: 5px 0px;
        // color: #222;
        font-weight: 400;
        line-height: 40px;

        @include themeify {
          background-color: themed('Theme');
          color: themed('Text_a');
        }

      }

    }

  }


  &.disabled {
    .btn-color-mode-switch {
      >label.btn-color-mode-switch-inner {
        cursor: not-allowed;

        &:after {
          @include themeify {
            background-color: themed('Bg3');
            color: themed('Text1');
          }
        }

      }

      input[type="checkbox"] {
        cursor: not-allowed;
      }

      input[type="checkbox"]:checked+label.btn-color-mode-switch-inner {

        @include themeify {
          background-color: themed('Bg3');
          color: themed('Text1');
        }

      }


    }


  }


}
</style>