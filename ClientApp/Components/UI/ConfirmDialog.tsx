import * as React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";

interface Props extends Omit<DialogProps, "onClose"> {
    onClose: () => void;
    onCancel: () => void;
    onConfirm: () => void;
    simple?: boolean;
    title?: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDialog: React.FunctionComponent<Props> = (props) => {
    const { onConfirm, onCancel, title, confirmText, cancelText, simple, ...dialogProps } = props;

    return (
        <Dialog {...dialogProps}>
            <DialogTitle>{props.title ?? "Are you sure?"}</DialogTitle>
            <DialogContent>
                {props.children}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel} color="secondary">
                    {props.cancelText ?? "Cancel"}
                </Button>
                {!simple &&
                    <Button onClick={props.onConfirm} color="primary">
                        {props.confirmText ?? "Confirm"}
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
}