<template>
  <div class="lead-page">
    <div class="page-header">
      <button class="btn-back" @click="$router.go(-1)">← Back</button>
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

    <div class="lead-content">
      <div class="interactions-section">
        <h2>Past Interactions</h2>
        <div class="table-container">
          <table class="table">
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
              <tr v-for="interaction in interactions" :key="interaction.id">
                <td>{{ interaction.interactedBy }}</td>
                <td>{{ formatDate(interaction.dateInteracted) }}</td>
                <td>{{ interaction.timeElapsed }}</td>
                <td>
                  <span :class="getModeClass(interaction.mode)">
                    {{ interaction.mode }}
                  </span>
                </td>
                <td>
                  <span :class="getReminderClass(interaction.hasReminder)">
                    {{ interaction.hasReminder ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td>
                  <button class="btn-link" @click="viewNotes(interaction)">
                    View Notes
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="notes-section">
        <h2>Add Notes</h2>
        <form @submit.prevent="submitNotes">
          <div class="notes-form">
            <div class="form-group">
              <label>Interaction Mode</label>
              <select v-model="newInteraction.mode" required>
                <option value="">Select Mode</option>
                <option value="Phone">Phone</option>
                <option value="FtoF">Face to Face</option>
              </select>
            </div>

            <div class="form-group">
              <label>Notes</label>
              <textarea 
                v-model="newInteraction.notes" 
                rows="4" 
                placeholder="Enter interaction notes..."
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label>Attachments</label>
              <input 
                type="file" 
                multiple 
                @change="handleFileUpload"
                accept=".pdf,.doc,.docx,.jpg,.png"
              >
            </div>

            <div class="form-group">
              <label>
                <input 
                  type="checkbox" 
                  v-model="newInteraction.hasReminder"
                >
                Add Reminder
              </label>
            </div>

            <div class="form-group" v-if="newInteraction.hasReminder">
              <label>Reminder Date</label>
              <input 
                type="date" 
                v-model="newInteraction.reminderDate"
                :min="today"
              >
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">
                Submit Interaction
              </button>
              <button type="button" class="btn-secondary" @click="resetForm">
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Notes Modal -->
    <div v-if="showNotesModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Interaction Notes</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <p><strong>Date:</strong> {{ formatDate(selectedInteraction?.dateInteracted) }}</p>
          <p><strong>By:</strong> {{ selectedInteraction?.interactedBy }}</p>
          <p><strong>Mode:</strong> {{ selectedInteraction?.mode }}</p>
          <p><strong>Notes:</strong></p>
          <p>{{ selectedInteraction?.notes }}</p>
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
  mode: '',
  notes: '',
  hasReminder: false,
  reminderDate: '',
  attachments: [] as string[]
});


const manufacturerData = computed(() => {
  // Check if we're dealing with a distributor or manufacturer lead
  const distributor = mockDistributors.find(d => d.id === props.id);
  if (distributor) {
    // This is a distributor lead, find matching manufacturer
    return mockManufacturers.find(m => m.industry === distributor.industry) || mockManufacturers[0];
  } else {
    // This is a manufacturer lead, find matching distributor
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      const matchingDistributor = mockDistributors.find(d => d.industry === manufacturer.industry);
      return manufacturer;
    }
    return mockManufacturers[0];
  }
});

const distributorData = computed(() => {
  // Check if we're dealing with a distributor or manufacturer lead
  const distributor = mockDistributors.find(d => d.id === props.id);
  if (distributor) {
    return distributor;
  } else {
    // This is a manufacturer lead, find matching distributor
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      return mockDistributors.find(d => d.industry === manufacturer.industry) || mockDistributors[0];
    }
    return mockDistributors[0];
  }
});

const isManufacturerLead = computed(() => {
  return mockManufacturers.some(m => m.id === props.id);
});

const manufacturerName = computed(() => manufacturerData.value.name);

const today = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const formatDate = (dateString: string) => {
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
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.btn-back {
  background: none;
  border: none;
  color: #0066cc;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 15px;
}

.btn-back:hover {
  text-decoration: underline;
}

.relationship-header {
  margin-bottom: 10px;
}

.relationship-header h1 {
  color: #1f2937;
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
  background: #dbeafe;
  color: #1e40af;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
}

.distributor {
  background: #fef3c7;
  color: #92400e;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
}

.connector {
  color: #6b7280;
  font-size: 18px;
  font-weight: bold;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-lead {
  background: #fef3c7;
  color: #92400e;
}

.selected-entity {
  border: 2px solid #0066cc !important;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

.lead-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.interactions-section,
.notes-section {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
}

.interactions-section h2,
.notes-section h2 {
  color: #374151;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.table td {
  color: #4b5563;
  font-size: 14px;
}

.mode-phone {
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.mode-face {
  background: #d1fae5;
  color: #065f46;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.reminder-yes {
  background: #fef3c7;
  color: #92400e;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.reminder-no {
  background: #f3f4f6;
  color: #6b7280;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.btn-link {
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}

.btn-link:hover {
  color: #0052a3;
}

.notes-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.form-group label input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-primary {
  background: #0066cc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary:hover {
  background: #0052a3;
}

.btn-secondary {
  background: #6b7280;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary:hover {
  background: #4b5563;
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
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.btn-close:hover {
  color: #374151;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 0 0 15px 0;
  color: #4b5563;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .lead-content {
    grid-template-columns: 1fr;
  }
  
  .relationship-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .table th,
  .table td {
    padding: 8px;
    font-size: 12px;
  }
}
</style>