import React, { useState, useEffect } from 'react'
import { Breadcrumb, SimpleCard } from 'app/components'
import { styled } from '@mui/system'
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TreeItem from '@mui/lab/TreeItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useParams } from 'react-router-dom'
import api from '../../../../api'
import { Button, Icon } from '@mui/material'
import { Span } from 'app/components/Typography'
import { PERMISSION } from 'app/constant'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

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

const AddRole = () => {
    const { id } = useParams()
    const [record, setRecord] = useState(null)
    const [alert, setAlert] = React.useState({
        snack: false,
        type: '',
        message: '',
    })
    useEffect(() => {
        getPermission()
    }, [])

    const getPermission = () => {
        api.role
            .getPermission(id)
            .then((response) => {
                setRecord(response.data.data.record)
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const handlePermissionRole = (event) => {
        let newRecord = { ...record }
        const obj = event.target.name.split('.')
        newRecord.permission[[obj[0]]][[obj[1]]] = event.target.checked
        setRecord(newRecord)
    }

    const snackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setAlert({
            snack: false,
            type: 'success',
            message: '',
        })
    }

    const updatePermission = () => {
        api.role
            .editRole(id, { permission: record?.permission })
            .then((response) => {
                if (response.status === 200) {
                    getPermission()
                    SuccessHandler('Updated.')
                }
            })
            .catch((err) => {
                ErrorHandler(err)
            })
    }

    const SuccessHandler = (message) => {
        setAlert({
            snack: true,
            type: 'success',
            message: message,
        })
    }

    const ErrorHandler = (err) => {
        setAlert({
            snack: true,
            type: 'error',
            message:
                err.response && err.response.data
                    ? err.response.data.message
                    : 'Error!',
        })
    }

    return (
        <Container>
            <div className="breadcrumb">
                <Breadcrumb
                    routeSegments={[
                        { name: 'Manage Role', path: '/managerole' },
                        { name: 'Permission' },
                    ]}
                />
            </div>
            <SimpleCard>
                <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                >
                    <TreeItem nodeId="1" label="Permission">
                        {record
                            ? Object.keys(record?.permission).map(
                                  (parentKey, parentIndex) => (
                                      <TreeItem
                                          nodeId={parentIndex + 2 + ''}
                                          label={parentKey}
                                          key={'Tree' + parentKey}
                                      >
                                          {Object.keys(
                                              record?.permission[[parentKey]]
                                          ).map((childKey, childIndex) => (
                                              <FormControlLabel
                                                  key={
                                                      'TreeItem' +
                                                      parentKey +
                                                      childKey
                                                  }
                                                  control={
                                                      <Checkbox
                                                          checked={
                                                              record.permission[
                                                                  [parentKey]
                                                              ][[childKey]]
                                                          }
                                                          onChange={
                                                              handlePermissionRole
                                                          }
                                                          name={`${parentKey}.${childKey}`}
                                                      />
                                                  }
                                                  label={childKey}
                                              />
                                          ))}
                                      </TreeItem>
                                  )
                              )
                            : ''}
                    </TreeItem>
                </TreeView>

                {PERMISSION.PERMISSION.EDIT ? (
                    <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        size="small"
                        style={{ float: 'right' }}
                        onClick={() => updatePermission()}
                    >
                        <Icon>send</Icon>
                        <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                            Update
                        </Span>
                    </Button>
                ) : null}
            </SimpleCard>

            <Snackbar
                open={alert.snack}
                autoHideDuration={6000}
                onClose={snackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
    )
}

export default AddRole
