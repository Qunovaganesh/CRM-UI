<template>
  <div class="prospect-page">
    <div class="page-header">
      <button class="btn-back" @click="$router.go(-1)">← Back</button>
      <div class="relationship-header">
        <h1>Prospect Management</h1>
        <div class="relationship-info">
          <span :class="isManufacturerProspect ? 'manufacturer selected-entity' : 'manufacturer'">
            {{ manufacturerName }}
          </span>
          <span class="connector">↔</span>
          <span :class="!isManufacturerProspect ? 'distributor selected-entity' : 'distributor'">
            {{ distributorName }}
          </span>
          <span class="status-badge status-prospect">Prospect</span>
        </div>
      </div>
      <p>Manage terms & conditions and agreement generation</p>
    </div>

    <div class="prospect-content">
      <div class="terms-section">
        <h2>Terms & Conditions</h2>
        <div class="terms-form">
          <div v-for="term in agreement.terms" :key="term.id" class="term-item">
            <div class="term-group">
              <label>{{ term.clause }}</label>
              <input 
                type="text" 
                v-model="term.response" 
                :disabled="!editMode"
                placeholder="Enter response..."
              >
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              type="button" 
              class="btn-primary" 
              @click="editMode = !editMode"
            >
              {{ editMode ? 'Save Changes' : 'Edit Terms' }}
            </button>
            <button 
              type="button" 
              class="btn-secondary" 
              @click="addTerm"
              v-if="editMode"
            >
              Add Term
            </button>
          </div>
        </div>
      </div>

      <div class="agreement-section">
        <h2>Agreement Management</h2>
        <div class="agreement-info">
          <div class="info-item">
            <strong>Status:</strong> 
            <span :class="getStatusClass(agreement.status)">
              {{ agreement.status }}
            </span>
          </div>
          <div class="info-item">
            <strong>Version:</strong> {{ agreement.version }}
          </div>
          <div class="info-item">
            <strong>Created:</strong> {{ formatDate(agreement.createdDate) }}
          </div>
          <div class="info-item" v-if="agreement.signedDate">
            <strong>Signed:</strong> {{ formatDate(agreement.signedDate) }}
          </div>
        </div>

        <div class="agreement-actions">
          <button 
            class="btn-primary" 
            @click="generateAgreement"
            :disabled="agreement.status === 'Signed'"
          >
            {{ agreement.status === 'Draft' ? 'Generate Agreement' : 'Regenerate Agreement' }}
          </button>
          
          <button 
            class="btn-secondary" 
            @click="downloadAgreement"
            v-if="agreement.status !== 'Draft'"
          >
            Download PDF
          </button>
          
          <button 
            class="btn-secondary" 
            @click="uploadSigned"
            v-if="agreement.status === 'Generated'"
          >
            Upload Signed Copy
          </button>
          
          <button 
            class="btn-success" 
            @click="convertToCustomer"
            v-if="agreement.status === 'Signed'"
          >
            Convert to Customer
          </button>
        </div>
      </div>
    </div>

    <!-- Agreement Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="closePreview">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>Agreement Preview</h3>
          <button class="btn-close" @click="closePreview">×</button>
        </div>
        <div class="modal-body">
          <div class="agreement-preview">
            <h4>Distribution Agreement</h4>
            <p><strong>Manufacturer:</strong> {{ manufacturerName }}</p>
            <p><strong>Distributor:</strong> {{ distributorName }}</p>
            <p><strong>Version:</strong> {{ agreement.version }}</p>
            <p><strong>Date:</strong> {{ formatDate(agreement.createdDate) }}</p>
            
            <div class="terms-preview">
              <h5>Terms & Conditions</h5>
              <div v-for="term in agreement.terms" :key="term.id" class="term-preview">
                <p><strong>{{ term.clause }}:</strong> {{ term.response }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closePreview">Back</button>
          <button class="btn-primary" @click="confirmGeneration">Confirm Generation</button>
        </div>
      </div>
    </div>

    <!-- File Upload Modal -->
    <div v-if="showUploadModal" class="modal-overlay" @click="closeUpload">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Upload Signed Agreement</h3>
          <button class="btn-close" @click="closeUpload">×</button>
        </div>
        <div class="modal-body">
          <div class="upload-section">
            <input 
              type="file" 
              ref="fileInput"
              @change="handleFileUpload"
              accept=".pdf,.doc,.docx"
            >
            <p class="upload-note">
              Please upload the signed agreement in PDF or DOC format.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeUpload">Cancel</button>
          <button class="btn-primary" @click="submitUpload" :disabled="!selectedFile">
            Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBusinessLogic } from '../composables/useBusinessLogic';
import { mockManufacturers, mockDistributors } from '../data/mockData';
import type { TermsCondition } from '../types';

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const { agreement, updateAgreement, updateDistributorStatus } = useBusinessLogic();

