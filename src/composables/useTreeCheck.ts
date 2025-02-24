// useTreeCheckRecursive.ts
import { ref } from 'vue'

export interface TreeNode {
  value: string | number
  label: string
  children?: TreeNode[]
}

/**
 * useTreeCheckRecursive
 * 用於維護「多選樹」的父子聯動邏輯（包括完全勾選與半選狀態），
 * 此版本採用遞迴方式實作所有功能。
 */
export function useTreeCheckRecursive() {
  // 1. 儲存完全勾選的節點：用 Set 儲存所有被完全選取的節點 value
  const checkedValues = ref<Set<string | number>>(new Set())
  // 2. 儲存半選（indeterminate）節點：當部分子節點被勾選時
  const indeterminateValues = ref<Set<string | number>>(new Set())

  // 3. 儲存每個節點的參考，用來快速取得該節點資料
  const nodeMap = ref<Map<string | number, TreeNode>>(new Map())
  // 4. 儲存每個子節點對應的父節點：用來往上更新父節點狀態
  const parentMap = ref<Map<string | number, string | number>>(new Map())

  /**
   * buildMaps
   * 遞迴遍歷樹狀資料，建立 nodeMap 與 parentMap
   * @param options 傳入的樹狀資料陣列
   * @param parentVal 父節點的 value，初始為 null
   */
  function buildMaps(options: TreeNode[], parentVal: string | number | null = null) {
    for (const node of options) {
      // 儲存節點資料
      nodeMap.value.set(node.value, node)
      // 若有父節點，則記錄該節點的父節點 value
      if (parentVal !== null) {
        parentMap.value.set(node.value, parentVal)
      }
      // 如果節點有子節點，則遞迴處理
      if (node.children && node.children.length) {
        buildMaps(node.children, node.value)
      }
    }
  }

  /**
   * checkNodeAndDescendants
   * 遞迴勾選：設定指定節點及其所有子孫為「完全勾選」
   * @param value 指定節點的 value
   */
  function checkNodeAndDescendants(value: string | number) {
    // 將自己加入完全勾選集合，並移除半選狀態
    checkedValues.value.add(value)
    indeterminateValues.value.delete(value)

    // 取得節點資料
    const node = nodeMap.value.get(value)
    if (node && node.children) {
      // 對每個子節點呼叫自己進行遞迴
      for (const child of node.children) {
        checkNodeAndDescendants(child.value)
      }
    }
  }

  /**
   * uncheckNodeAndDescendants
   * 遞迴取消勾選：取消指定節點及其所有子孫的勾選狀態
   * @param value 指定節點的 value
   */
  function uncheckNodeAndDescendants(value: string | number) {
    // 從完全勾選和半選集合中移除該節點
    checkedValues.value.delete(value)
    indeterminateValues.value.delete(value)

    // 取得節點資料
    const node = nodeMap.value.get(value)
    if (node && node.children) {
      // 遞迴取消所有子節點的勾選
      for (const child of node.children) {
        uncheckNodeAndDescendants(child.value)
      }
    }
  }

  /**
   * updateAncestors
   * 往上更新父節點狀態（完全勾選、半選或取消），採用遞迴方式
   * @param value 當前節點的 value，從此往上找父節點更新
   */
  function updateAncestors(value: string | number) {
    // 取得當前節點的父節點 value
    const pVal = parentMap.value.get(value)
    if (pVal === undefined) return // 若無父節點則停止更新

    // 取得父節點資料
    const parentNode = nodeMap.value.get(pVal)
    if (!parentNode) return

    // 檢查父節點的所有直接子節點狀態
    const children = parentNode.children || []
    let allChecked = true
    let anyChecked = false

    for (const child of children) {
      if (checkedValues.value.has(child.value)) {
        anyChecked = true
      } else {
        allChecked = false
      }
    }

    if (allChecked && children.length > 0) {
      // 若所有子節點均完全勾選，則將父節點設為完全勾選，並清除半選狀態
      checkedValues.value.add(pVal)
      indeterminateValues.value.delete(pVal)
    } else if (anyChecked) {
      // 若僅部分子節點被勾選，則父節點設為半選（indeterminate）
      checkedValues.value.delete(pVal)
      indeterminateValues.value.add(pVal)
    } else {
      // 若沒有子節點被勾選，則父節點取消勾選及半選狀態
      checkedValues.value.delete(pVal)
      indeterminateValues.value.delete(pVal)
    }

    // 遞迴往上更新更高層的父節點
    updateAncestors(pVal)
  }

  /**
   * toggleCheck
   * 當使用者點擊 checkbox 時，根據 isChecked 勾選或取消
   * @param value 指定節點的 value
   * @param isChecked 是否勾選（true：勾選；false：取消勾選）
   */
  function toggleCheck(value: string | number, isChecked: boolean) {
    if (isChecked) {
      checkNodeAndDescendants(value)
    } else {
      uncheckNodeAndDescendants(value)
    }
    // 完成後往上更新父節點狀態
    updateAncestors(value)
  }

  /**
   * rebuildAllStates
   * 當外部 v-model 變動時，重建整棵樹的父子聯動狀態
   * 做法：先將目前完全勾選集合取出，清空所有狀態，
   * 然後針對取出的節點重新勾選並更新其祖先
   */
  function rebuildAllStates() {
    const oldChecked = Array.from(checkedValues.value)
    // 清空所有狀態
    checkedValues.value.clear()
    indeterminateValues.value.clear()
    // 依序重新勾選每個原本被勾選的節點（包含所有子孫）
    for (const val of oldChecked) {
      checkNodeAndDescendants(val)
    }
    // 重新往上更新父節點狀態
    for (const val of oldChecked) {
      updateAncestors(val)
    }
  }

  return {
    checkedValues,
    indeterminateValues,
    nodeMap,
    parentMap,
    buildMaps,
    checkNodeAndDescendants,
    uncheckNodeAndDescendants,
    updateAncestors,
    toggleCheck,
    rebuildAllStates
  }
}
