<template>
  <div class="customer-page">
    <!-- Floating Header -->
    <div class="floating-header">
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

    <!-- Rest of the template content -->
  </div>
</template>

<script setup lang="ts">
// Script content
</script>

<style scoped>
/* Style content */
</style>