<template name="tree">
  <li>
    <div class="tree-item">
      <span v-if="isParent" @click="toggle" class="fold-button inverse">
        <i :class="`fas fa-angle-${open ? 'down' : 'right'}`"></i>
      </span>
      <div class="tree-plate">
        <router-link :to="{name: 'task', params: {taskId: model.id}}">
          <span class="task">
            <div class="user-container">
              <Avatar :size="24" class="avatar"></Avatar>
              {{ model.name }}              
            </div>
          </span>
        </router-link>
        <!-- <span>{{ model.status }}</span> -->
      </div>
    </div>

    <ul class="tree" v-show="open" v-if="isParent">
      <tree
        class=""
        v-for="task in getTasks"
        :key="task.id"
        :model="task">
      </tree>
    </ul>
  </li>
</template>

<script>
import TaskTree from './TaskTree'
import Avatar from './icons/Avatar'
import { GetTasks } from '../constants/query.gql'

export default {
  name: 'tree',
  components: {
    'tree': TaskTree,
    Avatar
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

<style scoped>
.avatar {
  margin-right: 8px;
}
</style>
