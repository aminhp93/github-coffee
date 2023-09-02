import { Box, Button, Divider, Typography, styled } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

type Props = {
  totalRow: number;
  totalRowSuccess: number;
  totalSelected: number;
  totalRowUpdateFail: number;
  loadingUpdate: boolean;
  onClickRetryUpdateFail: () => void;
};

const FooterDataGrid = ({
  totalRow,
  totalRowSuccess,
  totalSelected,
  totalRowUpdateFail,
  loadingUpdate,
  onClickRetryUpdateFail,
}: Props) => {
  const renderUpdateText = () => {
    if (loadingUpdate === null) return <Box></Box>;
    return (
      <TextTitle>
        {loadingUpdate ? "mass_editor.updating" : "mass_editor.updated"}
      </TextTitle>
    );
  };
  return (
    <FooterContainer>
      <Divider />
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {renderUpdateText()}
          <TextTitle>{`mass_editor.total_rows ${totalRow}`}</TextTitle>
        </Box>

        {loadingUpdate !== null && (
          <Box sx={{ padding: "8px" }}>
            <MessageNotification>
              <CheckIcon />
              <Typography>
                {`mass_editor.successfully_updated" ${totalRowSuccess}`}
              </Typography>
            </MessageNotification>
            {totalRowUpdateFail > 0 && (
              <MessageNotification sx={{ justifyContent: "space-between" }}>
                <MessageNotification>
                  <ErrorOutlineIcon />{" "}
                  <Typography>
                    {`mass_editor.failed_to_update" ${totalRowUpdateFail}`}
                  </Typography>
                </MessageNotification>
                {loadingUpdate === false && (
                  <Button color="primary" onClick={onClickRetryUpdateFail}>
                    {"retry"}
                  </Button>
                )}
              </MessageNotification>
            )}
          </Box>
        )}
      </Container>
    </FooterContainer>
  );
};

const FooterContainer = styled(Box)(() => ({}));

const Container = styled(Box)(() => ({
  padding: "12px",
}));

const MessageNotification = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  ".MuiTypography-root": {
    marginLeft: "12px",
  },
}));

const TextTitle = styled(Typography)(() => ({
  fontSize: "14px",
  color: "rgba(0, 0, 0, 0.60)",
}));

export default FooterDataGrid;
