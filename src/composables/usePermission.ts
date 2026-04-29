import { ref, computed } from 'vue'

// 模拟用户权限数据，实际项目中应从Pinia store获取
const usePermission = () => {
  // 从localStorage获取当前角色，默认为developer
  const currentRole = ref(localStorage.getItem('userRole') || 'developer')

  // 角色权限映射
  const rolePermissions = {
    super_admin: [
      'admin:access', 'admin:user:manage', 'admin:role:manage', 'admin:project-template:manage', 'admin:logs:view', 'admin:system:manage',
      'project:create', 'project:edit', 'project:delete', 'project:archive', 'project:view',
      'milestone:create', 'milestone:edit', 'milestone:delete', 'milestone:baseline', 'milestone:view',
      'gantt:view', 'gantt:edit', 'gantt:baseline',
      'member:view', 'member:invite', 'member:remove', 'member:assign', 'member:load:view',
      'task:create', 'task:edit', 'task:assign', 'task:status:change', 'task:subtask:create', 'task:delete', 'task:view',
      'workbench:view', 'log:create', 'log:edit', 'log:comment', 'log:like', 'log:ai:generate', 'pbc:view:all', 'pbc:create', 'pbc:edit', 'pbc:task:link', 'pbc:self:review', 'pbc:review',
      'report:view', 'report:ai:insight', 'report:export', 'report:subscribe',
      'settings:edit'
    ],
    admin: [
      'admin:access', 'admin:user:manage', 'admin:role:manage', 'admin:project-template:manage', 'admin:logs:view', 'admin:system:manage',
      'project:create', 'project:edit', 'project:delete', 'project:archive', 'project:view',
      'milestone:create', 'milestone:edit', 'milestone:delete', 'milestone:baseline', 'milestone:view',
      'gantt:view', 'gantt:edit', 'gantt:baseline',
      'member:view', 'member:invite', 'member:remove', 'member:assign', 'member:load:view',
      'task:create', 'task:edit', 'task:assign', 'task:status:change', 'task:subtask:create', 'task:delete', 'task:view',
      'workbench:view', 'log:create', 'log:edit', 'log:comment', 'log:like', 'log:ai:generate', 'pbc:view:all', 'pbc:create', 'pbc:edit', 'pbc:task:link', 'pbc:self:review', 'pbc:review',
      'report:view', 'report:ai:insight', 'report:export', 'report:subscribe',
      'settings:edit'
    ],
    pm: [
      'project:create', 'project:edit:own', 'project:delete:own', 'project:archive:own', 'project:view',
      'milestone:create', 'milestone:edit', 'milestone:delete', 'milestone:baseline', 'milestone:view',
      'gantt:view', 'gantt:edit', 'gantt:baseline',
      'member:view', 'member:invite', 'member:remove', 'member:assign', 'member:load:view',
      'task:create', 'task:edit', 'task:assign', 'task:status:change', 'task:subtask:create', 'task:delete', 'task:view',
      'workbench:view', 'log:create', 'log:edit', 'log:comment', 'log:like', 'log:ai:generate', 'pbc:view:team', 'pbc:create', 'pbc:edit', 'pbc:task:link', 'pbc:self:review', 'pbc:review:team',
      'report:view', 'report:ai:insight', 'report:export', 'report:subscribe',
      'settings:edit'
    ],
    developer: [
      'project:view',
      'milestone:view',
      'gantt:view', 'gantt:baseline',
      'member:view',
      'task:create:self', 'task:edit:self', 'task:status:change:self', 'task:subtask:create', 'task:view',
      'workbench:view', 'log:create', 'log:edit', 'log:comment', 'log:like', 'log:ai:generate', 'pbc:view:self', 'pbc:create', 'pbc:edit', 'pbc:task:link', 'pbc:self:review',
      'report:view:self', 'report:ai:insight',
      'settings:edit'
    ],
    qa: [
      'project:view',
      'milestone:view',
      'gantt:view', 'gantt:baseline',
      'member:view',
      'task:create:bug', 'task:edit:self', 'task:status:change:self', 'task:subtask:create', 'task:view',
      'workbench:view', 'log:create', 'log:edit', 'log:comment', 'log:like', 'log:ai:generate', 'pbc:view:self', 'pbc:create', 'pbc:edit', 'pbc:task:link', 'pbc:self:review',
      'report:view:self', 'report:ai:insight',
      'settings:edit'
    ],
    product: [
      'project:create', 'project:view',
      'milestone:create:suggest', 'milestone:view',
      'gantt:view', 'gantt:baseline',
      'member:view',
      'task:create', 'task:edit:self', 'task:status:change:self', 'task:subtask:create', 'task:view',
      'workbench:view', 'log:create', 'log:edit', 'log:comment', 'log:like', 'log:ai:generate', 'pbc:view:self', 'pbc:create', 'pbc:edit', 'pbc:task:link', 'pbc:self:review',
      'report:view', 'report:ai:insight',
      'settings:edit'
    ],
    collaborator: [
      'project:view',
      'milestone:view',
      'gantt:view', 'gantt:baseline',
      'member:view',
      'task:view',
      'workbench:view', 'log:create', 'log:edit', 'log:comment', 'log:like', 'log:ai:generate', 'pbc:view:self', 'pbc:create', 'pbc:edit', 'pbc:task:link', 'pbc:self:review',
      'report:view', 'report:ai:insight',
      'settings:edit'
    ]
  }

  // 获取当前角色的权限
  const userPermissions = computed(() => {
    return rolePermissions[currentRole.value as keyof typeof rolePermissions] || []
  })

  // 检查用户是否有指定权限
  const hasPermission = (permission: string) => {
    return userPermissions.value.includes(permission)
  }

  // 检查用户是否有多个权限中的任意一个
  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some(permission => userPermissions.value.includes(permission))
  }

  // 检查用户是否有所有指定权限
  const hasAllPermissions = (permissions: string[]) => {
    return permissions.every(permission => userPermissions.value.includes(permission))
  }

  // 检查用户是否为指定角色
  const isRole = (role: string) => {
    return currentRole.value === role
  }

  // 检查用户是否为指定角色之一
  const isAnyRole = (roles: string[]) => {
    return roles.includes(currentRole.value)
  }

  // 更新当前角色
  const setRole = (role: string) => {
    currentRole.value = role
    localStorage.setItem('userRole', role)
  }

  return {
    currentRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRole,
    isAnyRole,
    setRole
  }
}

export default usePermission