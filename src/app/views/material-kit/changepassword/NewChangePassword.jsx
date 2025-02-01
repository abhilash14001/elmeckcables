import React, { Component } from 'react';
import { styled } from '@mui/system';
import { SimpleCard, Breadcrumb } from 'app/components';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { Span } from 'app/components/Typography'
import {
    Button,
    Icon,
    Grid,
} from '@mui/material'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import api from '../../../../api'

const TextField = styled(TextValidator)(() => ({
    width: '100%',
    marginBottom: '16px',
}))

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


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
class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            email: '',
            open: false,
            message: ''
        }
    }

    handleEmail = (e) => {
        this.setState({ email: e.target.value })
    }

    handleOldPassword = (e) => {
        this.setState({ oldPassword: e.target.value })
    }

    handleNewPassword = (e) => {
        this.setState({ newPassword: e.target.value })
    }

    submitForm = async () => {

        api.user.changePassword({
            email: this.state.email,
            oldpassword: this.state.oldPassword,
            newpassword: this.state.newPassword
        }).then((res) => {
            if (res?.status === 200) {
                this.setState({
                    open: true,
                    message: 'Password Change Successfully',
                    email: '',
                    oldPassword: '',
                    newPassword: ''
                })
            }
        }).catch((err) => {
            if (err.response) {
                this.setState({
                    open: true,
                    message: err.response.data.message[0],
                })
            }
        });




    }

    snackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false })

    };

    render() {
        return (
            <Container>
                <div className="breadcrumb">
                    <Breadcrumb
                        routeSegments={[
                            { name: 'Change Password' },
                        ]}
                    />
                </div>


                <Snackbar open={this.state.open} autoHideDuration={6000} onClose={() => this.snackbarClose()} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <Alert onClose={() => this.snackbarClose()} severity="success" sx={{ width: '100%' }}>
                        {this.state.message}
                    </Alert>
                </Snackbar>

                <SimpleCard>

                    <ValidatorForm
                        onSubmit={this.submitForm}
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
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={this.state.email || ''}
                                    onChange={(e) => this.handleEmail(e)}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                                <TextField
                                    label="Old Password"
                                    type="password"
                                    name="Old Password"
                                    value={this.state.oldPassword || ''}
                                    onChange={(e) => this.handleOldPassword(e)}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                                <TextField
                                    label="New Password"
                                    type="password"
                                    name="New Password"
                                    value={this.state.newPassword || ''}
                                    onChange={(e) => this.handleNewPassword(e)}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
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
                        </Button>

                    </ValidatorForm>

                </SimpleCard>


            </Container >
        );
    }
}


export default ChangePassword;