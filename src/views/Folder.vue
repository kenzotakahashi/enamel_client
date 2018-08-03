<template>
  <div class="inner-space">
    <div class="subspace">
      <div class="white card max-height">
        <div class="folder-header">
          <div class="header-title folder-name">{{folder.name}}</div>
          <div>
            <span class="menu-title">
              List
            </span>
            <span class="menu-title">
              Workload
            </span>
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
import { GetFolder } from '../constants/query.gql'
import Task from './Task.vue'
import FolderDetail from './FolderDetail.vue'

export default {
  components: {
    Task,
    FolderDetail
  },
  data() {
    return {
      subRoute: 'folder',
      folder: {
        shareWith: []
      },
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.subRoute = to.name
    next()
  },
  mounted() {
    if (this.$route.params.taskId) {
      this.subRoute = 'task'
    }
  },
  apollo: {
    getFolder: {
      query: GetFolder,
      variables() {
        return {id: this.$route.params.id}
      },
      pollInterval: 90000,
      result ({data: { getFolder }}) {
        this.folder = getFolder
        if (this.isTeam) {
          document.title = `${this.folder.name} - enamel`          
        }
      },
    }
  },
  methods: {
    isTeam(folder) {
      return !folder.parent && folder.shareWith.length === 0
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
  min-height: 40px;
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
