<template>
  <div class="admin-home">
    <div class="admin-header">
      <h1>后台管理</h1>
    </div>
    <div class="admin-dashboard">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ stats.users }}</div>
          <div class="stat-label">总用户数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.projects }}</div>
          <div class="stat-label">总项目数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.activeProjects }}</div>
          <div class="stat-label">活跃项目</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.tasks }}</div>
          <div class="stat-label">总任务数</div>
        </div>
      </div>
      <div class="quick-links">
        <h2>快捷入口</h2>
        <div class="links-grid">
          <router-link to="/admin/users" class="link-card">
            <div class="link-icon">👥</div>
            <div class="link-label">用户管理</div>
          </router-link>
          <router-link to="/admin/roles" class="link-card">
            <div class="link-icon">🎭</div>
            <div class="link-label">角色管理</div>
          </router-link>
          <router-link to="/admin/project-templates" class="link-card">
            <div class="link-icon">📋</div>
            <div class="link-label">项目模板管理</div>
          </router-link>
          <router-link to="/admin/logs" class="link-card">
            <div class="link-icon">📊</div>
            <div class="link-label">审计日志</div>
          </router-link>
          <router-link to="/admin/system" class="link-card">
            <div class="link-icon">⚙️</div>
            <div class="link-label">系统配置</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref({
  users: 128,
  projects: 45,
  activeProjects: 32,
  tasks: 520
})
</script>

<style scoped>
.admin-home {
  padding: 20px;
}

.admin-header {
  margin-bottom: 30px;
}

.admin-header h1 {
  font-size: 24px;
  color: #333;
}

.admin-dashboard {
  space-y: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.quick-links {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.quick-links h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.link-card {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  transition: transform 0.2s;
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.link-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.link-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
</style>