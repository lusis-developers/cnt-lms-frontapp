<script setup lang="ts">
// import thumbnailSrc from '@/assets/statis/nicole-landing/nicole-vsl.jpeg'

// const router = useRouter()
// function goToCheckout() { router.push('/checkout') }


// const isVideoLoaded = ref(false)
// 
// function loadVideo() {
//   if (isVideoLoaded.value) return
//   isVideoLoaded.value = true
// 
//   // Cargar scripts de Wistia dinámicamente solo al interactuar
//   if (!document.getElementById('wistia-player-js')) {
//     const script1 = document.createElement('script')
//     script1.src = "https://fast.wistia.com/player.js"
//     script1.async = true
//     script1.id = 'wistia-player-js'
//     document.head.appendChild(script1)
//   }
// 
//   if (!document.getElementById('wistia-embed-js')) {
//     const script2 = document.createElement('script')
//     script2.src = "https://fast.wistia.com/embed/2f09oyiyxq.js"
//     script2.async = true
//     script2.type = "module"
//     script2.id = 'wistia-embed-js'
//     document.head.appendChild(script2)
//   }
// }
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
            <button class="cta-button" @click="() => { }">
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
/* Asegúrate de que estas variables estén definidas en tu proyecto global
   o descoméntalas aquí para probar */
// $FUDMASTER-PRIMARY: #030b1c; /* Color oscuro de fondo aproximado */
// $FUDMASTER-LIGHT: #ffffff;
// $FUDMASTER-PINK: #e91e63;

.vsl {
  &-hero {
    background-color: $CNT-DARK;
    // min-height: 100vh; /* Ocupa toda la pantalla */
    display: flex;
    align-items: center;
    /* Centra verticalmente todo el bloque */
    justify-content: center;
    padding: 48px 20px;
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
    gap: 40px;
    /* Espacio entre video y texto */
  }


  .demo-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba($CNT-BLUE, 0.2) 0%, rgba($CNT-DARK, 0.5) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: $CNT-LIGHT;
    gap: 16px;
    border-radius: 12px;
    border: 2px dashed rgba($CNT-LIGHT, 0.2);

    i {
      font-size: 64px;
      opacity: 0.8;
    }

    span {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }

  /* --- COLUMNA TEXTO --- */
  &-content-column {
    flex: 0.8;
    color: $CNT-LIGHT;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &-title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 25px;
    color: $CNT-LIGHT;
  }

  &-description {
    font-size: 1.25rem;
    line-height: 1.5;
    margin-bottom: 40px;
    opacity: 0.9;
    max-width: 500px;
  }

  .cta-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

/* --- BOTÓN --- */
.cta-button {
  background: $CNT-BLUE;
  color: $CNT-LIGHT;
  border: none;
  padding: 18px 40px;
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

.cta-subtitle {
  font-size: 0.9rem;
  margin-top: 10px;
  opacity: 0.7;
  font-weight: 300;
}

/* --- RESPONSIVE MOBILE --- */
@media (max-width: 960px) {
  .vsl-split-layout {
    flex-direction: column;
    gap: 40px;
  }

  .vsl-content-column {
    text-align: center;
    align-items: center;
    padding: 0 10px;
  }

  .vsl-title {
    font-size: 2.5rem;
  }

  .cta-wrapper {
    align-items: center;
  }
}
</style>