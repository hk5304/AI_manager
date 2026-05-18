﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿<template>
  <!-- 来源页面：notifications.html -->
  <div class="notifications-page">
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

        <!-- TODO: 对接项目矩阵入口路由 -->
        <a class="sidebar-primary-cta" href="#" @click.prevent="handleNavigate('/projects')">
          <span class="material-symbols-outlined">add_circle</span>
          进入项目矩阵
        </a>

        <!-- TODO: 接入 Vue Router 后统一替换为 RouterLink 或 router.push -->
        <nav class="sidebar-nav">
          <a
            v-for="item in sidebarNavItems"
            :key="item.path"
            class="nav-item"
            :class="{ active: item.active, 'notification-nav': item.badge }"
            href="#"
            @click.prevent="handleNavigate(item.path)"
          >
            <span class="material-symbols-outlined">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
            <span v-if="item.badge" class="notification-badge">{{ item.badge }}</span>
          </a>
        </nav>
      </aside>

      <header class="app-topbar">
        <div class="topbar-left">
          <div>
            <h2 class="topbar-title">通知中心</h2>
            <div class="topbar-breadcrumb">
              <span>全局</span>
              <span>/</span>
              <span>通知中心</span>
            </div>
          </div>
        </div>
        <div class="topbar-right">
          <!-- TODO: 对接通知搜索接口；当前保留本地筛选 -->
          <label class="search-shell">
            <span class="material-symbols-outlined">search</span>
            <input
              v-model="keyword"
              type="text"
              placeholder="搜索通知、来源或处理对象..."
            />
          </label>

          <!-- TODO: 对接通知中心路由；当前页保留激活状态 -->
          <a
            class="icon-btn notification-link active"
            href="#"
            aria-label="当前位于通知中心"
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

          <!-- TODO: 对接当前登录用户信息 -->
          <UserProfileHoverCard :user="currentUser" />
        </div>
      </header>

      <main class="app-content">
        <div class="page-stack">
          <div class="page-header">
            <div>
              <h1 class="page-title">通知中心</h1>
              <p class="page-subtitle">
                统一承接标题栏通知入口，替代原有通知弹窗；按优先级处理待办事项、系统变更与 AI 提醒。
              </p>
            </div>
            <div class="page-actions">
              <!-- TODO: 对接返回工作台路由 -->
              <button class="btn-secondary" type="button" @click="handleNavigate('/dashboard')">
                <span class="material-symbols-outlined">arrow_back</span>
                返回工作台
              </button>
              <!-- TODO: 对接通知偏好设置路由 -->
              <button class="btn-primary" type="button" @click="handleNavigate('/settings')">
                <span class="material-symbols-outlined">tune</span>
                管理通知偏好
              </button>
            </div>
          </div>

          <section class="grid-3">
            <div v-for="card in metricCards" :key="card.title" class="glass-panel metric-card">
              <span class="material-symbols-outlined watermark">{{ card.icon }}</span>
              <h3>{{ card.title }}</h3>
              <div class="value compact-value">{{ card.value }}</div>
              <p class="page-subtitle metric-description">{{ card.description }}</p>
            </div>
          </section>

          <section class="grid-2-1">
            <article class="glass-panel notification-stream-card">
              <div class="notification-stream-head">
                <div>
                  <h2 class="section-title">最新通知</h2>
                  <p class="section-caption" style="margin-top: 6px;">
                    保留项目既有玻璃拟态卡片风格，只调整通知入口和详情承载方式。
                  </p>
                </div>
                <!-- TODO: 对接通知分类筛选参数；当前保留本地筛选 -->
                <div class="notification-chip-group">
                  <button
                    v-for="option in filterOptions"
                    :key="option.value"
                    class="btn-chip"
                    :class="{ active: activeFilter === option.value }"
                    type="button"
                    @click="activeFilter = option.value"
                  >
                    {{ option.label }} {{ getFilterCount(option.value) }}
                  </button>
                </div>
              </div>

              <div class="notification-stream-list">
                <div v-for="item in displayNotifications" :key="item.id" class="notification-entry">
                  <div class="notification-entry-icon" :style="{ background: item.iconBackground }">
                    <span class="material-symbols-outlined">{{ item.icon }}</span>
                  </div>
                  <div class="notification-entry-content">
                    <div class="notification-entry-head">
                      <div class="notification-entry-title">
                        <span class="pill" :class="item.pillClass">{{ item.status }}</span>
                        <h3>{{ item.title }}</h3>
                        <span v-if="item.unread" class="notification-unread-dot"></span>
                      </div>
                      <span class="notification-entry-time">{{ item.time }}</span>
                    </div>
                    <p>{{ item.description }}</p>
                    <div class="notification-entry-meta">
                      <div class="notification-entry-tags">
                        <span
                          v-for="tag in item.tags"
                          :key="`${item.id}-${tag.label}`"
                          class="micro-tag"
                          :class="tag.className"
                          :style="tag.style"
                        >
                          {{ tag.label }}
                        </span>
                      </div>
                      <!-- TODO: 对接通知详情跳转或处理动作 -->
                      <button class="btn-chip active" type="button" @click="handleNavigate(item.actionPath)">
                        {{ item.actionLabel }}
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="!displayNotifications.length" class="notification-entry">
                  <div class="notification-entry-icon" style="background: linear-gradient(135deg, #94a3b8, #64748b);">
                    <span class="material-symbols-outlined">inbox</span>
                  </div>
                  <div class="notification-entry-content">
                    <div class="notification-entry-head">
                      <div class="notification-entry-title">
                        <h3>暂无符合条件的通知</h3>
                      </div>
                    </div>
                    <p>你可以切换筛选条件，或清空搜索关键字后重新查看通知流。</p>
                  </div>
                </div>
              </div>
            </article>

            <div style="display: flex; flex-direction: column; gap: 24px;">
              <article class="glass-panel notification-side-card">
                <h2 class="section-title">处理建议</h2>
                <div class="notification-side-list">
                  <div v-for="item in processAdviceItems" :key="item.title" class="notification-side-item">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                  </div>
                </div>
              </article>

              <article
                class="glass-panel notification-side-card"
                style="background: linear-gradient(180deg, rgba(236,220,255,0.28), rgba(255,255,255,0.42));"
              >
                <h2 class="section-title">入口说明</h2>
                <div class="notification-side-list">
                  <div v-for="item in entryGuideItems" :key="item.title" class="notification-side-item">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                  </div>
                </div>
                <div class="notification-side-actions">
                  <!-- TODO: 对接通知偏好设置路由 -->
                  <button class="btn-primary" type="button" @click="handleNavigate('/settings')">
                    <span class="material-symbols-outlined">tune</span>
                    通知偏好
                  </button>
                  <!-- TODO: 对接通知通道配置路由 -->
                  <button class="btn-secondary" type="button" @click="handleNavigate('/admin/system')">
                    <span class="material-symbols-outlined">settings</span>
                    通道配置
                  </button>
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
    <div class="ai-overlay" :class="{ open: isAiDrawerOpen }" data-ai-overlay @click="closeAiDrawer"></div>
    <aside class="ai-drawer" :class="{ open: isAiDrawerOpen }" data-ai-drawer>
      <div class="ai-header">
        <div>
          <h3>AI 助手</h3>
          <p class="section-caption">当前上下文：通知中心</p>
        </div>
        <button class="icon-btn" type="button" data-ai-close @click="closeAiDrawer">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="ai-card">
        <h4>通知处理建议</h4>
        <p>
          建议先完成高优先级权限审计，再处理角色模板申请；AI 晨报和日志评论类通知可回到工作台集中收尾。
        </p>
        <div class="ai-actions">
          <!-- TODO: 对接 AI 建议采纳流程 -->
          <button class="btn-primary" type="button" @click="handleAcceptAiSuggestion">采纳建议</button>
          <button class="btn-secondary" type="button" @click="closeAiDrawer">稍后处理</button>
        </div>
      </div>
      <div class="ai-list">
        <div v-for="item in aiListItems" :key="item.title" class="ai-list-item">
          <h4>{{ item.title }}</h4>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { pushAppPath, resolveNotificationReturnPath } from "../utils/navigation";
