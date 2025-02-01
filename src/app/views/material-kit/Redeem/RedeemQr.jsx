import React, { useEffect, useState, Fragment, useRef } from 'react'
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
    Autocomplete,
} from '@mui/material'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { useParams, Link } from 'react-router-dom'
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
import { PERMISSION } from 'app/constant'
import Loading from '../../../components/MatxLoading/MatxLoading'

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

const RedeemQr = () => {
    let { id } = useParams()
    let offset = useRef(0)
    let limit = 10,
        q = useRef({
            role: id,
            type: 'QR',
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
    const [status, setStatus] = useState(-1)
    const [userList, setUserList] = useState([])
    const [selectedUser, setSelectedUser] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)

    useEffect( () => {
        offset.current = 0
        q.current = {
            role: id,
            type: 'QR',
        }
        setSelectedUser([])
        setCurrentPage(1)

        getUserList()

    }, [id])

    const getRedeemList = () => {
        listRedeem(-1)
    }

    const listRedeem = (newS) => {
        setLoader(true)


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

    const getUserList = (newStatus) => {

        setLoader(true)

        let qc = {
            role: id,
            type: 'QR',
            // status:
            //     typeof q.current['status'] === 'undefined'
            //         ? -1
            //         : q.current['status'],
        }
        // if (qc['status'] === -1) {
        //     delete qc['status']
        // }
        api.Redeem.userName(qc)
            .then((res) => {

                setUserList(res.data.data.records)
                setLoader(true)
                getRedeemList()


            })
            .catch((err) => ErrorHandler(err))
    }
    const handlePageClick = (event, value) => {
        let currentPage = value
        setCurrentPage(value)
        var skip = Number(limit * (currentPage - 1))

        offset.current = skip
        listRedeem(status)
    }

    const updateStatus = () => {
        setLoader(true)

        api.Redeem.updateRedeemStatus(patch._id, {
            status: patch.status,
            trans_msg: patch.trans_msg,
            type: 'QR',
        })
            .then((response) => {
                if (response.status === 200) {
                    setOpen(false)
                    setPatch({
                        _id: '',
                        status: -1,
                        trans_msg: '',
                    })
                    listRedeem()
                    SuccessHandler('Updated.')
                }
                setLoader(false)

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

    const handleStatus = (id, status) => {
        setPatch({
            _id: id,
            status: status,
            trans_msg: '',
        })
        setOpen(true)
    }

    const HandleFilter = (e) => {
        setCurrentPage(1)
        setStatus(e.target.value)
        offset.current = 0
        if (e.target.value !== -1) {
            q.current['status'] = e.target.value
        } else {
            delete q.current['status']
        }
        listRedeem()
    }

    const selectUser = (event, value) => {
        const id = value.map((p) => p._id)
        if (id.length) {
            q.current = { ...q.current, user: value.map((p) => p._id) }
        } else {
            delete q.current['user']
        }
        setSelectedUser(value)
        offset.current = 0
        setCurrentPage(1)
        listRedeem()
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
                            <Grid item lg={7} md={9}>
                                <h3>Total Records : {totalRecords}</h3>
                            </Grid>
                            <Grid item lg={3} md={4} px={3}>
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={userList}
                                    getOptionLabel={(option) => option.name}
                                    filterSelectedOptions
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            placeholder="Search User"
                                            fullWidth
                                        />
                                    )}
                                    value={selectedUser}
                                    onChange={selectUser}
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
                                        value={status}
                                        onChange={HandleFilter}
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
                                    <TableCell width="20%" align="left">
                                        User
                                    </TableCell>
                                    <TableCell width="10%" align="left">
                                        Points
                                    </TableCell>
                                    <TableCell width="20%" align="left">
                                        Bank Info
                                    </TableCell>
                                    <TableCell width="20%" align="left">
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
                                            <Link
                                                to={`/scan/${id}/${r?.user?._id}`}
                                                style={{
                                                    color: '#0000FF99',
                                                    cursor: 'pointer',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {r?.user_info?.name}
                                            </Link>
                                            <br />
                                            <strong>Mobile :</strong>
                                            {r?.user_info?.mobile}
                                            {/* <br />
                                            <strong>Email :</strong>
                                            {r?.user_info?.email} */}
                                        </TableCell>

                                        <TableCell align="left">
                                            <strong>Req : </strong>
                                            {r?.points}
                                            <br />
                                            <strong>Total : </strong>
                                            {r?.user_info?.points}
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
                                                        value={r.status}
                                                        onChange={(e) =>
                                                            handleStatus(
                                                                r._id,
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <MenuItem
                                                            value={0}
                                                            disabled
                                                        >
                                                            Pending
                                                        </MenuItem>
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
                                onChange={handlePageClick}
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
                                        {patch.status === 1 ? (
                                            <FormControl>
                                                <FormLabel id="demo-row-radio-buttons-group-label">
                                                    Transaction method
                                                </FormLabel>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="trans_msg"
                                                    value={patch.trans_msg}
                                                    onChange={HandleForm}
                                                >
                                                    <FormControlLabel
                                                        value="Bank"
                                                        control={<Radio />}
                                                        label="Bank"
                                                    />
                                                    <FormControlLabel
                                                        value="UPI"
                                                        control={<Radio />}
                                                        label="UPI"
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        ) : (
                                            <TextField
                                                label="Decline message"
                                                type="text"
                                                name="trans_msg"
                                                fullWidth
                                                value={patch.trans_msg}
                                                onChange={HandleForm}
                                                validators={['required']}
                                            />
                                        )}
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

export default RedeemQr
