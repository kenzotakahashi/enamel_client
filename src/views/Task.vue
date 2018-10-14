<template>
  <div class="white card max-height">
    <TaskHeader :task="task"></TaskHeader>
    <div id="scroll">
      <TaskStateBar :task="task" :users="getUsers"></TaskStateBar>
      <TaskSettingBar :task="task" :subtasks="subtasks" :showSubtasks="showSubtasks"
        :record="getRecord"
        @toggleSubtaskView="toggleSubtaskView"></TaskSettingBar>

      <div v-if="showSubtasks">
        <draggable v-model="subtasks" @change="reorder">
          <TaskTree v-for="model in subtasks" :key="model.id" :model="model"
            :isOpen="openState[task.id]">
          </TaskTree>
        </draggable>
        <TaskForm :parentId="taskId" :open="openForm"></TaskForm>
      </div>

      <DescriptionField :model="task" kind="task"></DescriptionField>
    
      <Comments :id="task.id" :comments="getComments" :isModal="isModal"></Comments>
    </div>

    <CommentBox :parent="task.id" class="stick-bottom" @scrollComment="scrollComment"></CommentBox>

    <Record v-if="activeWidget === 'record-form'" :task="task" :record="getRecord"
      v-bind:style="{'top': '155px', 'left': '22px'}"></Record>
    <DateRangePicker v-if="activeWidget === 'daterange'" :task="task"></DateRangePicker>
  </div>

</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { GetTask, GetTasks, GetUsers, GetRecord, SortTasks,
  GetComments } from '../constants/query.gql'
import TaskHeader from '@/components/task/TaskHeader'
import TaskStateBar from '@/components/task/TaskStateBar'
import TaskSettingBar from '@/components/task/TaskSettingBar'
import TaskTree from '@/components/task/TaskTree'
import TaskForm from '@/components/task/TaskForm'
import DescriptionField from '@/components/DescriptionField'
import DateRangePicker from '@/components/DateRangePicker'
import Record from '@/components/Record'
import Comments from '@/components/Comments'
import CommentBox from '@/components/CommentBox'

export default {
  components: {
    TaskHeader,
    TaskStateBar,
    TaskSettingBar,
    TaskTree,
    TaskForm,
    DescriptionField,
    DateRangePicker,
    Record,
    Comments,
    CommentBox
  },
  props: ['taskId', 'isModal'],
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
      openForm: false,
      subtasks: [],
      comments: [],
      getRecord: {},
      getUsers: [],
    }
  },
  computed: {
    ...mapState(['activeWidget','openState','notification'])
  },
  apollo: {
    getTask: {
      query: GetTask,
      variables() {
        return {id: this.taskId}
      },
      pollInterval: 10000,
      result({ data: { getTask } }) {
        this.task = getTask
        document.title = `${this.$store.state.notification ? '*' : ''} ${getTask.name} - enamel`
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
      pollInterval: 10000,
      result({ data: {getTasks} }) {
        this.subtasks = getTasks
        if (getTasks.length) {
          this.showSubtasks = true          
        }
      },
    },
    getRecord: {
      query: GetRecord,
      variables() {
        return {
          task: this.task.id,
          date: moment().format('YYYY-MM-DD')
        }
      },
      error(err) {
        console.log(err)
      }
    },
    getUsers: GetUsers,
    getComments: {
      query: GetComments,
      variables() {
        return { target: this.task.id }
      },
      pollInterval: 10000,
      skip() {
        return !this.task.id
      },
    },
  },
  methods: {
    toggleSubtaskView() {
      this.openForm = !this.showSubtasks
      this.showSubtasks = !this.showSubtasks
    },
    scrollComment() {
      const container = this.$el.querySelector("#scroll")
      container.scrollTop = container.scrollHeight
    },
    reorder() {
      const parent = this.task.id
      const today = moment().valueOf() - this.subtasks.length
      this.$apollo.mutate({
        mutation: SortTasks,
        variables: {
          tasks: this.subtasks.map(o => o.id),
          orders: this.subtasks.map((o, i) => today + i),
          parent          
        },
        update(store, { data: { sortTasks } }) {
          const data = store.readQuery({
            query: GetTasks,
            variables: { parent }
          })
          data.getTasks = sortTasks
          store.writeQuery({
            query: GetTasks,
            variables: { parent },
            data
          })
        }
      }).then(() => {
      }).catch((error) => {
        console.log(error)
      })
    },
  }
}
</script>

<style scoped lang="scss">

.card {
  position: relative;
}

#scroll {
  flex-grow: 1;
  overflow: scroll;
}
</style>
