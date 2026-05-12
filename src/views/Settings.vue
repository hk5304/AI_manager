<template>
  <!-- 来源页面：settings.html -->
  <div class="settings-page">
    <div class="app-shell">
      <aside class="app-sidebar">
        <div class="brand-box">
          <div class="brand-icon">
            <span class="material-symbols-outlined">science</span>
          </div>
          <div>
            <h1 class="brand-title">R&D 系统</h1>
            <p class="brand-subtitle">AI 驱动型协作平台</p>
          </div>
        </div>

        <!-- TODO: 对接保存设置接口 -->
        <button class="sidebar-primary-cta" type="button" @click="handleSaveSettings('settings')">
          <span class="material-symbols-outlined">save</span>
          保存设置
        </button>

        <!-- TODO: 接入 Vue Router 后统一替换为 RouterLink 或 router.push -->
        <nav class="sidebar-nav">
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/dashboard')">
            <span class="material-symbols-outlined">dashboard</span>
            <span>全局工作台</span>
          </a>
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/projects')">
            <span class="material-symbols-outlined">account_tree</span>
            <span>项目列表</span>
          </a>
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/workbench')">
            <span class="material-symbols-outlined">space_dashboard</span>
            <span>个人工作台</span>
          </a>
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/reports')">
            <span class="material-symbols-outlined">query_stats</span>
            <span>全局报表</span>
          </a>
          <a class="nav-item active" href="#" @click.prevent="handleNavigate('/settings')">
            <span class="material-symbols-outlined">settings</span>
            <span>系统设置</span>
          </a>
          <a class="nav-item" href="#" @click.prevent="handleNavigate('/admin')">
            <span class="material-symbols-outlined">admin_panel_settings</span>
            <span>后台管理</span>
          </a>
        </nav>
      </aside>

      <header class="app-topbar">
        <div class="topbar-left">
          <div>
            <h2 class="topbar-title">系统设置</h2>
            <div class="topbar-breadcrumb">
              <span>个人</span>
              <span>/</span>
              <span>设置</span>
            </div>
          </div>
        </div>
        <div class="topbar-right">
          <!-- TODO: 对接设置项搜索 -->
          <label class="search-shell">
            <span class="material-symbols-outlined">search</span>
            <input
              v-model="keyword"
              type="text"
              placeholder="搜索设置项、通知或安全策略..."
            />
          </label>
          <!-- TODO: 对接通知中心路由或通知抽屉 -->
          <a
            class="icon-btn notification-link"
            href="#"
            aria-label="打开通知中心"
            @click.prevent="handleOpenNotifications"
          >
            <span class="material-symbols-outlined">notifications</span>
            <span class="notification-badge">5</span>
          </a>
          <!-- TODO: 对接应用切换器 -->
          <button class="icon-btn" type="button" @click="handleOpenAppSwitcher">
            <span class="material-symbols-outlined">apps</span>
          </button>
          <!-- TODO: 对接全局 AI 助手抽屉 -->
          <button class="icon-btn" type="button" data-ai-toggle @click="openAiDrawer">
            <span class="material-symbols-outlined">auto_awesome</span>
          </button>
          <UserProfileHoverCard :user="currentUser" />
        </div>
      </header>

      <main class="app-content">
        <div class="page-stack">
          <div class="page-header">
            <div>
              <h1 class="page-title">系统设置</h1>
              <p class="page-subtitle">
                采用分组设置卡组织个人资料、通知偏好与账户安全，装饰最少，以表单清晰为主。
              </p>
            </div>
            <div class="page-actions">
              <!-- TODO: 对接恢复默认设置接口 -->
              <button class="btn-secondary" type="button" @click="handleResetSettings">恢复默认</button>
              <!-- TODO: 对接保存设置接口 -->
              <button class="btn-primary" type="button" @click="handleSaveSettings('changes')">保存修改</button>
            </div>
          </div>

          <section class="settings-layout">
            <aside class="settings-nav glass-panel">
              <a class="subnav-link" :class="{ active: activeTab === 'profile' }" href="#" @click.prevent="activeTab = 'profile'">个人资料</a>
              <a class="subnav-link" :class="{ active: activeTab === 'notification' }" href="#" @click.prevent="activeTab = 'notification'">通知偏好</a>
              <a class="subnav-link" :class="{ active: activeTab === 'security' }" href="#" @click.prevent="activeTab = 'security'">账户安全</a>
              <a class="subnav-link" :class="{ active: activeTab === 'ai' }" href="#" @click.prevent="activeTab = 'ai'">AI 偏好</a>
            </aside>

            <div class="settings-panel">
              <!-- 个人资料 -->
              <article v-show="activeTab === 'profile'" class="settings-card glass-panel">
                <div class="settings-card-head">
                  <h2 class="section-title">个人资料</h2>
                  <span class="section-caption">修改基础信息</span>
                </div>
                <div class="profile-avatar-panel">
                  <div class="profile-avatar-preview" aria-label="当前头像">
                    <img v-if="profileForm.avatar" :src="profileForm.avatar" :alt="`${profileForm.name} 的头像`" />
                    <span v-else>{{ userInitial }}</span>
                  </div>
                  <div class="profile-avatar-info">
                    <h3>个人头像</h3>
                    <p>默认显示姓名首字，上传图片需小于 1MB，可在裁剪框内拖动选择展示位置。</p>
                  </div>
                  <div class="profile-avatar-menu-wrap">
                    <button class="btn-secondary" type="button" @click="toggleAvatarMenu">
                      <span class="material-symbols-outlined">account_circle</span>
                      管理头像
                    </button>
                    <div v-if="isAvatarMenuOpen" class="profile-avatar-menu">
                      <button type="button" @click="triggerAvatarUpload">
                        上传头像...
                      </button>
                      <button type="button" @click="removeAvatar">
                        删除头像
                      </button>
                    </div>
                    <input
                      ref="avatarFileInput"
                      class="hidden"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      @change="handleAvatarFileChange"
                    />
                  </div>
                </div>
                <div class="field-inline">
                  <div class="field-stack">
                    <label class="field-label">姓名</label>
                    <div class="field-input">
                      <input v-model="profileForm.name" />
                    </div>
                  </div>
                  <div class="field-stack">
                    <label class="field-label">部门</label>
                    <div class="field-input">
                      <input v-model="profileForm.department" />
                    </div>
                  </div>
                </div>
                <div class="field-inline" style="margin-top: 16px;">
                  <div class="field-stack">
                    <label class="field-label">邮箱</label>
                    <div class="field-input">
                      <input v-model="profileForm.email" />
                    </div>
                  </div>
                  <div class="field-stack">
                    <label class="field-label">手机号</label>
                    <div class="field-input">
                      <input v-model="profileForm.phone" />
                    </div>
                  </div>
                </div>
              </article>

              <!-- 通知偏好 -->
              <article v-show="activeTab === 'notification'" class="settings-card glass-panel">
                <div class="settings-card-head">
                  <h2 class="section-title">通知偏好</h2>
                  <span class="section-caption">站内 / 邮件 / 企微</span>
                </div>
                <div class="settings-list">
                  <div class="settings-row">
                    <div>
                      <strong>任务状态变更</strong>
                      <span>任务完成、阻塞、待评审时提醒我</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: notificationPrefs.taskStatus }"
                      type="button"
                      :aria-pressed="notificationPrefs.taskStatus ? 'true' : 'false'"
                      @click="togglePref('taskStatus')"
                    ></button>
                  </div>
                  <div class="settings-row">
                    <div>
                      <strong>日志互动</strong>
                      <span>有人评论或点赞日志时提醒我</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: notificationPrefs.logFeedback }"
                      type="button"
                      :aria-pressed="notificationPrefs.logFeedback ? 'true' : 'false'"
                      @click="togglePref('logFeedback')"
                    ></button>
                  </div>
                  <div class="settings-row">
                    <div>
                      <strong>报表订阅</strong>
                      <span>接收定时周报和项目报表</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: notificationPrefs.reportSubscription }"
                      type="button"
                      :aria-pressed="notificationPrefs.reportSubscription ? 'true' : 'false'"
                      @click="togglePref('reportSubscription')"
                    ></button>
                  </div>
                </div>
              </article>

              <!-- 账户安全 -->
              <article v-show="activeTab === 'security'" class="settings-card glass-panel">
                <div class="settings-card-head">
                  <h2 class="section-title">账户安全</h2>
                  <span class="section-caption">密码与会话管理</span>
                </div>
                <div class="settings-list">
                  <div class="settings-row">
                    <div>
                      <strong>修改密码</strong>
                      <span>上次修改时间：2026-03-12</span>
                    </div>
                    <!-- TODO: 对接修改密码流程 -->
                    <button class="btn-chip active" type="button" @click="handleSecurityAction('password')">操作</button>
                  </div>
                  <div class="settings-row">
                    <div>
                      <strong>设备会话</strong>
                      <span>当前有 3 个登录设备</span>
                    </div>
                    <!-- TODO: 对接设备会话管理流程 -->
                    <button class="btn-chip" type="button" @click="handleSecurityAction('session')">查看</button>
                  </div>
                </div>
              </article>

              <!-- AI 偏好 -->
              <article v-show="activeTab === 'ai'" class="settings-card glass-panel">
                <div class="settings-card-head">
                  <h2 class="section-title">AI 偏好</h2>
                  <span class="section-caption">智能助手设置</span>
                </div>
                <div class="settings-list">
                  <div class="settings-row">
                    <div>
                      <strong>AI 助手自动总结</strong>
                      <span>每日自动总结项目进展和待办事项</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: aiPrefs.autoSummary }"
                      type="button"
                      :aria-pressed="aiPrefs.autoSummary ? 'true' : 'false'"
                      @click="toggleAiPref('autoSummary')"
                    ></button>
                  </div>
                  <div class="settings-row">
                    <div>
                      <strong>智能排期建议</strong>
                      <span>AI 根据项目状态提供优化建议</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: aiPrefs.scheduling }"
                      type="button"
                      :aria-pressed="aiPrefs.scheduling ? 'true' : 'false'"
                      @click="toggleAiPref('scheduling')"
                    ></button>
                  </div>
                  <div class="settings-row">
                    <div>
                      <strong>风险预警</strong>
                      <span>自动识别项目风险并预警</span>
                    </div>
                    <button
                      class="toggle"
                      :class="{ on: aiPrefs.riskAlert }"
                      type="button"
                      :aria-pressed="aiPrefs.riskAlert ? 'true' : 'false'"
                      @click="toggleAiPref('riskAlert')"
                    ></button>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>

    <button class="floating-ai-btn" type="button" data-ai-toggle @click="openAiDrawer">
      <span class="material-symbols-outlined">auto_awesome</span>
    </button>

    <!-- Toast 提示 -->
    <Transition name="toast">
      <div v-if="showToast" class="toast-stack settings-toast-stack">
        <div class="toast-card settings-toast-card">
          <span class="material-symbols-outlined">{{ toastIcon }}</span>
          <div class="toast-body">
            <strong>{{ toastTitle }}</strong>
            <span>{{ toastMessage }}</span>
          </div>
        </div>
      </div>
    </Transition>
    <div class="modal-shell" :class="{ open: isAvatarCropModalOpen }" data-modal-id="avatar-crop-modal">
      <div class="modal-backdrop" data-modal-close @click="closeAvatarCropModal"></div>
      <section class="modal-panel glass-panel-strong classic-modal-panel avatar-crop-modal">
        <div class="modal-header">
          <div>
            <h2 class="section-title">裁剪新的个人头像</h2>
            <p class="page-subtitle">拖动图片选择头像展示区域，使用下方滑块调整缩放。</p>
          </div>
          <button class="icon-btn" type="button" aria-label="关闭头像裁剪" @click="closeAvatarCropModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div
          ref="avatarCropFrame"
          class="avatar-crop-frame"
          @pointerdown="handleCropPointerDown"
          @pointermove="handleCropPointerMove"
          @pointerup="handleCropPointerEnd"
          @pointercancel="handleCropPointerEnd"
          @wheel.prevent="handleCropWheel"
        >
          <img
            v-if="avatarCropSrc"
            ref="avatarCropImage"
            class="avatar-crop-image"
            :src="avatarCropSrc"
            alt="待裁剪头像"
            draggable="false"
            :style="avatarCropImageStyle"
            @load="handleCropImageLoad"
          />
          <div class="avatar-crop-shade" aria-hidden="true"></div>
          <div class="avatar-crop-ring" aria-hidden="true"></div>
          <span class="avatar-crop-handle top-left" aria-hidden="true"></span>
          <span class="avatar-crop-handle top-right" aria-hidden="true"></span>
          <span class="avatar-crop-handle bottom-left" aria-hidden="true"></span>
          <span class="avatar-crop-handle bottom-right" aria-hidden="true"></span>
        </div>

        <div class="avatar-crop-controls">
          <label class="field-label" for="avatarCropScale">缩放</label>
          <input
            id="avatarCropScale"
            v-model.number="avatarCropScale"
            type="range"
            min="1"
            max="3"
            step="0.01"
            @input="constrainAvatarCrop"
          />
        </div>

        <button class="avatar-crop-submit" type="button" @click="applyCroppedAvatar">
          设置新的个人头像
        </button>
      </section>
    </div>
    <div class="ai-overlay" :class="{ open: isAiDrawerOpen }" data-ai-overlay @click="closeAiDrawer"></div>
    <aside class="ai-drawer" :class="{ open: isAiDrawerOpen }" data-ai-drawer>
      <div class="ai-header">
        <div>
          <h3>AI 助手</h3>
          <p class="section-caption">当前上下文：系统设置</p>
        </div>
        <button class="icon-btn" type="button" data-ai-close @click="closeAiDrawer">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="ai-card">
        <h4>偏好建议</h4>
        <p>你当前同时开启了任务和日志通知，建议保留站内提醒并关闭邮件提醒，减少高频干扰。</p>
        <div class="ai-actions">
          <!-- TODO: 对接 AI 偏好建议采纳流程 -->
          <button class="btn-primary" type="button" @click="handleAcceptAiSuggestion">采纳建议</button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { pushNotificationPath } from "../utils/navigation";
