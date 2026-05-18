import { reactive, computed } from 'vue';
import { tasks as initialTasks, users } from '../data/mockData.js';
// 任务状态映射
const statusMap = {
 '待开始': 'todo',
 '进行中': 'doing',
 '待审核': 'review',
 '已通过': 'approved',
 '已驳回': 'rejected',
 '已完成': 'done'
};
// 看板列配置
const kanbanColumns = [
 { id: 'todo', name: '待开始', status: '待开始' },
 { id: 'doing', name: '进行中', status: '进行中' },
 { id: 'review', name: '待审核', status: '待审核' },
 { id: 'done', name: '已完成', status: '已完成' }
];
// 响应式状态
const state = reactive({
 tasks: [...initialTasks],
 selectedTask: null,
 showTaskModal: false,
 showReviewModal: false,
 searchKeyword: '',
 currentUserId: 1,
 currentUserName: '张三',
 currentRole: localStorage.getItem('userRole') || 'super_admin'
});
// 计算属性
const filteredTasks = computed(() => {
 if (!state.searchKeyword)
 return state.tasks;
 const keyword = state.searchKeyword.toLowerCase();
 return state.tasks.filter(task => task.title.toLowerCase().includes(keyword) ||
 task.assignee.toLowerCase().includes(keyword) ||
 task.projectName.toLowerCase().includes(keyword));
});
const tasksByStatus = computed(() => {
 const result = {};
 kanbanColumns.forEach(col => {
 result[col.id] = filteredTasks.value.filter(task => task.status === col.status);
 });
 // 将已通过的任务放在已完成列
 if (result.approved) {
 result.done = [...(result.done || []), ...result.approved];
 }
 return result;
});
const todoTasks = computed(() => tasksByStatus.value.todo || []);
const doingTasks = computed(() => tasksByStatus.value.doing || []);
const reviewTasks = computed(() => tasksByStatus.value.review || []);
const doneTasks = computed(() => tasksByStatus.value.done || []);
const pendingReviewTasks = computed(() => state.tasks.filter(t => t.status === '待审核'));
const myTasks = computed(() => state.tasks.filter(t => t.assigneeId === state.currentUserId));
// 操作方法
const actions = {
 // 打开任务详情弹窗
 openTaskModal(task) {
 state.selectedTask = task ? { ...task } : null;
 state.showTaskModal = true;
 },
 // 关闭任务弹窗
 closeTaskModal() {
 state.selectedTask = null;
 state.showTaskModal = false;
 },
 // 打开审核弹窗
 openReviewModal(task) {
 state.selectedTask = task ? { ...task } : null;
 state.showReviewModal = true;
 },
 // 关闭审核弹窗
 closeReviewModal() {
 state.selectedTask = null;
 state.showReviewModal = false;
 },
 // 创建任务
 createTask(taskData) {
 const newTask = {
 id: Date.now(),
 ...taskData,
 createdAt: new Date().toLocaleString('zh-CN'),
 updatedAt: new Date().toLocaleString('zh-CN'),
 attachments: [],
 comments: [],
 reviewStatus: null,
 reviewComment: null,
 reviewTime: null
 };
 state.tasks.push(newTask);
 // 添加通知
 notificationsStore.addNotification({
 id: Date.now(),
 type: 'task',
 title: '新任务分配',
 content: `您有新任务：${newTask.title}`,
 targetUserId: newTask.assigneeId,
 read: false,
 createdAt: new Date().toLocaleString('zh-CN')
 });
 },
 // 更新任务
 updateTask(taskId, updates) {
 const index = state.tasks.findIndex(t => t.id === taskId);
 if (index !== -1) {
 state.tasks[index] = {
 ...state.tasks[index],
 ...updates,
 updatedAt: new Date().toLocaleString('zh-CN')
 };
 }
 },
 // 删除任务
 deleteTask(taskId) {
 const index = state.tasks.findIndex(t => t.id === taskId);
 if (index !== -1) {
 state.tasks.splice(index, 1);
 }
 },
 // 更改任务状态
 changeTaskStatus(taskId, newStatus) {
 const task = state.tasks.find(t => t.id === taskId);
 if (task) {
 task.status = newStatus;
 task.updatedAt = new Date().toLocaleString('zh-CN');
 // 如果状态变为待审核，通知审核人
 if (newStatus === '待审核') {
 notificationsStore.addNotification({
 id: Date.now(),
 type: 'review',
 title: '任务待审核',
 content: `任务「${task.title}」已提交审核，请及时处理`,
 targetUserId: task.reviewerId,
 read: false,
 createdAt: new Date().toLocaleString('zh-CN')
 });
 }
 }
 },
 // 提交审核
 submitForReview(taskId) {
 actions.changeTaskStatus(taskId, '待审核');
 },
 // 审核通过
 approveTask(taskId, comment) {
 const task = state.tasks.find(t => t.id === taskId);
 if (task) {
 task.reviewStatus = 'approved';
 task.reviewComment = comment;
 task.reviewTime = new Date().toLocaleString('zh-CN');
 task.status = '已完成';
 // 通知任务负责人
 notificationsStore.addNotification({
 id: Date.now(),
 type: 'review_result',
 title: '任务审核通过',
 content: `您的任务「${task.title}」已通过审核`,
 targetUserId: task.assigneeId,
 read: false,
 createdAt: new Date().toLocaleString('zh-CN')
 });
 }
 },
 // 驳回任务
 rejectTask(taskId, comment) {
 const task = state.tasks.find(t => t.id === taskId);
 if (task) {
 task.reviewStatus = 'rejected';
 task.reviewComment = comment;
 task.reviewTime = new Date().toLocaleString('zh-CN');
 task.status = '已驳回';
 // 通知任务负责人
 notificationsStore.addNotification({
 id: Date.now(),
 type: 'review_result',
 title: '任务审核驳回',
 content: `您的任务「${task.title}」被驳回：${comment}`,
 targetUserId: task.assigneeId,
 read: false,
 createdAt: new Date().toLocaleString('zh-CN')
 });
 }
 },
 // 添加评论
 addComment(taskId, content) {
 const task = state.tasks.find(t => t.id === taskId);
 if (task) {
 task.comments.push({
 id: Date.now(),
 userId: state.currentUserId,
 userName: state.currentUserName,
 content,
 time: new Date().toLocaleString('zh-CN')
 });
 }
 },
 // 添加附件
 addAttachment(taskId, filename) {
 const task = state.tasks.find(t => t.id === taskId);
 if (task) {
 task.attachments.push(filename);
 }
 },
 // 设置搜索关键词
 setSearchKeyword(keyword) {
 state.searchKeyword = keyword;
 },
 // 设置当前用户
 setCurrentUser(userId, userName, role) {
 state.currentUserId = userId;
 state.currentUserName = userName;
 state.currentRole = role;
 localStorage.setItem('userRole', role);
 },
 // 获取可用的审核人列表
 getReviewers() {
 return users.filter(u => ['super_admin', 'admin', 'pm'].includes(u.role));
 },
 // 获取可用的指派人列表
 getAssignableUsers() {
 return users.filter(u => ['developer', 'qa', 'product'].includes(u.role));
 }
};
// 通知Store
const notificationsStore = reactive({
 notifications: [
 {
 id: 1,
 type: 'review',
 title: '任务待审核',
 content: '任务「用户登录功能」已提交审核',
 targetUserId: 1,
 read: false,
 createdAt: '2026-03-08 18:00'
 },
 {
 id: 2,
 type: 'task',
 title: '新任务分配',
 content: '您有新任务：API接口开发',
 targetUserId: 1,
 read: false,
 createdAt: '2026-03-08 10:00'
 },
 {
 id: 3,
 type: 'review_result',
 title: '任务审核结果',
 content: '您的任务「数据库设计」已通过审核',
 targetUserId: 1,
 read: true,
 createdAt: '2026-03-05 17:00'
 }
 ],
 addNotification(notification) {
 this.notifications.unshift(notification);
 },
 markAsRead(notificationId) {
 const notification = this.notifications.find(n => n.id === notificationId);
 if (notification) {
 notification.read = true;
 }
 },
 markAllAsRead() {
 this.notifications.forEach(n => n.read = true);
 },
 getUnreadCount() {
 return this.notifications.filter(n => !n.read).length;
 },
 getUserNotifications(userId) {
 return this.notifications.filter(n => n.targetUserId === userId);
 }
});
export const taskStore = {
 state,
 kanbanColumns,
 todoTasks,
 doingTasks,
 reviewTasks,
 doneTasks,
 pendingReviewTasks,
 myTasks,
 filteredTasks,
 ...actions
};
export const notificationStore = notificationsStore;
export default taskStore;
