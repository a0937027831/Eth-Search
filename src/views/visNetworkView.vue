<template>
  <h1>hello</h1>
  <!-- <v-btn @click="addNote">add note</v-btn> -->
  <v-btn @click="addBigData">add node</v-btn>
  <v-btn @click="addNormalNode" color="green">新增一般節點</v-btn>
  <v-btn @click="addSpecialNode" color="red">新增特殊節點</v-btn>
  <v-btn @click="togglePhysics">{{ physicsEnabled ? '停止物理模擬' : '啟動物理模擬' }}</v-btn>
  <v-btn @click="stabilizeNetwork">手動穩定網絡</v-btn>
  <div class="network-wrapper" ref="visContainerDom"></div>
</template>
<script setup>
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { onMounted, ref } from "vue";
import { createNodesList, createNormalNode, createSpecialNode } from '@/mockedata/visTest'
import * as _ from 'lodash'


const visContainerDom = ref(null);
var network = null;
const physicsEnabled = ref(true);

const datas = {
  nodes: new DataSet(),
  edges: new DataSet(),
  summary: {}
}


const id = ref(0)
const draggedNodeId = ref(null) // 記錄正在拖曳的節點ID



const defaultNetworkOptions = {
  width: "calc(100% - 5px)",
  height: '100%',
  interaction: {
      hover: true,
      hoverConnectedEdges: false,
      navigationButtons: true,
      hideEdgesOnDrag: false,
      // keyboard: true,
      multiselect: true,
  },
  nodes: {
    chosen: {
      node: (values, id, selected, hovering) => {
        if (selected) {
          if(id.includes('comment')){
            values.shadow = true
            values.shadowColor = '#C0C0C0'
            values.shadowX = 0
            values.shadowY = 0
          }else{
            values.shadow = true
            values.shadowColor = '#FF0000'
            values.shadowX = 0
            values.shadowY = 0
          }
        }
      }
    },
  },
  manipulation: {
    enabled: true,
    addNode: false,
    addEdge:  (data, callback) => {
      this.checkEdgeValid(data,callback);
    },
    editNode: function (data, callback) {
    },
    editEdge: false,
    deleteNode: (data, callback) => {
      this.removeGraphElements(data, callback);
    },
    deleteEdge: (data, callback) => {
      this.removeGraphElements(data, callback);
    }
  },
}

const networkOptions = _.merge(defaultNetworkOptions, {
  locales: {
      // TODO: use getStr.getText or vue i18n for language localization
      memo: {
          edit: "編輯",
          del: "刪除所選項目",
          back: "返回",
          addNode: "新增筆記",
          addEdge: "新增連結",
          editNode: "編輯筆記",
          editEdge: "編輯連結",
          addDescription: "點擊空白處新增筆記",
          edgeDescription: "點擊一個筆記並拖曳至欲連結的錢包地址以新增連結",
          editEdgeDescription: "點擊連結的控制點並拖曳至其他節點以修改連結",
          createEdgeError: "無法新增連結",
          deleteClusterError: "無法刪除所選項目",
          editClusterError: "無法編輯所選項目",
          close: "關閉",
      },
  },
  locale: 'memo',
  layout: {
      randomSeed: 1,
      improvedLayout: false,
      hierarchical: _.merge({
          enabled: true,
          levelSeparation: 300,
          nodeSpacing: 150,
          // treeSpacing: 200,
          // blockShifting: false,
          // edgeMinimization: false,
          // parentCentralization: false,
          direction: 'LR', // UD, DU, LR, RL
          sortMethod: 'directed',  // hubsize, directed
      })
  },
  physics: {
      enabled: true,
      solver: 'barnesHut',
      barnesHut: {
          theta: 0.5,
          gravitationalConstant: -5000,
          centralGravity: 0.1,
          springLength: 150,
          springConstant: 1,
          damping: 0.5,
          avoidOverlap: 0.5
      },
      forceAtlas2Based: {
          theta: 0.5,
          gravitationalConstant: -100,
          centralGravity: 0.005,
          springConstant: 0.05,
          springLength: 150,
          damping: 0.5,
          avoidOverlap: 0.8
      },
      maxVelocity: 150,
      minVelocity: 0.5,
      timestep: 0.1,
      adaptiveTimestep: true,
      stabilization: {
          enabled: true,
          iterations: 3000,
          updateInterval: 100,
          onlyDynamicEdges: false,
          fit: true
      }
  },
})




function addNote(){
  id.value += 1;
  let noteNode = {
    id: 'comment'+id.value.toString(),
    label: 'note'+ id.value.toString(),
    type: 'comment',
    x: 0,
    y: 0,
  }

  datas.nodes.add(noteNode)
  network.editNode()
  network.selectNodes(['comment'+id.value.toString()])
  network.enableEditMode()

}

