<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useUserStore } from '@/stores/user'
import PlaylistSidebar from '@/components/lecture/PlaylistSidebar.vue'
import CourseLanding from '@/views/Landing/CourseLanding.vue'

const route = useRoute()
const router = useRouter()
const store = useCoursesStore()
const userStore = useUserStore()
import UserSidebar from '@/components/UserSidebar.vue'
import UserHeader from '@/components/UserHeader.vue'
import PublicHeader from '@/components/PublicHeader.vue'

const menuIsOpen = ref(false)
function openCloseMenu() { menuIsOpen.value = !menuIsOpen.value }

watch(() => route.fullPath, () => {
  menuIsOpen.value = false
});

const id = computed(() => route.params.id as string)

const userId = computed(() => {
  if (!userStore.id) userStore.hydrate()
  const uid = userStore.id
  return typeof uid === 'number' ? String(uid) : (uid || '')
})

const progressPercent = computed(() => Number(store.progress?.percent || 0))
const progressText = computed(() => {
  const c = Number(store.progress?.completed || 0)
  const t = Number(store.progress?.total || 0)
  return `${c}/${t}`
})


function sanitizeUrl(url?: string) {
  return (url || '').toString().replace(/`/g, '').trim()
}

function coverOf(course: any) {
  return sanitizeUrl(course?.image_url) || sanitizeUrl(course?.coverUrl) || '/src/assets/fudmaster-color.png'
}

function flattenLectures(course: any): any[] {
  const sections = Array.isArray(course?.lecture_sections) ? course.lecture_sections : []
  const list: any[] = []
  for (const s of sections) {
    const lectures = Array.isArray(s?.lectures) ? s.lectures : []
    for (const l of lectures) list.push(l)
  }
  return list.sort((a, b) => Number(a?.position || 0) - Number(b?.position || 0))
}

const resumeLectureId = computed(() => {
  const course = store.currentCourse
  if (!course) return null as any
  const all = flattenLectures(course)

  // Find first lecture NOT in completed list
  const completed = store.progress.completedLectureIds || []
  const firstIncomplete = all.find(l => !completed.map(String).includes(String(l.id)))

  // If found, that's our resume point. 
  // If all completed, maybe return the FIRST one to review, or the LAST one?
  // Usually if done, you might want to review the beginning. 
  // Let's stick to firstIncomplete ?? all[0]?.id
  return firstIncomplete?.id || all[0]?.id || null
})

const ctaLabel = computed(() => {
  if (progressPercent.value > 0 && progressPercent.value < 100) return 'Continuar estudiando'
  if (progressPercent.value === 100) return 'Volver a ver'
  return 'Iniciar clase'
})

const ctaIcon = computed(() => {
  if (progressPercent.value === 100) return 'fa-solid fa-rotate-left'
  return 'fa-solid fa-play'
})

const loadCourseData = async (courseId: string) => {
  if (!courseId) return
  try {
    await store.fetchById(courseId)
    if (userId.value) {
      await store.fetchProgress(courseId, userId.value)
    }
  } catch (e) {
    console.error('Error loading course details', e)
  }
}

watch(id, (newId) => {
  if (newId) loadCourseData(newId)
}, { immediate: true })

onMounted(() => {
  // handled by watch immediate
})



function openLecture(lectureId: number | string) {
  if (!id.value) return
  router.push(`/courses/${id.value}/lectures/${lectureId}`)
}

function goBack() { router.push('/courses') }

async function startQuiz() {
  if (!id.value) return
  router.push(`/courses/${id.value}/quiz`)
}

const showLanding = computed(() => {
  // If not logged in -> Landing
  if (!userStore.isAuthenticated) return true

  // If logged in, check if we have an enrollment error (meaning not enrolled)
  // or logic dictates we don't have access.
  // The store sets errorCode = 404 when "fetchProgress" fails due to not found (not enrolled).
  if (store.errorCode === 404) return true

  return false
})
</script>

<template>
  <div class="course-detail">
    <!-- LANDING PAGE (Public/Guest or Not Enrolled) -->
    <div v-if="showLanding && store.currentCourse && !store.loading" class="landing-layout">
       <PublicHeader />
       <CourseLanding 
         :course="store.currentCourse" 
         :loading="store.loading" 
       />
    </div>

    <!-- STUDENT DASHBOARD (Enrolled) + LAYOUT RECONSTRUCTION -->
    <div v-else class="wrapper">
      <div class="header-layout">
        <UserHeader @toggle-sidebar="openCloseMenu" />
      </div>
      
      <!-- Mobile Sidebar Overlay -->
      <button class="floating-menu-btn" type="button" @click="openCloseMenu">
        <i class="fa-solid fa-bars"></i>
      </button>
      <div class="overlay" v-if="menuIsOpen" @click.self="openCloseMenu">
          <div class="overlay-panel">
            <div class="overlay-head">
               <img src="@/assets/iso-verde.png" alt="logo" class="overlay-logo" />
            </div>
            <UserSidebar :menuIsOpen="false" />
          </div>
      </div>

      <div class="layout">
        <div class="layout-menu-wrapper">
          <UserSidebar :menuIsOpen="menuIsOpen" />
        </div>
        <div class="layout-view-wrapper">
          
          <!-- Loading State Inside Layout -->
          <div v-if="store.loading && (!store.currentCourse || String(store.currentCourse?.id) !== String(id))" class="skeleton-container container">
            <div class="skeleton-header">
              <div class="skeleton-pill"></div>
              <div class="skeleton-title"></div>
            </div>
            <div class="skeleton-content">
              <div class="skeleton-left">
                <div class="skeleton-media"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
                <div class="skeleton-actions">
                  <div class="skeleton-btn"></div>
                  <div class="skeleton-btn"></div>
                </div>
              </div>
              <div class="skeleton-right">
                <div class="skeleton-item" v-for="i in 4" :key="i"></div>
              </div>
            </div>
          </div>

          <!-- 404 Not Found -->
          <div v-else-if="(!store.currentCourse && !store.loading) || (store.error && !store.currentCourse)" class="error-state">
             <div class="empty">
              <i class="fa-regular fa-face-meh" /> No se encontró el curso.
            </div>
          </div>

          <!-- ACTUAL COURSE DETAIL CONTENT -->
          <div v-else-if="store.currentCourse" class="container course-content-container">
              <div class="progress">
                <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
                <div class="progress-meta">Progreso: {{ progressPercent }}% · {{ progressText }}</div>
              </div>
              
               <div class="header">
                  <div class="header-top">
                    <button class="back" type="button" @click="goBack"><i class="fa-solid fa-arrow-left" /> Volver</button>
                    <button class="cta-start small" type="button" :disabled="!resumeLectureId" @click="resumeLectureId && openLecture(resumeLectureId)">
                      <i :class="ctaIcon" /> 
                      <span>{{ ctaLabel }}</span>
                    </button>
                  </div>
                  <h2 class="title"><i class="fa-solid fa-graduation-cap" /> {{ store.currentCourse.name || store.currentCourse.title }}</h2>
                </div>
                <div class="content">
                  <div class="left">
                    <div class="cover">
                      <img :src="coverOf(store.currentCourse)" alt="course cover" />
                    </div>
                    <div class="info">
                      <p class="subtitle">{{ store.currentCourse.heading || store.currentCourse.shortDescription || store.currentCourse.description }}</p>
                      <div class="author" v-if="store.currentCourse.author_bio">
                        <span class="author-name"><i class="fa-solid fa-user" /> {{ store.currentCourse.author_bio.name }}</span>
                      </div>
                      <div class="actions">
                        <button class="cta-start" type="button" :disabled="!resumeLectureId" @click="resumeLectureId && openLecture(resumeLectureId)">
                          <i :class="ctaIcon" /> 
                          <span>{{ ctaLabel }}</span>
                        </button>
                        <button class="cta-quiz" type="button" @click="startQuiz">
                          <i class="fa-solid fa-list-check" /> 
                          <span>Iniciar quiz</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="right" v-if="Array.isArray(store.currentCourse.lecture_sections) && store.currentCourse.lecture_sections.length">
                    <PlaylistSidebar :sections="store.currentCourse.lecture_sections" :course-id="String(id)" :completed-lecture-ids="store.progress.completedLectureIds" />
                  </div>
                </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss" scoped>
// --- LAYOUT STYLES (Copied from UserLayout) ---
.wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);

  .header-layout {
    width: 100%;
    flex: 0 0 auto;
  }

  .floating-menu-btn {
    display: none;
  }

  .overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: color-mix(in oklab, var(--text), transparent 68%);
    z-index: 1000;
  }

  .overlay-panel {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    max-width: 280px;
    background: var(--bg);
    border-right: 1px solid var(--border);
    box-shadow: 0 8px 24px rgba($FUDMASTER-DARK, 0.2);
    display: flex;
    flex-direction: column;
  }

  .overlay-head {
    padding: 16px 12px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .overlay-logo {
    width: 36px;
    height: 36px;
    object-fit: contain;
  }
}

.layout {
  flex: 1 1 auto;
  display: flex;
  overflow: hidden;

  &-menu-wrapper {
    width: 100%;
    max-width: fit-content;
    min-width: 24px;
    overflow: hidden;
    flex: 0 0 auto;
  }

  &-view-wrapper {
    width: 100%;
    flex: 1 1 auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

@media (max-width: 1024px) {
  .wrapper {
    .floating-menu-btn {
      position: fixed;
      bottom: 16px;
      left: 16px;
      z-index: 1100;
      background: var(--accent);
      color: $white;
      border: none;
      border-radius: 999px;
      width: 44px;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 16px color-mix(in oklab, var(--text), transparent 80%);
      cursor: pointer;
    }

    .floating-menu-btn:active {
      filter: brightness(0.95);
    }

    .layout {
      &-menu-wrapper {
        display: none;
      }
    }

    .overlay {
      display: block;
    }
  }
}

// --- CONTENT STYLES ---

.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.skeleton-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-pill {
  width: 120px;
  height: 24px;
  background: color-mix(in srgb, var(--text) 10%, transparent);
  border-radius: 999px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-title {
  width: 60%;
  height: 40px;
  background: color-mix(in srgb, var(--text) 10%, transparent);
  border-radius: 12px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 1024px) {
    grid-template-columns: 1.8fr 1fr;
  }
}

.skeleton-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-media {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: color-mix(in srgb, var(--text) 10%, transparent);
  border-radius: 16px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-text {
  width: 100%;
  height: 20px;
  background: color-mix(in srgb, var(--text) 5%, transparent);
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;

  &.short {
    width: 40%;
  }
}

.skeleton-actions {
  display: flex;
  gap: 16px;
}

.skeleton-btn {
  width: 160px;
  height: 48px;
  background: color-mix(in srgb, var(--text) 10%, transparent);
  border-radius: 999px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-item {
  width: 100%;
  height: 60px;
  background: color-mix(in srgb, var(--text) 5%, transparent);
  border-radius: 12px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.3;
  }

  100% {
    opacity: 0.6;
  }
}

.course-detail {

  width: 100%;
  // padding removed here as it is handled by layout/wrapper now
  background: var(--bg);
  color: var(--text);

  // If showing landing/error, we take full height
  &,
  .loading-state,
  .error-state,
  .landing-layout {
    min-height: 100vh;
  }
}

.landing-layout {
  display: flex;
  flex-direction: column;
}

.course-content-container {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
  padding: 24px 16px; // Add padding here
}

// ... existing styles ...

.header {
  display: grid;
  gap: 8px;

  .header-top {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.progress {
  display: grid;
  gap: 6px;
}

.progress-bar {
  height: 8px;
  background: var(--accent);
  width: 0%;
  transition: width 0.3s ease;
  border-radius: 999px;
}

.progress-meta {
  color: color-mix(in oklab, var(--text), transparent 40%);
  font-size: 12px;
}

.no-access {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px;
  background: color-mix(in oklab, var(--bg), var(--text) 2%);
  border: 1px dashed var(--border);
  border-radius: 24px;
  gap: 16px;
  margin-top: 24px;

  .no-access-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, color-mix(in oklab, var(--accent), transparent 80%) 0%, color-mix(in oklab, var(--accent), transparent 90%) 100%);
    color: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin-bottom: 8px;
    box-shadow: 0 10px 20px -5px color-mix(in oklab, var(--accent), transparent 85%);
  }

  h3 {
    font-size: 24px;
    margin: 0;
    color: var(--text);
    font-weight: 700;
  }

  p {
    margin: 0;
    color: color-mix(in oklab, var(--text), transparent 40%);
    max-width: 400px;
    line-height: 1.6;
    font-size: 16px;
  }

  .cta-start {
    margin-top: 8px;
  }
}

.header {
  display: grid;
  gap: 8px;

  .header-top {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.back {
  background: none;
  border: none;
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.loading,
.error,
.empty {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: color-mix(in oklab, var(--text), transparent 40%);
  background: color-mix(in oklab, var(--bg), var(--text) 6%);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
}

.error {
  color: $alert-error;
  background: $alert-error-bg;
  border-color: rgba($alert-error, 0.3);
}

.content {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 960px) {
  .content {
    grid-template-columns: 1.4fr 1fr;
  }
}

@media (min-width: 1280px) {
  .content {
    grid-template-columns: 1.8fr 1fr;
  }
}

.left {
  display: grid;
  gap: 12px;
}

.right {
  display: grid;
  gap: 12px;
}

.cover img {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  display: block;
  box-shadow: 0 20px 40px -10px rgba($FUDMASTER-DARK, 0.06);
}

.info {
  display: grid;
  gap: 8px;
}

.title {
  color: var(--text);
  margin: 0;
  font-size: 26px;
  padding: 24px 0;
}

.subtitle {
  color: color-mix(in oklab, var(--text), transparent 40%);
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
}

.author {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: color-mix(in oklab, var(--text), transparent 60%);
  font-size: 14px;
}

.author-name {
  color: var(--accent);
}

.actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cta-start,
.cta-quiz {
  border: none;
  border-radius: 999px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.cta-start {
  background: $FUDMASTER-PINK;
  color: $white;
  box-shadow: 0 4px 12px rgba($FUDMASTER-PINK, 0.3);

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: color-mix(in oklab, var(--bg), var(--text) 6%);
    color: color-mix(in oklab, var(--text), transparent 50%);
    border: 1px solid var(--border);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  &.small {
    padding: 8px 16px;
    font-size: 13px;
  }
}

.cta-quiz {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);

  &:hover {
    background: var(--bg-hover, rgba(0, 0, 0, 0.05));
    border-color: var(--accent);
    color: var(--accent);
  }
}

.quiz-section {
  margin-top: 16px;
}
</style>
