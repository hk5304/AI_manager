<template>
  <div
    class="user-profile-hover"
    @mouseenter="open"
    @mouseleave="close"
  >
    <button class="avatar-chip avatar-chip-button" type="button">
      <span class="avatar-visual" :class="{ loading: isAvatarLoading }">
        <img
          v-if="hasAvatarImage"
          :src="displayAvatar"
          :alt="effectiveUser.name"
          @error="handleImageError"
        />
        <div v-else class="avatar-chip-fallback">{{ userInitial }}</div>
        <span v-if="isAvatarLoading" class="avatar-loading" aria-hidden="true"></span>
      </span>
      <div>
        <strong>{{ effectiveUser.name }}</strong>
        <span>{{ effectiveUser.role }}</span>
      </div>
    </button>

    <div
      class="user-profile-card"
      :class="{ show: isOpen }"
      @click.stop
      @mouseenter="open"
      @mouseleave="close"
    >
      <div class="user-profile-card-head">
        <div class="user-profile-card-avatar" :class="{ loading: isAvatarLoading }">
          <img
            v-if="hasAvatarImage"
            :src="displayAvatar"
            :alt="effectiveUser.name"
            @error="handleImageError"
          />
          <span v-else>{{ userInitial }}</span>
          <span v-if="isAvatarLoading" class="avatar-loading" aria-hidden="true"></span>
        </div>
        <div class="user-profile-card-copy">
          <strong>{{ effectiveUser.name }}</strong>
          <span>{{ effectiveUser.role }}</span>
        </div>
      </div>

      <div class="user-profile-card-actions">
        <button
          class="user-profile-card-logout"
          type="button"
          @click="handleLogout"
        >
          <span class="material-symbols-outlined">logout</span>
          <span>退出登录</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useHoverCard } from "../../composables/useHoverCard";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  showDelay: {
    type: Number,
    default: 300,
  },
  hideDelay: {
    type: Number,
    default: 1000,
  },
});

const router = useRouter();
const imageLoadFailed = ref(false);
const managedProfile = ref(null);
const displayAvatar = ref("");
const isAvatarLoading = ref(false);
let avatarLoadToken = 0;

const SETTINGS_STORAGE_KEY = "app-settings";
const PROFILE_UPDATED_EVENT = "app-profile-updated";

const {
  isOpen,
  open,
  close,
  closeNow,
} = useHoverCard({
  showDelay: props.showDelay,
  hideDelay: props.hideDelay,
});

const loadManagedProfile = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!rawSettings) {
      return null;
    }

    const parsedSettings = JSON.parse(rawSettings);
    return parsedSettings?.profile || null;
  } catch (error) {
    console.error("Failed to load profile settings.", error);
    return null;
  }
};

managedProfile.value = loadManagedProfile();

const effectiveUser = computed(() => {
  const profile = managedProfile.value;

  return {
    name: profile?.name || props.user?.name || "用户",
    role: props.user?.role || "用户",
    avatar: profile?.avatar || "",
  };
});

const userInitial = computed(() => {
  const source = effectiveUser.value.name || "用";
  return source.charAt(0).toUpperCase();
});

const hasAvatarImage = computed(() => Boolean(displayAvatar.value) && !imageLoadFailed.value);

const preloadAvatar = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve();
      return;
    }

    const image = new Image();
    image.onload = () => {
      if (image.decode) {
        image.decode().catch(() => undefined).then(resolve);
        return;
      }

      resolve();
    };
    image.onerror = reject;
    image.src = src;
  });
};

const syncDisplayAvatar = async (nextAvatar) => {
  const token = ++avatarLoadToken;
  imageLoadFailed.value = false;

  if (!nextAvatar) {
    displayAvatar.value = "";
    isAvatarLoading.value = false;
    return;
  }

  isAvatarLoading.value = true;

  try {
    await preloadAvatar(nextAvatar);
    if (token !== avatarLoadToken) {
      return;
    }

    displayAvatar.value = nextAvatar;
    imageLoadFailed.value = false;
  } catch (error) {
    if (token !== avatarLoadToken) {
      return;
    }

    displayAvatar.value = "";
    imageLoadFailed.value = true;
  } finally {
    if (token === avatarLoadToken) {
      isAvatarLoading.value = false;
    }
  }
};

