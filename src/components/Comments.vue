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
      </div>
    </div>

  </div> 
</template>

<script>
import { formatDate } from '@/helpers/helpers'

export default {
  props: ['comments'],
  data() {
    return {
      formatDate
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
  min-width: 70%;
  padding: 8px 10px;
  // margin: 5px 0;
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
}

</style>