import UserProfileHoverCard from "../components/topbar/UserProfileHoverCard.vue";

const router = useRouter();

defineOptions({
  name: "SettingsPage",
});

const emit = defineEmits([
  "navigate",
  "open-notifications",
  "open-app-switcher",
  "open-ai-drawer",
  "save-settings",
  "reset-settings",
  "security-action",
  "accept-ai-suggestion",
]);

const keyword = ref("");
const isAiDrawerOpen = ref(false);
const activeTab = ref("profile"); // profile, notification, security, ai
const toastTitle = ref("操作成功");
const toastMessage = ref("");
const toastIcon = ref("check_circle");
const showToast = ref(false);
const isAvatarMenuOpen = ref(false);
const isAvatarCropModalOpen = ref(false);
const avatarFileInput = ref(null);
const avatarCropFrame = ref(null);
const avatarCropImage = ref(null);
const avatarCropSrc = ref("");
const avatarCropFileName = ref("");
const avatarCropScale = ref(1);
const avatarCropFrameSize = ref(0);

const MAX_AVATAR_FILE_SIZE = 1024 * 1024;
const AVATAR_OUTPUT_SIZE = 320;
const PROFILE_UPDATED_EVENT = "app-profile-updated";

const defaultProfileForm = {
  name: "张工",
  department: "研发中心",
  email: "zhang@example.com",
  phone: "138****7788",
  avatar: "",
};

