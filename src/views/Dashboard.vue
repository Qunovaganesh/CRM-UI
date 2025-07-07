<template>
  <div class="dashboard">
    <div class="page-header">
      <h1>Manufacturer-Distributor Management</h1>
      <p>Manage your business relationships and workflow processes</p>
    </div>

    <!-- Modern Entity Type Selection -->
    <div class="entity-type-selection">
      <div class="entity-toggle-container">
        <button 
          class="entity-toggle-btn"
          :class="{ active: selectedEntity === 'manufacturer' }"
          @click="onEntityChange('manufacturer')"
        >
          <span class="entity-icon">🏭</span>
          <span>Manufacturers</span>
          <span class="entity-count">{{ manufacturers.length }}</span>
        </button>
        <button 
          class="entity-toggle-btn"
          :class="{ active: selectedEntity === 'distributor' }"
          @click="onEntityChange('distributor')"
        >
          <span class="entity-icon">🏪</span>
          <span>Distributors</span>
          <span class="entity-count">{{ distributors.length }}</span>
        </button>
      </div>
    </div>

    <!-- Modern Filters (shown when no entity selected) -->
    <div class="modern-filters" v-if="!selectedEntityItem">
      <div class="filters-header">
        <h3>Filter {{ selectedEntity === 'manufacturer' ? 'Manufacturers' : 'Distributors' }}</h3>
        <button class="btn-clear-all" @click="clearAllFilters" v-if="hasActiveFilters">
          <span>✕</span> Clear All
        </button>
      </div>

      <div class="filters-grid">
        <!-- Geography Section -->
        <div class="filter-card">
          <div class="filter-card-header">
            <span class="filter-icon">🌍</span>
            <h4>Geography</h4>
          </div>
          <div class="filter-card-content">
            <div class="filter-row">
              <label>State</label>
              <ModernMultiSelect 
                :options="availableStates"
                :selected="filters.state"
                placeholder="Select states..."
                @update:selected="(val) => updateLocationFilters('state', val)"
              />
            </div>
            <div class="filter-row">
              <label>District</label>
              <ModernMultiSelect 
                :options="availableDistricts"
                :selected="filters.district"
                placeholder="Select districts..."
                @update:selected="(val) => updateLocationFilters('district', val)"
              />
            </div>
            <div class="filter-row">
              <label>City</label>
              <ModernMultiSelect 
                :options="availableCities"
                :selected="filters.city"
                placeholder="Select cities..."
                @update:selected="(val) => updateLocationFilters('city', val)"
              />
            </div>
          </div>
        </div>

        <!-- Category Section -->
        <div class="filter-card">
          <div class="filter-card-header">
            <span class="filter-icon">📦</span>
            <h4>Category</h4>
          </div>
          <div class="filter-card-content">
            <div class="filter-row">
              <label>Category</label>
              <ModernMultiSelect 
                :options="availableCategories"
                :selected="filters.category"
                placeholder="Select categories..."
                @update:selected="(val) => updateCategoryFilters('category', val)"
              />
            </div>
            <div class="filter-row">
              <label>Sub Category</label>
              <ModernMultiSelect 
                :options="availableSubCategories"
                :selected="filters.subCategory"
                placeholder="Select sub-categories..."
                @update:selected="(val) => updateCategoryFilters('subCategory', val)"
              />
            </div>
          </div>
        </div>

        <!-- Status Section -->
        <div class="filter-card">
          <div class="filter-card-header">
            <span class="filter-icon">📊</span>
            <h4>Status</h4>
          </div>
          <div class="filter-card-content">
            <div class="filter-row">
              <label>Status</label>
              <ModernMultiSelect 
                :options="filterOptions.statuses"
                :selected="filters.status"
                placeholder="Select statuses..."
                @update:selected="(val) => onFilterChange({ status: val })"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div class="active-filters" v-if="hasActiveFilters">
        <h4>Active Filters:</h4>
        <div class="filter-tags">
          <div v-for="(values, key) in activeFilterTags" :key="key" class="filter-tag-group">
            <span class="filter-tag-label">{{ getFilterLabel(key) }}:</span>
            <span 
              v-for="value in values" 
              :key="value" 
              class="filter-tag"
            >
              {{ value }}
              <button @click="removeFilterValue(key, value)" class="tag-remove">×</button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Entity Selection -->
    <div class="entity-selection" v-if="!selectedEntityItem">
      <div class="selection-card">
        <h3>
          <span class="selection-icon">{{ selectedEntity === 'manufacturer' ? '🏭' : '🏪' }}</span>
          Select {{ selectedEntity === 'manufacturer' ? 'Manufacturer' : 'Distributor' }}
        </h3>
        <div class="entity-dropdown-container">
          <select v-model="selectedEntityId" @change="onEntitySelect" class="modern-select">
            <option value="">Choose {{ selectedEntity === 'manufacturer' ? 'a Manufacturer' : 'a Distributor' }}</option>
            <option v-for="entity in currentEntityList" :key="entity.id" :value="entity.id">
              {{ entity.name }} - {{ entity.city }}, {{ entity.state }} ({{ entity.category }})
            </option>
          </select>
          <div class="selection-stats">
            <span class="stat-item">
              <strong>{{ currentEntityList.length }}</strong> {{ selectedEntity === 'manufacturer' ? 'manufacturers' : 'distributors' }} available
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Entity Display -->
    <div v-if="selectedEntityItem" class="selected-entity-section">
      <div class="selected-entity-header">
        <div class="entity-info-card">
          <div class="entity-avatar">
            {{ selectedEntityItem.name.charAt(0) }}
          </div>
          <div class="entity-details">
            <h3>{{ selectedEntityItem.name }}</h3>
            <p class="entity-location">📍 {{ selectedEntityItem.city }}, {{ selectedEntityItem.state }}</p>
            <p class="entity-category">📦 {{ selectedEntityItem.category }} - {{ selectedEntityItem.subCategory }}</p>
            <span :class="getStatusBadgeClass(selectedEntityItem.status)">
              {{ selectedEntityItem.status }}
            </span>
          </div>
          <button class="btn-change-selection" @click="clearSelection">
            <span>🔄</span> Change Selection
          </button>
        </div>
      </div>

      <!-- Associated Entity Filters -->
      <div class="associated-filters">
        <div class="filters-header">
          <h3>Filter {{ selectedEntity === 'manufacturer' ? 'Distributors' : 'Manufacturers' }}</h3>
          <button class="btn-clear-all" @click="clearAssociatedFilters" v-if="hasActiveAssociatedFilters">
            <span>✕</span> Clear All
          </button>
        </div>

        <div class="filters-grid">
          <!-- Geography Section -->
          <div class="filter-card">
            <div class="filter-card-header">
              <span class="filter-icon">🌍</span>
              <h4>Geography</h4>
            </div>
            <div class="filter-card-content">
              <div class="filter-row">
                <label>State</label>
                <ModernMultiSelect 
                  :options="availableAssociatedStates"
                  :selected="associatedFilters.state"
                  placeholder="Select states..."
                  @update:selected="(val) => updateAssociatedLocationFilters('state', val)"
                />
              </div>
              <div class="filter-row">
                <label>District</label>
                <ModernMultiSelect 
                  :options="availableAssociatedDistricts"
                  :selected="associatedFilters.district"
                  placeholder="Select districts..."
                  @update:selected="(val) => updateAssociatedLocationFilters('district', val)"
                />
              </div>
              <div class="filter-row">
                <label>City</label>
                <ModernMultiSelect 
                  :options="availableAssociatedCities"
                  :selected="associatedFilters.city"
                  placeholder="Select cities..."
                  @update:selected="(val) => updateAssociatedLocationFilters('city', val)"
                />
              </div>
            </div>
          </div>

          <!-- Category Section -->
          <div class="filter-card">
            <div class="filter-card-header">
              <span class="filter-icon">📦</span>
              <h4>Category</h4>
            </div>
            <div class="filter-card-content">
              <div class="filter-row">
                <label>Category</label>
                <ModernMultiSelect 
                  :options="availableAssociatedCategories"
                  :selected="associatedFilters.category"
                  placeholder="Select categories..."
                  @update:selected="(val) => updateAssociatedCategoryFilters('category', val)"
                />
              </div>
              <div class="filter-row">
                <label>Sub Category</label>
                <ModernMultiSelect 
                  :options="availableAssociatedSubCategories"
                  :selected="associatedFilters.subCategory"
                  placeholder="Select sub-categories..."
                  @update:selected="(val) => updateAssociatedCategoryFilters('subCategory', val)"
                />
              </div>
            </div>
          </div>

          <!-- Status Section -->
          <div class="filter-card">
            <div class="filter-card-header">
              <span class="filter-icon">📊</span>
              <h4>Status</h4>
            </div>
            <div class="filter-card-content">
              <div class="filter-row">
                <label>Status</label>
                <ModernMultiSelect 
                  :options="filterOptions.statuses"
                  :selected="associatedFilters.status"
                  placeholder="Select statuses..."
                  @update:selected="(val) => onAssociatedFilterChange('status', val)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Active Associated Filters Display -->
        <div class="active-filters" v-if="hasActiveAssociatedFilters">
          <h4>Active Filters:</h4>
          <div class="filter-tags">
            <div v-for="(values, key) in activeAssociatedFilterTags" :key="key" class="filter-tag-group">
              <span class="filter-tag-label">{{ getFilterLabel(key) }}:</span>
              <span 
                v-for="value in values" 
                :key="value" 
                class="filter-tag"
              >
                {{ value }}
                <button @click="removeAssociatedFilterValue(key, value)" class="tag-remove">×</button>
              </span>
            </div>
          </div>
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
            <span class="summary-count">{{ filteredPairedList.length }}</span>
            <span class="summary-text">{{ selectedEntity === 'manufacturer' ? 'distributors' : 'manufacturers' }} found</span>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '../components/DataTable.vue'
