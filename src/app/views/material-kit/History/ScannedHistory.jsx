import React, {useEffect, useState, Fragment, useRef} from 'react'
import { Breadcrumb, SimpleCard } from 'app/components'
import { styled, Box } from '@mui/system'
import {
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
    Grid, TextField, Autocomplete,
} from '@mui/material'
import api from '../../../../api'
import Pagination from '@mui/material/Pagination'
import '../custom-loader/loader.css'
import { useParams } from 'react-router-dom'
import Loading from '../../../components/MatxLoading/MatxLoading'

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

const ScannedHistory = () => {
    const [offset, setOffSet] = useState(0)
    let limit = 10
    const [pageCount, setpageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [scannedList, setScannedList] = useState([])
    const [loader, setLoader] = React.useState(true)
    const [totalRecords, setTotalRecords] = useState(0)

    const [mobileNumber, setMobileNumber] = useState(null) // Use state instead of useRef

    const mobileNumberRef = useRef(null);
    let { id, userId } = useParams()

    useEffect(() => {
        setCurrentPage(1)
        setScannedList([])
        setOffSet(0)
        setpageCount(0)
        setCurrentPage(1)
        getScannedList()
    }, [id])

    const getScannedList = (data, loader = true) => {
        if(!loader){
         setLoader(true)
        }
        var query = { role: id }

        if (userId) {
            query['user'] = userId
        }



        api.Scanned.listScanned({
            q: query,
            o: data || offset,
            l: limit,
            m: mobileNumberRef?.current ?? null

        })
            .then((response) => {
                setScannedList(response.data.data.records)
                setpageCount(Math.ceil(response.data.data.totalRecords / limit))
                setTotalRecords(response.data.data.totalRecords)
                setLoader(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handlePageClick = (event, value) => {
        let currentPage = value
        setCurrentPage(value)
        var skip = Number(limit * (currentPage - 1))

        setCurrentPage(currentPage)
        api.Scanned.listScanned({
            q: { role: id },
            o: skip,
            l: limit,
            m: mobileNumberRef?.current ?? null
        })
            .then((response) => {
                setScannedList(response.data.data.records)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const handleSearchChange = (event) => {
        setMobileNumber(event.target.value) // Update state on input change
        mobileNumberRef.current = event.target.value
        getScannedList(false)

    };
    return (
        <Fragment>
            {loader ? (
                <Loading />
            ) : (
                <Container>
                    <div className="breadcrumb">
                        <Breadcrumb routeSegments={[{ name: `${id}` }]} />
                    </div>
                    <SimpleCard>
                        <Grid container mb={3}>

                            <Grid item lg={9} md={9}>
                                <h3>Total Records : {totalRecords}</h3>
                            </Grid>
                            <Grid item lg={3} md={4} px={3}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Search User"
                                    fullWidth
                                    value={mobileNumber ?? ''}
                                    onChange={handleSearchChange} // Capture input changes

                                />

                            </Grid>

                        </Grid>
                        <StyledTable>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="30%" align="left">
                                        Name
                                    </TableCell>
                                    <TableCell width="20%" align="left">
                                        Product
                                    </TableCell>
                                    <TableCell width="20%" align="center">
                                        Qr Code
                                    </TableCell>
                                    <TableCell width="10%" align="center">
                                        Points
                                    </TableCell>
                                    <TableCell width="20%" align="center">
                                        Date
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {scannedList.map((scan, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="left">
                                            <strong>Name : </strong>
                                            {scan?.user_info?.name}
                                            <br />
                                            {/* <strong>Email : </strong>
                                            {scan?.user_info?.email}
                                            <br /> */}
                                            <strong>Mobile : </strong>
                                            {scan?.user_info?.mobile}
                                        </TableCell>

                                        <TableCell align="left">
                                            <strong>Name : </strong>
                                            {scan?.product_info?.name}
                                            <br />
                                            <strong>Price : </strong>
                                            {new Intl.NumberFormat('en-IN', {
                                                style: 'currency',
                                                currency: 'INR',
                                            }).format(
                                                scan?.product_info?.price
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {scan?.qr_code}
                                        </TableCell>

                                        <TableCell align="center">
                                            {scan?.points}
                                        </TableCell>
                                        <TableCell align="center">
                                            {new Date(
                                                scan?.created_at
                                            ).toLocaleString()}
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
                                page={currentPage}
                                showFirstButton
                                showLastButton
                                defaultPage={1}
                                onChange={handlePageClick}
                            />
                        </Box>
                    </SimpleCard>
                </Container>
            )}
        </Fragment>
    )
}

export default ScannedHistory
