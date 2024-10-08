import request from '@/utils/request';

const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;


/**
 * 獲取帳戶餘額
 * @param {Object} params - 請求參數
 * @returns {Promise} - 返回請求結果
 */
export function getAccountBalance(parms,signal) {
  return request.get('', {
    ...parms,
    module: 'account',
    action: "balance",
    apiKey: apiKey
  },signal);
}


/**
 * 獲取地址的普通交易列表
 * @param {Object} params - 請求參數
 * @returns {Promise} - 返回請求結果
 */
export function getNormalTransactionsByAdress(parms, signal){
  return request.get('', {
    ...parms,
    module: 'account',
    action: "txlist",
    apiKey: apiKey
  },signal);
}



/**
 * 獲取地址的內部交易列表
 * @param {Object} params - 請求參數
 * @returns {Promise} - 返回請求結果
 */
export function getInternalTransactionsByAdress(parms){
  return request.get('', {
    ...parms,
    module: 'account',
    action: "txlistinternal",
    apiKey: apiKey
  });
}


/**
 * 獲取哈希值的內部交易列表
 * @param {Object} params - 請求參數
 * @returns {Promise} - 返回請求結果
 */
export function getInternalTransactionsByHash (parms) {
  return request.get('', {
    ...parms,
    module: 'account',
    action: "txlistinternal",
    apiKey: apiKey
  });
}