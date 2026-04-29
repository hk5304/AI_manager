<template>
  <div class="task-detail">
    <div class="task-header">
      <h1>{{ task.title }}</h1>
      <div class="task-actions">
        <button class="edit-btn">编辑</button>
        <button class="delete-btn">删除</button>
      </div>
    </div>
    <div class="task-info">
      <div class="info-section">
        <div class="info-item">
          <label>状态：</label>
          <span class="status-tag" :class="task.status">{{ task.status }}</span>
          <div class="status-buttons">
            <button class="status-btn" v-for="status in statuses" :key="status.value" :class="{ active: task.status === status.value }">
              {{ status.label }}
            </button>
          </div>
        </div>
        <div class="info-item">
          <label>优先级：</label>
          <span class="priority-tag" :class="task.priority">{{ task.priority }}</span>
        </div>
        <div class="info-item">
          <label>负责人：</label>
          <div class="assignee">
            <div class="avatar" :style="{ backgroundColor: task.avatarColor }">{{ task.assignee.charAt(0) }}</div>
            <span>{{ task.assignee }}</span>
          </div>
        </div>
        <div class="info-item">
          <label>截止日期：</label>
          <span>{{ task.deadline }}</span>
        </div>
        <div class="info-item">
          <label>项目：</label>
          <span>{{ task.project }}</span>
        </div>
      </div>
      <div class="description-section">
        <h2>描述</h2>
        <p>{{ task.description }}</p>
      </div>
    </div>
    <div class="subtasks-section">
      <h2>子任务</h2>
      <div class="subtask-list">
        <div class="subtask-item" v-for="subtask in task.subtasks" :key="subtask.id">
          <input type="checkbox" v-model="subtask.completed">
          <span>{{ subtask.title }}</span>
          <span class="subtask-status">{{ subtask.completed ? '已完成' : '未完成' }}</span>
        </div>
        <button class="add-subtask-btn">+ 添加子任务</button>
      </div>
    </div>
    <div class="comments-section">
      <h2>评论</h2>
      <div class="comment-list">
        <div class="comment-item" v-for="comment in task.comments" :key="comment.id">
          <div class="comment-avatar" :style="{ backgroundColor: comment.avatarColor }">{{ comment.author.charAt(0) }}</div>
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <p>{{ comment.content }}</p>
          </div>
        </div>
      </div>
      <div class="comment-form">
        <input type="text" placeholder="添加评论..." v-model="newComment">
        <button class="submit-comment-btn">发送</button>
      </div>
    </div>
    <div class="ai-assistant">
      <h3>AI 助手</h3>
      <div class="ai-suggestions">
        <div class="ai-card">
          <h4>任务拆解建议</h4>
          <p>{{ aiSuggestions.breakdown }}</p>
        </div>
        <div class="ai-card">
          <h4>排期建议</h4>
          <p>{{ aiSuggestions.scheduling }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const task = ref({
  id: 1,
  title: '完成登录页面开发',
  status: 'in_progress',
  priority: 'high',
  assignee: '张三',
  avatarColor: '#409eff',
  deadline: '2026-04-26',
  project: 'AI项目管理系统',
  description: '开发系统登录页面，包括账号密码登录、第三方登录（企微/钉钉）、注册入口和忘记密码功能。',
  subtasks: [
    { id: 1, title: '实现账号密码登录表单', completed: true },
    { id: 2, title: '集成企微扫码登录', completed: false },
    { id: 3, title: '集成钉钉扫码登录', completed: false },
    { id: 4, title: '添加注册入口', completed: true },
    { id: 5, title: '添加忘记密码功能', completed: false }
  ],
  comments: [
    {
      id: 1,
      author: '李四',
      avatarColor: '#67c23a',
      content: '登录页面需要支持记住密码功能',
      time: '2026-04-24 10:00'
    },
    {
      id: 2,
      author: '张三',
      avatarColor: '#409eff',
      content: '好的，我会添加记住密码功能',
      time: '2026-04-24 10:30'
    }
  ]
})

const statuses = ref([
  { value: 'todo', label: '待开始' },
  { value: 'in_progress', label: '进行中' },
  { value: 'review', label: '待评审' },
  { value: 'done', label: '已完成' },
  { value: 'blocked', label: '已阻塞' }
])

const newComment = ref('')

const aiSuggestions = ref({
  breakdown: '建议将任务拆分为：1. 设计登录页面UI；2. 实现表单验证；3. 集成第三方登录；4. 测试登录功能。',
  scheduling: '建议排期：设计UI (1天) + 实现表单 (1天) + 集成第三方登录 (1天) + 测试 (0.5天)，总计3.5天。'
})
</script>

<style scoped>
.task-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.task-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.task-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.edit-btn {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.edit-btn:hover {
  background-color: #66b1ff;
}

.delete-btn {
  background-color: #fef0f0;
  color: #f56c6c;
  border-color: #fbc4c4;
}

.delete-btn:hover {
  background-color: #fde2e2;
}

.task-info {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.info-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-item {
  margin-bottom: 20px;
}

.info-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.status-tag, .priority-tag {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.in_progress {
  background-color: #f0f9eb;
  color: #67c23a;
}

.priority-tag.high {
  background-color: #fef0f0;
  color: #f56c6c;
}

.status-buttons {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.status-btn {
  padding: 4px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 12px;
  background-color: white;
  cursor: pointer;
}

.status-btn.active {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.assignee {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.description-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.description-section h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.description-section p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.subtasks-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.subtasks-section h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.subtask-list {
  space-y: 10px;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 10px;
}

.subtask-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.subtask-item span {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.subtask-status {
  font-size: 12px;
  color: #909399;
}

.add-subtask-btn {
  width: 100%;
  padding: 10px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  background-color: #f5f7fa;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
}

.add-subtask-btn:hover {
  background-color: #ecf5ff;
}

.comments-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.comments-section h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.comment-list {
  space-y: 15px;
  margin-bottom: 20px;
}

.comment-item {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.comment-author {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #909399;
}

.comment-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.comment-form {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.comment-form input {
  flex: 1;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.submit-comment-btn {
  padding: 0 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.submit-comment-btn:hover {
  background-color: #66b1ff;
}

.ai-assistant {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.ai-assistant h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.ai-suggestions {
  space-y: 15px;
}

.ai-card {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.ai-card h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.ai-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}
</style>