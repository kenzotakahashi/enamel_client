<template>
  <div class="modal-mask" @click="$emit('close')">
    <div class="modal-wrapper">
      <div class="modal-container" @click.stop="$store.dispatch('changeActiveWidget', null)">

        <h3>Create {{mode}}</h3>

        <el-form :model="form" @submit.native.prevent="createFolder">
          <el-input type="text" name="foldername" ref="foldername" v-model="form.name"
            :placeholder="`${mode} name`" :autofocus="true" @keyup.esc="$emit('close')">
          </el-input>
        </el-form>

        <div class="button-group">
          <el-button type="primary" @click="createFolder">Create</el-button>
          <el-button type="text" @click="$emit('close')">Cancel</el-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { CreateFolder, GetFolders } from '../constants/query.gql'

export default {
  props: ['config'],
  data() {
    return {
      form: {
        name: '',
        shareWith: [],
      },
      mode: this.config.mode
    }
  },
  mounted() {
    this.$refs.foldername.focus()
  },
  methods: {
    createFolder() {
      const { name, shareWith } = this.form
      if (!name) return
      const parent = this.config.parent
      this.$apollo.mutate({
        mutation: CreateFolder,
        variables: {name, parent, shareWith},
        update: (store, { data: { createFolder } }) => {
          const variables = parent ? { parent } : {}
          try {
            const data = store.readQuery({
              query: GetFolders,
              variables
            })
            data.getFolders.push(createFolder)
            store.writeQuery({
              query: GetFolders,
              variables,
              data
            })
          } catch(err) {
            console.log(err)
          }
        }
      }).then(({ data: { createFolder } }) => {
        this.$emit('close')
        this.$router.push({name: 'folder', params: {id: createFolder.id} })
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}

</script>

<style scoped>

.modal-container {
  width: 400px;
}

.radio-group {
  padding: 20px 0;
}

.description {
  position: relative;
  left: 28px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.56);
  line-height: 1.67;
  padding-bottom: 10px;
}

.button-group {
  margin-top: 20px;
}
</style>
