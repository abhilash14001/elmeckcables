import React, {useEffect, useState} from 'react';
import {FaUser, FaHistory } from 'react-icons/fa'; // Import icons
import api from "../../../api"


const cardContainerStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
    padding: '0 30px',
    justifyContent: 'center'
};




const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    position : 'relative',
    padding: '15px',
    width: 'calc(25% - 15px)',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
};



const cardValueStyle = (color = 'black') => {
    return  {
        fontSize: '1.8rem',
        fontWeight: '700',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        color: color,
    };
}


const cardLabelStyle = {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '15px',
    display: 'block',
};


const cardFooterStyle = (backgroundColor, direction) => ({
    backgroundColor: backgroundColor,
    color: 'white',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    padding: '5px 8px',
    fontSize: '0.9rem',
    display: 'flex',
    position : 'absolute',
    width : '100%',
    height : '3rem',
    alignItems: 'center',
    marginLeft :"-15px",
    justifyContent: 'left', // Changed to left
    gap: '2px',
    whiteSpace: 'nowrap',
});


const arrowStyle = (color, direction) => ({
    display: 'inline-block',
    transform: direction === 'up' ? 'rotate(-45deg)' : 'rotate(135deg)',
    fontSize: '0.8em',
    color: color
});



const DashboardCards = () => {
    const [dashboardCounts, setDashboardCounts] = useState({

        app_user_count : 0,
        qr_scan_count : 0,
        qr_request_count : 0,
        scheme_count : 0,

    })
    const countValues = async () => {
        const app_count = await api.appUser.count_app_users()

        const scan_count = await api.Scanned.count_qr_scan_both()
        const qr_request_count = await api.Redeem.count()


        setDashboardCounts({qr_request_count: qr_request_count.data.data.qr_total, scheme_count : qr_request_count.data.data.scheme_total, app_user_count: app_count.data.data, qr_scan_count: scan_count.data.data})

    }

    useEffect(() => {
        countValues()
    }, []);

    return (
        <div style={cardContainerStyle}>
            <div style={cardStyle}>
                <h2 style={cardValueStyle('rgb(244, 161, 0)')}><FaUser/> {dashboardCounts.app_user_count}</h2>
                <p style={cardLabelStyle}>Total App Users</p>
                <div style={cardFooterStyle("#ffb300", 'up')}>
                    App Users
                    <span style={arrowStyle("#ffb300", 'up')}>↗</span>
                </div>
            </div>
            <div style={cardStyle}>
                <h2 style={cardValueStyle('red')}><FaHistory /> {dashboardCounts.qr_scan_count}</h2>
                <p style={cardLabelStyle}>Dealers and Electricians</p>
                <div style={cardFooterStyle("#f44336", 'down')}>
                    QR Scan History
                    <span style={arrowStyle("#f44336", 'down')}> ↘</span>
                </div>
            </div>
            <div style={cardStyle}>
                <h2 style={cardValueStyle('green')}><FaHistory /> {dashboardCounts.qr_request_count}</h2>
                <p style={cardLabelStyle}>Dealers and Electricians</p>
                <div style={cardFooterStyle("#4caf50", 'up')}>
                    Redeem QR Request
                    <span style={arrowStyle("#4caf50",'up')}>↗</span>
                </div>
            </div>
            <div style={cardStyle}>
                <h2 style={cardValueStyle('blue')}><FaHistory /> {dashboardCounts.scheme_count}</h2>
                <p style={cardLabelStyle}>Dealers and Electricians</p>
                <div style={cardFooterStyle("#3f51b5", 'up')}>
                    Redeem Scheme Request
                    <span style={arrowStyle("#3f51b5", 'up')}>↗</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardCards;
