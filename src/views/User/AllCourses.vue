<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import UpgradeBanner from '@/components/UpgradeBanner.vue'
import { makePlaceholders } from '@/mocks/courses.mock'
import CourseCard from '@/components/CourseCard.vue'
import { isComingSoon, isHidden } from '@/utils/courseUtils'

const store = useCoursesStore()

function isMockup(course: any) {
  return String(course?.id || '').startsWith('mock-')
}

const tick = ref<number>(Date.now())

const deadlines = ref<number[]>([])

function endOfNextSunday(): Date {
  const now = new Date()
  const day = now.getDay()
  const daysUntilSunday = (7 - day)
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59)
}

function cycleDeadline(weeks: number): number {
  const base = endOfNextSunday()
  base.setDate(base.getDate() + 7 * (weeks - 1))
  return base.getTime()
}

function initDeadlines(count: number) {
  const pattern = [1, 2, 4] as const
  deadlines.value = Array.from({ length: count }, (_, i) => {
    const idx = (i % pattern.length) as 0 | 1 | 2
    return cycleDeadline(pattern[idx])
  })
}

function resetAllToOneWeek() {
  const t = cycleDeadline(1)
  deadlines.value = deadlines.value.map(() => t)
}

onMounted(() => {
  store.fetchAll()
})

const displayCourses = computed(() => {
  const list = (Array.isArray(store.courses) ? store.courses : []).filter(c => !isHidden(c))
  const need = Math.max(0, 12 - list.length)
  const placeholders = makePlaceholders(need)
  return [...list, ...placeholders]
})

const modalOpen = ref(false)
const modalTitle = ref('')
const modalDesc = ref('')

function openUpcoming(c: any) {
  modalTitle.value = String(c?.name || c?.title || 'Curso Próximamente')
  const isMock = isMockup(c)
  modalDesc.value = isMock
    ? 'Esto es un entorno controlado para el demo. Este curso estará disponible muy pronto.'
    : 'Este contenido estará disponible próximamente en tu cuenta. Estamos trabajando para brindarte la mejor experiencia.'
  modalOpen.value = true
}
function closeModal() { modalOpen.value = false }


watch(displayCourses, (list) => {
  initDeadlines(Array.isArray(list) ? list.length : 0)
}, { immediate: true })

window.setInterval(() => {
  tick.value = Date.now()
  if (deadlines.value.some(ms => ms - tick.value <= 0)) {
    resetAllToOneWeek()
  }
}, 1000)

</script>

<template>
  <div class="all-courses">
    <div class="container">
      <h2 class="title"><i class="fa-solid fa-list" /> Todos los cursos</h2>
      <p class="subtitle">Explora y descubre todos nuestros cursos disponibles.</p>
      <div class="upcoming-notice">
        <i class="fa-regular fa-bell" /> Pronto estarán disponibles más cursos durante este mes.
      </div>
      
      <!-- CTA para usuarios Free -->
      <UpgradeBanner />

      <div v-if="store.loading" class="loading">
        <i class="fa-solid fa-spinner fa-spin" /> Cargando cursos...
      </div>

      <div v-else-if="store.error" class="error">
        <i class="fa-solid fa-triangle-exclamation" /> {{ store.error }}
      </div>

      <div v-else class="grid">
        <div v-if="store.courses.length === 0" class="empty">
          <i class="fa-regular fa-face-smile" />
          <span>No hay cursos disponibles por ahora.</span>
        </div>
        <div v-else class="cards">
          <CourseCard
            v-for="(c, i) in displayCourses"
            :key="c._id || c.id"
            :course="c"
            :to="`/courses/${c.id}`"
            :show-published-badge="true"
            :show-classes-count="!isMockup(c)"
            :disabled="isMockup(c)"
            :blocked="!isMockup(c) && isComingSoon(c)"
            :countdown-to="isMockup(c) ? deadlines[i] : undefined"
            @placeholder-click="openUpcoming(c)"
            @blocked-click="openUpcoming(c)"
          />
        </div>

        <!-- Nice and Minimalist Modal -->
        <Transition name="fade">
          <div v-if="modalOpen" class="modal-root" @click.self="closeModal">
            <div class="modal-container">
              <div class="modal-header">
                <div class="icon-circle">
                  <i class="fa-solid fa-hourglass-half" />
                </div>
                <button class="close-btn" @click="closeModal">
                  <i class="fa-solid fa-xmark" />
                </button>
              </div>
              <div class="modal-content">
                <h3 class="modal-title">{{ modalTitle }}</h3>
                <p class="modal-desc">{{ modalDesc }}</p>
              </div>

              <button class="modal-action" type="button" @click="closeModal">Entendido</button>
            </div>
          </div>
        </Transition>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.all-courses {
  width: 100%;
  padding: 24px 16px;
  background: var(--bg);
  color: var(--text);
}

.container {
  margin: 0 auto;
  display: grid;
  gap: 12px;
}

.title {
  color: var(--text);
  font-size: 24px;
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.subtitle {
  color: color-mix(in oklab, var(--text), transparent 40%);
  margin: 0;
}

.upcoming-notice {
  background: color-mix(in oklab, var(--accent), transparent 92%);
  color: var(--accent);
  border: 1px dashed var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

.grid {
  width: 100%;
}

.cards {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 720px) {
  .cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1080px) {
  .cards {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.modal-root {
  position: fixed;
  inset: 0;
  background: color-mix(in oklab, var(--text), transparent 80%);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-container {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.25);
  animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.icon-circle {
  width: 48px;
  height: 48px;
  background: color-mix(in oklab, var(--accent), transparent 90%);
  color: var(--accent);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  color: color-mix(in oklab, var(--text), transparent 60%);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;

  &:hover {
    color: var(--text);
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
}

.modal-desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: color-mix(in oklab, var(--text), transparent 40%);
}

.modal-action {
  background: var(--accent);
  color: $white;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .modal-container {
    padding: 24px;
  }
}
</style>
