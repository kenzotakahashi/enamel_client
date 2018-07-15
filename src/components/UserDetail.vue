<template>
  <div class="user-detail white" @click.stop="">
    <div class="user-detail-container">
      <div class="user-detail-inner-container">

        <div class="user-main-info-container">
          <Avatar :user="user" :size="144"></Avatar>
          <div class="user-name">{{user.name}}</div>
          <div class="user-role">{{user.jobTitle}}</div>
          <div class="user-signup-date">
            <span>joined: </span>
            <span class="user-signup-date-accented">{{formateDate(user.createdAt)}}</span>
          </div>
        </div>
        
        <div class="button-group-selector">
          <button class="button-group-selector-item" v-bind:class="{active: activeTab === 'settings'}"
            @click="activeTab = 'settings'">
            SETTINGS
          </button>
          <button class="button-group-selector-item" v-bind:class="{active: activeTab === 'groups'}"
            @click="activeTab = 'groups'">
            GROUPS
          </button>
        </div>
      
        <div>
          <table v-show="activeTab === 'settings'" class="user-settings-table">
            <tbody>
              <tr>
                <td class="user-settings-label">Role</td>
                <td class="user-settings-value">{{user.role}}</td>
              </tr>
              <tr>
                <td class="user-settings-label">Email</td>
                <td class="user-settings-value">{{user.email}}</td>
              </tr>
              <tr>
                <td class="user-settings-label">Location</td>
                <td class="user-settings-value">--</td>
              </tr>
              <tr>
                <td class="user-settings-label">Phone number</td>
                <td class="user-settings-value">--</td>
              </tr>
              <tr>
                <td class="user-settings-label">Time zone</td>
                <td class="user-settings-value">US/Pacific</td>
              </tr>
            </tbody>
          </table>
          <div v-show="activeTab === 'groups'" class="user-group-section">
            <div class="user-groups-label">Member of</div>
            <div class="group-list">
              <Avatar v-for="group in userGroups" :key="group.id" class="group-avatar"
                :manual="group" :size="32">
              </Avatar>
            </div>
          </div>
        </div>

<!--         <section v-show="user.role !== 'Owner' && activeTab === 'settings'">
          <div class="user-operations-section">
            <div class="user-operations-section-title">Delete User</div>
            <div class="user-operations-description">
              Once a user is deleted they won't be able to access their account and you won't be able to restore them. 
            </div>
            <div class="user-operations-notify">
              <el-checkbox v-model="notify">Notify user by email</el-checkbox>              
            </div>
            <el-button >Delete user</el-button>            
          </div>
        </section> -->

      </div>
      <CloseButton :size="24" @click="$store.dispatch('changeActiveWidget', null)"></CloseButton>
    </div>
  </div>
</template>

<script>
import Avatar from './icons/Avatar'
import CloseButton from './icons/CloseButton'
import moment from 'moment'

export default {
  props: ['user', 'groups'],
  data() {
    return {
      activeTab: 'settings',
      notify: true
    }
  },
  components: {
    Avatar,
    CloseButton
  },
  computed: {
    userGroups() {
      const id = this.user.id
      return this.groups.filter(o => o.users.includes(id))
    }
  },
  methods: {
    formateDate(date) {
      return moment(date).format('MMM DD, YYYY')
    },
  }
}

</script>

<style scoped>
.user-detail {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: block;
  width: 424px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.56), 0 0 1px 0 rgba(0, 0, 0, 0.16);
  z-index: 1;
}

.user-detail-container {
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-height: 100%;
  /*padding-left: 8px;*/
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;    
}

.user-detail-inner-container {
  flex-grow: 0;
  flex-shrink: 0;
  width: 376px;
  height: 100%;
  padding: 32px 0 32px 24px;    
}

.user-main-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;    
}

.user-name {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.42;
  margin: 8px 0;
  max-width: 100%;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  word-wrap: break-word;
}

.user-role {
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.56);
  max-width: 100%;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  word-wrap: break-word;
}

.user-signup-date {
  font-size: 12px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

.user-signup-date-accented {
  font-weight: 600;
}

.button-group-selector {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.button-group-selector-item {
  flex-grow: 1;
  transition: all 0.1s ease-out;
  min-height: 24px;
  padding: 0 7px;
  font-size: 12px;
  line-height: 1.66666667;

  border-color: #48f;
  color: #48f;
  background-color: #fff;
}

.button-group-selector-item.active {
  border-color: transparent;
  background-color: #48f;
  color: #fff;
}

.button-group-selector-item:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.button-group-selector-item:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.user-settings-table {
  width: 100%;
  margin-bottom: 16px;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
}

td {
  vertical-align: baseline;
  box-sizing: border-box;
}

.user-settings-label {
  width: 35%;
  padding-right: 16px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.56);
  padding-bottom: 16px;
}

.user-settings-value {
  width: 65%;
  font-size: 12px;
  font-weight: 600;
  word-wrap: break-word;
}

.user-group-section {
  margin-bottom: 24px;
}

.user-groups-label {
  margin-bottom: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.56);
}

.group-list {
  display: flex;
  flex-wrap: wrap;
}

.group-avatar {
  margin-right: 8px;
}

.close-button {
  position: sticky;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.user-operations-section {
  padding-top: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.16);
}

.user-operations-section-title {
  color: black;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: .01875em;
}

.user-operations-description {
  margin-bottom: 8px;
  font-size: 14px;
}

.user-operations-notify {
  margin: 15px 0;
}


</style>