import { notificationStore, taskStore } from "../store/taskStore";
import UserProfileHoverCard from "../components/topbar/UserProfileHoverCard.vue";

const route = useRoute();
const router = useRouter();

defineOptions({
  name: "NotificationsPage",
});

const emit = defineEmits([
  "navigate",
  "open-notifications",
  "open-app-switcher",
  "open-ai-drawer",
  "accept-ai-suggestion",
]);

const keyword = ref("");
const activeFilter = ref("all");
const isAiDrawerOpen = ref(false);

const currentUser = computed(() => ({
  name: taskStore.state.currentUserName,
  role: taskStore.state.currentRole,
  avatar: `https://i.pravatar.cc/80?img=${taskStore.state.currentUserId % 70}`
}))

const unreadCount = computed(() => notificationStore.getUnreadCount())

const notifications = computed(() => notificationStore.getUserNotifications(taskStore.state.currentUserId))

const sidebarNavItems = computed(() => [
  { label: "全局工作台", icon: "dashboard", path: "./dashboard.html", active: false },
  { label: "项目列表", icon: "account_tree", path: "./projects.html", active: false },
  { label: "个人工作台", icon: "space_dashboard", path: "./workbench.html", active: false },
  { label: "消息通知", icon: "notifications", path: "./notifications.html", active: true, badge: unreadCount.value },
  { label: "全局报表", icon: "query_stats", path: "./reports.html", active: false },
  { label: "系统设置", icon: "settings", path: "./settings.html", active: false },
  { label: "后台管理", icon: "admin_panel_settings", path: "./admin.html", active: false },
]);

