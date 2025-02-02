import {SimpleCard} from "../../components";
import {Grid, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@mui/material";
import {Box, styled} from "@mui/system";
import Pagination from "@mui/material/Pagination";
import React, {useEffect, useRef, useState} from "react";
import api from "../../../api";

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

const DashboardTableScannedHistory = () => {
    const [offset, setOffSet] = useState(0)
    let limit = 10
    const [pageCount, setpageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [scannedList, setScannedList] = useState([])
    const [loader, setLoader] = React.useState(true)
    const typeSelect = useRef('DEALER')
    const stateSelect = useRef(null)
    const citySelect = useRef(null)
    const [totalRecords, setTotalRecords] = useState(0)


    useEffect(() => {
        setCurrentPage(1)
        setScannedList([])
        setOffSet(0)
        setpageCount(0)
        setCurrentPage(1)
        getScannedList()
    }, [])

    const getScannedList = (data, loader = true) => {
        if(!loader){
            setLoader(true)
        }
        var query = { role : typeSelect.current }


        api.Scanned.listScanned({
            q: query,
            o: data || offset,
            l: limit,
            m:  null,
            s: stateSelect.current,
            c : citySelect.current

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
    // const { palette } = useTheme()
    const handlePageClick = (event, value) => {
        let currentPage = value
        setCurrentPage(value)
        var skip = Number(limit * (currentPage - 1))

        setCurrentPage(currentPage)
        api.Scanned.listScanned({
            q: { role : typeSelect.current },
            o: skip,
            l: limit,
            m: null,
            s: stateSelect.current,
            c : citySelect.current
        })
            .then((response) => {
                setScannedList(response.data.data.records)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const HandleFilter = (event) => {
        switch(event.target.name) {
            case "select_type" :
                typeSelect.current = event.target.value
                break;
            case "state" :
                stateSelect.current =  event.target.value
                break;

            case "city" :
                citySelect.current =  event.target.value
                break;
        }


        getScannedList()

    }

    return (
        <Container container mb={3}>

            <SimpleCard>
                <Grid container mb={3}>
                    <Grid item lg={8} md={9}>
                        <h3>Total Records : {totalRecords}</h3>
                    </Grid>

                    <Grid item lg={4} md={4} px={3} sx={{display: 'flex', gap: 2, height: "37px"}}>

                        <Select
                            labelId="type"
                            label="Type"
                            name="select_type"
                            value={typeSelect.current}
                            onChange={HandleFilter}>
                            {['DEALER', 'ELECTRICIAN'].map((v, i) => (
                                <MenuItem value={v} key={v + i}>
                                    {v}
                                </MenuItem>
                            ))}
                        </Select>

                        <TextField
                            variant="outlined"
                            placeholder="State"
                            fullWidth
                            value={stateSelect.current}
                            name="state"
                            size="small"
                            onChange={HandleFilter}
                        />
                        <TextField
                            variant="outlined"
                            placeholder="City"
                            fullWidth
                            value={citySelect.current}
                            name="city"
                            size="small"
                            onChange={HandleFilter}
                        />
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
                                        <br/>
                                        <strong>State : </strong>
                                        {scan?.user_info?.address?.state}
                                        <br/>
                                        <strong>City : </strong>
                                        {scan?.user_info?.address?.city}
                                        <br/>
                                        {/* <strong>Email : </strong>
                                            {scan?.user_info?.email}
                                            <br /> */}
                                        <strong>Mobile : </strong>
                                        {scan?.user_info?.mobile}
                                    </TableCell>

                                    <TableCell align="left">
                                        <strong>Name : </strong>
                                        {scan?.product_info?.name}
                                        <br/>
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
                </Grid>
            </SimpleCard>
        </Container>
    )

}
export default DashboardTableScannedHistory
