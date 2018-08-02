<template>
  <div class="inner-space">
    <div class="subspace">
      <div class="white card max-height">
        <div class="folder-header">
          <div class="header-title folder-name">{{folder.name}}</div>
        </div>
        <TaskForm></TaskForm>
        <div class="task-container">
          <TaskTree
            v-for="task in getTasks" :key="task.id" :model="task">
          </TaskTree>          
        </div>
      </div>
    </div>
    <div v-if="subRoute==='task'" class="subspace">
      <router-view></router-view>
    </div>
    <div v-if="!isTeam(folder) && subRoute==='folder'" class="subspace">
      <FolderDetail :folder="folder"></FolderDetail>
    </div>
  </div>
</template>

<script>
import { GetFolder, GetTasks, UpdateFolder } from '../constants/query.gql'
import TaskTree from '@/components/task/TaskTree'
import TaskForm from '@/components/task/TaskForm'
import FolderDetail from './FolderDetail.vue'

export default {
  components: {
    TaskTree,
    TaskForm,
    FolderDetail
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
  data() {
    return {
      subRoute: 'folder',
      folderName: '',
      folder: {
        shareWith: []
      },
      getTasks: []
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
        this.folderName = this.folder.name
        if (this.isTeam) {
          document.title = `${this.folder.name} - enamel`          
        }
      },
    },
    getTasks: {
      query: GetTasks,
      variables() {
        return { folder: this.folder.id }
      },
      skip() {
        return !this.folder.id
      },
      pollInterval: 10000,
      error(error) {
        console.error(error)
      }
    }
  },
  methods: {
    isTeam(folder) {
      return !folder.parent && folder.shareWith.length === 0
    },
    updateFolder(e) {
      const name = this.folderName
      if (name === this.folder.name) {
        this.cancel(e)
        return
      }
      this.$apollo.mutate({
        mutation: UpdateFolder,
        variables: { id: this.folder.id, input: {name} },
      }).then(() => {
        this.cancel(e)
      }).catch((error) => {
        console.log(error)
      })
    },
    cancel(e) {
      e.target.blur()
    }
  }
}
</script>

<style>
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
  margin: 0 5px;
  font-size: 12px;
}

.max-height {
  height: 100%;
}

.white.card {
  display: flex;
  flex-direction: column;
}

.task-container {
  flex-grow: 1;
  overflow: scroll;
}

</style>
