<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function goToDashboard() { router.push({ name: 'Dashboard' }) }
</script>

<template>
  <section class="offer-section">
    <div class="offer-container">
      
      <div class="best-value-badge">
        Capacitación Corporativa
      </div>

      <div class="offer-content">
        <h3 class="title">Ruta de Especialización</h3>
        <p class="subtitle">Acceso integral a todos los módulos de aprendizaje en CNT EP</p>

        <div class="visual-badge">
          <i class="fa-solid fa-certificate"></i>
          <span>Certificación Avalada</span>
        </div>

        <ul class="benefits-list">
          <li>✅ Acceso a las 4 Rutas de Aprendizaje CNT</li>
          <li>✅ Recursos descargables y documentación</li>
          <li>✅ Seguimiento personalizado de progreso</li>
          <li>✅ Actualizaciones constantes de contenido</li>
        </ul>

        <button class="buy-btn" @click="goToDashboard">
          Comenzar Capacitación 👉
        </button>

        <div class="trust-badges">
          <p>🔒 <strong>Acceso Seguro</strong> vía Intranet CNT</p>
        </div>
      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>
.offer-section {
  padding: 3rem 1rem 5rem 1rem;
  background-color: $CNT-DARK;
  display: flex;
  justify-content: center;
}

.offer-container {
  background-color: #0f172a;
  border: 4px solid $CNT-BLUE;
  border-radius: 24px;
  padding: 4rem 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
  box-shadow: 0 0 60px rgba($CNT-BLUE, 0.15);
}

.best-value-badge {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: $CNT-BLUE;
  color: white;
  font-weight: 800;
  padding: 0.8rem 2rem;
  border-radius: 99px;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.title {
  color: white;
  font-size: 2.2rem;
  font-weight: 800;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #94a3b8;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.visual-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 2.5rem;
  color: white;

  i {
    font-size: 4rem;
    color: $CNT-BLUE;
  }

  span {
    font-size: 1.2rem;
    font-weight: 700;
  }
}

.benefits-list {
  list-style: none;
  padding: 0;
  text-align: left;
  margin-bottom: 2.5rem;
  color: #e2e8f0;

  li {
    margin-bottom: 0.8rem;
    font-size: 1.1rem;
  }
}

.buy-btn {
  width: 100%;
  background-color: $CNT-BLUE;
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  padding: 1.2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 8px 0 darken($CNT-BLUE, 15%);
  transition: transform 0.1s, box-shadow 0.1s;
  margin-bottom: 1.5rem;

  &:active {
    transform: translateY(4px);
    box-shadow: 0 2px 0 darken($CNT-BLUE, 20%);
  }

  &:hover:not(:active) {
    background-color: lighten($CNT-BLUE, 5%);
  }
}

.trust-badges {
  font-size: 0.9rem;
  color: #94a3b8;
}
</style>
