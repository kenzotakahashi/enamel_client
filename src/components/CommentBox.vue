<template>
  <div class="comment-box">
    <div class="text-form">
      <textarea class="no-outline" ref="textarea" type="text" name="comment"
        v-model="form.body" placeholder="Add comment"
        @focus="emoji=false"
        @keydown.shift.enter="createComment"
        @keydown.ctrl.enter="createComment"
        @keydown.meta.enter="createComment"></textarea>
    </div>
    <div class="emoji-button" >
      <Picker v-show="emoji" set='emojione' :sheetSize='32' :native='true' @select="addEmoji" />
      <i class="far fa-smile" @click.stop="toggleEmoji"></i>
    </div>
    <div v-show="form.body" class="button">
      <el-button type="primary" size="small" @click="createComment">Send</el-button>
    </div>
  </div>
</template>



<script>
import { GetComments, CreateComment } from '../constants/query.gql'
import { Picker } from 'emoji-mart-vue'

export default {
  props: ['parent'],
  components: {
    Picker
  },
  data() {
    return {
      emoji: false,
      form: {
        body: ''
      }
    }
  },
  methods: {
    toggleEmoji() {
      this.emoji = !this.emoji
    },
    addEmoji(emoji) {
      const textarea = this.$refs.textarea
      const cursorPosition = textarea.selectionEnd
      const start = this.form.body.substring(0, textarea.selectionStart)
      const end = this.form.body.substring(textarea.selectionStart)
      this.form.body = start + emoji.native + end
      this.emoji = false
      textarea.focus()
      this.$nextTick(() => {
        textarea.selectionEnd = cursorPosition + emoji.native.length
      })
    },
    createComment() {
      if (!this.form.body) return
      this.emoji = false
      const target = this.parent
      this.$apollo.mutate({
        mutation: CreateComment,
        variables: {
          target: {
            "kind": "Task",
            "item": target
          },
          body: this.form.body
        },
        update: (store, { data: { createComment } }) => {
          try {
            const data = store.readQuery({
              query: GetComments,
              variables: {target}
            })
            data.getComments.push(createComment)
            store.writeQuery({
              query: GetComments,
              variables: {target},
              data
            })
          } catch(err) {
            console.log(err)
          }
        }
      }).then(() => {
        this.form.body = ''
        this.$emit('scrollComment')
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}

</script>

<style scoped lang="scss">
.comment-box {
  display: flex;
  margin-top: 10px;
  padding: 12px;
  border-top: 1px solid;
  border-color: rgba(0,0,0,.16);
  position: relative;
  bottom: 0;
  left: 0;
}

.text-form {
  flex: 1 1;
  textarea {
    width: 100%;
  }
}

.emoji-button {
  position: relative;
  cursor: pointer;
  padding: 4px;
  .fa-smile {
    font-size: 18px;
  }  
  .emoji-mart {
    position: absolute;
    bottom: 55px;
    right: 0;
  }
}

</style>


