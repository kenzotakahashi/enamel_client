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
        v-for="task in getTasks"
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
      getTasks: []
    }
  },
  computed: {
    isParent: function () {
      return this.getTasks.length > 0
    }
  },
  apollo: {
    getTasks: {
      query: GetTasks,
      variables() {
        return { parent: this.model.id }
      },
      // skip() {
      //   return !this.open
      // },
      error(error) {
        console.error(error)
      }
    }
  },
  methods: {
    toggle: function () {
      if (this.isParent) {
        this.open = !this.open
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