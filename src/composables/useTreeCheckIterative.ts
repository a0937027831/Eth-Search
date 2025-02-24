import { ref } from 'vue'

export interface TreeNode {
  value: string | number
  label: string
  children?: TreeNode[]
}

/**
 * useTreeCheckIterative
 * 用於維護「多選樹」的父子聯動邏輯（checked / indeterminate），
 * 此版本採用迭代方式（非遞迴）實作各項功能。
 */
export function useTreeCheckIterative() {
  // 儲存完全勾選的節點集合
  const checkedValues = ref<Set<string | number>>(new Set())
  // 儲存半選（indeterminate）節點集合
  const indeterminateValues = ref<Set<string | number>>(new Set())

  // 建立 value -> node 的快取
  const nodeMap = ref<Map<string | number, TreeNode>>(new Map())
  // 建立 childValue -> parentValue 的快取
  const parentMap = ref<Map<string | number, string | number>>(new Map())

  /**
   * buildMapsIterative
   * 以迭代方式建立樹狀結構的對照表（nodeMap 與 parentMap）
   * @param options 傳入的樹狀資料陣列
   */
  function buildMapsIterative(options: TreeNode[]) {
    // 使用堆疊處理，初始堆疊放入所有根節點
    const stack: { node: TreeNode; parent: string | number | null }[] = []
    for (const node of options) {
      stack.push({ node, parent: null })
    }
    // 當堆疊不空時，持續彈出元素
    while (stack.length > 0) {
      const { node, parent } = stack.pop()!
      nodeMap.value.set(node.value, node)
      if (parent !== null) {
        parentMap.value.set(node.value, parent)
      }
      // 將該節點的所有子節點推入堆疊，設定其父節點為當前節點的 value
      if (node.children && node.children.length) {
        for (const child of node.children) {
          stack.push({ node: child, parent: node.value })
        }
      }
    }
  }

  /**
   * checkNodeAndDescendantsIterative
   * 以迭代方式勾選指定節點及其所有子孫
   * @param value 指定節點的 value
   */
  function checkNodeAndDescendantsIterative(value: string | number) {
    // 使用堆疊進行迭代
    const stack: (string | number)[] = [value]
    while (stack.length > 0) {
      const current = stack.pop()!
      // 標記當前節點為完全勾選，並移除半選狀態
      checkedValues.value.add(current)
      indeterminateValues.value.delete(current)
      // 取得當前節點，若有子節點，全部推入堆疊中
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
   * 以迭代方式取消指定節點及其所有子孫的勾選狀態
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
   * 以迭代方式往上更新父節點狀態：
   * 若所有直接子節點都勾選，則父節點完全勾選；
   * 若部分勾選，則父節點設為半選；
   * 否則取消父節點的選取狀態。
   * @param value 從當前節點開始往上更新
   */
  function updateAncestorsIterative(value: string | number) {
    // 取得當前節點的父節點 value，若有則持續更新
    let current = value
    while (true) {
      const pVal = parentMap.value.get(current)
      if (pVal === undefined) break  // 無父節點，結束
      const parentNode = nodeMap.value.get(pVal)
      if (!parentNode) break

      // 檢查父節點所有直接子節點狀態
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
   * 當使用者點擊 checkbox 時，根據 isChecked 採用迭代方式進行勾選或取消，
   * 並往上更新父節點狀態。
   * @param value 指定節點的 value
   * @param isChecked 是否勾選
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
   * 重建整棵樹的狀態：清空目前狀態後，對原有被勾選節點逐一以迭代方式重建，
   * 包括更新所有子孫與父節點的狀態。
   */
  function rebuildAllStatesIterative() {
    const oldChecked = Array.from(checkedValues.value)
    // 清空所有狀態
    checkedValues.value.clear()
    indeterminateValues.value.clear()
    // 逐一以迭代方式重新勾選每個原先被勾選的節點
    for (const val of oldChecked) {
      checkNodeAndDescendantsIterative(val)
    }
    // 逐一向上更新父節點狀態
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