import ModernMultiSelect from '../components/ModernMultiSelect.vue'
import { useBusinessLogic } from '../composables/useBusinessLogic'

const router = useRouter()
const {
  selectedEntity,
  selectedEntityId,
  filters,
  associatedFilters,
  manufacturers,
  distributors,
  filteredManufacturers,
  filteredDistributors,
  pairedList,
  setSelectedEntity,
  setSelectedEntityId,
  setSelectedManufacturer,
  setSelectedDistributor,
  clearFilters,
  clearAssociatedFilters,
  updateLocationFilters,
  updateCategoryFilters,
  locationMapping,
  industryToCategoryMapping
} = useBusinessLogic()

// Import filter options
import { filterOptions } from '../data/mockData'

// Local state
const selectedEntityItem = ref(null)

// Computed properties
const currentEntityList = computed(() => {
  return selectedEntity.value === 'manufacturer' 
    ? filteredManufacturers.value 
    : filteredDistributors.value
})

const filteredPairedList = computed(() => {
  if (!selectedEntityItem.value) return []
  
  let list = selectedEntity.value === 'manufacturer' 
    ? distributors.value 
    : manufacturers.value
    
  // Filter by matching category and subcategory
  list = list.filter(item =>
    item.category === selectedEntityItem.value?.category &&
    item.subCategory === selectedEntityItem.value?.subCategory
  )
  
  // Apply associated filters
  return list.filter(item => {
    return (!associatedFilters.value.city.length || associatedFilters.value.city.includes(item.city)) &&
           (!associatedFilters.value.district.length || associatedFilters.value.district.includes(item.district)) &&
           (!associatedFilters.value.state.length || associatedFilters.value.state.includes(item.state)) &&
           (!associatedFilters.value.category.length || associatedFilters.value.category.includes(item.category)) &&
           (!associatedFilters.value.subCategory.length || associatedFilters.value.subCategory.includes(item.subCategory)) &&
           (!associatedFilters.value.status.length || associatedFilters.value.status.includes(item.status))
  })
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

// Filter availability computed properties
const availableStates = computed(() => {
  if (filters.value.city.length > 0 || filters.value.district.length > 0) {
    const relatedStates = new Set()
    
    if (filters.value.city.length > 0) {
      Object.entries(locationMapping).forEach(([state, mapping]) => {
        if (mapping.cities.some(city => filters.value.city.includes(city))) {
          relatedStates.add(state)
        }
      })
    }
    
    if (filters.value.district.length > 0) {
      Object.entries(locationMapping).forEach(([state, mapping]) => {
        if (mapping.districts.some(district => filters.value.district.includes(district))) {
          relatedStates.add(state)
        }
      })
    }
    
    return Array.from(relatedStates)
  }
  return filterOptions.states
})

const availableDistricts = computed(() => {
  if (filters.value.state.length > 0) {
    const relatedDistricts = new Set()
    filters.value.state.forEach(state => {
      const mapping = locationMapping[state]
      if (mapping) {
        mapping.districts.forEach(district => relatedDistricts.add(district))
      }
    })
    return Array.from(relatedDistricts)
  }
  return filterOptions.districts
})

const availableCities = computed(() => {
  if (filters.value.state.length > 0) {
    const relatedCities = new Set()
    filters.value.state.forEach(state => {
      const mapping = locationMapping[state]
      if (mapping) {
        mapping.cities.forEach(city => relatedCities.add(city))
      }
    })
    return Array.from(relatedCities)
  }
  return filterOptions.cities
})

const availableCategories = computed(() => {
  if (filters.value.subCategory.length > 0) {
    const relatedCategories = new Set()
    filters.value.subCategory.forEach(subCategory => {
      Object.entries(industryToCategoryMapping).forEach(([category, subCategories]) => {
        if (subCategories.includes(subCategory)) {
          relatedCategories.add(category)
        }
      })
    })
    return Array.from(relatedCategories)
  }
  return filterOptions.categories
})

const availableSubCategories = computed(() => {
  if (filters.value.category.length > 0) {
    const relatedSubCategories = new Set()
    filters.value.category.forEach(category => {
      const subCategories = industryToCategoryMapping[category]
      if (subCategories) {
        subCategories.forEach(subCategory => relatedSubCategories.add(subCategory))
      }
    })
    return Array.from(relatedSubCategories)
  }
  return filterOptions.subCategories
})

// Associated filters availability
const availableAssociatedStates = computed(() => {
  if (associatedFilters.value.city.length > 0 || associatedFilters.value.district.length > 0) {
    const relatedStates = new Set()
    
    if (associatedFilters.value.city.length > 0) {
      Object.entries(locationMapping).forEach(([state, mapping]) => {
        if (mapping.cities.some(city => associatedFilters.value.city.includes(city))) {
          relatedStates.add(state)
        }
      })
    }
    
    if (associatedFilters.value.district.length > 0) {
      Object.entries(locationMapping).forEach(([state, mapping]) => {
        if (mapping.districts.some(district => associatedFilters.value.district.includes(district))) {
          relatedStates.add(state)
        }
      })
    }
    
    return Array.from(relatedStates)
  }
  return filterOptions.states
})

const availableAssociatedDistricts = computed(() => {
  if (associatedFilters.value.state.length > 0) {
    const relatedDistricts = new Set()
    associatedFilters.value.state.forEach(state => {
      const mapping = locationMapping[state]
      if (mapping) {
        mapping.districts.forEach(district => relatedDistricts.add(district))
      }
    })
    return Array.from(relatedDistricts)
  }
  return filterOptions.districts
})

const availableAssociatedCities = computed(() => {
  if (associatedFilters.value.state.length > 0) {
    const relatedCities = new Set()
    associatedFilters.value.state.forEach(state => {
      const mapping = locationMapping[state]
      if (mapping) {
        mapping.cities.forEach(city => relatedCities.add(city))
      }
    })
    return Array.from(relatedCities)
  }
  return filterOptions.cities
})

const availableAssociatedCategories = computed(() => {
  if (associatedFilters.value.subCategory.length > 0) {
    const relatedCategories = new Set()
    associatedFilters.value.subCategory.forEach(subCategory => {
      Object.entries(industryToCategoryMapping).forEach(([category, subCategories]) => {
        if (subCategories.includes(subCategory)) {
          relatedCategories.add(category)
        }
      })
    })
    return Array.from(relatedCategories)
  }
  return filterOptions.categories
})

const availableAssociatedSubCategories = computed(() => {
  if (associatedFilters.value.category.length > 0) {
    const relatedSubCategories = new Set()
    associatedFilters.value.category.forEach(category => {
      const subCategories = industryToCategoryMapping[category]
      if (subCategories) {
        subCategories.forEach(subCategory => relatedSubCategories.add(subCategory))
      }
    })
    return Array.from(relatedSubCategories)
  }
  return filterOptions.subCategories
})

// Active filters
const hasActiveFilters = computed(() => {
  return Object.values(filters).some(arr => arr.length > 0)
})

const hasActiveAssociatedFilters = computed(() => {
  return Object.values(associatedFilters).some(arr => arr.length > 0)
})

const activeFilterTags = computed(() => {
  const tags = {}
  Object.entries(filters).forEach(([key, values]) => {
    if (values.length > 0) {
      tags[key] = values
    }
  })
  return tags
})

const activeAssociatedFilterTags = computed(() => {
  const tags = {}
  Object.entries(associatedFilters).forEach(([key, values]) => {
    if (values.length > 0) {
      tags[key] = values
    }
  })
  return tags
})

// Methods
const onEntitySelect = () => {
  selectedEntityItem.value = currentEntityList.value.find(e => e.id === selectedEntityId.value) || null
  if (selectedEntityItem.value) {
    if (selectedEntity.value === 'manufacturer') {
      setSelectedManufacturer(selectedEntityItem.value)
    } else {
      setSelectedDistributor(selectedEntityItem.value)
    }
  }
  clearAssociatedFilters()
}

const clearSelection = () => {
  setSelectedEntityId('')
  selectedEntityItem.value = null
  setSelectedManufacturer(null)
  setSelectedDistributor(null)
  clearAssociatedFilters()
}

const onEntityChange = (newEntity) => {
  setSelectedEntity(newEntity)
  clearSelection()
  clearFilters()
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

const updateAssociatedLocationFilters = (type, values) => {
  associatedFilters.value[type] = values
}

const updateAssociatedCategoryFilters = (type, values) => {
  associatedFilters.value[type] = values
}

const removeFilterValue = (filterType, value) => {
  const currentValues = filters.value[filterType]
  const newValues = currentValues.filter(v => v !== value)
  
  if (filterType === 'city' || filterType === 'district' || filterType === 'state') {
    updateLocationFilters(filterType, newValues)
  } else if (filterType === 'category' || filterType === 'subCategory') {
    updateCategoryFilters(filterType, newValues)
  } else {
    onFilterChange({ [filterType]: newValues })
  }
}

const removeAssociatedFilterValue = (filterType, value) => {
  const currentValues = associatedFilters.value[filterType]
  const newValues = currentValues.filter(v => v !== value)
  
  if (filterType === 'city' || filterType === 'district' || filterType === 'state') {
    updateAssociatedLocationFilters(filterType, newValues)
  } else if (filterType === 'category' || filterType === 'subCategory') {
    updateAssociatedCategoryFilters(filterType, newValues)
  } else {
    onAssociatedFilterChange(filterType, newValues)
  }
}

const getFilterLabel = (key) => {
  const labels = {
    state: 'State',
    district: 'District', 
    city: 'City',
    category: 'Category',
    subCategory: 'Sub Category',
    status: 'Status'
  }
  return labels[key] || key
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

const getStatusBadgeClass = (status) => {
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
</script>

<style scoped>
.dashboard {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: #6b7280;
  font-size: 18px;
  font-weight: 400;
}

.entity-type-selection {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.entity-toggle-container {
  display: flex;
  background: white;
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.entity-toggle-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.3s ease;
  position: relative;
}

.entity-toggle-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.entity-toggle-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.entity-icon {
  font-size: 20px;
}

.entity-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.entity-toggle-btn.active .entity-count {
  background: rgba(255, 255, 255, 0.3);
}

.modern-filters,
.associated-filters {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.filters-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.btn-clear-all {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-clear-all:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.filter-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.filter-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.filter-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.filter-icon {
  font-size: 20px;
}

.filter-card-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.filter-card-content {
  padding: 20px;
}

.filter-row {
  margin-bottom: 16px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-row label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.active-filters {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
}

.active-filters h4 {
  margin: 0 0 12px 0;
  color: #0c4a6e;
  font-size: 14px;
  font-weight: 600;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-tag-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tag-label {
  font-weight: 600;
  color: #0c4a6e;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0ea5e9;
  color: white;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.tag-remove {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
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
  background: rgba(255, 255, 255, 0.5);
}

.entity-selection {
  margin-bottom: 32px;
}

.selection-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.selection-card h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.selection-icon {
  font-size: 24px;
}

.entity-dropdown-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modern-select {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modern-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.selection-stats {
  display: flex;
  justify-content: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.stat-item {
  color: #6b7280;
  font-size: 14px;
}

.stat-item strong {
  color: #374151;
  font-weight: 700;
}

.selected-entity-section {
  margin-bottom: 32px;
}

.selected-entity-header {
  margin-bottom: 32px;
}

.entity-info-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.entity-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
}

.entity-details {
  flex: 1;
}

.entity-details h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.entity-location,
.entity-category {
  color: #6b7280;
  font-size: 14px;
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 8px;
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

.btn-change-selection {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-change-selection:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.table-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0f9ff;
  border-radius: 8px;
}

.summary-count {
  font-size: 18px;
  font-weight: 700;
  color: #0c4a6e;
}

.summary-text {
  color: #0369a1;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .entity-toggle-container {
    flex-direction: column;
    width: 100%;
  }
  
  .entity-toggle-btn {
    justify-content: center;
  }
  
  .entity-info-card {
    flex-direction: column;
    text-align: center;
  }
  
  .filter-tags {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-tag-group {
    width: 100%;
  }
}
</style>