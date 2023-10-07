import React, { Fragment, ReactNode, useEffect } from 'react';

import ReactDOM from 'react-dom';
import { MdClose } from 'react-icons/md';

export interface ModalProps {
  isShowing: boolean;
  toggle: () => void;
  padding?: number;
  isDismissable?: boolean;
  background?: string;
  children?: React.ReactNode;
}

export const Modal = ({
  isShowing,
  toggle,
  children,
  background,
  isDismissable = true
}: ModalProps) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let body = document.querySelectorAll('BODY')[0] as HTMLElement;
      if (isShowing) {
        body.style.overflowY = 'hidden';
      } else {
        body.style.overflowY = 'auto';
      }
    }
  }, [isShowing]);

  return isShowing
    ? ReactDOM.createPortal(
        <Fragment>
          <Background onClick={() => (isDismissable ? toggle() : undefined)} />
          <Container
            toggle={toggle}
            isDismissable={isDismissable}
            background={background}
          >
            {children}
          </Container>
        </Fragment>,
        document?.body
      )
    : null;
};

const Background = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className=" bg-black opacity-50 absolute top-0 left-0 right-0 bottom-0 z-40"
      onClick={onClick}
    />
  );
};

const Container = ({
  toggle,
  isDismissable,
  children,
  background
}: {
  toggle: () => void;
  isDismissable: boolean;
  children: ReactNode;
  background?: string;
}) => {
  return (
    <>
      <button
        onClick={toggle}
        className=" absolute top-12 right-12 -translate-y-9 bg-slate-100 z-50 rounded-lg p-2 rounded-br-none"
        style={{ background }}
      >
        <MdClose className=" w-6 h-6" />
      </button>
      <div
        className=" bg-white absolute  top-12 left-12 right-12 bottom-12 z-50 rounded-2xl rounded-t-none flex flex-col"
        style={{ background }}
      >
        {children}
      </div>
    </>
  );
};
