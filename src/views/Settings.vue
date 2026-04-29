<template>
  <div class="settings">
    <div class="settings-header">
      <h1>系统设置</h1>
    </div>
    <div class="settings-content">
      <div class="settings-section section-profile">
        <h2>个人资料</h2>
        <div class="profile-form">
          <div class="profile-content">
            <div class="avatar-section">
              <div class="avatar-upload">
                <div class="avatar-preview" :style="{ backgroundColor: avatarColor }">{{ userName.charAt(0) }}</div>
                <input type="file" class="avatar-input">
                <button class="upload-btn">更换头像</button>
                <div class="avatar-meta">
                  <strong>{{ userName }}</strong>
                  <span>个人资料与账号入口</span>
                </div>
              </div>
            </div>
            <div class="profile-divider" aria-hidden="true"></div>
            <div class="info-section">
              <div class="section-intro">
                <h3>基础信息</h3>
                <p>维护你的公开资料与联系邮箱，便于系统展示与通知送达。</p>
              </div>
              <div class="profile-fields">
                <div class="form-group">
                  <label>姓名</label>
                  <input type="text" v-model="userName">
                </div>
                <div class="form-group">
                  <label>邮箱</label>
                  <input type="email" v-model="userEmail">
                </div>
              </div>
              <div class="info-actions">
                <button class="save-btn">保存修改</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="settings-section section-actions">
        <h2>快捷设置</h2>
        <div class="actions-panel">
          <div class="section-intro">
            <h3>账号与偏好</h3>
            <p>将安全设置、通知配置和主题切换集中放在右侧，操作路径更直接。</p>
          </div>
          <button type="button" class="action-trigger-btn password-trigger-btn" @click="openPasswordModal">修改密码</button>
          <button type="button" class="action-trigger-btn notification-trigger-btn" @click="openNotificationModal">通知设置</button>
          <button type="button" class="action-trigger-btn theme-trigger-btn" @click="openThemeModal">主题设置</button>
        </div>
      </div>
    </div>
    <transition name="settings-modal">
      <div v-if="showPasswordModal" class="settings-modal-overlay" @click.self="closePasswordModal">
        <div class="settings-modal-panel">
          <div class="settings-modal-header">
            <div>
              <h3>修改密码</h3>
              <p>请输入当前密码并设置新的登录密码。</p>
            </div>
            <button type="button" class="modal-close-btn" @click="closePasswordModal">×</button>
          </div>
          <div class="password-form modal-password-form">
            <div class="form-group">
              <label>旧密码</label>
              <input type="password" v-model="oldPassword" placeholder="请输入当前密码">
            </div>
            <div class="form-group">
              <label>新密码</label>
              <input type="password" v-model="newPassword" placeholder="请输入新密码">
            </div>
            <div class="form-group">
              <label>确认新密码</label>
              <input type="password" v-model="confirmPassword" placeholder="请再次输入新密码">
            </div>
          </div>
          <div class="settings-modal-actions">
            <button type="button" class="secondary-btn" @click="closePasswordModal">取消</button>
            <button type="button" class="save-btn" :disabled="!canSubmitPassword" @click="submitPasswordChange">确认修改</button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="settings-modal">
      <div v-if="showNotificationModal" class="settings-modal-overlay" @click.self="closeNotificationModal">
        <div class="settings-modal-panel">
          <div class="settings-modal-header">
            <div>
              <h3>通知偏好</h3>
              <p>选择需要接收的通知事件，以及对应的推送渠道。</p>
            </div>
            <button type="button" class="modal-close-btn" @click="closeNotificationModal">×</button>
          </div>
          <div class="notification-settings modal-notification-settings">
            <div class="notification-item">
              <label>
                <input type="checkbox" v-model="notifications.taskAssign">
                任务分配通知
              </label>
              <div class="notification-channels">
                <label>
                  <input type="checkbox" v-model="notificationChannels.taskAssign.site">
                  站内通知
                </label>
                <label>
                  <input type="checkbox" v-model="notificationChannels.taskAssign.wechat">
                  企微通知
                </label>
                <label>
                  <input type="checkbox" v-model="notificationChannels.taskAssign.dingtalk">
                  钉钉通知
                </label>
              </div>
            </div>
            <div class="notification-item">
              <label>
                <input type="checkbox" v-model="notifications.taskStatus">
                任务状态变更通知
              </label>
              <div class="notification-channels">
                <label>
                  <input type="checkbox" v-model="notificationChannels.taskStatus.site">
                  站内通知
                </label>
                <label>
                  <input type="checkbox" v-model="notificationChannels.taskStatus.wechat">
                  企微通知
                </label>
                <label>
                  <input type="checkbox" v-model="notificationChannels.taskStatus.dingtalk">
                  钉钉通知
                </label>
              </div>
            </div>
            <div class="notification-item">
              <label>
                <input type="checkbox" v-model="notifications.projectUpdate">
                项目更新通知
              </label>
              <div class="notification-channels">
                <label>
                  <input type="checkbox" v-model="notificationChannels.projectUpdate.site">
                  站内通知
                </label>
                <label>
                  <input type="checkbox" v-model="notificationChannels.projectUpdate.wechat">
                  企微通知
                </label>
                <label>
                  <input type="checkbox" v-model="notificationChannels.projectUpdate.dingtalk">
                  钉钉通知
                </label>
              </div>
            </div>
          </div>
          <div class="settings-modal-actions">
            <button type="button" class="secondary-btn" @click="closeNotificationModal">取消</button>
            <button type="button" class="save-btn" @click="submitNotificationSettings">保存设置</button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="settings-modal">
      <div v-if="showThemeModal" class="settings-modal-overlay" @click.self="closeThemeModal">
        <div class="settings-modal-panel">
          <div class="settings-modal-header">
            <div>
              <h3>主题设置</h3>
              <p>选择当前界面的视觉模式，后续可接入全局主题切换。</p>
            </div>
            <button type="button" class="modal-close-btn" @click="closeThemeModal">×</button>
          </div>
          <div class="theme-settings modal-theme-settings">
            <label class="theme-choice-card" :class="{ active: theme === 'light' }">
              <input type="radio" name="theme" value="light" v-model="theme">
              <span class="theme-choice-title">亮色模式</span>
              <span class="theme-choice-desc">适合日间办公与信息密集场景。</span>
            </label>
            <label class="theme-choice-card" :class="{ active: theme === 'dark' }">
              <input type="radio" name="theme" value="dark" v-model="theme">
              <span class="theme-choice-title">暗色模式</span>
              <span class="theme-choice-desc">减弱高亮刺激，适合夜间浏览。</span>
            </label>
          </div>
          <div class="settings-modal-actions">
            <button type="button" class="secondary-btn" @click="closeThemeModal">取消</button>
            <button type="button" class="save-btn" @click="submitThemeSettings">保存主题</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const userName = ref('张三')
