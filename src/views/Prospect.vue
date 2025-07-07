<template>
  <div class="prospect-page">
    <!-- Floating Header -->
    <div class="floating-header">
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

    <!-- Floating Back Button -->
    <div class="floating-back-button">
      <button class="btn-floating-back" @click="$router.go(-1)">
        ← Back
      </button>
    </div>

    <div class="content-wrapper">
      <div class="prospect-content">
        <div class="terms-section">
          <div class="section-header">
            <h2>Terms & Conditions</h2>
            <div class="section-actions">
              <button 
                type="button" 
                class="btn-edit"
                @click="toggleEditMode"
              >
                {{ editMode ? '💾 Save Changes' : '✏️ Edit Terms' }}
              </button>
              <button 
                type="button" 
                class="btn-add" 
                @click="addTerm"
                v-if="editMode"
              >
                ➕ Add Term
              </button>
            </div>
          </div>
          
          <div class="terms-container">
            <div class="terms-list">
              <div v-for="term in agreement.terms" :key="term.id" class="term-card">
                <div class="term-content">
                  <div class="term-field">
                    <label>Clause</label>
                    <select 
                      v-model="term.clause" 
                      :disabled="!editMode"
                      @change="onClauseChange(term)"
                      class="modern-select"
                    >
                      <option value="">Select Clause</option>
                      <option v-for="clause in termsOptions.clauses" :key="clause" :value="clause">
                        {{ clause }}
                      </option>
                    </select>
                  </div>
                  <div class="term-field">
                    <label>Response</label>
                    <select 
                      v-model="term.response" 
                      :disabled="!editMode || !term.clause"
                      class="modern-select"
                    >
                      <option value="">Select Response</option>
                      <option 
                        v-for="response in getResponseOptions(term.clause)" 
                        :key="response" 
                        :value="response"
                      >
                        {{ response }}
                      </option>
                    </select>
                  </div>
                  <div class="term-actions" v-if="editMode">
                    <button 
                      type="button" 
                      class="btn-remove" 
                      @click="removeTerm(term.id)"
                      :disabled="agreement.terms.length <= 1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="agreement-section">
          <div class="section-header">
            <h2>Agreement Management</h2>
            <div class="section-icon">📋</div>
          </div>
          
          <div class="agreement-info-card">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Status</span>
                <span :class="getStatusClass(agreement.status)" class="status-indicator">
                  {{ agreement.status }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Version</span>
                <span class="info-value">v{{ agreement.version }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Created</span>
                <span class="info-value">{{ formatDate(agreement.createdDate) }}</span>
              </div>
              <div class="info-item" v-if="agreement.signedDate">
                <span class="info-label">Signed</span>
                <span class="info-value">{{ formatDate(agreement.signedDate) }}</span>
              </div>
            </div>
          </div>

          <div class="agreement-actions">
            <button 
              class="btn-primary" 
              @click="generateAgreement"
              :disabled="agreement.status === 'Signed'"
            >
              {{ agreement.status === 'Draft' ? '📄 Generate Agreement' : '🔄 Regenerate Agreement' }}
            </button>
            
            <button 
              class="btn-secondary" 
              @click="downloadAgreement"
              v-if="agreement.status !== 'Draft'"
            >
              📥 Download PDF
            </button>
            
            <button 
              class="btn-secondary" 
              @click="uploadSigned"
              v-if="agreement.status === 'Generated'"
            >
              📤 Upload Signed Copy
            </button>
            
            <button 
              class="btn-success" 
              @click="convertToCustomer"
              v-if="agreement.status === 'Signed'"
            >
              ✅ Convert to Customer
            </button>
          </div>
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
            <div class="preview-header">
              <h4>Distribution Agreement</h4>
              <div class="preview-meta">
                <p><strong>Manufacturer:</strong> {{ manufacturerName }}</p>
                <p><strong>Distributor:</strong> {{ distributorName }}</p>
                <p><strong>Version:</strong> {{ agreement.version }}</p>
                <p><strong>Date:</strong> {{ formatDate(agreement.createdDate) }}</p>
              </div>
            </div>
            
            <div class="terms-preview">
              <h5>Terms & Conditions</h5>
              <div class="terms-preview-list">
                <div v-for="term in agreement.terms" :key="term.id" class="term-preview-item">
                  <div class="term-preview-clause">{{ term.clause }}</div>
                  <div class="term-preview-response">{{ term.response }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closePreview">Cancel</button>
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
            <div class="upload-area">
              <input 
                type="file" 
                ref="fileInput"
                @change="handleFileUpload"
                accept=".pdf,.doc,.docx"
                class="file-input-hidden"
                id="file-upload"
              >
              <label for="file-upload" class="upload-label">
                <div class="upload-icon">📄</div>
                <div class="upload-text">
                  <p>Click to upload signed agreement</p>
                  <span>PDF, DOC, or DOCX files only</span>
                </div>
              </label>
            </div>
            <div v-if="selectedFile" class="selected-file">
              <span class="file-name">{{ selectedFile.name }}</span>
              <button @click="selectedFile = null" class="btn-remove-file">×</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeUpload">Cancel</button>
          <button class="btn-primary" @click="submitUpload" :disabled="!selectedFile">
            Upload Agreement
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
import { termsOptions } from '../data/mockData';
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

const distributorName = computed(() => distributorData.value.name);
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
    clause: '',
    response: ''
  };
  agreement.value.terms.push(newTerm);
};

const removeTerm = (termId: string) => {
  const index = agreement.value.terms.findIndex(term => term.id === termId);
  if (index > -1 && agreement.value.terms.length > 1) {
    agreement.value.terms.splice(index, 1);
  }
};

const onClauseChange = (term: TermsCondition) => {
  term.response = '';
};

const getResponseOptions = (clause: string) => {
  return termsOptions.responses[clause] || [];
};

const toggleEditMode = () => {
  if (editMode.value) {
    updateAgreement(agreement.value);
  }
  editMode.value = !editMode.value;
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
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      manufacturer.status = 'Customer';
      manufacturer.daysSinceStatus = 0;
    }
  } else {
    updateDistributorStatus(props.id, 'Customer');
  }
  alert('Status updated to Customer! Redirecting...');
  setTimeout(() => {
    router.push({ name: 'Customer', params: { id: props.id } });
  }, 1000);
};

