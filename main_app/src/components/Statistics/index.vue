<template>
  <div class="statistics-container">
    <div class="title">统计</div>
    <div class="content">

      <div class="list-progress">
        <div class="item" v-for="item in 3">
          <div>
            <span>32</span>
            <el-progress type="circle" :percentage="0" width="40" stroke-width="4">
              <template></template>
            </el-progress>
            <span>5</span>
          </div>
          <div>进攻</div>
        </div>
      </div>

      <div class="list-count">
        <div class="item" v-for="item in 2">
          <div>射正球门</div>
          <div>
            <span>2</span>
            <el-progress stroke-width="4" :percentage="10" text-inside>
              <template></template>
            </el-progress>
            <span>1</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.statistics-container {
  width: 366px;
  height: 200px;
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

  .content {
    padding: 0 18px;

    .list-progress {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 14px;
      margin-top: 20px;

      .item {
        & > div:first-child {
          display: flex;
          align-items: center;
          font-size: 14px;
          gap: 10px;

          & > span:first-child {
            @include themeify {
              color: themed('f1');
            }
          }

          & > span:last-child {
            @include themeify {
              color: themed('f2');
            }
          }
        }

        & > div:last-child {
          font-size: 14px;
          text-align: center;
          margin-top: 4px;
          @include themeify {
            color: themed('Text1');
          }
        }
      }
    }

    .list-count {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 37px;
      margin-top: 20px;

      .item {
        & > div:first-child {
          font-size: 12px;
          text-align: center;
          margin-bottom: 4px;
          @include themeify {
            color: themed('Text1');
          }
        }

        & > div:last-child {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 6px;

          & > span:first-child {
            @include themeify {
              color: themed('f1');
            }
          }

          & > span:last-child {
            @include themeify {
              color: themed('f2');
            }
          }
        }
      }
    }

  }
}

:root {
  --el-fill-color-light: #FFA800;
  --el-border-color-lighter: #409eff;
  --el-color-primary: #FFA800;
}
</style>