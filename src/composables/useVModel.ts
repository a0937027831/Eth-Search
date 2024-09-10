// useVModel.ts (Composable for v-model handling)
import { computed } from 'vue';

export function useVModel(props, emit, propName = 'modelValue') {
  return computed({
    get: () => props[propName],
    set: value => emit(`update:${propName}`, value),
  });
}
