<template>
  <div class="dashboard">
    <!-- Floating Back Button -->
    <div class="floating-back-button" v-if="selectedEntityItem">
      <button class="btn-floating-back" @click="clearSelection">← Back to Selection</button>
    </div>

    <div class="page-header">
      <h1>Manufacturer-Distributor Management</h1>
      <p>Manage your business relationships and workflow processes</p>
    </div>

    <!-- Main Entity Type Selection -->
    <div class="entity-type-selection">
      <button 
        class="entity-type-btn"
        :class="{ active: selectedEntity === 'manufacturer' }"
        @click="onEntityChange('manufacturer')"
      >
        Manufacturers
      </button>
      <button 
        class="entity-type-btn"
        :class="{ active: selectedEntity === 'distributor' }"
        @click="onEntityChange('distributor')"
      >
        Distributors
      </button>
    </div>

    <!-- Main Filters (shown when no entity selected) -->
    <div class="main-filters" v-if="!selectedEntityItem">
      <FilterSection title="Geography" :isOpen="true">
        <div class="filter-group">
          <label>State</label>
          <MultiSelectDropdown 
            :options="filterOptions.states"
            :selected="filters.state"
            @update:selected="(val) => onFilterChange({ state: val })"
          />
        </div>
        <div class="filter-group">
          <label>District</label>
          <MultiSelectDropdown 
            :options="filterOptions.districts"
            :selected="filters.district"
            @update:selected="(val) => onFilterChange({ district: val })"
          />
        </div>
        <div class="filter-group">
          <label>City</label>
          <MultiSelectDropdown 
            :options="filterOptions.cities"
            :selected="filters.city"
            @update:selected="(val) => onFilterChange({ city: val })"
          />
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div class="filter-group">
          <label>Category</label>
          <MultiSelectDropdown 
            :options="filterOptions.categories"
            :selected="filters.category"
            @update:selected="(val) => onFilterChange({ category: val })"
          />
        </div>
        <div class="filter-group">
          <label>Sub-Category</label>
          <MultiSelectDropdown 
            :options="filterOptions.subCategories"
            :selected="filters.subCategory"
            @update:selected="(val) => onFilterChange({ subCategory: val })"
          />
        </div>
      </FilterSection>

      <FilterSection title="Status">
        <div class="filter-group">
          <label>Status</label>
          <MultiSelectDropdown 
            :options="filterOptions.statuses"
            :selected="filters.status"
            @update:selected="(val) => onFilterChange({ status: val })"
          />
        </div>
      </FilterSection>

      <div class="filter-actions">
        <button class="btn-clear" @click="clearAllFilters">Clear All Filters</button>
      </div>
    </div>

    <!-- Entity Selection -->
    <div class="entity-selection" v-if="!selectedEntityItem">
      <h3>Select {{ selectedEntity === 'manufacturer' ? 'Manufacturer' : 'Distributor' }}</h3>
      <div class="entity-dropdown">
        <select v-model="selectedEntityId" @change="onEntitySelect" class="entity-select">
          <option value="">Choose {{ selectedEntity === 'manufacturer' ? 'a Manufacturer' : 'a Distributor' }}</option>
          <option v-for="entity in currentEntityList" :key="entity.id" :value="entity.id">
            {{ entity.name }} - {{ entity.city }}, {{ entity.state }}
          </option>
        </select>
      </div>
    </div>

    <!-- Selected Entity Display -->
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
        
        <FilterSection title="Geography" :isOpen="true">
          <div class="filter-group">
            <label>State</label>
            <MultiSelectDropdown 
              :options="filterOptions.states"
              :selected="associatedFilters.state"
              @update:selected="(val) => onAssociatedFilterChange('state', val)"
            />
          </div>
          <div class="filter-group">
            <label>District</label>
            <MultiSelectDropdown 
              :options="filterOptions.districts"
              :selected="associatedFilters.district"
              @update:selected="(val) => onAssociatedFilterChange('district', val)"
            />
          </div>
          <div class="filter-group">
            <label>City</label>
            <MultiSelectDropdown 
              :options="filterOptions.cities"
              :selected="associatedFilters.city"
              @update:selected="(val) => onAssociatedFilterChange('city', val)"
            />
          </div>
        </FilterSection>

        <FilterSection title="Category">
          <div class="filter-group">
            <label>Category</label>
            <MultiSelectDropdown 
              :options="filterOptions.categories"
              :selected="associatedFilters.category"
              @update:selected="(val) => onAssociatedFilterChange('category', val)"
            />
          </div>
          <div class="filter-group">
            <label>Sub-Category</label>
            <MultiSelectDropdown 
              :options="filterOptions.subCategories"
              :selected="associatedFilters.subCategory"
              @update:selected="(val) => onAssociatedFilterChange('subCategory', val)"
            />
          </div>
        </FilterSection>

        <FilterSection title="Status">
          <div class="filter-group">
            <label>Status</label>
            <MultiSelectDropdown 
              :options="filterOptions.statuses"
              :selected="associatedFilters.status"
              @update:selected="(val) => onAssociatedFilterChange('status', val)"
            />
          </div>
        </FilterSection>

        <div class="filter-actions">
          <button class="btn-clear" @click="clearAssociatedFilters">Clear All Filters</button>
        </div>
      </div>

      <!-- Data Table -->
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

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from './DataTable.vue'
import FilterSection from './FilterSection.vue'
import MultiSelectDropdown from './MultiSelectDropdown.vue'
import { filterOptions } from '../data/mockData'

