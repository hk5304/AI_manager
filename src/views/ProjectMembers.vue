<template>
  <div class="project-members">
    <div class="members-header">
      <h1>项目成员管理</h1>
      <button class="invite-btn" @click="showOrgTree = true">邀请成员</button>
    </div>
    <div class="members-list">
      <div class="member-card" v-for="member in members" :key="member.id">
        <div class="member-avatar" :style="{ backgroundColor: member.avatarColor }">{{ member.name.charAt(0) }}</div>
        <div class="member-info">
          <h3>{{ member.name }}</h3>
          <p>{{ member.email }}</p>
          <div class="member-role">
            <span class="role-tag">{{ getRoleName(member.role) }}</span>
            <select class="role-select" v-model="member.role" @change="updateMemberRole(member.id, member.role)">
              <option value="owner">负责人</option>
              <option value="pm">项目经理</option>
              <option value="developer">开发工程师</option>
              <option value="qa">测试人员</option>
              <option value="product">产品经理</option>
              <option value="collaborator">协作者</option>
            </select>
          </div>
          <div class="member-status" v-if="member.status === 'pending'">
            <span class="status-tag pending">待接受</span>
          </div>
        </div>
        <div class="member-actions">
          <button class="remove-btn" @click="removeMember(member.id)">移除</button>
        </div>
      </div>
    </div>
    <div class="load-heatmap">
      <h2>成员负载热力图</h2>
      <div class="heatmap-controls">
        <select v-model="selectedMember" class="member-select">
          <option value="">选择成员</option>
          <option v-for="member in members" :key="member.id" :value="member.id">{{ member.name }}</option>
        </select>
        <select v-model="heatmapPeriod" class="period-select">
          <option value="week">周视图</option>
          <option value="month">月视图</option>
        </select>
      </div>
      <div class="heatmap-container">
        <div class="heatmap-grid">
          <div class="heatmap-cell" v-for="i in 30" :key="i" :class="getHeatmapClass(i)" :title="getHeatmapTooltip(i)"></div>
        </div>
        <div class="heatmap-legend">
          <div class="legend-item">
            <span class="legend-color low"></span>
            <span>低负载</span>
          </div>
          <div class="legend-item">
            <span class="legend-color medium"></span>
            <span>中等负载</span>
          </div>
          <div class="legend-item">
            <span class="legend-color high"></span>
            <span>高负载</span>
          </div>
          <div class="legend-item">
            <span class="legend-color very-high"></span>
            <span>极高负载</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 组织架构树选择器 -->
    <div class="org-tree-modal" v-if="showOrgTree">
      <div class="modal-overlay" @click="showOrgTree = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>选择成员</h3>
          <button class="close-btn" @click="showOrgTree = false">×</button>
        </div>
        <div class="modal-body">
          <div class="search-box">
            <input type="text" v-model="orgSearch" placeholder="搜索成员...">
          </div>
          <div class="org-tree">
            <div class="org-node" v-for="dept in orgTree" :key="dept.id">
              <div class="org-node-header" @click="toggleDept(dept.id)">
                <span class="org-node-icon">{{ dept.expanded ? '▼' : '▶' }}</span>
                <span class="org-node-name">{{ dept.name }}</span>
              </div>
              <div class="org-node-children" v-if="dept.expanded">
                <div class="org-member" v-for="member in dept.members" :key="member.id">
                  <input type="checkbox" :id="'member-' + member.id" v-model="selectedMembers" :value="member">
                  <label :for="'member-' + member.id">{{ member.name }} ({{ member.email }})</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showOrgTree = false">取消</button>
          <button class="confirm-btn" @click="inviteSelectedMembers">邀请</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { projectMembers, orgTree as orgTreeData } from '../data/mockData.js'

// 项目成员列表
const members = ref([...projectMembers])

// 组织架构树
const orgTree = ref([...orgTreeData])

// 模态框状态
const showOrgTree = ref(false)
// 搜索关键词
const orgSearch = ref('')
// 选中的成员
const selectedMembers = ref([])
// 热力图相关
const selectedMember = ref('')
const heatmapPeriod = ref('month')

// 获取角色名称
const getRoleName = (role) => {
  const roleMap = {
    owner: '负责人',
    pm: '项目经理',
    developer: '开发工程师',
    qa: '测试人员',
    product: '产品经理',
    collaborator: '协作者'
  }
  return roleMap[role] || role
}

