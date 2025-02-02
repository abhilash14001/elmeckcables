import {SimpleCard} from "../../components";
import {
    Alert,
    Grid,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {Box, styled} from "@mui/system";
import Pagination from "@mui/material/Pagination";
import React, {useEffect, useRef, useState} from "react";
import api from "../../../api";
import {Link} from "react-router-dom";
import {Span} from "../../components/Typography";

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

    const typeSelect = useRef('DEALER')

    const [snack, setSnack] = useState(false)
    const [alert, setAlert] = React.useState({
        type: 'success',
        message: '',
    })

    let q;
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
    let offset = useRef(0)
    let limit = 10
    const [pageCount, setpageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [redeemList, setRedeemList] = useState([])
    const [loader, setLoader] = React.useState(true)
    const stateSelect = useRef(null)
    const citySelect = useRef(null)
    const [totalRecords, setTotalRecords] = useState(0)

    const [patch, setPatch] = useState({
        _id: '',
        status: -1,
        trans_msg: '',
    })
    useEffect(() => {
        offset.current = 0


        setCurrentPage(1)
        getRedeemList();
    }, [])

    const [open, setOpen] = useState(false)

    const getRedeemList = () => {
        listRedeem(-1)
    }
    const listRedeem = (newS) => {
       api.Redeem.listRedeem({
            q: { role : typeSelect.current, status : 0, type : "QR" },
            o: offset.current,
            l: limit,
            st: stateSelect.current,
            c : citySelect.current
        })
            .then((response) => {
                setRedeemList(response.data.data.records)
                setpageCount(Math.ceil(response.data.data.totalRecords / limit))
                setTotalRecords(response.data.data.totalRecords)

                setLoader(false)


            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    // const { palette } = useTheme()
    const handlePageClick = (event, value) => {
        let currentPage = value
        setCurrentPage(value)
        var skip = Number(limit * (currentPage - 1))

        setCurrentPage(currentPage)
        api.Redeem.listRedeem({
            q: { role : typeSelect.current, status : 0, type : "QR" },
            o: skip,
            l: limit,

            st: stateSelect.current,
            c : citySelect.current
        })
            .then((response) => {
                setRedeemList(response.data.data.records)
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


        console.log('redeem')
        getRedeemList()

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
                                <TableCell width="20%" align="left">
                                    User
                                </TableCell>
                                <TableCell width="10%" align="left">
                                    Points
                                </TableCell>
                                <TableCell width="20%" align="left">
                                    Bank Info
                                </TableCell>
                                <TableCell width="20%" align="left">
                                    Upi
                                </TableCell>

                                <TableCell width="15%" align="center">
                                    Status
                                </TableCell>
                                <TableCell width="15%" align="center">
                                    Date
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {redeemList.map((r, index) => (
                                <TableRow key={index}>
                                    <TableCell align="left">
                                        <strong>Name :</strong>
                                        <Link
                                            to={`/scan/${typeSelect.current}/${r?.user?._id}`}
                                            style={{
                                                color: '#0000FF99',
                                                cursor: 'pointer',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {r?.user_info?.name}
                                        </Link>
                                        <br/>
                                        <strong>State :</strong>
                                        {r?.user_info?.address?.state}
                                        <br/>
                                        <strong>City :</strong>
                                        {r?.user_info?.address?.city}
                                        <br/>
                                        <strong>Mobile :</strong>
                                        {r?.user_info?.mobile}
                                        {/* <br />
                                            <strong>Email :</strong>
                                            {r?.user_info?.email} */}
                                    </TableCell>

                                    <TableCell align="left">
                                    <strong>Req : </strong>
                                        {r?.points}
                                        <br />
                                        <strong>Total : </strong>
                                        {r?.user_info?.points}
                                    </TableCell>

                                    <TableCell>
                                        <strong>Name : </strong>
                                        {r?.user_info?.bank_details?.name}
                                        <br />
                                        <strong>Beneficiary name : </strong>
                                        {
                                            r?.user_info?.bank_details
                                                ?.beneficiary_name
                                        }
                                        <br />
                                        <strong>Account No. : </strong>
                                        {
                                            r?.user_info?.bank_details
                                                ?.account_no
                                        }
                                        <br />
                                        <strong>IFSC : </strong>
                                        {r?.user_info?.bank_details?.ifsc}
                                    </TableCell>

                                    <TableCell>
                                        <strong>Holder : </strong>
                                        {r?.user_info?.upi?.holder}
                                        <br />
                                        <strong>Id : </strong>
                                        {r?.user_info?.upi?.id}
                                    </TableCell>

                                    <TableCell align="center">
                                        {(
                                            <Span
                                                style={{
                                                    color: 'green',
                                                    cursor: 'pointer',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {' '}
                                                {'Pending'}{' '}
                                            </Span>
                                        ) }
                                    </TableCell>

                                    <TableCell align="center">
                                        <strong>Req On : </strong>
                                        {new Date(
                                            r?.created_at
                                        ).toLocaleString('en-US', {
                                            day: 'numeric',
                                            year: 'numeric',
                                            month: 'short',
                                        })}
                                        <br />
                                        {r?.redeem_date ? (
                                            <strong>Completed On : </strong>
                                        ) : (
                                            ''
                                        )}

                                        {r?.redeem_date
                                            ? new Date(
                                                r?.redeem_date
                                            ).toLocaleString('en-US', {
                                                day: 'numeric',
                                                year: 'numeric',
                                                month: 'short',
                                            })
                                            : ''}
                                        <br />
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