export default {
  components: {
    DataTable,
    FilterSection,
    MultiSelectDropdown
  },
  setup() {
    const router = useRouter()
    
    // Reactive state
    const selectedEntity = ref('manufacturer')
    const selectedEntityId = ref('')
    const selectedEntityItem = ref(null)
    
    // Filters
    const filters = ref({
      state: [],
      district: [],
      city: [],
      category: [],
      subCategory: [],
      status: []
    })
    
    const associatedFilters = ref({
      state: [],
      district: [],
      city: [],
      category: [],
      subCategory: [],
      status: []
    })

    // Mock data - in a real app, this would come from an API
    const manufacturers = ref([
      { id: 'm1', name: 'ABC Manufacturing', city: 'Mumbai', state: 'Maharashtra', 
        district: 'Mumbai City', category: 'Electronics', subCategory: 'Consumer', 
        status: 'Customer', daysSinceStatus: 45, registrationDate: '2022-01-15' },
      // Add more manufacturers...
    ])
    
    const distributors = ref([
      { id: 'd1', name: 'XYZ Distributors', city: 'Delhi', state: 'Delhi',
        district: 'Central Delhi', category: 'Electronics', subCategory: 'Consumer',
        status: 'Lead', daysSinceStatus: 10, registrationDate: '2023-03-20' },
      // Add more distributors...
    ])

    // Computed properties
    const currentEntityList = computed(() => {
      return selectedEntity.value === 'manufacturer' 
        ? filteredManufacturers.value 
        : filteredDistributors.value
    })
    
    const filteredManufacturers = computed(() => {
      return applyFilters(manufacturers.value, filters.value)
    })
    
    const filteredDistributors = computed(() => {
      return applyFilters(distributors.value, filters.value)
    })
    
    const pairedList = computed(() => {
      if (!selectedEntityItem.value) return []
      
      const list = selectedEntity.value === 'manufacturer' 
        ? filteredDistributors.value 
        : filteredManufacturers.value
        
      return list.filter(item =>
        item.category === selectedEntityItem.value?.category &&
        item.subCategory === selectedEntityItem.value?.subCategory
      )
    })
    
    const filteredPairedList = computed(() => {
      return applyFilters(pairedList.value, associatedFilters.value)
    })
    
    const tableTitle = computed(() => {
      if (!selectedEntityItem.value) return ''
      return `Associated ${selectedEntity.value === 'manufacturer' ? 'Distributors' : 'Manufacturers'} for ${selectedEntityItem.value.name}`
    })
    
    const tableColumns = computed(() => [
      { key: 'serialNumber', label: 'Sl. No' },
      { key: 'name', label: 'Name' },
      { key: 'city', label: 'City' },
      { key: 'district', label: 'District' },
      { key: 'state', label: 'State' },
      { key: 'category', label: 'Category' },
      { key: 'subCategory', label: 'Sub Category' },
      { key: 'status', label: 'Status' },
      { key: 'daysSinceStatus', label: 'Days Since Status' },
      { key: 'registrationDate', label: 'Registration Date' },
      { key: 'action', label: 'Action' }
    ])

    // Methods
    const applyFilters = (items, filters) => {
      return items.filter(item => {
        return Object.entries(filters).every(([key, values]) => {
          if (!values || values.length === 0) return true
          return values.includes(item[key])
        })
      })
    }
    
    const onEntitySelect = () => {
      selectedEntityItem.value = currentEntityList.value.find(e => e.id === selectedEntityId.value) || null
      clearAssociatedFilters()
    }
    
    const clearSelection = () => {
      selectedEntityId.value = ''
      selectedEntityItem.value = null
      clearAssociatedFilters()
    }
    
    const onEntityChange = (newEntity) => {
      selectedEntity.value = newEntity
      clearSelection()
      clearAllFilters()
    }
    
    const onFilterChange = (updated) => {
      Object.assign(filters.value, updated)
      if (selectedEntityItem.value) {
        const exists = currentEntityList.value.some(e => e.id === selectedEntityItem.value?.id)
        if (!exists) clearSelection()
      }
    }
    
    const onAssociatedFilterChange = (type, values) => {
      associatedFilters.value[type] = values
    }
    
    const clearAllFilters = () => {
      filters.value = {
        state: [],
        district: [],
        city: [],
        category: [],
        subCategory: [],
        status: []
      }
    }
    
    const clearAssociatedFilters = () => {
      associatedFilters.value = {
        state: [],
        district: [],
        city: [],
        category: [],
        subCategory: [],
        status: []
      }
    }
    
    const handleActionClick = (row) => {
      const routeName = getRouteNameFromStatus(row.status)
      if (routeName) {
        router.push({ name: routeName, params: { id: row.id } })
      }
    }
    
    const getRouteNameFromStatus = (status) => {
      switch (status) {
        case 'Lead': return 'Lead'
        case 'Prospect': return 'Prospect'
        case 'Customer': return 'Customer'
        case 'View': return 'ViewOnly'
        default: return 'ViewOnly'
      }
    }
    
    const getStatusClass = (status) => {
      const base = 'status-badge'
      return `${base} ${{
        Lead: 'status-lead',
        Prospect: 'status-prospect',
        Customer: 'status-customer',
        View: 'status-view'
      }[status] || ''}`
    }

    // Lifecycle hooks
    onMounted(() => {
      if (selectedEntityId.value) {
        selectedEntityItem.value = currentEntityList.value.find(e => e.id === selectedEntityId.value) || null
      }
    })

    watch(selectedEntityId, (newId) => {
      selectedEntityItem.value = currentEntityList.value.find(e => e.id === newId) || null
    })

    return {
      selectedEntity,
      selectedEntityId,
      selectedEntityItem,
      filters,
      associatedFilters,
      filterOptions,
      currentEntityList,
      filteredPairedList,
      tableTitle,
      tableColumns,
      onEntitySelect,
      clearSelection,
      onEntityChange,
      onFilterChange,
      onAssociatedFilterChange,
      clearAllFilters,
      clearAssociatedFilters,
      handleActionClick,
      getStatusClass
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
  font-size: 16px;
}

.entity-type-selection {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.entity-type-btn {
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.entity-type-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.main-filters, .associated-filters {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filter-group {
  margin-bottom: 15px;
}

.filter-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.filter-actions {
  margin-top: 20px;
}

.btn-clear {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.btn-clear:hover {
  background: #e9ecef;
}

.entity-selection {
  margin-bottom: 30px;
}

.entity-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.selected-entity-section {
  margin-top: 20px;
}

.entity-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.entity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.btn-change {
  padding: 5px 10px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-lead {
  background: #ffc107;
  color: #212529;
}

.status-prospect {
  background: #17a2b8;
  color: white;
}

.status-customer {
  background: #28a745;
  color: white;
}

.status-view {
  background: #6c757d;
  color: white;
}

.floating-back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.btn-floating-back {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.table-summary {
  padding: 8px;
  font-size: 14px;
  color: #666;
}
</style>