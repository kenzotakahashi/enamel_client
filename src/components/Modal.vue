<template>
  <div class="modal-mask white">
    <div class="modal-wrapper">
      <div class="container modal-container">

        <div class="columns">
          <div class="colum col-6">
            <div>Create {{mode}}</div>

            <div>
              <input type="text" name="foldername" ref="foldername" v-model="foldername"
                 @keyup.esc="$emit('close')">
              </input>
            </div>

            <div class="form-group">
              <label class="form-radio">
                <input type="radio" name="mode" value="project" v-model="mode" >
                <i class="form-icon"></i>
                <span>
                  Project
                  <div>
                    Use Projects to manage tasks that are part of a larger goal. Projects can have their own attributes separate from tasks, like Status and Finish Date, which you can track.
                  </div>
                </span>
              </label>
              <label class="form-radio">
                <i class="form-icon"></i>
                <input type="radio" name="mode" value="folder" v-model="mode" >
                <span>
                  Folder
                </span>
              </label>
            </div>

            <span @click="$emit('close')" class="btn btn-primary btn-sm">Create</span>
            <span @click="$emit('close')" class="btn btn-sm">Cancel</span>
          </div>
          <div class="colum col-6">

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['config'],
  data() {
    return {
      foldername: '',
      mode: 'folder'
      // mode: this.config.mode
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
</style>
