import axios from 'axios';
//TODO : change it back
 axios.defaults.baseURL = 'https://backend.elmeckcables.com/'
// axios.defaults.baseURL = 'http://localhost:30928/'
// axios.defaults.baseURL = 'https://elmeckcables.developingmode.online/'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/json';


if (localStorage.getItem('accessToken')) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');
}


let api = {

    role: {
        createRole: (data) => axios.post('panel/role', data),
        listRole: (data) => axios.post('panel/role/list', data),
        deleteRole: (data) => axios.delete('panel/role/' + data),
        editRole: (id, data) => axios.patch('panel/role/' + id, data),
        getPermission: (data) => axios.get('panel/role/' + data)
    },
    user: {
        login: (data) => axios.post('panel/user/login', data),
        userList: (data) => axios.post('panel/user/list', data),
        createUser: (data) => axios.post('panel/user', data),
        deleteUser: (data) => axios.delete('panel/user/' + data),
        editUser: (id, data) => axios.patch('panel/user/' + id, data)
    },
    product: {
        createProduct: (data) => axios.post('panel/product', data),
        productNameList: (data) => axios.get('panel/product/name', data),
        getProductList: (data) => axios.post('panel/product/list', data),
        deleteProduct: (data) => axios.delete('panel/product/' + data),
        editProduct: (id, data) => axios.patch('panel/product/' + id, data)
    },
    qr: {
        qrList: (data) => axios.post('panel/qr-code/list', data),
        createQr: (data) => axios.post('panel/qr-code', data),
        downloadQr: (data) => axios.get('panel/qr-code/excel/' + data),
        deleteQr: (data) => axios.delete('panel/qr-code/' + data)
    },
    scheme: {
        addSchemes: (data) => axios.post('panel/scheme', data),
        listScheme: (data) => axios.post('panel/scheme/list', data),
        deleteScheme: (data) => axios.delete('panel/scheme/' + data),
        getScheme: (data) => axios.get('panel/scheme/' + data),
        editScheme: (id, data) => axios.patch('panel/scheme/' + id, data),

    },
    Scanned: {
        listScanned: (data) => axios.post('panel/scanned-qr/list', data),
        count_qr_scan_both : () => axios.get('panel/scanned-qr/count_qr_scan_both'),
    },
    Redeem: {
        listRedeem: (data) => axios.post('panel/redeem/list', data),
        updateRedeemStatus: (id, data) => axios.patch('panel/redeem/' + id, data),
        userName: (data) => axios.get('panel/redeem/user-name', { params: data }),
        schemeName: (data) => axios.get('panel/redeem/scheme-name', { params: data }),
        count: () => axios.get('panel/redeem/count')
    },
    appRole: {
        roles: () => axios.get('web/config/setting')
    },
    appUser: {
        create: (data) => axios.post('panel/app-user', data),
        get: (data) => axios.get('panel/app-user/' + data),
        list: (data) => axios.post('panel/app-user/list', data),
        count_app_users: () => axios.get('panel/app-user/count_app_users'),
        update: (id, data) => axios.patch('panel/app-user/' + id, data),
        remove: (data) => axios.delete('panel/app-user/' + data),
    },
    activityLogs: {
        list: (data) => axios.post('panel/activity-log/list', data),
        remove: (data) => axios.delete('panel/activity-log/' + data)
    },
    about: {
        add: (data) => axios.post('panel/about', data),
        list: (data) => axios.post('panel/about/list', data),
        update: (id, data) => axios.patch('panel/about/' + id, data)

    },
    state: {
        list: (data) => axios.get('web/state', { params: data })
    },
    config: {
        get: (data) => axios.get('panel/config/' + data),
        update: (id, data) => axios.patch('panel/config/' + id, data),
    }
};

export default api;