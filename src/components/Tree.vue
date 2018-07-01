<template name="tree">
  <li>
    <div
      @click="toggle">
      {{ model.name }}
      <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
    </div>
    <ul v-show="open" v-if="isFolder">
      <tree
        class="item"
        v-for="model in model.subfolders"
        :key="model.id"
        :model="model">
      </tree>
    </ul>
  </li>
</template>

<script>
import Tree from './Tree'

export default {
  name: 'tree',
  components: {
    'tree': Tree
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
    isFolder: function () {
      return this.model.subfolders && this.model.subfolders.length
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    addChild: function () {
      // this.model.subfolders.push({
      //   name: 'new stuff'
      // })
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
  list-style-type: none;
}
li {
  list-style-type: none;
}
</style>