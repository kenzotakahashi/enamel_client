<template>
  <el-container>
    <el-header height="52px">
      <navigation></navigation>
    </el-header>

    <el-main>
      <el-row>
        <el-col :span="6" :offset="9" justify="center">
          <div>Welcome to enamel! Finish setting up your account</div>        

          <el-form ref="form" :model="form">
            <el-form-item>
              <label>First name</label>
              <el-input v-model="form.firstname" placeholder="Your first name"></el-input>
              <label>Last name</label>
              <el-input v-model="form.lastname" placeholder="Your last name"></el-input>
              <label>Password</label>
              <el-input v-model="form.password" placeholder="Password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="signup">Complete</el-button>
            </el-form-item>
          </el-form>

        </el-col>
      </el-row>
    </el-main>
  </el-container>

</template>

<script>
import { Signup } from '../constants/query.gql'

export default {
  data() {
    return {
      form: {
        firstname: '',
        lastname: '',
        password: '',
      }
    }
  },
  methods: {
    async signup() {
      // const validated = await this.$validator.validate()
      const { firstname, lastname, password } = this.form
      if (firstname && lastname && password) {
        this.$apollo.mutate({
          mutation: Signup,
          variables: {
            id: this.$route.params.id,
            firstname,
            lastname,
            password
          }
        }).then(({data: {signup}}) => {
          const id = signup.user.id
          const token = signup.token
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

.el-button {
  width: 100%;
}
</style>

