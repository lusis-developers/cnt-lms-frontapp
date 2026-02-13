<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import usersService, { type OnboardingBody } from "@/services/users.service";

const router = useRouter();
const userStore = useUserStore();

// Form State
const jobPosition = ref("");
const businessName = ref(""); // Se mantiene como Nombre de la Gerencia/Área
const businessType = ref<string | null>(null);
const businessTypeOther = ref("");
const employeeCount = ref<string | null>(null);
const numberOfLocations = ref<number | null>(null); // Se mantiene para Sedes/Sucursales
const heardAboutUs = ref<string | null>(null);
const heardAboutUsOther = ref("");

const loading = ref(false);
const errorMsg = ref<string | null>(null);

// Options - Refactorizadas para contexto corporativo de CNT
const businessTypeOptions = [
  { value: "it_technology", label: "Tecnología / Sistemas" },
  { value: "human_resources", label: "Recursos Humanos" },
  { value: "commercial_sales", label: "Comercial / Ventas" },
  { value: "operations_logistics", label: "Operaciones / Logística" },
  { value: "customer_service", label: "Atención al Cliente" },
  { value: "administration_finance", label: "Administración / Finanzas" },
  { value: "other", label: "Otro Departamento" },
];

const employeeCountOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
];

const heardAboutUsOptions = [
  { value: "internal_communication", label: "Comunicación Interna CNT" },
  { value: "manager_referral", label: "Referencia de Jefe / Gerente" },
  { value: "intranet", label: "Intranet Corporativa" },
  { value: "corporate_email", label: "Correo Corporativo" },
  { value: "social_media", label: "Redes Sociales" },
  { value: "event_webinar", label: "Evento o Capacitación" },
  { value: "other", label: "Otro" },
];

// Computed Validation
const isFormValid = computed(() => {
  if (!jobPosition.value.trim()) return false;
  if (!businessType.value) return false;
  if (businessType.value === 'other' && !businessTypeOther.value.trim()) return false;
  if (!employeeCount.value) return false;
  if (!heardAboutUs.value) return false;
  if (heardAboutUs.value === 'other' && !heardAboutUsOther.value.trim()) return false;
  return true;
});

