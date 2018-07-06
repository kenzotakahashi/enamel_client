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
        v-for="folder in getFolders"
        :key="folder.id"
        :model="folder">
      </tree>
    </ul>
  </li>
</template>

<script>
import FolderTree from './FolderTree'
import { GetFolders } from '../constants/query.gql'

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
      open: false,
      getFolders: []
    }
  },
  computed: {
    isFolder: function () {
      return this.getFolders.length > 0
    }
  },
  apollo: {
    getFolders: {
      query: GetFolders,
      variables() {
        return { parent: this.model.id }
      },
      error(error) {
        console.error(error)
      },
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
