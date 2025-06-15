<script>
import { defineComponent, onMounted, onBeforeUnmount, ref, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sataliteStore } from '@/stores/satalite'

export default defineComponent({
  name: "App",
  setup() {

    const sataliteStr = sataliteStore()

    onMounted(() => {
      sataliteStr.getSelectedSatalites()
    })
    return {
      sataliteStr
    };
  },
});
</script>

<template>
  <el-container>
    <RouterView />
  </el-container>
</template>

<style scoped>

</style>
