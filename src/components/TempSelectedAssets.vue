<script>
import { defineComponent, onMounted, ref } from 'vue'
import { sataliteStore } from '@/stores/satalite'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {

    const sataliteStr = sataliteStore()
    const router = useRouter()

    function removeAll() {
      sataliteStr.tempSelectedSatellites = []
    }

    function removeSatalite(row) {
      const index = sataliteStr.tempSelectedSatellites.findIndex(s => s.noradCatId === row.noradCatId)
      sataliteStr.tempSelectedSatellites.splice(index, 1)
    }
    return { 
      sataliteStr,
      removeSatalite,
      removeAll,
      router
    }
  },
})
</script>

<template>
  <div class="selected_assets-wrap">
    <h3>Selected Assets</h3>
    <div class="selected_assets-main_div">
      <div class="selected_assets-header">
        <p class="selected_object_count" >{{sataliteStr.tempSelectedSatellites.length}} Objects selected</p>
        <p class="icon" @click="removeAll()">
          <span>clear all</span>
          <i class="fa-solid fa-xmark"></i>
        </p>
      </div>
      <el-divider />
      <div class="selected_assets-content">
        <div class="selected_assets_row" v-for="(row, indx) in sataliteStr.tempSelectedSatellites" :key="indx">
          <span class="id">{{row.noradCatId}}</span>
          <span class="name">{{row.name}}</span>
          <span><i class="fa-solid fa-xmark" @click="removeSatalite(row)"></i></span>
        </div>
      </div>
    </div>
    <div class="button-div">
      <el-button class="primary-button" @click="sataliteStr.saveSelection(router)">Proceed</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.selected_assets-wrap {
  padding: 24px;
  padding-left: 60px;
  color: #fafafa;

  .selected_assets-main_div {
    height: 440px;
    margin-top: 16px;
    padding: 12px;
    border: 1px solid #35B1F2;

    .selected_assets-header {
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 4px;

      p {
        font-size: 13px;

        &.selected_object_count {
          color: #35B1F2;
        }

        &.icon {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #999999;
          opacity: 0.5;
        }
      }
    }

    .selected_assets-content {
      .selected_assets_row {
        display: flex;
        gap: 16px;
        align-content: center;
        font-size: 14px;
        padding: 4px 8px;
        color: #999999;

        .id {
          width: 60px;
        }

        .name {
          width: 150px;
        }

        i {
          cursor: pointer;
        }
      }
    }
  }

  .button-div {
    margin-top: 16px;
    width: 100%;

    .primary-button {
      width: 100%;
    }
  }
}
</style>