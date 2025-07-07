<template>
  <div class="filter-section">
    <div class="filter-section-header" @click="toggleOpen">
      <h3>{{ title }}</h3>
      <span class="toggle-icon" :class="{ open: internalIsOpen }">▾</span>
    </div>
    <div v-if="internalIsOpen" class="filter-section-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  title: string;
  isOpen?: boolean;
}>();

const localIsOpen = ref(props.isOpen ?? true);

const internalIsOpen = computed({
  get() {
    return props.isOpen !== undefined ? props.isOpen : localIsOpen.value;
  },
  set(value: boolean) {
    localIsOpen.value = value;
  }
});

const toggleOpen = () => {
  internalIsOpen.value = !internalIsOpen.value;
};
</script>

<style scoped>
.filter-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.filter-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
  cursor: pointer;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.filter-section-header:hover {
  background: #f3f4f6;
}

.filter-section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.toggle-icon {
  transition: transform 0.2s ease;
  color: #6b7280;
  font-size: 14px;
}

.toggle-icon.open {
  transform: rotate(180deg);
}

.filter-section-content {
  padding: 16px;
  background: white;
}

.filter-group {
  margin-bottom: 16px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}
</style>