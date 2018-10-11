<template>
  <div @click="openForm" class="description-field">
    <span v-if="!isFormOpen && !description" class="description-text">Click to add the description</span>
    <pre v-else-if="!isFormOpen && description" v-html="description" v-linkified></pre>
    <div v-else>
      <textarea
        cols="10"
        ref="descriptionform"
        v-model="description"
        @keyup.esc="closeForm"
        @focus="showButton = true"
        @blur="updateDescription"
        @keydown.shift.enter="updateDescription"
        @keydown.ctrl.enter="updateDescription"
        @keydown.meta.enter="updateDescription"
      >
      </textarea>
<!--       <div class="save-button" v-bind:style="{visibility: showButton ? 'visible' : 'hidden'}" >
        <el-button type="primary" size="small" @click.stop="updateDescription"
          >Save</el-button>        
      </div> -->
    </div>
  </div>
</template>

<script>
import { UpdateTask, UpdateFolder } from '../constants/query.gql'

export default {
  props: ['model', 'kind'],
  data() {
    return {
      showButton: false,
      isFormOpen: false,
      description: this.model.description
    }
  },
  methods: {
    openForm() {
      this.isFormOpen = true
      this.$nextTick(() => this.$refs.descriptionform.focus())
    },
    closeForm() {
      this.isFormOpen = false
    },
    updateDescription(e) {
      this.$apollo.mutate({
        mutation: this.kind === 'task' ? UpdateTask : UpdateFolder,
        variables: {
          id: this.model.id,
          input: {description: this.description}
        },
      }).then(() => {
        this.isFormOpen = false
        this.showButton = false
        this.cancel(e)
      }).catch((error) => {
        console.log(error)
      })
    },
    cancel(e) {
      e.target.blur()
    }
  },
  watch: {
    model(newVal, oldVal) {
      this.description = newVal.description
    }
  }
}

</script>

<style scoped lang="scss">
.description-field {
  font-size: 14px;
  padding: 30px 30px;
  border-bottom: 1px solid;
  border-color: rgba(0,0,0,.16);
  cursor: pointer;
}

textarea {
  width: 100%;
  height: 200px;
  display: block;
}

.description-field:hover .description-text {
  color: rgba(0, 0, 0, 0.56);
}
.Dark .description-field:hover .description-text {
  color: $dark-text2;
}

.description-text {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.32);
}
.Dark .description-text {
  color: $dark-text;
}

.save-button {
  display: flex;
  justify-content: flex-end;
}

</style>
