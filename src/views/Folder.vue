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
        <TaskForm></TaskForm>
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
import { GetFolder } from '../constants/query.gql'
import TaskTree from '@/components/TaskTree'
import TaskForm from '@/components/TaskForm'
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
  async updated() {
    if (this.$route.query.refetch) {
      const data = await this.$apollo.queries.getFolder.refetch()
    }
  },
  data() {
    return {
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
      result ({data}) {
        // console.log(data.getFolder)
        this.folder = data.getFolder
      },
    },
  },
}
</script>

<style>
.menu-title {
  margin: 0 5px;
  font-size: 12px;
}
</style>