import React, { Fragment, useEffect, useState, useRef } from 'react'
import { styled, Box } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import Pagination from '@mui/material/Pagination'
import {
    Table,
    TableHead,
    TableCell,
    TableBody,
    IconButton,
    Icon,
    TableRow,
    Grid,
    TextField,
} from '@mui/material'
import api from '../../../../api'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { Link, useParams } from 'react-router-dom'
import '../custom-loader/loader.css'
import { PERMISSION } from 'app/constant'
import Loading from '../../../components/MatxLoading/MatxLoading'
import Autocomplete from '@mui/material/Autocomplete'
import CustomDialog from '../../../components/CustomDialog'

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

function Schemes(props) {
    const { id, userId } = useParams()

    let limit = 10
    let offset = useRef(0),
        archive = userId === 'true',
        q = useRef({
            role: id,
            archive: archive,
        })

    const [pageCount, setpageCount] = useState(0)
    const [snack, setSnack] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [electricianList, setElectricianList] = useState([])
    const [loader, setLoader] = React.useState(true)
    const [alert, setAlert] = React.useState({
        type: 'success',
        message: '',
    })
    const [totalRecords, setTotalRecords] = React.useState(0)
    const [stateList, setStateList] = useState([])
    const [state, setState] = useState([])
    const [schemeNameList, setSchemeNameList] = useState([])
    const [schemeName, setSchemeName] = useState([])

    const [deleteId, setDeleteId] = React.useState('')
    const [dialogOpen, setDialogOpen] = React.useState(false)
    useEffect(() => {
        q.current = {
            role: id,
            archive: archive,
        }
        setCurrentPage(1)
        getElectriciansList()
        getStateList(true)
        getSchemeNameList()
        setSchemeName([])
        offset.current = 0
    }, [id, userId])

    const handleDialog = async (event) => {
        if (event === 'agree') {
            deleteElectricians()
            setDialogOpen(false)
        } else if (event === 'disagree') {
            setDialogOpen(false)
        } else {
            setDeleteId(event)
            setDialogOpen(true)
        }
    }

    const handleState = (e, values) => {
        setState(values)
        if (values.length) {
            q.current = {
                ...q.current,
                state: values,
            }
        } else {
            delete q.current['state']
        }
        setCurrentPage(1)
        getElectriciansList(0)
    }

    const handleSchemeName = (e, values) => {
        console.log(q.current)
        setSchemeName(values)
        if (values.length) {
            q.current = {
                ...q.current,
                _id: values.map((v) => v._id),
            }
        } else {
            delete q.current['_id']
        }
        setCurrentPage(1)
        getElectriciansList(0)
    }

    const getSchemeNameList = () => {
        api.scheme
            .listScheme({
                q: { archive: archive, role: id },
                p: { users: 0, _id: 1, name: 1 },
                s: {},
                o: 0,
                l: 0,
            })
            .then((response) => {
                setSchemeNameList(response.data.data.records)
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }
    const getStateList = (stateFlag) => {
        api.state
            .list({})
            .then((res) => {
                setStateList(res.data.data.records)
            })
            .catch((err) => {
                setLoader(false)
                ErrorHandler(err)
            })
    }

    const getElectriciansList = (data) => {
        setLoader(true)
        api.scheme
            .listScheme({
                q: q.current,
                p: { role: 0 },
                s: {},
                o: data || offset.current,
                l: limit,
            })
            .then((response) => {
                setElectricianList(response.data.data.records)
                setpageCount(Math.ceil(response.data.data.totalRecords / limit))
                setTotalRecords(response.data.data.totalRecords)
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const handlePageClick = (event, value) => {
        let currentPage = value
        var skip = Number(limit * (currentPage - 1))
        setCurrentPage(currentPage)
        setLoader(true)
        api.scheme
            .listScheme({
                q: q.current,
                p: { role: 0 },
                s: {},
                o: skip,
                l: limit,
            })
            .then((response) => {
                setLoader(false)
                setElectricianList(response.data.data.records)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const deleteElectricians = (p) => {
        setLoader(true)

        api.scheme
            .deleteScheme(deleteId)
            .then((response) => {
                if (response.status === 200) {
                    getElectriciansList()
                    setLoader(false)
                    setSnack(true)
                    SuccessHandler('Deleted.')
                }
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const snackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setSnack(false)
    }

    const ErrorHandler = (err) => {
        setSnack(true)
        setLoader(false)
        setAlert({
            type: 'error',
            message:
                err.response && err.response.data
                    ? err.response.data.message
                    : 'Error!',
        })
    }

    const SuccessHandler = (message) => {
        setSnack(true)
        setAlert({
            type: 'success',
            message: message,
        })
    }

    return (
        <Fragment>
            {loader ? (
                <Loading />
            ) : (
                <Container>
                    {loader ? <div className="loader"></div> : ''}

                    <div className="breadcrumb">
                        <Breadcrumb routeSegments={[{ name: `${id}` }]} />
                    </div>

                    <SimpleCard>
                        <Grid container mb={3}>
                            <Grid item lg={4} md={9}>
                                <h3>Total Records : {totalRecords}</h3>
                            </Grid>
                            <Grid item lg={4} md={3} px={3}>
                                <Autocomplete
                                    disablePortal
                                    multiple
                                    id="state"
                                    size="small"
                                    value={schemeName}
                                    options={schemeNameList}
                                    onChange={handleSchemeName}
                                    getOptionLabel={(option) =>
                                        option.name || ''
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                        value === undefined ||
                                        value === '' ||
                                        option._id === value._id
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Scheme Name"
                                            value={schemeName}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={4} md={3} px={3}>
                                <Autocomplete
                                    disablePortal
                                    multiple
                                    id="state"
                                    size="small"
                                    value={state}
                                    options={stateList}
                                    onChange={handleState}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="State"
                                            value={state}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" width="10%">
                                        Name
                                    </TableCell>
                                    <TableCell align="left" width="10%">
                                        Date
                                    </TableCell>
                                    <TableCell align="center" width="10%">
                                        Points
                                    </TableCell>
                                    <TableCell align="left" width="20%">
                                        Desc
                                    </TableCell>
                                    <TableCell align="left" width="20%">
                                        State
                                    </TableCell>
                                    <TableCell align="left" width="20%">
                                        Users
                                    </TableCell>
                                    <TableCell align="center" width="10%">
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {electricianList.map((e, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="left">
                                            {e.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            <strong>Start : </strong>
                                            {new Date(
                                                e?.start_date
                                            ).toLocaleString('en-US', {
                                                day: 'numeric',
                                                year: 'numeric',
                                                month: 'short',
                                            })}
                                            <br />
                                            <strong>End : </strong>
                                            {new Date(
                                                e?.end_date
                                            ).toLocaleString('en-US', {
                                                day: 'numeric',
                                                year: 'numeric',
                                                month: 'short',
                                            })}
                                        </TableCell>
                                        <TableCell align="center">
                                            <span>{e?.points}</span>
                                        </TableCell>

                                        <TableCell align="left">
                                            {e?.desc}
                                        </TableCell>
                                        <TableCell align="left">
                                            {e?.state?.join(',')}
                                        </TableCell>
                                        <TableCell align="left">
                                            {e.users
                                                .map((user) => user.name)
                                                .join(',')}
                                        </TableCell>

                                        <TableCell align="center">
                                            {PERMISSION?.SCHEMES?.EDIT &&
                                            archive ? (
                                                <Link
                                                    to={`/addschemes/${e._id}`}
                                                >
                                                    <IconButton>
                                                        <Icon color="primary">
                                                            autorenew
                                                        </Icon>
                                                    </IconButton>
                                                </Link>
                                            ) : null}

                                            {PERMISSION?.SCHEMES?.EDIT &&
                                            !archive ? (
                                                <Link
                                                    to={`/addschemes/${e._id}`}
                                                >
                                                    <IconButton>
                                                        <Icon color="primary">
                                                            edit
                                                        </Icon>
                                                    </IconButton>
                                                </Link>
                                            ) : null}

                                            {PERMISSION?.SCHEMES?.DELETE &&
                                            !archive ? (
                                                <IconButton
                                                    onClick={() =>
                                                        handleDialog(e._id)
                                                    }
                                                >
                                                    <Icon color="error">
                                                        delete_forever
                                                    </Icon>
                                                </IconButton>
                                            ) : null}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </StyledTable>

                        <Box my={2} display="flex" justifyContent="center">
                            <Pagination
                                count={pageCount}
                                color="primary"
                                variant="outlined"
                                page={currentPage}
                                showFirstButton
                                showLastButton
                                defaultPage={1}
                                onChange={handlePageClick}
                            />
                        </Box>
                    </SimpleCard>

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
                </Container>
            )}
            <CustomDialog
                open={dialogOpen}
                title="Are you sure you want to delete ?"
                message="It will be the permanent action."
                handleClose={(e) => handleDialog(e)}
            />
        </Fragment>
    )
}

export default Schemes
