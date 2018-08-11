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
      <tree
        v-for="folder in getFolders"
        :key="folder.id"
        :model="folder"
        @open="openArrow"
      >
      </tree>
    </ul>

    <FolderForm v-if="showModal" :config="modalConfig" @close="showModal = false"></FolderForm>
  </li>
</template>

<script>
import { mapState } from 'vuex'
import FolderTree from './FolderTree'
import FolderForm from './FolderForm'
import { GetFolders, UpdateFolder, DeleteFolder, UpdateTask,
  GetTasks } from '../constants/query.gql'

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
    if (this.isSeletecd) {
      this.$emit('open')
    }
  },
  computed: {
    isFolder: function () {
      return this.getFolders.length > 0
    },
    isSeletecd() {
      return this.$route.params.id === this.model.id
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
        this.$router.push({name: 'folder', params: {id: this.model.id}})
      } else if (this.mode === 'task') {
        this.$apollo.mutate({
          mutation: UpdateTask,
          variables: {
            id: item.id,
            input: {
              parent: null,
              folders: [folder]
            }
          },
          update(store, { data: { updateTask } }) {
            const data = store.readQuery({
              query: GetTasks,
              variables: { folder }
            })
            data.getTasks.push(updateTask)
            data.getTasks.sort((a,b) => a.order - b.order)
            store.writeQuery({
              query: GetTasks,
              variables: { folder },
              data
            })

            const variables = item.parent
              ? { parent: item.parent.id }
              : { folder: item.folders[0].id }
            const data2 = store.readQuery({
              query: GetTasks,
              variables
            })
            data2.getTasks = data2.getTasks.filter(o => o.id !== updateTask.id)
            store.writeQuery({
              query: GetTasks,
              variables,
              data: data2
            })
          }
        }).then(() => {
          this.$store.commit('changeMode', {type: 'default'})
          this.$router.push({name: 'folder', params: {id: this.model.id}})
        }).catch((error) => {
          console.log(error)
        })
      } else if (this.mode === 'folder') {
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
            const data = store.readQuery({
              query: GetFolders,
              variables: { parent: folder }
            })
            data.getFolders.push(updateFolder)
            data.getFolders.sort((a,b) => a.createdAt - b.createdAt)
            store.writeQuery({
              query: GetFolders,
              variables: { parent: folder },
              data
            })

            const variables = item.parent ? { parent: item.parent.id } : {}
            const data2 = store.readQuery({
              query: GetFolders,
              variables
            })
            data2.getFolders = data2.getFolders.filter(o => o.id !== updateFolder.id)
            store.writeQuery({
              query: GetFolders,
              variables,
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
  }
};
</script>

<style>
</style>
