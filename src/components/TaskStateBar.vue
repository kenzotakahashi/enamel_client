<template>
  <div class="task-statebar">
    <div class="task-status dropdown" v-bind:style="{borderColor: backgroundStrongColorMap[task.status]}"
      @click.stop="$store.dispatch('changeActiveWidget', 'task-status-menu')">
      <div class="task-status-view" v-bind:style="{
        backgroundColor: backgroundColorMap[task.status],
        borderColor: borderColorMap[task.status]
      }">
        <span class="task-status-label">{{task.status}}</span>
        <span class="arrow-wrap"></span>
      </div>
      <div class="dropdown-content left" v-show="activeWidget === 'task-status-menu'">
        <div v-for="status in statusList" :key="status" @click="changeTaskStatus(status)"
          v-bind:class="{ 'active-status': task.status === status }">
          <span class="status-icon" v-bind:style="{
            backgroundColor: backgroundStrongColorMap[status]
          }"></span>
          <span>{{status}}</span>            
        </div>

      </div>
    </div>
<!--     <div class="state-bar-assignee">

      <div class="tooltip">
        <div v-show="activeWidget === 'addAssigneeTooltip'" class="tooltip-content top" @click.stop="">
          <div>
            <div class="search-user-input">
              <el-input type="text" v-model="searchUser" placeholder="Search contact"
                @keyup.esc="changeActiveWidget(null)">
              </el-input>                
            </div>
          </div>
          <div class="contact-picker-item-list">
            <div v-for="user in filteredUsers" class="contact-picker-item"
              @click.stop="assignUserToTask(user)">
              <div class="picker-item">
                <div class="item">
                  <Avatar class="picker-avatar" :user="user" :size="32"></Avatar>
                  <div>
                    <div class="name">{{user.name}}</div>
                    <div class="email">{{user.email}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-field">
          <div v-if="task.assignees.length > 0" class="add-additional">
            <Avatar v-for="user in task.assignees" :key="user.id" 
              class="member-avatar" :user="user" :size="32">
              <RemoveButton @click="removeUserFromTask(user.id)"></RemoveButton>
            </Avatar>
            <div class="cross-wrapper">
              <span slot="reference" class="cross"
                @click.stop="changeActiveWidget('addAssigneeTooltip')">
              </span>
            </div>
          </div>
          <el-button v-else type="text"
            @click.stop="changeActiveWidget('addAssigneeTooltip')">
            Add members</el-button>
        </div>
      </div>

      <span v-if="task.assignees.length > 0">TODO: Assignees</span>
      <el-button
        type="text"
        @click="$emit('toggleSubtaskView')"
        class="black-text-button" >
        + Add assignee
      </el-button>
    </div> -->

    <div class="state-bar-add-subtask">
      <el-button type="text" @click="$emit('toggleSubtaskView')"
        v-bind:class="{'black-text-button': !showSubtasks}">
        {{subtasks.length > 0 ? formatSubtaskCount(subtasks) : 'Add subtask'}}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { backgroundStrongColorMap } from '@/helpers/helpers'
// import Avatar from './icons/Avatar'
// import RemoveButton from './icons/RemoveButton'

export default {
  // components: {
  //   Avatar,
  //   RemoveButton
  // },
  props: ['task', 'subtasks', 'users', 'showSubtasks'],
  data() {
    return {
      statusList: ['New', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
      backgroundStrongColorMap,
      backgroundColorMap: {
        New: 'rgb(227, 242, 253)',
        'In Progress': '#e0f7fa',
        Completed: '#f1f8e9',
        'On Hold': '#fafafa',
        Cancelled: '#fafafa',
      },
      borderColorMap: {
        New: 'rgb(211, 228, 242)',
        'In Progress': '#ceeaee',
        Completed: '#e3ebd9',
        'On Hold': '#e5e5e5',
        Cancelled: '#e5e5e5',
      },
    }
  },
  computed: {
    ...mapState(['activeWidget'])
  },
  methods: {
    formatSubtaskCount(subtasks) {
      const count = subtasks.length
      return `${count} subtask${count > 1 ? 's' : ''}`
    },
    changeTaskStatus(status) {
      if (this.task.status === status) return
      this.$apollo.mutate({
        mutation: UpdateTask,
        variables: {
          id: this.task.id,
          input: {status}
        },
      }).then(() => {
        this.$store.dispatch('changeActiveWidget', null)
      }).catch((error) => {
        console.log(error)
      })
    },
    assignUserToTask(user) {
      this.form.users.push(user)
    },
    removeUserFromTask(id) {
      this.form.users = this.form.users.filter(o => o.id !== id)
    },
    changeActiveWidget(key) {
      this.$store.dispatch('changeActiveWidget', key)
    },
  }
}
</script>

<style scoped>
.task-statebar {  
  display: flex;
  min-width: 400px;
  height: 48px;
  position: relative;
  padding-right: 8px;
  border-top: solid 1px;
  border-bottom: solid 1px;
  border-color: rgba(0,0,0,.16);
}

.task-status {
  flex-shrink: 0;
  margin-top: -1px;
  margin-bottom: -1px;
  border-left: 9px solid;
  /*border-color: rgb(25, 118, 210);*/
}

.task-status-view {
  display: flex;
  cursor: pointer;
  padding: 14px 11px 14px 20px;
  border-radius: none;
  border-image: initial;
  box-sizing: content-box;
  height: 20px;
  border-style: solid;
  border-width: 1px;
  border-left: none;
}

.arrow-wrap {
  border-color: #000 transparent transparent;
  border-style: solid;
  border-width: 4px 3px 0;
  float: right;
  margin-left: 6px;
  margin-top: 10px;

  border-top-color: rgb(33, 33, 33);
}

.dropdown-content > div {
  font-size: 13px;
  padding: 7px 32px 6px 24px;
}

.task-status-label {
  align-self: center;
  font-size: 13px;
  color: #111;
  font-weight: 600;
}

.status-icon {
  box-sizing: content-box;
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1px solid #fff!important;
  border-radius: 2px;
  margin-right: 11px;
  align-self: center;
}

.active-status, .active-status:hover {
  color: #fff;
  background-color: #48f;
  cursor: default;
}

.state-bar-assignee {
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: 0 8px;
}

.state-bar-add-subtask {
  display: flex;
  align-items: center;
}

/*assignees*/
.groupname-initials-section {
  display: flex;
}

.avatarcolor-container {
  display: flex;
  flex-wrap: wrap;
}

.field-title {
  margin-bottom: 8px;
  font-size: 12px;
}

.name-form {
  flex-grow: 1;
}

.initials-form {
  width: 56px;
  padding-left: 8px;
}

.color-avatar {
  margin-bottom: 8px;
  margin-right: 8px;
}

.member-avatar {
  margin-right: 8px;
  cursor: pointer;
}

.member-avatar:hover .remove-button {
  visibility: visible;
}

.tooltip .tooltip-content {
  width: 278px;
  left: 50%; 
  margin-left: -139px;
}

.search-user-input {
  padding: 15px;
}

.contact-picker-item-list {
  padding-bottom: 24px;
  max-height: 295px;
  overflow: auto;
}

.contact-field {
  box-sizing: border-box;
  height: 36px;
}

.add-additional {
  display: flex;
  flex-direction: row;
}


</style>