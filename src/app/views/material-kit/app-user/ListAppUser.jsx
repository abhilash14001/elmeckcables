import React, { useState, useEffect, Fragment } from 'react'
import { Breadcrumb, SimpleCard } from 'app/components'
import { styled, Box } from '@mui/system'
import Pagination from '@mui/material/Pagination'
import {
    Table,
    TableHead,
    TableCell,
    TableBody,
    Icon,
    TableRow,
    IconButton,
    Divider,
    Chip,
    Tooltip,
    Grid,
    Select,
    FormControl,
    InputLabel,
    MenuItem, TextField,
} from '@mui/material'
import api from '../../../../api'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { Link, useParams } from 'react-router-dom'
import List from '@mui/material/List'
import { Span } from 'app/components/Typography'
import { PERMISSION } from 'app/constant'
import Loading from '../../../components/MatxLoading/MatxLoading'
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

const AppUserList = () => {
    let { id } = useParams()
    let q = {
        role: id,
    }

    const [snack, setSnack] = useState(false)
    let limit = 10
    const [pageCount, setpageCount] = useState(0)
    const [offset, setOffset] = useState(0)
    const [appUserList, setAppUserList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [loader, setLoader] = useState(true)
    const [filter, setFilter] = useState({
        state: 'All',
        city : '',
        name : '',
    })
    const [totalRecords, setTotalRecords] = useState(0)
    const [alert, setAlert] = React.useState({
        type: '',
        message: '',
    })
    const [stateList, setStateList] = useState([])
    const [deleteId, setDeleteId] = React.useState('')
    const [dialogOpen, setDialogOpen] = React.useState(false)

    useEffect(() => {
        setCurrentPage(1)
        setOffset(0)
        listUser()
        getStateList()
        setFilter({
            state: 'All',
            city : "",
            name : ""
        })
    }, [id])

    const listUser = (data, load = true) => {
        if(load){
        setLoader(true)
        }
        api.appUser
            .list({
                q: q,
                p: {},
                s: { created_at: -1 },
                o: data || offset,
                l: limit,
            })
            .then((response) => {
                setAppUserList(response.data.data.records)
                setpageCount(Math.ceil(response.data.data.totalRecords / limit))
                setTotalRecords(response.data.data.totalRecords)
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

    const deleteAppUser = (r) => {
        var skip = 0
        if (currentPage) skip = Number(limit * (currentPage - 1))
        setLoader(true)
        api.appUser
            .remove(deleteId)
            .then((response) => {
                if (response.status === 200) {
                    listUser(skip)
                    setSnack(true)
                    SuccessHandler('Deleted.')
                }
                setLoader(false)
            })
            .catch((err) => {
                setLoader(false)
                ErrorHandler(err)
            })
    }

    const handlePageClick = async (event, value) => {
        let currentPage = value
        var skip = Number(limit * (currentPage - 1))
        setCurrentPage(currentPage)
        setLoader(true)
        api.appUser
            .list({
                q: q,
                p: {},
                s: {},
                o: skip,
                l: limit,
            })
            .then((response) => {
                setLoader(false)
                setAppUserList(response.data.data.records)
            })
            .catch((err) => {
                setLoader(false)
                ErrorHandler(err)
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
        setAlert({
            type: 'error',
            message:
                err.response && err.response.data
                    ? err.response.data.message
                    : 'Error!',
        })
    }

    const calculateDate = (date) => {
        const currentDate = new Date()
        currentDate.setHours(0)
        currentDate.setMinutes(0)
        currentDate.setSeconds(0)
        currentDate.setMilliseconds(0)

        const userDate = new Date(date)

        const timeDiff = currentDate.getTime() - userDate.getTime()

        const days = Math.ceil(timeDiff / (1000 * 3600 * 24))

        return days > 30
    }

    const getStateList = () => {
        api.state
            .list()
            .then((res) => {
                setStateList(res.data.data.records)
            })
            .catch((err) => {
                setLoader(false)
                ErrorHandler(err)
            })
    }
    const HandleFilter = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value,
        })

        if (e.target.value.length && e.target.value !== 'All') {
          switch (e.target.name) {
              case 'city' :
              q = {
                  ...q,
                  'address.city': e.target.value,


              }
              break;

              case 'state' :
                  q = {
                      ...q,
                      'address.state': e.target.value,
                  }

                  break;
              case 'name' :
                  q = {
                      ...q,
                      'name': e.target.value,
                  }

          }


        } else {
            delete q['address']
        }

        setCurrentPage(1)
        listUser(0, false)
    }

    const handleDialog = async (event) => {
        if (event === 'agree') {
            deleteAppUser()
            setDialogOpen(false)
        } else if (event === 'disagree') {
            setDialogOpen(false)
        } else {
            setDeleteId(event)
            setDialogOpen(true)
        }
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
                        <Grid container mb={3} alignItems="center" spacing={1}>
                            <Grid item lg={8} md={9}>
                                <h3>Total Records : {totalRecords}</h3>
                            </Grid>
                            <Grid item lg={4} md={2}>
                                <Grid container spacing={1} alignItems="center">
                                    {['Name', 'City', 'State'].map((placeholder, index) => (
                                        <Grid item xs={12} lg={4} sm={6} key={index}>
                                            <FormControl size="small" fullWidth>

                                                {index < 2 && (
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={placeholder}
                                                        fullWidth
                                                        name={placeholder.toLowerCase()}
                                                        size="small"
                                                        value={filter[placeholder.toLowerCase()]}
                                                        onChange={HandleFilter}
                                                    />
                                                )}
                                                {index === 2 && (

                                                    <>
                                                        <InputLabel id="state">State</InputLabel>
                                                        <Select
                                                            labelId="state"
                                                            label="State"
                                                            name="state"
                                                            value={filter.state}
                                                            onChange={HandleFilter}
                                                        >
                                                            <MenuItem value={'All'}>All</MenuItem>
                                                            {stateList.map((v, i) => (
                                                                <MenuItem value={v} key={v + i}>
                                                                    {v}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </>
                                                )}
                                            </FormControl>

                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Box sx={{ overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width="20%" sx={{ fontWeight: 'bold' }}>User</TableCell>
                                        <TableCell width="20%" sx={{ fontWeight: 'bold' }}>Address</TableCell>
                                        <TableCell width="20%" sx={{ fontWeight: 'bold' }}>Bank info</TableCell>
                                        <TableCell width="15%" sx={{ fontWeight: 'bold' }}>Upi</TableCell>
                                        <TableCell width="10%" align="center" sx={{ fontWeight: 'bold' }}>
                                            QR Points
                                        </TableCell>
                                        <TableCell width="10%" align="center" sx={{ fontWeight: 'bold' }}>
                                            Scheme Points
                                        </TableCell>
                                        <TableCell width="10%" align="center" sx={{ fontWeight: 'bold' }}>
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {appUserList.map((au, index) => (
                                        <TableRow key={au._id}>
                                            <TableCell>
                                                {calculateDate(au?.last_scanned_qr) ? (
                                                    <>
                                                        <Chip
                                                            label={`Inactive since ${new Date(
                                                                au?.last_scanned_qr
                                                            ).toDateString()}`}
                                                            color="warning"
                                                            size="small"
                                                        />
                                                        <br />
                                                    </>
                                                ) : null}

                                                <Tooltip title="View Activity" placement="top">
                                                    <strong>Name : </strong>
                                                </Tooltip>

                                                <Link
                                                    to={`/activity-log/${id}/${au._id}`}
                                                    style={{
                                                        color: '#0000FF99',
                                                        cursor: 'pointer',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {au?.name}
                                                </Link>
                                                <br />
                                                <strong>Email : </strong>
                                                {au?.email}
                                                <br />
                                                <strong>Mobile : </strong>
                                                {au?.mobile}
                                                <br />
                                                {au?.extra_info?.map((info, value) => (
                                                    <Fragment key={value + index + 'es'}>
                                                        <strong>{info?.key} : </strong>
                                                        {info?.value}
                                                        <br />
                                                    </Fragment>
                                                ))}
                                            </TableCell>

                                            <TableCell>
                                                <strong>State : </strong>
                                                {au?.address?.state}
                                                <br />
                                                <strong>City : </strong>
                                                {au?.address?.city}
                                                <br />
                                                <strong>Pin code : </strong>
                                                <Span>{au?.address?.pin_code}</Span>
                                                <br />
                                                <strong>Street : </strong>
                                                {au?.address?.street}
                                            </TableCell>

                                            <TableCell>
                                                {au.bank_details.map((ban, i) => (
                                                    <Fragment key={i + 'bank'}>
                                                        <strong>Name : </strong>
                                                        {ban.name}
                                                        <br />
                                                        <strong>Beneficiary name : </strong>
                                                        {ban.beneficiary_name}
                                                        <br />
                                                        <strong>Account No. : </strong>
                                                        {ban.account_no}
                                                        <br />
                                                        <strong>IFSC : </strong>
                                                        {ban.ifsc}
                                                        {au.bank_details.length !== i + 1 ? (
                                                            <Divider style={{ margin: '1rem 1rem 1rem 0rem' }} />
                                                        ) : null}
                                                    </Fragment>
                                                ))}
                                            </TableCell>

                                            <TableCell>
                                                <List>
                                                    {au?.upis?.map((upi, index) => (
                                                        <Fragment key={upi.id}>
                                                            <strong>Holder : </strong>
                                                            {upi.holder}
                                                            <br />
                                                            <strong>Id : </strong>
                                                            {upi.id}
                                                            {au.upis.length !== index + 1 ? (
                                                                <Divider style={{ margin: '1rem 0rem 1rem 0rem' }} />
                                                            ) : null}
                                                        </Fragment>
                                                    ))}
                                                </List>
                                            </TableCell>

                                            <TableCell align="center">{au?.points}</TableCell>
                                            <TableCell align="center">{au?.redeem_req_points}</TableCell>
                                            <TableCell align="center">
                                                {PERMISSION.APP_USER.EDIT ? (
                                                    <Link to={`/app-user/${au._id}`}>
                                                        <IconButton>
                                                            <Icon color="primary">edit</Icon>
                                                        </IconButton>
                                                    </Link>
                                                ) : null}

                                                {PERMISSION.APP_USER.DELETE ? (
                                                    <IconButton onClick={() => handleDialog(au._id)}>
                                                        <Icon color="error">delete_forever</Icon>
                                                    </IconButton>
                                                ) : null}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>

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
                </Container>
            )}
            <CustomDialog
                open={dialogOpen}
                title="Are you sure you want to delete ?"
                message="It will be the permanent action and user will not be login again."
                handleClose={(e) => handleDialog(e)}
            />
        </Fragment>
    )
}

export default AppUserList
