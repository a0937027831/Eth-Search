// useTreeCheck.ts
import { Ref, ref } from 'vue'

export interface TreeNode {
  value: string | number
  label: string
  children?: TreeNode[]
}

/**
 * useTreeCheck
 * 用於維護「多選樹」的父子聯動邏輯 (checked / indeterminate)。
 */
export function useTreeCheck() {
  // 「完全勾選」的節點集合
  const checkedValues = ref<Set<string | number>>(new Set())
  // 「半選」的節點集合
  const indeterminateValues = ref<Set<string | number>>(new Set())

  // value -> node 的快取
  const nodeMap = ref<Map<string | number, TreeNode>>(new Map())
  // childValue -> parentValue 的快取，用於往上更新
  const parentMap = ref<Map<string | number, string | number>>(new Map())

  /**
   * 建立樹狀結構的對照 (nodeMap, parentMap)
   * @param options 傳入的樹狀資料
   * @param parentVal 父節點的 value (遞迴時使用)
   */
  function buildMaps(options: TreeNode[], parentVal: string | number | null = null) {
    for (const node of options) {
      nodeMap.value.set(node.value, node)
      if (parentVal !== null) {
        parentMap.value.set(node.value, parentVal)
      }
      if (node.children && node.children.length) {
        buildMaps(node.children, node.value)
      }
    }
  }

  /**
   * 勾選：自己 + 所有子孫
   */
  function checkNodeAndDescendants(value: string | number) {
    checkedValues.value.add(value)
    indeterminateValues.value.delete(value)

    const node = nodeMap.value.get(value)
    if (node && node.children) {
      for (const child of node.children) {
        checkNodeAndDescendants(child.value)
      }
    }
  }

  /**
   * 取消勾選：自己 + 所有子孫
   */
  function uncheckNodeAndDescendants(value: string | number) {
    checkedValues.value.delete(value)
    indeterminateValues.value.delete(value)

    const node = nodeMap.value.get(value)
    if (node && node.children) {
      for (const child of node.children) {
        uncheckNodeAndDescendants(child.value)
      }
    }
  }

  /**
   * 往上更新父節點的狀態
   *  - 若全部子節點都勾 => 父節點勾
   *  - 若部分子節點勾 => 父節點半選
   *  - 若無子節點勾 => 父節點取消
   */
  function updateAncestors(value: string | number) {
    const pVal = parentMap.value.get(value)
    if (pVal === undefined) return // 沒有父節點

    const parentNode = nodeMap.value.get(pVal)
    if (!parentNode) return

    // 檢查所有子
    const children = parentNode.children || []
    let allChecked = true
    let anyChecked = false

    for (const c of children) {
      if (checkedValues.value.has(c.value)) {
        anyChecked = true
      } else {
        allChecked = false
      }
    }

    if (allChecked && children.length > 0) {
      // 全子節點都被勾選
      checkedValues.value.add(pVal)
      indeterminateValues.value.delete(pVal)
    } else if (anyChecked) {
      // 部分子節點被勾
      checkedValues.value.delete(pVal)
      indeterminateValues.value.add(pVal)
    } else {
      // 完全沒子被勾
      checkedValues.value.delete(pVal)
      indeterminateValues.value.delete(pVal)
    }

    // 往上遞迴
    updateAncestors(pVal)
  }

  /**
   * 當使用者點擊 checkbox 時，勾選或取消
   */
  function toggleCheck(value: string | number, isChecked: boolean) {
    if (isChecked) {
      checkNodeAndDescendants(value)
    } else {
      uncheckNodeAndDescendants(value)
    }
    // 往上更新
    updateAncestors(value)
  }

  /**
   * 重建整棵樹的狀態 (當外部 v-model 變動時)
   * - 先清空，再對現有 checkedValues 逐一重建
   */
  function rebuildAllStates() {
    const oldChecked = Array.from(checkedValues.value)
    // 1. 清空
    checkedValues.value.clear()
    indeterminateValues.value.clear()

    // 2. 重新勾選
    for (const val of oldChecked) {
      checkNodeAndDescendants(val)
    }
    // 3. 重新往上更新
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
