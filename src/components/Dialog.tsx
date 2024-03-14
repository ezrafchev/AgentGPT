import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Button from "./Button";

interface DialogProps {
  header: React.ReactNode;
  children: React.ReactNode;
  isShown: boolean;
  close: () => void;
  footerButton?: React.ReactNode;
  disabled?: boolean;
  dataTestId?: string;
}

interface DialogRef {
  open: () => void;
  close: () => void;
}

const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start justify-between rounded-t border-b-2 border-solid border-white/20 p-5">
      <h3 className="font-mono text-3xl font-semibold">{children}</h3>
    </div>
  );
};

const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-md relative my-3 max-h-[50vh] flex-auto overflow-y-auto p-3 leading-relaxed">
      {children}
    </div>
  );
};

const DialogFooter = ({
  footerButton,
  close,
}: {
  footerButton?: React.ReactNode;
  close: () => void;
}) => {
  return (
    <div className="flex items-center justify-end gap-2 rounded-b border-t-2 border-solid border-white/20 p-2">
      <Button
        enabledClassName="bg-yellow-600 hover:bg-yellow-500"
        onClick={close}
        disabled={false}
      >
        Close
      </Button>
      {footerButton}
    </div>
  );
};

const CloseButton = ({ close }
