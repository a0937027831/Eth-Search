<template>
  <div class="multi-check-cascader">
    <!-- 選擇框 (顯示已勾選數量或其他資訊) -->
    <div class="cascader-selection" @click="toggleDropdown">
      <span v-if="checkedValues.size === 0">{{ placeholder }}</span>
      <span v-else>已選 {{ checkedValues.size }} 項</span>
    </div>

    <!-- 下拉面板 -->
    <div class="cascader-dropdown" v-if="isOpen">
      <!-- 搜尋框 -->
      <div class="cascader-search">
        <input
          v-model="searchText"
          class="search-input"
          type="text"
          placeholder="搜尋..."
        />
      </div>

      <!-- 多欄顯示每一層 -->
      <div class="cascader-panels">
        <div
          v-for="(levelOptions, levelIndex) in columns"
          :key="levelIndex"
          class="cascader-panel"
        >
          <div> levelIndex : {{ levelIndex }}</div>
          <div
            v-for="(option, index) in levelOptions"
            :key="option.value"
            class="cascader-option"
            @mouseenter="handleMouseEnter(option, levelIndex)"
          >
            <div>index : {{ index }}</div>
            <!-- 多選 checkbox -->
            <input
              type="checkbox"
              :checked="checkedValues.has(option.value)"
              @change="onCheckChange($event, option)"
              v-indeterminate="indeterminateValues.has(option.value)"
            />
            {{ option.label }}
            <span v-if="option.children && option.children.length"> &gt; </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ------------------- import -------------------
import { ref, computed, watch, onMounted } from 'vue'
import { useTreeCheckRecursive, TreeNode } from '@/composables/useTreeCheck'
import { IndeterminateDirective } from '@/utils/v-indeterminate'

// ------------------- defineModel -------------------
/**
 * Vue 3.3+ 新的 defineModel API：
 *   - 只支援單一 v-model
 *   - 預設使用 `v-model="model"` 時，父層就能同步拿到 `model` 的變化
 */
const model = defineModel<(string | number)[]>({
  // 預設值
  default: () => []
})

// ------------------- 其他 props -------------------
/**
 * 如果還有其他 props (非 v-model) 需要傳進來，
 * 可以再用 defineProps 聲明；或把它們也寫在 defineModel 的第二個參數
 * 但目前 defineModel 只建議用於聲明一個主要 v-model
 */
import { PropType } from 'vue'
const props = defineProps({
  placeholder: { type: String, default: '請選擇' },
  options: { type: Array as PropType<TreeNode[]>, default: () => [] }
})

const { placeholder, options } = props;

// ------------------- directives -------------------
/**
 * 若想在同檔案中使用自訂指令 v-indeterminate，
 * 可以這樣定義一個 "directives" 物件
 */
 defineOptions({
  directives: {
    indeterminate: IndeterminateDirective
  }
})

// ------------------- 下拉開關 -------------------
const isOpen = ref(false)
function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// ------------------- 搜尋關鍵字 -------------------
const searchText = ref('')

// ------------------- 展開路徑 (用於多欄顯示) -------------------
const expandedPath = ref<(string | number)[]>([])

// ------------------- 父子聯動 Composable -------------------
const {
  checkedValues,
  indeterminateValues,
  nodeMap,
  parentMap,
  buildMaps,
  toggleCheck,
  rebuildAllStates
} = useTreeCheckRecursive()

/**
 * 同步到父層的 v-model => 這裡因為用了 defineModel，所以直接改寫 model 即可
 * 父層會自動接收到變化
 */
function syncToParent() {
  // 將目前 checkedValues 轉成 Array，賦值給 model
  model.value = Array.from(checkedValues.value)
}

// ------------------- 監聽 defineModel 的變動 -------------------
/**
 * 父層若改變 v-model 的值 (model.value)，這裡會收到通知
 *  => 我們要根據新的 model.value 重建父子聯動狀態
 */
watch(
  () => model.value,
  (newVal) => {
    checkedValues.value = new Set(newVal)
    rebuildAllStates()
  },
  { immediate: true }
)

// ------------------- Checkbox 勾選 / 取消 -------------------
function onCheckChange(e: Event, node: TreeNode) {
  const inputEl = e.target as HTMLInputElement
  toggleCheck(node.value, inputEl.checked)
  syncToParent()
}

// ------------------- 滑鼠移入 => 更新 expandedPath -------------------
function handleMouseEnter(option: TreeNode, levelIndex: number) {
  expandedPath.value = [
    ...expandedPath.value.slice(0, levelIndex),
    option.value
  ]
}

// ------------------- 建立 nodeMap / parentMap -------------------
onMounted(() => {
  buildMaps(options)
  // 初始：根據 model.value (父層給的預設選擇)，重建父子聯動
  checkedValues.value = new Set(model.value)
  rebuildAllStates()
})

// ------------------- 搜尋邏輯 -------------------
const filteredTree = computed(() => {
  if (!searchText.value.trim()) {
    return options
  }
  const kw = searchText.value.trim().toLowerCase()

  function filterNodes(nodes: TreeNode[]): TreeNode[] {
    const res: TreeNode[] = []
    for (const node of nodes) {
      const labelMatch = node.label.toLowerCase().includes(kw)
      let childrenMatch: TreeNode[] = []
      if (node.children && node.children.length) {
        childrenMatch = filterNodes(node.children)
      }
      // 若自己或子孫符合 => 保留
      if (labelMatch || childrenMatch.length > 0) {
        res.push({ ...node, children: childrenMatch })
      }
    }
    return res
  }

  return filterNodes(options)
})

// ------------------- 多欄 columns -------------------
const columns = computed(() => {
  const result: TreeNode[][] = []
  let currentLevel = filteredTree.value
  result.push(currentLevel)

  for (let i = 0; i < expandedPath.value.length; i++) {
    const val = expandedPath.value[i]
    const node = currentLevel.find(n => n.value === val)
    if (node && node.children && node.children.length) {
      currentLevel = node.children
      result.push(currentLevel)
    } else {
      break
    }
  }
  return result
})
</script>

<style scoped>
.multi-check-cascader {
  position: relative;
  display: inline-block;
  width: 220px;
}

.cascader-selection {
  border: 1px solid #ccc;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  background: #fff;
  user-select: none;
}

.cascader-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  border: 1px solid #ccc;
  background: #fff;
  z-index: 999;
  width: max-content;
  padding: 8px;
}

.cascader-search {
  margin-bottom: 8px;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 4px;
}

.cascader-panels {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.cascader-panel {
  border-right: 1px solid #eee;
  min-width: 120px;
  padding-right: 8px;
}

.cascader-option {
  padding: 4px 0;
  cursor: pointer;
  white-space: nowrap;
}

.cascader-option:hover {
  background-color: #f5f5f5;
}
</style>