const metricCards = computed(() => [
  {
    icon: "mark_chat_unread",
    title: "未读通知",
    value: `${unreadCount.value} 条`,
    description: "标题栏通知统一进入本页查看，不再弹出临时浮层。",
  },
  {
    icon: "priority_high",
    title: "高优先级",
    value: `${notifications.value.filter(n => n.category === 'pending').length} 条`,
    description: "涉及权限审计和角色变更，建议今天内完成处理闭环。",
  },
  {
    icon: "check_circle",
    title: "今日已处理",
    value: `${notifications.value.filter(n => !n.unread).length} 条`,
    description: "系统更新、AI 摘要和协作反馈都已在此汇总，便于统一追踪。",
  },
]);

const filterOptions = [
  { label: "全部", value: "all" },
  { label: "待处理", value: "pending" },
  { label: "系统更新", value: "system" },
  { label: "AI 提醒", value: "ai" },
];

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    notificationStore.markAsRead(notification.id)
  }
  
  if (notification.actionPath) {
    handleNavigate(notification.actionPath)
  }
}

const mapNotificationToDisplay = (notification) => {
  const iconMap = {
    'review': 'rate_review',
    'review_result': 'check_circle',
    'task': 'task',
    'invitation': 'person_add',
    'member_update': 'manage_accounts',
    'member_remove': 'person_remove',
    'audit': 'security',
    'permission': 'admin_panel_settings',
    'system': 'settings',
    'ai': 'auto_awesome'
  }
  
  const bgMap = {
    'review': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'review_result': 'linear-gradient(135deg, #10b981, #059669)',
    'task': 'linear-gradient(135deg, #4f8ff6, #1468c7)',
    'invitation': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'member_update': 'linear-gradient(135deg, #ec4899, #db2777)',
    'member_remove': 'linear-gradient(135deg, #f36b63, #d83a34)',
    'audit': 'linear-gradient(135deg, #f36b63, #d83a34)',
    'permission': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'system': 'linear-gradient(135deg, #10b981, #059669)',
    'ai': 'linear-gradient(135deg, #4f8ff6, #1468c7)'
  }
  
  const typeLabelMap = {
    'review': '待审核',
    'review_result': '审核结果',
    'task': '任务',
    'invitation': '邀请',
    'member_update': '成员更新',
    'member_remove': '移出',
    'audit': '审计',
    'permission': '权限',
    'system': '系统',
    'ai': 'AI'
  }
  
  return {
    id: notification.id,
    icon: iconMap[notification.type] || 'notifications',
    iconBackground: bgMap[notification.type] || 'linear-gradient(135deg, #6b7280, #4b5563)',
    status: typeLabelMap[notification.type] || notification.type,
    pillClass: notification.read ? 'pill-success' : 'pill-warning',
    title: notification.title,
    description: notification.content,
    unread: !notification.read,
    time: notification.createdAt,
    actionLabel: '查看详情',
    actionPath: notification.actionPath || './notifications.html',
    tags: [],
    category: notification.type
  }
}

