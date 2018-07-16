<template>
  <div class="white card max-height">
    <TaskHeader :task="task"></TaskHeader>
    <el-row class="task-statebar">
      <el-col :span="4">
        <span>{{task.status}}</span>
      </el-col>
      <el-col :span="10">
        <span v-if="task.assignees.length > 0">TODO: Assignees</span>
        <span v-else>+ Add assignee</span>
      </el-col>
      <el-col :span="10">
        <span class="small-text">by {{task.creator.firstname}} {{task.creator.lastname[0]}} at {{formatDate(task.createdAt)}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-button type="text" class="black-text-button ">Set Date</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="text" class="black-text-button ">0.00</el-button>
      </el-col>
      <el-col :span="6">
        <el-button v-if="subtasks.length > 0" type="text">{{formatSubtaskCount(subtasks)}}</el-button>
        <el-button v-else type="text" class="black-text-button ">Add subtask</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="text" class="black-text-button ">{{task.shareWith.length}}</el-button>
      </el-col>
    </el-row>
    <TaskTree
      v-for="model in subtasks" :key="model.id" :model="model">
    </TaskTree>
    <TaskForm :parentId="taskId"></TaskForm>
    <div class="description-field">
      <span class="description-text">Click to add the description</span>
    </div>
    <Comments :comments="getComments"></Comments>
    <CommentBox :parent="task.id" class="stick-bottom"></CommentBox>
  </div>

</template>

<script>
import { GetTask, GetTasks, GetComments } from '../constants/query.gql'
import { formatDate } from '@/helpers/helpers'
import TaskHeader from '@/components/TaskHeader'
import TaskTree from '@/components/TaskTree'
import TaskForm from '@/components/TaskForm'
import Comments from '@/components/Comments'
import CommentBox from '@/components/CommentBox'

export default {
  components: {
    TaskHeader,
    TaskTree,
    TaskForm,
    Comments,
    CommentBox
  },
  props: ['taskId'],
  data() {
    return {
      formatDate,
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
      subtasks: [],
      comments: []
    }
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
    getComments: {
      query: GetComments,
      variables() {
        return { parent: this.task.id }
      },
      skip() {
        return !this.task.id
      },
    }
  },
  methods: {
    formatSubtaskCount(subtasks) {
      const count = subtasks.length
      return `${count} subtask${count > 1 ? 's' : ''}`
    },
  }
}
</script>

<style scoped>
</style>