const editMode = ref(false);
const showPreviewModal = ref(false);
const showUploadModal = ref(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const distributorData = computed(() => {
  return mockDistributors.find(d => d.id === props.id) || mockDistributors[0];
});

const manufacturerData = computed(() => {
  // Check if we're dealing with a distributor or manufacturer prospect
  const distributor = mockDistributors.find(d => d.id === props.id);
  if (distributor) {
    // This is a distributor prospect, find matching manufacturer
    return mockManufacturers.find(m => m.industry === distributor.industry) || mockManufacturers[0];
  } else {
    // This is a manufacturer prospect
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      return manufacturer;
    }
    return mockManufacturers[0];
  }
});

const distributorData = computed(() => {
  // Check if we're dealing with a distributor or manufacturer prospect
  const distributor = mockDistributors.find(d => d.id === props.id);
  if (distributor) {
    return distributor;
  } else {
    // This is a manufacturer prospect, find matching distributor
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      return mockDistributors.find(d => d.industry === manufacturer.industry) || mockDistributors[0];
    }
    return mockDistributors[0];
  }
});

const isManufacturerProspect = computed(() => {
  return mockManufacturers.some(m => m.id === props.id);
});

const manufacturerName = computed(() => manufacturerData.value.name);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'status-draft';
    case 'Generated':
      return 'status-generated';
    case 'Signed':
      return 'status-signed';
    default:
      return '';
  }
};

const addTerm = () => {
  const newTerm: TermsCondition = {
    id: `T${Date.now()}`,
    clause: 'New Term',
    response: ''
  };
  agreement.value.terms.push(newTerm);
};

const generateAgreement = () => {
  showPreviewModal.value = true;
};

const closePreview = () => {
  showPreviewModal.value = false;
};

const confirmGeneration = () => {
  const updatedAgreement = {
    ...agreement.value,
    status: 'Generated' as const,
    version: agreement.value.version + 1,
    createdDate: new Date().toISOString()
  };
  
  updateAgreement(updatedAgreement);
  showPreviewModal.value = false;
  alert('Agreement generated successfully!');
};

const downloadAgreement = () => {
  const link = document.createElement('a');
  link.href = '#';
  link.download = `Agreement_${manufacturerName.value}_${distributorName.value}_v${agreement.value.version}.pdf`;
  link.click();
  alert('Agreement downloaded!');
};

const uploadSigned = () => {
  showUploadModal.value = true;
};

const closeUpload = () => {
  showUploadModal.value = false;
  selectedFile.value = null;
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

const submitUpload = () => {
  if (selectedFile.value) {
    const updatedAgreement = {
      ...agreement.value,
      status: 'Signed' as const,
      signedDate: new Date().toISOString()
    };
    
    updateAgreement(updatedAgreement);
    showUploadModal.value = false;
    selectedFile.value = null;
    alert('Signed agreement uploaded successfully!');
  }
};

const convertToCustomer = () => {
  if (isManufacturerProspect.value) {
    // Update manufacturer status
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      manufacturer.status = 'Customer';
      manufacturer.daysSinceStatus = 0;
    }
  } else {
    // Update distributor status
    updateDistributorStatus(props.id, 'Customer');
  }
  alert('Status updated to Customer! Redirecting...');
  setTimeout(() => {
    router.push({ name: 'Customer', params: { id: props.id } });
  }, 1000);
};
};

onMounted(() => {
  console.log('Loading prospect data for ID:', props.id);
});
</script>

<style scoped>
.prospect-page {
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

.status-prospect {
  background: #dbeafe;
  color: #1e40af;
}

.selected-entity {
  border: 2px solid #0066cc !important;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

.prospect-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.terms-section,
.agreement-section {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
}

.terms-section h2,
.agreement-section h2 {
  color: #374151;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.terms-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.term-item {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 15px;
  background: #f9fafb;
}

.term-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.term-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.term-group input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.term-group input:disabled {
  background: #f3f4f6;
  color: #6b7280;
}

.term-group input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.agreement-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.info-item strong {
  color: #374151;
}

.status-draft {
  background: #fef3c7;
  color: #92400e;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-generated {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-signed {
  background: #d1fae5;
  color: #065f46;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.agreement-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.btn-primary:hover:not(:disabled) {
  background: #0052a3;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
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

.btn-success {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-success:hover {
  background: #059669;
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

.large-modal {
  max-width: 800px;
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}

.agreement-preview h4 {
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
}

.agreement-preview h5 {
  color: #374151;
  font-size: 18px;
  font-weight: 600;
  margin: 20px 0 10px 0;
}

.term-preview {
  margin-bottom: 15px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 4px;
}

.term-preview p {
  margin: 0;
  color: #4b5563;
  line-height: 1.5;
}

.upload-section {
  text-align: center;
  padding: 20px;
}

.upload-note {
  margin-top: 15px;
  color: #6b7280;
  font-size: 14px;
}

@media (max-width: 768px) {
  .prospect-content {
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
  
  .modal-content {
    width: 95%;
  }
}
</style>