<template>
  <div class="ai-insight-card">
    <div class="insight-header">
      <h3>AI 洞察</h3>
      <span class="insight-badge">AI 生成</span>
    </div>
    <div class="insight-content">
      <p>{{ insightText }}</p>
    </div>
    <div class="insight-actions">
      <button class="like-btn" :class="{ liked: isLiked }" @click="toggleLike">
        👍 {{ likeCount }}
      </button>
      <button class="dislike-btn" :class="{ disliked: isDisliked }" @click="toggleDislike">
        👎 {{ dislikeCount }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  insightText: {
    type: String,
    default: '根据项目数据分析，当前项目进度正常，但存在部分任务延期风险。建议关注前端开发任务的进度，及时调整资源分配。'
  }
})

const isLiked = ref(false)
const isDisliked = ref(false)
const likeCount = ref(0)
const dislikeCount = ref(0)

const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    likeCount.value++
    isDisliked.value = false
  } else {
    likeCount.value--
  }
}

const toggleDislike = () => {
  isDisliked.value = !isDisliked.value
  if (isDisliked.value) {
    dislikeCount.value++
    isLiked.value = false
  } else {
    dislikeCount.value--
  }
}
</script>

<style scoped>
.ai-insight-card {
  background: linear-gradient(135deg, #f6f8ff, #f0f2f5);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  border-left: 4px solid #722ed1;
}

.insight-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.insight-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.insight-badge {
  font-size: 12px;
  padding: 2px 8px;
  background: #722ed1;
  color: white;
  border-radius: 12px;
}

.insight-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.insight-actions {
  display: flex;
  gap: 10px;
}

.like-btn, .dislike-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.like-btn:hover, .like-btn.liked {
  background: #f0f9eb;
  border-color: #c2e7b0;
  color: #52C41A;
}

.dislike-btn:hover, .dislike-btn.disliked {
  background: #fef0f0;
  border-color: #fbc4c4;
  color: #FF4D4F;
}
</style>