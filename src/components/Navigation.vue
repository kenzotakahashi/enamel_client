<template>
  <div class="nav">
    <div class="nav-left">
      <div class="logo">enamel</div>
    </div>
    <div class="user-container">
      <Avatar :user="getUser" :size="32"></Avatar>
      <span class="name">
        {{getUser.name}}
        <i class="fas fa-angle-down"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from  'vuex'
import Avatar from '@/components/icons/Avatar'
import { GetTeam, GetUser } from '../constants/query.gql'

export default {
  components: {
    Avatar,
  },
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

.fa-angle-down {
  padding-left: 10px;
}
</style>