function addNode(){
  id.value += 1;
  datas.nodes.add({
    id: id.value.toString(),
    // lable:'node'+ id.value.toString(),
    // tooltip: '123145679',
    // // shape: 'circularImage',
    // // image: '/public/images/test1.png',
    // type: 'test',
    x: null,
    y: null,
    // margin: {
    //   top: 24,
    // },
    // color: {
    //   border: "transparent",
    //   background: "#58d196",
    // },
    // shapeProperties: {
    //   useBorderWithImage: true,
    // },
    // icon: {
    //   face: 'FontAwesome',
    //   weight: 900,
    //   size: 40,
    // },
    // font: {
    //   color: '#ffffff',
    //   face: "courier",
    //   size: 12,
    // },
    // data: {
    //   id: id.value.toString(),
    //   address: id.value.toString(),
    //   label: '',
    //   type:  '',
    //   x: 0,
    //   y: 0,
    //   is_comment: false,
    //   blockchain: '',
    // },
  })
  // network.editNode()
  // network.selectNodes([id.value.toString()])
  // network.enableEditMode()
  // network.storePositions()
  network.setOptions({ layout: { hierarchical: false } });
  // console.log("add node",datas.nodes.get())
}


function addBigData(){
  let bigData = createNodesList()
  console.log('big',bigData)
  datas.nodes.add(bigData.nodes);
  datas.edges.add(bigData.edges);

  network.storePositions();
  network.setOptions({ layout: { hierarchical: false } });
}




function addEdge(){
  // datas.edges.add({from:'1',to:'2'})
}

function togglePhysics() {
  physicsEnabled.value = !physicsEnabled.value;
  if (physicsEnabled.value) {
    network.startSimulation();
    console.log("物理模擬已啟動");
  } else {
    network.stopSimulation();
    console.log("物理模擬已停止");
  }
}

function stabilizeNetwork() {
  console.log("手動穩定網絡中...");
  network.stabilize(1000); // 執行1000次迭代
}

// 新增一般節點（固定）
function addNormalNode() {
  id.value += 1;
  const newNode = createNormalNode(id.value);
  datas.nodes.add(newNode);
  
  // 如果有其他節點，創建連接
  const allNodes = datas.nodes.get();
  if (allNodes.length > 1) {
    // 連接到最近創建的節點
    const previousNode = allNodes[allNodes.length - 2];
    datas.edges.add({
      from: previousNode.id,
      to: newNode.id,
      arrows: { to: true }
    });
  }
  
  network.setOptions({ layout: { hierarchical: false } });
  console.log("新增一般節點:", newNode.id);
}

// 新增特殊節點（不固定）
function addSpecialNode() {
  id.value += 1;
  const newNode = createSpecialNode(id.value);
  datas.nodes.add(newNode);
  
  // 如果有其他節點，創建連接
  const allNodes = datas.nodes.get();
  if (allNodes.length > 1) {
    // 連接到最近創建的節點
    const previousNode = allNodes[allNodes.length - 2];
    datas.edges.add({
      from: previousNode.id,
      to: newNode.id,
      arrows: { to: true }
    });
  }
  
  network.setOptions({ layout: { hierarchical: false } });
  console.log("新增特殊節點:", newNode.id);
}

function initVisNetwork(){
  network = new Network(visContainerDom.value, datas, networkOptions);
  console.log('network',network)
  
  // 監聽穩定化事件
  network.on("startStabilizing", function () {
    console.log("開始穩定化...");
  });
  
  network.on("stabilizationProgress", function (params) {
    console.log("穩定化進度:", params.iterations + "/" + params.total);
  });
  
  network.on("stabilizationIterationsDone", function () {
    console.log("穩定化迭代完成");
  });
  
  network.on("stabilized", function (params) {
    console.log("網絡已穩定！迭代次數:", params.iterations);
  });
  
  // 拖曳開始事件
  network.on("dragStart", function (params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = datas.nodes.get(nodeId);
      
      // 只處理一般節點（nodeType === 'normal'）
      if (node && node.nodeType === 'normal') {
        draggedNodeId.value = nodeId;
        // 暫時解除固定
        datas.nodes.update({
          id: nodeId,
          fixed: false
        });
        console.log(`開始拖曳一般節點 ${nodeId}，暫時解除固定`);
      }
    }
  });
  
  // 拖曳結束事件
  network.on("dragEnd", function (params) {
    if (draggedNodeId.value) {
      const nodeId = draggedNodeId.value;
      const node = datas.nodes.get(nodeId);
      
      // 只處理一般節點
      if (node && node.nodeType === 'normal') {
        // 獲取當前位置
        const positions = network.getPositions([nodeId]);
        const position = positions[nodeId];
        
        // 恢復固定狀態並更新位置
        datas.nodes.update({
          id: nodeId,
          fixed: true,
          x: position.x,
          y: position.y
        });
        console.log(`結束拖曳一般節點 ${nodeId}，恢復固定在位置 (${position.x}, ${position.y})`);
      }
      
      draggedNodeId.value = null;
    }
  });
}


onMounted(()=>{
  initVisNetwork();
})


</script>
<style scoped>
.network-wrapper{
  height: 650px;
}
</style>