<template>
  <el-container>
    <el-header height="52px">
      <Navigation></Navigation>
    </el-header>

    <el-main class="white account" :style="styleObj">
      <h2 class="users-and-groups-header">Users & Groups</h2>
      <el-row>
        <el-col :span="7">
          <div class="column-header">
            <div>
              <!-- <i class="fas fa-search"></i> -->
              <span class="title">Groups<span class="count-title">({{getGroups.length}})</span></span>
              <span class="create-group-button" @click="showGroupForm = true">
                <i class="fas fa-plus-circle"></i>                
              </span>
            </div>
          </div>

          <div v-for="(group, index) in groups" :key="index"
            class="group-list-item" v-bind:class="{selected: selected === index}"
            @click="changeView(index)">
            <span class="name">{{group.name}}</span>
            <span class="member-count">{{index ? ungroupedUsers.length : getUsers.length}}</span>
          </div>
          <div v-for="(group, index) in getGroups" :key="index+2"
            class="group-list-item" v-bind:class="{selected: selected === index+2}"
            @click="changeView(index+2)">
            <Avatar class="avatar" :manual="group" :size="24"></Avatar>
            <span class="name">{{group.name}}</span>
            <span class="member-count">{{group.users.length}}</span>
          </div>
        </el-col>

        <el-col :span="17" class="account-main-container">
          <div class="column-header">
            <div>
              <span class="title">{{groupName}}<span class="count-title">({{users.length}})</span></span>
              <el-button v-show="selected !== 1" type="text" class="text-button"
                @click="openInviteUserForm">+ Add users</el-button>
              <el-button v-show="selected >= 2" type="text" class="text-button"
                @click="">
                <!-- <i class="fas fa-sliders-h"></i> -->
                <i class="fas fa-cog"></i>
                 Group settings
               </el-button>
            </div>
          </div>
          <div class="users-overview-items">
            <div class="users-overview-item" v-for="overview in usersOverviews">
              <div class="users-overview-count">
                {{users.filter(o => overview.filter.includes(o.role)).length}}
              </div>
              <div class="users-overview-role">{{overview.name}}</div>
            </div>
          </div>
          <el-table
            :data="users"
            empty-text="No users"
            style="width: 100%">
            <el-table-column
              type="selection">
            </el-table-column>
            <el-table-column
              label="NAME"
              sortable
              width="180">
              <template slot-scope="scope">
                <div class="user-container">
                  <Avatar class="avatar" :user="scope.row" :size="24"></Avatar>
                  {{scope.row.name}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="email"
              label="EMAIL"
              sortable
              width="180">
            </el-table-column>
            <el-table-column
              prop="role"
              label="ROLE"
              sortable>
            </el-table-column>
            <el-table-column
              prop="status"
              label="STATUS"
              sortable>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <GroupForm v-if="showGroupForm" :users="getUsers" @close="showGroupForm = false"></GroupForm>
      <InviteUserForm v-if="showInviteUserForm" :groups="getGroups"
        @close="showInviteUserForm = false"></InviteUserForm>

    </el-main>

  </el-container>

</template>

<script>
import Navigation from '@/components/Navigation'
import Avatar from '@/components/Avatar'
import GroupForm from '@/components/GroupForm'
import InviteUserForm from '@/components/InviteUserForm'
import { GetUsers, GetGroups } from '../constants/query.gql'

export default {
  components: {
    Navigation,
    Avatar,
    GroupForm,
    InviteUserForm
  },
  data() {
    return {
      selected: 0,
      showGroupForm: false,
      showInviteUserForm: false,
      groups: [
        {
          name: 'All users'
        },
        {
          name: 'Ungrouped'
        }
      ],
      usersOverviews: [
        {
          name: 'Administrators',
          filter: ['Owner', 'Administrator']
        },
        {
          name: 'Regular Users',
          filter: ['Regular User']
        },
        {
          name: 'External Users',
          filter: ['External User']
        },
        {
          name: 'Collaborators',
          filter: ['Collaborator']
        },
      ],
      getUsers: [],
      getGroups: [],
      styleObj: {
        position: "absolute",
        left: "0px",
        top: "52px",
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight - 52}px`
      }
    }
  },
  apollo: {
    getUsers: {
      query: GetUsers
    },
    getGroups: {
      query: GetGroups,
      // result({data: {getGroups}}) {
      //   this.groups = this.groups.concat(getGroups)
      // },
    }
  },
  computed: {
    users() {
      if (this.selected === 0) {
        return this.getUsers
      } else if (this.selected === 1) {
        return this.ungroupedUsers
      } else {
        return this.getUsers.filter(o => this.getGroups[this.selected-2].users.includes(o.id))
      }
    },
    ungroupedUsers() {
      const members = [].concat(...this.getGroups.map(o => o.users))
      return this.getUsers.filter(o => !members.includes(o.id))
    },
    groupName() {
      const group = this.selected < 2 ? this.groups[this.selected] : this.getGroups[this.selected-2]
      return group.name
    },
  },
  methods: {
    openInviteUserForm() {
      this.showInviteUserForm = true
    },
    changeView(index) {
      this.selected = index
    }
  }
}
</script>

<style scoped>
.column-header {
  margin-bottom: 15px;
}

.users-and-groups-header {
  margin-bottom: 15px;
}

.selected, .selected:hover {
  background-color: rgba(68, 136, 255, 0.16);
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.count-title {
  color: #50596c;
  margin-left: 4px;
  font-weight: 400;
}

.account-main-container {
  padding: 0 32px;
}

.text-button {
  padding: 0;
  margin-left: 16px;
}

.avatar {
  margin-right: 8px;
}

.name {
  flex-grow: 1;
}

.member-count {
  width: 5px;
  color: rgba(0, 0, 0, 0.32);
}

.users-overview-items {
  display: flex;
  padding-top: 16px;
}

.users-overview-item {
  max-width: 184px;
  padding: 8px 24px 8px 16px;
  margin-right: 16px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 2px;
  -webkit-font-smoothing: antialiased;
  cursor: pointer;
  user-select: none;
}

.users-overview-item:hover, .users-overview-item:hover .users-overview-role {
  color: #409EFF;
  border-color: #409EFF;
}

.users-overview-count {
  font-weight: 600;
}

.users-overview-role {
  color: rgba(0, 0, 0, 0.56);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.create-group-button {
  float: right;
  cursor: pointer;
}

</style>
