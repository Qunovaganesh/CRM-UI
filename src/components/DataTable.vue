<template>
  <div class="data-table">
    <div class="table-header">
      <h3>{{ title }}</h3>
      <div class="table-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="row.id || index">
            <td v-for="column in columns" :key="column.key">
              <template v-if="column.key === 'serialNumber'">
                {{ index + 1 }}
              </template>
              <template v-else-if="column.key === 'action'">
                <button 
                  v-if="getActionButton(row)"
                  :class="getActionButtonClass(row)"
                  @click="$emit('action-click', row)"
                >
                  {{ getActionButton(row) }}
                </button>
              </template>
              <template v-else-if="column.key === 'status'">
                <span :class="getStatusClass(row[column.key])">
                  {{ row[column.key] }}
                </span>
              </template>
              <template v-else-if="column.key === 'registrationDate'">
                {{ formatDate(row[column.key]) }}
              </template>
              <template v-else>
                {{ row[column.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!data.length" class="no-data">
      <p>No data available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Manufacturer, Distributor } from '../types';

interface Column {
  key: string;
  label: string;
}

defineProps<{
  title: string;
  columns: Column[];
  data: (Manufacturer | Distributor)[];
}>();

defineEmits<{
  'action-click': [row: any];
}>();

const getActionButton = (row: any) => {
  if (row.status === 'Lead') return 'Manage Lead';
  if (row.status === 'Prospect') return 'Manage Prospect';
  if (row.status === 'Customer') return 'Manage Customer';
  if (row.status === 'View') return 'View Details';
  return 'View Details';
};

const getActionButtonClass = (row: any) => {
  const baseClass = 'btn-action';
  if (row.status === 'Lead') return `${baseClass} btn-lead`;
  if (row.status === 'Prospect') return `${baseClass} btn-prospect`;
  if (row.status === 'Customer') return `${baseClass} btn-customer`;
  if (row.status === 'View') return `${baseClass} btn-view`;
  return `${baseClass} btn-view`;
};

const getStatusClass = (status: string) => {
  const baseClass = 'status-badge';
  if (status === 'Lead') return `${baseClass} status-lead`;
  if (status === 'Prospect') return `${baseClass} status-prospect`;
  if (status === 'Customer') return `${baseClass} status-customer`;
  if (status === 'View') return `${baseClass} status-view`;
  return baseClass;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
.data-table {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #d1d5db;
}

.table-header h3 {
  margin: 0;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
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
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table td {
  color: #4b5563;
  font-size: 14px;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.btn-action {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: #0066cc;
  color: white;
}

.btn-primary:hover {
  background: #0052a3;
}

.btn-lead {
  background: #f59e0b;
  color: white;
}

.btn-lead:hover {
  background: #d97706;
}

.btn-prospect {
  background: #3b82f6;
  color: white;
}

.btn-prospect:hover {
  background: #2563eb;
}

.btn-customer {
  background: #10b981;
  color: white;
}

.btn-customer:hover {
  background: #059669;
}

.btn-view {
  background: #6b7280;
  color: white;
}

.btn-view:hover {
  background: #4b5563;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

.no-data {
  padding: 40px;
  text-align: center;
  color: #6b7280;
}

.no-data p {
  margin: 0;
  font-size: 16px;
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .table th,
  .table td {
    padding: 8px 10px;
    font-size: 12px;
  }
}
</style>