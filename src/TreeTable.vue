<template>
  <div>
    <div class="level-control">
      <button 
        v-for="level in maxLevel" 
        :key="level"
        @click="expandToLevel(level)"
      >
        展开到第{{level}}层
      </button>
      <button @click="collapseAll">全部收起</button>
    </div>
    
    <table class="tree-table">
      <thead>
        <tr>
          <th>名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tree-node
          v-for="node in processedData"
          :key="node.id"
          :node="node"
          :level="0"
          @toggle="toggleNode"
        ></tree-node>
      </tbody>
    </table>
  </div>
</template>

<script>
// 树节点组件
const TreeNode = {
  name: 'TreeNode',
  props: {
    node: Object,
    level: Number
  },
  methods: {
    handleToggle() {
      this.$emit('toggle', this.node)
    }
  },
  render(h) {
    const { node, level } = this
    const hasChildren = node.children && node.children.length > 0
    
    return h('div', [
      // 当前节点
      h('tr', {
        class: ['tree-node', { 'has-children': hasChildren }],
        style: { display: node.visible ? 'table-row' : 'none' }
      }, [
        h('td', {
          style: { paddingLeft: `${level * 20 + (hasChildren ? 0 : 20)}px` }
        }, [
          hasChildren && h('span', {
            class: 'toggle-icon',
            on: { click: this.handleToggle }
          }, node.expanded ? '▼' : '▶'),
          h('span', node.name)
        ]),
        h('td', [
          hasChildren && h('button', {
            on: { click: this.handleToggle }
          }, node.expanded ? '收起' : '展开')
        ])
      ]),
      
      // 子节点
      hasChildren && node.expanded && node.children.map(child => 
        h(TreeNode, {
          props: {
            node: child,
            level: level + 1
          },
          on: {
            toggle: this.$listeners.toggle
          }
        })
      )
    ])
  }
}

export default {
  name: 'TreeTable',
  components: {
    TreeNode
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      processedData: [],
      maxLevel: 0
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(newVal) {
        this.processData(newVal)
      }
    }
  },
  methods: {
    processData(data, level = 0, parentVisible = true) {
      return data.map(item => {
        const hasChildren = item.children && item.children.length > 0
        const node = {
          ...item,
          level,
          expanded: level === 0, // 默认展开第一级
          visible: parentVisible
        }
        
        if (hasChildren) {
          this.maxLevel = Math.max(this.maxLevel, level + 1)
          node.children = this.processData(item.children, level + 1, node.expanded && node.visible)
        }
        
        return node
      })
    },
    
    toggleNode(node) {
      node.expanded = !node.expanded
      this.updateChildrenVisibility(node, node.expanded)
      this.processedData = this.processData(this.data)
    },
    
    updateChildrenVisibility(node, visible) {
      if (node.children) {
        node.children.forEach(child => {
          child.visible = visible
          if (child.expanded) {
            this.updateChildrenVisibility(child, visible)
          }
        })
      }
    },
    
    expandToLevel(level) {
      const traverse = (nodes, currentLevel) => {
        nodes.forEach(node => {
          node.expanded = currentLevel < level
          if (node.children) {
            traverse(node.children, currentLevel + 1)
          }
        })
      }
      traverse(this.processedData, 0)
      this.processedData = this.processData(this.data)
    },
    
    collapseAll() {
      this.expandToLevel(0)
    }
  }
}
</script>

<style scoped>
.tree-table {
  width: 100%;
  border-collapse: collapse;
}

.tree-table th, .tree-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.toggle-icon {
  cursor: pointer;
  margin-right: 5px;
  display: inline-block;
  width: 16px;
}

.level-control {
  margin-bottom: 10px;
}

.level-control button {
  margin-right: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