// 切换部门展开/收起
const toggleDept = (deptId) => {
  const dept = orgTree.value.find(d => d.id === deptId)
  if (dept) {
    dept.expanded = !dept.expanded
  }
}

// 邀请选中的成员
const inviteSelectedMembers = () => {
  selectedMembers.value.forEach(member => {
    // 检查成员是否已存在
    const existingMember = members.value.find(m => m.id === member.id)
    if (!existingMember) {
      // 生成随机头像颜色
      const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#722ed1']
      const avatarColor = colors[Math.floor(Math.random() * colors.length)]
      
      // 添加新成员，状态为待接受
      members.value.push({
        id: member.id,
        name: member.name,
        email: member.email,
        role: 'collaborator',
        status: 'pending',
        avatarColor
      })
    }
  })
  // 清空选择并关闭模态框
  selectedMembers.value = []
  showOrgTree.value = false
}

// 更新成员角色
const updateMemberRole = (memberId, newRole) => {
  const member = members.value.find(m => m.id === memberId)
  if (member) {
    member.role = newRole
    // 这里可以添加API调用，更新后端数据
    console.log(`更新成员 ${member.name} 的角色为 ${newRole}`)
  }
}

// 移除成员
const removeMember = (memberId) => {
  const index = members.value.findIndex(m => m.id === memberId)
  if (index !== -1) {
    // 这里可以添加API调用，更新后端数据
    console.log(`移除成员 ${members.value[index].name}`)
    members.value.splice(index, 1)
  }
}

// 获取热力图单元格类
const getHeatmapClass = (index) => {
  const levels = ['low', 'medium', 'high', 'very-high']
  return levels[Math.floor(Math.random() * levels.length)]
}

// 获取热力图提示信息
const getHeatmapTooltip = (index) => {
  const date = new Date()
  date.setDate(date.getDate() + index)
  const dateStr = date.toLocaleDateString('zh-CN')
  const loadLevel = getHeatmapClass(index)
  const loadText = {
    'low': '低负载',
    'medium': '中等负载',
    'high': '高负载',
    'very-high': '极高负载'
  }
  return `${dateStr}: ${loadText[loadLevel]}`
}
</script>

<style scoped>
.project-members {
  padding: 20px;
}

.members-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.members-header h1 {
  font-size: 24px;
  color: #333;
}

.invite-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.invite-btn:hover {
  background-color: #66b1ff;
}

.members-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.member-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.member-info {
  flex: 1;
}

.member-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.member-info p {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.member-role {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.role-tag {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  background-color: #f0f9eb;
  color: #67c23a;
}

.role-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.member-status {
  margin-top: 5px;
}

.status-tag {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.pending {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.member-actions {
  margin-left: 10px;
}

.remove-btn {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fbc4c4;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #fde2e2;
}

.load-heatmap {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.load-heatmap h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.heatmap-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.member-select,
.period-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.heatmap-container {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 20px;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(30, 30px);
  gap: 2px;
}

.heatmap-cell {
  width: 30px;
  height: 30px;
  border-radius: 2px;
  cursor: pointer;
}

.heatmap-cell:hover {
  transform: scale(1.1);
  transition: transform 0.2s;
}

.heatmap-cell.low {
  background-color: #f0f9eb;
}

.heatmap-cell.medium {
  background-color: #e6a23c;
}

.heatmap-cell.high {
  background-color: #f56c6c;
}

.heatmap-cell.very-high {
  background-color: #8a2be2;
}

.heatmap-legend {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 2px;
}

.legend-color.low {
  background-color: #f0f9eb;
}

.legend-color.medium {
  background-color: #e6a23c;
}

.legend-color.high {
  background-color: #f56c6c;
}

.legend-color.very-high {
  background-color: #8a2be2;
}

/* 组织架构树模态框 */
.org-tree-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.search-box {
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.org-tree {
  max-height: 400px;
  overflow-y: auto;
}

.org-node {
  margin-bottom: 10px;
}

.org-node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.org-node-header:hover {
  background-color: #f5f7fa;
}

.org-node-icon {
  font-size: 12px;
  color: #999;
  width: 16px;
  text-align: center;
}

.org-node-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.org-node-children {
  margin-left: 24px;
  margin-top: 5px;
}

.org-member {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 4px;
}

.org-member:hover {
  background-color: #f5f7fa;
}

.org-member input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.org-member label {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  flex: 1;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  color: #666;
}

.cancel-btn:hover {
  background-color: #f5f7fa;
}

.confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  background-color: #409eff;
  color: white;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #66b1ff;
}
</style>