
function getNodes (id){
  return {
    id: id.toString(),
    lable:'node'+ id.toString(),
    tooltip: '123145679',
    type: 'test',
    x: null,
    y: null,
    margin: {
      top: 24,
    },
    color: {
      border: "transparent",
      background: "#58d196",
    },
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

export function createNodesList(){
  let list = {
    nodes: [],
    edges: [], 
  };
  for(let i = 0 ;  i< 1000 ; i++){
    list.nodes.push(getNodes(i))
    if(i != 0){
      list.edges.push(getEdge(i))
    }
  }
  return list
}


