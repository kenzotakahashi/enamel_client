<template>
  <div class="container">
    <h2>enamel</h2>
    <div class="columns">
      <div class="column col-4 col-mx-auto">
        <div>Enter your email address to start free trial</div>
        <div class="form-group">
          <label class="form-label" for="email-1">Email</label>
          <input class="form-input" type="email" id="email-1" v-model="form.email" placeholder="Email">
          <button class="btn btn-primary" @click="capture">Create my enamel account</button>
        </div>

        <div v-if="submitted">
          <div>Thank you!</div>
          <router-link :to="{name: 'signup', params: {id}}">Set up my account</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CaptureEmail } from '../constants/query.gql'

export default {
  components: {
  },
  data() {
    return {
      submitted: false,
      id: '',
      form: {
        email: '',
      }
    }
  },
  methods: {
    async capture() {
      const validated = await this.$validator.validate()
      const {email} = this.form
      if (validated && email) {
        this.$apollo.mutate({
          mutation: CaptureEmail,
          variables: {email}
        }).then(({data}) => {
          this.submitted = true
          this.id = data.captureEmail.id
        }).catch((error) => {
          console.log(error)
        })
      }
    },
  }
}
</script>