watch(
  () => effectiveUser.value.avatar,
  (nextAvatar) => {
    syncDisplayAvatar(nextAvatar);
  },
  { immediate: true }
);

const handleImageError = () => {
  imageLoadFailed.value = true;
  isAvatarLoading.value = false;
};

const refreshManagedProfile = (profile = null) => {
  managedProfile.value = profile || loadManagedProfile();
};

const handleProfileUpdated = (event) => {
  refreshManagedProfile(event.detail?.profile || null);
};

const handleStorage = (event) => {
  if (event.key === SETTINGS_STORAGE_KEY) {
    refreshManagedProfile();
  }
};

const handleLogout = () => {
  closeNow();
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("userRole");
  router.push("/login");
};

onMounted(() => {
  refreshManagedProfile();
  window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
  window.addEventListener("storage", handleStorage);
});

onBeforeUnmount(() => {
  window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
  window.removeEventListener("storage", handleStorage);
});
</script>

<style scoped>
.user-profile-hover {
  position: relative;
  display: flex;
  align-items: center;
}

.avatar-chip-button {
  border: 0;
  background: transparent;
  cursor: pointer;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
  color: inherit;
  transition: color 180ms ease;
}

.avatar-chip-button:hover strong,
.avatar-chip-button:focus-visible strong {
  color: var(--color-primary-700);
}

.avatar-chip-button:focus-visible {
  outline: 2px solid #8fb7f3;
  outline-offset: 4px;
}

.avatar-visual,
.avatar-chip-fallback,
.user-profile-card-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.avatar-visual {
  position: relative;
  flex: 0 0 auto;
}

.avatar-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-chip-fallback {
  border: 1px solid #dbe6f6;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  color: white;
  font-size: 14px;
  font-weight: 700;
}

.user-profile-card {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 252px;
  border-radius: 14px;
  background: linear-gradient(180deg, #f9f4ff, #ffffff);
  box-shadow: 0 16px 40px rgba(41, 72, 152, 0.14);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  overflow: hidden;
  transform: translateY(-8px) scale(0.97);
  transform-origin: top right;
  transition: opacity 200ms ease, transform 200ms ease, visibility 200ms ease;
  z-index: 50;
}

.user-profile-card.show {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}

.user-profile-card-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 18px 10px;
}

.user-profile-card-avatar {
  position: relative;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  box-shadow: 0 8px 18px rgba(20, 104, 199, 0.18);
}

.user-profile-card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-profile-card-avatar span {
  color: white;
  font-size: 16px;
  font-weight: 700;
}

.avatar-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.36);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.avatar-loading::after {
  content: "";
  width: 16px;
  height: 16px;
  border: 2px solid rgba(20, 104, 199, 0.28);
  border-top-color: var(--color-primary-700);
  border-radius: 50%;
  animation: avatarSpin 760ms linear infinite;
}

.user-profile-card-avatar .avatar-loading::after {
  width: 18px;
  height: 18px;
}

@keyframes avatarSpin {
  to {
    transform: rotate(360deg);
  }
}

.user-profile-card-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.user-profile-card-copy strong {
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 800;
}

.user-profile-card-copy span {
  color: var(--color-text-tertiary);
  font-size: 12px;
}

.user-profile-card-actions {
  padding: 8px 12px 12px;
}

.user-profile-card-logout {
  width: 100%;
  min-height: 42px;
  border: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  background: #fff5f4;
  color: var(--color-danger-600);
  cursor: pointer;
  font-weight: 700;
  transition: background-color 180ms ease, transform 180ms ease;
}

.user-profile-card-logout:hover {
  background: #ffe9e7;
  transform: translateY(-1px);
}

.user-profile-card-logout .material-symbols-outlined {
  font-size: 20px;
}
</style>
