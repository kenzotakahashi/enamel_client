<template>
  <div class="nav-right">
    <router-link :to="{name: 'notifications'}" class="notification">
      <i class="far fa-bell"></i>
    </router-link>

    <div class="dropdown" @click.stop="$store.dispatch('changeActiveWidget', 'account-menu')">
      <div class="user-container">
        <avatar :obj="getUser" :size="32" class="nav-avatar"></avatar>
      </div>
      <div class="dropdown-content" v-show="activeWidget === 'account-menu'">
        <div v-if="['Owner', 'Administrator'].includes(getUser.role) && route !== 'account'">
          <router-link :to="{name: 'account'}">Accounts</router-link></div>
        <div v-if="route !== 'workspace'">
          <router-link :to="{name: 'workspace'}">Workspace</router-link></div>
        <div>
          <a @click="logout" :href="`${url}login`">Logout</a>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from  'vuex'
import { GetTeam, GetUser, GetLogs } from '../constants/query.gql'

export default {
  computed: mapState(['activeWidget']),
  props: ['auth'],
  data() {
    return {
      url: process.env.BASE_URL,
      route: this.$route.name,
      modalConfig: {},
      getTeam: {},
      getUser: {},
      getLogs: []
    }
  },
  apollo: {
    getUser: {
      query: GetUser,
      variables: {},
    },
    getTeam: {
      query: GetTeam,
    },
    getLogs: {
      query: GetLogs,
      skip() {
        return !this.getUser.id
      },
      pollInterval: 10000, 
      result({data: {getLogs}}) {
        if (getLogs.length === 0) return
        if (!this.getUser.readNotificationsAt
          || moment(getLogs[0].createdAt).isAfter(moment(this.getUser.readNotificationsAt))) {
          this.$store.commit('setNotification', true)
          if (document.title[0] !== '*') {
            document.title = `* ${document.title}`            
          }
        }
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('user-id')
      localStorage.removeItem('user-token')
      this.$root.$data.userId = localStorage.getItem('user-id')
    }
  }
}

</script>

<style scoped lang="scss">
.nav-right {
  display: flex;
  align-items: center;
}

.notification {
  padding: 0 10px;
  margin: 0 10px;
  font-size: 20px;
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

.dropdown-content {
  position: fixed;
  top: 42px;
  right: 10px;
  > div {
    padding: 0;
    > a {
      padding: 5px 16px;
      width: 100%;
    }
  }
}

</style>
