<template>
  <el-row class="max-height">
    <el-col :span="12" class="max-height">
      <div class="white card max-height">
        <div class="folder-header">
          <div class="header-title">{{folder.name}}</div>
<!--           <div>
            <span class="menu-title">LIST</span>
            <span class="menu-title">BOARD</span>
            <span class="menu-title">TABLE</span>
            <span class="menu-title">GANTT CHART</span>
            <span class="menu-title">STREAM</span>
            <span class="menu-title">MORE</span>
          </div> -->
        </div>
        <TaskForm></TaskForm>
        <TaskTree
          v-for="task in getTasks" :key="task.id"
          :model="task">
        </TaskTree>
      </div>
    </el-col>
    <el-col v-if="subRoute==='task'" :span="12" class="max-height">
      <router-view></router-view>
    </el-col>
    <el-col v-if="!isTeam(folder) && subRoute==='folder'" :span="12" class="max-height">
      <FolderDetail :folder="folder"></FolderDetail>
    </el-col>
  </el-row>
</template>

<script>
import { GetFolder, GetTasks } from '../constants/query.gql'
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
  data() {
    return {
      subRoute: 'folder',
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
      result ({data: { getFolder }}) {
        this.folder = getFolder
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
      error(error) {
        console.error(error)
      }
    }
  },
  methods: {
    isTeam(folder) {
      return !folder.parent && folder.shareWith.length === 0
    }
  }
}
</script>

<style>
.folder-header {
  padding: 15px 24px 0;
  line-height: 21px;
  min-height: 40px;
}

.menu-title {
  margin: 0 5px;
  font-size: 12px;
}

.max-height {
  height: 100%;
}
</style>
