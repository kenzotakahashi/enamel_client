<template>
  <div class="container">
    <h2>Enamel</h2>
    <h4>Workspace</h4>
    <div class="columns">
      <div class="column col-3">
        <Tree
          class="item"
          :model="treeData">
        </Tree>
      </div>
      <div class="column col-9">
      </div>
    </div>
  </div>
</template>

<script>
import Tree from '@/components/Tree'

var data = {
  name: 'My Tree',
  children: [
    { name: 'hello' },
    { name: 'wat' },
    {
      name: 'child folder',
      children: [
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        },
        { name: 'hello' },
        { name: 'wat' },
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        }
      ]
    }
  ]
}

export default {
  components: {
    Tree
  },
  data() {
    return {
      treeData: data
    }
  },
  methods: {
  }
}
</script>


