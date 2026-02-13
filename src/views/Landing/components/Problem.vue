<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function goToDashboard() { router.push({ name: 'Dashboard' }) }

const problems = [
  {
    icon: '📊',
    description:
      'Falta de medición: No hay visibilidad clara sobre quién está aprendiendo realmente y quién no.',
  },
  {
    icon: '🏢',
    description:
      'Desorden organizacional: El conocimiento está disperso y no es accesible de forma centralizada.',
  },
  {
    icon: '📉',
    description:
      'Baja retención: Los colaboradores pierden interés en capacitaciones tradicionales y poco dinámicas.',
  },
  {
    icon: '💡',
    description:
      'Escalabilidad limitada: Entrenar a nuevos equipos o actualizar procesos toma demasiado tiempo.',
  }
]
</script>

<template>
  <div class="wrapper">
    <section class="problem-section">
      <h2 class="problem-title">
        Esto es para tu área si detectas...
      </h2>
      <div v-for="(item, i) in problems" :key="i">
        <span>
          {{ item.icon }}
        </span>
        <p class="problem-description">
          {{ item.description }}
        </p>
      </div>
      <div class="cta-wrapper">
        <button class="cta-button" @click="goToDashboard">
          Explorar Soluciones CNT 🚀
        </button>
      </div>
    </section>
  </div>
</template>


<style lang="scss" scoped>
.wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5rem 1rem;
  background-color: $CNT-DARK;
  color: $CNT-LIGHT;

  .problem-section {
    max-width: 800px;
    width: 100%;
    text-align: left;

    .problem-title {
      font-size: 2rem;
      margin-bottom: 2rem;
      font-weight: 800;
      color: white;
    }

    div {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;

      span {
        font-size: 1.8rem;
        margin-right: 1rem;
      }

      .problem-description {
        font-size: 1.1rem;
        line-height: 1.5;
        opacity: 0.9;
      }
    }

    .cta-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 3rem;
    }

    .cta-button {
      background: $CNT-BLUE;
      color: white;
      border: none;
      padding: 18px 40px;
      font-size: 1.1rem;
      font-weight: 700;
      border-radius: 50px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 4px 15px rgba($CNT-BLUE, 0.4);
      white-space: nowrap;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba($CNT-BLUE, 0.6);
      }

      &:active {
        transform: translateY(0);
      }
    }

  }
}
</style>
