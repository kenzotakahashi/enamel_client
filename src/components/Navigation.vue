<template>
  <div class="nav">
    <div class="nav-left">
      <div class="logo">enamel</div>
    </div>
    <div class="user-container">
      <avatar :obj="getUser" :size="32" class="nav-avatar"></avatar>
      <span class="name">
        {{getUser.name}}
        <i class="fas fa-angle-down"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from  'vuex'
import { GetTeam, GetUser } from '../constants/query.gql'

export default {
  computed: mapState(['activeWidget']),
  data() {
    return {
      modalConfig: {},
      getTeam: {},
      getUser: {}
    }
  },
  apollo: {
    getUser: {
      query: GetUser,
      variables: {},
      result({data}) {
      }
    },
    getTeam: {
      query: GetTeam,
    },
  }
}

</script>

<style scoped>
.nav {
  display: flex;
}

.nav-left {
  flex-grow: 1;
}

.nav > div {
  overflow: hidden;
  padding: 10px 10px;
  cursor: pointer;
}

.logo {
  font-size: 25px;
  font-family: 'Questrial', sans-serif;
  letter-spacing: 3px;
}

.name {
  display: flex;
  align-items: center;
}

.nav-avatar {
  margin-right: 6px;
}

.fa-angle-down {
  padding-left: 10px;
}
</style>