const defaultNotificationPrefs = {
  taskStatus: true,
  logFeedback: true,
  reportSubscription: false,
};

const defaultAiPrefs = {
  autoSummary: true,
  scheduling: true,
  riskAlert: false,
};

// 从 localStorage 加载保存的设置，若无则使用默认值
const loadSettings = () => {
  const savedSettings = localStorage.getItem('app-settings');
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (e) {
      console.error('Failed to parse saved settings:', e);
    }
  }
  return null;
};

const savedSettings = loadSettings();

const profileForm = reactive(savedSettings?.profile ? { ...savedSettings.profile } : { ...defaultProfileForm });
const notificationPrefs = reactive(savedSettings?.notifications ? { ...savedSettings.notifications } : { ...defaultNotificationPrefs });
const aiPrefs = reactive(savedSettings?.aiPrefs ? { ...savedSettings.aiPrefs } : { ...defaultAiPrefs });

const avatarCropOffset = reactive({
  x: 0,
  y: 0,
});

const avatarImageNatural = reactive({
  width: 0,
  height: 0,
});

const cropDragState = reactive({
  active: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
});

const userInitial = computed(() => {
  const source = profileForm.name?.trim() || defaultProfileForm.name;
  return source.charAt(0).toUpperCase();
});

const currentUser = computed(() => ({
  name: profileForm.name || defaultProfileForm.name,
  role: "研发总监",
  avatar: profileForm.avatar || "",
}));

