<script>
import { defineComponent, ref } from 'vue'
import SataliteTable from '@/components/SataliteTable.vue'
import TempSelectedAssets from '@/components/TempSelectedAssets.vue'
export default defineComponent({
  components: {
    SataliteTable,
    TempSelectedAssets
  },
  setup() {

    return {
      
    }
  },
})
</script>

<template>
  <div class="home">
    <h1>Create My Asset List</h1>
    <div class="satalite-table-div">
      <SataliteTable class="satalite-table-component" />
      <TempSelectedAssets class="selected-assets-component" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  padding: 24px 60px;
  width: 100%;

  .satalite-table-div {
    margin-top: 24px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    .satalite-table-component {
      flex: 0 0 850px;
      margin-right: 40px;
    }

    .selected-assets-component {
      flex: 0 0 350px;
      min-width: 0;
    }
  }
}
</style>