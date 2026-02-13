<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useEvergreenTimer } from '@/composables/useEvergreenTimer'

const props = defineProps({
  career: { type: Object, required: true },
  to: { type: String, required: false },
  showPublishedBadge: { type: Boolean, required: false },
  showCoursesCount: { type: Boolean, required: false },
  ctaText: { type: String, required: false },
  disabled: { type: Boolean, required: false },
  blocked: { type: Boolean, required: false },
  countdownTo: { type: Number, required: false },
})

const emit = defineEmits(['placeholder-click', 'blocked-click'])

function sanitizeUrl(url?: string) { return (url || '').toString().replace(/`/g, '').trim() }
function coverOf(career: any) {
  return sanitizeUrl(career?.imageUrl) || sanitizeUrl(career?.image_url) || '/src/assets/logo/logo.png'
}
function nameOf(career: any) { return career?.name || career?.title || 'Carrera sin título' }
function descriptionOf(career: any) { return career?.description || career?.heading || 'Detalles próximamente.' }

function coursesCount(career: any) {
  const ids = Array.isArray(career?.courseIds) ? career.courseIds : []
  return ids.length || Number(career?.coursesCount ?? 0)
}

const linkTo = computed(() => props.to || `/careers/${(props.career as any)?._id || (props.career as any)?.id}`)
const published = computed(() => !!(props.career as any)?.isActive || !!(props.career as any)?.is_published)
const isActuallyBlocked = computed(() => props.blocked || props.disabled)

const showPublished = computed(() => props.showPublishedBadge && published.value && !isActuallyBlocked.value)
const showCourses = computed(() => !!props.showCoursesCount && !isActuallyBlocked.value)
const cta = computed(() => isActuallyBlocked.value ? 'Muy pronto' : (props.ctaText || 'Ver escuela'))

const showDesc = ref(false)
const expanded = ref(false)

function truncated(text: string, limit = 180) {
  const t = (text || '').trim()
  if (t.length <= limit) return { short: t, needs: false }
  const short = t.slice(0, limit).replace(/\s+\S*$/, '') + '…'
  return { short, needs: true }
}

function toggleShowDesc(e: Event) { e.preventDefault(); e.stopPropagation(); showDesc.value = !showDesc.value }
function toggleExpanded(e: Event) { e.preventDefault(); e.stopPropagation(); expanded.value = !expanded.value }

const { remaining } = useEvergreenTimer()

function onCardClick(e: Event) {
  if (isActuallyBlocked.value) {
    e.preventDefault()
    e.stopPropagation()
    if (props.blocked) {
      emit('blocked-click')
    } else {
      emit('placeholder-click')
    }
  }
}
</script>

<template>
  <component 
    :is="isActuallyBlocked ? 'div' : RouterLink" 
    :to="isActuallyBlocked ? undefined : linkTo" 
    class="career-card" 
    :class="{ disabled: isActuallyBlocked }" 
    @click="onCardClick"
  >
    <div class="cover-wrapper">
      <img class="cover" :class="{ blur: isActuallyBlocked }" :src="coverOf(career)" alt="cover" />
      <div v-if="isActuallyBlocked" class="blocked-overlay">
        <i class="fa-solid fa-lock" />
      </div>
    </div>
    <h3 class="name">{{ nameOf(career) }}</h3>
    <div class="meta">
      <span class="badge" v-if="showPublished">Activa</span>
      <span class="badge" v-if="showCourses"><i class="fa-solid fa-graduation-cap" /> {{ coursesCount(career) }} cursos</span>
      <span class="cta" :class="{ secondary: isActuallyBlocked }">{{ cta }} <i class="fa-solid fa-arrow-right" /></span>
    </div>

    <button class="desc-toggle" @click="toggleShowDesc">{{ showDesc ? 'Ocultar info' : 'Ver info' }}</button>
    <transition name="fade">
      <div v-if="showDesc" class="desc-panel">
        <p class="desc">
          <span v-if="expanded">{{ descriptionOf(career) }}</span>
          <span v-else>{{ truncated(descriptionOf(career), 180).short }}</span>
        </p>
        <div class="desc-actions">
          <button class="read-more" v-if="truncated(descriptionOf(career), 180).needs || expanded" @click="toggleExpanded">
            {{ expanded ? 'Leer menos' : 'Leer más' }}
          </button>
        </div>
      </div>
    </transition>
    
    <div v-if="remaining && props.countdownTo" class="countdown">
      <span class="label">Disponible en:</span>
      <span class="unit">{{ String(remaining.d).padStart(2, '0') }}d</span>
      <span class="sep">:</span>
      <span class="unit">{{ String(remaining.h).padStart(2, '0') }}h</span>
      <span class="sep">:</span>
      <span class="unit">{{ String(remaining.m).padStart(2, '0') }}m</span>
      <span class="sep">:</span>
      <span class="unit">{{ String(remaining.s).padStart(2, '0') }}s</span>
    </div>
  </component>
</template>

<style lang="scss" scoped>
.career-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  display: grid;
  gap: 8px;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
  height: fit-content;
}

.career-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.career-card.disabled {
  opacity: 1;
  border-color: var(--border);
  cursor: pointer;
}

.cover-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover.blur {
  filter: blur(12px) grayscale(0.5);
  transform: scale(1.05);
}

.blocked-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  color: $white;
  font-size: 24px;
}

.name {
  color: var(--text);
  font-weight: 700;
  margin: 0;
  font-size: 18px;
}

.meta {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
}

.badge {
  background: color-mix(in oklab, var(--accent), transparent 85%);
  color: var(--text);
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.cta {
  background: var(--accent);
  color: $white;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

  &.secondary {
    background: color-mix(in oklab, var(--text), transparent 90%);
    color: var(--text);
    box-shadow: none;
    border: 1px solid var(--border);
  }
}

.desc-toggle {
  background: transparent;
  color: var(--accent);
  border: 1px dashed var(--border);
  border-radius: 8px;
  padding: 6px 8px;
  font-weight: 700;
  cursor: pointer;
  justify-self: start;
}

.desc-panel {
  background: color-mix(in oklab, var(--bg), var(--text) 6%);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
}

.desc {
  color: color-mix(in oklab, var(--text), transparent 30%);
  margin: 0;
  font-size: 14px;
}

.desc-actions {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  background: none;
  border: none;
  color: var(--accent);
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.countdown {
  padding: 12px;
  border-top: 1px dashed var(--border);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: monospace;
  font-weight: 700;
  color: var(--text);
}

.countdown .label {
  font-size: 12px;
  color: color-mix(in oklab, var(--text), transparent 60%);
  margin-right: 4px;
}

.countdown .unit {
  background: color-mix(in oklab, var(--accent), transparent 88%);
  color: var(--accent);
  padding: 4px 6px;
  border-radius: 6px;
  min-width: 36px;
  text-align: center;
}

.countdown .sep {
  color: color-mix(in oklab, var(--text), transparent 60%);
}
</style>
