import { Card, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useState } from 'react'
import useAuth from 'app/hooks/useAuth'
import { Box, styled, useTheme } from '@mui/system'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { Paragraph } from 'app/components/Typography'

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: 'center',
}))

const ContentBox = styled(Box)(() => ({
    height: '100%',
    padding: '32px',
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.01)',
}))

const IMG = styled('img')(() => ({
    maxWidth: '100%',
}))

const JWTRoot = styled(JustifyBox)(() => ({
    background: '#1A2038',
    minHeight: '100% !important',
    '& .card': {
        maxWidth: 800,
        borderRadius: 12,
        margin: '1rem',
    },
}))

const JwtLogin = () => {
    // const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
    })
    const [message, setMessage] = useState('')
    const { login } = useAuth()

    const handleChange = ({ target: { name, value } }) => {
        let temp = { ...userInfo }
        temp[name] = value
        setUserInfo(temp)
    }

    const { palette } = useTheme()
    const textError = palette.error.main

    const handleFormSubmit = async (event) => {
        setLoading(true)
        try {
            await login(userInfo.email, userInfo.password)
            window.location.href = '/'
            // navigate('/')
        } catch (e) {
            console.log(e.response)
            setMessage(
                e.response && e.response.data
                    ? e.response.data.message
                    : 'Something went wrong!'
            )
            setLoading(false)
        }
    }

    return (
        <JWTRoot>
            <Card className="card">
                <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12} mt={5}>
                        <JustifyBox height="100%">
                            <IMG src="/logo.png" alt="" />
                        </JustifyBox>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <ContentBox>
                            <ValidatorForm onSubmit={handleFormSubmit}>
                                <TextValidator
                                    sx={{ mb: 3, width: '100%' }}
                                    variant="outlined"
                                    size="small"
                                    label="Email"
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    validators={['required', 'isEmail']}
                                    errorMessages={[
                                        'this field is required',
                                        'email is not valid',
                                    ]}
                                />
                                <TextValidator
                                    sx={{ mb: '12px', width: '100%' }}
                                    label="Password"
                                    variant="outlined"
                                    size="small"
                                    onChange={handleChange}
                                    name="password"
                                    type="password"
                                    value={userInfo.password}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                                {/* <FormControlLabel
                                    sx={{ mb: '12px', maxWidth: 288 }}
                                    name="agreement"
                                    onChange={handleChange}
                                    control={
                                        <Checkbox
                                            size="small"
                                            onChange={({
                                                target: { checked },
                                            }) =>
                                                handleChange({
                                                    target: {
                                                        name: 'agreement',
                                                        value: checked,
                                                    },
                                                })
                                            }
                                            checked={userInfo.agreement || true}
                                        />
                                    }
                                    label="Remeber me"
                                /> */}

                                {message && (
                                    <Paragraph sx={{ color: textError }}>
                                        {message}
                                    </Paragraph>
                                )}

                                <FlexBox
                                    mb={2}
                                    flexWrap="wrap"
                                    justifyContent="end"
                                >
                                    <LoadingButton
                                        type="submit"
                                        color="primary"
                                        loading={loading}
                                        variant="contained"
                                        sx={{ my: 2 }}
                                    >
                                        Login
                                    </LoadingButton>

                                    {/* <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                        type="submit"
                                    >
                                        Login
                                    </Button>
                                    {loading && (
                                        <StyledProgress
                                            size={24}
                                            className="buttonProgress"
                                        />
                                    )} */}

                                    {/* <Span sx={{ mr: 1, ml: '20px' }}>or</Span>
                                    <Button
                                        sx={{ textTransform: 'capitalize' }}
                                        onClick={() =>
                                            navigate('/session/signup')
                                        }
                                    >
                                        Sign up
                                    </Button> */}
                                </FlexBox>
                                {/* <Button
                                    sx={{ color: textPrimary }}
                                    onClick={() =>
                                        navigate('/session/forgot-password')
                                    }
                                >
                                    Forgot password?
                                </Button> */}
                            </ValidatorForm>
                        </ContentBox>
                    </Grid>
                </Grid>
            </Card>
        </JWTRoot>
    )
}

export default JwtLogin
