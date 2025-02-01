import React, { Fragment, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import { Icon, Grid, Divider } from '@mui/material'
import api from '../../../../api'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { Span } from 'app/components/Typography'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
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

function Config(props) {
    const [roleList, setRoleList] = useState([])
    const [snack, setSnack] = useState(false)
    const [alert, setAlert] = React.useState({
        type: 'success',
        message: '',
    })
    const [addLoader, setAddLoader] = useState(false)
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        getConfig()
    }, [])

    const getConfig = () => {
        setLoader(true)
        api.config
            .get('setting')
            .then((response) => {
                if (response.status === 200) {
                    setRoleList(response?.data?.data?.record?.roles)
                }
                setLoader(false)
            })
            .catch((err) => {
                ErrorHandler(err)
                setLoader(false)
            })
    }

    const handleForm = (e, d) => {
        const name = parseInt(e.target.name)
        const value = e.target.value
        const newRoleList = roleList
        newRoleList[name][d] = parseInt(value)
        setRoleList([...newRoleList])
    }

    const update = () => {
        setAddLoader(true)
        api.config
            .update('setting', { roles: roleList })
            .then((response) => {
                if (response.status === 200) {
                    setSnack(true)
                    SuccessHandler('Updated.')
                    getConfig()
                }
                setAddLoader(false)
            })
            .catch((err) => {
                setAddLoader(false)
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
                    <div className="breadcrumb">
                        <Breadcrumb routeSegments={[{ name: 'Config' }]} />
                    </div>

                    <SimpleCard title="Application Settings">
                        <Divider />
                        <ValidatorForm onSubmit={update} onError={() => null}>
                            <Grid
                                container
                                spacing={2}
                                sx={{ mt: 3, alignItems: 'center' }}
                            >
                                {roleList.map((role, index) => (
                                    <Fragment key={index}>
                                        <Grid
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                            key={'name' + index}
                                        >
                                            <Span>
                                                {role.name} Redeem Point Limit :
                                            </Span>
                                        </Grid>

                                        <Grid
                                            item
                                            lg={8}
                                            md={8}
                                            sm={12}
                                            xs={12}
                                            key={'value' + index}
                                        >
                                            <Grid
                                                container
                                                spacing={2}
                                                sx={{
                                                    mt: 3,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Grid
                                                    item
                                                    lg={3}
                                                    md={3}
                                                    sm={6}
                                                    xs={6}
                                                    key={'value' + index}
                                                >
                                                    <TextField
                                                        label="Min"
                                                        type="number"
                                                        name={index + ''}
                                                        size="small"
                                                        value={
                                                            role.min_redeem_l
                                                        }
                                                        onChange={(e) =>
                                                            handleForm(
                                                                e,
                                                                'min_redeem_l'
                                                            )
                                                        }
                                                    />
                                                </Grid>

                                                <Grid
                                                    item
                                                    lg={3}
                                                    md={3}
                                                    sm={6}
                                                    xs={6}
                                                >
                                                    <TextField
                                                        label="Max"
                                                        type="number"
                                                        name={index + ''}
                                                        size="small"
                                                        value={
                                                            role.max_redeem_l
                                                        }
                                                        onChange={(e) =>
                                                            handleForm(
                                                                e,
                                                                'max_redeem_l'
                                                            )
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Fragment>
                                ))}
                            </Grid>
                            {PERMISSION?.CONFIG.EDIT ? (
                                <LoadingButton
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    loading={addLoader}
                                    sx={{ marginTop: '3rem' }}
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
                            severity={alert.success}
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

export default Config
