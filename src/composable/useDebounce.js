// @ts-nocheck
// src/composable/useDebounce.js
import { onBeforeUnmount, ref, watch } from 'vue';

/**
 * @param {ref} source - 감시할 ref (입력값)
 * @param {number} delay - 디바운스 지연 시간(ms)
 * @returns {ref} - 지연된 값
 */
export function useDebounce(source, delay = 300) {
  const debouncedValue = ref(source.value);
  let timer = null;

  watch(
    source,
    newValue => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        debouncedValue.value = newValue;
      }, delay);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => clearTimeout(timer));

  return debouncedValue;
}
