import React, { Fragment, useEffect } from 'react'
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
    Button,
    Grid,
    IconButton,
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
import { Link } from 'react-router-dom'
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

const ManageRole = () => {
    const [open, setOpen] = React.useState(false)
    const [username, setUserName] = React.useState('')
    const [snack, setSnack] = React.useState(false)
    const [alert, setAlert] = React.useState({
        type: '',
        message: '',
    })
    const [pageCount, setpageCount] = React.useState(0)
    let limit = 10
    let offset = 0
    const [roleList, setRoleList] = React.useState([])
    const [edit, setEdit] = React.useState(false)
    const [editId, setEditId] = React.useState('')
    const [currentPage, setCurrentPage] = React.useState(1)
    const [loader, setLoader] = React.useState(true)
    const [addLoader, setAddLoader] = React.useState(false)
    const [totalRecords, setTotalRecords] = React.useState(0)

    const [deleteId, setDeleteId] = React.useState('')
    const [dialogOpen, setDialogOpen] = React.useState(false)
    useEffect(() => {
        listRole()
    }, [])

    const listRole = () => {
        api.role
            .listRole({
                p: {
                    _id: 1,
                    permission: 0,
                },
                o: offset,
                l: limit,
            })
            .then((response) => {
                setRoleList(response.data.data.records)
                setpageCount(Math.ceil(response.data.data.totalRecords / limit))
                setTotalRecords(response.data.data.totalRecords)
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const createUser = async () => {
        var skip = 0
        if (currentPage) skip = Number(limit * (currentPage - 1))
        setAddLoader(true)
        api.role
            .createRole({ name: username })
            .then((response) => {
                if (response.status === 201) {
                    listRole(skip)
                    setOpen(false)
                    SuccessHandler('Created.')
                    setUserName('')
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

    const SuccessHandler = (message) => {
        setSnack(true)
        setAlert({
            type: 'success',
            message: message,
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

    const deleteRole = () => {
        var skip = 0
        if (currentPage) skip = Number(limit * (currentPage - 1))
        setLoader(true)
        api.role
            .deleteRole(deleteId)
            .then((response) => {
                if (response.status === 200) {
                    listRole(skip)
                    SuccessHandler('Deleted.')
                }
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const editRole = (r) => {
        setEdit(true)
        setOpen(true)
        setUserName(r.name)
        setEditId(r._id)
    }

    const editUser = async () => {
        var skip = 0
        if (currentPage) skip = Number(limit * (currentPage - 1))
        setAddLoader(true)
        api.role
            .editRole(editId, { name: username })
            .then((response) => {
                if (response.status === 200) {
                    setEdit(false)
                    setEditId('')
                    listRole(skip)
                    setOpen(false)
                    SuccessHandler('Updated.')
                    setEdit(false)
                }
                setAddLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const modelOpen = async () => {
        setOpen(true)
        setUserName('')
    }

    const modelClose = async () => {
        setOpen(false)
        setEdit(false)
        setUserName('')
    }

    const handlePageClick = async (event, value) => {
        let currentPage = value
        var skip = Number(limit * (currentPage - 1))
        setCurrentPage(currentPage)

        api.role
            .listRole({
                p: {
                    _id: 1,
                    permission: 0,
                },
                o: skip,
                l: limit,
            })
            .then((response) => {
                setRoleList(response.data.data.records)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const handleDialog = async (event) => {
        if (event === 'agree') {
            deleteRole()
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
                        <Breadcrumb routeSegments={[{ name: 'User list' }]} />
                    </div>
                    <SimpleCard>
                        <Grid container mb={3}>
                            <Grid item lg={11} md={9}>
                                <h3>Total Records : {totalRecords}</h3>
                            </Grid>
                            <Grid item lg={1} md={3}>
                                {PERMISSION.ROLE.CREATE ? (
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        style={{ float: 'right' }}
                                        size="small"
                                        onClick={() => modelOpen()}
                                    >
                                        <Icon>add_circle</Icon>
                                    </Button>
                                ) : null}
                            </Grid>
                        </Grid>

                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" width="20%">
                                        Index
                                    </TableCell>
                                    <TableCell width="30%" align="center">
                                        Role
                                    </TableCell>
                                    <TableCell width="20%" align="center">
                                        Permission
                                    </TableCell>
                                    <TableCell width="30%" align="center">
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roleList.map((r, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            {index + 1 + offset * limit}
                                        </TableCell>
                                        <TableCell align="center">
                                            {r?.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {PERMISSION.PERMISSION.MANAGE ? (
                                                <Link
                                                    to={`/addrole/${r._id}`}
                                                    style={{
                                                        color: '#0000FF99',
                                                        cursor: 'pointer',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {'Permission'}
                                                </Link>
                                            ) : null}
                                        </TableCell>
                                        <TableCell align="center">
                                            {PERMISSION.ROLE.EDIT ? (
                                                <IconButton
                                                    onClick={() => editRole(r)}
                                                >
                                                    <Icon color="primary">
                                                        edit
                                                    </Icon>
                                                </IconButton>
                                            ) : null}
                                            {PERMISSION.ROLE.DELETE ? (
                                                <IconButton
                                                    onClick={() =>
                                                        handleDialog(r._id)
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
                        <DialogTitle>
                            {edit ? 'Update' : 'New'} Role
                        </DialogTitle>
                        <DialogContent>
                            <ValidatorForm
                                onSubmit={edit ? editUser : createUser}
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
                                            onChange={(e) =>
                                                setUserName(e.target.value)
                                            }
                                            value={username}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
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
                message="It will be the permanent action and user associated with
                this role will be affected."
                handleClose={(e) => handleDialog(e)}
            />
        </Fragment>
    )
}

export default ManageRole
