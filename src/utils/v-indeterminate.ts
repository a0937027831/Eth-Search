// v-indeterminate.ts
import { DirectiveBinding } from 'vue'

/**
 * 這個指令會在元素掛載或更新時，根據 binding.value (布林值)
 * 來設定或取消 input 的 indeterminate 屬性
 */
export const IndeterminateDirective = {
  mounted(el: HTMLInputElement, binding: DirectiveBinding) {
    el.indeterminate = !!binding.value
  },
  updated(el: HTMLInputElement, binding: DirectiveBinding) {
    el.indeterminate = !!binding.value
  }
}