const avatarCropBaseSize = computed(() => {
  const frameSize = avatarCropFrameSize.value || 520;
  const naturalWidth = avatarImageNatural.width || 1;
  const naturalHeight = avatarImageNatural.height || 1;
  const imageRatio = naturalWidth / naturalHeight;

  if (imageRatio >= 1) {
    return {
      width: frameSize * imageRatio,
      height: frameSize,
    };
  }

  return {
    width: frameSize,
    height: frameSize / imageRatio,
  };
});

const avatarCropImageStyle = computed(() => {
  const baseSize = avatarCropBaseSize.value;

  return {
    width: `${baseSize.width * avatarCropScale.value}px`,
    height: `${baseSize.height * avatarCropScale.value}px`,
    transform: `translate(-50%, -50%) translate(${avatarCropOffset.x}px, ${avatarCropOffset.y}px)`,
  };
});

const buildSettingsPayload = () => ({
  profile: { ...profileForm },
  notifications: { ...notificationPrefs },
  aiPrefs: { ...aiPrefs },
});

const notifyProfileUpdated = () => {
  window.dispatchEvent(
    new CustomEvent(PROFILE_UPDATED_EVENT, {
      detail: {
        profile: { ...profileForm },
      },
    })
  );
};

const persistCurrentSettings = () => {
  const payload = buildSettingsPayload();
  persistSettings(payload);
  notifyProfileUpdated();
  return payload;
};

