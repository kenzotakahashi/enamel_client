<template>
  <div>
    <div v-for="log in comments" class="comment-container">
      <avatar :obj="log.user" :size="32" class="task-avatar"></avatar>
      <div class="notification-body" v-bind:class="{comment: log.body}">
        <div>
          <div class="user-name">{{ log.user.firstname }} {{ log.user.lastname }}</div>
          <div class="date">{{ formatDate(log.createdAt) }}</div>                 
        </div>
        <div v-if="log.body">
          <div>{{ log.body }}</div>
        </div>
        <div v-else>
          <div>created task</div>
          <div class="task-title">{{ log.target.item.name }}</div>
        </div>

        <div v-if="log.body" class="action-wrapper">
          <span @click="deleteComment(log.id)"><i class="far fa-trash-alt"></i></span>
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
import { formatDate } from '@/helpers/helpers'
import { DeleteComment, GetComments } from '@/constants/query.gql'

export default {
  props: ['id', 'comments'],
  data() {
    return {
      formatDate
    }
  },
  methods: {
    deleteComment(id) {
      const target = this.id
      this.$apollo.mutate({
        mutation: DeleteComment,
        variables: {id},
        update: (store) => {
          const data = store.readQuery({
            query: GetComments,
            variables: { target }
          })
          data.getComments = data.getComments.filter(o => o.id !== id)
          store.writeQuery({
            query: GetComments,
            variables: { target },
            data
          })
        }
      })
    }
  }
}

</script>

<style scoped lang="scss">
.date {
  padding-left: 20px;
}

.comment-container {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 10px;
}

.task-title {
  padding-left: 10px;
  color: rgba(0,0,0,.9);
  white-space: nowrap;
}

.task-avatar {
  margin-right: 10px;
}

.user-name {
  font-weight: 600;
  font-size: 12px;
  color: rgba(0,0,0,.9);
}

.date {
  margin-left: 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.56);
}

.notification-body {
  box-sizing: border-box;
  position: relative;
  min-width: 70%;
  padding: 8px 10px;
  div {
    display: flex;
    line-height: 22px;
  }
  &:last-child {
    font-size: 14px;
  }
  &.comment {
    background-color: rgba(0,0,0,.04);    
  }
  &:hover {
    .action-wrapper {
      visibility: visible;
    }
  }
}

.action-wrapper {
  right: -8px;
  top: -10px;
  box-sizing: content-box;
  visibility: hidden;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -ms-flex-flow: row nowrap;
  flex-flow: row nowrap;
  -ms-flex-align: center;
  align-items: center;
  height: 20px;
  position: absolute;
  z-index: 30;
  background: #fff;
  border-radius: 2px;
  border: 1px solid rgba(0,0,0,.16);
  span {
    padding: 2px 7px;
    cursor: pointer;
  }
}

</style>