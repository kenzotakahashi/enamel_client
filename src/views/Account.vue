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
              <span class="title">Groups<span class="normal-weight">({{getGroups.length}})</span></span>
              <span class="create-group-button" @click="openGroupForm">
                <i class="fas fa-plus-circle"></i>                
              </span>
            </div>
          </div>

          <div v-for="(group, index) in groups" :key="index" v-bind:class="{selected: selected === index}">
            <span>{{group.name}}</span>
          </div>
        </el-col>

        <el-col :span="17" class="account-main-container">
          <div class="column-header">
            <div>
              <span class="title">{{groups[selected].name}}<span class="normal-weight">()</span></span>
              <el-button @click="" type="text">+ Add users</el-button>
            </div>
          </div>
          <div class="users-overview-items">
            <div class="users-overview-item" v-for="overview in usersOverviews">
              <div class="users-overview-count">
                {{getUsers.filter(o => overview.filter.includes(o.role)).length}}
              </div>
              <div class="users-overview-role">{{overview.name}}</div>
            </div>
          </div>
          <el-table
            :data="getUsers"
            style="width: 100%">
            <el-table-column
              type="selection">
            </el-table-column>
            <el-table-column
              label="NAME"
              sortable
              width="180">
              <template slot-scope="scope">
                <div>
                  <Avatar :user="scope.row" :size="24"></Avatar>
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

      <GroupForm v-if="showGroupForm" :team="modalConfig" @close="showGroupForm = false"></GroupForm>

    </el-main>

  </el-container>

</template>

<script>
import Navigation from '@/components/Navigation'
import Avatar from '@/components/Avatar'
import GroupForm from '@/components/GroupForm'
import { GetUsers, GetGroups } from '../constants/query.gql'

export default {
  components: {
    Navigation,
    Avatar,
    GroupForm
  },
  data() {
    return {
      selected: 0,
      showGroupForm: false,
      modalConfig: {},
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
      query: GetGroups
    }
  },
  methods: {
    openGroupForm() {
      this.showGroupForm = true
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

.selected {
  background-color: rgba(68, 136, 255, 0.16);
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.normal-weight {
  font-weight: 400;
}

.account-main-container {
  padding: 0 32px;
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
  /* font: 400 14px/ 1.57142857; */
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
