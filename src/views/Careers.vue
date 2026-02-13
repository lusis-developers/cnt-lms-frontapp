<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCareersStore } from '@/stores/careers'
import { useUserStore } from '@/stores/user'
import { useCoursesStore } from '@/stores/courses'
import { makeCareerPlaceholders } from '@/mocks/careers.mock'
import CareerCard from '@/components/CareerCard.vue'

const store = useCareersStore()
const userStore = useUserStore()
const coursesStore = useCoursesStore()
const router = useRouter()

const modalOpen = ref(false)
const modalTitle = ref('')
const modalDesc = ref('')

function openModal(c: any) {
  modalTitle.value = String(c?.name || c?.title || 'Escuela Próximamente')
  const isMock = String(c?._id || c?.id || '').startsWith('mock-')
  modalDesc.value = isMock
    ? 'Esto es un entorno controlado para el demo. Este curso estará disponible muy pronto.'
    : 'Este contenido estará disponible próximamente en tu cuenta. Estamos trabajando para brindarte la mejor experiencia.'
  modalOpen.value = true
}
function closeModal() { modalOpen.value = false }

onMounted(async () => {

  await store.fetchAll()
  userStore.hydrate()
  const uid = userStore.id || localStorage.getItem('user_id')
  if (uid) await store.fetchUserCareers(String(uid))
})

const isFreeUser = computed(() => {
  if (!userStore.id) userStore.hydrate()
  return userStore.accountType === 'free'
})

const careers = computed(() => store.careers)
const loading = computed(() => store.loading)
const error = computed(() => store.error)

const mockCareers = computed(() => makeCareerPlaceholders(4))
const upcomingCareers = computed(() => mockCareers.value)

const userCareerIds = computed(() => {
  const list = Array.isArray(store.userCareers) ? store.userCareers : []
  const base = list.map((c: any) => String(c?.info?._id || c?.access?.careerId || ''))
  return new Set(base)
})

const myCareers = computed(() => {
  const list = Array.isArray(store.userCareers) ? store.userCareers : []
  return list.map((c: any) => c?.info || c?.access).filter(Boolean)
})

function sanitizeUrl(url?: string) {
  return (url || '').toString().replace(/`/g, '').trim()
}

function coverOf(career: any) {
  return sanitizeUrl(career?.imageUrl) || '/src/assets/fudmaster-color.png'
}


function coursesCount(career: any) {
  const ids = Array.isArray(career?.courseIds) ? career.courseIds : []
  return ids.length
}

function isInMyCareers(career: any) {
  return userCareerIds.value.has(String(career?._id))
}

async function addToMyCareers(career: any) {
  const uid = userStore.id || localStorage.getItem('user_id')
  if (!uid || !career?._id) return
  const res = await store.assignToUser(String(career._id), String(uid), { autoEnroll: true, teachableUserId: userStore.teachableUserId || undefined })
  if (res) {
    await store.fetchUserCareers(String(uid))
    await coursesStore.fetchEnrolled(String(uid))
  }
}
</script>

<template>
  <div class="careers-view">
    <div class="container">
      <div class="head">
        <h2 class="title"><i class="fa-solid fa-graduation-cap" /> Escuelas o Carreras</h2>
      </div>

      <!-- CTA para usuarios Free -->
      <div v-if="isFreeUser" class="upgrade-banner" @click="router.push('/checkout')">
        <div class="upgrade-content">
          <div class="upgrade-icon">
            <i class="fa-solid fa-crown" />
          </div>
          <div class="upgrade-text">
            <h3>Hazte Founder</h3>
            <p>Accede a todas las carreras y contenido exclusivo.</p>
          </div>
        </div>
        <button class="upgrade-btn">
          Obtener Acceso
          <i class="fa-solid fa-arrow-right" />
        </button>
      </div>

      <div v-if="loading" class="hint">Cargando carreras…</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <template v-else>
        <h3 class="subtitle">Mis carreras</h3>
        <div class="grid">
          <div v-if="myCareers.length === 0" class="empty">Aún no tienes carreras asignadas.</div>
          <CareerCard
            v-for="c in myCareers"
            :key="c._id || c.careerId"
            :career="c"
            :show-published-badge="true"
            :show-courses-count="true"
          />
        </div>

        <h3 class="subtitle">Todas las carreras</h3>
        <div class="grid">
          <CareerCard
            v-for="c in careers"
            :key="c._id"
            :career="c"
            :show-published-badge="true"
            :show-courses-count="true"
            cta-text="Saber más"
          />
        </div>

        <h3 class="subtitle">Próximamente</h3>
        <div class="grid">
          <CareerCard
            v-for="c in upcomingCareers"
            :key="c._id"
            :career="c"
            :disabled="true"
            :blocked="true"
            :show-published-badge="true"
            :show-courses-count="true"
            @placeholder-click="openModal(c)"
            @blocked-click="openModal(c)"
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
      </template>
    </div>
  </div>
  </template>

<style lang="scss" scoped>
.careers-view {
  width: 100%;
  padding: 24px 16px;
  background: var(--bg);
  color: var(--text);
}

.container {
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 24px;
  margin: 0;
  color: var(--text);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.upgrade-banner {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 165, 0, 0.15);

    .upgrade-btn {
      transform: scale(1.05);
    }
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;

    .upgrade-btn {
      width: 100%;
      justify-content: center;
    }
  }
}

.upgrade-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upgrade-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #000;
  flex-shrink: 0;
}

.upgrade-text {
  h3 {
    margin: 0;
    font-size: 18px;
    color: var(--text);
  }

  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: color-mix(in oklab, var(--text), transparent 30%);
  }
}

.upgrade-btn {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #000;
  border: none;
  border-radius: 99px;
  padding: 10px 20px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
  white-space: nowrap;
}

.subtitle {
  color: var(--text);
  margin: 8px 0;
  font-size: 20px;
}

.hint {
  color: color-mix(in oklab, var(--text), transparent 40%);
}

.error {
  color: var(--accent);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  display: grid;
  gap: 8px;
}

.cover {
  width: 100%;
  height: 130px;
  border-radius: 8px;
  object-fit: cover;
}

.cover.blur {
  filter: blur(6px);
}

.name {
  color: var(--text);
  font-weight: 700;
  margin: 0;
}

.desc {
  color: color-mix(in oklab, var(--text), transparent 30%);
  margin: 0;
  font-size: 14px;
}

.meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.badge {
  background: color-mix(in oklab, var(--accent), transparent 85%);
  color: var(--text);
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12px;
}

.badge.active {
  background: color-mix(in oklab, var(--accent), transparent 70%);
  font-weight: 700;
}

.add-button {
  background: var(--accent);
  color: $white;
  border: none;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.add-button[disabled] {
  background: color-mix(in oklab, var(--accent), transparent 40%);
  cursor: default;
}

.empty {
  color: color-mix(in oklab, var(--text), transparent 40%);
}
</style>
