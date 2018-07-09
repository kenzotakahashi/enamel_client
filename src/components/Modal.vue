<template>
  <div class="modal-mask white">
    <div class="modal-wrapper">
      <div class="modal-container">
        <el-row>
          <el-col :span="12">
            <h3>Create {{mode}}</h3>

            <div>
              <el-input type="text" name="foldername" ref="foldername" v-model="form.name"
                :placeholder="`${mode} name`" :autofocus="true" @keyup.esc="$emit('close')">
              </el-input>
            </div>
            <div class="radio-group">
              <el-radio v-model="mode" label="project">
                Project
              </el-radio>
              <div class="description">
                Use Projects to manage tasks that are part of a larger goal. Projects can have their own attributes separate from tasks, like Status and Finish Date, which you can track.
              </div>
              <el-radio v-model="mode" label="folder">
                Folder
              </el-radio>
              <div class="description">
                Use Folders as containers to organize and categorize work, making it easier to find and share information. Unlike Projects, Folders do not have attributes you can track.
              </div>
            </div>

            <el-button type="primary" @click="createFolder">Create</el-button>
            <el-button type="" @click="$emit('close')">Cancel</el-button>

          </el-col>
        </el-row>

      </div>
    </div>
  </div>
</template>

<script>
import { CreateFolder, CreateProject, GetFolders } from '../constants/query.gql'

export default {
  props: ['config'],
  data() {
    return {
      form: {
        name: '',
        shareWith: []
      },
      mode: this.config.mode
    }
  },
  methods: {
    createFolder() {
      const { name, shareWith } = this.form
      if (!name) return
      const parent = this.config.parent
      this.$apollo.mutate({
        mutation: CreateFolder,
        variables: {
          name,
          parent,
          shareWith
        },
        update: (store, { data: { createFolder } }) => {
          try {
            const data = store.readQuery({
              query: GetFolders,
              variables: {parent}
            })
            data.getFolders.push(createFolder)
            store.writeQuery({
              query: GetFolders,
              variables: {parent},
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
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(39, 65, 90, 0.85);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.modal-header h3 {
  margin-top: 0;
  /* color: #42b983; */
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
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
</style>
