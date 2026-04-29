<template>
  <div class="reports">
    <div class="reports-header">
      <h1>项目报表</h1>
    </div>
    <div class="reports-tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'progress' }" @click="activeTab = 'progress'">进度报表</button>
      <button class="tab-btn" :class="{ active: activeTab === 'workload' }" @click="activeTab = 'workload'">工时报表</button>
      <button class="tab-btn" :class="{ active: activeTab === 'quality' }" @click="activeTab = 'quality'">质量报表</button>
    </div>
    <div class="reports-toolbar">
      <div class="filter-box">
        <select v-model="timeRange">
          <option value="week">近一周</option>
          <option value="month">近一个月</option>
          <option value="quarter">近一季度</option>
          <option value="year">近一年</option>
        </select>
        <select v-model="projectFilter">
          <option value="">全部项目</option>
          <option value="1">AI项目管理系统</option>
          <option value="2">智能客服系统</option>
          <option value="3">数据可视化平台</option>
        </select>
        <select v-model="memberFilter">
          <option value="">全部成员</option>
          <option value="1">张三</option>
          <option value="2">李四</option>
          <option value="3">王五</option>
        </select>
      </div>
      <div class="action-buttons">
        <button class="export-btn" v-permission="'report:export'">导出 CSV</button>
        <button class="export-btn" v-permission="'report:export'">导出 PDF</button>
        <button class="subscribe-btn" v-permission="'report:subscribe'">定时订阅</button>
      </div>
    </div>
    <div class="ai-insight-card">
      <div class="insight-content">
        <h3>AI 洞察</h3>
        <p>{{ aiInsight }}</p>
      </div>
      <div class="insight-actions">
        <button class="like-btn" :class="{ liked: insightLiked }" @click="toggleInsightLike">👍</button>
        <button class="dislike-btn" :class="{ disliked: insightDisliked }" @click="toggleInsightDislike">👎</button>
      </div>
    </div>
    <!-- 进度报表 -->
    <div v-if="activeTab === 'progress'" class="chart-container">
      <div class="chart">
        <h3>项目进度燃尽图</h3>
        <div class="chart-placeholder">
          <div style="height: 400px; background-color: #f5f7fa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #909399;">
            燃尽图图表区域
          </div>
        </div>
      </div>
      <div class="chart">
        <h3>里程碑达成率</h3>
        <div class="chart-placeholder">
          <div style="height: 400px; background-color: #f5f7fa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #909399;">
            饼图图表区域
          </div>
        </div>
      </div>
      <div class="chart">
        <h3>任务完成趋势</h3>
        <div class="chart-placeholder">
          <div style="height: 400px; background-color: #f5f7fa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #909399;">
            折线图图表区域
          </div>
        </div>
      </div>
    </div>
    <!-- 工时报表 -->
    <div v-if="activeTab === 'workload'" class="chart-container">
      <div class="chart">
        <h3>计划 vs 实际工时对比</h3>
        <div class="chart-placeholder">
          <div style="height: 400px; background-color: #f5f7fa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #909399;">
            柱状图图表区域
          </div>
        </div>
      </div>
      <div class="chart">
        <h3>成员负载分布</h3>
        <div class="chart-placeholder">
          <div style="height: 400px; background-color: #f5f7fa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #909399;">
            热力图图表区域
          </div>
        </div>
      </div>
    </div>
    <!-- 质量报表 -->
    <div v-if="activeTab === 'quality'" class="chart-container">
      <div class="chart">
        <h3>Bug 趋势</h3>
        <div class="chart-placeholder">
          <div style="height: 400px; background-color: #f5f7fa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #909399;">
            折线图图表区域
          </div>
        </div>
      </div>
      <div class="chart">
        <h3>阻塞时长分析</h3>
        <div class="chart-placeholder">
          <div style="height: 400px; background-color: #f5f7fa; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #909399;">
            柱状图图表区域
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { reports } from '../data/mockData.js'

const activeTab = ref('progress')
const timeRange = ref('month')
const projectFilter = ref('')
const memberFilter = ref('')
const insightLiked = ref(false)
const insightDisliked = ref(false)

// 根据报表数据生成AI洞察
const generateInsight = () => {
  const progressData = reports.progress
  const latestProgress = progressData[progressData.length - 1].value
  const workloadData = reports.workload
  const maxWorkload = Math.max(...workloadData.map(item => item.value))
  const qualityData = reports.quality
  const latestBugs = qualityData[qualityData.length - 1].bugs
  
  let insight = ''
  if (latestProgress > 80) {
    insight += '项目整体进度良好，已完成80%以上。'
  } else if (latestProgress > 50) {
    insight += '项目进度适中，已完成50-80%。'
  } else {
    insight += '项目进度较慢，建议加快推进。'
  }
  
  if (maxWorkload > 160) {
    insight += '部分成员工作负载较重，建议合理分配任务。'
  }
  
  if (latestBugs < 5) {
    insight += 'Bug数量较少，代码质量良好。'
  } else {
    insight += 'Bug数量较多，建议加强代码审查。'
  }
  
  return insight
}

const aiInsight = ref(generateInsight())

const toggleInsightLike = () => {
  insightLiked.value = !insightLiked.value
  if (insightLiked.value) {
    insightDisliked.value = false
  }
}

const toggleInsightDislike = () => {
  insightDisliked.value = !insightDisliked.value
  if (insightDisliked.value) {
    insightLiked.value = false
  }
}
</script>

<style scoped>
.reports {
  padding: 20px;
}

.reports-header {
  margin-bottom: 30px;
}

.reports-header h1 {
  font-size: 24px;
  color: #333;
}

.reports-tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #f0f2f5;
}

.tab-btn {
  padding: 10px 0;
  border: none;
  background: none;
  font-size: 16px;
  color: #606266;
  cursor: pointer;
  position: relative;
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

.reports-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-box {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-box select {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  min-width: 120px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.export-btn, .subscribe-btn {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.export-btn {
  background-color: #f5f7fa;
  color: #606266;
}

.export-btn:hover {
  background-color: #e4e7ed;
}

.subscribe-btn {
  background-color: #1890FF;
  color: white;
  border-color: #1890FF;
}

.subscribe-btn:hover {
  background-color: #40a9ff;
}

.ai-insight-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.insight-content {
  flex: 1;
}

.insight-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.insight-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.insight-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.like-btn, .dislike-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  background-color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.like-btn:hover, .like-btn.liked {
  background-color: #f0f9eb;
  border-color: #c2e7b0;
  color: #52C41A;
}

.dislike-btn:hover, .dislike-btn.disliked {
  background-color: #fef0f0;
  border-color: #fbc4c4;
  color: #FF4D4F;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}

.chart {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.chart-placeholder {
  width: 100%;
  height: 400px;
}

@media (max-width: 768px) {
  .chart-container {
    grid-template-columns: 1fr;
  }
  
  .reports-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-box {
    width: 100%;
  }
  
  .filter-box select {
    flex: 1;
    min-width: auto;
  }
}
</style>