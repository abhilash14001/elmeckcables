import React, { Fragment, useEffect, useState } from 'react'
import { Breadcrumb, SimpleCard } from 'app/components'
import { styled, Box } from '@mui/system'
import { useParams } from 'react-router-dom'
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
import api from '../../../../api'
import { IMG_URL, PERMISSION } from 'app/constant'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Span } from 'app/components/Typography'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import '../custom-loader/loader.css'
import Loading from '../../../components/MatxLoading/MatxLoading'
import { LoadingButton } from '@mui/lab'
import CustomDialog from '../../../components/CustomDialog'

const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px',
}))

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

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
                paddingRight: 0,
            },
        },
    },
}))

function QrProduct(props) {
    const { id } = useParams()
    let limit = 10
    let offset = 0
    const [qrs, setQrs] = useState([])
    const [pageCount, setpageCount] = useState(0)
    const [form, setForm] = useState({
        desc: '',
        points: 0,
        count: 0,
    })
    const [alert, setAlert] = React.useState({
        type: 'success',
        message: '',
    })
    const [open, setOpen] = useState(false)
    const [snack, setSnack] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [loader, setLoader] = React.useState(true)
    const [addLoader, setAddLoader] = useState(false)

    const [deleteId, setDeleteId] = React.useState('')
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [totalRecords, setTotalRecords] = React.useState(false)

    useEffect(() => {
        qrList()
    }, [])

    const qrList = (data) => {
        setLoader(true)
        api.qr
            .qrList({
                p: {
                    product: 0,
                },
                q: {
                    product: id,
                },
                o: data || offset,
                l: limit,
            })
            .then((response) => {
                setQrs(response.data.data.records)
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
        api.qr
            .qrList({
                p: {
                    product: 0,
                },
                q: {
                    product: id,
                },
                o: skip,
                l: limit,
            })
            .then((response) => {
                setLoader(false)
                setQrs(response.data.data.records)
                setTotalRecords(response.data.data.totalRecords)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }
    const handleForm = (e) => {
        let name = e.target.name
        let value = e.target.value
        let newForm = { ...form }
        newForm[name] = value
        setForm(newForm)
    }

    const createQr = () => {
        var skip = 0
        if (currentPage) skip = Number(limit * (currentPage - 1))
        setAddLoader(true)
        api.qr
            .createQr({
                product: id,
                desc: form.desc,
                points: form.points,
                count: form.count,
            })
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                )
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${Date.now()}.txt`)
                document.body.appendChild(link)
                link.click()

                setOpen(false)
                setSnack(true)
                SuccessHandler('Created.')
                qrList(skip)
                setForm({
                    desc: '',
                    count: 0,
                    points: 0,
                })
                setAddLoader(false)
            })
            .catch((err) => {
                setAddLoader(false)
                ErrorHandler(err)
            })
    }

    const modalOpen = () => {
        setOpen(true)
    }

    const modelClose = () => {
        setOpen(false)
        setForm({
            desc: '',
            points: null,
            count: null,
        })
    }

    const snackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setSnack(false)
    }

    const downloadQr = () => {
        setLoader(true)
        api.qr
            .downloadQr(id)
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                )
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${Date.now()}.txt`)
                document.body.appendChild(link)
                link.click()
                setLoader(false)
            })
            .catch((err) => {
                setLoader(false)
                ErrorHandler(err)
            })
    }

    const deleteQr = () => {
        // if (currentPage) skip = Number(limit * (currentPage - 1))
        setLoader(true)
        api.qr
            .deleteQr(deleteId)
            .then((res) => {
                if (res.status === 200) {
                    qrList()
                    setSnack(true)
                    SuccessHandler('Deleted.')
                    setDialogOpen(false)
                }
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
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

    const SuccessHandler = (message) => {
        setSnack(true)
        setAlert({
            type: 'success',
            message: message,
        })
    }

    const handleDialog = async (event) => {
        if (event === 'agree') {
            deleteQr()
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
                        <Breadcrumb
                            routeSegments={[
                                { name: 'Product', path: '/createProduct' },
                                { name: 'Qr' },
                            ]}
                        />
                    </div>
                    <SimpleCard>
                        <Grid container mb={3}>
                            <Grid item lg={10} md={10}>
                                <h3>Total Records : {totalRecords}</h3>
                            </Grid>
                            <Grid item lg={2} md={2}>
                                <Box display="flex" justifyContent="end">
                                    {PERMISSION?.QR?.CREATE ? (
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="small"
                                            onClick={() => modalOpen()}
                                            sx={{ marginRight: '10px' }}
                                        >
                                            <Icon>add_circle</Icon>
                                        </Button>
                                    ) : null}

                                    {PERMISSION?.PRODUCT?.PRINT_QRCODE ? (
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="small"
                                            onClick={() => downloadQr()}
                                        >
                                            <Icon>file_download</Icon>
                                        </Button>
                                    ) : null}
                                </Box>
                            </Grid>
                        </Grid>

                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" width="15%">
                                        Index
                                    </TableCell>
                                    <TableCell align="center" width="15%">
                                        Code
                                    </TableCell>
                                    <TableCell align="center" width="20%">
                                        Redeem
                                    </TableCell>
                                    <TableCell align="center" width="10%">
                                        Points
                                    </TableCell>
                                    <TableCell align="left" width="30%">
                                        Desc
                                    </TableCell>
                                    <TableCell align="left" width="10%">
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {qrs.map((q, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            {index + 1}
                                        </TableCell>

                                        <TableCell align="center">
                                            {q?.id}
                                        </TableCell>

                                        <TableCell align="center">
                                            {q?.redeemed
                                                ? 'Applied'
                                                : 'Not Applied'}
                                        </TableCell>

                                        <TableCell align="center">
                                            {q?.points}
                                        </TableCell>
                                        <TableCell align="left">
                                            {q?.desc}
                                        </TableCell>

                                        <TableCell align="left">
                                            {PERMISSION?.QR?.DELETE ? (
                                                <IconButton
                                                    onClick={() =>
                                                        handleDialog(q._id)
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
                        <DialogTitle>New</DialogTitle>
                        <DialogContent>
                            <ValidatorForm
                                onSubmit={createQr}
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
                                            label="Description"
                                            type="text"
                                            name="desc"
                                            value={form.desc}
                                            onChange={handleForm}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />

                                        <TextField
                                            label="Points"
                                            type="number"
                                            name="points"
                                            InputProps={{
                                                inputProps: {
                                                    min: 0,
                                                },
                                            }}
                                            value={form.points}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                            onChange={handleForm}
                                        />

                                        <TextField
                                            label="Count"
                                            type="number"
                                            name="count"
                                            InputProps={{
                                                inputProps: {
                                                    min: 0,
                                                },
                                            }}
                                            value={form.count}
                                            onChange={handleForm}
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
                                        disabled={addLoader}
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
                message="It will be the permanent action."
                handleClose={(e) => handleDialog(e)}
            />
        </Fragment>
    )
}

export default QrProduct
