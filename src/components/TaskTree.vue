<template name="tree">
  <li>
    <div>
      <span v-if="isParent" @click="toggle" class="fold-button">[{{ open ? '-' : '+' }}]</span>
      <router-link :to="{name: 'task', params: {taskId: model.id}}">        
        <span class="folder">{{ model.name }}</span>
      </router-link>
    </div>
    <ul v-show="open" v-if="isParent">
      <tree
        class="item"
        v-for="model in model.subtasks"
        :key="model.id"
        :model="model">
      </tree>
    </ul>
  </li>
</template>

<script>
import TaskTree from './TaskTree'

export default {
  name: 'tree',
  components: {
    'tree': TaskTree
  },
  props: {
    model: Object
  },
  data: function () {
    return {
      open: false
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
    }
  }
};
</script>

<style>
.item {
  cursor: pointer;
}
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