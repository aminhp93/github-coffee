// Import React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Import components
import { FormControl, MenuItem, Select, styled } from "@mui/material";
import { useViewControllerId } from "../../../@/components/view/View.hooks";
import { ViewContent, ViewPopup } from "../../../@/components/view/View.schema";
import ViewService from "../../../@/components/view/View.services";
import { getViewUrl } from "../../../@/components/view/View.utils";
import {
  ColumnLayout,
  RowLayout,
  Spacer,
  WindowLayout,
} from "../../../layouts";
import { Button, IconButton, TextInput } from "../../../lib/components";
import TagList from "./TagList";

const ContextSchema = z.any().optional();
const VariableSchema = z.object({
  name: z.string(),
  value: z.any(),
});

type Context = z.infer<typeof ContextSchema>;
type Variable = z.infer<typeof VariableSchema>;

const mapVariablesToTags = (variables: ViewContent, value?: Context) => {
  if (variables == null) return [];
  return Object.entries(variables).map(([key, v]) => {
    return {
      name: key,
      value: value ? value[key] : v,
    };
  });
};

type Prefix = {
  isUsed: boolean;
  value: string;
};

type Value = {
  context: Context;
  view: {
    chainId: string;
    dimensions: number[];
    displayName: string;
    name: string;
    prefix: Prefix;
    uuid: string;
  };
};

type Props = {
  value: Value;
  confirm: (
    selected: ViewPopup | undefined,
    variables: Variable[],
    prefix: Prefix
  ) => void;
  onCancel: () => void;
  tagPathsInView: unknown;
  onSaveView: () => void;
};

const Popup = (props: Props) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ViewPopup | undefined>();
  const [views, setViews] = useState<ViewPopup[]>([]);
  const [variables, setVariables] = useState(
    mapVariablesToTags(props.value?.context)
  );
  const [search, setSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredViews, setFilteredViews] = useState<ViewPopup[]>([]);
  const [prefix, setPrefix] = useState<Prefix>({
    isUsed: false,
    value: "",
  });

  const viewControllerId = useViewControllerId();
  const variableNames = variables.map((v) => v.name);
  const tags = variables.map((v) => v.value);

  useEffect(() => {
    (async () => {
      try {
        if (typeof viewControllerId !== "string")
          throw new Error("No chain id");
        const res = await ViewService.getPVSPopups({
          msgData: { chain: viewControllerId },
        });
        if (res.data) {
          const views = Object.keys(res.data).map((uuid) => {
            const view = res.data[uuid];
            const result = {
              chainId: viewControllerId,
              uuid,
              name: view.name,
              description: view.description,
              content: view.content,
            };
            return result;
          });
          setViews(views);
          setFilteredViews(filterViews(views, searchTerm));
          setPrefix({
            isUsed: props.value?.view?.prefix?.isUsed || prefix.isUsed,
            value: props.value?.view?.prefix?.value || prefix.value,
          });
        }
      } catch (e) {
        //
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterViews = (views: ViewPopup[], searchTerm: string) => {
    return views
      .sort((a: ViewPopup, b: ViewPopup) => a.name!.localeCompare(b.name!))
      .filter(
        (v: ViewPopup) =>
          v?.name && v?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  useEffect(() => {
    setFilteredViews(filterViews(views, searchTerm));
  }, [searchTerm, views]);

  const selectView = (uuid: string) => {
    const view = views.find((view: ViewPopup) => view.uuid === uuid);
    if (view == null) {
      setSelected(undefined);
      setVariables([]);
      return;
    }

    setSelected(view);
    setVariables(
      mapVariablesToTags(view.content.context, props.value?.context)
    );
  };

  useEffect(() => {
    if (!views.length) return;
    props.value?.view && selectView(props.value.view.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [views]);

  const onVariablesChange = (data: Variable[]) => {
    const newVariables = [];
    const varNames = variables.map((v: Variable) => v.name);
    for (const i of Object.keys(data)) {
      const varName = varNames[Number(i)] || i;
      const value = data[Number(i)];
      newVariables.push({ name: varName, value });
    }
    setVariables(newVariables);
  };

  const editSelectedPopup = () => {
    props.onSaveView();
    selected &&
      navigate(
        getViewUrl({
          pathname: `/views/${selected.uuid}`,
          controllerId: viewControllerId,
          type: "popup",
          edit: "true",
        })
      );
    props.onCancel();
  };

  return (
    <RowLayout fill>
      <WindowLayout fill>
        <RowLayout gutter>
          <ColumnLayout center>
            {!search ? (
              <>
                <CustomFormControl fullWidth>
                  <Select
                    value={selected ? selected.uuid : ""}
                    onChange={(e) => selectView(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Empty</MenuItem>
                    {filteredViews.map((x) => (
                      <MenuItem value={x.uuid}>{x.name}</MenuItem>
                    ))}
                  </Select>
                </CustomFormControl>
                <IconButton
                  disabled={!selected}
                  icon="edit"
                  onClick={editSelectedPopup}
                />
              </>
            ) : (
              <div style={{ flexShrink: 0 }}>
                <TextInput
                  compact
                  fullWidth
                  value={searchTerm}
                  onChange={(text: string) => {
                    setSearchTerm(text);
                  }}
                />
              </div>
            )}
            <Spacer />
            <IconButton
              icon="search"
              onClick={() => {
                setSearch(!search);
              }}
            />
          </ColumnLayout>
          <TagList
            key={selected?.uuid}
            tags={tags}
            labels={variableNames}
            chainId={viewControllerId}
            onChange={onVariablesChange}
            onPrefixChange={(prefix: Prefix) => {
              setPrefix(prefix);
            }}
            prefix={prefix}
            tagPathsInView={props.tagPathsInView}
          />
        </RowLayout>
      </WindowLayout>
      <ColumnLayout gutter>
        <Spacer />
        <Button
          onClick={() => {
            props.confirm(selected, variables, prefix);
          }}
        >
          ok
        </Button>
        {props.onCancel && <Button onClick={props.onCancel}>cancel</Button>}
      </ColumnLayout>
    </RowLayout>
  );
};

const CustomFormControl = styled(FormControl)(() => ({
  ".MuiSelect-select": {
    padding: "10px 32px 10px 14px",
  },
  minWidth: "240px",
  maxWidth: "300px",
}));

export default Popup;
