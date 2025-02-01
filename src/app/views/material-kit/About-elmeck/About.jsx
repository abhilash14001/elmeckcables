import React, { useEffect, useState, Fragment } from 'react'
import { Breadcrumb, SimpleCard } from 'app/components'
import { styled } from '@mui/system'
import api from '../../../../api'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { Span } from 'app/components/Typography'
import JoditEditor from 'jodit-react'
import { Icon, Grid, InputLabel } from '@mui/material'
import { ValidatorForm } from 'react-material-ui-form-validator'
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

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function About(props) {
    const [about, setAbout] = useState({
        about: '',
        terms_condition: '',
        privacy_policy: '',
        contact_us: '',
    })
    const [edit, setEdit] = useState(false)
    const [message, setMessage] = useState('')
    const [snack, setSnack] = useState(false)
    const [addLoader, setAddLoader] = useState(false)
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        getAbout()
    }, [])

    const getAbout = () => {
        setLoader(true)
        api.about
            .list()
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data.data.records)
                    if (res?.data?.data?.records == null) {
                        setEdit(false)
                    } else {
                        let newAbout = {
                            _id: res.data.data.records._id,
                            about: res.data.data.records.about,
                            terms_condition:
                                res.data.data.records.terms_condition,
                            privacy_policy:
                                res.data.data.records?.privacy_policy,
                            contact_us: res.data.data.records?.contact_us,
                        }
                        setAbout(newAbout)
                        setEdit(true)
                    }
                }
                setLoader(false)
            })
            .catch((err) => ErrorHandler(err))
    }

    const updateSubmit = () => {
        setAddLoader(true)
        api.about
            .update(about._id, {
                about: about.about,
                terms_condition: about.terms_condition,
                privacy_policy: about.privacy_policy,
                contact_us: about.contact_us,
            })
            .then((res) => {
                if (res.status === 200) {
                    setSnack(true)
                    setMessage('Update Successfully')
                }
                setAddLoader(false)
            })
            .catch((err) => {
                setAddLoader(false)
                ErrorHandler(err)
            })
    }

    const handleSubmit = () => {
        api.about
            .add(about)
            .then((res) => {
                if (res.status === 201) {
                    setSnack(true)
                    setMessage('Save Successfully')
                }
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const handleAbout = (e) => {
        const newAbout = { ...about }
        newAbout.about = e
        setAbout(newAbout)
    }

    const snackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setSnack(false)
    }

    const termCondition = (e) => {
        const newAbout = { ...about }
        newAbout.terms_condition = e
        setAbout(newAbout)
    }

    const handlePrivacyPolicy = (e) => {
        const newAbout = { ...about }
        newAbout.privacy_policy = e
        setAbout(newAbout)
    }

    const contactUs = (e) => {
        const newAbout = { ...about }
        newAbout.contact_us = e
        setAbout(newAbout)
    }

    const ErrorHandler = (err) => {
        setSnack(true)
        setLoader(false)
    }

    return (
        <Fragment>
            {loader ? (
                <Loading />
            ) : (
                <Container>
                    <div className="breadcrumb">
                        <Breadcrumb routeSegments={[{ name: 'About Apps' }]} />
                    </div>

                    <SimpleCard>
                        <ValidatorForm
                            onSubmit={edit ? updateSubmit : handleSubmit}
                            onError={() => null}
                        >
                            <Grid
                                container
                                spacing={12}
                                style={{ paddingTop: '5vh' }}
                            >
                                <Grid
                                    item
                                    xs={3}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <InputLabel
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: '3vh',
                                            color: '#232a45',
                                        }}
                                    >
                                        About
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={8}>
                                    <JoditEditor
                                        value={about.about}
                                        tabIndex={1}
                                        config={{
                                            buttons: [
                                                'source',
                                                '|',
                                                'bold',
                                                'strikethrough',
                                                'underline',
                                                'italic',
                                                '|',
                                                'ul',
                                                'ol',
                                                '|',
                                                'outdent',
                                                'indent',
                                                '|',
                                                'font',
                                                'fontsize',
                                                'brush',
                                                'paragraph',
                                                '|',
                                                'image',
                                                'video',
                                                'table',
                                                'link',
                                                '|',
                                                'align',
                                                'undo',
                                                'redo',
                                                '|',
                                                'hr',
                                                'eraser',
                                                'copyformat',
                                                '|',
                                                'symbol',
                                            ],
                                            readonly: false,
                                            toolbarAdaptive: false,
                                            askBeforePasteFromWord: false,
                                            askBeforePasteHTML: false,
                                        }}
                                        onBlur={(newContent) =>
                                            handleAbout(newContent)
                                        }
                                        onChange={(newContent) => {}}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={3}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <InputLabel
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: '3vh',
                                            color: '#232a45',
                                        }}
                                    >
                                        Terms & Condition
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={8}>
                                    <JoditEditor
                                        value={about.terms_condition}
                                        tabIndex={1}
                                        config={{
                                            buttons: [
                                                'source',
                                                '|',
                                                'bold',
                                                'strikethrough',
                                                'underline',
                                                'italic',
                                                '|',
                                                'ul',
                                                'ol',
                                                '|',
                                                'outdent',
                                                'indent',
                                                '|',
                                                'font',
                                                'fontsize',
                                                'brush',
                                                'paragraph',
                                                '|',
                                                'image',
                                                'video',
                                                'table',
                                                'link',
                                                '|',
                                                'align',
                                                'undo',
                                                'redo',
                                                '|',
                                                'hr',
                                                'eraser',
                                                'copyformat',
                                                '|',
                                                'symbol',
                                            ],
                                            readonly: false,
                                            toolbarAdaptive: false,
                                            askBeforePasteFromWord: false,
                                            askBeforePasteHTML: false,
                                        }}
                                        onBlur={(value) => termCondition(value)}
                                        onChange={(value) => {}}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={3}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <InputLabel
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: '3vh',
                                            color: '#232a45',
                                        }}
                                    >
                                        Privacy Policy
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={8}>
                                    <JoditEditor
                                        value={about.privacy_policy}
                                        tabIndex={1}
                                        config={{
                                            buttons: [
                                                'source',
                                                '|',
                                                'bold',
                                                'strikethrough',
                                                'underline',
                                                'italic',
                                                '|',
                                                'ul',
                                                'ol',
                                                '|',
                                                'outdent',
                                                'indent',
                                                '|',
                                                'font',
                                                'fontsize',
                                                'brush',
                                                'paragraph',
                                                '|',
                                                'image',
                                                'video',
                                                'table',
                                                'link',
                                                '|',
                                                'align',
                                                'undo',
                                                'redo',
                                                '|',
                                                'hr',
                                                'eraser',
                                                'copyformat',
                                                '|',
                                                'symbol',
                                            ],
                                            readonly: false,
                                            toolbarAdaptive: false,
                                            askBeforePasteFromWord: false,
                                            askBeforePasteHTML: false,
                                        }}
                                        onBlur={(newContent) =>
                                            handlePrivacyPolicy(newContent)
                                        }
                                        onChange={(newContent) => {}}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={3}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <InputLabel
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: '3vh',
                                            color: '#232a45',
                                        }}
                                    >
                                        Contact Us
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={8}>
                                    <JoditEditor
                                        value={about.contact_us}
                                        tabIndex={1}
                                        config={{
                                            buttons: [
                                                'source',
                                                '|',
                                                'bold',
                                                'strikethrough',
                                                'underline',
                                                'italic',
                                                '|',
                                                'ul',
                                                'ol',
                                                '|',
                                                'outdent',
                                                'indent',
                                                '|',
                                                'font',
                                                'fontsize',
                                                'brush',
                                                'paragraph',
                                                '|',
                                                '|',
                                                'align',
                                                'undo',
                                                'redo',
                                                '|',
                                                'hr',
                                                'eraser',
                                                'copyformat',
                                                '|',
                                                'symbol',
                                            ],
                                            readonly: false,
                                            toolbarAdaptive: false,
                                            askBeforePasteFromWord: false,
                                            askBeforePasteHTML: false,
                                        }}
                                        onBlur={(newContent) =>
                                            contactUs(newContent)
                                        }
                                        onChange={(newContent) => {}}
                                    />
                                </Grid>
                            </Grid>

                            {edit ? (
                                about.about ? (
                                    PERMISSION?.ABOUT?.EDIT ? (
                                        <LoadingButton
                                            color="primary"
                                            variant="contained"
                                            type="submit"
                                            loading={addLoader}
                                            sx={{ marginTop: '3rem' }}
                                        >
                                            <Icon>update</Icon>
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
                                ) : (
                                    ''
                                )
                            ) : (
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
                            )}
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
                            severity="success"
                            sx={{ width: '100%' }}
                        >
                            {message}
                        </Alert>
                    </Snackbar>
                </Container>
            )}
        </Fragment>
    )
}

export default About