const handleNavigate = (path) => {
  router.push(path);
};

const handleOpenNotifications = () => {
  emit("open-notifications");
  pushNotificationPath(router, router.currentRoute.value.fullPath);
};

const handleOpenAppSwitcher = () => {
  emit("open-app-switcher");
};

const openAiDrawer = () => {
  isAiDrawerOpen.value = true;
  emit("open-ai-drawer");
};

const closeAiDrawer = () => {
  isAiDrawerOpen.value = false;
};

const showToastMessage = (message, title = "操作成功", icon = "check_circle") => {
  toastTitle.value = title;
  toastMessage.value = message;
  toastIcon.value = icon;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2500);
};

const togglePref = (key) => {
  notificationPrefs[key] = !notificationPrefs[key];
};

const toggleAiPref = (key) => {
  aiPrefs[key] = !aiPrefs[key];
};

const toggleAvatarMenu = () => {
  isAvatarMenuOpen.value = !isAvatarMenuOpen.value;
};

const triggerAvatarUpload = () => {
  isAvatarMenuOpen.value = false;
  avatarFileInput.value?.click();
};

const resetAvatarCropState = () => {
  avatarCropScale.value = 1;
  avatarCropOffset.x = 0;
  avatarCropOffset.y = 0;
  avatarImageNatural.width = 0;
  avatarImageNatural.height = 0;
  cropDragState.active = false;
  cropDragState.pointerId = null;
};

const updateAvatarCropFrameSize = () => {
  const rect = avatarCropFrame.value?.getBoundingClientRect();
  if (!rect) {
    return;
  }

  avatarCropFrameSize.value = Math.min(rect.width, rect.height);
};

const getAvatarCropBounds = () => {
  const frameSize = avatarCropFrameSize.value || avatarCropFrame.value?.getBoundingClientRect().width || 1;
  const baseSize = avatarCropBaseSize.value;
  const renderWidth = baseSize.width * avatarCropScale.value;
  const renderHeight = baseSize.height * avatarCropScale.value;

  return {
    x: Math.max(0, (renderWidth - frameSize) / 2),
    y: Math.max(0, (renderHeight - frameSize) / 2),
  };
};

