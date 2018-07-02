<template>
  <div class="container">
    <div class="columns">
      <div class="column col-6">
        <h3>{{folder.name}}</h3>
        <div>
          <span class="menu-title">LIST</span>
          <span class="menu-title">BOARD</span>
          <span class="menu-title">TABLE</span>
          <span class="menu-title">GANTT CHART</span>
          <span class="menu-title">STREAM</span>
          <span class="menu-title">MORE</span>
        </div>
        <div class="">
          <div class="btn">+ New Task</div>
        </div>
        <hr>
        <router-link v-for="task in folder.tasks" 
                     :to="{name: 'task', params: {taskId: task.id}}"
                     :key="task.id"
                     class="task-list-group">
          <span class="task-list-group">{{task.name}}</span>
        </router-link>
      </div>
      <div class="column col-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { GetFolder } from '../constants/query.gql'

export default {
  data() {
    return {
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
        this.folder = data.getFolder
      }
    },
  }
}
</script>

<style>
.menu-title {
  margin: 0 5px;
  font-size: 12px;
}
</style>