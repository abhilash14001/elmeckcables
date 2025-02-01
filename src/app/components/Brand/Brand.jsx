import React from 'react'
import { MatxLogo } from 'app/components'
import { styled, Box } from '@mui/system'

const BrandRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 18px 20px 29px',
}))

const Brand = ({ children }) => {
    return (
        <BrandRoot>
            <Box display="flex" alignItems="center">
                <MatxLogo />
                {/* <StyledSpan mode={mode} className="sidenavHoverShow">
                    Elmeck
                </StyledSpan> */}
            </Box>
            {/* <Box
                className="sidenavHoverShow"
                sx={{ display: mode === 'compact' ? 'none' : 'block' }}
            >
                {children || null}
            </Box> */}
        </BrandRoot>
    )
}

export default Brand
