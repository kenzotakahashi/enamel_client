<template>
  <div class="modal-mask white">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h3>Create group</h3>

        <div class="groupname-initials-section">
          <div class="name-form">
            <div class="field-title">Group name</div>
            <el-input type="text" name="name" ref="name" v-model="form.name"
              :autofocus="true" @input="updateInitials" @keyup.esc="$emit('close')">
            </el-input>
          </div>
          <div class="initials-form">
            <div class="field-title">Initials</div>
            <el-input type="text" name="initials" v-model="form.initials"
              maxlength="2" @input="inputInitials" @keyup.esc="$emit('close')">
            </el-input>
          </div>
        </div>

        <section>
          <div class="field-title">Avatar color</div>
          <div class="avatarcolor-container">
            <Avatar v-for="avatarColor in colors" :key="avatarColor"
              class="color-avatar" 
              @avatar-click="selectAvatarColor(avatarColor)"
              :manual="{initials: form.initials, avatarColor}" :size="32"
              :selected="form.avatarColor === avatarColor">
            </Avatar>
          </div>
        </section>

        <section>
          <div class="field-title">Members</div>
          <div class="tooltip">
            <div v-show="activeDropdown === 'addGroupTooltip'" class="tooltip-content" @click.stop="">
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

            <div class="contact-field">
              <div v-if="form.users.length > 0" class="add-additional">
                <Avatar v-for="user in form.users" :key="user.id" 
                  class="member-avatar" :user="user" :size="32">
                  <div class="remove-button" @click="removeMemberFromGroup(user.id)">
                    <svg fill="currentColor" height="16" width="16" viewBox="0 0 16 16">
                      <path d="M8.844 8l2.981-2.973a.593.593 0 0 0 0-.84.599.599 0 0 0-.844 0l-2.977 2.97L5.03 4.173a.593.593 0 0 0-.84 0 .598.598 0 0 0 0 .845l2.97 2.977-2.985 2.977a.592.592 0 0 0 0 .84c.232.233.61.233.844 0L8 8.84l2.977 2.985a.592.592 0 0 0 .84 0 .599.599 0 0 0 0-.843L8.844 8z" fill-rule="evenodd"></path>
                    </svg>
                  </div>
                </Avatar>
                <div class="cross-wrapper">
                  <span slot="reference" class="cross"
                    @click.stop="changeActiveDropdown('addGroupTooltip')">
                  </span>
                </div>
              </div>
              <el-button v-else type="text" slot="reference"
                @click.stop="changeActiveDropdown('addGroupTooltip')">
                Add members</el-button>
            </div>
          </div>
        </section>

        <section>
          <el-button type="primary" @click="createGroup">Create</el-button>
          <el-button type="" @click="$emit('close')">Cancel</el-button>          
        </section>

      </div>
    </div>
  </div>
</template>

<script>
import { GetUsers, CreateGroup, GetGroups } from '../constants/query.gql'
import Avatar from './Avatar.vue'
import { mapState } from 'vuex'
import { randomChoice } from '@/helpers/helpers'

export default {
  components: {
    Avatar
  },
  data() {
    return {
      visibleAddMembers: false,
      enteredInitials: false,
      colors: [
        "D81B60","F06292","F48FB1","FFB74D","FF9800","F57C00","00897B","4DB6AC","80CBC4",
        "80DEEA","4DD0E1","00ACC1","9FA8DA","7986CB","3949AB","8E24AA","BA68C8","CE93D8"
      ],
      searchUser: '',
      getUsers: [],
      form: {
        name: '',
        initials: '',       
        avatarColor: '',
        users: []
      },
    }
  },
  apollo: {
    getUsers: {
      query: GetUsers
    },
  },
  computed: {
    filteredUsers() {
      const s = this.searchUser.toLowerCase()
      const users = this.form.users.map(o => o.id)
      return this.getUsers.filter(o => !users.includes(o.id)
        && (o.name.toLowerCase().includes(s) || o.email.toLowerCase().includes(s)))
    },
    ...mapState(['activeDropdown'])
  },
  methods: {
    inputInitials() {
      this.form.initials = this.form.initials.toUpperCase()
      this.enteredInitials = !!this.form.initials
    },
    updateInitials() {
      if (!this.enteredInitials) {
        if (this.form.name) {
          // If the name consists of multiple parts, pick the initial of the first two.
          // Otherwise use the first 2 letters
          const nameChunks = this.form.name.split(' ').filter(o => o.length > 0)
          const initials = nameChunks.length >= 2
            ? `${nameChunks[0][0]}${nameChunks[1][0]}`
            : nameChunks[0].slice(0,2)
          this.form.initials = initials.toUpperCase()          
        } else {
          this.form.initials = ''
        }
      }
    },
    addMemberToGroup(user) {
      this.form.users.push(user)
    },
    removeMemberFromGroup(id) {
      this.form.users = this.form.users.filter(o => o.id !== id)
    },
    selectAvatarColor(color) {
      this.form.avatarColor = color
    },
    changeActiveDropdown(key) {
      this.$store.dispatch('changeActiveDropdown', key)
    },
    createGroup() {
      const { name, initials, avatarColor, users } = this.form
      if (!name || !initials) return

      this.$apollo.mutate({
        mutation: CreateGroup,
        variables: {
          name,
          initials,
          avatarColor: avatarColor || randomChoice(this.colors),
          users: users.map(o => o.id)
        },
        update: (store, { data: { createGroup } }) => {
          const variables = parent ? { parent } : {}
          try {
            const data = store.readQuery({
              query: GetGroups,
              variables
            })
            data.getGroups.unshift(createGroup)
            store.writeQuery({
              query: GetGroups,
              variables,
              data
            })
          } catch(err) {
            console.log(err)
          }
        }
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
  padding: 24px;
}

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

.remove-button {
  visibility: hidden;
  display: block;
  width: 12px;
  height: 12px;
  position: absolute;
  right: -4px;
  top: -4px;
  padding: 1px;
  background-color: rgba(0, 0, 0, 0.9);
  border: 2px solid white;
  border-radius: 50%;
  color: #fff;
  transition: all 0.1s ease-out;
  cursor: pointer;
  z-index: 1;
}

.remove-button svg {
  color: #fff;
  display: block;
  width: 12px;
  height: 12px;
}

.tooltip .tooltip-content {
  box-sizing: border-box;
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

.cross-wrapper {
  padding: 6px 0;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

</style>
