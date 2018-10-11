<template>
  <div class="task-view-header">
    <div class="task-header-wrap">
      <div class="task-header">
        <router-link :to="{name: 'task', params: {id: task.folders[0].id, taskId: task.id}}"
          v-if="task.folders.length" class="folder-belonged">
          {{task.folders[0].name}}
        </router-link>
        <!-- <div v-if="task.folders.length" class="folder-belonged">{{task.folders[0].name}}</div> -->
        <div>
          <form @submit.prevent="updateTask">
            <input class="no-outline header-title task-name" type="text" name="taskname" ref="taskname"
              v-model="taskName" @keyup.esc="cancel" @blur="updateTask">
            </input>
          </form>
        </div>

      </div>
      <div>
  <!--       <span class="icon">
          <i class="far fa-star"></i>
        </span>
        <span class="icon">
          <i class="fas fa-thumbtack"></i>
        </span>
        <span class="icon">
          <i class="fas fa-link"></i>
        </span> -->
        <span class="icon dropdown" @click.stop="$store.dispatch('changeActiveWidget', 'task-menu')">
          <i class="fas fa-ellipsis-h"></i>
          <div class="dropdown-content right" v-show="activeWidget === 'task-menu'">
            <div @click="$store.commit('changeMode', {type: 'task', item: task})">Move</div>
            <!-- <div>Duplicate task</div> -->
            <!-- <div>Request status update</div> -->
            <!-- <div>Print</div> -->
            <!-- <hr></hr> -->
            <!-- <div>Enter full screeen</div> -->
            <!-- <div>Open task in separate tab</div> -->
            <!-- <hr></hr> -->
            <div @click="deleteTask">Delete</div>
            <!-- <hr></hr> -->
            <!-- <div>Close panel</div> -->
          </div>
        </span>
      </div>
    </div>

    <div class="tag-view">
      <div class="folder-tag-group">
<!--         <span v-for="folder in task.folders">
          <span class="folder-tag">{{ folder.name }}</span>
        </span> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { UpdateTask, DeleteTask, GetTasks } from '@/constants/query.gql'

export default {
  props: ['task'],
  computed: mapState(['activeWidget']),
  data() {
    return {
      taskName: this.task.name
    }
  },
  watch: {
    task() {
      this.taskName = this.task.name
    }
  },
  methods: {
    updateTask(e) {
      const name = this.taskName
      if (name === this.task.name) {
        this.cancel(e)
        return
      }
      this.$apollo.mutate({
        mutation: UpdateTask,
        variables: { id: this.task.id, input: {name} },
      }).then(() => {
        this.cancel(e)
      }).catch((error) => {
        console.log(error)
      })
    },
    deleteTask() {
      const id = this.task.id
      const folderId = this.$route.params.id

      this.$apollo.mutate({
        mutation: DeleteTask,
        variables: {id},
        update: (store, data) => {
          const parent = this.task.parent ? this.task.parent.id : undefined
          const folders = parent ? [undefined] : this.task.folders.map(o => o.id)
          for (const folder of folders) {
            const variables = {folder, parent}
            const query = GetTasks
            try {
              const data = store.readQuery({ query, variables })
              data.getTasks.splice(data.getTasks.findIndex(o => o.id === id), 1)
              store.writeQuery({ query, variables, data })
            } catch(err) {
              console.log(err)
            }
          }
        }
      }).then(() => {
        this.$router.replace({
          name: "folder",
          params: {id: folderId},
        })
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
.task-view-header {
  box-sizing: border-box;
  padding: 12px 12px 12px 24px;
}

.task-header-wrap {
  display: flex;
}

.task-header {
  flex-grow: 1;
}

.task-name {
  padding: 0;
  margin: 5px 0;
  height: 32px;
}

.tag-view {
  display: flex;
}

.folder-tag-group {
  flex-grow: 1
}

.folder-tag {
  cursor: pointer;
  opacity: .5;
  font-size: 12px;
  border-radius: 2px;
  color: #555;
  padding: 0 6px;
  border: 1px solid;
  border-color: #e0e0e0;
  margin-right: 9px;
  margin-bottom: 3px;
}

.folder-tag:hover {
  opacity: .75;
}

.folder-belonged {
  font-size: 12px;
  color: rgba(0,0,0,.56);
}
.Dark .folder-belonged {
  color: $dark-text;
}

.icon {
  padding: 0 7px;
  cursor: pointer;
}
.icon:hover {
  color: #48f;
}
</style>
