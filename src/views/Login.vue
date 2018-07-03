<template>
  <div class="container">
    <h2>enamel</h2>
    <div class="columns">
      <div class="column col-4 col-mx-auto">
        <div>Login</div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" type="email" v-model="form.email" placeholder="Email">
          <label class="form-label">Password</label>
          <input class="form-input" type="password" v-model="form.password" placeholder="Password">
        </div>
        <button class="btn btn-primary" @click="login">Login</button>
      </div>
    </div>
  </div>
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
      console.log(this.$apollo)
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
