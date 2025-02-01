import React, { useState, useEffect, Fragment, useRef } from 'react'
import { Breadcrumb, SimpleCard } from 'app/components'
import { styled, Box } from '@mui/system'
import Pagination from '@mui/material/Pagination'
import { Table, TableHead, TableCell, TableBody, TableRow } from '@mui/material'
import api from '../../../../api'
import { useParams } from 'react-router-dom'
import '../custom-loader/loader.css'
import Loading from '../../../components/MatxLoading/MatxLoading'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
const StyledTable = styled(Table)(({ theme }) => ({
    whiteSpace: 'pre',
    '& thead': {
        '& tr': {
            '& th': {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
    },
    '& tbody': {
        '& tr': {
            '& td': {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
    },
}))

const Container = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: '16px',
        },
    },
}))

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function ActityLogs(props) {
    let limit = 10
    let offset = useRef(0),
        q = {}
    const [pageCount, setpageCount] = useState(0)
    const [activityList, setActivityList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [loader, setLoader] = useState(true)
    const [alert, setAlert] = React.useState({
        type: '',
        message: '',
    })
    const [snack, setSnack] = useState(false)
    const { id } = useParams()
    const { userId } = useParams()

    q = {
        role: id,
    }
    if (userId) {
        q = {
            ...q,
            user: userId,
        }
    }
    useEffect(() => {
        setCurrentPage(1)
        listLogs()
    }, [id])

    const listLogs = (data) => {
        setLoader(true)
        api.activityLogs
            .list({
                p: {},
                q: q,
                s: {},
                o: data || offset.current,
                l: limit,
            })
            .then((response) => {
                setActivityList(response.data.data.records)
                setpageCount(Math.ceil(response.data.data.totalRecords / limit))
                setLoader(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handlePageClick = async (event, value) => {
        let currentPage = value
        var skip = Number(limit * (currentPage - 1))
        setCurrentPage(currentPage)
        setLoader(true)
        api.activityLogs
            .list({
                q: q,
                p: {},
                s: {},
                o: skip,
                l: limit,
            })
            .then((response) => {
                setActivityList(response.data.data.records)
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const ErrorHandler = (err) => {
        setSnack(true)
        setAlert({
            type: 'error',
            message:
                err.response && err.response.data
                    ? err.response.data.message
                    : 'Error!',
        })
    }

    const snackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setSnack(false)
    }

    return (
        <Fragment>
            {loader ? (
                <Loading />
            ) : (
                <Container>
                    <div className="breadcrumb">
                        <Breadcrumb
                            routeSegments={[{ name: 'Activity logs' }]}
                        />
                    </div>

                    <SimpleCard>
                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="25%" align="left">
                                        {' '}
                                        User
                                    </TableCell>
                                    <TableCell width="25%" align="center">
                                        {' '}
                                        Action
                                    </TableCell>
                                    <TableCell width="35%" align="left">
                                        {' '}
                                        Details{' '}
                                    </TableCell>
                                    <TableCell width="10%" align="center">
                                        {' '}
                                        Date
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activityList.map((al, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="left">
                                            <strong>Name : </strong>
                                            {al?.user_info?.name}
                                            <br />

                                            {/* <strong>Email : </strong>
                                            {al?.user_info?.email}
                                            <br /> */}
                                            <strong>Mobile : </strong>
                                            {al?.user_info?.mobile}
                                        </TableCell>
                                        <TableCell align="center">
                                            {al?.action}
                                        </TableCell>
                                        <TableCell align="left">
                                            {al.details.map((value) => (
                                                <>
                                                    <strong>
                                                        {value.key}{' '}
                                                    </strong>{' '}
                                                    :&nbsp;
                                                    {value.value}
                                                    <br />
                                                </>
                                            ))}
                                        </TableCell>
                                        <TableCell align="left">
                                            {new Date(
                                                al?.created_at
                                            ).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </StyledTable>

                        <Box my={2} display="flex" justifyContent="center">
                            <Pagination
                                count={pageCount}
                                page={currentPage}
                                color="primary"
                                variant="outlined"
                                showFirstButton
                                showLastButton
                                defaultPage={1}
                                onChange={handlePageClick}
                            />
                        </Box>
                    </SimpleCard>
                </Container>
            )}
            <Snackbar
                open={snack}
                autoHideDuration={6000}
                onClose={snackbarClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert
                    onClose={snackbarClose}
                    severity={alert.type}
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Fragment>
    )
}

export default ActityLogs