const constrainAvatarCrop = () => {
  updateAvatarCropFrameSize();
  const bounds = getAvatarCropBounds();
  avatarCropOffset.x = Math.min(bounds.x, Math.max(-bounds.x, avatarCropOffset.x));
  avatarCropOffset.y = Math.min(bounds.y, Math.max(-bounds.y, avatarCropOffset.y));
};

const openAvatarCropModal = (src, fileName) => {
  resetAvatarCropState();
  avatarCropSrc.value = src;
  avatarCropFileName.value = fileName;
  isAvatarCropModalOpen.value = true;
};

const closeAvatarCropModal = () => {
  isAvatarCropModalOpen.value = false;
  avatarCropSrc.value = "";
  avatarCropFileName.value = "";
  resetAvatarCropState();
};

const handleAvatarFileChange = (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    showToastMessage("请选择图片文件", "上传失败", "error");
    return;
  }

  if (file.size >= MAX_AVATAR_FILE_SIZE) {
    showToastMessage("头像图片需小于 1MB", "上传失败", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    openAvatarCropModal(String(reader.result), file.name);
  };
  reader.onerror = () => {
    showToastMessage("图片读取失败，请重新选择", "上传失败", "error");
  };
  reader.readAsDataURL(file);
};

const handleCropImageLoad = () => {
  avatarImageNatural.width = avatarCropImage.value?.naturalWidth || 1;
  avatarImageNatural.height = avatarCropImage.value?.naturalHeight || 1;
  updateAvatarCropFrameSize();
  constrainAvatarCrop();
};

const handleCropPointerDown = (event) => {
  if (!avatarCropSrc.value) {
    return;
  }

  cropDragState.active = true;
  cropDragState.pointerId = event.pointerId;
  cropDragState.startX = event.clientX;
  cropDragState.startY = event.clientY;
  cropDragState.originX = avatarCropOffset.x;
  cropDragState.originY = avatarCropOffset.y;
  event.currentTarget.setPointerCapture?.(event.pointerId);
};

const handleCropPointerMove = (event) => {
  if (!cropDragState.active || event.pointerId !== cropDragState.pointerId) {
    return;
  }

  avatarCropOffset.x = cropDragState.originX + event.clientX - cropDragState.startX;
  avatarCropOffset.y = cropDragState.originY + event.clientY - cropDragState.startY;
  constrainAvatarCrop();
};

const handleCropPointerEnd = (event) => {
  if (event.pointerId !== cropDragState.pointerId) {
    return;
  }

  cropDragState.active = false;
  cropDragState.pointerId = null;
  event.currentTarget.releasePointerCapture?.(event.pointerId);
};

const handleCropWheel = (event) => {
  const nextScale = avatarCropScale.value + (event.deltaY > 0 ? -0.06 : 0.06);
  avatarCropScale.value = Math.min(3, Math.max(1, Number(nextScale.toFixed(2))));
  constrainAvatarCrop();
};

const applyCroppedAvatar = () => {
  const image = avatarCropImage.value;
  if (!image || !avatarCropSrc.value) {
    return;
  }

  updateAvatarCropFrameSize();

  const frameSize = avatarCropFrameSize.value || 1;
  const baseSize = avatarCropBaseSize.value;
  const renderWidth = baseSize.width * avatarCropScale.value;
  const renderHeight = baseSize.height * avatarCropScale.value;
  const imageLeft = frameSize / 2 - renderWidth / 2 + avatarCropOffset.x;
  const imageTop = frameSize / 2 - renderHeight / 2 + avatarCropOffset.y;
  const scale = AVATAR_OUTPUT_SIZE / frameSize;

  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_OUTPUT_SIZE;
  canvas.height = AVATAR_OUTPUT_SIZE;

  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, AVATAR_OUTPUT_SIZE, AVATAR_OUTPUT_SIZE);
  context.drawImage(
    image,
    imageLeft * scale,
    imageTop * scale,
    renderWidth * scale,
    renderHeight * scale
  );

  profileForm.avatar = canvas.toDataURL("image/jpeg", 0.88);
  persistCurrentSettings();
  closeAvatarCropModal();
  showToastMessage("头像已更新");
};