const userEmail = ref('zhangsan@example.com')
const avatarColor = ref('#409eff')

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPasswordModal = ref(false)
const showNotificationModal = ref(false)
const showThemeModal = ref(false)

const theme = ref('light')

const notifications = ref({
  taskAssign: true,
  taskStatus: true,
  projectUpdate: true
})

const notificationChannels = ref({
  taskAssign: {
    site: true,
    wechat: false,
    dingtalk: false
  },
  taskStatus: {
    site: true,
    wechat: false,
    dingtalk: false
  },
  projectUpdate: {
    site: true,
    wechat: false,
    dingtalk: false
  }
})

const canSubmitPassword = computed(() => {
  return Boolean(
    oldPassword.value &&
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value === confirmPassword.value
  )
})

const resetPasswordForm = () => {
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const openPasswordModal = () => {
  showPasswordModal.value = true
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  resetPasswordForm()
}

const submitPasswordChange = () => {
  if (!canSubmitPassword.value) return
  closePasswordModal()
}

const openNotificationModal = () => {
  showNotificationModal.value = true
}

const closeNotificationModal = () => {
  showNotificationModal.value = false
}

const submitNotificationSettings = () => {
  closeNotificationModal()
}

const openThemeModal = () => {
  showThemeModal.value = true
}

const closeThemeModal = () => {
  showThemeModal.value = false
}

const submitThemeSettings = () => {
  closeThemeModal()
}

const settingsPageClass = 'settings-page-content'

onMounted(() => {
  document.querySelector('.page-content')?.classList.add(settingsPageClass)
})

onBeforeUnmount(() => {
  document.querySelector('.page-content')?.classList.remove(settingsPageClass)
})
</script>

<style scoped>
:global(.settings-page-content) {
  overflow: hidden;
}

.settings {
  height: 100%;
  padding: 20px 24px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.settings-header {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.settings-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
  line-height: 1.2;
}

.settings-content {
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: none;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 420px;
  grid-template-areas: "profile actions";
  gap: 24px;
  align-items: stretch;
}

.settings-section {
  background-color: white;
  border-radius: 8px;
  padding: 18px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  min-width: 0;
  height: 100%;
  overflow: hidden;
}

.section-profile {
  grid-area: profile;
}

.section-actions {
  grid-area: actions;
}

.settings-section h2 {
  margin: 0 0 18px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: 600;
}

.avatar-input {
  display: none;
}

.upload-btn {
  background-color: #f5f7fa;
  color: #409eff;
  border: 1px solid #dcdfe6;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.upload-btn:hover {
  background-color: #ecf5ff;
}

.profile-form {
  height: calc(100% - 52px);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px 0 10px;
  height: 100%;
}

.avatar-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px 26px;
}

.avatar-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.avatar-meta strong {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.avatar-meta span {
  font-size: 13px;
  color: #6b7280;
}

.profile-divider {
  height: 1px;
  margin: 0 18px;
  background: linear-gradient(90deg, transparent 0%, #e6edf7 12%, #e6edf7 88%, transparent 100%);
}

.info-section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  padding: 24px 20px 8px;
}

.section-intro {
  margin-bottom: 18px;
}

.section-intro h3 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.section-intro p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #6b7280;
}

.profile-fields {
  display: grid;
  gap: 14px;
}

.info-section .form-group {
  max-width: 100%;
  margin-bottom: 0;
}

.info-actions {
  margin-top: 18px;
}

/* 个人资料卡片输入框样式 */
.profile-form .info-section input {
  width: 100%;
}

.actions-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 100%;
  justify-content: flex-start;
  min-height: calc(100% - 52px);
  padding-top: 8px;
}

