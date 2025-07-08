<template>
  <div class="lead-page">
    <!-- Floating Header -->
    <div class="floating-header">
      <div class="relationship-header">
        <h1>Lead Management</h1>
        <div class="relationship-info">
          <span :class="isManufacturerLead ? 'manufacturer selected-entity' : 'manufacturer'">
            {{ manufacturerName }}
          </span>
          <span class="connector">↔</span>
          <span :class="!isManufacturerLead ? 'distributor selected-entity' : 'distributor'">
            {{ distributorName }}
          </span>
          <span class="status-badge status-lead">Lead</span>
        </div>
      </div>
    </div>

    <!-- Floating Back Button -->
    <div class="floating-back-button">
      <button class="btn-floating-back" @click="$router.go(-1)">
        ← Back
      </button>
    </div>

    <div class="content-wrapper">
      <div class="lead-content">
        <div class="interactions-section">
          <div class="section-header">
            <h2>Past Interactions</h2>
            <div class="section-stats">
              <span class="stat-badge">{{ interactions.length }} interactions</span>
            </div>
          </div>
          
          <div class="table-container">
            <div class="table-wrapper">
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Interacted By</th>
                    <th>Date</th>
                    <th>Time Elapsed</th>
                    <th>Mode</th>
                    <th>Reminder</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="interaction in interactions" :key="interaction.id" class="table-row">
                    <td>
                      <div class="user-cell">
                        <div class="user-avatar">{{ interaction.interactedBy.charAt(0) }}</div>
                        <span class="user-name">{{ interaction.interactedBy }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="date-cell">{{ formatDate(interaction.dateInteracted) }}</span>
                    </td>
                    <td>
                      <span class="time-elapsed">{{ interaction.timeElapsed }}</span>
                    </td>
                    <td>
                      <span :class="getModeClass(interaction.mode)" class="mode-badge">
                        {{ interaction.mode }}
                      </span>
                    </td>
                    <td>
                      <span :class="getReminderClass(interaction.hasReminder)" class="reminder-badge">
                        {{ interaction.hasReminder ? 'Yes' : 'No' }}
                      </span>
                    </td>
                    <td>
                      <button class="btn-action-small" @click="viewNotes(interaction)">
                        View Notes
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="notes-section">
          <div class="section-header">
            <h2>Add New Interaction</h2>
            <div class="section-icon">💬</div>
          </div>
          
          <form @submit.prevent="submitNotes" class="modern-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Interaction Mode</label>
                <select v-model="newInteraction.mode" required class="modern-select">
                  <option value="">Select Mode</option>
                  <option value="Phone">📞 Phone</option>
                  <option value="FtoF">🤝 Face to Face</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label>Interaction Notes</label>
                <textarea 
                  v-model="newInteraction.notes" 
                  rows="4" 
                  placeholder="Enter detailed interaction notes..."
                  required
                  class="modern-textarea"
                ></textarea>
              </div>

              <div class="form-group">
                <label>Attachments</label>
                <input 
                  type="file" 
                  multiple 
                  @change="handleFileUpload"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  class="modern-file-input"
                >
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="newInteraction.hasReminder"
                    class="modern-checkbox"
                  >
                  <span class="checkbox-custom"></span>
                  Add Reminder
                </label>
              </div>

              <div class="form-group" v-if="newInteraction.hasReminder">
                <label>Reminder Date</label>
                <input 
                  type="date" 
                  v-model="newInteraction.reminderDate"
                  :min="today"
                  class="modern-input"
                >
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="resetForm">
                Reset
              </button>
              <button type="submit" class="btn-primary">
                Save Interaction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Notes Modal -->
    <div v-if="showNotesModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Interaction Details</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="interaction-details">
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{ formatDate(selectedInteraction?.dateInteracted) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">By:</span>
              <span class="detail-value">{{ selectedInteraction?.interactedBy }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mode:</span>
              <span class="detail-value">{{ selectedInteraction?.mode }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Notes:</span>
              <div class="detail-notes">{{ selectedInteraction?.notes }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBusinessLogic } from '../composables/useBusinessLogic';
import { mockManufacturers, mockDistributors } from '../data/mockData';
import type { Interaction } from '../types';

const props = defineProps<{
  id: string;
}>();

const { interactions, addInteraction } = useBusinessLogic();

const showNotesModal = ref(false);
const selectedInteraction = ref<Interaction | null>(null);

const newInteraction = ref({
  interactedBy: 'Current User',
  dateInteracted: new Date().toISOString().split('T')[0],
  mode: '' as 'Phone' | 'FtoF' | '',
  notes: '',
  hasReminder: false,
  reminderDate: '',
  attachments: [] as string[]
});

const manufacturerData = computed(() => {
  const distributor = mockDistributors.find(d => d.id === props.id);
  if (distributor) {
    return mockManufacturers.find(m => m.category === distributor.category) || mockManufacturers[0];
  } else {
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      return manufacturer;
    }
    return mockManufacturers[0];
  }
});

const distributorData = computed(() => {
  const distributor = mockDistributors.find(d => d.id === props.id);
  if (distributor) {
    return distributor;
  } else {
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      return mockDistributors.find(d => d.category === manufacturer.category) || mockDistributors[0];
    }
    return mockDistributors[0];
  }
});

const isManufacturerLead = computed(() => {
  return mockManufacturers.some(m => m.id === props.id);
});

const manufacturerName = computed(() => manufacturerData.value.name);
const distributorName = computed(() => distributorData.value.name);

const today = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getModeClass = (mode: string) => {
  return mode === 'Phone' ? 'mode-phone' : 'mode-face';
};

const getReminderClass = (hasReminder: boolean) => {
  return hasReminder ? 'reminder-yes' : 'reminder-no';
};

const viewNotes = (interaction: Interaction) => {
  selectedInteraction.value = interaction;
  showNotesModal.value = true;
};

const closeModal = () => {
  showNotesModal.value = false;
  selectedInteraction.value = null;
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    newInteraction.value.attachments = Array.from(target.files).map(file => file.name);
  }
};

const submitNotes = () => {
  const interaction = {
    ...newInteraction.value,
    mode: newInteraction.value.mode as 'Phone' | 'FtoF',
    timeElapsed: 'Just now'
  };

  addInteraction(interaction);
  resetForm();
  
  alert('Interaction added successfully!');
};

const resetForm = () => {
  newInteraction.value = {
    interactedBy: 'Current User',
    dateInteracted: new Date().toISOString().split('T')[0],
    mode: '',
    notes: '',
    hasReminder: false,
    reminderDate: '',
    attachments: []
  };
};

onMounted(() => {
  console.log('Loading lead data for ID:', props.id);
});
</script>

<style scoped>
.lead-page {
  max-width: 1200px;
  margin: 0 auto;
  background: #f5f5f7;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.floating-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid #d2d2d7;
  padding: 20px;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.content-wrapper {
  margin-top: 120px;
  padding: 24px;
}

.floating-back-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.btn-floating-back {
  background: #1c1c1e;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(28, 28, 30, 0.3);
  transition: all 0.3s ease;
}

.btn-floating-back:hover {
  background: #000000;
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(28, 28, 30, 0.4);
}

.relationship-header h1 {
  color: #1d1d1f;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.relationship-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.manufacturer {
  background: #e8f4fd;
  color: #1e40af;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid #bfdbfe;
}

.distributor {
  background: #fef3c7;
  color: #92400e;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid #fde68a;
}

.connector {
  color: #86868b;
  font-size: 18px;
  font-weight: bold;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-lead {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.selected-entity {
  border: 2px solid #1c1c1e !important;
  box-shadow: 0 0 0 2px rgba(28, 28, 30, 0.2);
}

.lead-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.interactions-section,
.notes-section {
  background: white;
  border: 1px solid #d2d2d7;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f2f2f7;
}

.section-header h2 {
  color: #1d1d1f;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.section-icon {
  font-size: 24px;
  opacity: 0.6;
}

.stat-badge {
  background: #f5f5f7;
  color: #86868b;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-container {
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #f2f2f7;
  max-height: 400px;
}

.table-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  max-height: 400px;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  position: relative;
}

.modern-table th {
  background: #fafafa;
  font-weight: 600;
  color: #1d1d1f;
  text-align: left;
  padding: 16px 20px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f2f2f7;
  white-space: nowrap;
}

.modern-table td {
  box-shadow: 0 1px 0 0 #f2f2f7;
  padding: 16px 20px;
  border-bottom: 1px solid #f8f8f8;
  color: #1d1d1f;
  font-size: 14px;
  vertical-align: middle;
}

.table-row:hover {
  background: #fafafa;
}

/* Enhanced scrollbar styling for webkit browsers */
.table-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f8f8f8;
  border-radius: 4px;
  margin: 4px 0;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #c7c7cc;
  border-radius: 4px;
  border: 1px solid #f8f8f8;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #aeaeb2;
}

.table-wrapper::-webkit-scrollbar-thumb:active {
  background: #8e8e93;
}

.table-wrapper::-webkit-scrollbar-corner {
  background: #f8f8f8;
}

/* Firefox scrollbar */
.table-wrapper {
  scrollbar-width: thin;
  scrollbar-color: #c7c7cc #f8f8f8;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1c1c1e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
  color: #1d1d1f;
}

.date-cell {
  color: #86868b;
  font-weight: 500;
}

.time-elapsed {
  color: #86868b;
  font-style: italic;
}

.mode-badge,
.reminder-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mode-phone {
  background: #e8f4fd;
  color: #1e40af;
}

.mode-face {
  background: #d1fae5;
  color: #065f46;
}

.reminder-yes {
  background: #fef3c7;
  color: #92400e;
}

.reminder-no {
  background: #f3f4f6;
  color: #86868b;
}

.btn-action-small {
  background: #1c1c1e;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-action-small:hover {
  background: #000000;
  transform: translateY(-1px);
}

.modern-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #1d1d1f;
  font-size: 14px;
}

.modern-input,
.modern-select,
.modern-textarea {
  padding: 12px 16px;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 400;
  color: #1d1d1f;
  background: white;
  transition: all 0.2s ease;
  font-family: inherit;
}

.modern-input:focus,
.modern-select:focus,
.modern-textarea:focus {
  outline: none;
  border-color: #1c1c1e;
  box-shadow: 0 0 0 3px rgba(28, 28, 30, 0.1);
}

.modern-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.modern-file-input {
  padding: 12px 16px;
  border: 2px dashed #d2d2d7;
  border-radius: 12px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.modern-file-input:hover {
  border-color: #1c1c1e;
  background: #f5f5f7;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 500;
  color: #1d1d1f;
}

.modern-checkbox {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d2d2d7;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.modern-checkbox:checked + .checkbox-custom {
  background: #1c1c1e;
  border-color: #1c1c1e;
}

.modern-checkbox:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #f2f2f7;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 120px;
}

.btn-primary {
  background: #1c1c1e;
  color: white;
}

.btn-primary:hover {
  background: #000000;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
}

.btn-secondary:hover {
  background: #e8e8ed;
  transform: translateY(-1px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f2f2f7;
}

.modal-header h3 {
  margin: 0;
  color: #1d1d1f;
  font-size: 18px;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #86868b;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #f5f5f7;
  color: #1d1d1f;
}

.modal-body {
  padding: 24px;
}

.interaction-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-weight: 600;
  color: #86868b;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  color: #1d1d1f;
  font-weight: 500;
}

.detail-notes {
  color: #1d1d1f;
  line-height: 1.5;
  background: #fafafa;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f2f2f7;
}

@media (max-width: 768px) {
  .lead-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .table-container {
    max-height: 300px;
  }
  
  .table-wrapper {
    max-height: 300px;
  }
  
  .content-wrapper {
    margin-top: 140px;
    padding: 16px;
  }
  
  .relationship-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 12px 16px;
    font-size: 12px;
  }
  
  .interactions-section,
  .notes-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 12px;
  }
  
  .table-container {
    max-height: 250px;
  }
  
  .table-wrapper {
    max-height: 250px;
  }
  
  .interactions-section,
  .notes-section {
    padding: 16px;
    border-radius: 12px;
  }
  
  .section-header h2 {
    font-size: 18px;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 8px 12px;
    font-size: 11px;
  }
  
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>