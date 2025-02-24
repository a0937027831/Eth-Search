// useTreeCheckIterative.ts
import { ref } from 'vue'

export interface TreeNode {
  value: string | number
  label: string
  children?: TreeNode[]
}

/**
 * useTreeCheckIterative
 * 用於維護「多選樹」的父子聯動邏輯（完全勾選與半選狀態），
 * 採用迭代（非遞迴）的方式實作，透過堆疊（Stack）來遍歷樹節點。
 */
export function useTreeCheckIterative() {
  // 1. 儲存完全勾選的節點集合
  const checkedValues = ref<Set<string | number>>(new Set())
  // 2. 儲存半選（indeterminate）狀態的節點集合
  const indeterminateValues = ref<Set<string | number>>(new Set())
  
  // 3. 建立 value -> node 的快取，方便快速查詢節點資料
  const nodeMap = ref<Map<string | number, TreeNode>>(new Map())
  // 4. 建立 childValue -> parentValue 的快取，用於向上更新父節點狀態
  const parentMap = ref<Map<string | number, string | number>>(new Map())
  
  /**
   * buildMapsIterative
   * 以迭代方式建立樹狀結構的快取（nodeMap 與 parentMap）。
   * 使用堆疊來遍歷所有節點，將根節點及其子節點逐一處理。
   * @param options 傳入的樹狀資料陣列
   */
  function buildMapsIterative(options: TreeNode[]) {
    // 初始化堆疊：每個元素包含 node 與其父節點（若無父則為 null）
    const stack: { node: TreeNode; parent: string | number | null }[] = []
    for (const node of options) {
      stack.push({ node, parent: null })
    }
    while (stack.length > 0) {
      const { node, parent } = stack.pop()!
      nodeMap.value.set(node.value, node)
      if (parent !== null) {
        parentMap.value.set(node.value, parent)
      }
      // 將該節點的所有子節點推入堆疊中，設定其父節點為當前節點的 value
      if (node.children && node.children.length) {
        for (const child of node.children) {
          stack.push({ node: child, parent: node.value })
        }
      }
    }
  }
  
  /**
   * checkNodeAndDescendantsIterative
   * 以迭代方式（利用堆疊）將指定節點及其所有子孫標記為完全勾選，
   * 並移除其半選狀態。
   * @param value 指定節點的 value
   */
  function checkNodeAndDescendantsIterative(value: string | number) {
    const stack: (string | number)[] = [value]
    while (stack.length > 0) {
      const current = stack.pop()!
      checkedValues.value.add(current)
      indeterminateValues.value.delete(current)
      const node = nodeMap.value.get(current)
      if (node && node.children) {
        for (const child of node.children) {
          stack.push(child.value)
        }
      }
    }
  }
  
  /**
   * uncheckNodeAndDescendantsIterative
   * 以迭代方式取消指定節點及其所有子孫的勾選狀態，
   * 從完全勾選與半選集合中移除。
   * @param value 指定節點的 value
   */
  function uncheckNodeAndDescendantsIterative(value: string | number) {
    const stack: (string | number)[] = [value]
    while (stack.length > 0) {
      const current = stack.pop()!
      // 取消當前節點的勾選及半選狀態
      checkedValues.value.delete(current)
      indeterminateValues.value.delete(current)
      const node = nodeMap.value.get(current)
      if (node && node.children) {
        for (const child of node.children) {
          stack.push(child.value)
        }
      }
    }
  }
  
  /**
   * updateAncestorsIterative
   * 以迭代方式從當前節點向上更新父節點的狀態：
   * - 若所有直接子節點均完全勾選，則父節點設為完全勾選；
   * - 若部分子節點被勾選，則父節點設為半選；
   * - 否則取消父節點的勾選與半選狀態。
   * @param value 從當前節點開始向上更新
   */
  function updateAncestorsIterative(value: string | number) {
    let current = value
    while (true) {
      const pVal = parentMap.value.get(current)
      if (pVal === undefined) break  // 無父節點，結束更新
      const parentNode = nodeMap.value.get(pVal)
      if (!parentNode) break

      const children = parentNode.children || []
      let allChecked = true
      let anyChecked = false
      // 檢查父節點所有直接子節點的勾選狀態
      for (const child of children) {
        if (checkedValues.value.has(child.value)) {
          anyChecked = true
        } else {
          allChecked = false
        }
      }
      if (allChecked && children.length > 0) {
        checkedValues.value.add(pVal)
        indeterminateValues.value.delete(pVal)
      } else if (anyChecked) {
        checkedValues.value.delete(pVal)
        indeterminateValues.value.add(pVal)
      } else {
        checkedValues.value.delete(pVal)
        indeterminateValues.value.delete(pVal)
      }
      // 將當前節點更新為父節點，繼續向上迭代
      current = pVal
    }
  }
  
  /**
   * toggleCheckIterative
   * 當使用者點擊 checkbox 時，根據 isChecked 採用迭代方式處理：
   * 1. 若勾選，則以迭代方式標記當前節點及所有子孫為完全勾選。
   * 2. 若取消勾選，則以迭代方式取消當前節點及所有子孫的狀態。
   * 3. 最後向上更新所有父節點的狀態。
   * @param value 指定節點的 value
   * @param isChecked 是否勾選（true 為勾選，false 為取消）
   */
  function toggleCheckIterative(value: string | number, isChecked: boolean) {
    if (isChecked) {
      checkNodeAndDescendantsIterative(value)
    } else {
      uncheckNodeAndDescendantsIterative(value)
    }
    updateAncestorsIterative(value)
  }
  
  /**
   * rebuildAllStatesIterative
   * 重建整棵樹的狀態：先記錄目前完全勾選的節點，再清空所有狀態，
   * 之後以迭代方式重新勾選每個原先被勾選的節點，並更新其父節點狀態。
   */
  function rebuildAllStatesIterative() {
    const oldChecked = Array.from(checkedValues.value)
    checkedValues.value.clear()
    indeterminateValues.value.clear()
    for (const val of oldChecked) {
      checkNodeAndDescendantsIterative(val)
    }
    for (const val of oldChecked) {
      updateAncestorsIterative(val)
    }
  }
  
  return {
    // 狀態集合
    checkedValues,
    indeterminateValues,
    // 快取映射
    nodeMap,
    parentMap,
    // 方法（迭代版本）
    buildMaps: buildMapsIterative,
    checkNodeAndDescendants: checkNodeAndDescendantsIterative,
    uncheckNodeAndDescendants: uncheckNodeAndDescendantsIterative,
    updateAncestors: updateAncestorsIterative,
    toggleCheck: toggleCheckIterative,
    rebuildAllStates: rebuildAllStatesIterative
  }
}
