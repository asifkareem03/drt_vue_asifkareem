import { defineStore } from 'pinia'
import axios from 'axios'
import { ElLoading } from 'element-plus'

export const sataliteStore = defineStore('sataliteStore', {
  state: () => ({
    satellites: {'All Objects': []},
    tempSelectedSatellites: [],
    selectedSatelites: [],
    orbitCodes: [],
    selectedOrbitCodes: []
  }),
  actions: {
    async fetchSatalites() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Fetching Satalite Objects',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        attributes: 'name,noradCatId,orbitCode,objectType,countryCode,launchDate'
      }

      const url = "https://backend.digantara.dev/v1/satellites"

      if (Object.keys(this.satellites).length >= 4) {
        loading.close()
        console.log(Object.keys(this.satellites))
        return
      }

      axios.get(url, {params})
      .then((res) => {
        console.log('here')
        console.log(res.data.data.length)
        const allOrbitCodes = new Set()
        res.data.data.forEach((satellite) => {
          const orbitStr = satellite.orbitCode || ''
          const cleanedStr = orbitStr.replace(/[{}]/g, '')
          const orbitMatches = cleanedStr.split(',').map(s => s.trim())
          satellite.orbitCode = orbitMatches
          orbitMatches.forEach(code => allOrbitCodes.add(code))
          this.satellites['All Objects'].push(satellite)
          if (!this.satellites.hasOwnProperty(satellite.objectType)) {
            this.satellites[satellite.objectType] = []
          }
          this.satellites[satellite.objectType].push(satellite)
        })
        this.orbitCodes = Array.from(allOrbitCodes).sort()
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        loading.close()
        console.log(Object.keys(this.satellites))
      })
    },

    getSelectedSatalites() {
      const saved = localStorage.getItem('satalites')
      if (saved) {
        this.selectedSatelites = JSON.parse(saved)
      } else {
        this.selectedSatelites = []
      }

      console.log(this.selectedSatelites)
    },

    saveSelection(router) {
      this.selectedSatelites.push(...this.tempSelectedSatellites)
      this.tempSelectedSatellites = []
      localStorage.setItem('satalites', JSON.stringify(this.selectedSatelites))
      router.push('/selected')
    }
  }
})