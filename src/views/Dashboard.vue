<template>
  <div class="dashboard">
    <!-- Floating Back Button -->
    <div class="floating-back-button" v-if="selectedEntityItem">
      <button class="btn-floating-back" @click="clearSelection">
        ← Back to Selection
      </button>
    </div>

    <div class="page-header">
      <h1>Manufacturer-Distributor Management</h1>
      <p>Manage your business relationships and workflow processes</p>
    </div>

    <FilterControls 
      :selectedEntity="selectedEntity"
      :filters="filters"
      @update:selectedEntity="onEntityChange"
      @update:filters="Object.assign(filters, $event)"
      @entity-change="onEntityChange"
      @filter-change="onFilterChange"
      @clear-filters="clearAllFilters"
      @location-filter-change="onLocationFilterChange"
      @category-filter-change="onCategoryFilterChange"
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
          <p>{{ selectedEntityItem.category }} - {{ selectedEntityItem.subCategory }}</p>
          <span v-if="'status' in selectedEntityItem" :class="getStatusClass(selectedEntityItem.status)">
            {{ selectedEntityItem.status }}
          </span>
        </div>
      </div>

      <!-- Filters for Associated Entities -->
      <div class="associated-filters">
        <h3>Filter {{ selectedEntity === 'manufacturer' ? 'Distributors' : 'Manufacturers' }}</h3>
        <div class="filters-grid associated-grid">
          <div class="filter-group">
            <label>State</label>
            <div class="multiselect-container">
              <select 
                multiple 
                :value="associatedFilters.state" 
                @change="onAssociatedLocationFilterChange('state', Array.from($event.target.selectedOptions).map(option => option.value))"
                class="multiselect associated-multiselect"
              >
                <option v-for="state in filterOptions.states" :key="state" :value="state">
                  {{ state }}
                </option>
              </select>
              <div class="selected-tags" v-if="associatedFilters.state.length">
                <span v-for="state in associatedFilters.state" :key="state" class="tag">
                  {{ state }}
                  <button @click="removeAssociatedFilter('state', state)" class="tag-remove">×</button>
                </span>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label>District</label>
            <div class="multiselect-container">
              <select 
                multiple 
                :value="associatedFilters.district" 
                @change="onAssociatedLocationFilterChange('district', Array.from($event.target.selectedOptions).map(option => option.value))"
                class="multiselect associated-multiselect"
              >
                <option v-for="district in filterOptions.districts" :key="district" :value="district">
                  {{ district }}
                </option>
              </select>
              <div class="selected-tags" v-if="associatedFilters.district.length">
                <span v-for="district in associatedFilters.district" :key="district" class="tag">
                  {{ district }}
                  <button @click="removeAssociatedFilter('district', district)" class="tag-remove">×</button>
                </span>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label>City</label>
            <div class="multiselect-container">
              <select 
                multiple 
                :value="associatedFilters.city" 
                @change="onAssociatedLocationFilterChange('city', Array.from($event.target.selectedOptions).map(option => option.value))"
                class="multiselect associated-multiselect"
              >
                <option v-for="city in filterOptions.cities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
              <div class="selected-tags" v-if="associatedFilters.city.length">
                <span v-for="city in associatedFilters.city" :key="city" class="tag">
                  {{ city }}
                  <button @click="removeAssociatedFilter('city', city)" class="tag-remove">×</button>
                </span>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label>Category</label>
            <div class="multiselect-container">
              <select 
                multiple 
                :value="associatedFilters.category" 
                @change="onAssociatedCategoryFilterChange('category', Array.from($event.target.selectedOptions).map(option => option.value))"
                class="multiselect associated-multiselect"
              >
                <option v-for="category in filterOptions.categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <div class="selected-tags" v-if="associatedFilters.category.length">
                <span v-for="category in associatedFilters.category" :key="category" class="tag">
                  {{ category }}
                  <button @click="removeAssociatedFilter('category', category)" class="tag-remove">×</button>
                </span>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label>Sub Category</label>
            <div class="multiselect-container">
              <select 
                multiple 
                :value="associatedFilters.subCategory" 
                @change="onAssociatedCategoryFilterChange('subCategory', Array.from($event.target.selectedOptions).map(option => option.value))"
                class="multiselect associated-multiselect"
              >
                <option v-for="subCategory in filterOptions.subCategories" :key="subCategory" :value="subCategory">
                  {{ subCategory }}
                </option>
              </select>
              <div class="selected-tags" v-if="associatedFilters.subCategory.length">
                <span v-for="subCategory in associatedFilters.subCategory" :key="subCategory" class="tag">
                  {{ subCategory }}
                  <button @click="removeAssociatedFilter('subCategory', subCategory)" class="tag-remove">×</button>
                </span>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label>Status</label>
            <div class="multiselect-container">
              <select 
                multiple 
                :value="associatedFilters.status" 
                @change="associatedFilters.status = Array.from($event.target.selectedOptions).map(option => option.value); onAssociatedFilterChange()"
                class="multiselect associated-multiselect"
              >
                <option v-for="status in filterOptions.statuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
              <div class="selected-tags" v-if="associatedFilters.status.length">
                <span v-for="status in associatedFilters.status" :key="status" class="tag">
                  {{ status }}
                  <button @click="removeAssociatedFilter('status', status)" class="tag-remove">×</button>
                </span>
              </div>
            </div>
          </div>

          <div class="filter-actions">
            <button type="button" class="btn-secondary" @click="clearAssociatedFilters">
              Clear All Filters
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBusinessLogic } from '../composables/useBusinessLogic';
import FilterControls from '../components/FilterControls.vue';
import DataTable from '../components/DataTable.vue';
import { filterOptions } from '../data/mockData';
import type { Manufacturer, Distributor } from '../types';

