<template>
  <el-container>
    <el-header height="56px">
      <el-row>
        <el-col :span="2">
          <div class="logo">enamel</div>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-row>
        <el-col :span="6" :offset="9" justify="center">
          <h2>Login</h2>

          <el-form ref="form" :model="form">
            <el-form-item>
              <label>Email</label>
              <el-input v-model="form.email" placeholder="Email"></el-input>
              <label>Password</label>
              <el-input v-model="form.password" placeholder="Password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login">Login</el-button>
            </el-form-item>
          </el-form>

        </el-col>
      </el-row>
    </el-main>
  </el-container>

</template>

<script>
import { Login } from '../constants/query.gql'

export default {
  components: {
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
      }
    }
  },
  methods: {
    async login() {
      const validated = await this.$validator.validate()
      const { email, password } = this.form
      if (validated && email && password) {
        this.$apollo.mutate({
          mutation: Login,
          variables: { email, password }
        }).then(async (data) => {
          const login = data.data.login
          const id = login.user.id
          const token = login.token
          this.saveUserData(id, token)
          this.$router.push({name: 'workspace'})
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    saveUserData (id, token) {
      localStorage.setItem('user-id', id)
      localStorage.setItem('user-token', token)
      this.$root.$data.userId = localStorage.getItem('user-id')
    },
  }
}
</script>

<style scoped>
label {
  text-align: left;
}
</style>
