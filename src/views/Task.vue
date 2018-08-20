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
    
      <Comments :id="task.id" :comments="getComments"></Comments>
    </div>

    <CommentBox :parent="task.id" class="stick-bottom" @scrollComment="scrollComment"></CommentBox>

    <Record v-if="activeWidget === 'record-form'" :task="task" :record="getRecord"></Record>
    <DateRangePicker v-if="activeWidget === 'daterange'" :task="task"></DateRangePicker>
  </div>

</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { GetTask, GetTasks, GetUsers, GetRecord, UpdateTask,
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
    reorder({moved: {element, newIndex}}) {
      const parent = this.task.id

      this.$apollo.mutate({
        mutation: UpdateTask,
        variables: {
          id: element.id,
          input: {
            order: newIndex === this.getTasks.length - 1
              ? moment().valueOf() : this.getTasks[newIndex+1].order - 1
          }
        },
        update(store, { data: { updateTask } }) {
          const data = store.readQuery({
            query: GetTasks,
            variables: { parent }
          })
          data.getTasks = data.getTasks.filter(o => o.id !== updateTask.id)
          data.getTasks.splice(newIndex, 0, updateTask)
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
