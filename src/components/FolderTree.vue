<template name="tree">
  <li>
    <div class="tree-item"
        @click.right.stop.prevent="changeActiveWidget"
        @click.left.stop="leftClick">
      <span @click.stop="toggle" class="fold-button"
        v-bind:class="{active: $route.params.id === model.id}"
        v-bind:style="{visibility: isFolder ? 'visible' : 'hidden'}">
        <i :class="`fas fa-angle-${open ? 'down' : 'right'}`"></i>
      </span>
      <div class="tree-plate" v-bind:class="{active: $route.params.id === model.id}">
        <span class="folder no-select-color">{{ model.name }}</span>

        <div class="dropdown-content left" v-show="activeWidget === `folder${model.id}`">
          <div @click="openModal">Add Folder</div>
          <div @click.stop="$store.commit('changeMode', {type: 'folder', item: model})">Move</div>
          <!-- <div @click="openModal('project')">Add Project</div> -->
          <!-- <div>Share</div> -->
          <!-- <div>Rename</div> -->
          <div @click="deleteFolder">Delete</div>
          <!-- <div>Duplicate</div> -->
          <!-- <div>Turn into Project</div> -->
        </div>
      </div>
    </div>

    <ul class="tree" v-show="open" v-if="isFolder">
      <draggable v-model="getFolders" @change="reorder">
        <tree
          v-for="folder in getFolders"
          :key="folder.id"
          :model="folder"
          @open="openArrow"
        >
        </tree>
      </draggable>
    </ul>

    <FolderForm v-if="showModal" :config="modalConfig" @close="showModal = false"></FolderForm>
  </li>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import FolderTree from './FolderTree'
import FolderForm from './FolderForm'
import { GetFolders, UpdateFolder, DeleteFolder, SortFolders } from '../constants/query.gql'
import { moveTask } from '@/helpers/helpers'

export default {
  name: 'tree',
  components: {
    'tree': FolderTree,
    FolderForm
  },
  props: ['model', 'team'],
  data() {
    return {
      open: false,
      modalConfig: {
        mode: 'folder',
        parent: this.model.id
      },
      showModal: false,
      getFolders: []
    }
  },
  mounted() {
    if (this.$route.params.id === this.model.id) {
      this.$emit('open')
    }
  },
  computed: {
    isFolder: function () {
      return this.getFolders.length > 0
    },
    ...mapState(['activeWidget', 'mode', 'tempItem'])
  },
  apollo: {
    getFolders: {
      query: GetFolders,
      variables() {
        return { parent: this.model.id }
      },
      pollInterval: 90000,
      error(error) {
        console.error(error)
      },
    }
  },
  methods: {
    changeActiveWidget() {
      if (this.mode === 'default') {
        this.$store.dispatch('changeActiveWidget', `folder${this.model.id}`)        
      }
    },
    toggle() {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    openModal() {
      this.$store.dispatch('changeActiveWidget', null)
      this.showModal = true
    },
    openArrow() {
      this.open = true
      this.$emit('open')
    },
    leftClick() {
      const folder = this.model.id
      const item = this.tempItem
      if (this.mode === 'default') {
        this.$store.dispatch('changeActiveWidget', null)
        this.$router.push({name: 'folder', params: {id: folder}})
      } else if (this.mode === 'task') {
        moveTask(this, folder, item)
      } else if (this.mode === 'folder') {
        if (folder === item.id) return
        this.$apollo.mutate({
          mutation: UpdateFolder,
          variables: {
            id: item.id,
            input: {
              parent: folder,
              shareWith: []
            }
          },
          update(store, { data: { updateFolder } }) {
            const variables = item.parent ? { parent: item.parent } : {}
            const data = store.readQuery({ query: GetFolders, variables })
            data.getFolders = data.getFolders.filter(o => o.id !== updateFolder.id)
            store.writeQuery({ query: GetFolders, variables, data })

            const data2 = store.readQuery({
              query: GetFolders,
              variables: { parent: folder }
            })
            data2.getFolders.push(updateFolder)
            data2.getFolders.sort((a,b) => a.createdAt - b.createdAt)
            store.writeQuery({
              query: GetFolders,
              variables: { parent: folder },
              data: data2
            })
          }
        }).then(() => {
          this.$store.commit('changeMode', {type: 'default'})
          this.$router.push({name: 'folder', params: {id: item.id}})
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    deleteFolder() {
      const { id, parent } = this.model
      this.$apollo.mutate({
        mutation: DeleteFolder,
        variables: {id},
        update: (store) => {
          const variables = this.team ? {} : {parent}
          const data = store.readQuery({
            query: GetFolders,
            variables
          })
          data.getFolders.splice(data.getFolders.findIndex(o => o.id === id), 1)
          store.writeQuery({
            query: GetFolders,
            variables,
            data
          })
        }
      }).then(() => {
        this.$router.replace({
          name: "folder",
          params: {id: this.team || parent},
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    reorder() {
      const today = moment().valueOf() - this.getFolders.length
      const parent = this.model.id
      this.$apollo.mutate({
        mutation: SortFolders,
        variables: {
          folders: this.getFolders.map(o => o.id),
          orders: this.getFolders.map((o, i) => today + i),
          parent
        },
        update(store, { data: { sortFolders } }) {
          const data = store.readQuery({
            query: GetFolders,
            variables: { parent }
          })
          data.getFolders = sortFolders
          store.writeQuery({
            query: GetFolders,
            variables: { parent },
            data
          })
        }
      }).then(() => {
      }).catch((error) => {
        console.log(error)
      })
    },

  },
  watch: {
    '$route' (to, from) {
      if (to.params.id === this.model.id) {
        this.$emit('open')
      }
    }
  }
};
</script>

<style>
</style>
