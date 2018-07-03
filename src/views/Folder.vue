<template>
  <div class="container">
    <div class="columns">
      <div class="white column col-6">
        <h3>{{folder.name}}</h3>
        <div>
          <span class="menu-title">LIST</span>
          <span class="menu-title">BOARD</span>
          <span class="menu-title">TABLE</span>
          <span class="menu-title">GANTT CHART</span>
          <span class="menu-title">STREAM</span>
          <span class="menu-title">MORE</span>
        </div>
        <div>
          <div v-show="isFormOpen">
            <input @focusout="closeForm" @keyup.enter="createTask" @keyup.esc="closeForm"
              class="task-form" ref="taskform" type="text" name="task"
              v-model="newTaskName" placeholder="Enter title for new task"></input>
          </div>
          <div v-show="!isFormOpen" @click="openForm" class="btn btn-sm">+ New task</div>
        </div>
        <hr>
        <TaskTree
          v-for="task in folder.tasks" :key="task.id" class="item task-list-group"
          :model="task">
        </TaskTree>
      </div>
      <div v-if="subRoute==='task'" class="column col-6">
        <router-view></router-view>
      </div>
      <div v-if="subRoute==='folder'" class="column col-6">
        <FolderDetail :folder="folder"></FolderDetail>
      </div>
    </div>
  </div>
</template>

<script>
import { GetFolder, CreateTask } from '../constants/query.gql'
import TaskTree from '@/components/TaskTree'
import FolderDetail from './FolderDetail.vue'

export default {
  components: {
    TaskTree,
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
      isFormOpen: false,
      newTaskName: '',
      subRoute: 'folder',
      folder: {}
    }
  },
  apollo: {
    getFolder: {
      query: GetFolder,
      variables() {
        return {id: this.$route.params.id}
      },
      result({ data }) {
        // console.log(data.getFolder)
        this.folder = data.getFolder
      }
    },
  },
  methods: {
    openForm() {
      this.isFormOpen = true
      this.$nextTick(() => this.$refs.taskform.focus())
    },
    closeForm() {
      this.isFormOpen = false
    },
    async createTask() {
      if (!this.newTaskName) return
      const id = this.$route.params.id
      this.$apollo.mutate({
        mutation: CreateTask,
        variables: {
          folder: id,
          parent: null,
          name: this.newTaskName
        },
        update: (store, { data: { createTask } }) => {
          try {
            const data = store.readQuery({
              query: GetFolder,
              variables: {id}
            })
            data.getFolder.tasks.unshift(createTask)
            store.writeQuery({
              query: GetFolder,
              variables: {id},
              data
            })
          } catch(err) {
          }
        }
      }).then(({ data: { createTask } }) => {
        this.newTaskName = ''
      }).catch((error) => {
        console.log(error)
      })
    }


  }
}
</script>

<style>
.menu-title {
  margin: 0 5px;
  font-size: 12px;
}
</style>