const removeAvatar = () => {
  profileForm.avatar = "";
  isAvatarMenuOpen.value = false;
  persistCurrentSettings();
  showToastMessage("已恢复默认头像");
};

// TODO: Connect the save settings API.
const persistSettings = (payload) => {
  localStorage.setItem('app-settings', JSON.stringify(payload));
};

const handleSaveSettings = (source = "settings") => {
  const payload = persistCurrentSettings();
  emit("save-settings", payload);
  showToastMessage(source === "changes" ? "修改已保存" : "设置已保存");
};

// TODO: Connect the reset settings API.
const handleResetSettings = () => {
  Object.assign(profileForm, defaultProfileForm);
  // 将所有通知偏好设置为关闭（变暗）
  notificationPrefs.taskStatus = false;
  notificationPrefs.logFeedback = false;
  notificationPrefs.reportSubscription = false;
  // 将所有 AI 偏好设置为关闭（变暗）
  aiPrefs.autoSummary = false;
  aiPrefs.scheduling = false;
  aiPrefs.riskAlert = false;
  const payload = buildSettingsPayload();
  persistSettings(payload);
  notifyProfileUpdated();
  emit("reset-settings", payload);
  showToastMessage("已恢复默认设置");
};

const handleSecurityAction = (action) => {
  emit("security-action", action);
};

// TODO: Connect the AI preference suggestion workflow.
const handleAcceptAiSuggestion = () => {
  emit("accept-ai-suggestion");
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    if (isAvatarCropModalOpen.value) {
      closeAvatarCropModal();
      return;
    }
    isAvatarMenuOpen.value = false;
    closeAiDrawer();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", constrainAvatarCrop);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", constrainAvatarCrop);
});
</script>

<style>

.settings-page {
  min-height: 100vh;
  color: var(--color-text-primary);
  font-family: "Inter", "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at 0% 0%, rgba(173, 198, 255, 0.34) 0, transparent 42%),
    radial-gradient(circle at 100% 0%, rgba(236, 220, 255, 0.34) 0, transparent 42%),
    radial-gradient(circle at 100% 100%, rgba(156, 239, 219, 0.22) 0, transparent 38%),
    radial-gradient(circle at 0% 100%, rgba(20, 112, 232, 0.12) 0, transparent 38%),
    #f7f8fc;
  background-attachment: fixed;
}

.settings-page .app-shell {
  min-height: 100vh;
}

.profile-avatar-panel {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  margin-bottom: 24px;
  padding: 18px 20px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(216, 221, 232, 0.58);
}

.profile-avatar-preview {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  color: #ffffff;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  border: 1px solid #dbe6f6;
  box-shadow: 0 12px 28px rgba(20, 104, 199, 0.2);
  font-size: 24px;
  font-weight: 800;
}

.profile-avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-info {
  min-width: 0;
}

.profile-avatar-info h3,
.profile-avatar-info p {
  margin: 0;
}

.profile-avatar-info h3 {
  font-size: 16px;
  font-weight: 800;
}

.profile-avatar-info p {
  margin-top: 6px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.profile-avatar-menu-wrap {
  position: relative;
  justify-self: end;
}

.profile-avatar-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 20;
  width: 206px;
  padding: 8px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(216, 221, 232, 0.82);
  box-shadow: var(--shadow-overlay);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.profile-avatar-menu button {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  font-weight: 700;
  text-align: left;
  transition: background-color 160ms ease, color 160ms ease;
}

.profile-avatar-menu button:hover {
  background: rgba(20, 104, 199, 0.08);
  color: var(--color-primary-700);
}

.avatar-crop-modal {
  width: min(540px, calc(100vw - 48px));
  padding: 22px;
  overflow: hidden;
  border-radius: 28px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.76), rgba(255, 255, 255, 0.52)),
    radial-gradient(circle at 10% 0%, rgba(173, 198, 255, 0.28), transparent 42%),
    radial-gradient(circle at 100% 18%, rgba(236, 220, 255, 0.28), transparent 38%);
  border: 1px solid rgba(255, 255, 255, 0.76);
}

