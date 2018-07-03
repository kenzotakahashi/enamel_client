<template name="tree">
  <li>
    <div>
      <span v-if="isFolder" @click="toggle" class="fold-button">[{{ open ? '-' : '+' }}]</span>
      <router-link :to="{name: 'folder', params: {id: model.id}}">
        <span class="folder">{{ model.name }}</span>    
      </router-link>
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
import FolderTree from './FolderTree'

export default {
  name: 'tree',
  components: {
    'tree': FolderTree
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
}

.folder {
  position: relative;
  left: 30px;
}

.fold-button {
  position: absolute;
}
</style>