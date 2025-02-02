import React, {Fragment} from 'react'
import DashboardCards from "./DashboardCards";

import DashboardTableScannedHistory from "./DashboardTableScannedHistory";
import DashboardTableRedemptionHistory from "./DashboardTableRedemptionHistory";
import {Card} from "@mui/material";
import {Breadcrumb} from "../../components";

const Analytics = () => {

    return (
        <Fragment>

            <DashboardCards/>
            <br/>
            <br/>
            <div style={{marginLeft: "30px"}}>
                <Breadcrumb routeSegments={[{name: "Scanned History"}]}/>
            </div>

            <DashboardTableScannedHistory/>
            <div style={{marginLeft: "30px"}}>

                <Breadcrumb routeSegments={[{name: "Redemption History"}]}/>
            </div>

                <DashboardTableRedemptionHistory/>
        </Fragment>
)
}

export default Analytics
