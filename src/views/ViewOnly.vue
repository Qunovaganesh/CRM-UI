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
        <div class="section-header">
          <h2>Business Relationship Network</h2>
          <div class="section-icon">🌐</div>
        </div>
        
        <div class="web-container">
          <div class="relationship-map">
            <div class="entity-node manufacturer-node">
              <div class="node-avatar">🏭</div>
              <div class="node-content">
                <h4>{{ manufacturerName }}</h4>
                <p>{{ manufacturerData.city }}, {{ manufacturerData.state }}</p>
                <p>{{ manufacturerData.category }}</p>
                <span class="entity-type">Manufacturer</span>
              </div>
            </div>
            
            <div class="connection-line">
              <div class="connection-status">
                <div class="status-indicator registered"></div>
                <span class="connection-label">Active Partnership</span>
                <div class="connection-metrics">
                  <span class="metric">{{ distributorData.daysSinceStatus }} days</span>
                </div>
              </div>
            </div>
            
            <div class="entity-node distributor-node">
              <div class="node-avatar">🏪</div>
              <div class="node-content">
                <h4>{{ distributorName }}</h4>
                <p>{{ distributorData.city }}, {{ distributorData.state }}</p>
                <p>{{ distributorData.category }}</p>
                <span class="entity-type">Distributor</span>
              </div>
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
                  <div class="related-avatar">{{ distributor.name.charAt(0) }}</div>
                  <div class="related-content">
                    <h5>{{ distributor.name }}</h5>
                    <p>{{ distributor.city }}</p>
                    <span class="status-mini">{{ distributor.status }}</span>
                  </div>
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
                  <div class="related-avatar">{{ manufacturer.name.charAt(0) }}</div>
                  <div class="related-content">
                    <h5>{{ manufacturer.name }}</h5>
                    <p>{{ manufacturer.city }}</p>
                    <span class="status-mini">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="customer-info">
        <div class="section-header">
          <h2>Partnership Information</h2>
          <div class="section-icon">📊</div>
        </div>
        
        <div class="info-cards-grid">
          <div class="info-card">
            <div class="info-icon">🆔</div>
            <div class="info-content">
              <label>Partnership ID</label>
              <span>{{ customerId }}</span>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">🏭</div>
            <div class="info-content">
              <label>Manufacturer</label>
              <span>{{ manufacturerData.name }}</span>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">🏪</div>
            <div class="info-content">
              <label>Distributor</label>
              <span>{{ distributorData.name }}</span>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">✅</div>
            <div class="info-content">
              <label>Status</label>
              <span class="status-registered">Registered Partnership</span>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">📦</div>
            <div class="info-content">
              <label>Category</label>
              <span>{{ distributorData.category }}</span>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">📅</div>
            <div class="info-content">
              <label>Partnership Date</label>
              <span>{{ formatDate(distributorData.registrationDate) }}</span>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">⏱️</div>
            <div class="info-content">
              <label>Days Active</label>
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
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>

        <div class="tab-content">
          <!-- Interactions History -->
          <div v-if="activeTab === 'interactions'" class="tab-panel">
            <div class="panel-header">
              <h3>Interaction History</h3>
              <div class="panel-stats">
                <span class="stat-badge">{{ interactions.length }} interactions</span>
              </div>
            </div>
            
            <div class="table-container">
              <div class="table-wrapper">
                <table class="modern-table">
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
                    <tr v-for="interaction in interactions" :key="interaction.id" class="table-row">
                      <td>
                        <span class="date-cell">{{ formatDate(interaction.dateInteracted) }}</span>
                      </td>
                      <td>
                        <div class="user-cell">
                          <div class="user-avatar">{{ interaction.interactedBy.charAt(0) }}</div>
                          <span class="user-name">{{ interaction.interactedBy }}</span>
                        </div>
                      </td>
                      <td>
                        <span :class="getModeClass(interaction.mode)" class="mode-badge">
                          {{ interaction.mode }}
                        </span>
                      </td>
                      <td>
                        <div class="notes-preview">{{ interaction.notes }}</div>
                      </td>
                      <td>
                        <span class="time-elapsed">{{ interaction.timeElapsed }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Agreement History -->
          <div v-if="activeTab === 'agreements'" class="tab-panel">
            <div class="panel-header">
              <h3>Agreement History</h3>
              <div class="panel-stats">
                <span class="stat-badge">v{{ agreement.version }}</span>
              </div>
            </div>
            
            <div class="agreement-card">
              <div class="agreement-header">
                <h4>Current Agreement</h4>
                <span :class="getAgreementStatusClass(agreement.status)" class="status-indicator">
                  {{ agreement.status }}
                </span>
              </div>
              
              <div class="agreement-meta">
                <div class="meta-grid">
                  <div class="meta-item">
                    <span class="meta-label">Parties</span>
                    <span class="meta-value">{{ manufacturerName }} ↔ {{ distributorName }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Version</span>
                    <span class="meta-value">{{ agreement.version }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Created</span>
                    <span class="meta-value">{{ formatDate(agreement.createdDate) }}</span>
                  </div>
                  <div class="meta-item" v-if="agreement.signedDate">
                    <span class="meta-label">Signed</span>
                    <span class="meta-value">{{ formatDate(agreement.signedDate) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="terms-section">
                <h5>Terms & Conditions</h5>
                <div class="terms-grid">
                  <div v-for="term in agreement.terms" :key="term.id" class="term-card">
                    <div class="term-clause">{{ term.clause }}</div>
                    <div class="term-response">{{ term.response }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Invoice History -->
          <div v-if="activeTab === 'invoices'" class="tab-panel">
            <div class="panel-header">
              <h3>Invoice History</h3>
              <div class="invoice-filters">
                <select v-model="invoiceFilter" @change="filterInvoices" class="modern-select">
                  <option value="all">All Invoices</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="month">This Month</option>
                  <option value="lastmonth">Last Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
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
                      <th>Status</th>
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
                      <td>
                        <span class="status-completed">Completed</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div v-if="activeTab === 'summary'" class="tab-panel">
            <div class="panel-header">
              <h3>Partnership Summary</h3>
              <div class="panel-stats">
                <span class="stat-badge">{{ distributorData.daysSinceStatus }} days active</span>
              </div>
            </div>
            
            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-icon">💬</div>
                <div class="summary-content">
                  <h4>Total Interactions</h4>
                  <p class="summary-value">{{ interactions.length }}</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">📄</div>
                <div class="summary-content">
                  <h4>Total Invoices</h4>
                  <p class="summary-value">{{ invoices.length }}</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">💰</div>
                <div class="summary-content">
                  <h4>Total Business Value</h4>
                  <p class="summary-value">₹{{ totalAmount.toLocaleString() }}</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">💸</div>
                <div class="summary-content">
                  <h4>Total Commission</h4>
                  <p class="summary-value">₹{{ totalCommission.toLocaleString() }}</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">⏱️</div>
                <div class="summary-content">
                  <h4>Partnership Duration</h4>
                  <p class="summary-value">{{ distributorData.daysSinceStatus }} days</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">📋</div>
                <div class="summary-content">
                  <h4>Agreement Status</h4>
                  <p class="summary-value">{{ agreement.status }}</p>
                </div>
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

const isManufacturerView = computed(() => {
  return mockManufacturers.some(m => m.id === props.id);
});

const manufacturerName = computed(() => manufacturerData.value.name);

const relatedDistributors = computed(() => {
  return mockDistributors.filter(d => 
    d.id !== props.id && 
    d.category === distributorData.value.category
  ).slice(0, 4);
});

const relatedManufacturers = computed(() => {
  return mockManufacturers.filter(m => 
    m.id !== manufacturerData.value.id && 
    m.category === distributorData.value.category
  ).slice(0, 4);
});

const tabs = [
  { id: 'interactions', label: 'Interactions', icon: '💬' },
  { id: 'agreements', label: 'Agreements', icon: '📋' },
  { id: 'invoices', label: 'Invoices', icon: '📄' },
  { id: 'summary', label: 'Summary', icon: '📊' }
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
.view-only-page {
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

.status-view {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.selected-entity {
  border: 2px solid #1c1c1e !important;
  box-shadow: 0 0 0 2px rgba(28, 28, 30, 0.2);
}

.relationship-web,
.customer-info,
.history-section {
  background: white;
  border: 1px solid #d2d2d7;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
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

.web-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.relationship-map {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 32px;
  background: #fafafa;
  border-radius: 16px;
  border: 1px solid #f2f2f7;
}

.entity-node {
  background: white;
  border: 2px solid #f2f2f7;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.manufacturer-node {
  border-color: #3b82f6;
}

.distributor-node {
  border-color: #f59e0b;
}

.node-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f5f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 8px;
}

.node-content h4 {
  color: #1d1d1f;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.node-content p {
  color: #86868b;
  font-size: 14px;
  margin: 0 0 4px 0;
}

.entity-type {
  background: #f5f5f7;
  color: #1d1d1f;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  gap: 8px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #f2f2f7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.status-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.status-indicator.registered {
  background: #30d158;
}

.connection-label {
  color: #1d1d1f;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.connection-metrics .metric {
  color: #86868b;
  font-size: 11px;
  font-weight: 500;
}

.related-entities {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.related-section h3 {
  color: #1d1d1f;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.related-entity {
  background: #fafafa;
  border: 1px solid #f2f2f7;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.related-entity:hover {
  background: #f5f5f7;
  transform: translateY(-2px);
}

.related-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1c1c1e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.related-content h5 {
  color: #1d1d1f;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.related-content p {
  color: #86868b;
  font-size: 12px;
  margin: 0 0 6px 0;
}

.status-mini {
  background: #f2f2f7;
  color: #86868b;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.related-lead .status-mini {
  background: #fff3cd;
  color: #856404;
}

.related-prospect .status-mini {
  background: #e8f4fd;
  color: #1e40af;
}

.related-customer .status-mini {
  background: #d1fae5;
  color: #065f46;
}

.manufacturer-related {
  border-color: #3b82f6;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-card {
  background: #fafafa;
  border: 1px solid #f2f2f7;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-icon {
  font-size: 24px;
  opacity: 0.7;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-content label {
  font-weight: 600;
  color: #86868b;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-content span {
  color: #1d1d1f;
  font-size: 14px;
  font-weight: 500;
}

.status-registered {
  background: #d1fae5;
  color: #065f46;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.history-tabs {
  display: flex;
  background: #fafafa;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
}

.tab-button {
  flex: 1;
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #86868b;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-button:hover {
  color: #1d1d1f;
  background: #f5f5f7;
}

.tab-button.active {
  color: #1d1d1f;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.tab-icon {
  font-size: 16px;
}

.tab-content {
  min-height: 400px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h3 {
  color: #1d1d1f;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.panel-stats {
  display: flex;
  gap: 8px;
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
  padding: 12px 16px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f2f2f7;
  white-space: nowrap;
}

.modern-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f8f8f8;
  color: #1d1d1f;
  font-size: 14px;
  vertical-align: middle;
}

.table-row:hover {
  background: #fafafa;
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

.mode-badge {
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

.notes-preview {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #86868b;
  font-style: italic;
}

.agreement-card {
  background: #fafafa;
  border: 1px solid #f2f2f7;
  border-radius: 12px;
  padding: 20px;
}

.agreement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.agreement-header h4 {
  color: #1d1d1f;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.status-indicator {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

.agreement-meta {
  margin-bottom: 20px;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-weight: 600;
  color: #86868b;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  color: #1d1d1f;
  font-weight: 500;
  font-size: 14px;
}

.terms-section h5 {
  color: #1d1d1f;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.term-card {
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f2f2f7;
}

.term-clause {
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 4px;
  font-size: 13px;
}

.term-response {
  color: #86868b;
  font-size: 12px;
}

.invoice-filters {
  display: flex;
  align-items: center;
}

.modern-select {
  padding: 6px 12px;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 12px;
  color: #1d1d1f;
  background: white;
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

.status-completed {
  background: #d1fae5;
  color: #065f46;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.summary-card {
  background: #fafafa;
  border: 1px solid #f2f2f7;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.summary-icon {
  font-size: 32px;
  opacity: 0.7;
}

.summary-content h4 {
  color: #86868b;
  font-size: 12px;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  color: #1d1d1f;
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
  
  .info-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .history-tabs {
    flex-direction: column;
    gap: 4px;
  }
  
  .tab-button {
    justify-content: flex-start;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .summary-grid {
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
  
  .meta-grid {
    grid-template-columns: 1fr;
  }
  
  .terms-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .relationship-web,
  .customer-info,
  .history-section {
    padding: 16px;
  }
  
  .entity-node {
    padding: 16px;
    min-width: 150px;
  }
  
  .node-avatar {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
  
  .related-entity {
    padding: 12px;
  }
  
  .related-avatar {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
  
  .info-card {
    padding: 16px;
  }
  
  .summary-card {
    padding: 16px;
  }
  
  .summary-icon {
    font-size: 24px;
  }
}
</style>