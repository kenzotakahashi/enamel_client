<template name="tree">
  <li>
    <div class="columns">
      <span v-if="isParent" @click="toggle" class="fold-button">[{{ open ? '-' : '+' }}]</span>
      <router-link :to="{name: 'task', params: {taskId: model.id}}" class="column col-9">      
        <span class="folder">{{ model.name }}</span>
      </router-link>
      <span class="column col-3">
        {{ model.status }}
      </span>
    </div>
    <ul v-show="open" v-if="isParent">
      <tree
        class="item"
        v-for="task in subtasks"
        :key="task.id"
        :model="task">
      </tree>
    </ul>
  </li>
</template>

<script>
import TaskTree from './TaskTree'
import { GetTasks } from '../constants/query.gql'

export default {
  name: 'tree',
  components: {
    'tree': TaskTree
  },
  props: {
    model: Object
  },
  mounted() {
  },
  data: function () {
    return {
      open: false,
      subtasks: []
    }
  },
  computed: {
    isParent: function () {
      return this.model.subtasks && this.model.subtasks.length
    }
  },
  methods: {
    toggle: function () {
      if (this.isParent) {
        this.open = !this.open
      }
      if (this.open) {
        this.$apollo.addSmartQuery('getTasks', {
          query: GetTasks,
          variables: {ids: this.model.subtasks},
          result({data}) {
            // console.log(data.getTasks)
            this.subtasks = data.getTasks
          },
          error(error) {
            console.error(error)
          },
        })
      }
    }
  }
};
</script>

<style>
ul {
  padding-left: 1em;
  line-height: 1.5em;
}

.folder {
  position: relative;
  left: 30px;
}

.fold-button {
  position: absolute;
}
</style>