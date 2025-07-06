<template>
  <div class="dashboard">
    <div class="page-header">
      <h1>Manufacturer-Distributor Management</h1>
      <p>Manage your business relationships and workflow processes</p>
    </div>

    <FilterControls 
      :selectedEntity="selectedEntity"
      :filters="filters"
      @update:selectedEntity="selectedEntity = $event"
      @update:filters="Object.assign(filters, $event)"
      @entity-change="onEntityChange"
      @filter-change="onFilterChange"
      @clear-filters="clearAllFilters"
    />

    <!-- Entity Selection Dropdown -->
    <div class="entity-selection" v-if="!selectedEntityItem">
      <h3>Select {{ selectedEntity === 'manufacturer' ? 'Manufacturer' : 'Distributor' }}</h3>
      <div class="entity-dropdown">
        <select v-model="selectedEntityId" @change="onEntitySelect" class="entity-select">
          <option value="">Choose {{ selectedEntity === 'manufacturer' ? 'a Manufacturer' : 'a Distributor' }}</option>
          <option 
            v-for="entity in currentEntityList" 
            :key="entity.id"
            :value="entity.id"
          >
            {{ entity.name }} - {{ entity.city }}, {{ entity.state }}
          </option>
        </select>
      </div>
    </div>

    <!-- Selected Entity Info and Associated List -->
    <div v-if="selectedEntityItem" class="selected-entity-section">
      <div class="selected-entity-info">
        <div class="entity-card selected">
          <div class="entity-header">
            <h4>{{ selectedEntityItem.name }}</h4>
            <button class="btn-change" @click="clearSelection">Change Selection</button>
          </div>
          <p>{{ selectedEntityItem.city }}, {{ selectedEntityItem.state }}</p>
          <p>{{ selectedEntityItem.industry }} - {{ selectedEntityItem.category }}</p>
          <span v-if="'status' in selectedEntityItem" :class="getStatusClass(selectedEntityItem.status)">
            {{ selectedEntityItem.status }}
          </span>
        </div>
      </div>

      <!-- Filters for Associated Entities -->
      <div class="associated-filters">
        <h3>Filter {{ selectedEntity === 'manufacturer' ? 'Distributors' : 'Manufacturers' }}</h3>
        <div class="filters-grid">
          <div class="filter-group">
            <label>State</label>
            <select v-model="associatedFilters.state" @change="onAssociatedFilterChange">
              <option value="">All States</option>
              <option v-for="state in filterOptions.states" :key="state" :value="state">
                {{ state }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>District</label>
            <select v-model="associatedFilters.district" @change="onAssociatedFilterChange">
              <option value="">All Districts</option>
              <option v-for="district in filterOptions.districts" :key="district" :value="district">
                {{ district }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>City</label>
            <select v-model="associatedFilters.city" @change="onAssociatedFilterChange">
              <option value="">All Cities</option>
              <option v-for="city in filterOptions.cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>

          <div class="filter-group" v-if="selectedEntity === 'manufacturer'">
            <label>Status</label>
            <select v-model="associatedFilters.status" @change="onAssociatedFilterChange">
              <option value="">All Status</option>
              <option v-for="status in filterOptions.statuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Industry</label>
            <select v-model="associatedFilters.industry" @change="onAssociatedFilterChange">
              <option value="">All Industries</option>
              <option v-for="industry in filterOptions.industries" :key="industry" :value="industry">
                {{ industry }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Category</label>
            <select v-model="associatedFilters.category" @change="onAssociatedFilterChange">
              <option value="">All Categories</option>
              <option v-for="category in filterOptions.categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div class="filter-actions">
            <button type="button" class="btn-secondary" @click="clearAssociatedFilters">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <DataTable
        :title="tableTitle"
        :columns="tableColumns"
        :data="filteredPairedList"
        @action-click="handleActionClick"
      >
        <template #actions>
          <div class="table-summary">
            <span>{{ filteredPairedList.length }} {{ selectedEntity === 'manufacturer' ? 'Distributors' : 'Manufacturers' }} found</span>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useBusinessLogic } from '../composables/useBusinessLogic';
import FilterControls from '../components/FilterControls.vue';
import DataTable from '../components/DataTable.vue';
import { filterOptions } from '../data/mockData';
import type { Manufacturer, Distributor } from '../types';

const router = useRouter();
const {
  selectedEntity,
  filters,
  filteredManufacturers,
  filteredDistributors,
  clearFilters
} = useBusinessLogic();

const selectedEntityId = ref<string>('');
const selectedEntityItem = ref<Manufacturer | Distributor | null>(null);

const associatedFilters = reactive({
  city: '',
  district: '',
  state: '',
  status: '',
  industry: '',
  category: ''
});

const currentEntityList = computed(() => {
  return selectedEntity.value === 'manufacturer' ? filteredManufacturers.value : filteredDistributors.value;
});

const pairedList = computed(() => {
  if (!selectedEntityItem.value) return [];
  
  if (selectedEntity.value === 'manufacturer') {
    // Show distributors that match the manufacturer's industry
    // For better matching, we'll match by industry and allow broader category matching
    return filteredDistributors.value.filter(distributor => {
      const industryMatch = distributor.industry === selectedEntityItem.value?.industry;
      
      // For automotive manufacturers with Heavy Machinery, match with:
      // - Heavy Machinery distributors (exact match)
      // - Distribution category (general automotive distribution)
      if (selectedEntityItem.value?.industry === 'Automotive') {
        const categoryMatch = 
          distributor.category === selectedEntityItem.value?.category || // Exact match
          distributor.category === 'Distribution' || // General distribution
          distributor.category.includes('Heavy'); // Contains "Heavy"
        return industryMatch && categoryMatch;
      }
      
      // For other industries, use more flexible matching
      const categoryMatch = 
        distributor.category === selectedEntityItem.value?.category ||
        distributor.category.includes(selectedEntityItem.value?.category.split(' ')[0] || '') ||
        selectedEntityItem.value?.category.includes(distributor.category.split(' ')[0] || '');
      
      return industryMatch && categoryMatch;
    });
  } else {
    // Show manufacturers that match the distributor's industry
    return filteredManufacturers.value.filter(manufacturer => {
      const industryMatch = manufacturer.industry === selectedEntityItem.value?.industry;
      
      // For automotive distributors, match with automotive manufacturers
      if (selectedEntityItem.value?.industry === 'Automotive') {
        // For Heavy Machinery distributors, match with Heavy Machinery manufacturers
        if ('category' in selectedEntityItem.value && selectedEntityItem.value.category === 'Heavy Machinery') {
          return industryMatch && manufacturer.category === 'Heavy Machinery';
        }
        // For Distribution category distributors, match with any automotive manufacturer
        return industryMatch;
      }
      
      // For other industries, use flexible matching
      const categoryMatch = 
        manufacturer.category === selectedEntityItem.value?.category ||
        manufacturer.category.includes(selectedEntityItem.value?.category.split(' ')[0] || '') ||
        selectedEntityItem.value?.category.includes(manufacturer.category.split(' ')[0] || '');
      
      return industryMatch && categoryMatch;
    });
  }
});

const filteredPairedList = computed(() => {
  let filtered = pairedList.value;

  // Apply associated filters
  if (associatedFilters.city) {
    filtered = filtered.filter(item => item.city === associatedFilters.city);
  }
  if (associatedFilters.district) {
    filtered = filtered.filter(item => item.district === associatedFilters.district);
  }
  if (associatedFilters.state) {
    filtered = filtered.filter(item => item.state === associatedFilters.state);
  }
  if (associatedFilters.industry) {
    filtered = filtered.filter(item => item.industry === associatedFilters.industry);
  }
  if (associatedFilters.category) {
    filtered = filtered.filter(item => item.category === associatedFilters.category);
  }
  if (associatedFilters.status && filtered.length > 0 && 'status' in filtered[0]) {
    filtered = filtered.filter(item => 'status' in item && item.status === associatedFilters.status);
  }

  return filtered;
});

const tableTitle = computed(() => {
  if (!selectedEntityItem.value) return '';
  
  if (selectedEntity.value === 'manufacturer') {
    return `Associated Distributors for ${selectedEntityItem.value.name}`;
  } else {
    return `Associated Manufacturers for ${selectedEntityItem.value.name}`;
  }
});

const tableColumns = computed(() => {
  const baseColumns = [
    { key: 'serialNumber', label: 'Sl. No' },
    { key: 'name', label: 'Name' },
    { key: 'city', label: 'City' },
    { key: 'district', label: 'District' },
    { key: 'state', label: 'State' },
    { key: 'industry', label: 'Industry' },
    { key: 'category', label: 'Category' }
  ];

  if (selectedEntity.value === 'manufacturer') {
    // When manufacturer is selected, show distributors with their status
    return [
      ...baseColumns,
      { key: 'status', label: 'Status' },
      { key: 'daysSinceStatus', label: 'Days Since Status' },
      { key: 'action', label: 'Action' }
    ];
  } else {
    // When distributor is selected, show manufacturers (no status for manufacturers)
    return [
      ...baseColumns,
      { key: 'registrationDate', label: 'Registration Date' },
      { key: 'action', label: 'Action' }
    ];
  }
});

const onEntitySelect = () => {
  if (selectedEntityId.value) {
    const entity = currentEntityList.value.find(e => e.id === selectedEntityId.value);
    selectedEntityItem.value = entity || null;
    clearAssociatedFilters();
  } else {
    selectedEntityItem.value = null;
  }
};

const clearSelection = () => {
  selectedEntityId.value = '';
  selectedEntityItem.value = null;
  clearAssociatedFilters();
};

const onEntityChange = () => {
  clearSelection();
  clearAllFilters();
};

const onFilterChange = () => {
  // If current selection is no longer in filtered list, clear it
  if (selectedEntityItem.value) {
    const stillExists = currentEntityList.value.some(e => e.id === selectedEntityItem.value?.id);
    if (!stillExists) {
      clearSelection();
    }
  }
};

const onAssociatedFilterChange = () => {
  // Filter change logic handled by computed property
};

const clearAllFilters = () => {
  clearFilters();
  clearAssociatedFilters();
};

const clearAssociatedFilters = () => {
  associatedFilters.city = '';
  associatedFilters.district = '';
  associatedFilters.state = '';
  associatedFilters.industry = '';
  associatedFilters.category = '';
  associatedFilters.status = '';
};

const handleActionClick = (row: any) => {
  if (selectedEntity.value === 'manufacturer') {
    // Clicked on a distributor, route based on distributor's status
    const routeName = getRouteNameFromStatus(row.status);
    if (routeName) {
      router.push({ name: routeName, params: { id: row.id } });
    }
  } else {
    // Clicked on a manufacturer from distributor view
    // For manufacturers, we'll treat them as having a "View" status by default
    // but we can also create prospect/customer relationships
    router.push({ name: 'ViewOnly', params: { id: row.id } });
  }
};

const getRouteNameFromStatus = (status: string) => {
  switch (status) {
    case 'Lead':
      return 'Lead';
    case 'Prospect':
      return 'Prospect';
    case 'Customer':
      return 'Customer';
    case 'View':
      return 'ViewOnly';
    default:
      return 'ViewOnly';
  }
};

const getStatusClass = (status: string) => {
  const baseClass = 'status-badge';
  if (status === 'Lead') return `${baseClass} status-lead`;
  if (status === 'Prospect') return `${baseClass} status-prospect`;
  if (status === 'Customer') return `${baseClass} status-customer`;
  if (status === 'View') return `${baseClass} status-view`;
  return baseClass;
};
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: #1f2937;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.page-header p {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

.entity-selection {
  margin-bottom: 30px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
}

.entity-selection h3 {
  color: #374151;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.entity-dropdown {
  max-width: 500px;
}

.entity-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  background: white;
  color: #374151;
}

.entity-select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.selected-entity-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.selected-entity-info {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
}

.entity-card {
  background: #f0f9ff;
  border: 2px solid #0066cc;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
}

.entity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.entity-card h4 {
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.btn-change {
  background: #6b7280;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
}

.btn-change:hover {
  background: #4b5563;
}

.entity-card p {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 5px 0;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 10px;
}

.status-lead {
  background: #fef3c7;
  color: #92400e;
}

.status-prospect {
  background: #dbeafe;
  color: #1e40af;
}

.status-customer {
  background: #d1fae5;
  color: #065f46;
}

.status-view {
  background: #f3f4f6;
  color: #374151;
}

.associated-filters {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 20px;
}

.associated-filters h3 {
  color: #374151;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.filter-group select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.filter-actions {
  display: flex;
  align-items: end;
}

.btn-secondary {
  padding: 8px 16px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  height: fit-content;
}

.btn-secondary:hover {
  background: #4b5563;
}

.table-summary {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 15px;
  }
  
  .entity-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .entity-card {
    max-width: 100%;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style>