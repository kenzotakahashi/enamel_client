<template name="tree">
  <li>
    <div class="tree-item">
      <span @click="toggle" class="task-fold-button"
        v-bind:style="{visibility: isParent ? 'visible' : 'hidden'}">
        <i :class="`fas fa-angle-${open ? 'down' : 'right'}`"></i>
      </span>

<!--       <div class="task-info-container">
        <router-link :to="{name: 'task', params: {taskId: model.id}}">
          <span class="task">
            <div class="user-container">
              <Avatar :size="24" class="task-avatar"></Avatar>
              <span class="task-title">{{ model.name }}</span>              
            </div>
          </span>
        </router-link>
        <span class="task-status" v-bind:style="statusColor">{{ model.status }}</span>
      </div> -->
      <router-link :to="{name: 'task', params: {taskId: model.id}}"
        class="task-info-container">
        <span class="task-info-wrapper">
          <div class="user-container">
            <Avatar :size="24" class="task-avatar"></Avatar>
            <span class="task-title">{{ model.name }}</span>              
          </div>
        </span>
        <span class="task-status" v-bind:style="{color: backgroundStrongColorMap[model.status]}">
          {{ model.status }}</span>
      </router-link>
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
import { backgroundStrongColorMap } from '@/helpers/helpers'

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
  data() {
    return {
      open: false,
      getTasks: [],
      backgroundStrongColorMap
    }
  },
  computed: {
    isParent() {
      return this.getTasks.length > 0
    },
    statusColor() {
      // this.model.status
      return {
        color: '#1976d2'
      }
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

<style scoped lang="scss">
.task-avatar {
  margin-right: 8px;
  align-self: center;
}

.task-fold-button {
  width: 18px;
  margin: 0 4px;
  z-index: 5;
  text-align: center;
  // color: rgba(0, 0, 0, 0.9);
}

.task-info-container {
  display: flex;
  position: static;
  width: 100%;
  height: auto;
  // border-top: 1px solid $black;
}

.task-info-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center;
  width: 0;
}

.task-status {
  flex-shrink: 0;
  width: 100px;
  max-width: 128px;
  margin: 0 8px;
  /*line-height: 16px;*/
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
}

.tree-item {
  line-height: 40px;
}

.tree-item:hover {
  background-color: $hover;
}

.task-title {
  font-size: 14px;
}
</style>
