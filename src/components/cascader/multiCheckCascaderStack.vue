<template>
  <div class="multi-check-cascader">
    <!-- 顯示選擇結果，點擊後展開下拉面板 -->
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
          type="text"
          placeholder="搜尋..."
          class="search-input"
        />
      </div>
      <!-- 多欄面板：根據 expandedPath 動態生成各層選項 -->
      <div class="cascader-panels">
        <div
          v-for="(levelOptions, levelIndex) in columns"
          :key="levelIndex"
          class="cascader-panel"
        >
          <div class="panel-title">層級 {{ levelIndex }}</div>
          <div
            v-for="(option, index) in levelOptions"
            :key="option.value"
            class="cascader-option"
            @mouseenter="handleMouseEnter(option, levelIndex)"
          >
            <span class="option-index">選項 {{ index }}</span>
            <!-- 使用 v-indeterminate 指令設定半選狀態 -->
            <input
              type="checkbox"
              :checked="checkedValues.has(option.value)"
              @change="onCheckChange($event, option)"
              v-indeterminate="indeterminateValues.has(option.value)"
            />
            <span class="option-label">{{ option.label }}</span>
            <!-- 若有子節點則顯示箭頭 -->
            <span v-if="option.children && option.children.length"> &gt; </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTreeCheckIterative, TreeNode } from '@/composables/useTreeCheckIterative'
import { IndeterminateDirective } from '@/utils/v-indeterminate'

// ------------------- defineModel -------------------
/**

 *   - 只支援單一 v-model
 *   - 預設使用 `v-model="model"` 時，父層就能同步拿到 `model` 的變化
 */
 const model = defineModel<(string | number)[]>({
  // 預設值
  default: () => []
})


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


// 假設這裡的樹狀資料
const cascaderOptions: TreeNode[] = [
  {
    value: 'A',
    label: '全部',
    children: [
      {
        value: 'B',
        label: 'B 選項',
        children: [
          { value: 'D', label: 'D 選項' },
          { value: 'E', label: 'E 選項' }
        ]
      },
      {
        value: 'C',
        label: 'C 選項',
        children: [
          { value: 'F', label: 'F 選項' }
        ]
      }
    ]
  }
]

const placeholder = '請選擇'
const isOpen = ref(false)
function toggleDropdown() {
  isOpen.value = !isOpen.value
}
const searchText = ref('')
const expandedPath = ref<(string | number)[]>([])

// 使用迭代版本的父子聯動邏輯
const {
  checkedValues,
  indeterminateValues,
  buildMaps,
  toggleCheck,
  rebuildAllStates
} = useTreeCheckIterative()

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

// 建立樹狀資料的快取（nodeMap 與 parentMap）
onMounted(() => {
  buildMaps(cascaderOptions)
  // 初始：根據 model.value (父層給的預設選擇)，重建父子聯動
  checkedValues.value = new Set(model.value)
  rebuildAllStates()
})

/**
 * iterativeFilterTree
 * 以迭代方式過濾樹狀資料，不使用遞迴。
 * 透過堆疊進行後序遍歷，並在每個節點處理完畢後，
 * 決定該節點是否符合搜尋條件（或其子孫中有符合者），
 * 最後組合成新的過濾後樹狀結構。
 * 
 * @param nodes 原始樹狀資料陣列
 * @param keyword 搜尋關鍵字（不區分大小寫）
 * @returns 過濾後的樹狀資料陣列
 */
 function iterativeFilterTree(nodes: TreeNode[], keyword: string): TreeNode[] {
  const kw = keyword.toLowerCase()
  // resultMap 用來儲存每個節點過濾後的結果（若不符合則為 null）
  const resultMap = new Map<string | number, TreeNode | null>()
  // 使用堆疊來模擬後序遍歷，每個元素包含 node 與 visited 標記
  const stack: { node: TreeNode; visited: boolean }[] = []
  for (const node of nodes) {
    stack.push({ node, visited: false })
  }
  
  while (stack.length) {
    const { node, visited } = stack.pop()!
    if (!visited) {
      // 第一次遇到此節點，先將它推回堆疊並標記為已訪問，然後將其子節點推入
      stack.push({ node, visited: true })
      if (node.children && node.children.length) {
        // 注意：為了保持原始順序，從後往前推入
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ node: node.children[i], visited: false })
        }
      }
    } else {
      // 此時所有子節點均已處理完畢
      let filteredChildren: TreeNode[] = []
      if (node.children && node.children.length) {
        for (const child of node.children) {
          const filteredChild = resultMap.get(child.value)
          if (filteredChild) {
            filteredChildren.push(filteredChild)
          }
        }
      }
      // 判斷該節點自身是否符合搜尋條件
      const nodeMatches = node.label.toLowerCase().includes(kw)
      if (nodeMatches || filteredChildren.length > 0) {
        // 若符合或子孫有符合，則保留此節點
        const newNode: TreeNode = { ...node, children: filteredChildren }
        resultMap.set(node.value, newNode)
      } else {
        // 不符合則記為 null
        resultMap.set(node.value, null)
      }
    }
  }
  
  // 組合根節點的結果
  const filteredRoots: TreeNode[] = []
  for (const node of nodes) {
    const filteredNode = resultMap.get(node.value)
    if (filteredNode) {
      filteredRoots.push(filteredNode)
    }
  }
  return filteredRoots
}

// 計算過濾後的樹狀資料，若無搜尋則直接使用原始資料
const filteredTree = computed(() => {
  if (!searchText.value.trim()) return cascaderOptions
  return iterativeFilterTree(cascaderOptions, searchText.value.trim())
})

// 根據 expandedPath 計算各層面板資料
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

// 當使用者點擊 checkbox 時觸發
function onCheckChange(e: Event, option: TreeNode) {
  const isChecked = (e.target as HTMLInputElement).checked
  toggleCheck(option.value, isChecked)
  syncToParent()
}

// 當滑鼠移入某一選項時更新 expandedPath 以展開下一層面板
function handleMouseEnter(option: TreeNode, levelIndex: number) {
  expandedPath.value = [
    ...expandedPath.value.slice(0, levelIndex),
    option.value
  ]
}
</script>

<style scoped>
.multi-check-cascader {
  position: relative;
  display: inline-block;
  width: 240px;
  font-family: sans-serif;
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

.panel-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.cascader-option {
  padding: 4px 0;
  cursor: pointer;
  white-space: nowrap;
}

.option-index {
  display: inline-block;
  width: 50px;
  color: #888;
}

.option-label {
  margin-left: 4px;
}

.cascader-option:hover {
  background-color: #f5f5f5;
}
</style>
