const PERMISSION = JSON.parse(localStorage.getItem('permission'));

export const navigations = [
    {
        name: 'Dashboard',
        path: '/dashboard/default',
        icon: 'dashboard',
        permission: true
    },
    {
        name: 'Administrator',
        icon: 'home',
        permission: PERMISSION?.ROLE?.MANAGE || PERMISSION?.USER?.MANAGE,
        children: [
            {
                name: 'Manage Role',
                iconText: 'MR',
                path: '/managerole',
                permission: PERMISSION?.ROLE?.MANAGE
            },
            {
                name: 'Manage User',
                iconText: 'MU',
                path: '/manageuser',
                permission: PERMISSION?.USER?.MANAGE
            }
        ]
    },
    {
        name: 'App-Users',
        icon: 'person',
        permission: PERMISSION?.APP_USER?.CREATE || PERMISSION?.APP_USER?.MANAGE,
        children: [
            {
                name: 'Add New',
                iconText: 'PR',
                path: '/app-user',
                permission: PERMISSION?.APP_USER?.CREATE
            },
            {
                name: 'Dealers',
                iconText: 'PR',
                path: '/app-user-list/DEALER',
                permission: PERMISSION?.APP_USER?.MANAGE
            },
            {
                name: 'Electricians',
                iconText: 'E',
                path: '/app-user-list/ELECTRICIAN',
                permission: PERMISSION?.APP_USER?.MANAGE
            }
        ]
    },
    {
        name: 'Products',
        icon: 'shopping_cart',
        permission: PERMISSION?.PRODUCT?.MANAGE,
        children: [
            {
                name: 'Manage',
                iconText: 'P',
                path: '/createProduct',
                permission: PERMISSION?.PRODUCT?.MANAGE
            },
        ]
    },
    {
        name: 'Schemes',
        icon: 'shopping_cart',
        permission: PERMISSION?.SCHEMES?.CREATE || PERMISSION?.SCHEMES?.MANAGE,
        children: [
            {
                name: 'Add',
                iconText: 'AS',
                path: '/addschemes',
                permission: PERMISSION?.SCHEMES?.CREATE
            },
            {
                name: 'Dealers',
                iconText: 'PS',
                path: '/view-scheme/DEALER/false',
                permission: PERMISSION?.SCHEMES?.MANAGE
            },
            {
                name: 'Electricians',
                iconText: 'ES',
                path: '/view-scheme/ELECTRICIAN/false',
                permission: PERMISSION?.SCHEMES?.MANAGE
            }
        ]
    },
    {
        name: 'Archive Schemes',
        icon: 'shopping_cart',
        permission: PERMISSION?.SCHEMES?.MANAGE,
        children: [
            {
                name: 'Dealers',
                iconText: 'PSD',
                path: '/view-scheme/DEALER/true',
                permission: PERMISSION?.SCHEMES?.MANAGE
            },
            {
                name: 'Electricians',
                iconText: 'ESA',
                path: '/view-scheme/ELECTRICIAN/true',
                permission: PERMISSION?.SCHEMES?.MANAGE
            }
        ]
    },
    {
        name: 'Qr Scan History',
        icon: 'history',
        permission: PERMISSION?.SCANNED_HISTORY?.MANAGE,
        children: [
            {
                name: 'Dealers',
                iconText: 'P',
                path: '/scan/DEALER',
                permission: PERMISSION?.SCANNED_HISTORY?.MANAGE
            },
            {
                name: 'Electricians',
                iconText: 'E',
                path: '/scan/ELECTRICIAN',
                permission: PERMISSION?.SCANNED_HISTORY?.MANAGE
            }
        ]
    },
    {
        name: 'Redeem Qr Request',
        icon: 'redeem',
        permission: PERMISSION?.REDEEM?.MANAGE,
        children: [
            {
                name: 'Dealer',
                iconText: 'P',
                path: '/redeem/DEALER',
                permission: PERMISSION?.REDEEM?.MANAGE
            },
            {
                name: 'Electrician',
                iconText: 'E',
                path: '/redeem/ELECTRICIAN',
                permission: PERMISSION?.REDEEM?.MANAGE
            }
        ]
    },
    {
        name: 'Redeem Scheme Req',
        icon: 'redeem',
        permission: PERMISSION?.REDEEM?.MANAGE,
        children: [
            {
                name: 'Dealer',
                iconText: 'P',
                path: '/redeem-scheme/DEALER',
                permission: PERMISSION?.REDEEM?.MANAGE
            },
            {
                name: 'Electrician',
                iconText: 'E',
                path: '/redeem-scheme/ELECTRICIAN',
                permission: PERMISSION?.REDEEM?.MANAGE
            }
        ]
    },
    {
        name: 'Activity Logs',
        icon: 'insert_drive_file',
        permission: PERMISSION?.ACTIVITY_LOGS?.MANAGE,
        children: [
            {
                name: 'Dealer',
                iconText: 'P',
                path: '/activity-log/DEALER',
                permission: PERMISSION?.ACTIVITY_LOGS?.MANAGE
            },
            {
                name: 'Electrician',
                iconText: 'E',
                path: '/activity-log/ELECTRICIAN',
                permission: PERMISSION?.ACTIVITY_LOGS?.MANAGE
            }
        ]
    },
    {
        name: 'About App',
        icon: 'apps',
        path: '/aboutapp',
        permission: PERMISSION?.ABOUT?.MANAGE
    },
    {
        name: 'Config',
        icon: 'settings',
        path: '/config',
        permission: PERMISSION?.CONFIG?.MANAGE
    }
];