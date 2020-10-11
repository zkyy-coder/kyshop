// 本地化存储
export const setStore = (key, value) => {
    if(!key) return;
    if(typeof value !== 'string') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
}

// 本地化获取
export const getStore = (key) => {
    if(!key) return;
    return window.localStorage.getItem(key);
}

// 本地化删除
export const removeStore = (key) => {
    if(!key) return;
    return window.localStorage.removeItem(key);
}
