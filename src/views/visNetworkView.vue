<template>
  <h1>hello</h1>
  <!-- <v-btn @click="addNote">add note</v-btn> -->
  <v-btn @click="addNode">add node</v-btn>
  <div class="network-wrapper" ref="visContainerDom"></div>
</template>
<script setup>
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { onMounted, ref } from "vue";
import { createNodesList } from '@/mockedata/visTest'
import * as _ from 'lodash'


const visContainerDom = ref(null);
var network = null;

const datas = {
  nodes: new DataSet(),
  edges: new DataSet(),
  summary: {}
}


const id = ref(0)



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
      enabled: false
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

function initVisNetwork(){
  network = new Network(visContainerDom.value, datas, networkOptions);
  console.log('network',network)
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