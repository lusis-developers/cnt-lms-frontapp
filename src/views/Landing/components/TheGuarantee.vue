<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()
function goToDashboard() { router.push({ name: 'Dashboard' }) }

const faqs = ref([
  {
    question: "¿Por qué elegir esta plataforma?",
    answer: "Porque el Sistema de Capacitación CNT no es solo contenido teórico; es una herramienta de implementación directa para medir el impacto real en el desempeño de tus colaboradores.",
    isOpen: true
  },
  {
    question: "¿Qué garantía de impacto tiene este sistema?",
    answer: "Nuestra garantía se basa en la optimización de procesos internos y la estandarización de conocimientos que hemos implementado en diversas áreas críticas de la organización.",
    isOpen: false
  },
  {
    question: "¿Cómo recibo apoyo técnico o académico?",
    answer: "Contamos con un equipo de soporte y consultores internos dispuestos a resolver dudas y asegurar que el proceso de aprendizaje sea fluido y efectivo.",
    isOpen: false
  },
  {
    question: "¿Es compatible con todos los departamentos?",
    answer: "Absolutamente. La metodología de evaluación y seguimiento es universal y se adapta a las necesidades específicas de cada gerencia o área operativa.",
    isOpen: false
  }
]);

const toggleFaq = (index: number) => {
  const item = faqs.value[index]
  if (!item) return
  item.isOpen = !item.isOpen
};
</script>
  
  <template>
    <section class="guarantee-section">
      <div class="container">
        
        <div class="guarantee-card">
          <div class="badge-wrapper">
            <div class="seal">
              <span>100%</span>
              <small>CONFIABLE</small>
            </div>
          </div>
          
          <div class="content">
            <h3>Metodología <span class="highlight">
              <br></br>
              Estandarizada.</span></h3>
            <p class="promise">
              Nuestra garantía es la excelencia operativa y el crecimiento profesional.
            </p>
            <p class="terms">
              A diferencia de capacitaciones convencionales, nuestro enfoque es 100% práctico y medible. Si implementas el <strong>Sistema de Evaluación de Desempeño</strong> y las <strong>Rutas de Aprendizaje Especializadas</strong>, garantizamos una mejora sustancial en la eficiencia de tu equipo. Estamos comprometidos con el éxito de cada colaborador en CNT.
            </p>
            
            <div class="founder-signature">
              <p class="role">CNT EP - Dirección de Talento Humano</p>
            </div>
          </div>
        </div>
  
        <div class="faq-wrapper">
          <h2 class="faq-title">Preguntas Frecuentes</h2>
          <div class="faq-grid">
            <div 
              v-for="(item, index) in faqs" 
              :key="index" 
              class="faq-item" 
              :class="{ active: item.isOpen }"
              @click="toggleFaq(index)"
            >
              <div class="faq-question">
                {{ item.question }}
                <span class="icon">{{ item.isOpen ? '−' : '+' }}</span>
              </div>
              
              <div class="faq-answer" v-show="item.isOpen">
                <p>{{ item.answer }}</p>
              </div>
            </div>
          </div>

          <div class="cta-wrapper">
            <button class="cta-button" @click="goToDashboard">
              Acceder a la Plataforma 🚀
            </button>
          </div>

        </div>
  
      </div>
      <div class="footer-brand">
        <img src="@/assets/logo/logo.png" alt="CNT" class="footer-logo" />
      </div>
    </section>
  </template>
  
  <style lang="scss" scoped>
  $bg-dark: #010D27;
  $card-bg: #0f172a;
  $accent: #2094D2;
  $text-main: #ffffff;
  $text-muted: #94a3b8;
  $border: #334155;

  .guarantee-section {
    background-color: $bg-dark;
    padding: 3rem 1rem;
    color: $text-main;
    border-top: 1px solid $border;
  }

  .footer-brand {
    display: flex;
    justify-content: center;
    margin-top: 3rem;

    .footer-logo {
      height: 40px;
      width: auto;
      opacity: 0.8;
    }
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .guarantee-card {
    display: flex;
    flex-direction: column;
    background: linear-gradient(145deg, #1e293b, #0f172a);
    border: 1px solid $border;
    border-left: 4px solid $accent;
    border-radius: 24px;
    padding: 3rem 2rem;
    position: relative;
    overflow: hidden;
    margin-bottom: 5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      gap: 3rem;
      padding: 4rem;
    }
  }

  .badge-wrapper {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      margin-bottom: 0;
    }
  }

  .seal {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, $CNT-BLUE, darken($CNT-BLUE, 20%));
    border: 4px solid #1e293b;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 900;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    span {
      font-size: 2.5rem;
      line-height: 1;
    }

    small {
      font-size: 0.8rem;
      letter-spacing: 2px;
      opacity: 0.8;
    }
  }

  .content {
    text-align: center;

    @media (min-width: 768px) {
      text-align: left;
    }

    h3 {
      font-size: 2rem;
      margin-bottom: 1rem;
      font-weight: 800;

      .highlight {
        color: $accent;
      }
    }

    .promise {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: white;
    }

    .terms {
      color: $text-muted;
      line-height: 1.6;
      margin-bottom: 2rem;
      font-size: 0.95rem;

      strong {
        color: white;
        font-weight: 600;
      }
    }
  }

  .founder-signature {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1.5rem;

    .role {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: $accent;
      font-weight: 700;
    }
  }

  .faq-wrapper {
    margin-top: 4rem;
  }

  .faq-title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 3rem;
    color: white;
    font-weight: 800;
  }

  .cta-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 48px;
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

  .faq-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .faq-item {
    background-color: $card-bg;
    border: 1px solid $border;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #475569;
    }

    &.active {
      border-color: $accent;
      background-color: lighten($card-bg, 3%);

      .icon {
        transform: rotate(180deg);
        color: $accent;
      }
    }
  }

  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    font-size: 1.1rem;
    color: white;

    .icon {
      font-size: 1.5rem;
      font-weight: 400;
      transition: transform 0.3s;
    }
  }

  .faq-answer {
    margin-top: 1rem;
    color: $text-muted;
    line-height: 1.6;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 1rem;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