const router = useRouter();
const {
  selectedEntity,
  selectedEntityId,
  selectedManufacturer,
  selectedDistributor,
  filters,
  associatedFilters,
  filteredManufacturers,
  filteredDistributors,
  clearFilters,
  clearAssociatedFilters,
  updateLocationFilters,
  updateCategoryFilters,
  setSelectedEntity,
  setSelectedEntityId,
  setSelectedManufacturer,
  setSelectedDistributor,
  persistState
} = useBusinessLogic();

const selectedEntityItem = ref<Manufacturer | Distributor | null>(null);

const currentEntityList = computed(() => {
  return selectedEntity.value === 'manufacturer' ? filteredManufacturers.value : filteredDistributors.value;
});

const pairedList = computed(() => {
  if (!selectedEntityItem.value) return [];
  
  if (selectedEntity.value === 'manufacturer') {
    // Show distributors that match the manufacturer's category and subCategory
    return filteredDistributors.value.filter(distributor => {
      const categoryMatch = distributor.category === selectedEntityItem.value?.category;
      const subCategoryMatch = distributor.subCategory === selectedEntityItem.value?.subCategory;
      return categoryMatch && subCategoryMatch;
    });
  } else {
    // Show manufacturers that match the distributor's category and subCategory
    return filteredManufacturers.value.filter(manufacturer => {
      const categoryMatch = manufacturer.category === selectedEntityItem.value?.category;
      const subCategoryMatch = manufacturer.subCategory === selectedEntityItem.value?.subCategory;
      return categoryMatch && subCategoryMatch;
    });
  }
});

const filteredPairedList = computed(() => {
  let filtered = pairedList.value;

  // Apply associated filters
  if (associatedFilters.city.length) {
    filtered = filtered.filter(item => associatedFilters.city.includes(item.city));
  }
  if (associatedFilters.district.length) {
    filtered = filtered.filter(item => associatedFilters.district.includes(item.district));
  }
  if (associatedFilters.state.length) {
    filtered = filtered.filter(item => associatedFilters.state.includes(item.state));
  }
  if (associatedFilters.category.length) {
    filtered = filtered.filter(item => associatedFilters.category.includes(item.category));
  }
  if (associatedFilters.subCategory.length) {
    filtered = filtered.filter(item => associatedFilters.subCategory.includes(item.subCategory));
  }
  if (associatedFilters.status.length && filtered.length > 0 && 'status' in filtered[0]) {
    filtered = filtered.filter(item => 'status' in item && associatedFilters.status.includes(item.status));
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
    { key: 'category', label: 'Category' },
    { key: 'subCategory', label: 'Sub Category' }
  ];

  // Both manufacturers and distributors now have status
  return [
    ...baseColumns,
    { key: 'status', label: 'Status' },
    { key: 'daysSinceStatus', label: 'Days Since Status' },
    { key: 'registrationDate', label: 'Registration Date' },
    { key: 'action', label: 'Action' }
  ];
});

// Load selected entity from storage on mount
onMounted(() => {
  if (selectedEntityId.value) {
    const entity = currentEntityList.value.find(e => e.id === selectedEntityId.value);
    if (entity) {
      selectedEntityItem.value = entity;
      if (selectedEntity.value === 'manufacturer') {
        setSelectedManufacturer(entity as Manufacturer);
      } else {
        setSelectedDistributor(entity as Distributor);
      }
    }
  }
});

// Watch for changes in currentEntityList to update selectedEntityItem
watch(currentEntityList, (newList) => {
  if (selectedEntityId.value) {
    const entity = newList.find(e => e.id === selectedEntityId.value);
    if (entity) {
      selectedEntityItem.value = entity;
    } else {
      // Entity no longer in filtered list, clear selection
      clearSelection();
    }
  }
}, { immediate: true });

