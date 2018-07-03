<template>
  <div class="comment-box container">
    <div class="columns">
      <span class="column col-10">
        <input type="text" name="comment" v-model="form.body"
          placeholder="Add comment"></input>        
      </span>
      <span class="column col-2">
        <span class="btn btn-primary btn-sm">Send</span>        
      </span>        
    </div>
  </div>
</template>

<script>

export default {
  // props: ['comments'],
  data() {
    return {
      form: {
        body: ''
      }
    }
  }
}

</script>

<style scoped>

</style>