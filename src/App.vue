<template>
  <!--
  <Transition name="route-loading-fade">
    <div v-if="isRouteLoading" class="route-loading-overlay" role="status" aria-live="polite">
      <div class="route-loading-card">
        <span class="route-loading-spinner"></span>
      </div>
    </div>
  </Transition>
  -->

  <router-view v-slot="{ Component, route }">
    <Transition :name="getRouteTransitionName(route)" mode="out-in">
      <div :key="getRouteViewKey(route)" class="route-transition-view">
        <component :is="Component" />
      </div>
    </Transition>
  </router-view>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import router from './router'

const isRouteLoading = ref(false)
let loadingTimer = null
let loadingStartedAt = 0

const isProjectRoute = (route) => {
  return route.path.startsWith('/project/') && route.params?.id
}

const isSameProjectRoute = (to, from) => {
  return isProjectRoute(to) && isProjectRoute(from) && String(to.params.id) === String(from.params.id)
}

const getRouteViewKey = (route) => {
  if (isProjectRoute(route)) {
    return `project:${route.params.id}`
  }

  return route.fullPath
}

const getRouteTransitionName = (route) => {
  return route.meta.routeTransition || 'page-fade'
}

const clearLoadingTimer = () => {
  if (loadingTimer) {
    window.clearTimeout(loadingTimer)
    loadingTimer = null
  }
}

const stopRouteLoading = () => {
  clearLoadingTimer()

  const elapsed = performance.now() - loadingStartedAt
  const remaining = Math.max(0, 260 - elapsed)

  loadingTimer = window.setTimeout(() => {
    isRouteLoading.value = false
    loadingTimer = null
  }, remaining)
}

/*
const removeBeforeHook = router.beforeEach((to, from) => {
  clearLoadingTimer()

  const shouldShowLoader = to.meta.routeLoader && to.fullPath !== from.fullPath && !isSameProjectRoute(to, from)

  if (shouldShowLoader) {
    loadingStartedAt = performance.now()
    isRouteLoading.value = true
  } else {
    loadingStartedAt = 0
    isRouteLoading.value = false
  }
})

const removeAfterHook = router.afterEach(() => {
  if (isRouteLoading.value) {
    stopRouteLoading()
  }
})

const removeErrorHook = router.onError(() => {
  isRouteLoading.value = false
  clearLoadingTimer()
})
*/

onBeforeUnmount(() => {
  /*
  removeBeforeHook()
  removeAfterHook()
  removeErrorHook()
  */
  clearLoadingTimer()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

#app {
  height: 100%;
}

.route-transition-view {
  min-height: 100%;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 200ms ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

.page-fade-fast-enter-active,
.page-fade-fast-leave-active {
  transition: opacity 200ms ease;
}

.page-fade-fast-enter-from,
.page-fade-fast-leave-to {
  opacity: 0;
}

.route-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: grid;
  place-items: center;
  pointer-events: none;
  background: rgba(247, 248, 252, 0.28);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.route-loading-card {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 48px rgba(41, 72, 152, 0.12);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.route-loading-spinner {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 3px solid rgba(20, 104, 199, 0.16);
  border-top-color: var(--color-primary-700, #0058bd);
  animation: route-loading-spin 720ms linear infinite;
}

.route-loading-fade-enter-active,
.route-loading-fade-leave-active {
  transition: opacity 140ms ease;
}

.route-loading-fade-enter-from,
.route-loading-fade-leave-to {
  opacity: 0;
}

@keyframes route-loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
