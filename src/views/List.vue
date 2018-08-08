<template>
  <div class="task-container">
  	<TaskForm></TaskForm>
  	<draggable v-model="getTasks" @change="reorder">
  	  <TaskTree
  	    v-for="task in getTasks" :key="task.id" :model="task" :isOpen="openState[task.id]">
  	  </TaskTree>
  	</draggable>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { GetTasks, UpdateTask } from '../constants/query.gql'
import TaskTree from '@/components/task/TaskTree'
import TaskForm from '@/components/task/TaskForm'

export default {
  components: {
    TaskTree,
    TaskForm,
  },
  props: ['id'],
  data() {
    return {
      getTasks: []
    }
  },
  computed: {
    ...mapState(['openState'])
  },
  apollo: {
    getTasks: {
      query: GetTasks,
      variables() {
        return { folder: this.id }
      },
      pollInterval: 10000,
      error(error) {
        console.error(error)
      }
    }
  },
  methods: {
    reorder({moved: {element, newIndex}}) {
      const folder = this.id

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

<style scoped lang="scss">

.white.card {
  display: flex;
  flex-direction: column;
}

.task-container {
  overflow: scroll;
}

</style>
