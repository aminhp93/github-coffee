import { SnackbarProvider, useSnackbar, enqueueSnackbar } from "notistack";

type Props = {
  children: React.ReactNode;
};

const NotificationProvider = ({ children }: Props) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export { NotificationProvider, useSnackbar, enqueueSnackbar };
