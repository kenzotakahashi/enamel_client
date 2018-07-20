<template>
  <div class="user-container">
    <avatar :obj="getUser" :size="32" class="nav-avatar"></avatar>
    <span class="name">
      {{getUser.name}}
      <i class="fas fa-angle-down"></i>
    </span>
  </div>
</template>

<script>
import { mapState } from  'vuex'
import { GetTeam, GetUser } from '../constants/query.gql'

export default {
  computed: mapState(['activeWidget']),
  props: ['auth'],
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
