<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()
function goToDashboard() { router.push({ name: 'Dashboard' }) }

// Estado del switch: false = Tradicional, true = CNT LMS
const isOptimized = ref(false);

// Datos de las métricas - Adaptadas a capacitación
const metrics = {
  traditional: {
    completionRate: 35,
    engagement: 2000,
    reporting: 'Manual / Lento 🐢',
    class: 'state-danger'
  },
  cntlms: {
    completionRate: 85,
    engagement: 8000,
    reporting: 'Tiempo Real ⚡️',
    class: 'state-success'
  }
};
</script>
  
  <template>
    <section class="transformation-section">
      <div class="container">
        
        <div class="header-content">
          <h2>
            No es Azar. Es <span class="highlight">Eficiencia.</span>
          </h2>
          <p class="subtitle">
            Desliza el interruptor para ver la diferencia real entre la capacitación tradicional vs. implementar la Plataforma de Capacitación CNT.
          </p>
        </div>

        <div class="cta-wrapper">
          <button class="cta-button" @click="goToDashboard">
            Ver mi Dashboard 🚀
          </button>
        </div>
  
        <div class="dashboard-card" :class="{ 'optimized-mode': isOptimized }">
          
          <div class="switch-wrapper">
            <span class="label" :class="{ active: !isOptimized }">Capacitación Tradicional</span>
            
            <button 
              class="toggle-btn" 
              :class="{ active: isOptimized }"
              @click="isOptimized = !isOptimized"
              aria-label="Toggle Optimization Mode"
            >
              <div class="toggle-circle"></div>
            </button>
  
            <span class="label" :class="{ active: isOptimized }">Plataforma CNT</span>
          </div>
  
          <div class="metrics-grid">
            
            <div class="metric-card">
              <p class="metric-title">Tasa de Finalización</p>
              
              <div class="metric-value" :class="isOptimized ? 'text-success' : 'text-danger'">
                {{ isOptimized ? metrics.cntlms.completionRate : metrics.traditional.completionRate }}%
              </div>
  
              <div class="progress-container">
                 <div 
                   class="progress-fill"
                   :class="isOptimized ? 'bg-success' : 'bg-danger'"
                   :style="{ width: isOptimized ? '85%' : '35%' }"
                 ></div>
              </div>
              
              <p class="metric-note">
                 {{ isOptimized ? 'Colaboradores certificados y listos' : 'Cursos abandonados a la mitad' }}
              </p>
            </div>
  
            <div class="metric-card">
              <p class="metric-title">Engagement Académico</p>
              
              <div class="metric-value text-white">
                {{ isOptimized ? metrics.cntlms.engagement.toLocaleString() : metrics.traditional.engagement.toLocaleString() }}
              </div>
              
              <p class="growth-badge" :class="isOptimized ? 'visible' : 'hidden'">
                🚀 x4 Interacción
              </p>
  
              <p class="metric-note">
                {{ isOptimized ? 'Contenido interactivo y medible' : 'Material estático sin métricas' }}
              </p>
            </div>
  
            <div class="metric-card">
              <p class="metric-title">Reportería de Progreso</p>
              
              <div class="metric-value" :class="isOptimized ? 'text-success' : 'text-danger'">
                {{ isOptimized ? metrics.cntlms.reporting : metrics.traditional.reporting }}
              </div>
              
              <p class="metric-note">
                 {{ isOptimized ? 'Gestión Basada en Datos' : 'Seguimiento por Correo/Excel' }}
              </p>
            </div>
  
          </div>
  
          <div class="dashboard-footer">
            <p>*Resultados proyectados basados en estándares de LMS corporativo para CNT.</p>
          </div>
  
        </div>
      </div>
    </section>
  </template>
  
  <style lang="scss" scoped>
  $color-bg-dark: #0f172a;
  $color-card-bg: #1e293b;
  $color-border: #334155;
  $color-text-main: #ffffff;
  $color-text-muted: #94a3b8;
  $color-accent: #2094D2;
  $color-success: #4ade80;
  $color-danger: #ef4444;
  $transition-speed: 0.5s;

  .transformation-section {
    background-color: $CNT-DARK;
    padding: 5rem 1rem;
    color: $color-text-main;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0.05;
      background-image: radial-gradient(#ffffff 1px, transparent 1px);
      background-size: 30px 30px;
      pointer-events: none;
    }
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 10;
  }

  .header-content {
    text-align: center;
    margin-bottom: 4rem;

    h2 {
      font-size: 2.5rem;
      font-weight: 900;
      margin-bottom: 1rem;
      color: white;

      .highlight {
        color: $CNT-BLUE;
      }
    }

    .subtitle {
      color: $color-text-muted;
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
  }

  .cta-wrapper {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
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

  .dashboard-card {
    background-color: $color-card-bg;
    border: 1px solid $color-border;
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    transition: border-color $transition-speed, box-shadow $transition-speed;

    @media (min-width: 768px) {
      padding: 3rem;
    }

    &.optimized-mode {
      border-color: rgba($color-success, 0.3);
      box-shadow: 0 20px 50px rgba($color-success, 0.1);
    }
  }

  .switch-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 4rem;

    .label {
      font-weight: 700;
      font-size: 1rem;
      color: #64748b;
      transition: color 0.3s;

      &.active {
        color: $color-text-main;

        &:last-child {
          color: $color-success;
        }
      }
    }

    .toggle-btn {
      width: 80px;
      height: 40px;
      background-color: #334155;
      border-radius: 99px;
      border: none;
      position: relative;
      cursor: pointer;
      transition: background-color 0.3s;
      outline: none;

      .toggle-circle {
        width: 32px;
        height: 32px;
        background-color: white;
        border-radius: 50%;
        position: absolute;
        top: 4px;
        left: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      }

      &.active {
        background-color: $color-success;

        .toggle-circle {
          transform: translateX(40px);
        }
      }
    }
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .metric-card {
    background-color: #0f172a;
    border: 1px solid $color-border;
    border-radius: 16px;
    padding: 2rem 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      border-color: #475569;
    }
  }

  .metric-title {
    color: $color-text-muted;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .metric-value {
    font-size: 2.5rem;
    font-weight: 900;
    margin-bottom: 1rem;
    transition: color $transition-speed;

    &.text-success {
      color: $color-success;
    }

    &.text-danger {
      color: $color-danger;
    }

    &.text-white {
      color: white;
    }
  }

  .progress-container {
    width: 100%;
    height: 8px;
    background-color: $color-border;
    border-radius: 99px;
    overflow: hidden;
    margin-bottom: 1rem;

    .progress-fill {
      height: 100%;
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s;

      &.bg-success {
        background-color: $color-success;
      }

      &.bg-danger {
        background-color: $color-danger;
      }
    }
  }

  .growth-badge {
    font-size: 1.1rem;
    font-weight: 700;
    color: $color-success;
    margin-bottom: 0.5rem;
    opacity: 0;
    transition: opacity 0.3s;

    &.visible {
      opacity: 1;
    }

    &.hidden {
      opacity: 0;
      display: none;
    }
  }

  .metric-note {
    font-size: 0.85rem;
    color: $color-text-muted;
    font-style: italic;
    min-height: 2.5em;
  }

  .dashboard-footer {
    margin-top: 3rem;
    text-align: center;

    p {
      color: #475569;
      font-size: 0.9rem;
    }
  }
</style>
