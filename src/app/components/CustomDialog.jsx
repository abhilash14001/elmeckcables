import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material'

const CustomDialog = (props) => {
    const { open, handleClose, title, message } = props

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose('disagree')}>
                    Disagree
                </Button>
                <Button onClick={() => handleClose('agree')} autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CustomDialog
