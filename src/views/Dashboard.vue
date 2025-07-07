<template>
  <div class="dashboard">
    <div class="page-header">
      <h1>Manufacturer-Distributor Management</h1>
      <p>Manage your business relationships and workflow processes</p>
      <div class="header-actions">
        <button class="btn-add-new" @click="$router.push('/')">
          <span>➕</span> Add New Lead
        </button>
      </div>
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
    // Safety check: ensure item exists before accessing properties
    if (!item) return false
    
    return (!associatedFilters.city.length || associatedFilters.city.includes(item.city)) &&
           (!associatedFilters.district.length || associatedFilters.district.includes(item.district)) &&
           (!associatedFilters.state.length || associatedFilters.state.includes(item.state)) &&
           (!associatedFilters.category.length || associatedFilters.category.includes(item.category)) &&
           (!associatedFilters.subCategory.length || associatedFilters.subCategory.includes(item.subCategory)) &&
           (!associatedFilters.status.length || associatedFilters.status.includes(item.status))
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
  if (filters.city.length > 0 || filters.district.length > 0) {
    const relatedStates = new Set()
    
    if (filters.city.length > 0) {
      Object.entries(locationMapping).forEach(([state, mapping]) => {
        if (mapping.cities.some(city => filters.city.includes(city))) {
          relatedStates.add(state)
        }
      })
    }
    
    if (filters.district.length > 0) {
      Object.entries(locationMapping).forEach(([state, mapping]) => {
        if (mapping.districts.some(district => filters.district.includes(district))) {
          relatedStates.add(state)
        }
      })
    }
    
    return Array.from(relatedStates)
  }
  return filterOptions.states
})

