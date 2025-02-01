import React, { useEffect, useState, Fragment } from 'react'
import { styled } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import { useNavigate } from 'react-router-dom'
import {
    Icon,
    Grid,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'
import api from '../../../../api'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { Span } from 'app/components/Typography'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import Autocomplete from '@mui/material/Autocomplete'
import { useParams } from 'react-router-dom'
import { PERMISSION } from 'app/constant'
import { LoadingButton } from '@mui/lab'
import Loading from '../../../components/MatxLoading/MatxLoading'
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

const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px',
}))

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function AddSchemes(props) {
    const [electrician, setElectrician] = useState({
        name: '',
        points: 0,
        start_date: new Date(),
        end_date: new Date(),
        desc: '',
        role: '',
        users: [],
        state: [],
    })
    const [roleList, setRoleList] = useState([])
    const [usersList, setUsersList] = useState([])
    const [snack, setSnack] = useState(false)
    const [edit, setEdit] = useState(false)
    const [alert, setAlert] = React.useState({
        type: 'success',
        message: '',
    })
    const [addLoader, setAddLoader] = useState(false)
    const [loader, setLoader] = useState(false)
    const [stateList, setStateList] = useState([])

    let { id } = useParams()

    let navigate = useNavigate()
    useEffect(() => {
        if (id) {
            getUserEdit()
        }
        getRoleList()
        getStateList(true)
    }, [])

    const getRoleList = () => {
        api.appRole
            .roles()
            .then((response) => {
                setRoleList(response.data.data.record.roles)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const getUserList = (data) => {
        setLoader(true)
        api.appUser
            .list({
                q: {
                    role: data,
                },
                p: {
                    name: 1,
                },
                s: {},
                o: 0,
                l: 0,
            })
            .then((response) => {
                setLoader(false)
                setUsersList(response.data.data.records)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const getUserEdit = () => {
        setLoader(true)
        api.scheme
            .getScheme(id)
            .then((response) => {
                if (response.status === 200) {
                    let newElectrician = { ...electrician }
                    newElectrician['name'] = response?.data?.data?.record?.name
                    newElectrician['points'] =
                        response?.data?.data?.record?.points
                    newElectrician['start_date'] =
                        response?.data?.data?.record?.start_date.slice(0, 10)
                    newElectrician['end_date'] =
                        response?.data?.data?.record?.end_date.slice(0, 10)
                    newElectrician['desc'] = response?.data?.data?.record?.desc
                    newElectrician['role'] = response?.data?.data?.record?.role
                    newElectrician['users'] =
                        response?.data?.data?.record?.users
                    newElectrician['state'] =
                        response?.data?.data?.record?.state
                    setElectrician(newElectrician)
                    getUserList(response?.data?.data?.record?.role)
                    setEdit(true)
                }
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const handleForm = (e) => {
        var name = e.target.name
        var value = e.target.value
        var newElectrician = { ...electrician }
        newElectrician[[name]] = value
        setElectrician(newElectrician)
    }

    const handleStartDate = (e) => {
        const newElectrician = { ...electrician }
        newElectrician.start_date = e.target.value
        setElectrician(newElectrician)
    }

    const handleEndDate = (e) => {
        const newElectrician = { ...electrician }
        newElectrician.end_date = e.target.value
        setElectrician(newElectrician)
    }

    const handleRole = (e, values) => {
        setElectrician({ ...electrician, role: e.target.value, users: [] })
        getUserList(e.target.value)
    }

    const handleUser = (e, values) => {
        const newElectrician = { ...electrician }
        newElectrician.users = values
        setElectrician(newElectrician)
    }

    const handleState = (e, values) => {
        const newElectrician = { ...electrician }
        newElectrician.state = values
        setElectrician(newElectrician)
    }

    const createScheme = () => {
        var ids = []
        setAddLoader(true)
        let i = 0
        while (i < electrician.users.length) {
            ids.push(electrician.users[i]['_id'])
            i++
        }

        api.scheme
            .addSchemes({
                name: electrician.name,
                points: electrician.points,
                start_date: electrician.start_date,
                end_date: electrician.end_date,
                desc: electrician.desc,
                role: electrician.role,
                state: electrician.state,
                users: ids,
            })
            .then((response) => {
                if (response.status === 201) {
                    setSnack(true)
                    SuccessHandler('Created.')
                    setElectrician({
                        name: '',
                        points: '',
                        start_date: new Date(),
                        end_date: new Date(),
                        desc: '',
                        role: '',
                        users: [],
                        state: [],
                    })
                }
                setAddLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const updateScheme = () => {
        var ids = []
        let i = 0
        while (i < electrician.users.length) {
            ids.push(electrician.users[i]['_id'])
            i++
        }
        let role
        if (electrician.role?._id) {
            role = electrician.role.name
        } else {
            role = electrician.role
        }

        const startDate = new Date(electrician.start_date)
        startDate.setUTCHours(0)
        startDate.setUTCMinutes(0)
        startDate.setUTCSeconds(0)
        startDate.setUTCMilliseconds(0)

        const endDate = new Date(electrician.end_date)
        endDate.setUTCHours(0)
        endDate.setUTCMinutes(0)
        endDate.setUTCSeconds(0)
        endDate.setUTCMilliseconds(0)

        api.scheme
            .editScheme(id, {
                name: electrician.name,
                points: electrician.points,
                start_date: startDate,
                end_date: endDate,
                desc: electrician.desc,
                role: role,
                users: ids,
                state: electrician.state,
            })
            .then((response) => {
                if (response.status === 200) {
                    setSnack(true)
                    SuccessHandler('Updated!')
                    let role = electrician.role
                    setElectrician({
                        name: '',
                        points: '',
                        start_date: new Date(),
                        end_date: new Date(),
                        desc: '',
                        role: '',
                        users: [],
                        state: [],
                    })
                    navigate('/view-scheme/' + role + '/false', {
                        replace: true,
                    })
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
        setAddLoader(false)
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
    return (
        <Fragment>
            {loader ? (
                <Loading />
            ) : (
                <Container>
                    <div className="breadcrumb">
                        <Breadcrumb routeSegments={[{ name: 'Add Schemes' }]} />
                    </div>

                    <SimpleCard title="Add New Scheme">
                        <Divider />
                        <ValidatorForm
                            onSubmit={edit ? updateScheme : createScheme}
                            onError={() => null}
                        >
                            <Grid container spacing={2} sx={{ mt: 3 }}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        label="Name"
                                        type="text"
                                        name="name"
                                        size="small"
                                        value={electrician.name}
                                        onChange={handleForm}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}></Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <TextField
                                        id="start_date"
                                        label="Start Date"
                                        type="date"
                                        size="small"
                                        value={electrician.start_date}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleStartDate}
                                    />
                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <TextField
                                        id="end_date"
                                        label="End Date"
                                        type="date"
                                        size="small"
                                        value={electrician.end_date}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleEndDate}
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}></Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        label="Description"
                                        type="text"
                                        name="desc"
                                        size="small"
                                        multiline
                                        rows={4}
                                        value={electrician.desc}
                                        onChange={handleForm}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}></Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <TextField
                                        label="Points"
                                        type="number"
                                        name="points"
                                        InputProps={{ inputProps: { min: 0 } }}
                                        value={electrician.points}
                                        onChange={handleForm}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="role">Role</InputLabel>
                                        <Select
                                            labelId="role"
                                            id="select"
                                            label="Status"
                                            value={electrician.role}
                                            onChange={handleRole}
                                        >
                                            {roleList.map((value, index) => (
                                                <MenuItem
                                                    value={value.name}
                                                    key={index}
                                                >
                                                    {value.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}></Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Autocomplete
                                        disablePortal
                                        multiple
                                        id="state"
                                        size="small"
                                        value={electrician.state}
                                        options={stateList}
                                        onChange={handleState}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="State"
                                                value={electrician.state}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}></Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Autocomplete
                                        disablePortal
                                        multiple
                                        disabled={!electrician.role.length}
                                        id="Users"
                                        size="small"
                                        value={
                                            electrician.users.length
                                                ? electrician.users
                                                : []
                                        }
                                        options={usersList}
                                        getOptionLabel={(option) =>
                                            option ? option.name : ''
                                        }
                                        getoptionselected={
                                            electrician.users.length
                                                ? (option, value) =>
                                                      value.id === option.id
                                                : ''
                                        }
                                        onChange={handleUser}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Users"
                                                value={
                                                    electrician.users.length
                                                        ? electrician.users
                                                        : 'NA'
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            {edit ? (
                                PERMISSION.SCHEMES.EDIT ? (
                                    <LoadingButton
                                        type="submit"
                                        color="primary"
                                        loading={addLoader}
                                        variant="contained"
                                        size="small"
                                        mt={2}
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
                                    </LoadingButton>
                                ) : null
                            ) : PERMISSION.SCHEMES.CREATE ? (
                                <LoadingButton
                                    type="submit"
                                    color="primary"
                                    loading={addLoader}
                                    variant="contained"
                                    size="small"
                                    mt={2}
                                >
                                    <Icon>send</Icon>
                                    <Span
                                        sx={{
                                            pl: 1,
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        Submit
                                    </Span>
                                </LoadingButton>
                            ) : null}
                        </ValidatorForm>
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
        </Fragment>
    )
}

export default AddSchemes
