<template>
  <v-btn
    v-bind="$attrs"
    v-show="props.show"
    :loading="loading" 
    :disabled="props.disabled"
    :rounded="props.rounded"
    @click="onClick"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <template v-if="$slots[slotName]">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
      <template v-else>
        <slot />
      </template>
    </template>
  </v-btn>
</template>



<script setup lang="ts">
import { IBaseButtonProps, baseButtonDefaultProps } from './useButton';
import { useVModel } from '@/composables/useVModel'

defineOptions({
  inheritAttrs: false
})

interface Props extends IBaseButtonProps{
  debounce?: boolean,
  debounceTime?: number,
}

const props = withDefaults(defineProps<Props>(), {
  ...baseButtonDefaultProps,  // 展開默認 props
  debounce: false,
  debounceTime: 0,
});

const emit = defineEmits();
const loading = useVModel(props, emit, 'loading'); // 使用 v-model 处理 loading

function onClick(e){
  if(props.disabled || loading.value) return
  
  if(props.debounce && !loading.value){
    loading.value = true;
    props.click(e);
    setTimeout(()=>{
      loading.value = false;
    },props.debounceTime);
    return
  }

  if(!props.debounce){
    props.click(e);
    return
  }

}

</script>


