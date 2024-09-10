import { ref, watch, onMounted, nextTick } from 'vue';
import { simpleAwait } from '@/util/simple-await.js';

export function useSearchModal(pageInfo, apiFunc, setData, domRef, isMountedGetData=true) {
  
	const loading = ref(false);

	const getMoreData = async () => {
    console.log('getMoreData');
    console.log('pageInfo.page',pageInfo.page);
    console.log('pageInfo.totalPage',pageInfo.totalPage);
		if (loading.value || pageInfo.page > pageInfo.totalPage) return;
		let response = await getDataApi();
		handleResponse(response)
	};

	function handleResponse(response){
		console.log(response)
		if(response.status === 200){
			setData(response);
		}else{
			console.log('search table get error',response);
		}
	}
	
	async function getDataApi(){
		loading.value = true;
		// 使用 simpleAwait 來處理 API 調用
		const [error, response] = await simpleAwait(apiFunc(pageInfo), 
			() => { loading.value = false; }
		);
	
		if (error) {
			console.error('Error loading data:', error);
			return;
		}
		return response
	}

	// 使用防抖處理的滾動事件處理器
	const onScroll = createScrollHandler(getMoreData);

  
  const createScrollHandler = (callback) => {
    const debouncedCallback = debounce(callback, 1000);
    return (event) => {
      const { scrollTop, clientHeight, scrollHeight } = event.target;
      if (scrollTop + clientHeight >= scrollHeight - 1) {
        debouncedCallback()
      }
    };
  }

	function addScrollListener(){		
		nextTick(() => {
			if (domRef.value) {
        console.log('addScrollListener')
				domRef.value.addEventListener('scroll', onScroll);
			} else {
				console.log('Table wrapper not found');
			}
		});
	}

  function removeScrollListener(){
		domRef.value.removeEventListener('scroll', onScroll)
  }

	watch(domRef,(newValue)=>{
		if(!newValue) return
    removeScrollListener();
		addScrollListener();
	},{
		immediate : true,
	})

	onMounted( async () => {
		if(!isMountedGetData) return
		await getMoreData();
	});

  return {
		loading,
		getMoreData,
    removeScrollListener,
  };
}