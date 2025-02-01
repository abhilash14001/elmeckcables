import React, { lazy } from 'react';
import Loadable from 'app/components/Loadable/Loadable';


const ManageRole = Loadable(lazy(() => import('./administrator/ManageRole')));
const ManageUser = Loadable(lazy(() => import('./administrator/ManageUser')));
const AddRole = Loadable(lazy(() => import('./administrator/AddRole')));

const CreateUpdateAppUser = Loadable(lazy(() => import('./app-user/CreateUpdateAppUser')));
const ListAppUser = Loadable(lazy(() => import('./app-user/ListAppUser')));

const CreateProduct = Loadable(lazy(() => import('./product/CreateProduct')));
const QrProduct = Loadable(lazy(() => import('./product/QrProduct')));
const AddSchemes = Loadable(lazy(() => import('./product/AddSchemes')));
const Schemes = Loadable(lazy(() => import('./product/Schemes')));
const ScannedHistory = Loadable(lazy(() => import('./History/ScannedHistory')));


const RedeemQr = Loadable(lazy(() => import('./Redeem/RedeemQr')));
const RedeemScheme = Loadable(lazy(() => import('./Redeem/RedeemScheme')));

const About = Loadable(lazy(() => import('./About-elmeck/About')));

const Config = Loadable(lazy(() => import('./config/config')));

const ActityLogs = Loadable(lazy(() => import('./activity-logs/ActityLogs')));

const PERMISSION = JSON.parse(localStorage.getItem('permission'));

const materialRoutes = [
    {
        path: '/managerole',
        element: <ManageRole />,
        permission: PERMISSION?.ROLE?.MANAGE
    },
    {
        path: '/manageuser',
        element: <ManageUser />,
        permission: PERMISSION?.USER?.MANAGE
    },
    {
        path: '/addrole/:id',
        element: <AddRole />,
        permission: PERMISSION?.ROLE?.EDIT
    },
    {
        path: '/app-user',
        element: <CreateUpdateAppUser />,
        permission: PERMISSION?.APP_USER?.CREATE
    },
    {
        path: '/app-user/:id',
        element: <CreateUpdateAppUser />,
        permission: PERMISSION?.APP_USER?.EDIT
    },
    {
        path: '/app-user-list/:id',
        element: <ListAppUser />,
        permission: PERMISSION?.APP_USER?.MANAGE
    },
    {
        path: '/createProduct',
        element: <CreateProduct />,
        permission: PERMISSION?.PRODUCT?.MANAGE
    },
    {
        path: '/qrproduct/:id',
        element: <QrProduct />,
        permission: PERMISSION?.QR?.MANAGE
    },
    {
        path: '/addschemes/:id',
        element: <AddSchemes />,
        permission: PERMISSION?.SCHEMES?.CREATE
    },
    {
        path: '/addschemes',
        element: <AddSchemes />,
        permission: PERMISSION?.SCHEMES?.CREATE
    },
    {
        path: '/view-scheme/:id/:userId',
        element: <Schemes />,
        permission: PERMISSION?.SCHEMES?.MANAGE
    },
    {
        path: '/scan/:id',
        element: <ScannedHistory />,
        permission: PERMISSION?.SCANNED_HISTORY?.MANAGE
    },
    {
        path: '/scan/:id/:userId',
        element: <ScannedHistory />,
        permission: PERMISSION?.SCANNED_HISTORY?.MANAGE
    },
    {
        path: '/redeem/:id',
        element: <RedeemQr />,
        permission: PERMISSION?.REDEEM?.MANAGE
    },
    {
        path: '/redeem-scheme/:id',
        element: <RedeemScheme />,
        permission: PERMISSION?.REDEEM?.MANAGE
    },
    {
        path: '/activity-log/:id',
        element: <ActityLogs />,
        permission: PERMISSION?.ACTIVITY_LOGS?.MANAGE
    },
    {
        path: '/activity-log/:id/:userId',
        element: <ActityLogs />,
        permission: PERMISSION?.ACTIVITY_LOGS?.MANAGE
    },
    {
        path: '/aboutapp',
        element: <About />,
        permission: PERMISSION?.ABOUT?.MANAGE
    },
    {
        path: '/config',
        element: <Config />,
        permission: PERMISSION?.CONFIG?.MANAGE
    }

]

export default materialRoutes