.avatar-crop-modal .modal-header {
  align-items: center;
  margin: 0 0 16px;
  padding: 0 0 14px;
  border-bottom: 1px solid rgba(216, 221, 232, 0.48);
}

.avatar-crop-modal .modal-header .section-title {
  font-size: 22px;
}

.avatar-crop-modal .modal-header .page-subtitle {
  margin-top: 6px;
  max-width: 360px;
  font-size: 13px;
  line-height: 1.55;
}

.avatar-crop-frame {
  position: relative;
  width: min(360px, 100%);
  aspect-ratio: 1;
  margin: 4px auto 16px;
  overflow: hidden;
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(173, 198, 255, 0.24), rgba(236, 220, 255, 0.24)),
    rgba(216, 221, 232, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.76);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.46),
    0 16px 34px rgba(41, 72, 152, 0.12);
  touch-action: none;
  cursor: grab;
  user-select: none;
}

.avatar-crop-frame:active {
  cursor: grabbing;
}

.avatar-crop-image {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  max-width: none;
  object-fit: cover;
  transform-origin: center;
  user-select: none;
  pointer-events: none;
}

.avatar-crop-shade {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: rgba(26, 28, 30, 0.28);
  -webkit-mask: radial-gradient(circle at center, transparent 0 47.5%, #000 48%);
  mask: radial-gradient(circle at center, transparent 0 47.5%, #000 48%);
  pointer-events: none;
}

.avatar-crop-ring {
  position: absolute;
  inset: 8px;
  z-index: 3;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.96);
  box-shadow:
    inset 0 0 0 1px rgba(20, 104, 199, 0.14),
    0 8px 24px rgba(20, 104, 199, 0.08);
  pointer-events: none;
}

.avatar-crop-handle {
  position: absolute;
  z-index: 4;
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255, 255, 255, 0.98);
  border-radius: 50%;
  background: var(--color-primary-600);
  box-shadow: 0 4px 10px rgba(20, 104, 199, 0.18);
  pointer-events: none;
}

.avatar-crop-handle.top-left {
  top: 10px;
  left: 10px;
}

.avatar-crop-handle.top-right {
  top: 10px;
  right: 10px;
}

.avatar-crop-handle.bottom-left {
  bottom: 10px;
  left: 10px;
}

.avatar-crop-handle.bottom-right {
  right: 10px;
  bottom: 10px;
}

.avatar-crop-controls {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.64);
}

.avatar-crop-controls input[type="range"] {
  width: 100%;
  accent-color: var(--color-primary-700);
}

.avatar-crop-submit {
  width: 100%;
  min-height: 50px;
  display: grid;
  place-items: center;
  margin: 0;
  border: 0;
  border-radius: 18px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  cursor: pointer;
  font-size: 17px;
  font-weight: 800;
  box-shadow: var(--shadow-glow-primary);
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.avatar-crop-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 42px rgba(20, 104, 199, 0.3);
}

.settings-toast-stack {
  top: 68px;
}

.settings-toast-card {
  width: min(380px, calc(100vw - 32px));
  min-height: 0;
  padding: 12px 16px;
  align-items: center;
}

.settings-toast-card .toast-body span {
  margin-top: 2px;
}

@media (max-width: 767px) {
  .profile-avatar-panel {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .profile-avatar-menu-wrap {
    grid-column: 1 / -1;
    justify-self: stretch;
  }

  .profile-avatar-menu-wrap > .btn-secondary {
    width: 100%;
  }

  .profile-avatar-menu {
    right: auto;
    left: 0;
    width: 100%;
  }

  .avatar-crop-modal {
    width: 100%;
  }

  .avatar-crop-frame {
    width: 100%;
  }

  .avatar-crop-controls {
    grid-template-columns: 1fr;
  }

  .settings-toast-stack {
    top: 66px;
  }

  .settings-toast-card {
    width: min(380px, calc(100vw - 20px));
  }
}
</style>
