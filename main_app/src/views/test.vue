<template>
  <div class="test">
    <Statistics/>
    <Hot/>
  </div>
</template>

<script setup lang="ts">
import Statistics from "/@/components/Statistics/index.vue"
import Hot from "/@/components/Hot/index.vue"
</script>

<style scoped lang="scss">
.test{
  display: grid;
  gap: 10px;
}
</style>