const displayNotifications = computed(() => {
  return filteredNotifications.value.map(mapNotificationToDisplay)
})

const processAdviceItems = [
  {
    title: "先处理权限和角色类通知",
    description:
      "这两类通知会直接影响后台配置与项目权限边界，优先级高于一般系统更新和信息提醒。",
  },
  {
    title: "AI 摘要类通知适合批量收尾",
    description:
      "晨报、日志草稿和任务补录等内容可以在回到工作台后集中处理，不需要在多个弹层间切换。",
  },
  {
    title: "协作反馈统一回工作台闭环",
    description:
      "涉及评论、待评审和 PBC 绑定的提醒，建议在个人工作台完成同步，减少重复维护字段。",
  },
];

const entryGuideItems = [
  {
    title: "标题栏统一跳转",
    description: "所有页面顶部的通知按钮现在统一进入本页，不再使用旧的通知弹窗。",
  },
  {
    title: "工作台不重复加按钮",
    description:
      "个人工作台保留标题栏通知入口，不再额外在内容区新增通知按钮，避免打断原有卡片布局。",
  },
  {
    title: "通知偏好集中配置",
    description:
      "如需调整站内、邮件或企微规则，直接前往系统设置页统一维护通知偏好与通道策略。",
  },
];

const aiListItems = [
  {
    title: "统一入口已生效",
    description:
      "通知详情现在承载在独立页面中，标题栏按钮不再打开旧弹窗，便于查看更多上下文。",
  },
  {
    title: "可继续扩展筛选",
    description:
      "后续如果需要状态筛选、已读管理或批量操作，可以在本页继续扩展，不会影响现有工作台卡片布局。",
  },
];

const filteredNotifications = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase();

  return notifications.value.filter((item) => {
    const matchesCategory = activeFilter.value === "all" || item.category === activeFilter.value;
    if (!matchesCategory) {
      return false;
    }

    if (!normalizedKeyword) {
      return true;
    }

    return [item.status, item.title, item.description, item.actionLabel]
      .join(" ")
      .toLowerCase()
      .includes(normalizedKeyword);
  });
});

const notificationReturnPath = computed(() => {
  return resolveNotificationReturnPath(route.query.from);
});

const getFilterCount = (filter) => {
  if (filter === "all") {
    return notifications.value.length;
  }

  return notifications.value.filter((item) => item.category === filter).length;
};

const handleNavigate = (path) => {
  pushAppPath(router, path);
};

const handleReturnFromNotifications = () => {
  pushAppPath(router, notificationReturnPath.value);
};

const handleOpenNotifications = () => {
  emit("open-notifications");
  handleReturnFromNotifications();
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

// TODO: Connect the AI suggestion acceptance workflow.
const handleAcceptAiSuggestion = () => {
  emit("accept-ai-suggestion");
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    closeAiDrawer();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style>

.notifications-page {
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

.notifications-page .app-shell {
  min-height: 100vh;
}

.notification-stream-card,
.notification-side-card {
  padding: 24px;
  border-radius: 24px;
}

.notification-stream-head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}

.notification-chip-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.notification-stream-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 18px;
}

.notification-entry {
  display: flex;
  gap: 16px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.58);
}

.notification-entry-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  flex: 0 0 auto;
  box-shadow: 0 12px 28px rgba(41, 72, 152, 0.16);
}

.notification-entry-content {
  flex: 1;
  min-width: 0;
}

.notification-entry-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.notification-entry-title {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.notification-entry-title h3,
.notification-entry p,
.notification-side-item h4,
.notification-side-item p {
  margin: 0;
}

.notification-entry-title h3 {
  font-size: 16px;
}

.notification-entry-time {
  color: var(--color-text-tertiary);
  font-size: 12px;
  white-space: nowrap;
}

.notification-entry p {
  margin-top: 10px;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.notification-entry-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 14px;
}

.notification-entry-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.notification-unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-danger-600);
  box-shadow: 0 0 0 6px rgba(216, 58, 52, 0.12);
}

.notification-side-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.notification-side-item {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.58);
}

.notification-side-item p {
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.notification-side-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}

@media (max-width: 1279px) {
  .notification-entry-head {
    flex-direction: column;
  }
}
</style>

