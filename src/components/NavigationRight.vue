<template>
  <div class="dropdown" @click.stop="$store.dispatch('changeActiveWidget', 'account-menu')">
    <div class="user-container">
      <avatar :obj="getUser" :size="32" class="nav-avatar"></avatar>
      <span class="name">
        {{getUser.name}}
        <i class="fas fa-angle-down"></i>
      </span>
    </div>
    <div class="dropdown-content" v-show="activeWidget === 'account-menu'">
      <div v-if="route !== 'account'"><router-link :to="{name: 'account'}">Accounts</router-link></div>
      <div v-if="route !== 'workspace'"><router-link :to="{name: 'workspace'}">Workspace</router-link></div>
      <div @click="logout">Logout</div>
    </div>
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
      route: this.$route.name,
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
  },
  methods: {
    logout() {
      localStorage.setItem('user-id', null)
      localStorage.setItem('user-token', null)
      this.$root.$data.userId = localStorage.getItem('user-id')
      this.$router.push({name: 'login'})
    }
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

.dropdown-content {
  position: fixed;
  top: 42px;
  right: 10px;
}
</style>
