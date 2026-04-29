<template>
  <div class="project-risk">
    <div class="risk-header">
      <h1>项目风险看板</h1>
      <button class="add-risk-btn">新增风险</button>
    </div>
    <div class="risk-list">
      <div class="risk-item" v-for="risk in risks" :key="risk.id">
        <div class="risk-header">
          <h2>{{ risk.title }}</h2>
          <span class="risk-level" :class="risk.level">
            {{ risk.level }}
          </span>
        </div>
        <div class="risk-info">
          <p><strong>描述：</strong>{{ risk.description }}</p>
          <p><strong>状态：</strong>{{ risk.status }}</p>
          <p><strong>负责人：</strong>{{ risk.owner }}</p>
          <p><strong>创建时间：</strong>{{ risk.createTime }}</p>
        </div>
        <div class="risk-actions">
          <button class="analyze-btn">AI 根因分析</button>
          <button class="edit-btn">编辑</button>
        </div>
        <div class="ai-analysis" v-if="risk.showAnalysis">
          <h3>AI 根因分析</h3>
          <p>{{ risk.aiAnalysis }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const risks = ref([
  {
    id: 1,
    title: '部分任务进度落后',
    description: '前端开发任务进度落后于计划，可能影响整体项目交付',
    level: 'high',
    status: '待处理',
    owner: '张三',
    createTime: '2026-04-25',
    showAnalysis: false,
    aiAnalysis: '根因分析：1. 任务分配不合理，部分开发人员负载过重；2. 需求变更频繁，导致开发任务反复调整；3. 技术难点未及时解决，影响开发效率。建议：重新评估任务分配，建立需求变更管理流程，及时组织技术评审解决难点。'
  },
  {
    id: 2,
    title: '测试资源不足',
    description: '测试人员数量不足，可能无法完成全面的测试覆盖',
    level: 'medium',
    status: '处理中',
    owner: '李四',
    createTime: '2026-04-24',
    showAnalysis: false,
    aiAnalysis: '根因分析：1. 测试团队人员配置不足；2. 测试计划制定不合理，时间估算不足；3. 测试环境搭建延迟。建议：临时增加测试人员，优化测试计划，提前准备测试环境。'
  },
  {
    id: 3,
    title: '技术依赖风险',
    description: '项目依赖的第三方库可能存在兼容性问题',
    level: 'low',
    status: '已解决',
    owner: '王五',
    createTime: '2026-04-20',
    showAnalysis: false,
    aiAnalysis: '根因分析：1. 依赖库版本选择不当；2. 缺乏依赖库兼容性测试。建议：建立依赖库管理机制，定期进行兼容性测试，选择稳定版本的依赖库。'
  }
])

const toggleAnalysis = (riskId) => {
  const risk = risks.value.find(r => r.id === riskId)
  if (risk) {
    risk.showAnalysis = !risk.showAnalysis
  }
}
</script>

<style scoped>
.project-risk {
  padding: 20px;
}

.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.risk-header h1 {
  font-size: 24px;
  color: #333;
}

.add-risk-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.add-risk-btn:hover {
  background-color: #66b1ff;
}

.risk-list {
  space-y: 20px;
}

.risk-item {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.risk-item .risk-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.risk-item .risk-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.risk-level {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.risk-level.high {
  background-color: #fef0f0;
  color: #f56c6c;
}

.risk-level.medium {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.risk-level.low {
  background-color: #f0f9eb;
  color: #67c23a;
}

.risk-info p {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.risk-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.analyze-btn, .edit-btn {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.analyze-btn {
  background-color: #f5f7fa;
  color: #409eff;
}

.analyze-btn:hover {
  background-color: #ecf5ff;
}

.edit-btn {
  background-color: white;
  color: #606266;
}

.edit-btn:hover {
  background-color: #f5f7fa;
}

.ai-analysis {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.ai-analysis h3 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.ai-analysis p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>