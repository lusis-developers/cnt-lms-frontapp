<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import usersService, { type OnboardingBody } from "@/services/users.service";
import CustomSelect from "../CustomSelect.vue";

const userStore = useUserStore();

// Form State
const jobPosition = ref<string | null>(null);
const businessName = ref("");
const hasNoBusiness = ref(false);
const businessType = ref<string | null>(null);
const businessTypeOther = ref("");
const employeeCount = ref<string | null>(null);
const numberOfLocations = ref<number | null>(null);
const heardAboutUs = ref<string | null>(null);
const heardAboutUsOther = ref("");

const loading = ref(false);
const errorMsg = ref<string | null>(null);

// Options - Refactorizadas para contexto corporativo de CNT
const jobPositionOptions = [
  { value: "analyst", label: "Analista / Especialista" },
  { value: "supervisor", label: "Supervisor" },
  { value: "manager", label: "Jefe / Gerente" },
  { value: "director", label: "Director / Ejecutivo" },
  { value: "other", label: "Otro" },
];

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
].map(val => ({ label: val, value: val }));

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
  if (!jobPosition.value) return false;
  if (!businessType.value) return false;
  if (businessType.value === 'other' && !businessTypeOther.value.trim()) return false;
  if (!employeeCount.value) return false;
  if (!heardAboutUs.value) return false;
  if (heardAboutUs.value === 'other' && !heardAboutUsOther.value.trim()) return false;
  return true;
});

function toggleNoBusiness() {
  hasNoBusiness.value = !hasNoBusiness.value;
  if (hasNoBusiness.value) {
    businessName.value = "Gerencia/Área por definir";
  } else {
    businessName.value = "";
  }
}

async function handleSubmit() {
  if (!isFormValid.value) return;

  loading.value = true;
  errorMsg.value = null;

  try {
    if (!userStore.id) throw new Error("User ID not found");

    const payload: OnboardingBody = {
      jobPosition: jobPosition.value as string,
      businessName: hasNoBusiness.value ? "Gerencia/Área por definir" : businessName.value,
      businessType: businessType.value as string,
      businessTypeOther: businessType.value === 'other' ? businessTypeOther.value : undefined,
      employeeCount: employeeCount.value as string,
      numberOfLocations: numberOfLocations.value ?? 0,
      heardAboutUs: heardAboutUs.value as string,
      heardAboutUsOther: heardAboutUs.value === 'other' ? heardAboutUsOther.value : undefined,
    };

    const { data } = await usersService.submitOnboarding(userStore.id, payload);

    userStore.setUser({
      onboardingCompleted: true,
    });

    if ((data.user as any).onboardingCompleted) {
      userStore.onboardingCompleted = true;
    }

  } catch (err: any) {
    console.error("Onboarding error:", err);
    errorMsg.value = err.response?.data?.message || "Ocurrió un error al guardar tu información.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="header">
        <div class="brand-logo">
          <img src="@/assets/logo/logo.png" alt="CNT" class="logo" />
        </div>
        <h1>¡Bienvenido a la Plataforma de Capacitación!</h1>
        <p class="subtitle">Complete su perfil profesional para continuar.</p>
      </div>

      <div v-if="errorMsg" class="error-banner">
        <i class="fa-solid fa-circle-exclamation" /> {{ errorMsg }}
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        
        <div class="form-row">
            <div class="form-group">
            <label>Cargo / Puesto <span class="required">*</span></label>
            <CustomSelect 
                v-model="jobPosition" 
                :options="jobPositionOptions" 
                placeholder="Selecciona..." 
                required 
            />
            </div>
            
            <div class="form-group">
            <label>Gerencia / Área</label>
            <div class="input-with-action">
                <input 
                    v-model="businessName"
                    type="text" 
                    placeholder="Nombre" 
                    :disabled="hasNoBusiness"
                />
            </div>
            <button type="button" class="text-btn small-margin" @click="toggleNoBusiness">
                {{ hasNoBusiness ? '¡Ya tengo área!' : 'Aún no asignada' }}
            </button>
            </div>
        </div>

        <div class="form-group">
          <label>Departamento Principal <span class="required">*</span></label>
          <CustomSelect 
            v-model="businessType" 
            :options="businessTypeOptions" 
            placeholder="Selecciona..." 
            required 
          />
        </div>

        <div v-if="businessType === 'other'" class="form-group sub-group">
          <input 
            v-model="businessTypeOther"
            type="text" 
            placeholder="Especifique..." 
            required
          />
        </div>

        <div class="form-row">
            <div class="form-group">
            <label>Equipo <span class="required">*</span></label>
            <CustomSelect 
                v-model="employeeCount" 
                :options="employeeCountOptions" 
                placeholder="Personas" 
                required 
            />
            </div>

            <div class="form-group">
            <label>Sedes</label>
            <input 
                v-model.number="numberOfLocations"
                type="number" 
                min="0"
                placeholder="0" 
            />
            </div>
        </div>

        <div class="form-group">
          <label>¿Cómo conociste la plataforma? <span class="required">*</span></label>
          <CustomSelect 
            v-model="heardAboutUs" 
            :options="heardAboutUsOptions" 
            placeholder="Selecciona..." 
            required 
          />
        </div>

        <div v-if="heardAboutUs === 'other'" class="form-group sub-group">
          <input 
            v-model="heardAboutUsOther"
            type="text" 
            placeholder="Especifique..." 
            required
          />
        </div>

        <button type="submit" class="submit-btn" :disabled="!isFormValid || loading">
          <span v-if="loading">Guardando...</span>
          <span v-else>Continuar <i class="fa-solid fa-arrow-right" /></span>
        </button>

      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$CNT-BLUE: #2094D2;
$CNT-DARK: #010D27;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background: var(--bg, #ffffff);
  color: var(--text, #010D27);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  position: relative;
  border: 1px solid rgba($CNT-DARK, 0.1);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
}

.header {
  text-align: center;
  margin-bottom: 32px;

  .brand-logo {
    margin-bottom: 20px;

    .logo {
      height: 40px;
    }
  }

  h1 {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 8px;
    color: var(--text, $CNT-DARK);
  }

  .subtitle {
    color: var(--text, $CNT-DARK);
    opacity: 0.6;
    font-size: 15px;
  }
}

.error-banner {
  background-color: rgba(#ef4444, 0.1);
  color: #ef4444;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(#ef4444, 0.2);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 16px;

  .form-group {
    flex: 1;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    font-size: 14px;
    color: var(--text, $CNT-DARK);

    .required {
      color: #ef4444;
    }
  }

  input,
  select {
    padding: 12px 16px;
    border: 1px solid var(--border, rgba($CNT-DARK, 0.1));
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.2s;
    background-color: var(--bg, rgba($CNT-DARK, 0.03));
    color: var(--text, $CNT-DARK);

    &:focus {
      outline: none;
      border-color: $CNT-BLUE;
      box-shadow: 0 0 0 4px rgba($CNT-BLUE, 0.1);
      background-color: var(--bg, #ffffff);
    }

    &::placeholder {
      color: var(--text, $CNT-DARK);
      opacity: 0.3;
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
  box-shadow: 0 10px 20px -5px rgba($CNT-DARK, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 25px -5px rgba($CNT-DARK, 0.4);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
  }
}

.text-btn {
  background: none;
  border: none;
  color: $CNT-BLUE;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
  margin-top: 4px;
  align-self: flex-start;

  &:hover {
    text-decoration: underline;
  }
}
</style>
