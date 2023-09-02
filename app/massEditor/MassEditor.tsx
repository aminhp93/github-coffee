import Button from "@mui/material/Button";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import { LoadingButton } from "@mui/lab";
import { IconButton, Typography, styled } from "@mui/material";
import Box from "@mui/material/Box";
import {
  DataGridPro,
  GridColumns,
  GridSelectionModel,
} from "@mui/x-data-grid-pro";
import { chunk, cloneDeep, uniq, uniqBy } from "lodash";
import ViewService from "../../../../../@/components/view/View.services";
import { getViewUrl } from "../../../../../@/components/view/View.utils";
import CliComs from "../../../../../Core/lib/CliComs";
import { ColorInput } from "../../../../../lib/components";
import { Controller, getControllers } from "../../../../../store/api/network";
import { ItemRequest } from "../../../../items/schema/item.schema";
import FooterDataGrid from "./FooterDataGrid";
import { ProcessViewInfo, ProcessViewResponse, ViewInfo } from "./type";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

type Props = { onClose: () => void };

const columns: GridColumns = [
  {
    field: "processViewInfo",
    headerName: i18next.t("mass_editor.process_view"),
    width: 150,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      return params.row.processViewInfo.name;
    },
  },
  {
    field: "controller",
    headerName: i18next.t("mass_editor.controller"),
    width: 120,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      return params.row.processViewInfo.chainId;
    },
  },
  {
    field: "system",
    headerName: i18next.t("mass_editor.system"),
    width: 120,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const pattern = /\/systems\/([^/]+)/;

      if (!params.row.resourcePath) return null;

      const match = params.row.resourcePath.match(pattern);
      if (match) {
        const system = match[1];
        return system;
      }
      return null;
    },
  },
  {
    field: "subsystem",
    headerName: i18next.t("mass_editor.subsystem"),
    width: 120,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      return params.row.processViewInfo.subSystem;
    },
  },
  {
    field: "viewUuid",
    headerName: i18next.t("mass_editor.view_uuid"),
    width: 120,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      return params.row.processViewInfo.uuid;
    },
  },
  {
    field: "color",
    headerName: i18next.t("mass_editor.header_font_color"),
    flex: 1,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const listItemRoomObject: ItemRequest[] =
        params.row.items &&
        params.row.items.filter((i: ItemRequest) => i.id === "GK_RoomObject");
      const colorList: string[] = listItemRoomObject.map(
        (i) => i.properties?.headerFont?.color
      );
      const uniqueColorList = uniq(colorList);
      if (uniqueColorList) {
        return uniqueColorList.map((i: string) => (
          <span style={{ marginRight: "4px" }}>{i.toUpperCase()}</span>
        ));
      }
      return null;
    },
  },
  {
    field: "action",
    headerName: "",
    width: 100,
    editable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const viewId = params.row.processViewInfo.uuid;
      const viewControllerId = params.row.processViewInfo.chainId;
      const url = getViewUrl({
        pathname: `/views/${viewId}`,
        controllerId: viewControllerId,
        type: "pv",
      });
      const openInNewTab = () => {
        window.open(url, "_blank", "noopener,noreferrer");
      };
      const renderIcon = () => {
        if (params.row.status === "failure")
          return (
            <ErrorIcon
              sx={{ position: "absolute", left: "4px" }}
              color="error"
            />
          );
        if (params.row.status === "success")
          return (
            <CheckIcon
              sx={{ position: "absolute", left: "4px" }}
              color="success"
            />
          );
        return null;
      };
      return (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          {renderIcon()}
          <IconButton
            onClick={openInNewTab}
            sx={{ position: "absolute", right: "4px" }}
          >
            <OpenInNewIcon />
          </IconButton>
        </Box>
      );
    },
  },
];

