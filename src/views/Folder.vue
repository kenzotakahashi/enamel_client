<template>
  <div class="inner-space">
    <div class="subspace">
      <div class="white card max-height">
        <div class="folder-header">
          <div class="header-title folder-name">{{folder.name}}</div>
        </div>
        <TaskForm></TaskForm>
        <draggable class="task-container" v-model="getTasks" @change="reorder">
          <TaskTree
            v-for="task in getTasks" :key="task.id" :model="task">
          </TaskTree>
        </draggable>     
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
import moment from 'moment'
import { GetFolder, GetTasks, UpdateFolder, UpdateTask } from '../constants/query.gql'
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
    reorder({moved: {element, newIndex}}) {
      const folder = this.folder.id

      this.$apollo.mutate({
        mutation: UpdateTask,
        variables: {
          id: element.id,
          input: {
            order: newIndex === 0 ? moment().valueOf() : this.getTasks[newIndex-1].order - 1
          }
        },
        update(store, { data: { updateTask } }) {
          const data = store.readQuery({
            query: GetTasks,
            variables: { folder }
          })
          data.getTasks = data.getTasks.filter(o => o.id !== updateTask.id)
          data.getTasks.splice(newIndex, 0, updateTask)
          store.writeQuery({
            query: GetTasks,
            variables: { folder },
            data
          })
        }
      }).then(() => {
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
