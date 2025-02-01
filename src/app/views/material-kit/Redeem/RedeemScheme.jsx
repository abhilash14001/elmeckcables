import React, { useEffect, useState, Fragment } from 'react'
import { Breadcrumb, SimpleCard } from 'app/components'
import { styled, Box } from '@mui/system'
import {
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
    Dialog,
    DialogContent,
    Grid,
    TextField,
    DialogActions,
    Button,
    Icon,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import api from '../../../../api'

import Pagination from '@mui/material/Pagination'
import { Span } from 'app/components/Typography'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import '../custom-loader/loader.css'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { PERMISSION } from 'app/constant'
import Loading from '../../../components/MatxLoading/MatxLoading'
import Autocomplete from '@mui/material/Autocomplete'
import { useRef } from 'react'

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

const RedeemScheme = () => {
    let { id } = useParams()
    const offset = useRef(0)
    const limit = 10,
        q = useRef({
            role: id,
            type: 'SCHEME',
        })

    const [pageCount, setpageCount] = useState(0)
    const [redeemList, setRedeemList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [snack, setSnack] = useState(false)
    const [loader, setLoader] = useState(true)

    const [alert, setAlert] = React.useState({
        type: 'success',
        message: '',
    })
    const [patch, setPatch] = useState({
        _id: '',
        status: -1,
        trans_msg: '',
    })
    const [open, setOpen] = useState(false)

    const [stateList, setStateList] = useState([])
    const [schemeList, setSchemeList] = useState([])

    const [filter, setFilter] = useState({
        status: -1,
        scheme: '',
        state: '',
        user: [],
    })

    const [userList, setUserList] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)

    useEffect(() => {
        q.current = {
            role: id,
            type: 'SCHEME',
        }
        offset.current = 0
        setFilter({
            status: -1,
            scheme: '',
            state: '',
            user: [],
        })
        getStateList()
        getSchemeList()
        getUserList()

        listRedeem({}, 1)
    }, [id])

    const getStateList = () => {
        setLoader(true)
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

    const getSchemeList = () => {
        setLoader(true)
        let qc = {
            role: id,
            type: 'SCHEME',
        }
        api.Redeem.schemeName(qc)
            .then((res) => {
                setSchemeList(res.data.data.records)
                setLoader(false)
            })
            .catch((err) => ErrorHandler(err))
    }

    const getUserList = () => {
        setLoader(true)
        let qc = {
            role: id,
            type: 'SCHEME',
        }
        api.Redeem.userName(qc)
            .then((res) => {
                setUserList(res.data.data.records)
                setLoader(false)
            })
            .catch((err) => ErrorHandler(err))
    }

    const listRedeem = (event, value) => {
        setLoader(true)
        setCurrentPage(value)
        offset.current = Number(limit * (value - 1))

        api.Redeem.listRedeem({
            q: q.current,
            o: offset.current,
            l: limit,
        })
            .then((response) => {
                setRedeemList(response.data.data.records)
                setpageCount(Math.ceil(response.data.data.totalRecords / limit))
                setTotalRecords(response.data.data.totalRecords)
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const handleUpdateStatus = (id, status) => {
        setPatch({
            _id: id,
            status: status,
            trans_msg: '',
        })
        setOpen(true)
    }

    const updateStatus = (e, data) => {
        setLoader(true)

        api.Redeem.updateRedeemStatus(patch._id, {
            status: patch.status,
            trans_msg: patch.trans_msg,
            type: 'SCHEME',
        })
            .then((response) => {
                if (response.status === 200) {
                    listRedeem({}, currentPage)
                    SuccessHandler('Updated.')
                    setOpen(false)
                }
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const handleUser = (event, value) => {
        const id = value.map((p) => p._id)

        if (id.length) {
            q.current = { ...q.current, user: value.map((p) => p._id) }
        } else {
            delete q.current['user']
        }

        setFilter({
            ...filter,
            user: value,
        })
        listRedeem({}, 1)
    }

    const handleSchema = (e, v) => {
        if (v) {
            q.current = {
                ...q.current,
                'scheme._id': v._id,
            }
        } else {
            delete q.current['scheme._id']
        }

        listRedeem({}, 1)
        setFilter({
            ...filter,
            scheme: v,
        })
    }

    const handleState = (e, v) => {
        if (v && v.length) {
            q.current = {
                ...q.current,
                'user_info.address.state': v,
            }
        } else {
            delete q.current['user_info.address.state']
        }

        setFilter({
            ...filter,
            state: v,
        })
        listRedeem({}, 1)
    }

    const handleStatus = (e) => {
        const v = e.target.value
        if (v === -1) {
            delete q.current['status']
        } else {
            q.current = {
                ...q.current,
                status: e.target.value,
            }
        }
        setFilter({
            ...filter,
            status: e.target.value,
        })
        listRedeem({}, 1)
    }

    const snackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setSnack(false)
        setAlert({
            type: 'success',
            message: '',
        })
    }

    const SuccessHandler = (message) => {
        setSnack(true)
        setAlert({
            type: 'success',
            message: message,
        })
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

    const HandleForm = (e) => {
        setPatch({
            ...patch,
            [e.target.name]: e.target.value,
        })
    }

    const modelClose = () => {
        setOpen(false)
        setPatch({
            _id: '',
            status: -1,
            trans_msg: '',
        })
    }

    return (
        <Fragment>
            {loader ? (
                <Loading />
            ) : (
                <Container>
                    <div className="breadcrumb">
                        <Breadcrumb routeSegments={[{ name: `${id}` }]} />
                    </div>
                    <SimpleCard>
                        <Grid container mb={3} alignItems="center">
                            <Grid item lg={2} md={2}>
                                <h3>Total Records : {totalRecords}</h3>
                            </Grid>
                            <Grid item lg={4} md={4} px={3}>
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={userList}
                                    name="users"
                                    getOptionLabel={(option) =>
                                        option.name || ''
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                        value === undefined ||
                                        value === '' ||
                                        option._id === value._id
                                    }
                                    value={filter.user}
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Users"
                                            name="users"
                                            value={filter.user}
                                        />
                                    )}
                                    onChange={handleUser}
                                />
                            </Grid>
                            <Grid item lg={2} md={4} pl={3} pr={3}>
                                <Autocomplete
                                    id="schema"
                                    size="small"
                                    name="schema"
                                    options={schemeList}
                                    getOptionLabel={(option) =>
                                        option.name || ''
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                        value === undefined ||
                                        value === '' ||
                                        option._id === value._id
                                    }
                                    onChange={handleSchema}
                                    value={filter.scheme}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Scheme Name"
                                            name="schema"
                                            value={filter.scheme}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={2} md={4} pl={3} pr={3}>
                                <Autocomplete
                                    id="state"
                                    size="small"
                                    name="state"
                                    value={filter.state}
                                    options={stateList}
                                    onChange={handleState}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="State"
                                            name="state"
                                            value={filter.state}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item lg={2} md={3}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel id="status-form">
                                        Status
                                    </InputLabel>
                                    <Select
                                        labelId="status-form"
                                        label="Status"
                                        name="status"
                                        onChange={handleStatus}
                                        value={filter.status}
                                    >
                                        <MenuItem value={-1}>All</MenuItem>
                                        <MenuItem value={0}>Pending</MenuItem>
                                        <MenuItem value={1}>Approved</MenuItem>
                                        <MenuItem value={2}>Declined</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="15%" align="left">
                                        User
                                    </TableCell>
                                    <TableCell width="15%" align="left">
                                        Scheme
                                    </TableCell>
                                    <TableCell width="10%" align="left">
                                        Points
                                    </TableCell>
                                    <TableCell width="20%" align="left">
                                        Bank Info
                                    </TableCell>
                                    <TableCell width="10%" align="left">
                                        Upi
                                    </TableCell>

                                    <TableCell width="15%" align="center">
                                        Status
                                    </TableCell>
                                    <TableCell width="15%" align="center">
                                        Date
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {redeemList.map((r, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="left">
                                            <strong>Name :</strong>
                                            {r?.user_info?.name}
                                            <br />
                                            <strong>Mobile :</strong>
                                            {r?.user_info?.mobile}
                                            <br />
                                            <strong>Email :</strong>
                                            {r?.user_info?.email}
                                        </TableCell>
                                        <TableCell align="left">
                                            <strong>Scheme Name : </strong>

                                            {r?.scheme?.name}
                                            <br />
                                            <br />
                                            <strong>Desc : </strong>
                                            {r?.scheme?.desc}
                                        </TableCell>
                                        <TableCell align="left">
                                            <strong>Req : </strong>
                                            {r?.points}
                                            <br />
                                            <strong>Total : </strong>
                                            {r?.user_info?.scheme_points}
                                        </TableCell>

                                        <TableCell>
                                            <strong>Name : </strong>
                                            {r?.user_info?.bank_details?.name}
                                            <br />
                                            <strong>Beneficiary name : </strong>
                                            {
                                                r?.user_info?.bank_details
                                                    ?.beneficiary_name
                                            }
                                            <br />
                                            <strong>Account No. : </strong>
                                            {
                                                r?.user_info?.bank_details
                                                    ?.account_no
                                            }
                                            <br />
                                            <strong>IFSC : </strong>
                                            {r?.user_info?.bank_details?.ifsc}
                                        </TableCell>

                                        <TableCell>
                                            <strong>Holder : </strong>
                                            {r?.user_info?.upi?.holder}
                                            <br />
                                            <strong>Id : </strong>
                                            {r?.user_info?.upi?.id}
                                        </TableCell>

                                        <TableCell align="center">
                                            {r?.status === 0 ? (
                                                <FormControl
                                                    sx={{ m: 1, minWidth: 120 }}
                                                    size="small"
                                                >
                                                    <InputLabel id="demo-simple-select-label">
                                                        Status
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="select"
                                                        label="Status"
                                                        disabled={
                                                            !PERMISSION?.REDEEM
                                                                ?.EDIT
                                                        }
                                                        value={
                                                            r.status
                                                                ? r.status
                                                                : ''
                                                        }
                                                        onChange={(e) =>
                                                            handleUpdateStatus(
                                                                r._id,
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <MenuItem value={1}>
                                                            Approved
                                                        </MenuItem>
                                                        <MenuItem value={2}>
                                                            Declined
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            ) : r?.status === 1 ? (
                                                <Span
                                                    style={{
                                                        color: 'green',
                                                        cursor: 'pointer',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {' '}
                                                    {'Approved'}{' '}
                                                </Span>
                                            ) : (
                                                <Span
                                                    style={{
                                                        color: 'red',
                                                        cursor: 'pointer',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {'Declined'}
                                                </Span>
                                            )}
                                        </TableCell>

                                        <TableCell align="center">
                                            <strong>Req On : </strong>
                                            {new Date(
                                                r?.created_at
                                            ).toLocaleString('en-US', {
                                                day: 'numeric',
                                                year: 'numeric',
                                                month: 'short',
                                            })}
                                            <br />
                                            {r?.redeem_date ? (
                                                <strong>Completed On : </strong>
                                            ) : (
                                                ''
                                            )}

                                            {r?.redeem_date
                                                ? new Date(
                                                      r?.redeem_date
                                                  ).toLocaleString('en-US', {
                                                      day: 'numeric',
                                                      year: 'numeric',
                                                      month: 'short',
                                                  })
                                                : ''}
                                            <br />
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
                                showFirstButton
                                showLastButton
                                defaultPage={1}
                                onChange={listRedeem}
                                page={currentPage}
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
                    <Dialog
                        fullWidth={true}
                        maxWidth={'sm'}
                        open={open}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogContent>
                            <ValidatorForm onSubmit={updateStatus}>
                                <Grid
                                    container
                                    spacing={12}
                                    style={{ marginTop: '0px' }}
                                >
                                    <Grid
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                        sx={{ mt: 2 }}
                                        style={{ paddingTop: '0px' }}
                                    >
                                        {
                                            <TextField
                                                label={patch.status === 1 ? "Approve Message" : "Decline Message"}
                                                type="text"
                                                name="trans_msg"
                                                fullWidth
                                                value={patch.trans_msg}
                                                onChange={HandleForm}
                                                validators={['required']}
                                            />
                                        }
                                    </Grid>
                                </Grid>

                                <DialogActions>
                                    <Button
                                        color="error"
                                        variant="contained"
                                        onClick={() => modelClose()}
                                        size="small"
                                    >
                                        <Icon>cancel</Icon>
                                        <Span
                                            sx={{
                                                pl: 1,
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            Cancel
                                        </Span>
                                    </Button>

                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        size="small"
                                        disabled={!patch.trans_msg.length}
                                    >
                                        <Icon>send</Icon>
                                        <Span
                                            sx={{
                                                pl: 1,
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            Update
                                        </Span>
                                    </Button>
                                </DialogActions>
                            </ValidatorForm>
                        </DialogContent>
                    </Dialog>
                </Container>
            )}
        </Fragment>
    )
}

export default RedeemScheme