.section-actions .section-intro {
  margin-bottom: 4px;
}

.save-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
}

.save-btn:hover {
  background-color: #66b1ff;
}

.save-btn:disabled {
  background-color: #b7d7fb;
  cursor: not-allowed;
}

.action-trigger-btn {
  width: 100%;
  padding: 16px 28px;
  border: 1px solid #d8e3ef;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f6f9fc 100%);
  color: #334155;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease;
}

.action-trigger-btn:hover {
  transform: translateY(-2px);
  border-color: #c4d4e5;
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.action-trigger-btn:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.06);
}

.notification-item {
  margin-bottom: 20px;
}

.notification-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 10px;
}

.notification-channels {
  margin-left: 0;
  padding-left: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.notification-channels label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
  margin-bottom: 0;
}

.theme-settings {
  margin-left: 0;
}

.password-form,
.notification-settings,
.theme-settings {
  width: 100%;
}

.settings-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(4px);
}

.settings-modal-panel {
  width: min(560px, 100%);
  max-height: calc(100vh - 72px);
  overflow-y: auto;
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.22);
}

.settings-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.settings-modal-header h3 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #1f2937;
}

.settings-modal-header p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}

.modal-close-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: #f3f6fb;
  color: #4b5563;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.18s ease, transform 0.18s ease, color 0.18s ease;
}

.modal-close-btn:hover {
  background: #e8eef8;
  color: #111827;
  transform: rotate(90deg);
}

.modal-close-btn:active {
  transform: rotate(90deg) scale(0.95);
}

.modal-password-form {
  margin-bottom: 24px;
}

.modal-notification-settings {
  margin-bottom: 24px;
}

.modal-theme-settings {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.settings-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.secondary-btn {
  padding: 10px 18px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  background: #f8fafc;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
}

.secondary-btn:hover {
  background: #eff4fa;
  border-color: #c9d7ea;
}

.secondary-btn:active {
  transform: scale(0.98);
}

.theme-choice-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 20px 20px 52px;
  border: 1px solid #dbe3ef;
  border-radius: 16px;
  background: #f8fafc;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease, background-color 0.18s ease;
}

.theme-choice-card input {
  position: absolute;
  top: 22px;
  left: 20px;
}

.theme-choice-card:hover {
  transform: translateY(-1px);
  border-color: #9bc2f8;
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.1);
}

.theme-choice-card.active {
  border-color: #409eff;
  background: #eff6ff;
  box-shadow: 0 14px 30px rgba(64, 158, 255, 0.12);
}

.theme-choice-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.theme-choice-desc {
  font-size: 13px;
  line-height: 1.6;
  color: #6b7280;
}

.settings-modal-enter-active,
.settings-modal-leave-active {
  transition: opacity 0.24s ease;
}

.settings-modal-enter-active .settings-modal-panel,
.settings-modal-leave-active .settings-modal-panel {
  transition: transform 0.28s ease, opacity 0.28s ease;
}

.settings-modal-enter-from,
.settings-modal-leave-to {
  opacity: 0;
}

.settings-modal-enter-from .settings-modal-panel,
.settings-modal-leave-to .settings-modal-panel {
  transform: translateY(18px) scale(0.97);
  opacity: 0;
}

@media (max-width: 1200px) {
  .settings-content {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "profile"
      "actions";
  }

  .profile-content {
    height: auto;
  }

  .actions-panel {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    min-height: auto;
  }

  .section-actions .section-intro {
    width: 100%;
  }

  .actions-panel .action-trigger-btn {
    flex: 1 1 180px;
  }
}

@media (max-width: 768px) {
  .settings {
    padding: 16px;
  }

  .settings-section {
    padding: 18px;
  }

  .profile-content {
    gap: 24px;
    height: auto;
  }

  .avatar-section {
    align-items: center;
  }

  .actions-panel {
    flex-direction: column;
    min-height: auto;
  }

  .settings-modal-overlay {
    padding: 16px;
  }

  .settings-modal-panel {
    padding: 22px;
    border-radius: 16px;
  }

  .settings-modal-actions {
    flex-direction: column-reverse;
  }

  .settings-modal-actions .save-btn,
  .settings-modal-actions .secondary-btn,
  .action-trigger-btn {
    width: 100%;
  }
}
</style>
