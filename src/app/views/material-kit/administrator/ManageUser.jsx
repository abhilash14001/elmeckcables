import React, { useState, useEffect, Fragment } from 'react'
import { Breadcrumb, SimpleCard } from 'app/components'
import { styled, Box } from '@mui/system'
import Pagination from '@mui/material/Pagination'
import {
    Table,
    TableHead,
    TableCell,
    TableBody,
    IconButton,
    Icon,
    TableRow,
    Button,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Span } from 'app/components/Typography'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import api from '../../../../api'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import { PERMISSION } from 'app/constant'
import '../custom-loader/loader.css'
import Loading from '../../../components/MatxLoading/MatxLoading'
import { LoadingButton } from '@mui/lab'
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

const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px',
}))

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const ManageUser = () => {
    const [open, setOpen] = useState(false)
    const [user, setUser] = useState({
        username: '',
        email: '',
        mobile: '',
        password: '',
        role: '',
    })
    let limit = 10
    let offset = 0
    const [pageCount, setpageCount] = useState(0)
    const [userList, setUserList] = useState([])
    const [edit, setEdit] = useState(false)
    const [editId, setEditId] = useState('')
    const [roleList, setRoleList] = useState([])
    const [snack, setSnack] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [loader, setLoader] = useState(true)
    const [addLoader, setAddLoader] = React.useState(false)
    const [resetpassLoader, setResetPassLoader] = useState(false)
    const [alert, setAlert] = React.useState({
        type: '',
        message: '',
    })
    const [totalRecords, setTotalRecords] = useState(0)
    const [deleteId, setDeleteId] = React.useState('')
    const [dialogOpen, setDialogOpen] = React.useState(false)

    useEffect(() => {
        getUserList()
        getRoleList()
    }, [])

    const getUserList = (data) => {
        setLoader(true)
        api.user
            .userList({
                p: {},
                o: data || offset,
                l: limit,
            })
            .then((response) => {
                setUserList(response.data.data.records)
                setpageCount(Math.ceil(response.data.data.totalRecords / limit))
                setTotalRecords(response.data.data.totalRecords)
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const getRoleList = () => {
        api.role
            .listRole({
                p: {
                    _id: 1,
                    permission: 0,
                },
                o: 0,
                l: 0,
            })
            .then((response) => {
                setRoleList(response.data.data.records)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const handlePageClick = async (event, value) => {
        let currentPage = value
        var skip = Number(limit * (currentPage - 1))
        setCurrentPage(currentPage)
        setLoader(true)
        api.user
            .userList({
                p: {},
                o: skip,
                l: limit,
            })
            .then((response) => {
                setLoader(false)
                setUserList(response.data.data.records)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const deleteUser = (u) => {
        var skip = 0
        if (currentPage) skip = Number(limit * (currentPage - 1))
        setLoader(true)
        api.user
            .deleteUser(deleteId)
            .then((response) => {
                if (response.status === 200) {
                    SuccessHandler('Deleted.')
                    getUserList(skip)
                }
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const editUser = (u) => {
        setEdit(true)
        setOpen(true)
        setEditId(u._id)
        setUser({
            username: u.name,
            email: u.email,
            mobile: u.mobile,
            password: u.password,
            role: u.role._id,
        })
    }

    const modelClose = async () => {
        setOpen(false)
        setEdit(false)
        setUser({
            username: '',
            email: '',
            mobile: '',
            password: '',
            role: '',
        })
    }

    const handleName = (e) => {
        var newUser = { ...user }
        newUser['username'] = e.target.value
        setUser(newUser)
    }

    const handleEmail = (e) => {
        var newUser = { ...user }
        newUser['email'] = e.target.value
        setUser(newUser)
    }

    const handlePassword = (e) => {
        var newUser = { ...user }
        newUser['password'] = e.target.value
        setUser(newUser)
    }

    const handleMobile = (e) => {
        var newUser = { ...user }
        newUser['mobile'] = e.target.value
        setUser(newUser)
    }

    const handleRole = (e, values) => {
        var newUser = { ...user }
        newUser['role'] = e.target.value
        setUser(newUser)
    }

    const HandleSubmit = async () => {
        var skip = 0
        if (currentPage) skip = Number(limit * (currentPage - 1))
        setAddLoader(true)
        api.user
            .createUser({
                name: user.username,
                email: user.email,
                password: user.password,
                mobile: user.mobile,
                role: user.role,
            })
            .then((response) => {
                if (response.status === 201) {
                    getUserList(skip)
                    setOpen(false)
                    setSnack(true)
                    SuccessHandler('Created.')
                    setUser({
                        username: '',
                        email: '',
                        mobile: '',
                        password: '',
                        role: '',
                    })
                }
                setAddLoader(false)
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

    const resetPassword = () => {
        var skip = 0
        if (currentPage) skip = Number(limit * (currentPage - 1))
        setResetPassLoader(true)
        api.user
            .editUser(editId, { password: user.password })
            .then((response) => {
                if (response.status === 200) {
                    getUserList(skip)
                    setEdit(false)
                    setEditId('')
                    setOpen(false)
                    setSnack(true)
                    SuccessHandler('Password Updated.')
                }
                setResetPassLoader(false)
            })
            .catch((err) => {
                setResetPassLoader(false)
                ErrorHandler(err)
            })
    }

    const updateUser = () => {
        var skip = 0
        if (currentPage) skip = Number(limit * (currentPage - 1))
        setAddLoader(true)
        api.user
            .editUser(editId, {
                user: {
                    name: user.username,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.role,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    getUserList(skip)
                    setEdit(false)
                    setEditId('')
                    setOpen(false)
                    setSnack(true)
                    SuccessHandler('Updated.')
                    setAddLoader(false)
                    setUser({
                        username: '',
                        email: '',
                        mobile: '',
                        password: '',
                        role: '',
                    })
                }
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const openModal = () => {
        setOpen(true)
        setUser({
            username: '',
            email: '',
            mobile: '',
            password: '',
            role: '',
        })
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

    const handleDialog = async (event) => {
        if (event === 'agree') {
            deleteUser()
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
                    <div className="breadcrumb">
                        <Breadcrumb routeSegments={[{ name: 'Manage User' }]} />
                    </div>
                    <SimpleCard>
                        <Grid container mb={3}>
                            <Grid item lg={11} md={9}>
                                <h3>Total Records : {totalRecords}</h3>
                            </Grid>
                            <Grid item lg={1} md={3}>
                                {PERMISSION.USER.CREATE ? (
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        style={{ float: 'right' }}
                                        size="small"
                                        onClick={() => openModal()}
                                    >
                                        <Icon>add_circle</Icon>
                                    </Button>
                                ) : null}
                            </Grid>
                        </Grid>
                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="10%" align="center">
                                        Index
                                    </TableCell>
                                    <TableCell width="25%" align="center">
                                        Name
                                    </TableCell>
                                    <TableCell width="10%" align="center">
                                        Role
                                    </TableCell>
                                    <TableCell width="25%" align="center">
                                        Email
                                    </TableCell>
                                    <TableCell width="15%" align="center">
                                        Mobile
                                    </TableCell>
                                    <TableCell width="15%" align="center">
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userList.map((u, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            {index + 1 + offset * limit}
                                        </TableCell>

                                        <TableCell align="center">
                                            {u?.name}
                                        </TableCell>

                                        <TableCell align="center">
                                            {u?.role?.name}
                                        </TableCell>

                                        <TableCell align="center">
                                            {u?.email}
                                        </TableCell>

                                        <TableCell align="center">
                                            {u?.mobile}
                                        </TableCell>

                                        <TableCell align="center">
                                            {PERMISSION.USER.EDIT ? (
                                                <IconButton
                                                    onClick={() => editUser(u)}
                                                >
                                                    <Icon color="primary">
                                                        edit
                                                    </Icon>
                                                </IconButton>
                                            ) : null}
                                            {PERMISSION.USER.DELETE ? (
                                                <IconButton
                                                    onClick={() =>
                                                        handleDialog(u?._id)
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
                                showFirstButton
                                showLastButton
                                defaultPage={1}
                                page={currentPage}
                                onChange={handlePageClick}
                            />
                        </Box>
                    </SimpleCard>

                    <Dialog
                        fullWidth={true}
                        maxWidth={'sm'}
                        open={open}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle>{edit ? 'Update' : 'New'}</DialogTitle>
                        <DialogContent>
                            <ValidatorForm
                                onSubmit={edit ? updateUser : HandleSubmit}
                                onError={() => null}
                            >
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
                                        <TextField
                                            label="Name"
                                            type="text"
                                            name="Name"
                                            value={user.username}
                                            onChange={handleName}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                        <TextField
                                            label="Email"
                                            type="email"
                                            name="Email"
                                            value={user.email}
                                            onChange={handleEmail}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                            autoComplete="off"
                                        />

                                        <TextField
                                            label="Mobile No."
                                            type="number"
                                            name="Mobile No"
                                            value={user.mobile}
                                            onChange={handleMobile}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />

                                        {!editId ? (
                                            <TextField
                                                label="Password"
                                                type="password"
                                                name="Password"
                                                value={user.password}
                                                onChange={handlePassword}
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                                autoComplete="off"
                                            />
                                        ) : null}
                                        <FormControl fullWidth>
                                            <InputLabel id="demo">
                                                Role
                                            </InputLabel>
                                            <Select
                                                labelId="demo"
                                                id="role"
                                                name="role"
                                                label="Role"
                                                value={user ? user.role : ''}
                                                onChange={handleRole}
                                                fullWidth
                                            >
                                                {roleList.map(
                                                    (value, index) => (
                                                        <MenuItem
                                                            value={value._id}
                                                            key={value._id}
                                                        >
                                                            {value.name}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </FormControl>

                                        {/* <Autocomplete
                                        disablePortal
                                        id="role"
                                        options={roleList}
                                        defaultValue={user.role ? user.role : null}
                                        getOptionLabel={(option) => option.name}
                                        onChange={handleRole}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Role"
                                                fullWidth
                                                value={user.role}
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        )}
                                    /> */}
                                    </Grid>
                                </Grid>

                                <DialogActions>
                                    <Button
                                        color="error"
                                        variant="contained"
                                        onClick={() => modelClose()}
                                        size="small"
                                        disabled={addLoader}
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
                                    {edit ? (
                                        <LoadingButton
                                            type="submit"
                                            color="primary"
                                            loading={addLoader}
                                            variant="contained"
                                            size="small"
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
                                    ) : (
                                        <LoadingButton
                                            type="submit"
                                            color="primary"
                                            loading={addLoader}
                                            variant="contained"
                                            size="small"
                                        >
                                            <Icon>send</Icon>
                                            <Span
                                                sx={{
                                                    pl: 1,
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                Save
                                            </Span>
                                        </LoadingButton>
                                    )}
                                </DialogActions>
                            </ValidatorForm>
                            {editId ? (
                                <>
                                    <Divider
                                        style={{
                                            marginTop: '3vh',
                                            marginBottom: '5vh',
                                        }}
                                    />
                                    <ValidatorForm
                                        onSubmit={resetPassword}
                                        onError={() => null}
                                    >
                                        <Grid container>
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextField
                                                    label="Password"
                                                    type="password"
                                                    name="Password"
                                                    value={user?.password}
                                                    onChange={handlePassword}
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                                style={{ textAlign: 'right' }}
                                            >
                                                <LoadingButton
                                                    type="submit"
                                                    color="primary"
                                                    loading={resetpassLoader}
                                                    variant="contained"
                                                    size="small"
                                                >
                                                    <Icon>send</Icon>
                                                    <Span
                                                        sx={{
                                                            pl: 1,
                                                            textTransform:
                                                                'capitalize',
                                                        }}
                                                    >
                                                        Reset Password
                                                    </Span>
                                                </LoadingButton>
                                            </Grid>
                                        </Grid>
                                    </ValidatorForm>
                                </>
                            ) : null}
                        </DialogContent>
                    </Dialog>

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
                message="It will be the permanent action and user will not be able to login."
                handleClose={(e) => handleDialog(e)}
            />
        </Fragment>
    )
}

export default ManageUser
