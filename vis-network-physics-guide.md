# vis-network 物理引擎完整參數指南

vis-network 提供了強大的物理引擎來模擬節點和邊的動態行為。本文檔詳細說明所有可調整的物理引擎參數。

## 目錄

1. [基礎設定](#基礎設定)
2. [求解器 (Solvers)](#求解器-solvers)
   - [BarnesHut](#barneshut)
   - [ForceAtlas2Based](#forceatlas2based)
   - [Repulsion](#repulsion)
   - [HierarchicalRepulsion](#hierarchicalrepulsion)
3. [全域參數](#全域參數)
4. [穩定化設定](#穩定化設定)
5. [風力設定](#風力設定)
6. [節點特定設定](#節點特定設定)
7. [邊特定設定](#邊特定設定)
8. [實用範例](#實用範例)

---

## 基礎設定

### physics.enabled
- **類型**: `Boolean`
- **預設值**: `true`
- **說明**: 啟用或停用物理模擬系統

```javascript
physics: {
  enabled: true  // 啟用物理引擎
}
```

### physics.solver
- **類型**: `String`
- **預設值**: `'barnesHut'`
- **可選值**: `'barnesHut'`, `'forceAtlas2Based'`, `'repulsion'`, `'hierarchicalRepulsion'`
- **說明**: 選擇使用的物理求解器

```javascript
physics: {
  solver: 'barnesHut'  // 使用 Barnes-Hut 算法
}
```

---

## 求解器 (Solvers)

### BarnesHut

Barnes-Hut 是基於四叉樹的重力模型，是最快速且預設推薦的求解器。

#### barnesHut.theta
- **類型**: `Number`
- **預設值**: `0.5`
- **說明**: 決定長距離力整合和短距離力個別計算的邊界。值越高越快但誤差越大

#### barnesHut.gravitationalConstant
- **類型**: `Number`
- **預設值**: `-2000`
- **說明**: 重力常數。負值產生斥力，數值越小（如 -10000）斥力越強

#### barnesHut.centralGravity
- **類型**: `Number`
- **預設值**: `0.3`
- **說明**: 中心引力，將整個網絡拉向中心的力量

#### barnesHut.springLength
- **類型**: `Number`
- **預設值**: `95`
- **說明**: 邊的彈簧靜止長度

#### barnesHut.springConstant
- **類型**: `Number`
- **預設值**: `0.04`
- **說明**: 彈簧強度。值越高彈簧越堅固

#### barnesHut.damping
- **類型**: `Number`
- **預設值**: `0.09`
- **範圍**: `[0 .. 1]`
- **說明**: 阻尼係數，決定前一次迭代的速度有多少傳遞到下一次

#### barnesHut.avoidOverlap
- **類型**: `Number`
- **預設值**: `0`
- **範圍**: `[0 .. 1]`
- **說明**: 避免節點重疊。大於 0 時考慮節點大小，1 為最大避免重疊

```javascript
physics: {
  solver: 'barnesHut',
  barnesHut: {
    theta: 0.5,
    gravitationalConstant: -5000,
    centralGravity: 0.1,
    springLength: 150,
    springConstant: 0.02,
    damping: 0.5,
    avoidOverlap: 0.5
  }
}
```

### ForceAtlas2Based

ForceAtlas2 是由 Jacomi 等人（2014）為 Gephi 開發的求解器。

#### forceAtlas2Based.theta
- **類型**: `Number`
- **預設值**: `0.5`
- **說明**: 與 barnesHut.theta 相同

#### forceAtlas2Based.gravitationalConstant
- **類型**: `Number`
- **預設值**: `-50`
- **說明**: 類似 barnesHut，但使用線性衰減而非二次方

#### forceAtlas2Based.centralGravity
- **類型**: `Number`
- **預設值**: `0.01`
- **說明**: 與距離無關的中心引力

#### forceAtlas2Based.springConstant
- **類型**: `Number`
- **預設值**: `0.08`
- **說明**: 彈簧強度

#### forceAtlas2Based.springLength
- **類型**: `Number`
- **預設值**: `100`
- **說明**: 彈簧靜止長度

#### forceAtlas2Based.damping
- **類型**: `Number`
- **預設值**: `0.4`
- **說明**: 阻尼係數

#### forceAtlas2Based.avoidOverlap
- **類型**: `Number`
- **預設值**: `0`
- **範圍**: `[0 .. 1]`
- **說明**: 避免節點重疊

```javascript
physics: {
  solver: 'forceAtlas2Based',
  forceAtlas2Based: {
    theta: 0.5,
    gravitationalConstant: -100,
    centralGravity: 0.005,
    springConstant: 0.05,
    springLength: 150,
    damping: 0.5,
    avoidOverlap: 0.8
  }
}
```

### Repulsion

簡單的斥力模型，節點周圍有簡化的斥力場。

#### repulsion.nodeDistance
- **類型**: `Number`
- **預設值**: `100`
- **說明**: 斥力的影響範圍

#### repulsion.centralGravity
- **類型**: `Number`
- **預設值**: `0.2`
- **說明**: 中心引力

#### repulsion.springLength
- **類型**: `Number`
- **預設值**: `200`
- **說明**: 彈簧靜止長度

#### repulsion.springConstant
- **類型**: `Number`
- **預設值**: `0.05`
- **說明**: 彈簧強度

#### repulsion.damping
- **類型**: `Number`
- **預設值**: `0.09`
- **說明**: 阻尼係數

```javascript
physics: {
  solver: 'repulsion',
  repulsion: {
    centralGravity: 0.2,
    springLength: 200,
    springConstant: 0.05,
    nodeDistance: 100,
    damping: 0.09
  }
}
```

### HierarchicalRepulsion

專為階層佈局設計的斥力模型。

#### hierarchicalRepulsion.nodeDistance
- **類型**: `Number`
- **預設值**: `120`
- **說明**: 節點間最小距離

#### hierarchicalRepulsion.centralGravity
- **類型**: `Number`
- **預設值**: `0.0`
- **說明**: 中心引力（通常為 0）

#### hierarchicalRepulsion.springLength
- **類型**: `Number`
- **預設值**: `100`
- **說明**: 彈簧靜止長度

#### hierarchicalRepulsion.springConstant
- **類型**: `Number`
- **預設值**: `0.01`
- **說明**: 彈簧強度

#### hierarchicalRepulsion.damping
- **類型**: `Number`
- **預設值**: `0.09`
- **說明**: 阻尼係數

#### hierarchicalRepulsion.avoidOverlap
- **類型**: `Number`
- **預設值**: `0`
- **範圍**: `[0 .. 1]`
- **說明**: 避免節點重疊

```javascript
physics: {
  solver: 'hierarchicalRepulsion',
  hierarchicalRepulsion: {
    nodeDistance: 120,
    centralGravity: 0.0,
    springLength: 100,
    springConstant: 0.01,
    damping: 0.09,
    avoidOverlap: 0.5
  }
}
```

---

## 全域參數

### physics.maxVelocity
- **類型**: `Number`
- **預設值**: `50`
- **說明**: 節點的最大速度限制，有助於穩定化

### physics.minVelocity
- **類型**: `Number`
- **預設值**: `0.1`
- **說明**: 當所有節點速度低於此值時，認為網絡已穩定

### physics.timestep
- **類型**: `Number`
- **預設值**: `0.5`
- **說明**: 物理模擬的時間步長。值越小越精確但越慢

### physics.adaptiveTimestep
- **類型**: `Boolean`
- **預設值**: `true`
- **說明**: 根據模擬進度動態調整時間步長

```javascript
physics: {
  maxVelocity: 25,
  minVelocity: 0.75,
  timestep: 0.35,
  adaptiveTimestep: true
}
```

---

## 穩定化設定

### physics.stabilization.enabled
- **類型**: `Boolean`
- **預設值**: `true`
- **說明**: 啟用或停用穩定化階段

### physics.stabilization.iterations
- **類型**: `Number`
- **預設值**: `1000`
- **說明**: 穩定化的最大迭代次數

### physics.stabilization.updateInterval
- **類型**: `Number`
- **預設值**: `50`
- **說明**: 觸發 `stabilizationProgress` 事件的間隔（毫秒）

### physics.stabilization.onlyDynamicEdges
- **類型**: `Boolean`
- **預設值**: `false`
- **說明**: 只穩定動態平滑邊，凍結所有節點

### physics.stabilization.fit
- **類型**: `Boolean`
- **預設值**: `true`
- **說明**: 穩定化完成後是否自動縮放視圖以適應所有節點

```javascript
physics: {
  stabilization: {
    enabled: true,
    iterations: 3000,
    updateInterval: 100,
    onlyDynamicEdges: false,
    fit: true
  }
}
```

---

## 風力設定

### physics.wind
- **類型**: `Object`
- **說明**: 對所有非固定節點施加的風力

#### wind.x
- **類型**: `Number`
- **預設值**: `0`
- **說明**: X 方向的風力（正值向右，負值向左）

#### wind.y
- **類型**: `Number`
- **預設值**: `0`
- **說明**: Y 方向的風力（正值向下，負值向上）

```javascript
physics: {
  wind: {
    x: 2,
    y: 0
  }
}
```

**注意**: 使用風力時，需要有固定節點作為錨點，否則節點會無限移動。

---

## 節點特定設定

每個節點可以有自己的物理屬性：

### node.fixed
- **類型**: `Boolean` 或 `Object`
- **預設值**: `false`
- **說明**: 節點是否固定位置

```javascript
// 完全固定
node.fixed = true;

// 分別控制 X 和 Y 軸
node.fixed = {
  x: true,   // X 軸固定
  y: false   // Y 軸可移動
};
```

### node.mass
- **類型**: `Number`
- **預設值**: `1`
- **說明**: 節點質量。質量越大，斥力越強

### node.physics
- **類型**: `Boolean`
- **預設值**: `true`
- **說明**: 節點是否參與物理模擬

```javascript
// 節點定義範例
{
  id: 1,
  label: 'Node 1',
  fixed: { x: true, y: false },
  mass: 2,
  physics: true
}
```

---

## 邊特定設定

### edge.length
- **類型**: `Number`
- **預設值**: `undefined`
- **說明**: 覆蓋邊的彈簧長度

### edge.physics
- **類型**: `Boolean`
- **預設值**: `true`
- **說明**: 邊是否作為彈簧參與物理模擬

```javascript
// 邊定義範例
{
  from: 1,
  to: 2,
  length: 200,
  physics: true
}
```

---

## 實用範例

### 1. 高穩定性配置

```javascript
const stableOptions = {
  physics: {
    enabled: true,
    solver: 'barnesHut',
    barnesHut: {
      theta: 0.5,
      gravitationalConstant: -5000,
      centralGravity: 0.1,
      springLength: 150,
      springConstant: 0.02,
      damping: 0.5,
      avoidOverlap: 0.5
    },
    maxVelocity: 25,
    minVelocity: 0.75,
    timestep: 0.35,
    adaptiveTimestep: true,
    stabilization: {
      enabled: true,
      iterations: 3000,
      updateInterval: 100,
      fit: true
    }
  }
};
```

### 2. 快速佈局配置

```javascript
const fastOptions = {
  physics: {
    enabled: true,
    solver: 'forceAtlas2Based',
    forceAtlas2Based: {
      gravitationalConstant: -200,
      centralGravity: 0.01,
      springConstant: 0.1,
      damping: 0.3
    },
    maxVelocity: 150,
    minVelocity: 5,
    timestep: 0.8,
    stabilization: {
      iterations: 500,
      fit: true
    }
  }
};
```

### 3. 階層佈局配置

```javascript
const hierarchicalOptions = {
  layout: {
    hierarchical: {
      enabled: true,
      direction: 'UD',
      sortMethod: 'directed',
      levelSeparation: 150,
      nodeSpacing: 100
    }
  },
  physics: {
    solver: 'hierarchicalRepulsion',
    hierarchicalRepulsion: {
      nodeDistance: 150,
      springLength: 120,
      springConstant: 0.01,
      damping: 0.09
    }
  }
};
```

### 4. 監聽穩定化事件

```javascript
network.on("startStabilizing", function () {
  console.log("開始穩定化...");
});

network.on("stabilizationProgress", function (params) {
  const progress = params.iterations / params.total * 100;
  console.log(`穩定化進度: ${progress.toFixed(2)}%`);
});

network.on("stabilized", function (params) {
  console.log(`穩定化完成！總迭代次數: ${params.iterations}`);
});
```

### 5. 動態控制物理引擎

```javascript
// 停止物理模擬
network.stopSimulation();

// 重新啟動物理模擬
network.startSimulation();

// 手動執行穩定化
network.stabilize(1000);

// 動態更改物理設定
network.setOptions({
  physics: {
    enabled: false
  }
});
```

---

## 最佳實踐建議

1. **穩定性優先**: 增加 `damping`，降低 `maxVelocity` 和 `timestep`
2. **性能優先**: 減少 `stabilization.iterations`，增加 `minVelocity`
3. **避免抖動**: 使用較小的 `timestep` 和較高的 `damping`
4. **大型網絡**: 考慮使用 `barnesHut` 求解器並調整 `theta` 值
5. **固定佈局**: 使用 `fixed` 節點作為錨點來穩定整體結構

---

## 除錯技巧

1. 使用 `stabilizationProgress` 事件監控穩定化過程
2. 暫時停用物理引擎來檢查初始佈局
3. 逐步調整參數，一次只改變一個
4. 使用 `console.log` 記錄節點位置和速度
5. 考慮使用配置面板進行實時調整

```javascript
// 啟用配置面板
const options = {
  configure: {
    enabled: true,
    filter: 'physics',
    container: document.getElementById('config')
  }
};
```