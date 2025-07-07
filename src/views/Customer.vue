<template>
  <div class="customer-page">
    <!-- Floating Header -->
    <div class="floating-header">
      <div class="relationship-header">
        <h1>Customer Management</h1>
        <div class="relationship-info">
          <span :class="isManufacturerCustomer ? 'manufacturer selected-entity' : 'manufacturer'">
            {{ manufacturerName }}
          </span>
          <span class="connector">↔</span>
          <span :class="!isManufacturerCustomer ? 'distributor selected-entity' : 'distributor'">
            {{ distributorName }}
          </span>
          <span class="status-badge status-customer">Customer</span>
        </div>
      </div>
      <p>Manage invoices, payments, and customer validation</p>
    </div>

    <!-- Floating Back Button -->
    <div class="floating-back-button">
      <button class="btn-floating-back" @click="$router.go(-1)">
        ← Back
      </button>
    </div>

    <div class="content-wrapper">
      <div class="customer-content">
        <div class="invoice-section">
          <div class="section-header">
            <h2>Invoice Management</h2>
            <div class="section-icon">📄</div>
          </div>
          
          <div class="invoice-form-card">
            <div class="form-header">
              <h3>{{ uploadType === 'proforma' ? '📋 Upload Proforma Invoice' : '🧾 Upload Tax Invoice' }}</h3>
              <div class="type-toggle">
                <button 
                  :class="{ active: uploadType === 'proforma' }"
                  @click="uploadType = 'proforma'; resetForm()"
                  class="toggle-btn"
                >
                  Proforma
                </button>
                <button 
                  :class="{ active: uploadType === 'tax' }"
                  @click="uploadType = 'tax'; resetForm()"
                  class="toggle-btn"
                >
                  Tax Invoice
                </button>
              </div>
            </div>

            <form @submit.prevent="uploadInvoice" class="modern-form">
              <div class="form-grid">
                <div class="form-group">
                  <label>Invoice Number</label>
                  <input 
                    type="text" 
                    v-model="newInvoice.invoiceNo" 
                    placeholder="Enter invoice number"
                    required
                    class="modern-input"
                  >
                </div>

                <div class="form-group">
                  <label>Amount (₹)</label>
                  <input 
                    type="number" 
                    v-model="newInvoice.amount" 
                    @input="calculateCommission"
                    placeholder="Enter amount"
                    required
                    class="modern-input"
                  >
                </div>

                <div class="form-group">
                  <label>Commission (%)</label>
                  <input 
                    type="number" 
                    v-model="newInvoice.commissionPercent" 
                    @input="calculateCommission"
                    placeholder="Enter commission percentage"
                    step="0.01"
                    required
                    class="modern-input"
                  >
                </div>

                <div class="form-group">
                  <label>Commission Amount (₹)</label>
                  <input 
                    type="number" 
                    v-model="newInvoice.commissionAmount" 
                    readonly
                    placeholder="Auto-calculated"
                    class="modern-input readonly"
                  >
                </div>

                <div class="form-group full-width">
                  <label>Upload Invoice File</label>
                  <div class="file-upload-area">
                    <input 
                      type="file" 
                      @change="handleFileUpload"
                      accept=".pdf,.jpg,.png"
                      required
                      class="file-input-hidden"
                      id="invoice-upload"
                    >
                    <label for="invoice-upload" class="file-upload-label">
                      <div class="upload-icon">📎</div>
                      <div class="upload-text">
                        <span>Click to upload invoice</span>
                        <small>PDF, JPG, or PNG files</small>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="resetForm">
                  Reset
                </button>
                <button type="submit" class="btn-primary">
                  📤 Upload Invoice
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="invoice-list">
          <div class="section-header">
            <h2>Invoice History</h2>
            <div class="filter-controls">
              <select v-model="invoiceFilter" @change="filterInvoices" class="modern-select">
                <option value="all">All Invoices</option>
                <option value="7days">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="lastmonth">Last Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>

          <div class="invoice-summary">
            <div class="summary-cards">
              <div class="summary-card">
                <div class="summary-icon">📊</div>
                <div class="summary-content">
                  <h4>Total Invoices</h4>
                  <p class="summary-value">{{ filteredInvoices.length }}</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">💰</div>
                <div class="summary-content">
                  <h4>Total Amount</h4>
                  <p class="summary-value">₹{{ totalInvoiceAmount.toLocaleString() }}</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">💸</div>
                <div class="summary-content">
                  <h4>Total Commission</h4>
                  <p class="summary-value">₹{{ totalCommissionAmount.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="table-container">
            <div class="table-wrapper">
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Invoice No</th>
                    <th>Amount</th>
                    <th>Commission</th>
                    <th>Upload Date</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="table-row">
                    <td>
                      <span :class="getInvoiceTypeClass(invoice.type)" class="type-badge">
                        {{ invoice.type }}
                      </span>
                    </td>
                    <td class="invoice-number">{{ invoice.invoiceNo }}</td>
                    <td class="amount">₹{{ invoice.amount.toLocaleString() }}</td>
                    <td class="commission">₹{{ invoice.commissionAmount.toLocaleString() }}</td>
                    <td class="date">{{ formatDate(invoice.uploadDate) }}</td>
                    <td class="duration">{{ invoice.durationBetween ? `${invoice.durationBetween} days` : '-' }}</td>
                    <td>
                      <span class="status-pending">Pending</span>
                    </td>
                    <td>
                      <button class="btn-action-small" @click="viewInvoice(invoice)">
                        👁️ View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="!filteredInvoices.length" class="no-invoices">
            <div class="no-data-content">
              <div class="no-data-icon">📄</div>
              <h4>No invoices found</h4>
              <p>No invoices found for the selected period</p>
            </div>
          </div>
        </div>
      </div>

      <div class="customer-actions">
        <div class="section-header">
          <h2>Customer Actions</h2>
          <div class="section-icon">⚡</div>
        </div>
        <div class="action-grid">
          <button class="action-card" @click="submitToCompliance">
            <div class="action-icon">📋</div>
            <div class="action-content">
              <h4>Submit to Compliance</h4>
              <p>Send for compliance review</p>
            </div>
          </button>
          <button class="action-card" @click="validateCustomer" v-if="showValidateButton">
            <div class="action-icon">✅</div>
            <div class="action-content">
              <h4>Validate Customer</h4>
              <p>Approve customer status</p>
            </div>
          </button>
          <button class="action-card" @click="uploadPayment">
            <div class="action-icon">💳</div>
            <div class="action-content">
              <h4>Upload Payment</h4>
              <p>Record payment receipt</p>
            </div>
          </button>
          <button class="action-card success" @click="convertToRegistered" v-if="isValidated">
            <div class="action-icon">🎯</div>
            <div class="action-content">
              <h4>Convert to Registered</h4>
              <p>Complete registration process</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Payment History -->
      <div v-if="paymentHistory.length" class="payment-history">
        <div class="section-header">
          <h2>Payment History</h2>
          <div class="section-icon">💰</div>
        </div>
        <div class="payment-list">
          <div v-for="payment in paymentHistory" :key="payment.id" class="payment-card">
            <div class="payment-info">
              <div class="payment-header">
                <h4>Payment #{{ payment.id }}</h4>
                <span class="status-success">Completed</span>
              </div>
              <div class="payment-details">
                <div class="detail-item">
                  <span class="detail-label">Amount:</span>
                  <span class="detail-value">₹{{ payment.amount.toLocaleString() }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Method:</span>
                  <span class="detail-value">{{ payment.method }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">{{ formatDate(payment.date) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Receipt:</span>
                  <span class="detail-value">{{ payment.fileName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Upload Modal -->
    <div v-if="showPaymentModal" class="modal-overlay" @click="closePaymentModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Upload Payment</h3>
          <button class="btn-close" @click="closePaymentModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitPayment" class="payment-form">
            <div class="form-group">
              <label>Payment Amount (₹)</label>
              <input 
                type="number" 
                v-model="paymentAmount" 
                placeholder="Enter payment amount"
                required
                class="modern-input"
              >
            </div>
            <div class="form-group">
              <label>Payment Method</label>
              <select v-model="paymentMethod" class="modern-select">
                <option value="bank_transfer">🏦 Bank Transfer</option>
                <option value="cheque">📝 Cheque</option>
                <option value="online">💻 Online Payment</option>
              </select>
            </div>
            <div class="form-group">
              <label>Payment Receipt</label>
              <div class="file-upload-area">
                <input 
                  type="file" 
                  @change="handlePaymentFileUpload"
                  accept=".pdf,.jpg,.png"
                  required
                  class="file-input-hidden"
                  id="payment-upload"
                >
                <label for="payment-upload" class="file-upload-label">
                  <div class="upload-icon">📎</div>
                  <div class="upload-text">
                    <span>Upload payment receipt</span>
                    <small>PDF, JPG, or PNG files</small>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closePaymentModal">Cancel</button>
          <button class="btn-primary" @click="submitPayment">Upload Payment</button>
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
import type { Invoice } from '../types';
import type { Payment } from '../types';

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const { invoices, addInvoice, updateDistributorStatus } = useBusinessLogic();

const uploadType = ref<'proforma' | 'tax'>('proforma');
const invoiceFilter = ref('all');
const showValidateButton = ref(false);
const isValidated = ref(false);
const showPaymentModal = ref(false);
const paymentAmount = ref<number>(0);
const paymentMethod = ref('bank_transfer');
const selectedPaymentFile = ref<File | null>(null);
const paymentHistory = ref<Payment[]>([]);

const newInvoice = ref({
  invoiceNo: '',
  amount: 0,
  commissionPercent: 0,
  commissionAmount: 0,
  uploadedBy: 'Current User',
  uploadDate: new Date().toISOString()
});

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

const isManufacturerCustomer = computed(() => {
  return mockManufacturers.some(m => m.id === props.id);
});

const manufacturerName = computed(() => manufacturerData.value.name);
const distributorName = computed(() => distributorData.value.name);

const filteredInvoices = computed(() => {
  let filtered = invoices.value;
  
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  
  switch (invoiceFilter.value) {
    case '7days':
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = invoices.value.filter(invoice => 
        new Date(invoice.uploadDate) >= weekAgo
      );
      break;
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      filtered = invoices.value.filter(invoice => 
        new Date(invoice.uploadDate) >= monthStart
      );
      break;
    case 'lastmonth':
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      filtered = invoices.value.filter(invoice => {
        const invoiceDate = new Date(invoice.uploadDate);
        return invoiceDate >= lastMonthStart && invoiceDate <= lastMonthEnd;
      });
      break;
    case 'quarter':
      const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
      filtered = invoices.value.filter(invoice => 
        new Date(invoice.uploadDate) >= quarterStart
      );
      break;
  }
  
  return filtered;
});

const totalInvoiceAmount = computed(() => {
  return filteredInvoices.value.reduce((sum, invoice) => sum + invoice.amount, 0);
});

const totalCommissionAmount = computed(() => {
  return filteredInvoices.value.reduce((sum, invoice) => sum + invoice.commissionAmount, 0);
});

const calculateCommission = () => {
  newInvoice.value.commissionAmount = 
    (newInvoice.value.amount * newInvoice.value.commissionPercent) / 100;
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  // Handle file upload logic
};

const handlePaymentFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedPaymentFile.value = target.files[0];
  }
};

const uploadInvoice = () => {
  const invoice = {
    ...newInvoice.value,
    type: uploadType.value === 'proforma' ? 'Proforma' : 'Tax'
  } as Omit<Invoice, 'id'>;
  
  addInvoice(invoice);
  resetForm();
  alert('Invoice uploaded successfully!');
};

const resetForm = () => {
  newInvoice.value = {
    invoiceNo: '',
    amount: 0,
    commissionPercent: 0,
    commissionAmount: 0,
    uploadedBy: 'Current User',
    uploadDate: new Date().toISOString()
  };
};

const filterInvoices = () => {
  // Filter logic handled by computed property
};

const getInvoiceTypeClass = (type: string) => {
  return type === 'Proforma' ? 'type-proforma' : 'type-tax';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const viewInvoice = (invoice: Invoice) => {
  alert(`Viewing invoice: ${invoice.invoiceNo}`);
};

const submitToCompliance = () => {
  showValidateButton.value = true;
  alert('Submitted to compliance team for review');
};

const validateCustomer = () => {
  isValidated.value = true;
  alert('Customer validated successfully!');
};

const uploadPayment = () => {
  showPaymentModal.value = true;
};

const closePaymentModal = () => {
  showPaymentModal.value = false;
  paymentAmount.value = 0;
  paymentMethod.value = 'bank_transfer';
  selectedPaymentFile.value = null;
};

const submitPayment = () => {
  if (paymentAmount.value > 0 && selectedPaymentFile.value) {
    const newPayment: Payment = {
      id: `PAY${Date.now()}`,
      amount: paymentAmount.value,
      method: paymentMethod.value,
      date: new Date().toISOString(),
      fileName: selectedPaymentFile.value.name,
      status: 'Completed'
    };
    
    paymentHistory.value.unshift(newPayment);
    
    alert('Payment uploaded successfully!');
    closePaymentModal();
  } else {
    alert('Please fill all required fields');
  }
};

const convertToRegistered = () => {
  if (isManufacturerCustomer.value) {
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      manufacturer.status = 'View';
      manufacturer.daysSinceStatus = 0;
    }
  } else {
    updateDistributorStatus(props.id, 'View');
  }
  alert('Customer converted to registered status! Redirecting...');
  setTimeout(() => {
    router.push({ name: 'ViewOnly', params: { id: props.id } });
  }, 1000);
};

onMounted(() => {
  console.log('Loading customer data for ID:', props.id);
});
</script>

<style scoped>
.customer-page {
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

.status-customer {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.selected-entity {
  border: 2px solid #1c1c1e !important;
  box-shadow: 0 0 0 2px rgba(28, 28, 30, 0.2);
}

.customer-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
  margin-bottom: 32px;
}

.invoice-section,
.invoice-list {
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

.invoice-form-card {
  background: #fafafa;
  border: 1px solid #f2f2f7;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-header h3 {
  color: #1d1d1f;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.type-toggle {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 2px;
  border: 1px solid #d2d2d7;
}

.toggle-btn {
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s ease;
  background: transparent;
  color: #86868b;
  min-height: 28px;
  box-sizing: border-box;
}

.toggle-btn.active {
  background: #1c1c1e;
  color: white;
}

.modern-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  align-items: start;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.form-group.full-width {
  grid-column: 1 / -1;
  width: 100%;
}

.form-group label {
  font-weight: 600;
  color: #1d1d1f;
  font-size: 14px;
}

.modern-input,
.modern-select,
.modern-textarea {
  padding: 10px 14px;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 14px;
  color: #1d1d1f;
  background: white;
  transition: all 0.2s ease;
  min-height: 40px;
  box-sizing: border-box;
  width: 100%;
}

.modern-input:focus,
.modern-select:focus {
  outline: none;
  border-color: #1c1c1e;
  box-shadow: 0 0 0 3px rgba(28, 28, 30, 0.1);
}

.modern-input.readonly {
  background: #f5f5f7;
  color: #86868b;
  cursor: not-allowed;
}

.modern-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.file-upload-area {
  border: 2px dashed #d2d2d7;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.file-upload-area:hover {
  border-color: #1c1c1e;
  background: #fafafa;
}

.file-input-hidden {
  display: none;
}

.file-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.upload-icon {
  font-size: 20px;
  opacity: 0.6;
}

.upload-text span {
  color: #1d1d1f;
  font-weight: 500;
  display: block;
}

.upload-text small {
  color: #86868b;
  font-size: 12px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f2f2f7;
  width: 100%;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-height: 40px;
  box-sizing: border-box;
  white-space: nowrap;
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

.filter-controls {
  display: flex;
  align-items: center;
}

.invoice-summary {
  margin-bottom: 24px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.summary-card {
  background: #fafafa;
  border: 1px solid #f2f2f7;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-icon {
  font-size: 20px;
  opacity: 0.7;
}

.summary-content h4 {
  color: #86868b;
  font-size: 12px;
  font-weight: 600;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  color: #1d1d1f;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.table-container {
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #f2f2f7;
}

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.modern-table th {
  background: #fafafa;
  font-weight: 600;
  color: #1d1d1f;
  text-align: left;
  padding: 10px 14px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f2f2f7;
  white-space: nowrap;
}

.modern-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #f8f8f8;
  color: #1d1d1f;
  font-size: 14px;
  vertical-align: middle;
}

.table-row:hover {
  background: #fafafa;
}

.type-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-proforma {
  background: #fff3cd;
  color: #856404;
}

.type-tax {
  background: #d1fae5;
  color: #065f46;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-action-small {
  background: #1c1c1e;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 28px;
  box-sizing: border-box;
}

.btn-action-small:hover {
  background: #000000;
  transform: translateY(-1px);
}

.no-invoices {
  padding: 40px 20px;
  text-align: center;
}

.no-data-content {
  max-width: 300px;
  margin: 0 auto;
}

.no-data-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-data-content h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
}

.no-data-content p {
  margin: 0;
  font-size: 14px;
  color: #86868b;
}

.customer-actions {
  background: white;
  border: 1px solid #d2d2d7;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  background: #fafafa;
  border: 1px solid #f2f2f7;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
}

.action-card:hover {
  background: #f5f5f7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-card.success {
  background: #d1fae5;
  border-color: #a7f3d0;
}

.action-card.success:hover {
  background: #bbf7d0;
}

.action-icon {
  font-size: 24px;
  opacity: 0.8;
}

.action-content h4 {
  color: #1d1d1f;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.action-content p {
  color: #86868b;
  font-size: 14px;
  margin: 0;
}

.payment-history {
  background: white;
  border: 1px solid #d2d2d7;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.payment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-card {
  background: #fafafa;
  border: 1px solid #f2f2f7;
  border-radius: 12px;
  padding: 16px;
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.payment-header h4 {
  margin: 0;
  color: #1d1d1f;
  font-size: 16px;
  font-weight: 600;
}

.status-success {
  background: #d1fae5;
  color: #065f46;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payment-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
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
  font-size: 14px;
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
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
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
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #f2f2f7;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 768px) {
  .customer-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .content-wrapper {
    margin-top: 160px;
    padding: 16px;
  }
  
  .relationship-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .invoice-section,
  .invoice-list,
  .customer-actions,
  .payment-history {
    padding: 14px;
  }
  
  .invoice-form-card {
    padding: 14px;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .action-card {
    padding: 12px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .action-icon {
    font-size: 20px;
  }
}
</style>