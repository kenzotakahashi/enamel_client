<template>
  <div class="modal-mask white">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h3>Add users to group</h3>

        <section>
          <div class="contact-field">
            <div v-if="form.users.length > 0" class="add-additional">
              <Avatar v-for="user in form.users" :key="user.id" 
                class="member-avatar" :user="user" :size="32">
                <RemoveButton @click="removeMemberFromGroup(user.id)"></RemoveButton>
              </Avatar>
              <div class="cross-wrapper">
                <span slot="reference" class="cross"
                  @click.stop="changeActiveDropdown('addGroupTooltip')">
                </span>
              </div>
            </div>
            <div v-else>Search for and select users below</div>
          </div>
        </section>

        <div class="user-list">
          <div>
            <div class="search-user-input">
              <el-input type="text" v-model="searchUser" placeholder="Search contact"
                @keyup.esc="changeActiveDropdown(null)">
              </el-input>
            </div>
          </div>
          <div class="contact-picker-item-list">
            <div v-for="user in filteredUsers" class="contact-picker-item"
              @click.stop="addMemberToGroup(user)">
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

        <section class="button-group">
          <el-button type="primary" @click="addUsersToGroup">Add</el-button>
          <el-button type="text" @click="$emit('close')">Cancel</el-button>          
        </section>

      </div>
    </div>
  </div>
</template>

<script>
import { AddUsersToGroup, GetUsers, GetGroups } from '../constants/query.gql'
import Avatar from './Avatar.vue'
import RemoveButton from './RemoveButton.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Avatar,
    RemoveButton
  },
  props: ['group', 'users'],
  data() {
    return {
      targetUsers: this.users.filter(o => !this.group.users.includes(o.id)),
      searchUser: '',
      form: {
        users: []
      },
    }
  },
  computed: {
    filteredUsers() {
      const s = this.searchUser.toLowerCase()
      const users = this.form.users.map(o => o.id)
      return this.targetUsers.filter(o => !users.includes(o.id)
        && (o.name.toLowerCase().includes(s) || o.email.toLowerCase().includes(s)))
    },
    ...mapState(['activeDropdown'])
  },
  methods: {
    changeActiveDropdown(key) {
      this.$store.dispatch('changeActiveDropdown', key)
    },
    addMemberToGroup(user) {
      this.form.users.push(user)
    },
    removeMemberFromGroup(id) {
      this.form.users = this.form.users.filter(o => o.id !== id)
    },
    addUsersToGroup() {
      const users = this.form.users.map(o => o.id)
      if (users.length === 0) {
        this.$emit('close')
        return
      }
      this.$apollo.mutate({
        mutation: AddUsersToGroup,
        variables: { id: this.group.id, users }
      }).then(() => {
        this.$emit('close')
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}

</script>

<style scoped>

section {
  margin-top: 16px;
}

.modal-container {
  width: 408px;
  height: 536px;
  padding: 24px;
}

.field-title {
  margin-bottom: 8px;
  font-size: 12px;
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

.user-list {
  flex-grow: 1;
}

.button-group {
  flex-shrink: 0;
}

</style>
