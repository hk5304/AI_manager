<template>
  <div class="project-detail">
    <div class="project-header">
      <div class="project-info">
        <h1>{{ project.name }}</h1>
        <div class="project-meta">
          <span class="status-tag" :class="project.status">
            {{ project.status }}
          </span>
          <span class="health-tag" :class="project.health">
            {{ project.healthText }}
          </span>
          <span class="owner">负责人：{{ project.owner }}</span>
          <span class="date">
            {{ project.startDate }} - {{ project.endDate }}
          </span>
          <span class="members">成员：{{ project.memberCount }}人</span>
        </div>
        <div class="project-description">
          {{ project.description }}
        </div>
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
          </div>
          <span class="progress-text">{{ project.progress }}%</span>
        </div>
        <div class="project-tags">
          <span class="tag" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
      <div class="project-actions">
        <button class="edit-btn" v-permission="'project:edit'">编辑</button>
        <button class="archive-btn" v-permission="'project:archive'">归档</button>
        <button class="delete-btn" v-permission="'project:delete'">删除</button>
      </div>
    </div>
    <div class="ai-risk-alert" v-if="project.aiRisk">
      <span>⚠️ AI 风险提示：{{ project.aiRisk }}</span>
      <button class="close-btn">×</button>
    </div>
    <div class="project-tabs">
      <div class="tab-buttons">
        <router-link :to="`/project/${projectId}/kanban`" class="tab-btn" :class="{ active: isActiveTab('kanban') }">看板</router-link>
        <router-link :to="`/project/${projectId}/gantt`" class="tab-btn" :class="{ active: isActiveTab('gantt') }">甘特图</router-link>
        <router-link :to="`/project/${projectId}/risk`" class="tab-btn" :class="{ active: isActiveTab('risk') }">风险</router-link>
        <router-link :to="`/project/${projectId}/members`" class="tab-btn" :class="{ active: isActiveTab('members') }">成员</router-link>
        <router-link :to="`/project/${projectId}/docs`" class="tab-btn" :class="{ active: isActiveTab('docs') }">文档</router-link>
        <router-link to="/reports" class="tab-btn" :class="{ active: isActiveTab('reports') }">报表</router-link>
      </div>
    </div>
    <div class="project-content">
      <div class="milestones-section">
        <h2>里程碑</h2>
        <div class="milestones-list">
          <div class="milestone-card" v-for="milestone in project.milestones" :key="milestone.id">
            <div class="milestone-header">
              <h3>{{ milestone.name }}</h3>
              <span class="milestone-status" :class="milestone.status">
                {{ milestone.status }}
              </span>
            </div>
            <div class="milestone-info">
              <p><strong>负责人：</strong>{{ milestone.owner }}</p>
              <p><strong>时间：</strong>{{ milestone.startDate }} - {{ milestone.endDate }}</p>
              <p><strong>进度：</strong>{{ milestone.progress }}%</p>
            </div>
            <div class="milestone-description">
              {{ milestone.description }}
            </div>
          </div>
        </div>
        <button class="add-milestone-btn" v-permission="'milestone:create'">添加里程碑</button>
      </div>
      <div class="tasks-section">
        <h2>最近任务</h2>
        <div class="tasks-list">
          <div class="task-card" v-for="task in recentTasks" :key="task.id">
            <div class="task-header">
              <h3>{{ task.title }}</h3>
              <span class="task-priority" :class="task.priority">
                {{ task.priority }}
              </span>
            </div>
            <div class="task-info">
              <p><strong>负责人：</strong>{{ task.assignee }}</p>
              <p><strong>状态：</strong>{{ task.status }}</p>
              <p><strong>截止日期：</strong>{{ task.deadline }}</p>
            </div>
          </div>
        </div>
        <router-link :to="`/project/${projectId}/kanban`" class="view-all-tasks">查看所有任务</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const projectId = computed(() => route.params.id)

const project = ref({
  id: 1,
  name: 'AI项目管理系统',
  status: '进行中',
  health: 'green',
  healthText: '健康',
  owner: '张三',
  startDate: '2026-04-01',
  endDate: '2026-06-30',
  progress: 60,
  memberCount: 8,
  description: '基于Vue3开发的AI驱动型内部研发项目协作管理系统，包含项目管理、成员管理、个人工作台、项目报表等模块。',
  tags: ['AI', '项目管理', '前端'],
  aiRisk: '部分任务进度落后，可能影响项目按时交付',
  milestones: [
    {
      id: 1,
      name: '需求分析与设计',
      description: '完成项目需求分析和系统设计',
      owner: '李四',
      startDate: '2026-04-01',
      endDate: '2026-04-15',
      status: '已完成',
      progress: 100
    },
    {
      id: 2,
      name: '核心功能开发',
      description: '开发项目管理、成员管理、个人工作台等核心功能',
      owner: '张三',
      startDate: '2026-04-16',
      endDate: '2026-05-31',
      status: '进行中',
      progress: 60
    },
    {
      id: 3,
      name: '测试与优化',
      description: '进行系统测试和性能优化',
      owner: '王五',
      startDate: '2026-06-01',
      endDate: '2026-06-20',
      status: '待开始',
      progress: 0
    },
    {
      id: 4,
      name: '上线部署',
      description: '系统上线部署和运维',
      owner: '张三',
      startDate: '2026-06-21',
      endDate: '2026-06-30',
      status: '待开始',
      progress: 0
    }
  ]
})