const MassEditor = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const [listController, setListController] = useState<Controller[]>([]);
  const [rows, setRows] = useState<ViewInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean | null>(null);
  const [processViewSelected, setProcessViewSelected] = useState<ViewInfo[]>(
    []
  );
  const [listProcessViewUpdateFail, setListProcessViewUpdateFail] = useState<
    ViewInfo[]
  >([]);
  const [colorUpdateValue, setColorUpdateValue] = useState<string>("#FFFFFF");

  useEffect(() => {
    const init = async () => {
      // const controllers = await getControllers();
      const controllers: any = await axios({
        method: "GET",
        url: "/api/controllers",
      });
      setListController(controllers);
    };
    init();
  }, []);

  const handleColorUpdateValueChange = (color: string) => {
    setColorUpdateValue(color.toUpperCase());
  };

  const getListProcessView = async () => {
    const listPromise: Promise<ProcessViewResponse>[] = [];
    listController.forEach((i) => {
      listPromise.push(
        // CliComs.promiseSend({
        // 	type: "pvs_getPvs",
        // 	payload: {
        // 		msgData: { chain: i.id, skipContent: true, skipThumbnail: true },
        // 	},
        // }) as Promise<ProcessViewResponse>
        axios({
          method: "GET",
          url: "/api/processViews",
          params: {
            msgData: { chain: i.id, skipContent: true, skipThumbnail: true },
          },
        })
      );
    });

    return Promise.all(listPromise);
  };

  const getListProcessViewContent = async (listPV: ProcessViewInfo[]) => {
    const listPromise: Promise<ViewInfo>[] = [];
    for (let index = 0; index < listPV.length; index++) {
      const pv = listPV[index];
      const pvContentPromise = new Promise(async (resolve, reject) => {
        const res = await ViewService.getPVContent({
          uuid: pv.uuid,
          chainId: pv.chainId,
        });
        resolve({ ...res, processViewInfo: pv });
      }) as Promise<ViewInfo>;
      listPromise.push(pvContentPromise);
    }

    return Promise.all(listPromise);
  };

  const handleGetPVTree = async () => {
    setRows([]);
    setLoading(true);
    try {
      const listPV = await getListProcessView();

      const mappedListPV = listPV.reduce((acc: ProcessViewInfo[], curr) => {
        if (curr.data) {
          const cloneCurrentData = cloneDeep(curr.data);
          cloneCurrentData.forEach((i) => (i.chainId = curr.msgData.chain));
          return acc.concat(cloneCurrentData);
        } else return acc;
      }, []);

      const chunkedListPV = chunk(mappedListPV, 10);
      for (let i = 0; i < chunkedListPV.length; i++) {
        const listPVItem = chunkedListPV[i];
        const listContent = await getListProcessViewContent(listPVItem);
        // wait 100ms
        await new Promise((resolve) => setTimeout(resolve, 100));
        const validatedRes: ViewInfo[] = listContent
          // filter PV with resourcePath
          .filter((i: ViewInfo) => i.resourcePath)
          // filter PV items includes selected item
          .filter(
            (i: ViewInfo) =>
              i.items &&
              i.items.filter((j) => j.id === "GK_RoomObject").length > 0
          );

        setRows((oldRow) => {
          const newRow = [...oldRow, ...validatedRes];
          return newRow;
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      setLoading(false);
    }
  };

  const handleUpdate = useCallback(
    async (processViewUpdate: ViewInfo[]) => {
      if (!colorUpdateValue || !processViewUpdate.length) return;
      setRows((oldRow: ViewInfo[]) => {
        const oldRowClone = cloneDeep(oldRow);
        oldRowClone.forEach((i) => delete i.status);
        return oldRowClone;
      });
      setLoadingUpdate(true);
      setListProcessViewUpdateFail([]);
      try {
        const chunkedRows = chunk(processViewUpdate, 5);
        for (let i = 0; i < chunkedRows.length; i++) {
          const listPromises: Promise<ViewInfo>[] = [];
          const chunkedRowItem = chunkedRows[i];

          for (let k = 0; k < chunkedRowItem.length; k++) {
            const rowItem: ViewInfo = chunkedRowItem[k];
            const updatedContent = {
              ...rowItem,
            };

            updatedContent.status && delete updatedContent.status;

            updatedContent.items.forEach((j) => {
              if (j.id === "GK_RoomObject") {
                j.properties.headerFont.color = colorUpdateValue;
              }
            });

            /** Backend API call which takes the attributes of present view as payload */
            listPromises.push(
              new Promise(async (resolve, reject) => {
                const res = (await CliComs.promiseSend({
                  type: "pv_saveContent",
                  payload: {
                    chainId: rowItem.processViewInfo.chainId,
                    uuid: rowItem.processViewInfo.uuid,
                    content: updatedContent,
                    name: rowItem.processViewInfo.name,
                  },
                  // timeout: 20000,
                })) as unknown as boolean;

                if (res === true) {
                  resolve({
                    status: "success",
                    processViewInfo: rowItem.processViewInfo,
                  } as ViewInfo);
                } else {
                  resolve({
                    status: "failure",
                    processViewInfo: rowItem.processViewInfo,
                  } as ViewInfo);
                }
              })
            );
          }
          const res: ViewInfo[] = await Promise.all(listPromises);
          // wait 100ms
          await new Promise((resolve) => setTimeout(resolve, 100));
          setRows((oldRows: ViewInfo[]) => {
            const listPvUpdateFail = processViewSelected.filter((i) =>
              res.find(
                (j) =>
                  i.processViewInfo?.uuid === j.processViewInfo?.uuid &&
                  j.status === "failure"
              )
            );
            setListProcessViewUpdateFail((old) =>
              uniqBy(
                old.concat(listPvUpdateFail),
                (i) => i.processViewInfo?.uuid
              )
            );
            const newRows = oldRows.map((i) => {
              // Check view in last update
              const updatedRow = res.find(
                (j) => i.processViewInfo?.uuid === j.processViewInfo?.uuid
              );
              return updatedRow ? { ...i, ...updatedRow } : i;
            });
            return newRows;
          });
        }

        setLoadingUpdate(false);
      } catch (error) {
        setLoadingUpdate(false);
        console.error(error);
      }
    },
    [colorUpdateValue, processViewSelected]
  );

  const onSelectionModelChange = useCallback(
    (ids: GridSelectionModel) => {
      const selectedIDs = new Set(ids);
      const selectedRowData = rows.filter((row) =>
        selectedIDs.has(row.processViewInfo?.uuid?.toString())
      );
      setProcessViewSelected(selectedRowData);
    },
    [rows]
  );

  return (
    <DialogContainer>
      <DialogBodyContainer>
        <LoadingButton
          sx={{
            padding: "5px 10px",
            margin: "16px 0",
            ".MuiLoadingButton-root": {
              marginLeft: loading ? "10px" : "",
            },
          }}
          onClick={handleGetPVTree}
          variant="outlined"
          size="small"
          loading={loading}
          disabled={loading || !!loadingUpdate}
          loadingPosition="start"
          startIcon={<SearchIcon />}
        >
          <span>{t("mass_editor.search_item")}</span>
        </LoadingButton>

        <Box sx={{ height: 400, width: "100%" }}>
          <DataGridPro
            rows={rows}
            columns={columns}
            checkboxSelection
            getRowId={(row) => row.processViewInfo.uuid}
            onSelectionModelChange={onSelectionModelChange}
            components={{
              Footer: FooterDataGrid,
            }}
            componentsProps={{
              footer: {
                totalRow: rows.length,
                totalRowSuccess: rows.filter((i) => i.status === "success")
                  .length,
                totalSelected: processViewSelected.length,
                totalRowUpdateFail: listProcessViewUpdateFail.length,
                loadingUpdate: loadingUpdate,
                onClickRetryUpdateFail: () => {
                  handleUpdate(listProcessViewUpdateFail);
                },
              },
            }}
          />
        </Box>
      </DialogBodyContainer>
      <DialogFooterContainer>
        <Box
          sx={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ fontSize: "14px", marginRight: "4px" }}>
              {t("mass_editor.update_value")}
            </Typography>
            <ColorInput
              value={colorUpdateValue}
              compact={true}
              onChange={(color: string) => handleColorUpdateValueChange(color)}
            />
          </Box>

          <Box sx={{ display: "flex" }}>
            <Button sx={{ color: "rgba(0, 0, 0, 0.6)" }} onClick={onClose}>
              {t("cancel")}
            </Button>
            <LoadingButton
              color="primary"
              variant="contained"
              onClick={() => handleUpdate(processViewSelected)}
              loading={!!loadingUpdate}
              disabled={
                loadingUpdate || loading || processViewSelected.length === 0
              }
              loadingPosition="start"
              sx={{
                marginLeft: "4px",
                padding: "5px 20px",
                paddingLeft: loadingUpdate ? "40px" : "",
                ".MuiLoadingButton-root": {
                  marginLeft: loadingUpdate ? "25px" : "",
                },
              }}
            >
              {t("update")}
            </LoadingButton>
          </Box>
        </Box>
      </DialogFooterContainer>
    </DialogContainer>
  );
};

const DialogContainer = styled(Box)(() => ({
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const DialogBodyContainer = styled(Box)(() => ({
  padding: "0 16px",
}));

const DialogFooterContainer = styled(Box)(() => ({
  marginTop: "auto",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  padding: "0 16px",
}));

export default MassEditor;
