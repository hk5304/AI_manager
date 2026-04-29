<template>
  <div class="admin-system">
    <div class="admin-header">
      <h1>系统配置</h1>
    </div>
    <div class="system-configs">
      <div class="config-section">
        <h2>AI 模型参数</h2>
        <div class="config-list">
          <div class="config-item" v-for="config in aiConfigs" :key="config.key">
            <label>{{ config.name }}</label>
            <input type="text" v-model="config.value">
            <button class="save-btn">保存</button>
          </div>
        </div>
      </div>
      <div class="config-section">
        <h2>通知模板</h2>
        <div class="config-list">
          <div class="config-item" v-for="template in notificationTemplates" :key="template.key">
            <label>{{ template.name }}</label>
            <textarea v-model="template.content"></textarea>
            <button class="save-btn">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const aiConfigs = ref([
  {
    key: 'ai_model',
    name: 'AI 模型',
    value: 'gpt-4'
  },
  {
    key: 'ai_temperature',
    name: '温度参数',
    value: '0.7'
  },
  {
    key: 'ai_max_tokens',
    name: '最大 tokens',
    value: '1000'
  }
])

const notificationTemplates = ref([
  {
    key: 'task_assign',
    name: '任务分配通知',
    content: '您有新的任务分配：{{task.title}}，请及时查看。'
  },
  {
    key: 'task_status',
    name: '任务状态变更通知',
    content: '任务 {{task.title}} 状态已变更为 {{status}}。'
  },
  {
    key: 'project_update',
    name: '项目更新通知',
    content: '项目 {{project.name}} 有新的更新，请及时查看。'
  }
])
</script>

<style scoped>
.admin-system {
  padding: 20px;
}

.admin-header {
  margin-bottom: 30px;
}

.admin-header h1 {
  font-size: 24px;
  color: #333;
}

.system-configs {
  space-y: 30px;
}

.config-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.config-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.config-list {
  space-y: 20px;
}

.config-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.config-item label {
  width: 150px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-top: 8px;
}

.config-item input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.config-item textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
}

.save-btn {
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  align-self: flex-start;
  margin-top: 8px;
}

.save-btn:hover {
  background-color: #66b1ff;
}
</style>