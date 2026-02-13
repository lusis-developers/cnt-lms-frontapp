<script setup lang="ts">
import logo from '@/assets/logo/logo.png'
</script>

<template>
  <div class="minimal-landing">
    <div class="content">
      <img :src="logo" alt="CNT Logo" class="main-logo" />
      <h1 class="title">Plataforma de Capacitación</h1>
      <div class="badge">Demo Exclusiva - CNT</div>
      <p class="description">
        Esta es una versión de demostración técnica desarrollada específicamente para la presentación de soluciones de aprendizaje corporativo en CNT.
      </p>
      
      <div class="actions">
        <router-link to="/login" class="btn-primary">
          <i class="fa-solid fa-right-to-bracket"></i>
          Acceder a la Plataforma
        </router-link>
        
        <router-link to="/verify-certificate" class="btn-outline">
          <i class="fa-solid fa-certificate"></i>
          Verificar Certificado
        </router-link>
      </div>
    </div>

    <footer class="minimal-footer">
      <p>© {{ new Date().getFullYear() }} CNT EP. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.minimal-landing {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: white;
  text-align: center;
}

.content {
  max-width: 600px;
  width: 100%;
  animation: fadeIn 0.8s ease-out;
}

.main-logo {
  width: 180px;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #010D27;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.badge {
  display: inline-block;
  background: #2094D2;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 99px;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(32, 148, 210, 0.3);
}

.description {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 3rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.btn-primary {
  background: #2094D2;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.2s;
  box-shadow: 0 10px 20px -5px rgba(32, 148, 210, 0.4);

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
    box-shadow: 0 12px 24px -5px rgba(32, 148, 210, 0.5);
  }
}

.btn-outline {
  border: 2px solid #e2e8f0;
  color: #010D27;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
}

.minimal-footer {
  margin-top: 5rem;
  color: #94a3b8;
  font-size: 0.85rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .title {
    font-size: 2rem;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary,
  .btn-outline {
    width: 100%;
    justify-content: center;
  }
}
</style>
