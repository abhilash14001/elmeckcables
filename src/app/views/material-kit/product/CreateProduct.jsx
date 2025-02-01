import React, { useState, useEffect, Fragment } from 'react'
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
    Button,
    Grid,
    TextField,
} from '@mui/material'
import api from '../../../../api'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Span } from 'app/components/Typography'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import { PERMISSION } from 'app/constant'
import { Link } from 'react-router-dom'
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

const CustomTextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px',
}))

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function CreateProduct(props) {
    let q = {}
    const [productList, setProductList] = useState([])
    const [productNameList, setProductNameList] = useState([
        {
            id: 1,
            name: 'Anshul',
        },
    ])

    const [open, setOpen] = useState(false)
    let limit = 10
    let offset = 0
    const [pageCount, setpageCount] = useState(0)
    const [snack, setSnack] = React.useState(false)
    const [tags, setTags] = React.useState([])
    const [edit, setEdit] = useState(false)
    const [editId, setEditId] = useState('')
    const [product, setProduct] = useState({
        name: '',
        brand: [],
        sku_code: '',
        price: null,
    })
    const [errors, setErrors] = React.useState({})
    const [currentPage, setCurrentPage] = React.useState(1)
    const [addLoader, setAddLoader] = useState(false)
    const [loader, setLoader] = React.useState(true)
    const [alert, setAlert] = React.useState({
        type: '',
        message: '',
    })

    const [deleteId, setDeleteId] = React.useState('')
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [totalRecords, setTotalRecords] = React.useState(false)

    useEffect(() => {
        getProductList()
        getProductNameList()
    }, [])

    const getProductList = (data) => {
        setLoader(true)
        api.product
            .getProductList({
                q: q,
                o: data || offset,
                l: limit,
            })
            .then((response) => {
                setProductList(response.data.data.records)
                setpageCount(Math.ceil(response.data.data.totalRecords / limit))
                setTotalRecords(response.data.data.totalRecords)
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const getProductNameList = () => {
        setLoader(true)
        api.product
            .productNameList()
            .then((response) => {
                setProductNameList(response.data.data.records)
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
        api.product
            .getProductList({
                q: q,
                o: skip,
                l: limit,
            })
            .then((response) => {
                setLoader(false)
                setProductList(response.data.data.records)
                setTotalRecords(response.data.data.totalRecords)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const openModal = () => {
        setOpen(true)
    }

    const modelClose = () => {
        setOpen(false)
        setEdit(false)
        setProduct({
            name: '',
            brand: [],
            sku_code: '',
            price: null,
        })
    }

    const snackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setSnack(false)
    }

    const handleForm = (e) => {
        let name = e.target.name
        let value = e.target.value
        let newProduct = { ...product }
        newProduct[name] = value
        setProduct(newProduct)
    }

    const handleBrand = (event, values) => {
        const newProduct = { ...product }
        newProduct['brand'] = values
        setProduct(newProduct)

        if (values?.length) {
            const newErrors = { ...errors }
            newErrors.brand = ''
            setErrors(newErrors)
        } else {
            const newErrors = { ...errors }
            newErrors.brand = 'this field is required'
            setErrors(newErrors)
        }
    }

    const errValidation = () => {
        if (product.brand.length === 0) {
            const newErrors = { ...errors }
            newErrors.brand = 'this field is required'
            setErrors(newErrors)
        }
    }

    const createProduct = () => {
        if (product.brand.length === 0) {
            const newErrors = { ...errors }
            newErrors.brand = 'this field is required'
            setErrors(newErrors)
        } else {
            var skip = 0
            if (currentPage) skip = Number(limit * (currentPage - 1))
            setAddLoader(true)
            api.product
                .createProduct({
                    name: product.name,
                    brand: product.brand,
                    sku_code: product.sku_code,
                    price: product.price,
                })
                .then((response) => {
                    if (response.status === 201) {
                        getProductList(skip)
                        setOpen(false)
                        setSnack(true)
                        setAddLoader(false)
                        SuccessHandler('Created.')
                        setProduct({
                            name: '',
                            brand: [],
                            sku_code: '',
                            price: null,
                        })
                    }
                })
                .catch((err) => {
                    setAddLoader(false)
                    ErrorHandler(err)
                })
        }
    }

    const updateProduct = () => {
        var skip = 0
        if (currentPage) skip = Number(limit * (currentPage - 1))
        setAddLoader(true)
        api.product
            .editProduct(editId, {
                name: product.name,
                brand: product.brand,
                sku_code: product.sku_code,
                price: product.price,
            })
            .then((response) => {
                if (response.status === 200) {
                    setAddLoader(false)
                    setEdit(false)
                    setEditId('')
                    getProductList(skip)
                    setOpen(false)
                    SuccessHandler('Updated.')
                    setProduct({
                        name: '',
                        brand: [],
                        sku_code: '',
                        price: null,
                    })
                }
            })
            .catch((err) => {
                setAddLoader(false)
                ErrorHandler(err)
            })
    }

    const deleteProduct = (d) => {
        var skip = 0
        if (currentPage) skip = Number(limit * (currentPage - 1))
        setLoader(true)
        api.product
            .deleteProduct(deleteId)
            .then((response) => {
                if (response.status === 200) {
                    getProductList(skip)
                    getProductNameList()
                    setDialogOpen(false)
                    SuccessHandler('Deleted.')
                }
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const editProduct = (d) => {
        setEdit(true)
        setOpen(true)
        setProduct({
            name: d.name,
            brand: d.brand,
            sku_code: d.sku_code,
            price: d.price,
        })
        setEditId(d._id)
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

    const onTagsChange = (event, value) => {
        const id = value.map((p) => p._id)
        if (id.length) {
            q = { _id: value.map((p) => p._id) }
        } else {
            q = {}
        }
        setTags(value)
        handlePageClick(event, 1)
    }

    const handleDialog = async (event) => {
        if (event === 'agree') {
            deleteProduct()
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
                        <Breadcrumb routeSegments={[{ name: 'Product' }]} />
                    </div>

                    <SimpleCard>
                        <Grid container mb={3}>
                            <Grid item lg={7} md={6}>
                                <h3>Total Records : {totalRecords}</h3>
                            </Grid>
                            <Grid item lg={4} md={5}>
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={productNameList}
                                    getOptionLabel={(option) => option.name}
                                    filterSelectedOptions
                                    size="small"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            placeholder="Search Products"
                                            fullWidth
                                        />
                                    )}
                                    value={tags}
                                    onChange={onTagsChange}
                                />
                            </Grid>
                            <Grid item lg={1} md={1}>
                                {PERMISSION.PRODUCT.CREATE ? (
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
                                    <TableCell width="15%" align="center">
                                        Index
                                    </TableCell>
                                    <TableCell width="20%">Name</TableCell>
                                    <TableCell width="30%">Brand</TableCell>
                                    <TableCell width="10%" align="center">
                                        Sku
                                    </TableCell>
                                    <TableCell width="10%" align="center">
                                        Price
                                    </TableCell>
                                    <TableCell width="15%" align="center">
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productList.map((p, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            {index + 1}
                                        </TableCell>

                                        <TableCell>{p?.name}</TableCell>

                                        <TableCell align="left">
                                            {p?.brand.join(' , ')}
                                        </TableCell>

                                        <TableCell align="center">
                                            {p?.sku_code}
                                        </TableCell>
                                        <TableCell align="center">
                                            {new Intl.NumberFormat('en-IN', {
                                                style: 'currency',
                                                currency: 'INR',
                                            }).format(p?.price)}
                                        </TableCell>

                                        <TableCell align="center">
                                            {PERMISSION?.PRODUCT?.EDIT ? (
                                                <IconButton
                                                    onClick={() =>
                                                        editProduct(p)
                                                    }
                                                >
                                                    <Icon color="primary">
                                                        edit
                                                    </Icon>
                                                </IconButton>
                                            ) : null}
                                            {PERMISSION?.QR?.MANAGE ? (
                                                <Link
                                                    to={`/qrproduct/${p._id}`}
                                                >
                                                    <IconButton>
                                                        <Icon color="dark">
                                                            qr_code
                                                        </Icon>
                                                    </IconButton>
                                                </Link>
                                            ) : null}

                                            {PERMISSION?.PRODUCT?.DELETE ? (
                                                <IconButton
                                                    onClick={() =>
                                                        handleDialog(p._id)
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
                                onChange={handlePageClick}
                                page={currentPage}
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
                                onSubmit={edit ? updateProduct : createProduct}
                                onError={() => errValidation()}
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
                                        <CustomTextField
                                            label="Name"
                                            type="text"
                                            name="name"
                                            value={product.name}
                                            onChange={handleForm}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />

                                        <Autocomplete
                                            multiple
                                            id="brand"
                                            options={product.brand.map(
                                                (option) => option
                                            )}
                                            defaultValue={
                                                product.brand.length
                                                    ? product.brand
                                                    : []
                                            }
                                            freeSolo
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip
                                                        variant="outlined"
                                                        label={option}
                                                        {...getTagProps({
                                                            index,
                                                        })}
                                                    />
                                                ))
                                            }
                                            onChange={handleBrand}
                                            renderInput={(params) => (
                                                <CustomTextField
                                                    {...params}
                                                    label="Brand"
                                                    placeholder="Brand"
                                                    error={errors.brand}
                                                    helperText={errors.brand}
                                                />
                                            )}
                                        />

                                        <CustomTextField
                                            label="Sku No."
                                            type="text"
                                            name="sku_code"
                                            value={product.sku_code}
                                            onChange={handleForm}
                                            validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />

                                        <CustomTextField
                                            label="Price"
                                            type="number"
                                            name="price"
                                            value={product.price}
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
                                        PERMISSION.PRODUCT.EDIT ? (
                                            <LoadingButton
                                                color="primary"
                                                variant="contained"
                                                type="submit"
                                                loading={addLoader}
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
                                                    Update
                                                </Span>
                                            </LoadingButton>
                                        ) : null
                                    ) : PERMISSION.PRODUCT.CREATE ? (
                                        <LoadingButton
                                            color="primary"
                                            variant="contained"
                                            type="submit"
                                            loading={addLoader}
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
                                    ) : null}
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
                message="It will be the permanent action and qr codes will also be deleted."
                handleClose={(e) => handleDialog(e)}
            />
        </Fragment>
    )
}

export default CreateProduct
