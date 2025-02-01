import React, { useEffect, useState, Fragment } from 'react'
import { styled } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import {
    Icon,
    Button,
    Grid,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    TableCell,
    Table,
    TableHead,
    TableBody,
    TableRow,
    Divider,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputAdornment,
} from '@mui/material'
import api from '../../../../api'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { Span } from 'app/components/Typography'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { useParams } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import Loading from '../../../components/MatxLoading/MatxLoading'
import { useNavigate } from 'react-router-dom'

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
                textTransform: 'capitalize',
            },
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

function CreateUpdateAppUser(props) {
    let navigate = useNavigate()
    const [appUser, setAppUser] = useState({
        name: '',
        email: '',
        mobile: '',
        address: {
            state: '',
            city: '',
            street: '',
            pin_code: '',
        },
        role: '',
        bank_details: [],
        upis: [],
        extra_info: [
            {
                key: 'Dealer',
                value: '',
            },
        ],
        dealer: 'self',
    })
    const [appUserId, setAppUserId] = useState('')

    const [roleList, setRoleList] = useState([])
    const [errors, setErrors] = useState({})
    const [snack, setSnack] = useState(false)
    const [hideUpis, setHideUpis] = useState(false)
    const [hideBank, setHideBank] = useState(false)
    const [alert, setAlert] = React.useState({
        type: '',
        message: '',
    })
    const [addLoader, setAddLoader] = useState(false)
    const [loader, setLoader] = useState(false)
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])

    let { id } = useParams()

    useEffect(() => {
        if (id) {
            setAppUserId(id)
            get(id)
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

    const handleForm = (e) => {
        const name = e.target.name
        const value = e.target.value

        let newAppUser = appUser

        if (['state', 'city', 'street', 'pin_code'].includes(name)) {
            newAppUser.address[[name]] = value
            if (name === 'state') {
                getStateList(false)
            }
        } else if (name === 'extra_info') {
            newAppUser.extra_info[0].value = value
        } else {
            newAppUser[[name]] = value
        }

        if (name === 'dealer' && value === 'self') {
            newAppUser.extra_info[0].value = value
        }
        setAppUser({ ...newAppUser })
    }

    const formErrors = () => {
        const newErrors = { ...errors }
        newErrors.users = 'this field is required'
        setErrors(newErrors)
    }

    const snackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setSnack(false)
    }

    const submit = () => {
        setAddLoader(true)
        if (appUserId.length) {
            update()
        } else {
            add()
        }
    }

    const getStateList = (stateFlag, state = '') => {
        let q = {}
        if (stateFlag) {
            q = {}
        } else {
            q = {
                state: appUser.address['state'] || state,
            }
        }
        api.state
            .list(q)
            .then((res) => {
                if (stateFlag) setStateList(res.data.data.records)
                else setCityList(res.data.data.records)
            })
            .catch((err) => {
                setLoader(false)
                ErrorHandler(err)
            })
    }

    const add = () => {
        const newUser = {
            ...appUser,
            mobile: '+91' + appUser.mobile,
        }
        delete newUser['dealer']
        api.appUser
            .create(newUser)
            .then((res) => {
                if (res.status === 201) {
                    setSnack(true)
                    SuccessHandler('Created.')
                    setAppUser({
                        name: '',
                        email: '',
                        mobile: '',
                        address: {
                            state: '',
                            city: '',
                            street: '',
                            pin_code: '',
                        },
                        role: '',
                        bank_details: [],
                        upis: [],
                        dealer: 'self',
                        extra_info: [
                            {
                                key: 'Dealer',
                                value: '',
                            },
                        ],
                    })
                }
            })
            .catch((err) => ErrorHandler(err))
    }

    const get = (id) => {
        setLoader(true)
        api.appUser
            .get(id)
            .then((res) => {
                let dealer = 'self'
                if (res.data.data.record.user.role === 'ELECTRICIAN') {
                    if (
                        res.data.data.record.user.extra_info[0].value !== 'self'
                    ) {
                        dealer = 'other'
                    }
                }
                setAppUser({
                    ...res.data.data.record.user,
                    dealer: dealer,
                    mobile: res.data.data.record.user.mobile.replace('+91', ''),
                })
                getStateList(false, res.data.data.record.user.address.state)
                setLoader(false)
            })
            .catch((err) => {
                setLoader(false)
                ErrorHandler(err)
            })
    }

    const update = () => {
        const newUser = appUser
        delete newUser['_id']
        delete newUser['dob']
        delete newUser['dealer']
        delete newUser['last_scanned_qr']
        newUser?.bank_details?.forEach(function (v) {
            delete v._id
        })
        newUser?.upis?.forEach(function (u) {
            delete u._id
        })

        if (hideBank) delete newUser['bank_details']

        if (hideUpis) delete newUser['upis']

        api.appUser
            .update(appUserId, {
                user: { ...appUser, mobile: '+91' + appUser.mobile },
            })
            .then((res) => {
                if (res.status === 200) {
                    setSnack(true)
                    SuccessHandler('Updated.')
                    navigate('/app-user-list/' + appUser.role, {
                        replace: true,
                    })
                }
            })
            .catch((err) => ErrorHandler(err))
    }

    const addBank = () => {
        let newAppUser = { ...appUser }
        var obj = {
            name: '',
            beneficiary_name: '',
            account_no: '',
            ifsc: '',
            mobile: '',
        }
        newAppUser.bank_details.push(obj)
        setAppUser(newAppUser)
    }

    const deleteBank = (i) => {
        let newAppUser = { ...appUser }
        newAppUser.bank_details.splice(i, 1)
        setAppUser(newAppUser)
    }

    const bankForm = (e, index) => {
        let name = e.target.name
        let value = e.target.value
        let newAppUser = { ...appUser }
        newAppUser.bank_details[index][name] = value
        setAppUser(newAppUser)
        if (appUserId.length) {
            setHideUpis(true)
        }
    }

    const addUpis = () => {
        let newAppUser = { ...appUser }
        var obj = {
            holder: '',
            id: '',
        }
        newAppUser.upis.push(obj)
        setAppUser(newAppUser)
    }

    const deleteUpis = (i) => {
        let newAppUser = { ...appUser }
        newAppUser.upis.splice(i, 1)
        setAppUser(newAppUser)
    }

    const upiForm = (e, index) => {
        let name = e.target.name
        let value = e.target.value
        let newAppUser = { ...appUser }
        newAppUser.upis[index][name] = value
        setAppUser(newAppUser)
        if (appUserId.length) {
            setHideBank(true)
            setHideUpis(false)
        }
    }

    const ErrorHandler = (err) => {
        setSnack(true)
        setAddLoader(false)
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
        setAddLoader(false)
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
                    <div className="breadcrumb">
                        <Breadcrumb routeSegments={[{ name: 'App User' }]} />
                    </div>

                    <SimpleCard title={appUserId.length ? 'Update' : 'New'}>
                        <Divider />
                        <ValidatorForm
                            onSubmit={submit}
                            onError={() => formErrors()}
                        >
                            <Grid container spacing={2}>
                                <Grid
                                    item
                                    lg={5}
                                    md={5}
                                    sm={12}
                                    xs={12}
                                    sx={{ mt: 2 }}
                                >
                                    <Grid container spacing={1}>
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            sx={{ mb: 2 }}
                                        >
                                            <Typography variant="body1">
                                                User Details
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            lg={8}
                                            md={8}
                                            sm={12}
                                            xs={12}
                                        >
                                            <TextField
                                                label="Name"
                                                type="text"
                                                name="name"
                                                value={appUser.name}
                                                onChange={handleForm}
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <FormControl fullWidth size="small">
                                                <InputLabel id="appUserRole">
                                                    Role
                                                </InputLabel>
                                                <Select
                                                    labelId="appUserRole"
                                                    id="appUserRoleSelect"
                                                    value={appUser.role}
                                                    name="role"
                                                    label="Role"
                                                    onChange={handleForm}
                                                >
                                                    {roleList.map((role) => (
                                                        <MenuItem
                                                            key={role._id}
                                                            value={role.name}
                                                        >
                                                            {role.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <TextField
                                                label="Email"
                                                type="email"
                                                name="email"
                                                value={appUser.email}
                                                onChange={handleForm}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <TextField
                                                label="Mobile"
                                                type="text"
                                                name="mobile"
                                                value={appUser.mobile}
                                                onChange={handleForm}
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            +91
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                size="small"
                                            />
                                        </Grid>
                                        {appUser.role === 'ELECTRICIAN' ? (
                                            <Grid
                                                item
                                                lg={6}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <RadioGroup
                                                    aria-label="position"
                                                    name="dealer"
                                                    value={appUser.dealer}
                                                    onChange={handleForm}
                                                    row
                                                >
                                                    <FormControlLabel
                                                        value="self"
                                                        control={
                                                            <Radio color="primary" />
                                                        }
                                                        label="Dealer : Self"
                                                        labelPlacement="start"
                                                    />
                                                    <FormControlLabel
                                                        value="other"
                                                        control={
                                                            <Radio color="primary" />
                                                        }
                                                        label="Dealer : Other"
                                                        labelPlacement="start"
                                                    />
                                                </RadioGroup>
                                            </Grid>
                                        ) : null}
                                        {appUser.role === 'ELECTRICIAN' &&
                                        appUser.dealer &&
                                        appUser.dealer.toLowerCase() !==
                                            'self' ? (
                                            <Grid
                                                item
                                                lg={6}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    label="Dealer Name"
                                                    type="text"
                                                    name="extra_info"
                                                    value={
                                                        appUser.extra_info[0]
                                                            .value
                                                    }
                                                    onChange={handleForm}
                                                    size="small"
                                                />
                                            </Grid>
                                        ) : null}
                                    </Grid>
                                </Grid>
                                <Grid item lg={1}>
                                    <Divider orientation="vertical" />
                                </Grid>
                                <Grid
                                    item
                                    lg={5}
                                    md={5}
                                    sm={12}
                                    xs={12}
                                    sx={{ mt: 2 }}
                                >
                                    <Grid container spacing={1}>
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            sx={{ mb: 2 }}
                                        >
                                            <Typography variant="body1">
                                                Address
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <TextField
                                                label="Street"
                                                type="text"
                                                name="street"
                                                value={appUser.address.street}
                                                onChange={handleForm}
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            lg={5}
                                            md={5}
                                            sm={12}
                                            xs={12}
                                        >
                                            <FormControl size="small" fullWidth>
                                                <InputLabel id="state">
                                                    State
                                                </InputLabel>
                                                <Select
                                                    labelId="state"
                                                    label="State"
                                                    name="state"
                                                    value={
                                                        appUser.address.state
                                                    }
                                                    onChange={handleForm}
                                                    validators={['required']}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                >
                                                    {stateList.map((v, i) => (
                                                        <MenuItem
                                                            value={v}
                                                            key={v + i}
                                                        >
                                                            {v}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <FormControl size="small" fullWidth>
                                                <InputLabel id="city">
                                                    City
                                                </InputLabel>
                                                <Select
                                                    labelId="city"
                                                    label="City"
                                                    name="city"
                                                    value={appUser.address.city}
                                                    onChange={handleForm}
                                                    validators={['required']}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                >
                                                    {cityList.map((v, i) => (
                                                        <MenuItem
                                                            value={v}
                                                            key={v + i}
                                                        >
                                                            {v}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid
                                            item
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <TextField
                                                label="Pin code"
                                                type="text"
                                                name="pin_code"
                                                value={appUser.address.pin_code}
                                                onChange={handleForm}
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    sx={{ marginTop: '2rem' }}
                                >
                                    {/* <Divider /> */}
                                    <StyledTable title={'Bank_details'}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Bank Name</TableCell>
                                                <TableCell>
                                                    Beneficiary Name
                                                </TableCell>

                                                <TableCell>
                                                    Account No.
                                                </TableCell>
                                                <TableCell>IFSC</TableCell>
                                                <TableCell>
                                                    Mobile No.
                                                </TableCell>
                                                <TableCell width="5%"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {appUser.bank_details?.map(
                                                (b, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <TextField
                                                                label="Name"
                                                                type="text"
                                                                name="name"
                                                                value={b?.name}
                                                                onChange={(e) =>
                                                                    bankForm(
                                                                        e,
                                                                        index
                                                                    )
                                                                }
                                                                validators={[
                                                                    'required',
                                                                ]}
                                                                errorMessages={[
                                                                    'this field is required',
                                                                ]}
                                                                size="small"
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            <TextField
                                                                label="Beneficiary Name"
                                                                type="text"
                                                                name="beneficiary_name"
                                                                value={
                                                                    b?.beneficiary_name
                                                                }
                                                                onChange={(e) =>
                                                                    bankForm(
                                                                        e,
                                                                        index
                                                                    )
                                                                }
                                                                validators={[
                                                                    'required',
                                                                ]}
                                                                errorMessages={[
                                                                    'this field is required',
                                                                ]}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                label="Account No"
                                                                type="text"
                                                                name="account_no"
                                                                value={
                                                                    b?.account_no
                                                                }
                                                                onChange={(e) =>
                                                                    bankForm(
                                                                        e,
                                                                        index
                                                                    )
                                                                }
                                                                validators={[
                                                                    'required',
                                                                ]}
                                                                errorMessages={[
                                                                    'this field is required',
                                                                ]}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                label="IFSC"
                                                                type="text"
                                                                name="ifsc"
                                                                value={b?.ifsc}
                                                                onChange={(e) =>
                                                                    bankForm(
                                                                        e,
                                                                        index
                                                                    )
                                                                }
                                                                validators={[
                                                                    'required',
                                                                ]}
                                                                errorMessages={[
                                                                    'this field is required',
                                                                ]}
                                                                size="small"
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            <TextField
                                                                label="Mobile"
                                                                type="text"
                                                                name="mobile"
                                                                value={
                                                                    b?.mobile
                                                                }
                                                                onChange={(e) =>
                                                                    bankForm(
                                                                        e,
                                                                        index
                                                                    )
                                                                }
                                                                validators={[
                                                                    'required',
                                                                ]}
                                                                errorMessages={[
                                                                    'this field is required',
                                                                ]}
                                                                size="small"
                                                            />
                                                        </TableCell>

                                                        <TableCell
                                                            sx={{
                                                                verticalAlign:
                                                                    'baseline',
                                                            }}
                                                        >
                                                            <Button
                                                                color="error"
                                                                onClick={() =>
                                                                    deleteBank(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <Icon>
                                                                    clear
                                                                </Icon>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </StyledTable>

                                    {appUser.bank_details.length === 0 ? (
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="small"
                                            sx={{ marginTop: '1rem' }}
                                            onClick={() => addBank()}
                                        >
                                            <Icon>add</Icon>
                                            <Span>Add Bank Details</Span>
                                        </Button>
                                    ) : null}
                                </Grid>

                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                    sx={{ marginTop: '2rem' }}
                                >
                                    <StyledTable title={'Upis'}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    UPI Holder
                                                </TableCell>
                                                <TableCell>UPI Id</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {appUser.upis?.map((u, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <TextField
                                                            label="Holder"
                                                            type="text"
                                                            name="holder"
                                                            value={u?.holder}
                                                            onChange={(e) =>
                                                                upiForm(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                            size="small"
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            label="Id"
                                                            type="text"
                                                            name="id"
                                                            value={u?.id}
                                                            onChange={(e) =>
                                                                upiForm(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    </TableCell>

                                                    <TableCell
                                                        sx={{
                                                            verticalAlign:
                                                                'baseline',
                                                        }}
                                                    >
                                                        <Button
                                                            color="error"
                                                            onClick={() =>
                                                                deleteUpis(
                                                                    index
                                                                )
                                                            }
                                                            size="small"
                                                        >
                                                            <Icon>clear</Icon>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </StyledTable>

                                    {appUser.upis.length === 0 ? (
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="small"
                                            onClick={() => addUpis()}
                                            sx={{ marginTop: '1rem' }}
                                        >
                                            <Icon>add</Icon>
                                            <Span>Add Upi Details</Span>
                                        </Button>
                                    ) : null}
                                </Grid>
                            </Grid>

                            <LoadingButton
                                color="primary"
                                variant="contained"
                                type="submit"
                                loading={addLoader}
                                sx={{ marginTop: '3rem' }}
                            >
                                <Icon>send</Icon>
                                <Span
                                    sx={{ pl: 1, textTransform: 'capitalize' }}
                                >
                                    {appUserId.length ? 'Update' : 'Add'}
                                </Span>
                            </LoadingButton>
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

export default CreateUpdateAppUser
