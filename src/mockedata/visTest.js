
function getNodes (id){
  // 每三個節點有一個是特殊節點（不固定）
  const isSpecialNode = id % 3 === 1;
  
  return {
    id: id.toString(),
    label: isSpecialNode ? `特殊節點${id}` : `一般節點${id}`,
    tooltip: '123145679',
    type: isSpecialNode ? 'special' : 'normal',
    nodeType: isSpecialNode ? 'special' : 'normal', // 用於識別節點類型
    x: null,
    y: null,
    margin: {
      top: 24,
    },
    color: {
      border: "transparent",
      background: isSpecialNode ? "#ff6b6b" : "#58d196", // 特殊節點紅色，一般節點綠色
    },
    shape: isSpecialNode ? 'diamond' : 'dot', // 特殊節點菱形，一般節點圓形
    shapeProperties: {
      useBorderWithImage: true,
    },
    icon: {
      face: 'FontAwesome',
      weight: 900,
      size: 40,
    },
    font: {
      color: '#ffffff',
      face: "courier",
      size: 12,
    },
    data: {
      id: id.toString(),
      address: id.toString(),
      label: '',
      type:  '',
      x: 0,
      y: 0,
      is_comment: false,
      blockchain: '',
    },
    fixed: !isSpecialNode, // 一般節點固定，特殊節點不固定
    mass: isSpecialNode ? 1 : 1.5, // 一般節點質量稍大
  }
}


function getEdge(id){
  return {
    id: id,
    from: id.toString(),
    to: (id-1).toString(),
    type: '',
    time: new Date(),
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5, // Set arrowScale to 0 to position the arrow precisely at the end of the edge
        type: "arrow",
      },
    },
    tooltip: 'tooltip',
    label: 'label'+id.toString(),
    color: {
      color: '#BABABA',
      highlight: '#ff5722',
    },
    font: {
      align: 'middle',
      multi: true,
      color: 'black',
      strokeWidth: 4,
      strokeColor: 'white',
      face: 'Arial',
    },
    smooth: false,
    width: 1,
    select_type: 'select_transfers',
    hidden: false,
    group_id: id.toString(),
    // 傳給後端save graph 全部放入data裡
  }


}

// 創建一般節點（固定）
export function createNormalNode(id, position = {}) {
  return {
    id: id.toString(),
    label: `一般節點${id}`,
    nodeType: 'normal',
    shape: 'dot',
    size: 25,
    color: {
      border: "#2B7CE9",
      background: "#58d196",
      highlight: {
        border: "#2B7CE9",
        background: "#7BE0AD"
      }
    },
    fixed: true, // 默認固定
    physics: true,
    font: {
      color: '#ffffff',
      size: 14,
      face: 'arial'
    },
    borderWidth: 2,
    ...position // 如果提供了位置
  };
}

// 創建特殊節點（不固定）
export function createSpecialNode(id, position = {}) {
  return {
    id: id.toString(),
    label: `特殊節點${id}`,
    nodeType: 'special',
    shape: 'diamond',
    size: 30,
    color: {
      border: "#C62828",
      background: "#ff6b6b",
      highlight: {
        border: "#C62828",
        background: "#ff9999"
      }
    },
    fixed: false, // 永遠不固定
    physics: true,
    font: {
      color: '#ffffff',
      size: 14,
      face: 'arial'
    },
    borderWidth: 2,
    ...position // 如果提供了位置
  };
}

export function createNodesList(){
  let list = {
    nodes: [],
    edges: [], 
  };
  for(let i = 0 ;  i< 11 ; i++){
    list.nodes.push(getNodes(i))
    if(i != 0){
      list.edges.push(getEdge(i))
    }
  }
  return list
}


