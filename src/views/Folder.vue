<template>
  <div class="inner-space">
    <div class="max-height" v-bind:style="{width: subRoute === 'workload' ? '100%' : '50%'}">
      <div class="white card max-height">
        <div class="folder-header">
          <div class="header-title folder-name">{{folder.name}}</div>
          <div class="folder-sub-header">
            <div class="menu-titles">
              <span class="menu-title" v-bind:class="{active: view === 'list'}"
                @click="$router.push({name: 'folder', params: {id}})">
                List
              </span>
              <span class="menu-title" v-bind:class="{active: view === 'workload'}"
                @click="$router.push({name: 'workload', params: {id}})">
                Workload
              </span>
            </div>
            <div class="filter">
              <span @click="changeFilter">
                <i class="fas fa-filter"></i>
                <span class="text">{{filterText}}</span>
              </span>
            </div>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
    <div v-if="subRoute==='task'" class="subspace">
      <Task :taskId="$route.params.taskId"></Task>
    </div>
    <div v-if="!isTeam(folder) && subRoute==='folder'" class="subspace">
      <FolderDetail :folder="folder"></FolderDetail>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { GetFolder } from '../constants/query.gql'
import Task from './Task.vue'
import FolderDetail from './FolderDetail.vue'

export default {
  components: {
    Task,
    FolderDetail
  },
  props: ['id'],
  data() {
    const path = this.$route.fullPath.split('/')
    return {
      view: path.includes('list') ? 'list' : 'workload',
      subRoute: 'folder',
      folder: {
        shareWith: []
      },
    }
  },
  computed: {
    ...mapState(['filterAll']),
    filterText() {
      return this.filterAll.includes(this.id) ? 'All' : 'All active'
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.subRoute = to.name
    next()
  },
  mounted() {
    if (this.$route.params.taskId) {
      this.subRoute = 'task'
    } else if (this.$route.name === 'workload') {
      this.subRoute = 'workload'
    }
  },
  apollo: {
    getFolder: {
      query: GetFolder,
      variables() {
        return {id: this.id}
      },
      pollInterval: 90000,
      result ({data: { getFolder }}) {
        this.folder = getFolder
        if (this.isTeam) {
          document.title = `${this.$store.state.notification ? '*' : ''} ${this.folder.name} - enamel`          
        }
      },
    }
  },
  methods: {
    isTeam(folder) {
      return !folder.parent && folder.shareWith.length === 0
    },
    changeFilter() {
      if (this.filterAll.includes(this.id)) {
        this.$store.commit('removeFromFilter', this.id)
      } else {
        this.$store.commit('addToFilter', this.id)
      }
    }
  }
}
</script>

<style lang="scss">
.inner-space {
  display: flex;
  height: 100%;
}

.subspace {
  width: 50%;
  height: 100%;
}

.folder-header {
  padding: 15px 24px 0;
  line-height: 21px;
}

.folder-sub-header {
  display: flex;
  .menu-titles {
    flex: 1 1;
  }
  .filter {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.56);
    cursor: pointer;
    &:hover {
      color: $blue-hover;
    }
    .text {
      margin-left: 8px;
    }
  }
}

.folder-name {
  padding: 0;
  margin: 5px 0;
  height: 32px;
  width: 100%;
}

.menu-title {
  height: 25px;
  box-sizing: border-box;
  display: inline-block;
  margin: 0 5px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    color: $blue-hover;
  }
  &.active {
    border-bottom: 2px solid $blue-hover;
  }
}

.max-height {
  height: 100%;
}

.white.card {
  display: flex;
  flex-direction: column;
}

</style>
