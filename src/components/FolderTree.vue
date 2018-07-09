<template name="tree">
  <li>
    <div class="tree-item dropdown"
        @click.right.stop.prevent="$store.dispatch('changeActiveDropdown', `folder${model.id}`)"
        @click.left.stop="$router.push({name: 'folder', params: {id: model.id}})">
      <span v-if="isFolder" @click="toggle" class="fold-button invrese">[{{ open ? '-' : '+' }}]</span>
      <span class="folder no-select-color">{{ model.name }}</span>

      <div class="dropdown-content left" v-show="activeDropdown === `folder${model.id}`">
        <div @click="openModal('folder')">Add Folder</div>
        <div @click="openModal('project')">Add Project</div>
        <div>Share</div>
        <div>Rename</div>
        <div>Delete</div>
        <div>Duplicate</div>
        <hr></hr>
        <div>Turn into Project</div>
      </div>
    </div>
    <ul class="tree" v-show="open" v-if="isFolder">
      <tree
        class=""
        v-for="folder in getFolders"
        :key="folder.id"
        :model="folder">
      </tree>
    </ul>

    <Modal v-if="showModal" :config="modalConfig" @close="showModal = false"></Modal>
  </li>
</template>

<script>
import { mapState } from 'vuex'
import FolderTree from './FolderTree'
import Modal from './Modal'
import { GetFolders } from '../constants/query.gql'

export default {
  name: 'tree',
  components: {
    'tree': FolderTree,
    Modal
  },
  props: {
    model: Object
  },
  data() {
    return {
      open: false,
      modalConfig: {
        mode: 'folder'
      },
      showModal: false,
      getFolders: []
    }
  },
  computed: {
    isFolder: function () {
      return this.getFolders.length > 0
    },
    ...mapState(['activeDropdown'])
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
    toggle() {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    openModal(mode) {
      this.$store.dispatch('changeActiveDropdown', null)
      this.showModal = true
      this.modalConfig = {
        mode,
        parent: this.model.id
      }
    },
    goToDetail() {
    },
    addChild() {
      // this.model.subfolders.push({
      //   name: 'new stuff'
      // })
    }
  }
};
</script>

<style>
</style>
