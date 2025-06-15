<script>
import { defineComponent, ref, computed } from 'vue'
import { sataliteStore } from '@/stores/satalite'

export default defineComponent({
  setup() {
    const sataliteStr = sataliteStore()

    const pageSize = ref(20)
    const currentPage = ref(1)
    const selectedRows = ref([])

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      return sataliteStr.selectedSatelites.slice(start, start + pageSize.value)
    })

    const totalPages = computed(() => {
      return Math.ceil(sataliteStr.selectedSatelites.length / pageSize.value)
    })

    function removeSelected() {
      sataliteStr.selectedSatelites = sataliteStr.selectedSatelites.filter(
        item => !selectedRows.value.includes(item)
      )
      updateLocalStorage()
      selectedRows.value = []
    }

    function removeItem(item) {
      const index = sataliteStr.selectedSatelites.findIndex(s => s.noradCatId === item.noradCatId)
      if (index !== -1) sataliteStr.selectedSatelites.splice(index, 1)
      updateLocalStorage()
    }

    function updateLocalStorage() {
      localStorage.setItem('satalites', JSON.stringify(sataliteStr.selectedSatelites))
    }

    return {
      sataliteStr,
      paginatedData,
      pageSize,
      currentPage,
      selectedRows,
      totalPages,
      removeSelected,
      removeItem
    }
  }
})
</script>

<template>
  <div class="selected-assets">
    <div class="table-header">
      <el-button type="danger" size="small" @click="removeSelected" :disabled="!selectedRows.length">
        Remove Selected
      </el-button>
    </div>

    <el-table
      style="width: 100%"
      :data="paginatedData"
      @selection-change="val => selectedRows = val"
      :row-key="row => row.noradCatId"
    >
      <el-table-column type="selection" width="50" />

      <el-table-column prop="noradCatId" label="NORAD ID" />
      <el-table-column prop="name" label="Name" width="200" />
      <el-table-column prop="orbitCode" label="Orbit Code" />
      <el-table-column prop="countryCode" label="Country" />
      <el-table-column prop="launchDate" label="Launch Date" />
      
      <el-table-column label="Type" prop="objectType" />

      <el-table-column label="Action">
        <template #default="{ row }">
          <i class="fa-solid fa-trash-can" @click="removeItem(row)" title="remove"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper">
      <el-pagination
        layout="sizes, prev, pager, next"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="sataliteStr.selectedSatelites.length"
        @size-change="val => { pageSize = val; currentPage = 1 }"
        @current-change="val => currentPage = val"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.selected-assets {
  padding: 16px;
  width: 100%;

  .table-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 12px;
  }
  .pagination-info {
    font-size: 14px;
    color: #999;
  }
  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  i {
    cursor: pointer;
  }
}

</style>
