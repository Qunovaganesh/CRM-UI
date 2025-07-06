<template>
  <div class="view-only-page">
    <!-- Floating Header -->
    <div class="floating-header">
      <div class="relationship-header">
        <h1>Relationship Web View</h1>
        <div class="relationship-info">
          <span :class="isManufacturerView ? 'manufacturer selected-entity' : 'manufacturer'">
            {{ manufacturerName }}
          </span>
          <span class="connector">↔</span>
          <span :class="!isManufacturerView ? 'distributor selected-entity' : 'distributor'">
            {{ distributorName }}
          </span>
          <span class="status-badge status-view">Registered</span>
        </div>
      </div>
      <p>Complete view of manufacturer-distributor relationship and business history</p>
    </div>

    <!-- Floating Back Button -->
    <div class="floating-back-button">
      <button class="btn-floating-back" @click="$router.go(-1)">
        ← Back
      </button>
    </div>

    <div class="content-wrapper">

    <!-- Relationship Web Visualization -->
    <div class="relationship-web">
      <h2>Business Relationship Network</h2>
      <div class="web-container">
        <div class="relationship-map">
          <div class="entity-node manufacturer-node">
            <h4>{{ manufacturerName }}</h4>
            <p>{{ manufacturerData.city }}, {{ manufacturerData.state }}</p>
            <p>{{ manufacturerData.industry }}</p>
            <span class="entity-type">Manufacturer</span>
          </div>
          
          <div class="connection-line">
            <div class="connection-status">
              <span class="status-indicator registered"></span>
              <span class="connection-label">Active Partnership</span>
            </div>
          </div>
          
          <div class="entity-node distributor-node">
            <h4>{{ distributorName }}</h4>
            <p>{{ distributorData.city }}, {{ distributorData.state }}</p>
            <p>{{ distributorData.category }}</p>
            <span class="entity-type">Distributor</span>
          </div>
        </div>

        <!-- Related Entities -->
        <div class="related-entities">
          <div class="related-section">
            <h3>Other Distributors in Network</h3>
            <div class="related-grid">
              <div 
                v-for="distributor in relatedDistributors" 
                :key="distributor.id"
                class="related-entity"
                :class="getStatusClass(distributor.status)"
              >
                <h5>{{ distributor.name }}</h5>
                <p>{{ distributor.city }}</p>
                <span class="status-mini">{{ distributor.status }}</span>
              </div>
            </div>
          </div>

          <div class="related-section">
            <h3>Other Manufacturers in Network</h3>
            <div class="related-grid">
              <div 
                v-for="manufacturer in relatedManufacturers" 
                :key="manufacturer.id"
                class="related-entity manufacturer-related"
              >
                <h5>{{ manufacturer.name }}</h5>
                <p>{{ manufacturer.city }}</p>
                <span class="status-mini">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="customer-info">
      <div class="info-card">
        <h2>Partnership Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Partnership ID:</label>
            <span>{{ customerId }}</span>
          </div>
          <div class="info-item">
            <label>Manufacturer:</label>
            <span>{{ manufacturerData.name }}</span>
          </div>
          <div class="info-item">
            <label>Distributor:</label>
            <span>{{ distributorData.name }}</span>
          </div>
          <div class="info-item">
            <label>Status:</label>
            <span class="status-registered">Registered Partnership</span>
          </div>
          <div class="info-item">
            <label>Industry:</label>
            <span>{{ distributorData.industry }}</span>
          </div>
          <div class="info-item">
            <label>Category:</label>
            <span>{{ distributorData.category }}</span>
          </div>
          <div class="info-item">
            <label>Partnership Date:</label>
            <span>{{ formatDate(distributorData.registrationDate) }}</span>
          </div>
          <div class="info-item">
            <label>Days Active:</label>
            <span>{{ (isManufacturerView ? manufacturerData : distributorData).daysSinceStatus }} days</span>
          </div>
        </div>
      </div>
    </div>

    <div class="history-section">
      <div class="history-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-content">
        <!-- Interactions History -->
        <div v-if="activeTab === 'interactions'" class="tab-panel">
          <h3>Interaction History</h3>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Interacted By</th>
                  <th>Mode</th>
                  <th>Notes</th>
                  <th>Time Elapsed</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="interaction in interactions" :key="interaction.id">
                  <td>{{ formatDate(interaction.dateInteracted) }}</td>
                  <td>{{ interaction.interactedBy }}</td>
                  <td>
                    <span :class="getModeClass(interaction.mode)">
                      {{ interaction.mode }}
                    </span>
                  </td>
                  <td>{{ interaction.notes }}</td>
                  <td>{{ interaction.timeElapsed }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Agreement History -->
        <div v-if="activeTab === 'agreements'" class="tab-panel">
          <h3>Agreement History</h3>
          <div class="agreement-info">
            <div class="agreement-item">
              <h4>Current Agreement</h4>
              <div class="agreement-details">
                <p><strong>Parties:</strong> {{ manufacturerName }} ↔ {{ distributorName }}</p>
                <p><strong>Version:</strong> {{ agreement.version }}</p>
                <p><strong>Status:</strong> 
                  <span :class="getAgreementStatusClass(agreement.status)">
                    {{ agreement.status }}
                  </span>
                </p>
                <p><strong>Created:</strong> {{ formatDate(agreement.createdDate) }}</p>
                <p v-if="agreement.signedDate"><strong>Signed:</strong> {{ formatDate(agreement.signedDate) }}</p>
              </div>
              <div class="terms-list">
                <h5>Terms & Conditions</h5>
                <div v-for="term in agreement.terms" :key="term.id" class="term-item">
                  <strong>{{ term.clause }}:</strong> {{ term.response }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice History -->
        <div v-if="activeTab === 'invoices'" class="tab-panel">
          <h3>Invoice History</h3>
          <div class="invoice-filters">
            <label>Filter by period:</label>
            <select v-model="invoiceFilter" @change="filterInvoices">
              <option value="all">All Invoices</option>
              <option value="7days">Last 7 Days</option>
              <option value="month">This Month</option>
              <option value="lastmonth">Last Month</option>
              <option value="quarter">This Quarter</option>
            </select>
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
                  <th>Status</th>
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
                  <td>
                    <span class="status-completed">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Summary -->
        <div v-if="activeTab === 'summary'" class="tab-panel">
          <h3>Partnership Summary</h3>
          <div class="summary-grid">
            <div class="summary-card">
              <h4>Total Interactions</h4>
              <p class="summary-value">{{ interactions.length }}</p>
            </div>
            <div class="summary-card">
              <h4>Total Invoices</h4>
              <p class="summary-value">{{ invoices.length }}</p>
            </div>
            <div class="summary-card">
              <h4>Total Business Value</h4>
              <p class="summary-value">₹{{ totalAmount.toLocaleString() }}</p>
            </div>
            <div class="summary-card">
              <h4>Total Commission</h4>
              <p class="summary-value">₹{{ totalCommission.toLocaleString() }}</p>
            </div>
            <div class="summary-card">
              <h4>Partnership Duration</h4>
              <p class="summary-value">{{ distributorData.daysSinceStatus }} days</p>
            </div>
            <div class="summary-card">
              <h4>Agreement Status</h4>
              <p class="summary-value">{{ agreement.status }}</p>
            </div>
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
import { mockDistributors, mockManufacturers } from '../data/mockData';

const props = defineProps<{
  id: string;
}>();

const { interactions, agreement, invoices } = useBusinessLogic();

const activeTab = ref('interactions');
const invoiceFilter = ref('all');
const customerId = ref(props.id);


const manufacturerData = computed(() => {
  // Check if we're dealing with a distributor or manufacturer view
  const distributor = mockDistributors.find(d => d.id === props.id);
  if (distributor) {
    // This is a distributor view, find matching manufacturer
    return mockManufacturers.find(m => m.industry === distributor.industry) || mockManufacturers[0];
  } else {
    // This is a manufacturer view
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      return manufacturer;
    }
    return mockManufacturers[0];
  }
});

const distributorData = computed(() => {
  // Check if we're dealing with a distributor or manufacturer view
  const distributor = mockDistributors.find(d => d.id === props.id);
  if (distributor) {
    return distributor;
  } else {
    // This is a manufacturer view, find matching distributor
    const manufacturer = mockManufacturers.find(m => m.id === props.id);
    if (manufacturer) {
      return mockDistributors.find(d => d.industry === manufacturer.industry) || mockDistributors[0];
    }
    return mockDistributors[0];
  }
});

const isManufacturerView = computed(() => {
  return mockManufacturers.some(m => m.id === props.id);
});

const manufacturerName = computed(() => manufacturerData.value.name);

// Related entities in the same industry
const relatedDistributors = computed(() => {
  return mockDistributors.filter(d => 
    d.id !== props.id && 
    d.industry === distributorData.value.industry
  ).slice(0, 4);
});

const relatedManufacturers = computed(() => {
  return mockManufacturers.filter(m => 
    m.id !== manufacturerData.value.id && 
    m.industry === distributorData.value.industry
  ).slice(0, 4);
});

const tabs = [
  { id: 'interactions', label: 'Interactions' },
  { id: 'agreements', label: 'Agreements' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'summary', label: 'Summary' }
];

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

const totalAmount = computed(() => {
  return invoices.value.reduce((sum, invoice) => sum + invoice.amount, 0);
});

const totalCommission = computed(() => {
  return invoices.value.reduce((sum, invoice) => sum + invoice.commissionAmount, 0);
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

const getStatusClass = (status: string) => {
  return `related-${status.toLowerCase()}`;
};

const getAgreementStatusClass = (status: string) => {
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

const getInvoiceTypeClass = (type: string) => {
  return type === 'Proforma' ? 'type-proforma' : 'type-tax';
};

const filterInvoices = () => {
  // Filter logic handled by computed property
};

onMounted(() => {
  console.log('Loading view-only data for partnership ID:', props.id);
});
</script>

<style scoped>
.floating-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 20px;
  z-index: 100;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.content-wrapper {
  margin-top: 140px;
  padding: 20px;
}

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

.view-only-page {
  max-width: 1200px;
  margin: 0 auto;
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

.status-view {
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

.relationship-web {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.relationship-web h2 {
  color: #374151;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.web-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.relationship-map {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
}

.entity-node {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  min-width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.manufacturer-node {
  border-color: #3b82f6;
}

.distributor-node {
  border-color: #f59e0b;
}

.entity-node h4 {
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.entity-node p {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 4px 0;
}

.entity-type {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.connection-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.connection-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.registered {
  background: #10b981;
}

.connection-label {
  color: #374151;
  font-size: 12px;
  font-weight: 500;
}

.related-entities {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.related-section h3 {
  color: #374151;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.related-entity {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
}

.related-entity h5 {
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.related-entity p {
  color: #6b7280;
  font-size: 12px;
  margin: 0 0 6px 0;
}

.status-mini {
  background: #e5e7eb;
  color: #374151;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
}

.related-lead .status-mini {
  background: #fef3c7;
  color: #92400e;
}

.related-prospect .status-mini {
  background: #dbeafe;
  color: #1e40af;
}

.related-customer .status-mini {
  background: #d1fae5;
  color: #065f46;
}

.manufacturer-related {
  border-color: #3b82f6;
}

.customer-info {
  margin-bottom: 30px;
}

.info-card {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
}

.info-card h2 {
  color: #374151;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.info-item span {
  color: #4b5563;
  font-size: 14px;
}

.status-registered {
  background: #d1fae5;
  color: #065f46;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.history-section {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}

.history-tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #d1d5db;
}

.tab-button {
  flex: 1;
  padding: 15px 20px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #0066cc;
  background: #f0f9ff;
}

.tab-button.active {
  color: #0066cc;
  background: white;
  border-bottom-color: #0066cc;
}

.tab-content {
  padding: 20px;
}

.tab-panel h3 {
  color: #374151;
  font-size: 18px;
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

.status-completed {
  background: #d1fae5;
  color: #065f46;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.agreement-info {
  margin-bottom: 20px;
}

.agreement-item {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 15px;
  background: #f9fafb;
}

.agreement-item h4 {
  color: #374151;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.agreement-details {
  margin-bottom: 15px;
}

.agreement-details p {
  margin: 5px 0;
  color: #4b5563;
}

.terms-list h5 {
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  margin: 15px 0 10px 0;
}

.term-item {
  margin-bottom: 8px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  color: #4b5563;
  font-size: 14px;
}

.invoice-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.invoice-filters label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.invoice-filters select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.summary-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
}

.summary-card h4 {
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  color: #0066cc;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

@media (max-width: 768px) {
  .relationship-map {
    flex-direction: column;
    gap: 20px;
  }
  
  .related-entities {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .history-tabs {
    flex-direction: column;
  }
  
  .tab-button {
    border-bottom: 1px solid #e5e7eb;
  }
  
  .tab-button.active {
    border-bottom-color: #0066cc;
  }
  
  .table th,
  .table td {
    padding: 8px;
    font-size: 12px;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .content-wrapper {
    margin-top: 160px;
  }
  
  .relationship-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>