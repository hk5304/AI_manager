<template>
  <div class="project-gantt">
    <div class="gantt-header">
      <h1>项目甘特图</h1>
      <div class="gantt-toolbar">
        <button class="view-btn">日视图</button>
        <button class="view-btn active">周视图</button>
        <button class="view-btn">月视图</button>
        <div class="toggle-group">
          <label>
            <input type="checkbox" v-model="showBaseline">
            显示基线
          </label>
          <label>
            <input type="checkbox" v-model="showCriticalPath">
            高亮关键路径
          </label>
        </div>
      </div>
    </div>
    <div class="gantt-container">
      <div class="gantt-timeline">
        <div class="timeline-header">
          <div class="task-name-col">任务/里程碑</div>
          <div class="timeline-weeks">
            <div class="week" v-for="week in weeks" :key="week.id">
              {{ week.date }}
            </div>
          </div>
        </div>
        <div class="timeline-body">
          <div class="timeline-item" v-for="item in ganttItems" :key="item.id">
            <div class="task-name" :class="{ 'milestone': item.type === 'milestone' }">
              {{ item.name }}
            </div>
            <div class="timeline-bars">
              <div class="bar-container">
                <div 
                  class="gantt-bar" 
                  :class="{ 
                    'milestone-bar': item.type === 'milestone',
                    'critical-path': item.criticalPath 
                  }"
                  :style="{
                    left: item.startPercent + '%',
                    width: item.durationPercent + '%'
                  }"
                >
                  {{ item.name }}
                </div>
                <div 
                  v-if="showBaseline && item.baselineStart"
                  class="baseline-bar"
                  :style="{
                    left: item.baselineStart + '%',
                    width: item.baselineDuration + '%'
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showBaseline = ref(true)
const showCriticalPath = ref(true)

const weeks = ref([
  { id: 1, date: '2026-04-21' },
  { id: 2, date: '2026-04-28' },
  { id: 3, date: '2026-05-05' },
  { id: 4, date: '2026-05-12' },
  { id: 5, date: '2026-05-19' },
  { id: 6, date: '2026-05-26' },
  { id: 7, date: '2026-06-02' },
  { id: 8, date: '2026-06-09' },
  { id: 9, date: '2026-06-16' },
  { id: 10, date: '2026-06-23' }
])

const ganttItems = ref([
  {
    id: 1,
    name: '项目启动',
    type: 'milestone',
    startPercent: 0,
    durationPercent: 5,
    criticalPath: true
  },
  {
    id: 2,
    name: '需求分析',
    type: 'task',
    startPercent: 5,
    durationPercent: 15,
    baselineStart: 5,
    baselineDuration: 10,
    criticalPath: true
  },
  {
    id: 3,
    name: '设计阶段',
    type: 'task',
    startPercent: 20,
    durationPercent: 20,
    baselineStart: 15,
    baselineDuration: 15,
    criticalPath: true
  },
  {
    id: 4,
    name: '开发阶段',
    type: 'task',
    startPercent: 40,
    durationPercent: 30,
    baselineStart: 30,
    baselineDuration: 25,
    criticalPath: true
  },
  {
    id: 5,
    name: '测试阶段',
    type: 'task',
    startPercent: 70,
    durationPercent: 20,
    baselineStart: 55,
    baselineDuration: 15,
    criticalPath: true
  },
  {
    id: 6,
    name: '项目验收',
    type: 'milestone',
    startPercent: 90,
    durationPercent: 10,
    criticalPath: true
  }
])
</script>

<style scoped>
.project-gantt {
  padding: 20px;
}

.gantt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.gantt-header h1 {
  font-size: 24px;
  color: #333;
}

.gantt-toolbar {
  display: flex;
  align-items: center;
  gap: 15px;
}

.view-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
}

.view-btn.active {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.toggle-group {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #666;
}

.toggle-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.gantt-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.gantt-timeline {
  min-width: 1000px;
}

.timeline-header {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  background-color: #f5f7fa;
}

.task-name-col {
  width: 200px;
  padding: 10px;
  border-right: 1px solid #f0f0f0;
}

.timeline-weeks {
  flex: 1;
  display: flex;
}

.week {
  flex: 1;
  padding: 10px;
  text-align: center;
  border-right: 1px solid #f0f0f0;
  font-size: 12px;
  color: #666;
}

.timeline-body {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  height: 40px;
  align-items: center;
}

.task-name {
  width: 200px;
  padding: 10px;
  border-right: 1px solid #f0f0f0;
  font-size: 14px;
  color: #333;
}

.task-name.milestone {
  font-weight: 600;
}

.timeline-bars {
  flex: 1;
  position: relative;
  height: 100%;
  padding: 5px 0;
}

.bar-container {
  position: relative;
  height: 100%;
}

.gantt-bar {
  position: absolute;
  height: 30px;
  background-color: #409eff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 12px;
  color: white;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.gantt-bar.milestone-bar {
  background-color: #67c23a;
  border-radius: 50%;
  width: 20px !important;
  min-width: 20px;
}

.gantt-bar.critical-path {
  border: 2px solid #f56c6c;
}

.baseline-bar {
  position: absolute;
  height: 30px;
  background-color: rgba(144, 147, 153, 0.3);
  border-radius: 4px;
}
</style>