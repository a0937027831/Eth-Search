# 專案名稱

## 簡介
這個專案是一個基於 Vue 3 和 Vite 的應用，使用 Etherscan API 獲取以太坊帳戶和交易相關資訊。主要功能包括查詢帳戶餘額、普通交易和內部交易詳情。
採用CI/CD 自動化部署到github上

## 線上環境連結
https://a0937027831.github.io/Eth-Search/

## 技術棧
- Vue 3
- Vite
- Axios
- Vuetify
- Pinia
- Etherscan API

## 文件結構
```
|-- undefined
    |-- .env.development
    |-- .env.production
    |-- .gitignore
    |-- index.html
    |-- jsconfig.json
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- vite.config.js
    |-- .github
    |   |-- workflows
    |   |   |-- deploy.yml
    |-- .vscode
    |   |-- extensions.json
    |   |-- settings.json
    |-- public
    |   |-- favicon.ico
    |-- src
        |-- App.vue
        |-- main.js
        |-- api
        |   |-- ethersApi.js
        |-- assets
        |-- components
        |   |-- form
        |   |   |-- input.vue
        |   |-- modal
        |   |   |-- dialog.vue
        |   |   |-- loading.vue
        |   |-- navbar
        |   |   |-- navbar.vue
        |   |-- table
        |       |-- table.vue
        |-- composables
        |   |-- useFlow.js
        |-- define
        |   |-- define-global-component.js
        |-- layout
        |   |-- base-layout.vue
        |-- plugins
        |   |-- vuetify.js
        |-- router
        |   |-- index.js
        |-- stores
        |   |-- loading.js
        |-- utils
        |   |-- eth-utils.js
        |   |-- interceptors.js
        |   |-- request.js
        |-- views
            |-- account.vue
            |-- home.vue
            |-- transaction.vue
```
### `deploy.yml`
這個文件負責自動化部屬檔案

### `components`
這個文件放入封裝vuetifty後的常用元件

### `api/ethersApi.js`
這個文件包含與 Etherscan API 互動的函數，通過 Axios 發送 HTTP 請求來獲取帳戶餘額、普通交易列表和內部交易列表。

### `utils/request.js`
這個文件定義了封裝的 Axios 請求方法，並設置了全局請求攔截器和響應攔截器。

### `composables/useFlow.js`
這個文件定義了一個可重用的 `useFlow` 函數，用於管理 API 請求的執行流程。