onMounted(() => {
  console.log('Loading prospect data for ID:', props.id);
});
</script>

<style scoped>
.prospect-page {
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
  margin-top: 140px;
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

.status-prospect {
  background: #e8f4fd;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.selected-entity {
  border: 2px solid #1c1c1e !important;
  box-shadow: 0 0 0 2px rgba(28, 28, 30, 0.2);
}

.prospect-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.terms-section,
.agreement-section {
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

.section-actions {
  display: flex;
  gap: 12px;
}

.btn-edit,
.btn-add {
  padding: 8px 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-edit {
  background: #1c1c1e;
  color: white;
}

.btn-edit:hover {
  background: #000000;
  transform: translateY(-1px);
}

.btn-add {
  background: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
}

.btn-add:hover {
  background: #e8e8ed;
  transform: translateY(-1px);
}

.terms-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #f2f2f7;
  border-radius: 12px;
  background: #fafafa;
  padding: 16px;
}

.terms-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.term-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #f2f2f7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.term-content {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: end;
}

.term-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.term-field label {
  font-weight: 600;
  color: #1d1d1f;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-select {
  padding: 10px 12px;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 14px;
  color: #1d1d1f;
  background: white;
  transition: all 0.2s ease;
}

.modern-select:disabled {
  background: #f5f5f7;
  color: #86868b;
  cursor: not-allowed;
}

.modern-select:focus {
  outline: none;
  border-color: #1c1c1e;
  box-shadow: 0 0 0 3px rgba(28, 28, 30, 0.1);
}

.term-actions {
  display: flex;
  align-items: center;
}

.btn-remove {
  background: #ff3b30;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover:not(:disabled) {
  background: #d70015;
  transform: scale(1.05);
}

.btn-remove:disabled {
  background: #86868b;
  cursor: not-allowed;
  transform: none;
}

.agreement-info-card {
  background: #fafafa;
  border: 1px solid #f2f2f7;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-weight: 600;
  color: #86868b;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #1d1d1f;
  font-weight: 500;
  font-size: 14px;
}

.status-indicator {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.status-draft {
  background: #fff3cd;
  color: #856404;
}

.status-generated {
  background: #e8f4fd;
  color: #1e40af;
}

.status-signed {
  background: #d1fae5;
  color: #065f46;
}

.agreement-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-primary,
.btn-secondary,
.btn-success {
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-align: center;
}

.btn-primary {
  background: #1c1c1e;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #000000;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #86868b;
  cursor: not-allowed;
  transform: none;
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

.btn-success {
  background: #30d158;
  color: white;
}

.btn-success:hover {
  background: #28cd4f;
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

.large-modal {
  max-width: 800px;
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f2f2f7;
}

.agreement-preview {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preview-header h4 {
  color: #1d1d1f;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.preview-meta {
  background: #fafafa;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #f2f2f7;
}

.preview-meta p {
  margin: 4px 0;
  color: #1d1d1f;
  font-size: 14px;
}

.terms-preview h5 {
  color: #1d1d1f;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.terms-preview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.term-preview-item {
  background: #fafafa;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #f2f2f7;
}

.term-preview-clause {
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 4px;
}

.term-preview-response {
  color: #86868b;
  font-size: 14px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-area {
  border: 2px dashed #d2d2d7;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #1c1c1e;
  background: #fafafa;
}

.file-input-hidden {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.upload-icon {
  font-size: 48px;
  opacity: 0.6;
}

.upload-text p {
  margin: 0;
  color: #1d1d1f;
  font-weight: 500;
  font-size: 16px;
}

.upload-text span {
  color: #86868b;
  font-size: 14px;
}

.selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f5f5f7;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #d2d2d7;
}

.file-name {
  color: #1d1d1f;
  font-weight: 500;
}

.btn-remove-file {
  background: none;
  border: none;
  color: #86868b;
  cursor: pointer;
  font-size: 18px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-remove-file:hover {
  background: #e8e8ed;
  color: #1d1d1f;
}

@media (max-width: 768px) {
  .prospect-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .term-content {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .content-wrapper {
    margin-top: 160px;
    padding: 16px;
  }
  
  .terms-container {
    max-height: 400px;
  }
  
  .relationship-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .section-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .modal-content {
    width: 95%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .terms-section,
  .agreement-section {
    padding: 16px;
  }
  
  .term-card {
    padding: 16px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
  
  .upload-area {
    padding: 24px;
  }
  
  .upload-icon {
    font-size: 36px;
  }
}
</style>