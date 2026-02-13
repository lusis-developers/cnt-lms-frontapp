<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDashboard() { router.push({ name: 'Dashboard' }) }
</script>

<template>
  <div class="urgent" @click="goToDashboard">
    <h3>
      Plataforma de Capacitación Continua - Demo Exclusiva CNT EP
    </h3>
  </div>
</template>

<style lang="scss" scoped>
.urgent {
  background-color: $CNT-BLUE;
  color: white;
  text-align: center;
  padding: 12px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.5px;
}
</style>
