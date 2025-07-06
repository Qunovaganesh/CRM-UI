<template>
  <div class="customer-page">
    <!-- Floating Back Button -->
    <div class="floating-back-button">
      <button class="btn-floating-back" @click="$router.go(-1)">
        ← Back
      </button>
    </div>

    <div class="page-header">
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

    <div class="customer-content">
      <div class="invoice-section">
        <h2>Invoice Management</h2>
        
        <div class="invoice-form">
          <h3>{{ uploadType === 'proforma' ? 'Upload Proforma Invoice' : 'Upload Tax Invoice' }}</h3>
          
          <div class="form-group">
            <label>Invoice Type</label>
            <select v-model="uploadType" @change="resetForm">
              <option value="proforma">Proforma Invoice</option>
              <option value="tax">Tax Invoice</option>
            </select>
          </div>

          <div class="form-group">
            <label>Invoice Number</label>
            <input 
              type="text" 
              v-model="newInvoice.invoiceNo" 
              placeholder="Enter invoice number"
              required
            >
          </div>

          <div class="form-group">
            <label>Amount</label>
            <input 
              type="number" 
              v-model="newInvoice.amount" 
              @input="calculateCommission"
              placeholder="Enter amount"
              required
            >
          </div>

          <div class="form-group">
            <label>Commission %</label>
            <input 
              type="number" 
              v-model="newInvoice.commissionPercent" 
              @input="calculateCommission"
              placeholder="Enter commission percentage"
              step="0.01"
              required
            >
          </div>

          <div class="form-group">
            <label>Commission Amount</label>
            <input 
              type="number" 
              v-model="newInvoice.commissionAmount" 
              readonly
              placeholder="Auto-calculated"
            >
          </div>

          <div class="form-group">
            <label>Upload Invoice</label>
            <input 
              type="file" 
              @change="handleFileUpload"
              accept=".pdf,.jpg,.png"
              required
            >
          </div>

          <div class="form-actions">
            <button type="button" class="btn-primary" @click="uploadInvoice">
              Upload Invoice
            </button>
          </div>
        </div>
      </div>

      <div class="invoice-list">
        <h2>Invoice History</h2>
        
        <div class="filter-controls">
          <select v-model="invoiceFilter" @change="filterInvoices">
            <option value="all">All Invoices</option>
            <option value="7days">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="lastmonth">Last Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>

        <div class="invoice-summary">
          <div class="summary-cards">
            <div class="summary-card">
              <h4>Total Invoices</h4>
              <p class="summary-value">{{ filteredInvoices.length }}</p>
            </div>
            <div class="summary-card">
              <h4>Total Amount</h4>
              <p class="summary-value">₹{{ totalInvoiceAmount.toLocaleString() }}</p>
            </div>
            <div class="summary-card">
              <h4>Total Commission</h4>
              <p class="summary-value">₹{{ totalCommissionAmount.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="table-container">
          <table class="table">
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
              <tr v-for="invoice in filteredInvoices" :key="invoice.id">
                <td>
                  <span :class="getInvoiceTypeClass(invoice.type)">
                    {{ invoice.type }}
                  </span>
                </td>
                <td>{{ invoice.invoiceNo }}</td>
                <td>₹{{ invoice.amount.toLocaleString() }}</td>
                <td>₹{{ invoice.commissionAmount.toLocaleString() }}</td>
                <td>{{ formatDate(invoice.uploadDate) }}</td>
                <td>{{ invoice.durationBetween ? `${invoice.durationBetween} days` : '-' }}</td>
                <td>
                  <span class="status-pending">Pending</span>
                </td>
                <td>
                  <button class="btn-link" @click="viewInvoice(invoice)">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!filteredInvoices.length" class="no-invoices">
          <p>No invoices found for the selected period</p>
        </div>
      </div>
    </div>

    <div class="customer-actions">
      <h2>Customer Actions</h2>
      <div class="action-buttons">
        <button class="btn-secondary" @click="submitToCompliance">
          Submit to Compliance
        </button>
        <button class="btn-primary" @click="validateCustomer" v-if="showValidateButton">
          Validate Customer
        </button>
        <button class="btn-success" @click="uploadPayment">
          Upload Payment
        </button>
        <button class="btn-success" @click="convertToRegistered" v-if="isValidated">
          Convert to Registered Customer
        </button>
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
          <div class="payment-form">
            <div class="form-group">
              <label>Payment Amount</label>
              <input 
                type="number" 
                v-model="paymentAmount" 
                placeholder="Enter payment amount"
                required
              >
            </div>
            <div class="form-group">
              <label>Payment Method</label>
              <select v-model="paymentMethod">
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="online">Online Payment</option>
              </select>
            </div>
            <div class="form-group">
              <label>Payment Receipt</label>
              <input 
                type="file" 
                @change="handlePaymentFileUpload"
                accept=".pdf,.jpg,.png"
                required
              >
            </div>
          </div>
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
  // Check if we're dealing with a distributor or manufacturer customer
  const distributor = mockDistributors.find(d => d.id === props.id);
  if (distributor) {
    // This is a distributor customer, find matching manufacturer
    return mockManufacturers.find(m => m.industry === distributor.industry) || mockManufacturers[0];
  } else {
    // This is a manufacturer customer
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
    alert('Payment uploaded successfully!');
    closePaymentModal();
  } else {
    alert('Please fill all required fields');
  }
};

const convertToRegistered = () => {
  if (isManufacturerCustomer.value) {
    // Update manufacturer status
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      manufacturer.status = 'View';
      manufacturer.daysSinceStatus = 0;
    }
  } else {
    // Update distributor status
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
.floating-back-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.btn-floating-back {
  background: #0066cc;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
  transition: all 0.3s ease;
}

.btn-floating-back:hover {
  background: #0052a3;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
}

.customer-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
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

.status-customer {
  background: #d1fae5;
  color: #065f46;
}

.selected-entity {
  border: 2px solid #0066cc !important;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

.customer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.invoice-section,
.invoice-list {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
}

.invoice-section h2,
.invoice-list h2 {
  color: #374151;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.invoice-form h3 {
  color: #4b5563;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-group input,
.form-group select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.form-group input[readonly] {
  background: #f3f4f6;
  color: #6b7280;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.filter-controls {
  margin-bottom: 20px;
}

.filter-controls select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.invoice-summary {
  margin-bottom: 20px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.summary-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 15px;
  text-align: center;
}

.summary-card h4 {
  color: #374151;
  font-size: 12px;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  color: #0066cc;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
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

.type-proforma {
  background: #fef3c7;
  color: #92400e;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.type-tax {
  background: #d1fae5;
  color: #065f46;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
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

.no-invoices {
  padding: 40px;
  text-align: center;
  color: #6b7280;
}

.no-invoices p {
  margin: 0;
  font-size: 16px;
}

.customer-actions {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
}

.customer-actions h2 {
  color: #374151;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
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

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@media (max-width: 768px) {
  .customer-content {
    grid-template-columns: 1fr;
  }
  
  .relationship-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .table th,
  .table td {
    padding: 8px;
    font-size: 12px;
  }
}
</style>