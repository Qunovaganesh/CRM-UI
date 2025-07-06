<template>
  <div class="filter-controls">
    <div class="entity-toggle">
      <h3>Select Entity Type</h3>
      <div class="radio-group">
        <label>
          <input 
            type="radio" 
            :value="'manufacturer'" 
            v-model="internalSelectedEntity"
          >
          Manufacturer
        </label>
        <label>
          <input 
            type="radio" 
            :value="'distributor'" 
            v-model="internalSelectedEntity"
          >
          Distributor
        </label>
      </div>
    </div>

    <div class="filters-grid">
      <div class="filter-group">
        <label>State</label>
        <select v-model="internalFilters.state" @change="onFilterChange">
          <option value="">All States</option>
          <option v-for="state in filterOptions.states" :key="state" :value="state">
            {{ state }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>District</label>
        <select v-model="internalFilters.district" @change="onFilterChange">
          <option value="">All Districts</option>
          <option v-for="district in filterOptions.districts" :key="district" :value="district">
            {{ district }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>City</label>
        <select v-model="internalFilters.city" @change="onFilterChange">
          <option value="">All Cities</option>
          <option v-for="city in filterOptions.cities" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Industry</label>
        <select v-model="internalFilters.industry" @change="onFilterChange">
          <option value="">All Industries</option>
          <option v-for="industry in filterOptions.industries" :key="industry" :value="industry">
            {{ industry }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Category</label>
        <select v-model="internalFilters.category" @change="onFilterChange">
          <option value="">All Categories</option>
          <option v-for="category in filterOptions.categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="filter-group" v-if="selectedEntity === 'distributor'">
        <label>Status</label>
        <select v-model="internalFilters.status" @change="onFilterChange">
          <option value="">All Status</option>
          <option v-for="status in filterOptions.statuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
    </div>

    <div class="filter-actions">
      <button type="button" class="btn-secondary" @click="clearAllFilters">
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { filterOptions } from '../data/mockData';

const props = defineProps<{
  selectedEntity: 'manufacturer' | 'distributor';
  filters: any;
}>();

const emit = defineEmits<{
  'update:selectedEntity': [value: 'manufacturer' | 'distributor'];
  'update:filters': [filters: any];
  'entity-change': [];
  'filter-change': [];
  'clear-filters': [];
}>();

const internalSelectedEntity = computed({
  get() {
    return props.selectedEntity;
  },
  set(value: 'manufacturer' | 'distributor') {
    emit('update:selectedEntity', value);
    emit('entity-change');
  }
});

const internalFilters = computed({
  get() {
    return props.filters;
  },
  set(value: any) {
    emit('update:filters', value);
  }
});

const onFilterChange = () => {
  emit('filter-change');
};

const clearAllFilters = () => {
  emit('clear-filters');
};
</script>

<style scoped>
.filter-controls {
  background: #f8f9fa;
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-bottom: 20px;
}

.entity-toggle {
  margin-bottom: 20px;
}

.entity-toggle h3 {
  margin: 0 0 10px 0;
  color: #374151;
  font-size: 16px;
  font-weight: 600;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #374151;
  font-weight: 500;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
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
  gap: 10px;
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
}

.btn-secondary:hover {
  background: #4b5563;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 10px;
  }
}
</style>