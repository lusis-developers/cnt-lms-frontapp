<script setup lang="ts">
// import { useRouter } from 'vue-router'
// const router = useRouter()
// function goToCheckout() { router.push('/checkout') }
const problems = [
  {
    icon: '📊',
    description:
      'Falta de medición: No sabes quién está aprendiendo realmente y quién no.',
  },
  {
    icon: '🏢',
    description:
      'Desorden organizacional: El conocimiento está disperso y no es accesible para todos.',
  },
  {
    icon: '📉',
    description:
      'Baja retención: Los colaboradores pierden interés en capacitaciones tradicionales y aburridas.',
  },
  {
    icon: '💡',
    description:
      'Escalabilidad limitada: Entrenar a nuevos equipos toma demasiado tiempo y recursos.',
  }
]
</script>

<template>
  <div class="wrapper">
    <section class="problem-section">
      <h2 class="problem-title">
        Esto es para ti si...
      </h2>
      <div v-for="(item, i) in problems" :key="i">
        <span>
          {{ item.icon }}
        </span>
        <p class="problem-description">
          {{ item.description }}
        </p>
      </div>
      <!-- <div class="actions">
        <button class="cta" type="button" @click="goToCheckout">Resolverlo ahora</button>
      </div> -->
      <div class="cta-wrapper">
        <button class="cta-button" @click="() => { }">
          Ver soluciones corporativas
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
  padding: 3rem 1rem;
  background-color: $CNT-DARK;
  color: $CNT-LIGHT;

  .problem-section {
    max-width: 800px;
    width: 100%;
    text-align: left;

    .problem-title {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      font-weight: bold;
    }

    div {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;

      span {
        font-size: 1.5rem;
        margin-right: 0.75rem;
      }

      .problem-description {
        font-size: 1.1rem;
        line-height: 1.4;
      }
    }

    .actions {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
    }

    .cta {
      background: $FUDMASTER-GREEN;
      color: $white;
      border: none;
      border-radius: 10px;
      padding: 12px 18px;
      font-weight: 700;
      cursor: pointer;
    }

    .cta-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-center;
      /* Alinea botón y subtitulo a la derecha */
      margin-top: 12px;
    }

    /* --- BOTÓN --- */
    .cta-button {
      background: $CNT-BLUE;
      color: $CNT-LIGHT;
      border: none;
      padding: 18px 24px;
      font-size: 1.1rem;
      font-weight: 700;
      border-radius: 50px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 4px 15px rgba($CNT-BLUE, 0.4);
      white-space: nowrap;

      @media screen and (max-width: 320px) {
        padding: 14px 16px;
        font-size: 0.75rem;
      }

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba($CNT-BLUE, 0.6);
        // filter: brightness(1.1); // Opcional para brillo
      }

      &:active {
        transform: translateY(0);
      }
    }

  }
}
</style>