const recentTasks = ref([
  {
    id: 1,
    title: '完成项目矩阵列表页面',
    assignee: '张三',
    status: '已完成',
    priority: 'P1',
    deadline: '2026-05-10'
  },
  {
    id: 2,
    title: '实现权限控制功能',
    assignee: '李四',
    status: '已完成',
    priority: 'P1',
    deadline: '2026-05-15'
  },
  {
    id: 3,
    title: '开发项目详情页',
    assignee: '王五',
    status: '进行中',
    priority: 'P0',
    deadline: '2026-05-20'
  },
  {
    id: 4,
    title: '实现甘特图功能',
    assignee: '张三',
    status: '待开始',
    priority: 'P2',
    deadline: '2026-05-25'
  }
])

const isActiveTab = (tab) => {
  return route.path.includes(tab)
}
</script>

<style scoped>
.project-detail {
  padding: 20px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  flex-wrap: wrap;
  gap: 20px;
}

.project-info {
  flex: 1;
  min-width: 300px;
}

.project-info h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.status-tag, .health-tag {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.进行中 {
  background-color: #f0f9eb;
  color: #52C41A;
}

.status-tag.已完成 {
  background-color: #ecf5ff;
  color: #1890FF;
}

.status-tag.已归档 {
  background-color: #f5f7fa;
  color: #909399;
}

.health-tag.green {
  background-color: #f0f9eb;
  color: #52C41A;
}

.health-tag.yellow {
  background-color: #fdf6ec;
  color: #FAAD14;
}

.health-tag.red {
  background-color: #fef0f0;
  color: #FF4D4F;
}

.owner, .date, .members {
  font-size: 14px;
  color: #666;
}

.project-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 300px;
  margin-bottom: 15px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #1890FF;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #666;
  min-width: 50px;
}

.project-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.project-tags .tag {
  padding: 4px 12px;
  background-color: #f0f2f5;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
}

.project-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.edit-btn, .archive-btn, .delete-btn {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.edit-btn {
  background-color: #1890FF;
  color: white;
  border-color: #1890FF;
}

.edit-btn:hover {
  background-color: #40a9ff;
}

.archive-btn {
  background-color: #f5f7fa;
  color: #606266;
}

.archive-btn:hover {
  background-color: #e4e7ed;
}

.delete-btn {
  background-color: #fef0f0;
  color: #FF4D4F;
  border-color: #fbc4c4;
}

.delete-btn:hover {
  background-color: #fde2e2;
}

.ai-risk-alert {
  background-color: #fdf6ec;
  border: 1px solid #fde2cf;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-risk-alert span {
  font-size: 14px;
  color: #FAAD14;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #909399;
}

.project-tabs {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.tab-buttons {
  display: flex;
  gap: 20px;
}

.tab-btn {
  padding: 10px 0;
  border: none;
  background: none;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  position: relative;
  text-decoration: none;
}

.tab-btn.active {
  color: #1890FF;
  font-weight: 500;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #1890FF;
}

.tab-btn:hover {
  color: #1890FF;
}

.project-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .project-content {
    grid-template-columns: 1fr;
  }
}

.milestones-section, .tasks-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.milestones-section h2, .tasks-section h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.milestones-list, .tasks-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.milestone-card, .task-card {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 15px;
  transition: box-shadow 0.3s;
}

.milestone-card:hover, .task-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.milestone-header, .task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.milestone-header h3, .task-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.milestone-status, .task-priority {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.milestone-status.已完成 {
  background-color: #f0f9eb;
  color: #52C41A;
}

.milestone-status.进行中 {
  background-color: #ecf5ff;
  color: #1890FF;
}

.milestone-status.待开始 {
  background-color: #f5f7fa;
  color: #909399;
}

.task-priority.P0 {
  background-color: #fef0f0;
  color: #FF4D4F;
}

.task-priority.P1 {
  background-color: #fdf6ec;
  color: #FAAD14;
}

.task-priority.P2 {
  background-color: #ecf5ff;
  color: #1890FF;
}

.task-priority.P3 {
  background-color: #f5f7fa;
  color: #909399;
}

.milestone-info, .task-info {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}

.milestone-info p, .task-info p {
  margin: 5px 0;
}

.milestone-description {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.add-milestone-btn {
  background-color: #f5f7fa;
  color: #1890FF;
  border: 1px solid #dcdfe6;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  text-align: center;
}

.add-milestone-btn:hover {
  background-color: #ecf5ff;
}

.view-all-tasks {
  display: block;
  text-align: center;
  color: #1890FF;
  font-size: 14px;
  text-decoration: none;
  margin-top: 10px;
}

.view-all-tasks:hover {
  text-decoration: underline;
}
</style>