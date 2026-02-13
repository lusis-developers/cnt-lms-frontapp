<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function goToDashboard() { router.push({ name: 'Dashboard' }) }
</script>

<template>
  <div class="vsl-hero">
    <div class="vsl-container">
      
      <div class="vsl-split-layout">
        
        <div class="vsl-video-column">
          <div class="video-frame">
            <div class="video-facade">
              <div class="demo-placeholder">
                <i class="fa-solid fa-display"></i>
                <span>Demo Interactiva</span>
              </div>
            </div>
          </div>
        </div>

        <div class="vsl-content-column">
          <h1 class="vsl-title">
            Potencia el <br>
            Aprendizaje <br>
            en CNT <br>
          </h1>
          
          <p class="vsl-description">
            Una herramienta diseñada para centralizar conocimientos y medir el progreso de tus colaboradores.
          </p>

          <div class="cta-wrapper">
            <button class="cta-button" @click="goToDashboard">
              Explorar Demo Interactiva
            </button>
            <p class="cta-subtitle">Plataforma exclusiva para capacitación interna</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vsl {
  &-hero {
    background-color: $CNT-DARK;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 64px 20px;
    position: relative;
    overflow: hidden;
  }

  &-container {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
  }

  &-split-layout {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 60px;
  }


  .demo-placeholder {
    width: 100%;
    height: 100%;
    min-height: 400px;
    background: linear-gradient(135deg, rgba($CNT-BLUE, 0.2) 0%, rgba($CNT-DARK, 0.5) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: $CNT-LIGHT;
    gap: 16px;
    border-radius: 20px;
    border: 2px dashed rgba($CNT-LIGHT, 0.2);

    i {
      font-size: 80px;
      opacity: 0.8;
      color: $CNT-BLUE;
    }

    span {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 1px;
    }
  }

  &-content-column {
    flex: 1;
    color: $CNT-LIGHT;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &-title {
    font-size: 4.5rem;
    font-weight: 900;
    line-height: 1.05;
    margin-bottom: 24px;
    color: $CNT-LIGHT;

    @media (max-width: 1200px) {
      font-size: 3.5rem;
    }
  }

  &-description {
    font-size: 1.25rem;
    line-height: 1.6;
    margin-bottom: 48px;
    opacity: 0.8;
    max-width: 500px;
  }

  .cta-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.cta-button {
  background: $CNT-BLUE;
  color: white;
  border: none;
  padding: 20px 48px;
  font-size: 1.2rem;
  font-weight: 800;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 20px rgba($CNT-BLUE, 0.3);
  white-space: nowrap;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba($CNT-BLUE, 0.5);
    background-color: lighten($CNT-BLUE, 5%);
  }

  &:active {
    transform: translateY(0);
  }
}

.cta-subtitle {
  font-size: 0.9rem;
  margin-top: 16px;
  opacity: 0.6;
  font-weight: 500;
}

@media (max-width: 960px) {
  .vsl-split-layout {
    flex-direction: column-reverse;
    gap: 48px;
  }

  .vsl-content-column {
    text-align: center;
    align-items: center;
  }

  .vsl-video-column {
    width: 100%;
  }

  .vsl-title {
    font-size: 3rem;
  }

  .cta-wrapper {
    align-items: center;
  }
}
</style>