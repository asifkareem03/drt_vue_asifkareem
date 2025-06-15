  <script>
  import { defineComponent, computed, onMounted, ref } from 'vue'
  import { sataliteStore } from '@/stores/satalite'
  import { RecycleScroller } from 'vue-virtual-scroller'
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { debounce } from 'lodash'

  export default defineComponent({
    components: { RecycleScroller },
    setup() {

      const sataliteStr = sataliteStore()

      const radio1 = ref('All Objects')

      const searchWord = ref('')
      const searchTrigger = ref('')

      const handleSearchInput = debounce((e) => {
        const trimmed = searchWord.value.trim()

        if (trimmed === '') {
          searchTrigger.value = ''
          return
        }

        if (e.key === 'Enter') {
          searchTrigger.value = trimmed
        }
      }, 300)

      const select_all = ref(false)

      onMounted(async() => {
        await sataliteStr.fetchSatalites()
      })

      const sortedSatellites = computed(() => {
        const selectedIds = new Set(sataliteStr.selectedSatelites.map(s => s.noradCatId))
        const allItems = sataliteStr.satellites[radio1.value] || []

        const filteredByOrbit = allItems.filter(sat => {
          if (!sataliteStr.selectedOrbitCodes.length) return true
          if (!Array.isArray(sat.orbitCode)) return false
          return sat.orbitCode.some(code => sataliteStr.selectedOrbitCodes.includes(code))
        })

        const filteredBySearch = filteredByOrbit.filter(sat => {
          if (!searchTrigger.value) return true
          const word = searchTrigger.value.toLowerCase()
          return (
            sat.name?.toLowerCase().includes(word) ||
            String(sat.noradCatId).includes(word)
          )
        })

        return [
          ...filteredBySearch.filter(sat => selectedIds.has(sat.noradCatId)),
          ...filteredBySearch.filter(sat => !selectedIds.has(sat.noradCatId)),
        ]
      })

      function updateCheckbox(item) {
        const index = sataliteStr.tempSelectedSatellites.findIndex(s => s.noradCatId === item.noradCatId)
        if (index === -1) {
          if (sataliteStr.tempSelectedSatellites.length === 10) {
            ElMessage.error("Max 10 Selection Allowed")
          } else {
            sataliteStr.tempSelectedSatellites.push(item)
          }
        } else{
          sataliteStr.tempSelectedSatellites.splice(index, 1)
        }

        console.log(sataliteStr.tempSelectedSatellites)
      }

      return { 
        sataliteStr,
        radio1,
        searchWord,
        searchTrigger,
        Search,
        select_all,
        updateCheckbox,
        sortedSatellites,
        handleSearchInput
      }
    },
  })
  </script>

  <template>
    <div class="satalite-table-wrapper">
      <el-radio-group v-model="radio1">
        <el-radio-button
          v-for="(key, indx) in Object.keys(sataliteStr.satellites)"
          :index="indx"
          :key="key"
          :value="key"
        >
          {{ key }} ({{ sataliteStr.satellites[key].length }})
        </el-radio-button>
      </el-radio-group>
      <div class="count-wrapper">
        <div class="filter-wrapper">
        <el-input 
          v-model="searchWord" 
          class="search"
          clearable
          :suffix-icon="Search"
          placeholder="Search by Name/NORAD ID"
          @keydown="handleSearchInput"
        />

        <el-popover
          ref="filterPopover"
          placement="bottom"
          width="200"
          trigger="click"
          popper-class="filter-popover"
          :hide-after = "50"
        >
          <template #reference>
            <el-button class="filter-button">Orbit Code <i class="fa-solid fa-angle-down" style="margin-left: 8px"></i></el-button>
          </template>
          <el-checkbox-group v-model="sataliteStr.selectedOrbitCodes">
            <el-checkbox
              v-for="code in sataliteStr.orbitCodes"
              :key="code"
              :label="code"
              :value="code"
            />
          </el-checkbox-group>
        </el-popover>
      </div>
        <p>{{sortedSatellites.length}} objects</p>
      </div>
      <el-divider />
    <div class="table-wrapper">
        <table class="virtual-table">
          <thead>
            <tr>
              <th class="sl"></th>
              <th class="id">NORAD ID</th>
              <th class="name">Name</th>
              <th class="orbit_code">Orbit Code</th>
              <th class="country">Country</th>
              <th class="launch_date">Launch Date</th>
              <th class="object_type"></th>
            </tr>
          </thead>
        </table>

        <RecycleScroller
          class="virtual-scroller"
          :items="sortedSatellites"
          :item-size="40"
          key-field="noradCatId"
        >
          <template #default="{ item }">
            <table class="virtual-table">
              <tbody>
                <tr :class="{
                    'row-temp-selected': sataliteStr.tempSelectedSatellites.some(s => s.noradCatId === item.noradCatId),
                    'row-final-selected': sataliteStr.selectedSatelites.some(s => s.noradCatId === item.noradCatId)
                  }">
                  <td class="sl">
                    <el-checkbox  
                      @change="() => updateCheckbox(item)"
                      :model-value="sataliteStr.selectedSatelites.some(s => s.noradCatId === item.noradCatId) || sataliteStr.tempSelectedSatellites.some(s => s.noradCatId === item.noradCatId)"
                      :disabled="sataliteStr.selectedSatelites.some(s => s.noradCatId === item.noradCatId)"
                    />
                  </td>
                  <td class="id">{{ item.noradCatId }}</td>
                  <td class="name">{{ item.name }}</td>
                  <td class="orbit_code">{{ item.orbitCode?.join(', ') }}</td>
                  <td class="country">{{ item.countryCode }}</td>
                  <td class="launch_date">{{ item.launchDate }}</td>
                  <td class="object_type">
                    <i v-if="item.objectType === 'PAYLOAD'" class="fa-solid fa-circle" style="color: #35B1F2;" />
                    <i v-else-if="item.objectType === 'DEBRIS'" class="fa-solid fa-circle-radiation" />
                    <i class="fa-brands fa-space-awesome" v-else-if="item.objectType === 'ROCKET BODY'"></i>
                    <i class="fa-solid fa-caret-up" v-else></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </RecycleScroller>
      </div>
    </div>
  </template>

  <style scoped lang="scss">
  .satalite-table-wrapper {
    .filter-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      .search {
        width: 250px;
      }
    }

    .count-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 16px;

      p {
        font-size: 14px;
      }
    }

    .table-wrapper {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #1a1a1a;
      font-size: 14px;

      .virtual-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;

        th, td {
          padding: 12px 8px;
          text-align: left;
          border-bottom: 1px solid #2d2d2d;

          &.sl {
            width: 40px;
          }

          &.id {
            width: 100px;
          }

          &.name {
            width: 200px;
          }

          &.orbit_code {
            width: 150px;
          }

          &.country {
            width: 120px;
          }

          &.launch_date {
            width: 180px;
          }

          &.object_type {
            i {
              font-size: 10px;
            }
          }
        }

        th {
          background-color: transparent;
          position: sticky;
          top: 0;
          z-index: 2;
        }
      }

      .virtual-scroller {
        max-height: 450px;
        overflow-y: auto;
        scrollbar-width: thin;
        scroll-behavior: smooth;
        scrollbar-color: #35B1F2 #2a2a2a;

        table {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
        }

        tr {
          display: table;
          width: 100%;
          table-layout: fixed;
          background-color: black;

          &.row-temp-selected {
            background-color: #2a2a2a;
          }

          &.row-final-selected {
            background-color: #1a1a1a;;
          }
        }
      }
    }
  }
  </style>