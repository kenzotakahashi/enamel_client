<template>
  <div class="nav-right">
    <div v-if="route === 'workspace'">
      <router-link :to="{name: 'notifications'}" class="menu">
        <i class="far fa-bell"></i>
      </router-link>
      <router-link :to="{name: 'timelog', params: timelogParam()}" class="menu">
        <i class="far fa-clock"></i>
      </router-link>
    </div>

    <div class="dropdown" @click.stop="$store.dispatch('changeActiveWidget', 'account-menu')">
      <div class="user-container">
        <avatar :obj="getUser" :size="32" class="nav-avatar"></avatar>
      </div>
      <div class="dropdown-content" v-show="activeWidget === 'account-menu'">
        <div v-if="['Owner', 'Administrator'].includes(getUser.role) && route !== 'account'">
          <router-link :to="{name: 'account'}">Accounts</router-link>
        </div>
        <div v-if="route !== 'workspace'">
          <router-link :to="{name: 'workspace'}">Workspace</router-link>
        </div>
        <div>
          <router-link :to="{name: 'settings'}">Settings</router-link>
        </div>
        <div>
          <span @click="logout">Logout</span>
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
      route: this.$route.path[1] === 'w' ? 'workspace' : this.$route.name,
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
      this.$router.push({name: 'login'})
      this.$apollo.provider.clients.defaultClient.cache.reset()
    },
    timelogParam() {
      return {
        id: this.getUser.id,
        year: moment().year(),
        month: moment().month() + 1
      }
    }
  }
}

</script>

<style scoped lang="scss">
.nav-right {
  display: flex;
  align-items: center;
}

.menu {
  padding: 0 10px;
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

.dropdown {
  margin-left: 10px;
}

.dropdown-content {
  position: fixed;
  top: 42px;
  right: 10px;
  > div {
    padding: 0;
    > * {
      padding: 5px 16px;
      width: 100%;
    }
  }
}

</style>