async function handleSubmit() {
  if (!isFormValid.value) return;

  loading.value = true;
  errorMsg.value = null;

  try {
    if (!userStore.id) throw new Error("User ID not found");

    const payload: OnboardingBody = {
      jobPosition: jobPosition.value,
      businessName: businessName.value,
      businessType: businessType.value as string,
      businessTypeOther: businessType.value === 'other' ? businessTypeOther.value : undefined,
      employeeCount: employeeCount.value as string,
      numberOfLocations: numberOfLocations.value ?? 0,
      heardAboutUs: heardAboutUs.value as string,
      heardAboutUsOther: heardAboutUs.value === 'other' ? heardAboutUsOther.value : undefined,
    };

    const { data } = await usersService.submitOnboarding(userStore.id, payload);

    // Update store
    userStore.setUser({
      onboardingCompleted: true,
    });

    // Redirección directa al Dashboard nombrado
    router.push({ name: 'Dashboard' });

  } catch (err: any) {
    console.error("Onboarding error:", err);
    errorMsg.value = err.response?.data?.message || "Ocurrió un error al guardar tu información de perfil.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="onboarding-container">
    <div class="onboarding-card">
      <div class="brand-header">
        <img src="@/assets/logo/logo.png" alt="CNT" class="logo" />
      </div>
      
      <h1>¡Bienvenido a la Plataforma de Capacitación!</h1>
      <p class="subtitle">Para personalizar tu experiencia de aprendizaje, necesitamos conocer un poco más sobre tu rol en la organización.</p>

      <div v-if="errorMsg" class="error-banner">
        <i class="fa-solid fa-circle-exclamation" /> {{ errorMsg }}
      </div>

      <form @submit.prevent="handleSubmit" class="onboarding-form">
        
        <div class="form-group">
          <label>Cargo / Puesto de Trabajo <span class="required">*</span></label>
          <div class="input-wrapper">
            <i class="fa-solid fa-briefcase icon" />
            <input 
              v-model="jobPosition"
              type="text" 
              placeholder="Ej. Analista de Sistemas, Supervisor de Ventas..." 
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label>Gerencia / Área (Opcional)</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-sitemap icon" />
            <input 
              v-model="businessName"
              type="text" 
              placeholder="Nombre de tu área o departamento" 
            />
          </div>
        </div>

        <div class="form-group">
          <label>Departamento Principal <span class="required">*</span></label>
          <div class="input-wrapper">
            <i class="fa-solid fa-building icon" />
            <select v-model="businessType" required>
              <option :value="null" disabled>Selecciona tu área</option>
              <option v-for="opt in businessTypeOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="businessType === 'other'" class="form-group sub-group">
          <label>Especifica el área <span class="required">*</span></label>
          <div class="input-wrapper">
            <input 
              v-model="businessTypeOther"
              type="text" 
              placeholder="Describe tu departamento" 
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label>Personal a cargo o en el equipo <span class="required">*</span></label>
          <div class="input-wrapper">
            <i class="fa-solid fa-users icon" />
            <select v-model="employeeCount" required>
              <option :value="null" disabled>Selecciona un rango</option>
              <option v-for="opt in employeeCountOptions" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Número de Sedes / Oficinas</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-location-dot icon" />
            <input 
              v-model.number="numberOfLocations"
              type="number" 
              min="0"
              placeholder="Ej. 1" 
            />
          </div>
        </div>

        <div class="form-group">
          <label>¿Cómo conociste la plataforma? <span class="required">*</span></label>
          <div class="input-wrapper">
            <i class="fa-solid fa-magnifying-glass icon" />
            <select v-model="heardAboutUs" required>
              <option :value="null" disabled>Selecciona una opción</option>
              <option v-for="opt in heardAboutUsOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="heardAboutUs === 'other'" class="form-group sub-group">
          <label>Especifica <span class="required">*</span></label>
          <div class="input-wrapper">
            <input 
              v-model="heardAboutUsOther"
              type="text" 
              placeholder="Cuéntanos más" 
              required
            />
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="!isFormValid || loading">
          <span v-if="!loading">Comenzar mi Capacitación <i class="fa-solid fa-arrow-right" /></span>
          <span v-else><i class="fa-solid fa-spinner fa-spin" /> Guardando...</span>
        </button>

      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$CNT-BLUE: #2094D2;
$CNT-DARK: #010D27;
$CNT-LIGHT: #f4f6f8;
$white: #ffffff;

.onboarding-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $CNT-LIGHT;
  padding: 40px 16px;
}

.onboarding-card {
  background: $white;
  width: 100%;
  max-width: 580px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px -10px rgba($CNT-DARK, 0.1);
  border: 1px solid rgba($CNT-DARK, 0.05);

  .brand-header {
    text-align: center;
    margin-bottom: 24px;

    .logo {
      height: 48px;
    }
  }

  h1 {
    font-size: 24px;
    font-weight: 800;
    color: $CNT-DARK;
    margin-bottom: 12px;
    text-align: center;
  }

  .subtitle {
    text-align: center;
    color: rgba($CNT-DARK, 0.6);
    margin-bottom: 32px;
    font-size: 15px;
    line-height: 1.5;
  }
}

.error-banner {
  background: rgba(#ef4444, 0.1);
  color: #ef4444;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(#ef4444, 0.2);
  margin-bottom: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.onboarding-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    font-size: 14px;
    color: $CNT-DARK;

    .required {
      color: #ef4444;
    }
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba($CNT-DARK, 0.03);
    border: 1px solid rgba($CNT-DARK, 0.1);
    border-radius: 12px;
    padding: 12px 16px;
    transition: all 0.2s;

    &:focus-within {
      background: $white;
      border-color: $CNT-BLUE;
      box-shadow: 0 0 0 4px rgba($CNT-BLUE, 0.1);
    }

    .icon {
      color: rgba($CNT-DARK, 0.4);
      font-size: 18px;
      width: 20px;
      text-align: center;
    }

    input,
    select {
      flex: 1;
      padding: 0;
      border: none;
      background: transparent;
      outline: none;
      font-size: 16px;
      color: $CNT-DARK;
      width: 100%;

      &::placeholder {
        color: rgba($CNT-DARK, 0.3);
      }
    }

    select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23010D27' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0 center;
      background-size: 16px;
      padding-right: 24px;
    }
  }
}

.sub-group {
  padding-left: 16px;
  border-left: 2px solid rgba($CNT-DARK, 0.1);
}

.submit-btn {
  margin-top: 12px;
  background-color: $CNT-DARK;
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba($CNT-DARK, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

@media (max-width: 640px) {
  .onboarding-card {
    padding: 24px;
  }
}
</style>
