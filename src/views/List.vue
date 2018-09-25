<template>
  <div class="task-container">
  	<TaskForm></TaskForm>
  	<draggable v-model="getTasks" @change="reorder">
  	  <TaskTree
  	    v-for="task in filteredTasks" :key="task.id" :model="task" :isOpen="openState[task.id]">
  	  </TaskTree>
  	</draggable>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { GetTasks, SortTasks } from '../constants/query.gql'
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
    ...mapState(['openState', 'filterAll']),
    filteredTasks() {
      return this.filterAll.includes(this.id)
        ? this.getTasks
        : this.getTasks.filter(o => !['Completed', 'On Hold', 'Cancelled'].includes(o.status)) 
    }
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
    reorder() {
      const folder = this.id
      const today = moment().valueOf()
      this.$apollo.mutate({
        mutation: SortTasks,
        variables: {
          tasks: this.getTasks.map(o => o.id),
          orders: this.getTasks.map((o, i) => today - i),
          folder          
        },
        update(store, { data: { sortTasks } }) {
          const data = store.readQuery({
            query: GetTasks,
            variables: { folder }
          })
          data.getTasks = sortTasks
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
