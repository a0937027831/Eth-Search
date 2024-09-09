<template>
  <h1>hello</h1>
  <div class="network-wrapper" ref="visContainerDom"></div>
</template>
<script setup>
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { onMounted, ref } from "vue";


const visContainerDom = ref(null);
var network = null;

const datas = {
  nodes: new DataSet(),
  edges: new DataSet(),
}

const visOption = {}

function addNode(){
  datas.nodes.add({id:'1',lable:'node1'})
  datas.nodes.add({id:'2',lable:'node2'})
}

function addEdge(){
  datas.edges.add({from:'1',to:'2'})
}

function initVisNetwork(){
  network = new Network(visContainerDom.value, datas, visOption);
}


onMounted(()=>{
  initVisNetwork();
  addNode();
  addEdge();
})


</script>
<style scoped>
.network-wrapper{
  height: 350px;
}
</style>