const onEntitySelect = () => {
  if (selectedEntityId.value) {
    const entity = currentEntityList.value.find(e => e.id === selectedEntityId.value);
    selectedEntityItem.value = entity || null;
    
    if (entity) {
      if (selectedEntity.value === 'manufacturer') {
        setSelectedManufacturer(entity as Manufacturer);
      } else {
        setSelectedDistributor(entity as Distributor);
      }
    }
    
    clearAssociatedFilters();
    setSelectedEntityId(selectedEntityId.value);
  } else {
    selectedEntityItem.value = null;
    setSelectedManufacturer(null);
    setSelectedDistributor(null);
    setSelectedEntityId('');
  }
};

const clearSelection = () => {
  selectedEntityId.value = '';
  selectedEntityItem.value = null;
  setSelectedManufacturer(null);
  setSelectedDistributor(null);
  setSelectedEntityId('');
  clearAssociatedFilters();
};

const onEntityChange = (newEntity?: 'manufacturer' | 'distributor') => {
  if (newEntity) {
    setSelectedEntity(newEntity);
  }
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
  persistState();
};

const onLocationFilterChange = (type: 'city' | 'district' | 'state', values: string[]) => {
  updateLocationFilters(type, values, false);
};

const onCategoryFilterChange = (type: 'category' | 'subCategory', values: string[]) => {
  updateCategoryFilters(type, values, false);
};

const onAssociatedLocationFilterChange = (type: 'city' | 'district' | 'state', values: string[]) => {
  updateLocationFilters(type, values, true);
};

const onAssociatedCategoryFilterChange = (type: 'category' | 'subCategory', values: string[]) => {
  updateCategoryFilters(type, values, true);
};

const removeAssociatedFilter = (type: string, value: string) => {
  const currentValues = associatedFilters[type as keyof typeof associatedFilters] as string[];
  const newValues = currentValues.filter(v => v !== value);
  
  if (type === 'city' || type === 'district' || type === 'state') {
    updateLocationFilters(type as 'city' | 'district' | 'state', newValues, true);
  } else if (type === 'category' || type === 'subCategory') {
    updateCategoryFilters(type as 'category' | 'subCategory', newValues, true);
  } else {
    associatedFilters[type as keyof typeof associatedFilters] = newValues;
  }
  
  persistState();
};

const onAssociatedFilterChange = () => {
  persistState();
};
const clearAllFilters = () => {
  clearFilters();
  clearAssociatedFilters();
};

const handleActionClick = (row: any) => {
  const routeName = getRouteNameFromStatus(row.status);
  if (routeName) {
    router.push({ name: routeName, params: { id: row.id } });
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
.floating-back-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.btn-floating-back {
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
  transition: all 0.3s ease;
  letter-spacing: 0.025em;
}

.btn-floating-back:hover {
  background: linear-gradient(135deg, #0052a3 0%, #003366 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
}

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
  letter-spacing: -0.025em;
}

.page-header p {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

.entity-selection {
  margin-bottom: 30px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.entity-selection h3 {
  color: #374151;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  letter-spacing: -0.025em;
}

.entity-dropdown {
  max-width: 500px;
}

.entity-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  color: #374151;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.entity-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #0066cc;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
}

.entity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.entity-card h4 {
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.025em;
}

.btn-change {
  background: #6b7280;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-change:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.entity-card p {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 6px 0;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 12px;
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
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.associated-filters h3 {
  color: #374151;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  letter-spacing: -0.025em;
}

.associated-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  letter-spacing: -0.025em;
  min-height: 20px;
  display: flex;
  align-items: center;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  transition: all 0.2s ease;
}

.filter-group select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.multiselect-container {
  position: relative;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.multiselect {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  width: 100%;
  height: 80px;
  min-height: 80px;
  max-height: 80px;
  overflow-y: auto;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.multiselect:focus {
  outline: none;
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
}

.multiselect option {
  padding: 8px;
  border-radius: 4px;
  margin: 2px 0;
  color: #374151;
}

.multiselect option:checked {
  background: #6b7280;
  color: white;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  min-height: 40px;
  padding: 4px 0;
  flex: 1;
  align-content: flex-start;
}

.tag {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #d1d5db;
  white-space: nowrap;
  height: fit-content;
}

.tag-remove {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.tag-remove:hover {
  background: #6b7280;
  color: white;
}

.filter-actions {
  display: flex;
  align-items: end;
}

.btn-secondary {
  padding: 8px 16px;
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  height: fit-content;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-1px);
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
  
  .multiselect-container {
    min-height: 120px;
  }
  
  .multiselect {
    height: 60px;
    min-height: 60px;
    max-height: 60px;
  }
}
</style>