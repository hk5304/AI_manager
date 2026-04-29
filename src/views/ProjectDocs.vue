<template>
  <div class="project-docs">
    <div class="docs-header">
      <h1>项目文档</h1>
      <button class="create-btn">新建文档</button>
    </div>
    <div class="docs-list">
      <div class="doc-card" v-for="doc in docs" :key="doc.id">
        <div class="doc-icon">📄</div>
        <div class="doc-info">
          <h3>{{ doc.title }}</h3>
          <p>{{ doc.description }}</p>
          <div class="doc-meta">
            <span>{{ doc.author }}</span>
            <span>{{ doc.createTime }}</span>
          </div>
        </div>
        <div class="doc-actions">
          <button class="view-btn">查看</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const docs = ref([
  {
    id: 1,
    title: '项目需求文档',
    description: '详细的项目需求描述和功能规格',
    author: '孙七',
    createTime: '2026-04-01'
  },
  {
    id: 2,
    title: '技术架构设计',
    description: '系统技术架构和组件设计',
    author: '王五',
    createTime: '2026-04-05'
  },
  {
    id: 3,
    title: '测试计划',
    description: '项目测试策略和测试用例',
    author: '赵六',
    createTime: '2026-04-10'
  },
  {
    id: 4,
    title: '部署文档',
    description: '系统部署步骤和环境配置',
    author: '李四',
    createTime: '2026-04-15'
  }
])
</script>

<style scoped>
.project-docs {
  padding: 20px;
}

.docs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.docs-header h1 {
  font-size: 24px;
  color: #333;
}

.create-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.create-btn:hover {
  background-color: #66b1ff;
}

.docs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.doc-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 15px;
  transition: transform 0.2s;
}

.doc-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.doc-icon {
  font-size: 24px;
  margin-top: 2px;
}

.doc-info {
  flex: 1;
}

.doc-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.doc-info p {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.4;
}

.doc-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #909399;
}

.doc-actions {
  margin-left: 10px;
}

.view-btn {
  background-color: #f5f7fa;
  color: #409eff;
  border: 1px solid #dcdfe6;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  align-self: flex-start;
}

.view-btn:hover {
  background-color: #ecf5ff;
}
</style>