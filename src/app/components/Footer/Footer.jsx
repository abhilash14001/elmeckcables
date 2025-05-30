import React from 'react'
import { Span, Paragraph } from '../Typography'
import useSettings from 'app/hooks/useSettings'
import { Toolbar, AppBar, ThemeProvider } from '@mui/material'
import { styled, useTheme } from '@mui/system'
import { topBarHeight } from 'app/utils/constant'

const AppFooter = styled(Toolbar)(() => ({
    display: 'flex',
    alignItems: 'center',
    minHeight: topBarHeight,
    '@media (max-width: 499px)': {
        display: 'table',
        width: '100%',
        minHeight: 'auto',
        padding: '1rem 0',
        '& .container': {
            flexDirection: 'column !important',
            '& a': {
                margin: '0 0 16px !important',
            },
        },
    },
}))

const FooterContent = styled('div')(() => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0px 1rem',
    maxWidth: '1170px',
    margin: '0 auto',
}))

const Footer = () => {
    const theme = useTheme()
    const { settings } = useSettings()

    const footerTheme = settings.themes[settings.footer.theme] || theme

    return (
        <ThemeProvider theme={footerTheme}>
            <AppBar color="primary" position="static" sx={{ zIndex: 96 }}>
                <AppFooter>
                    <FooterContent>
                        {/* <a href="https://ui-lib.com/downloads/matx-pro-react-admin/">
                            <Button variant="contained" color="secondary">
                                Get MatX Pro
                            </Button>
                        </a> */}
                        <Span sx={{ m: 'auto' }}></Span>
                        <Paragraph sx={{ m: 0 }}>
                            {/* Design and Developed by <a href="http://dtechex.com">Dtechex</a> */}
                            <b>Design and Developed by</b>{' '}
                            <a href="https://dtechex.com/">
                                {' '}
                                <img
                                    src="/assets/images/dtechex_logo.png"
                                    alt="dtechex_logo"
                                    width="100px"
                                    height="40px"
                                    style={{ verticalAlign: 'middle' }}
                                />
                            </a>
                        </Paragraph>
                    </FooterContent>
                </AppFooter>
            </AppBar>
        </ThemeProvider>
    )
}

export default Footer
