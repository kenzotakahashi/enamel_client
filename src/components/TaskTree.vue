<template name="tree">
  <li>
    <el-row class="tree-item white">
      <el-col :span="19">
        <span v-if="isParent" @click="toggle" class="fold-button">[{{ open ? '-' : '+' }}]</span>
        <router-link :to="{name: 'task', params: {taskId: model.id}}">
          <span class="task">
            <div class="user-container">
              <Avatar :size="24" class="avatar"></Avatar>
              {{ model.name }}              
            </div>
          </span>
        </router-link>
      </el-col>
      <el-col :span="5">
        {{ model.status }}
      </el-col>
    </el-row>

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
