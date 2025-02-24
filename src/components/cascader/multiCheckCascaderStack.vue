<template>
  <div class="multi-check-cascader">
    <!-- 顯示選擇結果，點擊可展開下拉面板 -->
    <div class="cascader-selection" @click="toggleDropdown">
      <span v-if="checkedValues.size === 0">{{ placeholder }}</span>
      <span v-else>已選 {{ checkedValues.size }} 項</span>
    </div>

    <!-- 下拉面板：包含搜尋框及多欄選項 -->
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

      <!-- 多欄面板：根據 expandedPath 動態產生每一層選項 -->
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
            <div class="option-index">選項 {{ index }}</div>
            <!-- 多選 checkbox：透過 v-indeterminate 指令設定半選狀態 -->
            <input
              type="checkbox"
              :checked="checkedValues.has(option.value)"
              @change="onCheckChange($event, option)"
              v-indeterminate="indeterminateValues.has(option.value)"
            />
            <span class="option-label">{{ option.label }}</span>
            <!-- 若有子節點，顯示箭頭 -->
            <span v-if="option.children && option.children.length"> &gt; </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTreeCheckIterative, TreeNode } from '@/composables/useTreeCheckIterative'
import { IndeterminateDirective } from '@/utils/v-indeterminate'

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
// 假設這裡的 options 為傳入的樹狀資料
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

// placeholder 文案
const placeholder = '請選擇'

// 控制下拉面板是否展開
const isOpen = ref(false)
function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// 搜尋文字
const searchText = ref('')

// 展開路徑：用來記錄各層當前選擇，決定右側多欄的顯示
const expandedPath = ref<(string | number)[]>([])

// 使用 iterative 版本的父子聯動邏輯
const {
  checkedValues,
  indeterminateValues,
  buildMaps,
  toggleCheck,
  rebuildAllStates
} = useTreeCheckIterative()

// 建立 nodeMap 與 parentMap：利用迭代方法（stack）遍歷樹
onMounted(() => {
  buildMaps(cascaderOptions)
  // 若有預設值，可在此處同步 checkedValues，這裡假設初始為空
})

// 搜尋功能：若 searchText 非空，則過濾出符合的節點及其祖先
const filteredTree = computed(() => {
  if (!searchText.value.trim()) return cascaderOptions
  const kw = searchText.value.trim().toLowerCase()
  function filterNodes(nodes: TreeNode[]): TreeNode[] {
    const res: TreeNode[] = []
    for (const node of nodes) {
      const labelMatch = node.label.toLowerCase().includes(kw)
      let childrenMatch: TreeNode[] = []
      if (node.children && node.children.length) {
        childrenMatch = filterNodes(node.children)
      }
      if (labelMatch || childrenMatch.length > 0) {
        res.push({ ...node, children: childrenMatch })
      }
    }
    return res
  }
  return filterNodes(cascaderOptions)
})

// 根據 expandedPath 建立每一層的欄位（columns）
// 例如：第一欄為根節點，第二欄為根節點中被展開的子節點，以此類推
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

// 當使用者點擊 checkbox 時觸發（利用 iterative 的 toggleCheck，內部使用 stack 遍歷子孫）
function onCheckChange(e: Event, option: TreeNode) {
  const isChecked = (e.target as HTMLInputElement).checked
  toggleCheck(option.value, isChecked)
}

// 當滑鼠移入某個選項時，更新 expandedPath 以展開下一欄
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
