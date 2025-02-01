import { flat } from 'app/utils/utils'
import React, { useState, useEffect } from 'react'
import { useLocation, useParams, Navigate } from 'react-router-dom'
import { AllPages } from '../routes/routes'

const AuthGuard = ({ children }) => {
    const [allow, setAllow] = useState(true)

    const [previouseRoute, setPreviousRoute] = useState(null)
    const { pathname } = useLocation()
    const routes = flat(AllPages())
    const { id, userId } = useParams()

    useEffect(() => {
        if (previouseRoute !== null) setPreviousRoute(pathname)

        let path = pathname

        if (id && id.length) {
            path = path.replace(id, ':id')
        }
        if (userId && userId.length) {
            path = path.replace(userId, ':userId')
        }

        const matched = routes.find((r) => r.path === path)
        setAllow(matched.permission)
        if (localStorage.getItem('accessToken') === null) {
            setAllow(false)
        }
    }, [pathname, previouseRoute])

    if (allow) {
        return <>{children}</>
    } else {
        return (
            <Navigate
                to="/session/signin"
                state={{ redirectUrl: previouseRoute }}
            />
        )
    }

    // else {
    //     return (
    //         <Navigate
    //             to="/session/signin"
    //             state={{ redirectUrl: previouseRoute }}
    //         />
    //         // <Redirect
    //         //     to={{
    //         //         pathname: '/session/signin',
    //         //         state: { redirectUrl: previouseRoute },
    //         //     }}
    //         // />
    //     )
    // }
}

export default AuthGuard
