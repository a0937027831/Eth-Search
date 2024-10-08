<template>
  <v-btn
    v-bind="$attrs"
    v-show="props.show"
    :loading="loading" 
    :disabled="props.disabled"
    :rounded="props.rounded"
    @click="onClick($event)"
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
// defineOptions({
//   inheritAttrs: false
// })



interface IBaseButtonProps {
  show?: boolean;
  disabled?: boolean;
  rounded?: string;
  debounce?: boolean,
  debounceTime?: number,
}


const props = withDefaults(defineProps<IBaseButtonProps>(), {
  show: true,
  disabled: false,
  rounded: 'lg',
  debounce: false,
  debounceTime: 0,
});

const emit = defineEmits(['click']);

const loading = defineModel('loading', {
  type: Boolean,
  default: false
});

function onClick(e){
  if(props.disabled || loading.value) return
  
  if(props.debounce && !loading.value){
    loading.value = true;
    emit('click',e);
    setTimeout(()=>{
      loading.value = false;
    },props.debounceTime);
    return
  }

  if(!props.debounce){
    emit('click',e);
    return
  }

}

</script>


