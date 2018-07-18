<template>
  <div class="white card max-height">
    <TaskHeader :task="task"></TaskHeader>
    <TaskStateBar :task="task" :subtasks="subtasks" :users="getUsers" :showSubtasks="showSubtasks"
      @toggleSubtaskView="showSubtasks = !showSubtasks">
    </TaskStateBar>

<!--     <el-row>
      <el-col :span="6">
        <el-button type="text" class="black-text-button ">Set Date</el-button>
      </el-col>
      <el-col :span="6">
        <el-button v-if="subtasks.length > 0" type="text">{{formatSubtaskCount(subtasks)}}</el-button>
        <el-button v-else type="text" class="black-text-button ">Add subtask</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="text" class="black-text-button ">{{task.shareWith.length}}</el-button>
      </el-col>
    </el-row> -->
    <div v-if="showSubtasks">
      <TaskTree v-for="model in subtasks" :key="model.id" :model="model">
      </TaskTree>
      <TaskForm :parentId="taskId" :open="true"></TaskForm>      
    </div>

    <DescriptionField :model="task" kind="task"></DescriptionField>
<!--     <Comments :comments="getComments"></Comments>
    <CommentBox :parent="task.id" class="stick-bottom"></CommentBox> -->
  </div>

</template>

<script>
import { mapState } from 'vuex'
import { GetTask, GetTasks, GetUsers, UpdateTask } from '../constants/query.gql'
import TaskHeader from '@/components/TaskHeader'
import TaskStateBar from '@/components/TaskStateBar'
import TaskTree from '@/components/TaskTree'
import TaskForm from '@/components/TaskForm'
import DescriptionField from '@/components/DescriptionField'
// import Comments from '@/components/Comments'
// import CommentBox from '@/components/CommentBox'

export default {
  components: {
    TaskHeader,
    TaskStateBar,
    TaskTree,
    TaskForm,
    DescriptionField,
    // Comments,
    // CommentBox
  },
  props: ['taskId'],
  data() {
    return {
      task: {
        parent: {},
        creator: {
          firstname: '',
          lastname: '',
        },
        folders: [],
        assignees: [],
        shareWith: []
      },
      showSubtasks: false,
      subtasks: [],
      comments: [],
      getUsers: [],
    }
  },
  computed: {
    ...mapState(['activeWidget'])
  },
  apollo: {
    getTask: {
      query: GetTask,
      variables() {
        return {id: this.taskId}
      },
      result({ data: { getTask } }) {
        this.task = getTask
      }
    },
    getTasks: {
      query: GetTasks,
      variables() {
        return { parent: this.task.id }
      },
      skip() {
        return !this.task.id
      },
      result({ data: {getTasks} }) {
        this.subtasks = getTasks
      },
    },
    getUsers: GetUsers
    // getComments: {
    //   query: GetComments,
    //   variables() {
    //     return { parent: this.task.id }
    //   },
    //   skip() {
    //     return !this.task.id
    //   },
    // },
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