const availableDistricts = computed(() => {
  if (filters.state.length > 0) {
    const relatedDistricts = new Set()
    filters.state.forEach(state => {
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
  if (filters.state.length > 0) {
    const relatedCities = new Set()
    filters.state.forEach(state => {
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
  if (filters.subCategory.length > 0) {
    const relatedCategories = new Set()
    filters.subCategory.forEach(subCategory => {
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
  if (filters.category.length > 0) {
    const relatedSubCategories = new Set()
    filters.category.forEach(category => {
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
  if (associatedFilters.city.length > 0 || associatedFilters.district.length > 0) {
    const relatedStates = new Set()
    
    if (associatedFilters.city.length > 0) {
      Object.entries(locationMapping).forEach(([state, mapping]) => {
        if (mapping.cities.some(city => associatedFilters.city.includes(city))) {
          relatedStates.add(state)
        }
      })
    }
    
    if (associatedFilters.district.length > 0) {
      Object.entries(locationMapping).forEach(([state, mapping]) => {
        if (mapping.districts.some(district => associatedFilters.district.includes(district))) {
          relatedStates.add(state)
        }
      })
    }
    
    return Array.from(relatedStates)
  }
  return filterOptions.states
})

const availableAssociatedDistricts = computed(() => {
  if (associatedFilters.state.length > 0) {
    const relatedDistricts = new Set()
    associatedFilters.state.forEach(state => {
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
  if (associatedFilters.state.length > 0) {
    const relatedCities = new Set()
    associatedFilters.state.forEach(state => {
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
  if (associatedFilters.subCategory.length > 0) {
    const relatedCategories = new Set()
    associatedFilters.subCategory.forEach(subCategory => {
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
  if (associatedFilters.category.length > 0) {
    const relatedSubCategories = new Set()
    associatedFilters.category.forEach(category => {
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
const clearAllFilters = () => {
  // Clear all filter arrays
  filters.state = []
  filters.district = []
  filters.city = []
  filters.category = []
  filters.subCategory = []
  filters.status = []
  
  // Call the composable's clear function
  clearFilters()
}

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
  Object.assign(filters, updated)
  if (selectedEntityItem.value) {
    const exists = currentEntityList.value.some(e => e.id === selectedEntityItem.value?.id)
    if (!exists) clearSelection()
  }
}

const onAssociatedFilterChange = (type, values) => {
  associatedFilters[type] = values
}

const updateAssociatedLocationFilters = (type, values) => {
  associatedFilters[type] = values
}

const updateAssociatedCategoryFilters = (type, values) => {
  associatedFilters[type] = values
}

const removeFilterValue = (filterType, value) => {
  const currentValues = filters[filterType]
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
  const currentValues = associatedFilters[filterType]
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
    case 'Registration': return 'Lead' // Process registration as lead
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
    Registration: 'status-registration',
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
  background: #f5f5f7;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
  position: relative;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  color: #1d1d1f;
}

.page-header p {
  color: #86868b;
  font-size: 18px;
  font-weight: 300;
}

.header-actions {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 12px;
}

.btn-add-new {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #1c1c1e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-add-new:hover {
  background: #000000;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(28, 28, 30, 0.3);
}

.entity-type-selection {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
}

.entity-toggle-container {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #d2d2d7;
}

.entity-toggle-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #86868b;
  transition: all 0.3s ease;
  position: relative;
}

.entity-toggle-btn:hover {
  background: #f5f5f7;
  color: #1d1d1f;
}

.entity-toggle-btn.active {
  background: #1c1c1e;
  color: white;
  box-shadow: 0 2px 8px rgba(28, 28, 30, 0.3);
}

.entity-icon {
  display: none;
}

.entity-count {
  background: rgba(255, 255, 255, 0.25);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.entity-toggle-btn.active .entity-count {
  background: rgba(255, 255, 255, 0.25);
}

.modern-filters,
.associated-filters {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #d2d2d7;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #d2d2d7;
}

.filters-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

.btn-clear-all {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #1c1c1e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-clear-all:hover {
  background: #000000;
  transform: translateY(-1px);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.filter-card {
  background: #f5f5f7;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.filter-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.filter-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #ffffff;
  color: #1d1d1f;
  border-bottom: 1px solid #f2f2f7;
}

.filter-icon {
  display: none;
}

.filter-card-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
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
  color: #1d1d1f;
  font-size: 14px;
}

.active-filters {
  background: #f5f5f7;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
}

.active-filters h4 {
  margin: 0 0 12px 0;
  color: #1d1d1f;
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
  color: #1d1d1f;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1c1c1e;
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

.tag-remove {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  padding: 0;
  width: 14px;
  height: 14px;
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
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #d2d2d7;
}

.selection-card h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 20px 0;
}

.selection-icon {
  display: none;
}

.entity-dropdown-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modern-select {
  width: 100%;
  padding: 16px 20px;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #1d1d1f;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modern-select:focus {
  outline: none;
  border-color: #1c1c1e;
  box-shadow: 0 0 0 3px rgba(28, 28, 30, 0.1);
}

.selection-stats {
  display: flex;
  justify-content: center;
  padding: 12px;
  background: #f5f5f7;
  border-radius: 8px;
}

.stat-item {
  color: #86868b;
  font-size: 14px;
}

.stat-item strong {
  color: #1d1d1f;
  font-weight: 600;
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
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #d2d2d7;
}

.entity-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #1c1c1e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  flex-shrink: 0;
}

.entity-details {
  flex: 1;
}

.entity-details h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 8px 0;
}

.entity-location,
.entity-category {
  color: #86868b;
  font-size: 14px;
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 8px;
}

.status-lead {
  background: #f2f2f7;
  color: #8e8e93;
}

.status-prospect {
  background: #e5e5ea;
  color: #1c1c1e;
}

.status-customer {
  background: #d1d1d6;
  color: #1c1c1e;
}

.status-view {
  background: #f5f5f7;
  color: #8e8e93;
}

.status-registration {
  background: #ede9fe;
  color: #7c3aed;
}

.btn-change-selection {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-change-selection:hover {
  background: #e8e8ed;
  transform: translateY(-1px);
}

.table-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f5f7;
  border-radius: 8px;
}

.summary-count {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
}

.summary-text {
  color: #86868b;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .page-header {
    text-align: left;
  }
  
  .header-actions {
    position: static;
    margin-top: 16px;
    justify-content: center;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .page-header p {
    font-size: 16px;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .entity-toggle-container {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }
  
  .entity-toggle-btn {
    justify-content: center;
    padding: 16px 20px;
  }
  
  .entity-info-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .filter-tags {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-tag-group {
    width: 100%;
  }
  
  .modern-filters,
  .associated-filters {
    padding: 16px;
  }
  
  .filters-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .filter-card {
    border-radius: 8px;
  }
  
  .filter-card-content {
    padding: 16px;
  }
}
@media (max-width: 480px) {
  .dashboard {
    padding: 12px;
  }
  
  .page-header {
    margin-bottom: 24px;
  }
  
  .page-header h1 {
    font-size: 20px;
  }
  
  .page-header p {
    font-size: 14px;
  }
  
  .entity-toggle-btn {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .modern-filters,
  .associated-filters {
    padding: 12px;
    margin-bottom: 20px;
  }
  
  .filters-header h3 {
    font-size: 18px;
  }
  
  .filter-card-content {
    padding: 12px;
  }
  
  .filter-row {
    margin-bottom: 12px;
  }
  
  .active-filters {
    padding: 12px;
  }
  
  .filter-tag {
    font-size: 11px;
    padding: 3px 6px;
  }
  
  .selection-card {
    padding: 16px;
  }
  
  .entity-info-card {
    padding: 16px;
  }
  
  .entity-avatar {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
  
  .btn-change-selection {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>