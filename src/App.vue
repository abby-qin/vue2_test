<template>
  <div id="app">
    <TreeTable :data="treeData" />
  </div>
</template>

<script>
import TreeTable from './TreeTable.vue'

export default {
  components: {
    TreeTable
  },
  data() {
    return {
      treeData: [
        {
          id: 1,
          name: '一级节点1',
          children: [
            {
              id: 2,
              name: '二级节点1',
              children: [
                { id: 3, name: '三级节点1' },
                { id: 4, name: '三级节点2' }
              ]
            },
            { id: 5, name: '二级节点2' }
          ]
        },
        {
          id: 6,
          name: '一级节点2',
          children: [
            { id: 7, name: '二级节点3' }
          ]
        }
      ]
    }
  }
}
</script>
