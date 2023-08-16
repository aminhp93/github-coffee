import React from "react";
import { Button, IconButton, Select, TextInput } from "../../../lib/components";
import CliComs from "../../../Core/lib/CliComs";
import { connect } from "../../../lib/store";
import TagList from "./TagList";
import {
  ColumnLayout,
  RowLayout,
  Spacer,
  WindowLayout,
} from "../../../layouts";
import { selectViewChainId } from "../../../utils/deprecated/selectViewChainId";
import { useNavigate } from "react-router-dom";

const mapVariablesToTags = (variables, value) => {
  if (variables == null) return [];
  return Object.entries(variables).map(([key, v]) => {
    return {
      name: key,
      value: value ? value[key] : v,
    };
  });
};

/**
 * @description Creates content in the Popup settings window
 * @property {object} props
 */
class Popup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.selectView = this.selectView.bind(this);
    this.onVariablesChange = this.onVariablesChange.bind(this);
    this.state = {
      fetched: false,
      selected: null,
      views: [],
      variables: mapVariablesToTags(props.value?.context),
      search: false,
      searchTerm: "",
      filteredViews: [],
      prefix: {
        isUsed: false,
        value: "",
      },
    };
  }

  componentDidMount() {
    this.fetchViews(this.props.chain).then((res) => {
      const views = Object.keys(res).map((uuid) => {
        const view = res[uuid];
        const result = {
          chainId: this.props.chain,
          uuid,
          name: view.name,
          description: view.description || null,
          content: view.content,
        };
        return result;
      });
      this.setState((s) => ({
        fetched: true,
        views,
        filteredViews: this.filterViews(views, s.searchTerm),
        prefix: {
          isUsed:
            this.props.value?.view?.prefix?.isUsed || this.state.prefix.isUsed,
          value:
            this.props.value?.view?.prefix?.value || this.state.prefix.value,
        },
      }));
    });
  }

  filterViews(views, searchTerm) {
    return views
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((v) => v?.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  componentDidUpdate(_, prevState) {
    if (prevState.views !== this.state.views) {
      this.props.value?.view && this.selectView(this.props.value.view.name);
    }

    if (prevState.searchTerm !== this.state.searchTerm) {
      this.setState((state) => ({
        filteredViews: this.filterViews(state.views, state.searchTerm),
      }));
    }
  }

  async fetchViews(chain) {
    if (typeof chain !== "string") throw new Error("No chain id");
    const { data } = await CliComs.promiseSend({
      type: "pvs_getPopups",
      payload: {
        msgData: { chain },
      },
    });
    return data;
  }

  selectView(name) {
    this.setState((s) => {
      const view = s.views.find((view) => view.name === name);
      if (view == null)
        return {
          selected: null,
          variables: [],
        };
      return {
        selected: view,
        variables: mapVariablesToTags(
          view.content.context,
          this.props.value?.context
        ),
      };
    });
  }

  onVariablesChange(variables) {
    const newVariables = [];
    const varNames = this.state.variables.map((v) => v.name);
    for (const i of Object.keys(variables)) {
      const varName = varNames[i] || i;
      const value = variables[i];
      newVariables.push({ name: varName, value });
    }
    this.setState({ variables: newVariables });
  }

  editSelectedPopup = () => {
    this.props.onSaveView();
    this.props.editPopup(this.state.selected);
    this.props.onCancel();
  };

  render() {
    const variableNames = this.state.variables.map((v) => v.name);
    const tags = this.state.variables.map((v) => v.value);

    return (
      <RowLayout fill>
        <WindowLayout fill>
          <RowLayout gutter>
            <ColumnLayout center>
              {!this.state.search ? (
                <>
                  <Select
                    value={(this.state.selected || {}).name}
                    onChange={this.selectView}
                    options={[
                      "Empty",
                      ...this.state.filteredViews.map((x) => x.name),
                    ]}
                  />
                  <IconButton
                    disabled={!this.state.selected}
                    icon="edit"
                    onClick={this.editSelectedPopup}
                    size="large"
                  />
                  <Spacer />
                </>
              ) : (
                <>
                  <div style={{ flexShrink: "0" }}>
                    <TextInput
                      compact
                      fullWidth
                      value={this.state.searchTerm}
                      onChange={(text) => this.setState({ searchTerm: text })}
                    />
                  </div>
                  <Spacer />
                </>
              )}
              <IconButton
                icon="search"
                onClick={() => this.setState((s) => ({ search: !s.search }))}
                size="large"
              />
            </ColumnLayout>
            <TagList
              key={this.state.selected?.uuid}
              tags={tags}
              labels={variableNames}
              chainId={this.props.chain}
              onChange={this.onVariablesChange}
              onPrefixChange={(prefix) => this.setState({ prefix })}
              prefix={this.state.prefix}
              tagPathsInView={this.props.tagPathsInView}
            />
          </RowLayout>
        </WindowLayout>
        <ColumnLayout gutter>
          <Spacer />
          <Button
            onClick={() => {
              this.props.confirm(
                this.state.selected,
                this.state.variables,
                this.state.prefix
              );
            }}
          >
            ok
          </Button>
          {this.props.onCancel && (
            <Button onClick={this.props.onCancel}>cancel</Button>
          )}
        </ColumnLayout>
      </RowLayout>
    );
  }
}

export default connect(
  (state) => ({
    chain: selectViewChainId(state),
  }),
  (dispatch) => {
    const navigate = useNavigate();
    return {
      editPopup: (popup) =>
        navigate(
          `/edit/${popup.uuid}?cid=${popup.chainId}&type=popup&edit=true`
        ),
    };
  }
)(Popup);
