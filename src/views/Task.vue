<template>
  <div class="white card max-height">
    <TaskHeader :task="task"></TaskHeader>
    <div class="task-statebar">
      <div class="task-status dropdown" v-bind:style="{borderColor: backgroundStrongColorMap[task.status]}"
        @click.stop="$store.dispatch('changeActiveWidget', 'task-status-menu')">
        <div class="task-status-view" v-bind:style="{
          backgroundColor: backgroundColorMap[task.status],
          borderColor: borderColorMap[task.status]
        }">
          <span class="task-status-label">{{task.status}}</span>
          <span class="arrow-wrap"></span>
        </div>
        <div class="dropdown-content left" v-show="activeWidget === 'task-status-menu'">
          <div v-for="status in statusList" :key="status" @click="changeTaskStatus(status)"
            v-bind:class="{'active-status': task.status === status }">
            <span class="status-icon" v-bind:style="{
              backgroundColor: backgroundStrongColorMap[status]
            }"></span>
            <span>{{status}}</span>            
          </div>

        </div>
      </div>
      <div>
        <span v-if="task.assignees.length > 0">TODO: Assignees</span>
        <span v-else>+ Add assignee</span>
      </div>
      <div>
        <span class="small-text">
          by {{task.creator.firstname}} {{task.creator.lastname[0]}} at {{formatDate(task.createdAt)}}
        </span>        
      </div>
    </div>
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
import { mapState } from 'vuex'
import { GetTask, GetTasks, GetComments, UpdateTask } from '../constants/query.gql'
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
      comments: [],
      statusList: ['New', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
      backgroundStrongColorMap: {
        New: 'rgb(25, 118, 210)',
        'In Progress': '#0097a7',
        Completed: '#689f38',
        'On Hold': '#616161',
        Cancelled: '#616161',
      },
      backgroundColorMap: {
        New: 'rgb(227, 242, 253)',
        'In Progress': '#e0f7fa',
        Completed: '#f1f8e9',
        'On Hold': '#fafafa',
        Cancelled: '#fafafa',
      },
      borderColorMap: {
        New: 'rgb(211, 228, 242)',
        'In Progress': '#ceeaee',
        Completed: '#e3ebd9',
        'On Hold': '#e5e5e5',
        Cancelled: '#e5e5e5',
      },
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
    changeTaskStatus(status) {
      if (this.task.status === status) return
      console.log('called')
      this.$apollo.mutate({
        mutation: UpdateTask,
        variables: {
          id: this.task.id,
          input: {status}
        },
      }).then(() => {
        this.$store.dispatch('changeActiveWidget', null)
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.task-statebar {  
  display: flex;
  min-width: 400px;
  height: 48px;
  position: relative;
  padding-right: 8px;
  border-top: solid 1px;
  border-bottom: solid 1px;
  border-color: rgba(0,0,0,.16);
}

.task-status {
  flex-shrink: 0;
  margin-top: -1px;
  margin-bottom: -1px;
  border-left: 9px solid;
  /*border-color: rgb(25, 118, 210);*/
}

.task-status-view {
  cursor: pointer;
  padding: 14px 11px 14px 20px;
  border-radius: none;
  border-image: initial;
  box-sizing: content-box;
  height: 20px;
  border-style: solid;
  border-width: 1px;
  border-left: none;
}

.arrow-wrap {
  border-color: #000 transparent transparent;
  border-style: solid;
  border-width: 4px 3px 0;
  float: right;
  margin-left: 6px;
  margin-top: 10px;

  border-top-color: rgb(33, 33, 33);
}

.dropdown-content > div {
  font-size: 13px;
  padding: 7px 32px 6px 24px;
}

.task-status-label {
  font-size: 13px;
  color: #111;
  font-weight: 600;
}

.status-icon {
  box-sizing: content-box;
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1px solid #fff!important;
  border-radius: 2px;
  margin-right: 11px;
  align-self: center;
}

.active-status, .active-status:hover {
  color: #fff;
  background-color: #48f;
  cursor: default;
}

</style>
