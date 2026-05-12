import { ref } from 'vue'

// 项目数据
const projects = ref([
  {
    id: 1,
    name: '纳米晶体结构优化',
    department: '材料科学部',
    code: 'RD-2026-089',
    tags: ['结构迭代', 'AI 预测'],
    progress: 72,
    health: '良好',
    status: '进行中',
    owner: { name: '王志强', avatar: 'https://i.pravatar.cc/80?img=47' },
    deadline: '2026-05-16',
    memberCount: 12,
    color: 'var(--color-primary-600)',
    priority: 'P0'
  },
  {
    id: 2,
    name: '深度学习实验室自动化',
    department: '计算物理组',
    code: 'RD-2026-112',
    tags: ['平台改造', '自动化'],
    progress: 45,
    health: '风险',
    status: '进行中',
    owner: { name: '陈思远', avatar: 'https://i.pravatar.cc/80?img=22' },
    deadline: '2026-05-30',
    memberCount: 9,
    color: 'var(--color-tertiary-600)',
    priority: 'P1'
  },
  {
    id: 3,
    name: '量子纠缠通信协议 V2',
    department: '前沿实验室',
    code: 'RD-2025-456',
    tags: ['协议升级', '高风险'],
    progress: 15,
    health: '严重',
    status: '已暂停',
    owner: { name: '林博士', avatar: 'https://i.pravatar.cc/80?img=11' },
    deadline: '2026-06-08',
    memberCount: 7,
    color: 'var(--color-danger-600)',
    priority: 'P1'
  },
  {
    id: 4,
    name: '生物聚合材料耐久性测试',
    department: '生物工程组',
    code: 'RD-2026-201',
    tags: ['性能验证', '已交付'],
    progress: 100,
    health: '完成',
    status: '已归档',
    owner: { name: '周雅楠', avatar: 'https://i.pravatar.cc/80?img=35' },
    deadline: '2026-04-18',
    memberCount: 5,
    color: 'var(--color-secondary-600)',
    priority: 'P2'
  }
])

let nextId = 5

const colors = [
  'var(--color-primary-600)',
  'var(--color-secondary-600)',
  'var(--color-tertiary-600)',
  'var(--color-danger-600)',
  'var(--color-warning-600)',
  'var(--color-info-600)'
]

export function useProjects() {
  const addProject = (projectData) => {
    const newProject = {
      id: nextId++,
      name: projectData.name || '新项目',
      department: projectData.department || '未指定',
      code: projectData.code || `RD-${new Date().getFullYear()}-${String(nextId - 1).padStart(3, '0')}`,
      tags: [],
      progress: 0,
      health: '良好',
      status: '进行中',
      owner: { 
        name: projectData.owner || '未指定', 
        avatar: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 50) + 1}` 
      },
      deadline: projectData.deadline || '2026-12-31',
      memberCount: projectData.memberCount ? parseInt(projectData.memberCount) : 5,
      color: colors[(nextId - 2) % colors.length],
      priority: projectData.priority || 'P1'
    }
    projects.value.unshift(newProject)
    return newProject
  }

  return {
    projects,
    addProject
  }
}
