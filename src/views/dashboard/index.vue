<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Sistem Back End</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAccountState, } from '@/api/dashboard'

export default {
  name: 'Dashboard',
    data(){
      return{
        lenderId: sessionStorage.getItem('lenderId'),
      }
    },
  created() {
    this.getAccountState()
  },
  methods: {
    getAccountState() {
      let lenderId = {
        lenderId: this.lenderId
      };
      getAccountState(lenderId).then(response => {
        sessionStorage.setItem('state', response.data.state)
      })
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
