//-------------------------------------------------------------
// PISCADA PMP AppBuilder2
//
// author:  micha
// created: 08/07/2019
//
// (c) Piscada AS 2019
//-------------------------------------------------------------

import i18next from "i18next";
import { includes } from "lodash";
import { insertFromController } from "../../containers/AppBuilder/CommonInterface/interface";
import CopyPvComp from "../../containers/AppBuilder/CopyPvComp";
import ExportComp from "../../containers/AppBuilder/ExportComp";
import ImportComp from "../../containers/AppBuilder/ImportComp";
import InsertPvComp from "../../containers/AppBuilder/InsertPvComp";
import { openDialog as OpenDialog } from "../../containers/AppBuilder/OpenDialog";
import PropertiesPvComp from "../../containers/AppBuilder/PropertiesPvComp";
import lanGray40 from "../../Core/assets/images/windows//wan-28-2.png";
import teListClosePng from "../../Core/assets/images/windows/chevron-down-28-2.png";
import teListOpenPng from "../../Core/assets/images/windows/chevron-right-28-2.png";
import diodeGrayPng from "../../Core/assets/images/windows/diode_gray.png";
import diodeGreenPng from "../../Core/assets/images/windows/diode_green.png";
import folderPng from "../../Core/assets/images/windows/folder-outline-28-2.png";
import programGray24 from "../../Core/assets/images/windows/gate-nand-28-2.png";
import deviceGray from "../../Core/assets/images/windows/nas28-2.png";
import formatAlign from "../../Core/assets/images/windows/outline_format_align_justify_gray_40px.png";
import AlertInfo from "../../Core/assets/images/windows/alert-info.png";
import {
  default as pvPng,
  default as viewGray,
} from "../../Core/assets/images/windows/pic-28-2.png";
//-------------------------------------------------------------
// PNG
// here we use 40x40 or 24x24 and no other size
// 24x24 is used in the Treeview for "Views", "Programs", "Devices" and in the table for all icons
// 40x40 is used in the Treeview for "controllers" and "subsystems"
//import serverPng from "../../Core/assets/images/windows/server.png";
import serverPng from "../../Core/assets/images/windows/server-26-3.png";
import {
  default as subsystemGray,
  default as subsystemGray24,
} from "../../Core/assets/images/windows/slash-28-2.png";
//-------------------------------------------------------------
// CSS
import "../../Core/css/AppBuilder2.css";
import "../../Core/css/PVPanel.css";
import "../../Core/css/Tables.css";
import CliComs from "../../Core/lib/CliComs";
import Input from "../../Core/lib/Input";
//import PVPopupsTemplates from "./PVPopupsPVTemplates";
import Network from "../../Core/lib/Network";
import Store from "../../Core/lib/store";
import { ADD } from "../../Core/lib/store/constants/add";
import { DELETE } from "../../Core/lib/store/constants/delete";
import { SET } from "../../Core/lib/store/constants/set";
import SimpleObserver from "../../Core/lib/store/helpers/simpleObserver";
import StoreCommunicator from "../../Core/lib/storeCommunicator/communicator";
import Table from "../../Core/lib/Table";
import { SocketClient } from "../../hooks/useSocket";
import Dialog from "../../lib/dialogs/Dialog";
import otherStore from "../../store";
import { RegisterState } from "../../temp/BACnet/Common";
import { IoTypes, IoTypesToSupport } from "../../temp/Common";
import { DEFAULT_LOCAL_EMSYSTEMS_ENDPOINT } from "../../temp/deviceWizard/EM-Systems/Common";
import LdapSettingsDialog from "../../temp/LdapSettingsDialog";
import { DeviceStatusTypes } from "../../temp/Modbus/Common";
import { openView } from "../../utils/deprecated/openView";
import Common from "./Common";
import DialogWindow from "./DialogWindow";
import DraggableWindow from "./DraggableWindow";
import PVPanel from "./PVPanel";
import { UPDATE } from "./store/constants/update";
import debounce from "lodash.debounce";
import { snack } from "../../utils/snackbar";

const client = new SocketClient();
const nsp = client.socket("/tags");

class ObjectHandler {
  object = {};

  constructor() {
    if (ObjectHandler.current == null) this.init();
  }

  init() {
    ObjectHandler.current = this;
  }

  destroy() {
    const _this = this;
    Object.entries(this.object).forEach(([key]) => {
      delete _this.object[key];
    });
    this.object = null;
    ObjectHandler.current = null;
  }

  add(key, value) {
    this.object[key] = value;
  }

  remove(obj) {
    if (this.object[obj.key] !== "undefined") delete this.object[obj.key];
  }

  removeByKey(key) {
    if (this.object[key] !== "undefined") delete this.object[key];
  }

  get(key) {
    if (typeof this.object[key] !== "undefined") return this.object[key];
    else return null;
  }

  getObject() {
    return this.object;
  }

  clear() {
    const _this = this;
    Object.entries(this.object).forEach(([key]) => {
      delete _this.object[key];
    });
  }
}

/**
 * AppBuilder2
 * @author micha
 * @class
 * @private
 * @param {*} config
 * @param {*} config.type "picker", "pickerPV", "builder", pickerResource
 * @param {*} config.onOk callback function
 */
export default class AppBuilder2 {
  get TYPE_WIDTH() {
    return 30;
  }
  get TYPE_TWO_WIDTH() {
    return 50;
  }
  get ICON_WIDTH() {
    return 10;
  }
  get NAME_WIDTH() {
    return 70;
  }
  get DESCRIPTION_WIDTH() {
    return 80;
  }
  get STATUS_WIDTH() {
    return 30;
  }

  tableConfig = {
    headers: [
      {
        name: "",
        width: this.ICON_WIDTH,
      },
      {
        name: i18next.t("name"),
        width: this.NAME_WIDTH, //100
      },
      {
        name: i18next.t("description"),
        width: this.DESCRIPTION_WIDTH, //80
      },
      {
        name: i18next.t("type"),
        width: this.TYPE_WIDTH,
      },
    ],
  };

  tableConfigControllers = {
    headers: [
      {
        name: "",
        width: this.ICON_WIDTH,
      },
      {
        name: i18next.t("name"),
        width: this.NAME_WIDTH, //70
      },
      {
        name: i18next.t("facility"),
        width: 70,
      },
      {
        name: i18next.t("url"),
        width: 50,
      },
      {
        name: i18next.t("type"),
        width: this.TYPE_WIDTH,
      },
    ],
  };

  tableConfigSubSystems = {
    headers: [
      {
        name: "",
        width: this.ICON_WIDTH,
      },
      {
        name: i18next.t("name"),
        width: this.NAME_WIDTH, //70
      },
      {
        name: i18next.t("description"),
        width: this.DESCRIPTION_WIDTH, //70
      },
      {
        name: i18next.t("permanent"),
        width: 20,
      },
      {
        name: i18next.t("type"),
        width: this.TYPE_WIDTH,
      },
    ],
  };

  tableConfigPrograms = {
    headers: [
      {
        name: "",
        width: this.ICON_WIDTH,
      },
      {
        name: i18next.t("name"),
        width: this.NAME_WIDTH, //70
      },
      {
        name: i18next.t("description"),
        width: this.DESCRIPTION_WIDTH, //80
      },
      {
        name: i18next.t("status"),
        width: this.STATUS_WIDTH, //30
      },
      {
        name: i18next.t("type"),
        width: this.TYPE_WIDTH,
      },
    ],
  };

  tableConfigDevices = {
    headers: [
      {
        name: "",
        width: this.ICON_WIDTH,
      },
      {
        name: i18next.t("name"),
        width: this.NAME_WIDTH, //70
      },
      {
        name: i18next.t("description"),
        width: this.DESCRIPTION_WIDTH, //80
      },
      {
        name: i18next.t("status"),
        width: this.STATUS_WIDTH, //30
      },
      {
        name: i18next.t("hw_type"),
        width: this.TYPE_TWO_WIDTH, //50
      },
      {
        name: i18next.t("type"),
        width: this.TYPE_WIDTH,
      },
    ],
  };

  tableConfigViews = {
    headers: [
      {
        name: "",
        width: this.ICON_WIDTH,
      },
      {
        name: i18next.t("name"),
        width: this.NAME_WIDTH, //100
      },
      {
        name: i18next.t("description"),
        width: this.DESCRIPTION_WIDTH, //80
      },
      {
        name: i18next.t("device_type"),
        width: this.TYPE_TWO_WIDTH, //50
      },
      {
        name: i18next.t("type"),
        width: this.TYPE_WIDTH,
      },
    ],
  };

  get DIALOG_MIN_WIDTH() {
    return 1000;
  }

  get DIALOG_MIN_HEIGHT() {
    return 590;
  }

  get DIALOG_WIDTH() {
    return 1000;
  }

  get DIALOG_HEIGHT() {
    return 650;
  }

  privateUuid = Common.createUuidv4();

  privateRootUuid = Common.createUuidv4();

  get UUID() {
    return this.privateUuid;
  }

  get ROOTUUID() {
    return this.privateRootUuid;
  }

  get ROOT() {
    return 0;
  }

  get CONTROLLER() {
    return this.ROOT + 1;
  }

  get SYSTEM() {
    return this.CONTROLLER + 1;
  }

  get SUBSYSTEM() {
    return this.SYSTEM + 1;
  }

  get VIEWS() {
    return this.SUBSYSTEM + 1;
  }

  get PROGRAMS() {
    return this.SUBSYSTEM + 1;
  }

  get DEVICES() {
    return this.SUBSYSTEM + 1;
  }

  get VIEWS_CONTENT() {
    return this.VIEWS + 1;
  }

  get PROGRAMS_CONTENT() {
    return this.PROGRAMS + 1;
  }

  get DEVICES_CONTENT() {
    return this.DEVICES + 1;
  }

  static subscribedTags = {};

  static subscribeToTags(tag) {
    if (typeof AppBuilder2.subscribedTags[tag.uuid] !== "undefined") return;

    AppBuilder2.subscribedTags[tag.uuid] = tag;

    const topic = tag.chainId + "/" + tag.uuid;

    this.tagsHandler &&
      nsp.subscribe(topic, (...args) => this.tagsHandler(...args));
  }

  static subscribeToTagsHandler(handler) {}

  /**
   * @constructor
   * @param {Object} config
   */
  constructor(config = { type: "builder" }) {
    if (AppBuilder2.current == null) {
      this.config = config;
      this.init();
    }
  }

  // INIT
  init() {
    AppBuilder2.current = this;
    this.appType = this.config.type;
    this.selectedTreeFolder = null;
    this.currentTarget = null;
    this.selectedTargetId = null;
    this.currentTableTarget = null;
    this.currentPvTreeIdPath = [];
    this.currentRealIdPath = [];
    //the localhostUuid is needed to get the same behavior as the other controllers
    this.localhostUuid = null;
    this.pvTree = [];
    this.dialog = null;
    this.elementList = []; // holds elememts that should be cleared (clearElement) and nulled ( = null;)
    // when we destroy the object

    this.tableCells = []; // holds the cells for each row and index [rowIndex][cellIndex]
    this.searchTypesSelected = 0; //
    this.searchTypesValue = 1;

    this.changedSetDeviceTimer = null;
    //-------------------------------------------------------------
    //
    this.draggedObj = null;

    //-------------------------------------------------------------
    // Footer
    this.contentFooterVisible = false;
    this.objectContainerFooterRightContainer = null;
    this.objectContainerFooterHorizontalSpacer = null;
    this.pickerContainer = null;

    //-------------------------------------------------------------
    // Shortcut

    //-------------------------------------------------------------
    // OBJECTHANDLER
    this.initObjectHandler();

    //-------------------------------------------------------------
    // CONTAINER
    this.initContainer();

    //-------------------------------------------------------------
    // POPUPS
    this.initPopups();

    //-------------------------------------------------------------
    // Application type
    this.setToAppType(this.config.type);

    //-------------------------------------------------------------
    // Dialog Window
    this.initDialogWindow();

    //-------------------------------------------------------------
    // Root Container
    this.initRootContainer();

    /////////////////////////////////////////////////////
    //add localhost
    this.localhostUuid = Network.localController.chainId;

    //-------------------------------------------------------------
    // Subscriptions
    this.initSubscriptions();

    this.communicator = new StoreCommunicator();
    this.communicator.sendGetControllerList();

    AppBuilder2.subscribeToTagsHandler(this.tagsHandler.bind(this));
  }

  initContainer() {
    this.addMainContainer();
    this.addMessageContainer(this.container);
    this.addTopContainer(this.container);
    //switch off topContainer
    this.addTopContainerContext(this.topContainer);
    this.addHorizontalSpacer(this.topContainer);
    this.addMiddleContainer(this.container);
    this.addObjectTreeContainer(this.middleContainer);
    this.addVerticalSpacer(this.middleContainer);
    this.addObjectContainer(this.middleContainer);
    this.addObjectContainerHeader(this.objectContainer, "");
    this.addHorizontalSpacer(this.objectContainer);
    this.addObjectContainerContent(this.objectContainer);
    this.addContentFooter(this.objectContainer);
  }

  initObjectHandler() {
    this.folderHandler = new ObjectHandler(); // key: uuid subsystem / value: contains the folders like
    //"Views" , "Programs" , "Devices"
    this.referenceHandler = new ObjectHandler(); // key: own uuid  /
    // value: contains the reference to the elements like "view", "program", "device", "pv", "folder"
    this.pvTreeFolderHandler = new ObjectHandler(); // key: folder uuid / value: children array[]
  }

  initDialogWindow() {
    if (this.dialog == null) {
      let header = i18next.t("application_builder");
      if (this.config.type === "pickerResource")
        header = i18next.t("choose_resource");
      this.dialog = new DraggableWindow({
        header: header,
        content: this.container,
        hideOnClose: false,
        onClose: this.onDialogClose.bind(this),
        zIndex: this.config.zIndex,
      });
    }

    this.dialog.toggleBlankOnChange(true);
    this.dialog.setMinWidth(this.DIALOG_MIN_WIDTH);
    this.dialog.setMinHeight(this.DIALOG_MIN_HEIGHT);
    this.dialog.setSize(this.DIALOG_WIDTH, this.DIALOG_HEIGHT);
    this.dialog.center();
  }

  initRootContainer() {
    const rootContainer = this.addFolder(
      this.objectTreeContainer,
      {
        uuid: this.ROOTUUID,
        name: i18next.t("network").toUpperCase(),
        depth: this.ROOT,
        pathName: "ROOT/",
        draggable: false,
      },
      false,
      `url('${lanGray40}')`,
      "root"
    );
    this.setFolderAsExpandable(rootContainer, this);
    this.toggleFolder(rootContainer.parentFolder);
    this.addToReferenceHandler(this.ROOTUUID, rootContainer);
  }

  initPopups() {
    this.networkPopup = null;
    this.serverPopup = null;
    this.systemPopup = null;
    this.subSystemPopup = null;
    this.viewsFolderPopup = null;
    this.programsFolderPopup = null;
    this.devicesFolderPopup = null;
    this.viewPopup = null;
    this.devicePopup = null;
    this.addNetworkPopup();
    this.addServerPopup();
    this.addSystemPopup();
    this.addSubSystemPopup();
    this.addViewsFolderPopup();
    this.addProgramsFolderPopup();
    this.addDeviceFolderPopup();
    this.addViewPopup();
    this.addDevicePopup();
  }

  initSubscriptions() {
    this.subscribedControllers = {};
    this.subscribedSystems = {};
    this.subscribedSubSystems = {};
    this.subscribedPvTrees = {};
    this.subscribedPvs = {};
    this.subscribedPrograms = {};

    this.storeUnsubscribeController = null;
    this.storeUnsubscribeSystem = null;
    this.storeUnsubscribeSubSystem = null;
    this.storeUnsubscribePv = null;
    this.storeUnsubscribePvTree = null;
    this.storeUnsubscribeProgram = null;

    //STORE OBSERVER'S
    //CONTROLLER
    this.storeUnsubscribeController = SimpleObserver(
      (store) => store.controller,
      (state) => {
        this.onChangeController(state);
      }
    );
    //SYSTEM
    this.storeUnsubscribeSystem = SimpleObserver(
      (store) => store.system,
      (state) => {
        this.onChangeSystem(state);
      }
    );
    //SUBSYSTEM
    this.storeUnsubscribeSubSystem = SimpleObserver(
      (store) => store.subsystem,
      (state) => {
        this.onChangeSubSystem(state);
      }
    );
    //PV
    this.storeUnsubscribePv = SimpleObserver(
      (store) => store.pv,
      (state) => {
        this.onChangePv(state);
      }
    );
    //PV TREE
    this.storeUnsubscribePvTree = SimpleObserver(
      (store) => store.pvTree,
      (state) => {
        this.onChangePvTree(state);
      }
    );
    //PROGRAM
    this.storeUnsubscribeProgram = SimpleObserver(
      (store) => store.program,
      (state) => {
        this.onChangeProgram(state);
      }
    );
    //DEVICE
    this.storeUnsubscribeDevice = SimpleObserver(
      (store) => store.device,
      (state) => {
        this.onChangeDevice(state);
      }
    );
  }

  // DESTROY
  destroy() {
    this.storeUnsubscribeDevice();
    this.storeUnsubscribeProgram();
    this.storeUnsubscribePv();
    this.storeUnsubscribePvTree();
    this.storeUnsubscribeSubSystem();
    this.storeUnsubscribeSystem();
    this.storeUnsubscribeController();

    //TABLES
    this.tableConfig = null;
    this.objectsTable.clearTable();
    this.objectsTable.removeTable();
    this.tableCells = null;

    //OBJECTHANDLER
    this.folderHandler.destroy();
    this.referenceHandler.destroy();
    this.pvTreeFolderHandler.destroy();

    this.folderHandler = null;
    this.referenceHandler = null;
    this.pvTreeFolderHandler = null;

    //CONTAINER
    Common.clearElement(this.objectContainer);
    this.objectContainer = null;

    Common.clearElement(this.objectsTable);
    this.objectsTable = null;

    Common.clearElement(this.objectContainerContent);
    this.objectContainerContent = null;

    Common.clearElement(this.objectContentHeaderText);
    this.objectContentHeaderText = null;

    Common.clearElement(this.objectContainerFooterRightContainer);
    this.objectContainerFooterRightContainer = null;

    Common.clearElement(this.objectContainerFooterHorizontalSpacer);
    this.objectContainerFooterHorizontalSpacer = null;

    Common.clearElement(this.objectTreeContainer);
    this.objectTreeContainer = null;

    Common.clearElement(this.middleContainer);
    this.middleContainer = null;

    Common.clearElement(this.topContainer);
    this.topContainer = null;

    Common.clearElement(this.infoMessageContainer);
    this.infoMessageContainer = null;

    Common.clearElement(this.container);
    this.container = null;

    Common.clearElement(this.SearchInput);
    this.SearchInput = null;

    //Network
    this.networkPopupLdapShortcut = null;

    this.serversPopupInsertSystemShortcut = null;
    this.serversPopupBackupAndRestoreShortcut = null;
    this.serversPopupTunnelSettingsShortcut = null;
    this.serversPopupNetworkSettingsShortcut = null;
    //System
    this.systemsPopupInsertSubSystemShortcut = null;
    this.systemsPopupRenameSystemShortcut = null;
    this.systemsPopupRemoveSystemShortcut = null;
    //SubSystem
    this.subSystemsPopupRenameSubSystemShortcut = null;
    this.subSystemsPopupUpdateSubSystemInformation = null;
    this.subSystemsPopupAddPVToSubSystem = null;
    this.subSystemsPopupRemoveSubSystemShortcut = null;
    //Views
    this.viewsPopupInsertViewsShortcut = null;
    this.viewsPopupInsertFromControllerShortcut = null;
    this.viewsPopupImportFromFileShortcut = null;
    this.viewsPopupAddFolderShortcut = null;
    this.viewsPopupRenameFolderShortcut = null;
    this.viewsPopupRemoveShortcut = null;
    this.viewsPopupPopupShortcut = null;
    this.viewsPopupTemplatesShortcut = null;
    //Programs
    //Devices
    this.devicePopupNewDeviceShortcut = null;
    this.devicePopupRemoveShortcut = null;
    this.devicePopupOpenShortcut = null;
    this.devicePopupAddShortcut = null;
    this.devicePopupPropertiesShortcut = null;
    this.devicePopupScanDeviceShortcut = null;
    //View
    this.viewPopupOpenShortcut = null;
    this.viewPopupRemoveShortcut = null;
    this.viewPopupEditModeShortcut = null;
    this.viewPopupInsertViewShortcut = null;
    this.viewPopupInsertFromControllerShortcut = null;
    this.viewPopupExportToFileShortcut = null;
    this.viewPopupImportFromFileShortcut = null;
    this.viewPopupCopyShortcut = null;
    this.viewPopupSetAsStartPageShortcut = null;
    this.viewPopupSetAsMobileStartPageShortcut = null;
    this.viewPopupPropertiesShortcut = null;

    this.clearElementList();

    //POPUPS
    this.networkPopup = null;
    this.serverPopup = null;
    this.systemPopup = null;
    this.subSystemPopup = null;
    this.viewsFolderPopup = null;
    this.programsFolderPopup = null;
    this.devicesFolderPopup = null;
    this.viewPopup = null;

    this.subscribedControllers = null;
    this.subscribedSystems = null;
    this.subscribedSubSystems = null;
    this.subscribedPvTrees = null;
    this.subscribedPvs = null;
    this.subscribedPrograms = null;

    Common.clearElement(AppBuilder2.current);
    AppBuilder2.current = null;
  }

  //-------------------------------------------------------------
  // add...
  //-------------------------------------------------------------
  addMainContainer() {
    //main container
    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.fontSize = "12px";
    this.container.style.overflowY = "clip";
  }

  addMessageContainer(parent) {
    //message container
    this.infoMessageContainer = document.createElement("div");
    this.infoMessageContainer.style.display = "none";
    this.infoMessageContainer.style.justifyContent = "center";
    this.infoMessageContainer.style.alignItems = "center";
    this.infoMessageContainer.style.padding = "8px";
    this.infoMessageContainer.style.fontSize = "14px";
    this.infoMessageContainer.style.position = "fixed";
    this.infoMessageContainer.style.bottom = "52px";
    this.infoMessageContainer.style.left = "26px";
    this.infoMessageContainer.style.backgroundColor = "#FFF";
    this.infoMessageContainer.style.color = "rgba(0, 0, 0, 0.87)";
    this.infoMessageContainer.style.border = "1px solid rgba(0, 0, 0, 0.16)";
    this.infoMessageContainer.style.borderRadius = "4px";
    const iconMessageContainer = document.createElement("div");
    iconMessageContainer.style.width = "24px";
    iconMessageContainer.style.height = "24px";
    iconMessageContainer.style.marginRight = "4px";
    iconMessageContainer.style.backgroundImage = `url('${AlertInfo}')`;
    const messageContent = document.createElement("p");
    messageContent.innerHTML = i18next.t("warning_message_import_PV");
    this.infoMessageContainer.appendChild(iconMessageContainer);
    this.infoMessageContainer.appendChild(messageContent);
    parent.appendChild(this.infoMessageContainer);
  }

  addTopContainer(parent) {
    //top container
    this.topContainer = document.createElement("div");
    this.topContainer.style.width = "100%";
    this.topContainer.style.height = "auto";
    parent.appendChild(this.topContainer);
  }

  addTopContainerContext(parent) {
    //search input
    if (this.SearchInput == null) {
      this.SearchInput = new Input({
        parent: parent,
        type: "string",
        onChange: this.onInputSearchChange.bind(this),
      });
    }

    this.SearchInput.container.style.width = "250px";
    this.SearchInput.container.style.cssFloat = "left";
    this.SearchInput.container.style.paddingBottom = "5px";
    this.SearchInput.input.placeholder = i18next.t("search");

    //type () select
    this.typeSelect = document.createElement("select");
    this.typeSelect.classList.add("pmp_css_select");
    this.typeSelect.style.cssFloat = "left";
    this.typeSelect.style.marginLeft = "10px";

    //change listener
    this.typeSelect.addEventListener("change", () => {
      this.searchTypesSelected = this.typeSelect.selectedIndex;
      this.searchTypesValue = parseInt(this.typeSelect.value);
    });

    parent.appendChild(this.typeSelect);
  }

  addHorizontalSpacer(parent) {
    const spacer = document.createElement("div");
    spacer.classList.add("pmp_css_appBuilder2_spacerHorizontal");
    parent.appendChild(spacer);
    return spacer;
  }

  addVerticalSpacer(parent) {
    const spacer = document.createElement("div");
    spacer.classList.add("pmp_css_appBuilder2_spacerVertical");
    parent.appendChild(spacer);
  }

  addMiddleContainer(parent) {
    this.middleContainer = document.createElement("div");
    this.middleContainer.style.width = "100%";
    this.middleContainer.style.marginTop = "5px";
    this.middleContainer.style.height = "100%";
    parent.appendChild(this.middleContainer);
  }

  addObjectTreeText(parent) {
    const treeText = document.createElement("p");
    treeText.classList.add("pmp_css_appBuilder2_objectTreeText");
    treeText.classList.add("pmp_css_fadedText");
    treeText.textContent = i18next.t("object_tree");
    parent.appendChild(treeText);
  }

  addObjectTreeContainer(parent) {
    this.objectTreeContainer = document.createElement("div");
    this.objectTreeContainer.classList.add("pmp_css_defaultText");
    this.objectTreeContainer.classList.add(
      "pmp_css_appBuilder2_objectTreeContainer"
    );
    parent.appendChild(this.objectTreeContainer);
  }

  addObjectContainerHeader(parent, textContent) {
    this.objectContentHeaderText = document.createElement("p");
    this.objectContentHeaderText.classList.add(
      "pmp_css_appBuilder2_objectTreeText"
    );
    this.objectContentHeaderText.classList.add("pmp_css_fadedText");
    this.objectContentHeaderText.textContent = textContent;
    parent.appendChild(this.objectContentHeaderText);

    this.addObjectContainerHeaderRightContainer(parent);
  }

  addObjectContainerHeaderRightContainer(parent) {
    const marginLeft = "2";
    const boxFlex1 = "1";

    const rightContainer = document.createElement("div");
    rightContainer.style.float = "right";
    rightContainer.style.display = "flex";

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("pmp_css_button");
    iconContainer.classList.add("pmp_css_table_rowHover");
    iconContainer.classList.add(
      "pmp_css_appBuilder2_ObjectContainerHeaderIcon"
    );
    iconContainer.style.backgroundImage = `url('${formatAlign}')`;
    iconContainer.style.boxFlex = boxFlex1;
    iconContainer.style.marginLeft = marginLeft;
    iconContainer.style.visibility = "hidden";

    iconContainer.addEventListener("click", this.togglePicker.bind(this));

    //append
    rightContainer.appendChild(iconContainer);

    parent.appendChild(rightContainer);
  }

  addObjectContainerFooterRightContainer(parent) {
    const margin = "4";
    const boxFlex1 = "1";
    const width = "70";

    const rightContainer = document.createElement("div");
    rightContainer.style.float = "right";
    rightContainer.style.display = "none";

    this.pickerContainer = document.createElement("div");
    this.pickerContainer.classList.add("pmp_css_button");
    this.pickerContainer.classList.add("pmp_css_table_rowHover");
    this.pickerContainer.style.boxFlex = boxFlex1;
    this.pickerContainer.style.margin = margin;
    this.pickerContainer.style.width = width;
    this.pickerContainer.textContent = i18next.t("choose");
    this.pickerContainer.style.pointerEvents = "none";
    this.pickerContainer.style.opacity = "0.4";

    const cancelButton = document.createElement("div");
    cancelButton.classList.add("pmp_css_button");
    cancelButton.classList.add("pmp_css_table_rowHover");
    cancelButton.style.boxFlex = boxFlex1;
    cancelButton.style.margin = margin;
    cancelButton.style.width = width;
    cancelButton.textContent = i18next.t("cancel");

    //click handler
    this.pickerContainer.addEventListener(
      "click",
      this.onOkPickerClick.bind(this)
    );
    cancelButton.addEventListener("click", this.onCancelPickerClick.bind(this));

    //append
    rightContainer.appendChild(cancelButton);
    rightContainer.appendChild(this.pickerContainer);
    parent.appendChild(rightContainer);

    return rightContainer;
  }

  addObjectContainerContent(parent) {
    this.objectContainerContent = document.createElement("div");
    this.objectContainerContent.classList.add("pmp_css_defaultText");
    //table for objects in selected folder
    if (this.objectsTable == null)
      this.objectsTable = new Table(this.objectContainer, this.tableConfig);

    this.objectsTable.table.style.fontSize = "12px";
    this.objectsTable.outerTableContainer.style.maxHeight = "calc(100% - 25px)";
    this.objectsTable.outerTableContainer.style.height = "calc(100% - 136px)";
    this.objectsTable.outerTableContainer.style.display = "none";
    parent.appendChild(this.objectContainerContent);
  }

  addObjectContainer(parent) {
    this.objectContainer = document.createElement("div");
    this.objectContainer.classList.add("pmp_css_appBuilder2_objectContainer");
    parent.appendChild(this.objectContainer);
  }

  changeObjectsTable(config) {
    Common.clearElement(this.objectsTable.tableHeader);

    this.objectsTable.Config = config;
    this.changeSearchInputTypes(config);
    //header
    this.objectsTable.tableHeader = this.objectsTable.table.createTHead();
    this.objectsTable.headerRow = this.objectsTable.tableHeader.insertRow(0);

    //add header cells
    for (let i = 0; i < this.objectsTable.Config.headers.length; i++)
      this.objectsTable.addHeaderCell(i);
  }

  changeSearchInputTypes(config) {
    if (typeof this.typeSelect === "undefined") return;

    for (let i = this.typeSelect.options.length; i > 0; --i) {
      this.typeSelect.remove(i - 1);
    }

    let option;
    //type options (depends on header)
    let length = config.headers.length;
    for (let i = 0; i < length; i++) {
      if (config.headers[i].name !== "") {
        option = document.createElement("option");
        option.text = config.headers[i].name;
        option.value = i;
        this.typeSelect.add(option);
      }
    }

    this.typeSelect.selectedIndex = this.searchTypesSelected;
  }

  //-------------------------------------------------------------
  //POPUPS
  //-------------------------------------------------------------
  addNetworkPopup() {
    const container = document.createElement("div");
    this.elementList.push(container);

    //"LDAP Settings"
    this.networkPopupLdapShortcut = this.addPopupElement(
      container,
      i18next.t("ldap_settings"),
      () => {
        this.networkPopup.hide();
        LdapSettingsDialog.open();
      }
    );
    if (this.networkPopup == null)
      this.networkPopup = new PVPanel(0, 0, container, this.container);
  }

  addServerPopup() {
    const container = document.createElement("div");
    this.elementList.push(container);

    //"Rename"
    this.serversPopupRenameShortcut = this.addPopupElement(
      container,
      i18next.t("rename"),
      () => {
        this.serverPopup.hide();
        Dialog.prompt({
          title: i18next.t("rename"),
          message: i18next.t("name"),
          value: this.currentTarget.name,
          forceAnswer: true,
          onConfirm: (name) => {
            this.communicator.sendRenameController(
              name,
              this.currentTarget.uuid
            );
          },
        });
      },
      true
    );

    //"Insert system"
    this.serversPopupInsertSystemShortcut = this.addPopupElement(
      container,
      i18next.t("insert") + " " + i18next.t("system"),
      () => {
        this.serverPopup.hide();
        Dialog.prompt({
          title: i18next.t("new_system"),
          message: i18next.t("name"),
          value: "",
          forceAnswer: true,
          onConfirm: (name) => {
            this.communicator.sendAddFolder(
              name,
              this.currentTarget.uuid,
              this.currentTarget.uuid
            );
          },
        });
      }
    );

    //"Backup and restore
    this.serversPopupBackupAndRestoreShortcut = this.addPopupElement(
      container,
      i18next.t("backup_and_restore") + "...",
      () => {
        this.serverPopup.hide();
        Dialog.open("BACKUP_RESTORE", {
          componentProps: {
            chainId: this.currentTarget.uuid,
            onClose: () => {
              Dialog.close("BACKUP_RESTORE");
            },
          },
        });
      }
    );

    this.serversPopupTunnelSettingsShortcut = this.addPopupElement(
      container,
      `${i18next.t("tunnel_settings")}...`,
      () => {
        this.serverPopup.hide();
        Dialog.open("TUNNEL_SETTINGS", {
          componentProps: {
            chainId: this.currentTarget.uuid,
            onClose: () => {
              Dialog.close("TUNNEL_SETTINGS");
            },
          },
        });
      }
    );

    //Network settings
    this.serversPopupNetworkSettingsShortcut = this.addPopupElement(
      container,
      "Network settings...",
      () => {
        this.serverPopup.hide();
        const { uuid: chainId } = this.currentTarget;
        const refKey = "NETWORK_SETTINGS_DIALOG";
        Dialog.open(refKey, {
          componentProps: {
            chainId,
            closeMySelf: () => Dialog.close(refKey),
          },
        });
      }
    );

    if (this.serverPopup == null)
      this.serverPopup = new PVPanel(0, 0, container, this.container);
  }

  addSystemPopup() {
    const container = document.createElement("div");
    this.elementList.push(container);

    //"Insert subsystem"
    this.systemsPopupInsertSubSystemShortcut = this.addPopupElement(
      container,
      i18next.t("insert") + " " + i18next.t("sub_system"),
      () => {
        this.serverPopup.hide();
        const chainId =
          Store.getState().system[this.currentTarget.uuid].chainID;
        Dialog.prompt({
          title: i18next.t("new_sub_system"),
          message: i18next.t("name"),
          value: "",
          forceAnswer: true,
          onConfirm: (name) => {
            this.communicator.sendAddSubSystem(
              name,
              this.currentTarget.uuid,
              chainId
            );
            this.communicator.sendGetControllerList();
          },
        });
      }
    );

    //"Rename system"
    this.systemsPopupRenameSystemShortcut = this.addPopupElement(
      container,
      i18next.t("rename"),
      () => {
        this.serverPopup.hide();
        let state = Store.getState().system[this.currentTarget.uuid];
        Dialog.prompt({
          title: i18next.t("rename"),
          message: i18next.t("name"),
          value: this.currentTarget.name,
          forceAnswer: true,
          onConfirm: (name) => {
            this.currentTarget.folderName.textContent = name;
            this.currentTarget.name = name;
            this.communicator.sendRenameFolder(
              name,
              state.systemID,
              state.chainID
            );
          },
        });
      }
    );

    //"Remove system"
    this.systemsPopupRemoveSystemShortcut = this.addPopupElement(
      container,
      i18next.t("remove"),
      () => {
        this.serverPopup.hide();
        const system = Store.getState().system[this.currentTarget.uuid];
        Dialog.prompt({
          title: i18next.t("remove"),
          message: i18next.t(
            "appBuilder.are_you_sure_you_want_to_delete_system_x",
            {
              x: system.name,
            }
          ),
          forceAnswer: true,
          onConfirm: () => {
            this.communicator.sendRemoveFolder(
              system.name,
              system.systemID,
              system.chainID
            );
          },
        });
      }
    );

    if (this.systemPopup == null)
      this.systemPopup = new PVPanel(0, 0, container, this.container);
  }

  addSubSystemPopup() {
    const container = document.createElement("div");
    this.elementList.push(container);

    //"Rename subsystem"
    this.subSystemsPopupRenameSubSystemShortcut = this.addPopupElement(
      container,
      i18next.t("rename"),
      () => {
        this.subSystemPopup.hide();
        const subsys = Store.getState().subsystem[this.currentTarget.uuid];
        Dialog.prompt({
          title: i18next.t("rename"),
          message: i18next.t("name"),
          value: subsys.description,
          forceAnswer: true,
          onConfirm: (name) => {
            this.communicator.sendRenameSubSustem(
              name,
              subsys.uuid,
              subsys.chainID
            );
          },
        });
      }
    );

    //"Update subsystem information"
    this.subSystemsPopupUpdateSubSystemInformation = this.addPopupElement(
      container,
      i18next.t("settings"),
      () => {
        this.subSystemPopup.hide();
        const subsys = Store.getState().subsystem[this.currentTarget.uuid];
        const parents = this.getParents(this.currentTarget);

        this.communicator.sendGetControllerList();
        const controllerId = parents[this.CONTROLLER];
        const controller = Store.getState().controller[controllerId];
        // Get information about the subsystem
        CliComs.send({
          type: "getBuildingInformation",
          payload: {
            subsystem: subsys.uuid,
          },
          callback: (data) => {
            Dialog.open("FACILITY_DIALOG", {
              componentProps: {
                controller: { ...controller, id: controllerId },
                subsystem: subsys,
                data,
                onSave: (item) => {
                  CliComs.send({
                    type: "setBuildingInformation",
                    payload: { ...item, subsystem: subsys.uuid },
                    callback: () => {
                      Dialog.close("FACILITY_DIALOG");
                    },
                  });
                },
              },
            });
          },
        });
      }
    );

    this.subSystemsPopupAddPVToSubSystem = this.addPopupElement(
      container,
      i18next.t("generate_views"),
      () => {
        this.subSystemPopup.hide();
        const subsys = Store.getState().subsystem[this.currentTarget.uuid];
        const subSystemId = subsys.uuid;
        const chainId = subsys.chainID;
        Dialog.open("GENERATE_PROCESS_VIEWS", {
          componentProps: { subSystemId, chainId },
        });
      }
    );

    //"Remove subsystem"
    this.subSystemsPopupRemoveSubSystemShortcut = this.addPopupElement(
      container,
      i18next.t("remove"),
      () => {
        this.subSystemPopup.hide();
        const subsys = Store.getState().subsystem[this.currentTarget.uuid];
        Dialog.prompt({
          title: i18next.t("remove"),
          message: i18next.t(
            "appBuilder.are_you_sure_you_want_to_delete_subsystem_x",
            {
              x: subsys.description,
            }
          ),
          forceAnswer: true,
          onConfirm: () => {
            this.communicator.sendRemoveSubSustem(
              subsys.description,
              subsys.uuid,
              subsys.systemID,
              subsys.chainID
            );
          },
        });
      }
    );

    if (this.subSystemPopup == null)
      this.subSystemPopup = new PVPanel(0, 0, container, this.container);
  }

  addViewsFolderPopup() {
    var _this = this;
    const container = document.createElement("div");
    this.elementList.push(container);

    //"Insert"
    this.viewsPopupInsertViewsShortcut = this.addPopupElement(
      container,
      i18next.t("insert") + "...",
      () => {
        this.viewsFolderPopup.hide();
        const path = this.getPath(this.currentTarget);
        const parents = this.getParents(this.currentTarget);
        OpenDialog(
          InsertPvComp,
          {
            title: i18next.t("new_process_view"),
            onClick: (obj) => {
              obj.chain = parents[this.CONTROLLER];
              obj.uuid = parents[this.SUBSYSTEM];
              obj.path = path;
              this.communicator.sendAddPv(obj);
            },
          },
          {
            width: 300,
            modal: true,
          }
        );
      }
    );

    //"Insert from controller"
    this.viewsPopupInsertFromControllerShortcut = this.addPopupElement(
      container,
      `${i18next.t("insert_from_controller")} ...`,
      () => {
        this.viewsFolderPopup.hide();
        const path = this.getPath(this.currentTarget);
        const parents = this.getParents(this.currentTarget);
        insertFromController(otherStore, { path, parents }, (ret) => {
          const pvID = Object.keys(ret)[0];
          this.communicator.sendGetPvsBasicsCallbackAndMessageHandler(
            () => {},
            ret.chainId,
            ret[pvID].subSystem,
            [],
            [],
            true
          );
        });
      }
    );

    //"Import from file ..."
    this.viewsPopupImportFromFileShortcut = this.addPopupElement(
      container,
      `${i18next.t("import_from_file")} ...`,
      () => {
        this.viewsFolderPopup.hide();
        const path = this.getPath(this.currentTarget);
        const parents = this.getParents(this.currentTarget);
        OpenDialog(
          ImportComp,
          {
            title: `${i18next.t("import_from_file")} ...`,
            onClick: (d) => {
              let obj = { ...d };
              obj.chain = parents[this.CONTROLLER];
              obj.uuid = parents[this.SUBSYSTEM];
              obj.path = path;
              obj.facility = "";
              obj.thumbnail = "";
              const templateId = d?.content?.template?.uuid;
              if (!templateId) {
                this.communicator.sendAddPv(obj);
              } else {
                CliComs.promiseSend({
                  type: "template_get",
                  payload: {
                    chainId: parents[this.CONTROLLER],
                    uuid: templateId,
                  },
                  timeout: 30000,
                }).then((data) => {
                  if (data?.length !== 1) {
                    delete obj?.content?.template;
                    this.infoMessageContainer.style.display = "flex";
                    setTimeout(() => {
                      this.infoMessageContainer.style.display = "none";
                    }, 5000);
                  }
                  this.communicator.sendAddPv(obj);
                });
              }
            },
          },
          {
            width: 300,
            modal: true,
            minHeight: 130,
          }
        );
      }
    );

    //"Add folder"
    this.viewsPopupAddFolderShortcut = this.addPopupElement(
      container,
      i18next.t("add_folder"),
      () => {
        this.viewsFolderPopup.hide();
        Dialog.prompt({
          title: i18next.t("add_folder"),
          message: i18next.t("name"),
          value: "",
          forceAnswer: true,
          onConfirm: (name) => {
            this.createPVFolder.call(this, name);
          },
        });
      }
    );

    //"Rename folder"
    this.viewsPopupRenameFolderShortcut = this.addPopupElement(
      container,
      i18next.t("rename_folder"),
      () => {
        this.viewsFolderPopup.hide();
        Dialog.prompt({
          title: i18next.t("rename"),
          message: i18next.t("name"),
          value: this.currentTarget.name,
          forceAnswer: true,
          onConfirm: (name) => {
            this.currentTarget.folderName.textContent = name;
            this.currentTarget.name = name;
            this.buildPVTree();
          },
        });
      }
    );

    //"Remove folder"
    this.viewsPopupRemoveShortcut = this.addPopupElement(
      container,
      i18next.t("delete_folder"),
      () => {
        this.viewsFolderPopup.hide();
        //non-empty folder
        if (this.currentTarget.nextSibling.childNodes.length > 0) {
          Dialog.alert({
            title: i18next.t("delete_folder"),
            message: i18next.t("appBuilder.folder_must_be_empty"),
          });
        }
        //empty folder
        else {
          const parents = this.getParents(this.currentTarget);
          const view = this.getSpecificFolder(parents[this.SUBSYSTEM], "view");
          //remove subcontainer
          this.currentTarget.nextSibling.parentNode.removeChild(
            this.currentTarget.nextSibling
          );
          //remove folder entry
          this.currentTarget.parentNode.removeChild(this.currentTarget);
          this.currentTarget = view.parentFolder;
          this.selectedTargetId = this.currentTarget.id;
          this.buildPVTree();
        }
      }
    );

    //"Popups"
    this.viewsPopupPopupShortcut = this.addPopupElement(
      container,
      i18next.t("popup_plural") + "...",
      function () {
        _this.viewsFolderPopup.hide();
        const parents = _this.getParents(_this.currentTarget);
        Dialog.open("POPUP_TEMPLATE", {
          title: i18next.t("popup_plural"),
          componentProps: {
            open: true,
            title: i18next.t("popup_plural"),
            maxWidth: "md", //lg","md","sm","xl","xs",false,
            type: "popup",
            chainID: parents[_this.CONTROLLER],
            subSystemID: parents[_this.SUBSYSTEM],
            onClose: () => {
              Dialog.close("POPUP_TEMPLATE");
            },
          },
        });
      }
    );

    //"Templates"
    this.viewsPopupTemplatesShortcut = this.addPopupElement(
      container,
      i18next.t("template_plural") + "...",
      function () {
        _this.viewsFolderPopup.hide();
        const parents = _this.getParents(_this.currentTarget);
        Dialog.open("POPUP_TEMPLATE", {
          title: i18next.t("template_plural"),
          componentProps: {
            open: true,
            title: i18next.t("template_plural"),
            maxWidth: "md", //lg","md","sm","xl","xs",false,
            type: "template",
            chainID: parents[_this.CONTROLLER],
            subSystemID: parents[_this.SUBSYSTEM],
            onClose: () => {
              Dialog.close("POPUP_TEMPLATE");
            },
          },
        });
      }
    );

    if (this.viewsFolderPopup == null)
      this.viewsFolderPopup = new PVPanel(0, 0, container, this.container);
  }

  addProgramsFolderPopup() {
    const container = document.createElement("div");
    this.elementList.push(container);

    if (this.programsFolderPopup == null)
      this.programsFolderPopup = new PVPanel(0, 0, container, this.container);
  }

  addDeviceFolderPopup() {
    const container = document.createElement("div");
    this.elementList.push(container);

    //New device..."
    this.devicePopupNewDeviceShortcut = this.addPopupElement(
      container,
      i18next.t("new_device") + "...",
      () => {
        this.devicesFolderPopup.hide();
        const parents = this.getParents(this.currentTarget);
        const chainId = parents[this.CONTROLLER];
        const subSystemId = parents[this.SUBSYSTEM];
        const refKey = "NEW_DEVICE_WIZARD";
        Dialog.open(refKey, {
          title: i18next.t("new_device_wizard"),
          componentProps: {
            chainId,
            subSystemId,
            closeMySelf: () => Dialog.close(refKey),
          },
        });
      },
      true
    );

    // Main Device Wizard => Will be used after all wizards are moved over

    // this.devicePopupNewDeviceShortcut = this.addPopupElement(
    // 	container,
    // 	i18next.t("Add OPC-UA device") + "...",
    // 	() => {
    // 		this.devicesFolderPopup.hide();
    // 		const parents = this.getParents(this.currentTarget);
    // 		const chainId = parents[this.CONTROLLER];
    // 		const subSystemId = parents[this.SUBSYSTEM];
    // 		const refKey = "MAIN_DEVICE_WIZARD";
    // 		Dialog.open(refKey, {
    // 			title: "Main Device Wizard",
    // 			componentProps: {
    // 				chainId,
    // 				subSystemId,
    // 				dialogRefKey: refKey,
    // 			},
    // 		});
    // 	},
    // 	true
    // );

    if (this.devicesFolderPopup == null)
      this.devicesFolderPopup = new PVPanel(0, 0, container, this.container);
  }

  /**
   * add the popup for the element's with type "pv"
   */
  addViewPopup() {
    const container = document.createElement("div");
    this.elementList.push(container);

    //"Open"
    this.viewPopupOpenShortcut = this.addPopupElement(
      container,
      i18next.t("open"),
      () => {
        this.viewPopup.hide();
        const pv = Store.getState().pv[this.currentTarget.uuid];
        // We should merge these two
        openView(pv.chainID, pv.uuid, "pv");
      },
      true
    );

    //"Edit" or "Exit edit mode", depending on the situation
    this.viewPopupEditModeShortcut = this.addPopupElement(
      container,
      i18next.t("edit"),
      () => {
        this.viewPopup.hide();
        const pv = Store.getState().pv[this.currentTarget.uuid];
        // We should merge these two VIEW_OPEN
        openView(pv.chainID, pv.uuid, "pv", true);
      }
    );

    //"Insert"
    this.viewPopupInsertViewShortcut = this.addPopupElement(
      container,
      i18next.t("insert") + "...",
      () => {
        this.viewPopup.hide();
        const path = this.getPath(this.currentTarget);
        const parents = this.getParents(this.currentTarget);
        OpenDialog(
          InsertPvComp,
          {
            title: i18next.t("new_process_view"),
            onClick: (obj) => {
              obj.chain = parents[this.CONTROLLER];
              obj.uuid = parents[this.SUBSYSTEM];
              obj.path = path;
              this.communicator.sendAddPv(obj);
            },
          },
          {
            width: 300,
            modal: true,
          }
        );

        if (this.currentTarget.name !== "Views")
          this.currentTarget = this.currentTarget.parentNode.parentFolder;
      }
    );

    //"Insert from controller"
    this.viewPopupInsertFromControllerShortcut = this.addPopupElement(
      container,
      `${i18next.t("insert_from_controller")} ...`,
      () => {
        this.viewPopup.hide();
        const path = this.getPath(this.currentTarget);
        const parents = this.getParents(this.currentTarget);
        insertFromController(otherStore, { path, parents }, (ret) => {
          this.communicator.sendGetPvsBasicsCallbackAndMessageHandler(
            () => {},
            ret.msgData.chain,
            ret.msgData.subSystem,
            [],
            [],
            true
          );
        });
      }
    );

    //"Remove"
    this.viewPopupRemoveShortcut = this.addPopupElement(
      container,
      i18next.t("remove"),
      () => {
        this.viewPopup.hide();
        let name = this.currentTarget.name;
        let target = this.currentTarget;
        const pv = Store.getState().pv[this.currentTarget.uuid];
        Dialog.prompt({
          title: i18next.t("delete_process_view"),
          message: i18next.t(
            "appBuilder.are_you_sure_you_want_to_delete_process_view_x",
            {
              x: name,
            }
          ),
          forceAnswer: true,
          onConfirm: () => {
            let parentTarget = target.parentNode.parentFolder;
            this.communicator.sendRemovePv({
              chain: pv.chainID,
              subSystemUuid: pv.subSystemID,
              uuid: pv.uuid,
              name: pv.name,
            });
            this.currentTarget = parentTarget;
            this.selectedTargetId = parentTarget.uuid;
          },
        });
      }
    );

    //"Export to file ..."
    this.viewPopupExportToFileShortcut = this.addPopupElement(
      container,
      `${i18next.t("export_to_file")} ...`,
      () => {
        this.viewPopup.hide();
        let uuids = [];
        const pv = Store.getState().pv[this.currentTarget.uuid];
        uuids.push(this.currentTarget.uuid);
        this.communicator.sendToComsCallback(
          "pvs_getPvs",
          this.communicator.createGetPvsSendObject(
            pv.chainID,
            pv.subSystemID,
            uuids,
            /* sort */ [],
            /* triggerTree */ false,
            /* skipContent */ false,
            /* skipThumbnail */ true
          ),
          (recData) => {
            if (recData.data.length > 0) {
              OpenDialog(
                ExportComp,
                {
                  title: `${i18next.t("export_to_file")} ...`,
                  onClick: (d) => {
                    Common.localDownload(
                      JSON.stringify(d),
                      d.name + ".pv",
                      "application/json"
                    );
                  },
                  data: recData.data[0],
                },
                {
                  width: 300,
                  modal: true,
                  minHeight: 130,
                }
              );
            }
          }
        );
      }
    );

    //"Import from file ..."
    this.viewPopupImportFromFileShortcut = this.addPopupElement(
      container,
      `${i18next.t("import_from_file")} ...`,
      () => {
        this.viewPopup.hide();
        const path = this.getPath(this.currentTarget);
        // here we have to use getParents, because we can also select a folder
        // and this will not work with the Store.getSate()...
        const parents = this.getParents(this.currentTarget);
        OpenDialog(
          ImportComp,
          {
            title: `${i18next.t("import_from_file")} ...`,
            onClick: (d) => {
              let obj = { ...d };
              obj.chain = parents[this.CONTROLLER];
              obj.uuid = parents[this.SUBSYSTEM];
              obj.path = path;
              obj.facility = "";
              obj.thumbnail = "";
              const templateId = d?.content?.template?.uuid;
              if (!templateId) {
                this.communicator.sendAddPv(obj);
              } else {
                CliComs.promiseSend({
                  type: "template_get",
                  payload: {
                    chainId: parents[this.CONTROLLER],
                    uuid: templateId,
                  },
                  timeout: 30000,
                }).then((data) => {
                  if (data?.length !== 1) {
                    delete obj?.content?.template;
                    this.infoMessageContainer.style.display = "flex";
                    setTimeout(() => {
                      this.infoMessageContainer.style.display = "none";
                    }, 5000);
                  }
                  this.communicator.sendAddPv(obj);
                });
              }
            },
          },
          {
            width: 300,
            modal: true,
            minHeight: 130,
          }
        );
      }
    );

    //"Copy"
    this.viewPopupCopyShortcut = this.addPopupElement(
      container,
      i18next.t("copy") + "...",
      () => {
        this.viewPopup.hide();
        const path = this.getPath(this.currentTarget);
        OpenDialog(
          CopyPvComp,
          {
            title: i18next.t("copy"),
            onClick: (obj) => {
              this.communicator.sendCopyPv(obj);
            },
            ...Store.getState().pv[this.currentTarget.uuid],
            path: path,
          },
          {
            width: 300,
            modal: true,
          }
        );

        if (this.currentTarget.name !== "Views")
          this.currentTarget = this.currentTarget.parentNode.parentFolder;
      }
    );

    //"Set as start page"
    this.viewPopupSetAsStartPageShortcut = this.addPopupElement(
      container,
      i18next.t("set_as_start_page"),
      () => {
        this.viewPopup.hide();
        const pv = Store.getState().pv[this.currentTarget.uuid];
        this.communicator.sendSetStartPage(pv.chainID, pv.uuid, "desktop");
      }
    );

    //"Set as mobile start page"
    this.viewPopupSetAsMobileStartPageShortcut = this.addPopupElement(
      container,
      i18next.t("set_as_mobile_start_page"),
      () => {
        this.viewPopup.hide();
        const pv = Store.getState().pv[this.currentTarget.uuid];
        this.communicator.sendSetStartPage(pv.chainID, pv.uuid, "mobile");
      }
    );

    //"Properties"
    this.viewPopupPropertiesShortcut = this.addPopupElement(
      container,
      i18next.t("property_plural") + "...",
      () => {
        this.viewPopup.hide();
        OpenDialog(
          PropertiesPvComp,
          {
            title: i18next.t("property_plural"),
            onClick: (obj) => {
              this.communicator.sendSetPv(obj);
            },
            ...Store.getState().pv[this.currentTarget.uuid],
          },
          {
            width: 300,
            modal: true,
          }
        );
      }
    );

    if (this.viewPopup == null)
      this.viewPopup = new PVPanel(0, 0, container, this.container);
  }

  /**
   * add the popup for the element's with type "device"
   */
  addDevicePopup() {
    const container = document.createElement("div");
    this.elementList.push(container);

    //"Open"
    this.devicePopupOpenShortcut = this.addPopupElement(
      container,
      i18next.t("open"),
      () => {
        this.devicePopup.hide();
        const device = Store.getState().device[this.currentTarget.uuid];
        // BACnet
        if (device.content.serverType === IoTypes[0]) {
          const refKey = "DATAPOINTS_DIALOG";
          Dialog.open(refKey, {
            title: i18next.t("edit_device"),
            componentProps: {
              chainId: device?.chainID,
              uuid: device.content.uuid,
              type: device.content.serverType,
              deviceName: device.content.deviceName,
              deviceId: device.content.options.devices[0],
              closeMySelf: () => Dialog.close(refKey),
            },
          });
        }
        // Modbus
        else if (
          device.content.serverType === IoTypes[1] ||
          device.content.serverType === IoTypes[2]
        ) {
          Dialog.open("REGISTER_SETTINGS", {
            title: `${device.content.serverType} registers for device  ${device.content.deviceName}`,
            componentProps: {
              chainId: device.chainID,
              uuid: device.content.uuid,
              name: device.content.deviceName,
              properties: [],
              state: "all",
              sort: [],
              type: device.content.serverType,
              onClose: () => {
                Dialog.close("REGISTER_SETTINGS");
              },
            },
          });
        }

        // OpcUa
        if (device.content.serverType === IoTypes[4]) {
          Dialog.open("OPCUA_BROWSE_NODES", {
            componentProps: {
              chainId: device.chainID,
              uuid: device.content.uuid,
              name: device.content.deviceName,
              subSystemId: device.subSystemID,
              deviceData: device.content,
              dialogRefKey: "OPCUA_BROWSE_NODES",
              onClose: () => {
                Dialog.close("OPCUA_BROWSE_NODES");
              },
            },
          });
        }
        // EMSystemer
        else if (device.content.serverType === IoTypes[3]) {
          Dialog.open("EMSYSTEMS_DATAPOINTS_DIALOG", {
            title: `${device.content.serverType} registers for device  ${device.content.deviceName}`,
            componentProps: {
              chainId: device.chainID,
              deviceId: device.content.uuid,
              name: device.content.deviceName,
              properties: [],
              onClose: () => {
                Dialog.close("EMSYSTEMS_DATAPOINTS_DIALOG");
              },
            },
          });
        }
      }
    );

    //"Add"
    this.devicePopupAddShortcut = this.addPopupElement(
      container,
      i18next.t("add"),
      () => {
        this.devicePopup.hide();
        const device = Store.getState().device[this.currentTarget.uuid];
        // BACnet
        if (device.content.serverType === IoTypes[0])
          Dialog.open("BACNET_DEVICE", {
            componentProps: {
              chainId: Network.localController.chainId,
              uuid: this.currentTarget.uuid,
              name: device.content.deviceName,
              type: RegisterState.INACTIVE,
              onClose: () => {
                Dialog.close("BACNET_DEVICE");
              },
            },
          });
        // Modbus
        else if (
          device.content.serverType === IoTypes[1] ||
          device.content.serverType === IoTypes[2] ||
          device.content.serverType === IoTypes[3]
        ) {
          Dialog.open("REGISTER_SETTINGS", {
            title: `${device.content.serverType} registers for device  ${device.content.deviceName}`,
            componentProps: {
              chainId: device.chainID,
              uuid: device.content.uuid,
              name: device.content.deviceName,
              properties: [],
              state: "all",
              sort: [], //"id","ASC"
              type: device.content.serverType,
              onClose: () => {
                Dialog.close("REGISTER_SETTINGS");
              },
            },
          });
        }
      }
    );

    //"Remove"
    this.devicePopupRemoveShortcut = this.addPopupElement(
      container,
      i18next.t("remove"),
      () => {
        this.devicePopup.hide();
        const device = Store.getState().device[this.currentTarget.uuid];

        const onConfirm = async () => {
          this.selectedTargetId = device.subSystemID;

          // OPC-UA uses own topic for handling
          // Has to to with how native handles this.
          // Should be common for all devices

          if (device.content.serverType === IoTypes[4]) {
            const res = this.communicator.removeOpcUaDevice(device);
            snack.info(res);
            return;
          }

          this.communicator.sendRemoveDevice(
            device.chainID,
            device.subSystemID,
            device.content.uuid
          );
        };

        Dialog.prompt({
          title: i18next.t("delete"),
          message: i18next.t("appBuilder.delete_x", {
            x: device.content.deviceName,
          }),
          forceAnswer: true,
          onConfirm,
        });
      }
    );

    //"Properties"
    this.devicePopupPropertiesShortcut = this.addPopupElement(
      container,
      i18next.t("property_plural"),
      () => {
        this.devicePopup.hide();
        const device = Store.getState().device[this.currentTarget.uuid];

        switch (device.content.serverType) {
          // BACnet
          case IoTypes[0]: {
            const refKey = "UPDATE_DEVICE_WIZARD";
            Dialog.open(refKey, {
              title: i18next.t("update_device_wizard"),
              componentProps: {
                chainId: device?.chainID,
                subSystemId: device?.subSystemID,
                deviceDetail: device?.content,
                closeMySelf: () => Dialog.close(refKey),
              },
            });
            break;
          }
          // Modbus
          case IoTypes[1]: {
            Dialog.open("RTU_DEVICE_SETTINGS", {
              componentProps: {
                chainId: device.chainID,
                subSystemId: device.subSystemID,
                content: device.content,
                onClose: () => {
                  Dialog.close("RTU_DEVICE_SETTINGS");
                },
              },
            });
            break;
          }
          case IoTypes[2]: {
            Dialog.open("TCP_DEVICE_SETTINGS", {
              componentProps: {
                chainId: device.chainID,
                subSystemId: device.subSystemID,
                uuid: device.content.uuid,
                name: device.content.deviceName,
                type: device.content.serverType,
                sortedBy: "deviceName",
                onClose: () => {
                  Dialog.close("DEVICE_SETTINGS");
                },
              },
            });
            break;
          }
          // EMSystems
          case IoTypes[3]: {
            const portal = device.content.ipAddress.includes("/")
              ? true
              : false;
            const refKey = "EMSYSTEM_DEVICE_SETTINGS";
            Dialog.open(refKey, {
              componentProps: {
                chainId: device.chainID,
                deviceId: device.content.uuid,
                deviceName: device.content.deviceName,
                description: device.content.description,
                ipAddress: device.content.ipAddress,
                buildingKey:
                  portal === true
                    ? device.content.options?.buildingKey
                    : undefined,
                apiKey:
                  portal === true ? device.content.options?.apiKey : undefined,
                port: device.content.port,
                endPoint: DEFAULT_LOCAL_EMSYSTEMS_ENDPOINT,
                portal: portal,
                onClose: () => {
                  Dialog.close(refKey);
                },
              },
            });
            break;
          }

          // OpcUa
          case IoTypes[4]: {
            Dialog.open("OPCUA_DEVICE_PROPERTIES", {
              componentProps: {
                chainId: device.chainID,
                subSystemId: device.subSystemID,
                deviceData: device.content,
                dialogRefKey: "OPCUA_DEVICE_PROPERTIES",
                onClose: () => {
                  Dialog.close("OPCUA_DEVICE_PROPERTIES");
                },
              },
            });
            break;
          }

          default: {
            Dialog.alert({
              message: `Properties for '${
                device.content.serverType
              }' devices not yet supported.
							${
                includes(IoTypesToSupport, device.content.serverType)
                  ? "Support is planned."
                  : "Request support!"
              }`,
            });
            break;
          }
        }
      }
    );

    //Scan Device
    this.devicePopupScanDeviceShortcut = this.addPopupElement(
      container,
      i18next.t("rescan"),
      () => {
        this.devicePopup.hide();
        const device = Store.getState().device[this.currentTarget.uuid];

        if (device.content.serverType === IoTypes[3]) {
          Dialog.prompt({
            title: i18next.t("rescan"),
            message: i18next.t("appBuilder.rescan_x", {
              x: device.content.deviceName,
            }),
            forceAnswer: true,
            onConfirm: () => {
              this.communicator.sendRescanDevice(
                device.chainID,
                device.subSystemID,
                device.content.uuid,
                "EMSystems"
              );
              this.selectedTargetId = device.subSystemID;
            },
          });
        }

        /* if (device.content.serverType === IoTypes[0] && device.content.status === 1) {
					// 1 is online
					Dialog.open("BACNET_DEVICE", {
						componentProps: {
							chainId: Network.localController.chainId,
							uuid: this.currentTarget.uuid,
							name: device.content.deviceName,
							type: RegisterState.RESCAN,
							onClose: () => {
								Dialog.close("BACNET_DEVICE");
							},
						},
					});
				} */
      }
    );

    if (this.devicePopup == null)
      this.devicePopup = new PVPanel(0, 0, container, this.container);
  }

  getPath(currentTarget) {
    const parents = this.getParents(currentTarget);
    let path = "";

    if (this.VIEWS_CONTENT < parents.length) path = parents[parents.length - 1];

    console.warn("================== PATH =====================");
    console.warn(path);
    return path;
  }

  addPopupElement(parent, name, onClick, dontSeparate) {
    var element = document.createElement("p");
    this.elementList.push(element);
    element.classList.add("pmp_css_pv_pvPanel_textSmall");

    if (!dontSeparate) element.classList.add("pmp_css_pv_pvPanel_separatorTop");
    element.textContent = name;

    //click handler, if applicable
    if (typeof onClick === "function") {
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();
        onClick(event);
      });
    }

    parent.appendChild(element);
    return element;
  }

  //-------------------------------------------------------------
  // on...
  //-------------------------------------------------------------

  onDialogClose() {
    this.destroy();
  }

  onInputSearchChange(value) {
    this.tableCells.forEach((row) => {
      if (row[this.searchTypesValue].textContent.lastIndexOf(value, 0) === 0) {
        row[this.searchTypesValue].parentNode.style.display = "";
      } else {
        row[this.searchTypesValue].parentNode.style.display = "none";
      }
    });
  }

  onOkPickerClick() {
    if (
      typeof this.currentTableTarget !== "undefined" &&
      this.currentTableTarget != null &&
      typeof this.currentTableTarget.uuid !== "undefined"
    ) {
      const state = Store.getState();
      if (this.currentTableTarget.type === "program") {
        const chainID = state.program[this.currentTableTarget.uuid].chainID;
        const subSystemID =
          state.program[this.currentTableTarget.uuid].subSystemID;
        const systemID = state.subsystem[subSystemID].systemID;
        this.config.onOk({
          type: this.currentTableTarget.type,
          chainID: chainID,
          systemID: systemID,
          subSystemID: state.program[this.currentTableTarget.uuid].subSystemID,
          uuid: this.currentTableTarget.uuid,
          name: state.program[this.currentTableTarget.uuid].content.name,
          machinePath:
            "/controllers/" +
            chainID +
            "/systems/" +
            systemID +
            "/subsystems/" +
            state.program[this.currentTableTarget.uuid].subSystemID +
            "/programs/" +
            this.currentTableTarget.uuid,
        });
      } else if (this.currentTableTarget.type === "device") {
        const chainID = state.device[this.currentTableTarget.uuid].chainID;
        const subSystemID =
          state.device[this.currentTableTarget.uuid].subSystemID;
        const systemID = state.subsystem[subSystemID].systemID;
        this.config.onOk({
          type: this.currentTableTarget.type,
          chainID: chainID,
          subSystemID: state.device[this.currentTableTarget.uuid].subSystemID,
          uuid: this.currentTableTarget.uuid,
          name: state.device[this.currentTableTarget.uuid].content.deviceName,
          machinePath:
            "/controllers/" +
            chainID +
            "/systems/" +
            systemID +
            "/subsystems/" +
            state.device[this.currentTableTarget.uuid].subSystemID +
            "/devices/" +
            this.currentTableTarget.uuid,
        });
      } else if (this.currentTableTarget.type === "folder") {
        /* Remove last selected folder from the path,
         * because it will be set in the name
         * and prevent it to producing duplicate `path item` */
        const paths = this.objectContentHeaderText.textContent.split("/");
        paths.splice(paths.length - 2, 1);
        const path = paths.join("/");

        this.config.onOk({
          type: this.currentTableTarget.type,
          chainID: this.currentRealIdPath[this.CONTROLLER],
          systemID: this.currentRealIdPath[this.SYSTEM],
          subSystemID: this.currentRealIdPath[this.SUBSYSTEM],
          uuid: this.currentTableTarget.uuid,
          name: this.currentTableTarget.childNodes[1].textContent,
          uuidPath: this.currentPvTreeIdPath,
          path: path,
          machinePath: this.getMachinePath(
            this.currentRealIdPath,
            this.currentTableTarget.uuid,
            "folder"
          ),
        });
      } else if (this.currentTableTarget.type === "controller") {
        this.config.onOk({
          type: this.currentTableTarget.type,
          chainID: this.currentTableTarget.uuid,
          uuid: this.currentTableTarget.uuid,
          name: state.controller[this.currentTableTarget.uuid].name,
          uuidPath: this.currentPvTreeIdPath,
          path: this.objectContentHeaderText.textContent,
          machinePath: "/controllers/" + this.currentTableTarget.uuid,
        });
      } else if (this.currentTableTarget.type === "system") {
        const chainID = state.system[this.currentTableTarget.uuid].chainID;
        this.config.onOk({
          type: this.currentTableTarget.type,
          chainID: chainID,
          systemID: this.currentTableTarget.uuid,
          uuid: this.currentTableTarget.uuid,
          name: state.system[this.currentTableTarget.uuid].name,
          uuidPath: this.currentPvTreeIdPath,
          path: this.objectContentHeaderText.textContent,
          machinePath:
            "/controllers/" +
            chainID +
            "/systems/" +
            this.currentTableTarget.uuid,
        });
      } else if (this.currentTableTarget.type === "subsystem") {
        let chainID = null;
        for (let [key, value] of Object.entries(state.controller)) {
          if (
            key !== "changed" &&
            key !== "action" &&
            value.subSystemIDs.includes(this.currentTableTarget.uuid)
          ) {
            chainID = key;
          }
        }
        const systemID = state.subsystem[this.currentTableTarget.uuid].systemID;
        this.config.onOk({
          type: this.currentTableTarget.type,
          chainID: chainID,
          systemID: systemID,
          subSystemID: this.currentTableTarget.uuid,
          uuid: this.currentTableTarget.uuid,
          name: state.subsystem[this.currentTableTarget.uuid].description,
          uuidPath: this.currentPvTreeIdPath,
          path: this.objectContentHeaderText.textContent,
          machinePath:
            "/controllers/" +
            chainID +
            "/systems/" +
            systemID +
            "/subsystems/" +
            this.currentTableTarget.uuid,
        });
      } else if (this.currentTableTarget.type === "view") {
        this.config.onOk({
          type: this.currentTableTarget.type,
          chainID: "",
          subSystemID: "",
          uuid: this.currentTableTarget.uuid,
          machinePath: "",
        });
      } else {
        const chainID = state.pv[this.currentTableTarget.uuid].chainID;
        const subSystemID = state.pv[this.currentTableTarget.uuid].subSystemID;
        const systemID = state.subsystem[subSystemID].systemID;
        this.config.onOk({
          type: this.currentTableTarget.type,
          chainID: chainID,
          systemID: systemID,
          subSystemID: state.pv[this.currentTableTarget.uuid].subSystemID,
          uuid: this.currentTableTarget.uuid,
          name: state.pv[this.currentTableTarget.uuid].name,
          uuidPath: this.currentPvTreeIdPath,
          path: this.objectContentHeaderText.textContent,
          machinePath: this.getMachinePath(
            this.currentRealIdPath,
            this.currentTableTarget.uuid,
            "pv"
          ),
        });
      }

      this.onCancelPickerClick();
    }
  }

  onCancelPickerClick() {
    this.onDialogClose();
    this.dialog.destroy();
  }

  //-------------------------------------------------------------
  // TOGGLE
  //-------------------------------------------------------------
  toggleContainer(container) {
    if (container.style.display === "none") container.style.display = "";
    else container.style.display = "none";
  }

  toggleFolder(container) {
    if (
      container.curStatus === "closed" &&
      container.depth === this.VIEWS &&
      container.subContainer.type === "view"
    ) {
      const parents = this.getParents(container);
      this.communicator.sendGetPvsBasics(
        parents[this.CONTROLLER],
        parents[this.SUBSYSTEM],
        [],
        [],
        true
      );
    }
    //show sub folders container
    if (container.curStatus === "closed") {
      container.openCloseIcon.style.backgroundImage = `url('${teListClosePng}')`;
      container.subContainer.style.display = "";
      container.curStatus = "open";
    }
    //hide sub folders container
    else {
      container.openCloseIcon.style.backgroundImage = `url('${teListOpenPng}')`;
      container.subContainer.style.display = "none";
      container.curStatus = "closed";
    }
  }

  togglePicker() {
    if (this.contentFooterVisible === false) {
      this.contentFooterVisible = true;
      this.appType = "builder";
      this.setToAppType(this.appType);
    } else {
      this.contentFooterVisible = false;
      this.appType = this.config.type; //"picker";
      this.setToAppType(this.appType);
    }
  }

  //-------------------------------------------------------------
  // FOLDER
  //-------------------------------------------------------------

  /**
   *
   * @param {*} parent
   * @param {object} settings
   * @param {*} [settings.uuid]
   * @param {*} [settings.name]
   * @param {*} [settings.depth]
   * @param {*} [settings.pathName]
   * @param {*} [settings.draggable]
   * @param {*} largeIcon
   * @param {*} customFolderIcon
   * @param {*} type
   */
  addFolder(parent, settings, largeIcon, customFolderIcon, type) {
    //container
    const container = this.createFolderContainer(
      settings.depth,
      false,
      largeIcon
    );
    container.id = settings.uuid;

    if (typeof settings !== "undefined") {
      //inject settings
      for (const property in settings) {
        if (Object.prototype.hasOwnProperty.call(settings, property))
          container[property] = settings[property];
      }
    }
    //event Listener
    if (
      type !== "pv" &&
      !(
        (type === "program" && settings.depth !== this.PROGRAMS) ||
        (type === "device" && settings.depth !== this.DEVICES)
      )
    ) {
      container.addEventListener("click", (event) => {
        this.clickHandler(event);
      });
    } else if (type === "pv") {
      container.addEventListener("click", (event) => {
        const now = new Date().getTime();

        //double click occurred
        if (now - this.lastClicked < 250) {
          const state = Store.getState().pv[event.target.parentNode.uuid];
          openView(
            state.chainID,
            state.uuid,
            event.target.parentNode.subContainer.type
          );
        }
        this.lastClicked = now;
      });
    }

    container.addEventListener("contextmenu", (event) => {
      this.contextMenuHandler(event);
    });

    //Drag & Drop
    this.addDragAndDropEventListener(container);

    //open/close icon
    const openCloseIcon = document.createElement("div");
    if (largeIcon === true)
      openCloseIcon.classList.add("pmp_css_appBuilder2_openCloseIconLarge");
    else openCloseIcon.classList.add("pmp_css_appBuilder2_openCloseIcon");

    //reference
    container.openCloseIcon = openCloseIcon;

    container.appendChild(openCloseIcon);

    //folder icon
    var folderIcon = document.createElement("div");
    folderIcon.style.backgroundImage =
      typeof customFolderIcon === "undefined"
        ? `url('${folderPng}')`
        : customFolderIcon;
    if (largeIcon === true)
      folderIcon.classList.add("pmp_css_appBuilder2_folderIconLarge");
    else folderIcon.classList.add("pmp_css_appBuilder2_folderIcon");

    //reference
    container.folderIcon = folderIcon;

    container.appendChild(folderIcon);

    //folder name
    const folderName = document.createElement("p");
    if (largeIcon === true)
      folderName.classList.add("pmp_css_appBuilder2_folderLarge");
    else folderName.classList.add("pmp_css_appBuilder2_folder");
    folderName.textContent = settings.name;
    folderName.style.width = "inherit";

    //reference
    container.folderName = folderName;

    container.appendChild(folderName);

    //info gets url of the controller
    const info = document.createElement("p");
    info.classList.add("pmp_css_fadedText");
    if (largeIcon === true) {
      info.classList.add("pmp_css_appBuilder2_infoLarge");
      info.textContent = container.pathName;
    }

    container.appendChild(info);

    parent.appendChild(container);

    //sub container, ie. container with the sub folders belonging to this folder
    const subContainer = this.createFolderContainer(
      settings.depth,
      true,
      largeIcon
    );
    subContainer.style.clear = "both";
    subContainer.style.display = "none";

    //reference container
    subContainer.parentFolder = container;

    //reference subcontainer
    container.subContainer = subContainer;

    //type
    subContainer.type = type;

    parent.appendChild(subContainer);

    return subContainer;
  }

  createFolderContainer(depth, isSubFolder, largeIcon) {
    //container
    const container = document.createElement("div");
    if (depth === 0) container.style.width = "calc(100% - " + 0 + "px)";
    else container.style.width = "calc(100% - " + 20 + "px)";

    container.style.clear = "both";
    if (!isSubFolder) {
      if (largeIcon === true)
        container.classList.add("pmp_css_appBuilder2_rowLarge");
      else container.classList.add("pmp_css_appBuilder2_row");
      container.classList.add("pmp_css_table_rowHover");
    }
    container.style.cssFloat = "right";
    container.curStatus = "closed";

    return container;
  }

  setFolderAsExpandable(what, _this) {
    what.parentFolder.openCloseIcon.style.backgroundImage = `url('${teListOpenPng}')`;

    //click handler for arrow
    what.parentFolder.openCloseIcon.addEventListener("click", function (event) {
      event.stopPropagation();
      _this.toggleFolder.call(_this, what.parentFolder);
    });

    //click handler for opening/closing folder
    what.parentFolder.addEventListener("click", function (event) {
      event.stopPropagation();
      const now = new Date().getTime();

      this.lastClicked = now;
    });
  }

  /**
   * Adds a folder in the existing tree
   * @param {*} name
   */
  createPVFolder(name) {
    const uuid = Common.createUuidv4();
    const hookTo = this.currentTarget.subContainer;
    const depth = this.currentTarget.depth;

    const folder = this.addFolder(
      hookTo,
      { uuid: uuid, name: name, depth: depth, pathName: "", draggable: false },
      false,
      `url('${folderPng}')`,
      "folder"
    );

    this.setFolderAsExpandable(folder, this);
    this.buildPVTree();
    //}
  }

  //-------------------------------------------------------------
  // COMMUNICATION
  //-------------------------------------------------------------

  createMessageObject(msg, msgData = null) {
    return {
      msg: msg,
      senderUuid: this.UUID,
      msgData: msgData,
      data: null,
    };
  }

  /**
   *
   * @param {*} name - of the element
   * @param {*} uuid - of the element
   * @param {*} chain - chain id of the controller
   */
  createDefaultSendObject(name, uuid, chain) {
    return {
      name: name,
      uuid: uuid,
      chain: chain,
    };
  }

  /**
   *
   * @param {*} chain
   * @param {*} subSystemUuid
   * @param {*} uuids is an array of view uuid's
   * @param {*} sort is an array with two entries, name of sort column from pv table and "asc" or "desc"
   * @param {*} skipContent true or false
   * @param {*} skipThumbnail true or false
   *
   */
  createGetPvsSendObject(
    chain,
    subSystemUuid,
    uuids,
    sort = [],
    skipContent = true,
    skipThumbnail = true
  ) {
    return {
      subSystemUuid: subSystemUuid,
      uuids: uuids,
      chain: chain,
      sort: sort,
      skipContent: skipContent,
      skipThumbnail: skipThumbnail,
    };
  }

  sendToComs(msg, msgObj) {
    CliComs.send({
      type: msg,
      payload: this.createMessageObject(msg, msgObj),
      callback: (recData) => {
        this.messageHandler(recData);
      },
      element: this.container,
    });
  }

  //-------------------------------------------------------------
  // PVTREE
  //-------------------------------------------------------------

  getPvTree(uuid) {
    return Store.getState().pvTree[uuid];
  }

  /**
   *
   * @param {*} uuid - of pv
   */
  buildPVTree() {
    let pvTree = [];

    let parents = this.getParents(this.currentTarget);
    const chainID = parents[this.CONTROLLER];
    const subSystemID = parents[this.SUBSYSTEM];

    const view = this.getSpecificFolder(subSystemID, "view");
    this.addToTree(view, pvTree);

    this.communicator.setPvTreeToStore({
      chainID: chainID,
      subSystemID: subSystemID,
      pvTree: pvTree,
    });

    this.communicator.sendSetPvTree({
      chain: chainID,
      uuid: subSystemID,
      pvTree: pvTree,
    });

    // if we drag & drop over subsystems we have to clean
    // the tree where we dragged the view
    if (
      this.draggedObj !== null &&
      subSystemID !== this.draggedObj.subsystemId
    ) {
      let pvTreeOld = this.getPvTree(this.draggedObj.subsystemId);
      this.deleteUuidInTree(pvTreeOld, this.draggedObj.id);
      this.communicator.setPvTreeToStore({
        chainID: this.draggedObj.chainId,
        subSystemID: this.draggedObj.subsystemId,
        pvTree: pvTreeOld,
      });

      this.communicator.sendSetPvTree({
        chainID: this.draggedObj.chainId,
        uuid: this.draggedObj.subsystemId,
        pvTree: pvTreeOld,
      });
    }
  }

  /**
   * build an object representing pvs structure
   * @param {*} what
   * @param {*} arr - the local pvTree
   */
  addToTree(what, arr) {
    let length = what.childNodes.length;
    for (let i = 0; i < length; i++) {
      if (typeof what.childNodes[i].type !== "undefined") {
        //pv
        if (what.childNodes[i].type === "pv") {
          arr.push({
            uuid: what.childNodes[i].parentFolder.uuid,
            type: "pv",
          });
        }

        //folder
        else if (what.childNodes[i].type === "folder") {
          arr.push({
            name: what.childNodes[i].parentFolder.name,
            uuid: what.childNodes[i].parentFolder.uuid,
            type: "folder",
            children: [],
          });
          this.addToTree(
            what.childNodes[i].parentFolder.nextSibling,
            arr[arr.length - 1].children
          );
        }
      }
    }
  }

  addToPvTree(array, parentUuid, newElement) {
    array?.forEach((element) => {
      if (element.uuid === parentUuid) {
        element.children.push(newElement);
        return;
      }
      if (typeof element.children !== "undefined") {
        this.addToPvTree(element.children, parentUuid, newElement);
      }
    });
  }

  addPvTree(tree, depth, hookTo) {
    let _this = this;
    if (typeof tree === "undefined") return;

    tree.forEach((obj) => {
      if (
        obj.type === "pv" &&
        typeof _this.subscribedPvs[obj.uuid] !== "undefined"
      ) {
        const pv = _this.addFolder(
          hookTo,
          {
            uuid: obj.uuid,
            name: _this.subscribedPvs[obj.uuid].name,
            depth: depth,
            pathName: "",
            draggable: true,
          },
          false,
          `url('${pvPng}')`,
          obj.type
        );

        //click handler for views are not wanted
        pv.parentFolder.removeEventListener("click", _this.onClickWrapper);
        _this.addToReferenceHandler(obj.uuid, pv);
      }
      if (obj.type === "folder") {
        const folder = _this.addFolder(
          hookTo,
          {
            uuid: obj.uuid,
            name: obj.name,
            depth: depth,
            pathName: "",
            draggable: true, // this was set to false, because of some reasons, now it is set to true
            // the sideeffects are unclear.
          },
          false,
          `url('${folderPng}')`,
          obj.type
        );

        _this.setFolderAsExpandable(folder, _this);
        _this.pvTreeFolderHandler.add(obj.uuid, obj.children);
        _this.addPvTree(obj.children, depth + 1, folder);
        _this.addToReferenceHandler(obj.uuid, folder);
      }
    });
  }

  //returns the object from "Views", "Programs" or "Devices" according the type
  //types are "view", "device", "program"
  getSpecificFolder(uuid, type) {
    const folders = this.folderHandler.get(uuid);
    let ret = null;
    if (folders == null) return ret;

    folders.forEach((obj) => {
      if (obj.type === type) ret = obj;
    });
    return ret;
  }

  deleteUuidInTree(array, uuid) {
    array?.forEach((element, index) => {
      if (element.uuid === uuid) {
        array.splice(index, 1);
        return;
      }
      if (typeof element.children !== "undefined") {
        this.deleteUuidInTree(element.children, uuid);
      }
    });
  }

  findParentInTree(array, uuid, parent = null) {
    let ret = parent;
    array?.forEach((element) => {
      if (element.uuid === uuid) {
        ret = parent;
        return ret;
      }
      if (typeof element.children !== "undefined") {
        this.findParentInTree(element.children, uuid, element.uuid);
      }
    });
    return ret;
  }

  //-------------------------------------------------------------
  // UUID
  //-------------------------------------------------------------
  compareUuid(uuid) {
    let ret = false;
    if (uuid === this.UUID) ret = true;
    return ret;
  }

  //get UUID are on top of the constructor

  //-------------------------------------------------------------
  // HANDLES TREE CONTAINER
  //-------------------------------------------------------------

  /**
   * Handles the clicks in the Tree Container
   * @param {*} event
   */
  clickHandler(event) {
    event.stopPropagation();
    this.clearTableBody();
    this.setObjectHeaderContentTextFromEvent(event.currentTarget);
    this.objectsTable.outerTableContainer.style.display = "";
    this.currentTarget = event.currentTarget;
    this.selectedTargetId = event.currentTarget.id;

    if (this.selectedTreeFolder !== this) {
      if (this.selectedTreeFolder != null)
        this.selectedTreeFolder.classList.remove("pmp_css_table_rowSelected");
      this.selectedTreeFolder = event.currentTarget;
      this.selectedTreeFolder.classList.add("pmp_css_table_rowSelected");
    }

    if (event.currentTarget.depth === this.ROOT) this.handleRootClick(event);
    //TODO: controller and folder must be changed
    else if (event.currentTarget.depth === this.CONTROLLER)
      this.handleDepth0Click(event);
    else if (event.currentTarget.depth === this.SYSTEM)
      this.handleDepth01Click(event);
    else if (event.currentTarget.depth === this.SUBSYSTEM)
      this.handleDepth1Click(event);
    else if (event.currentTarget.depth === this.VIEWS) {
      if (event.currentTarget.subContainer.type === "view")
        this.handleDepth2ViewsClick(event);
      else if (event.currentTarget.subContainer.type === "device")
        this.handleDepth2DevicesClick(event);
      else if (event.currentTarget.subContainer.type === "program")
        this.handleDepth2ProgramsClick(event);
    } else if (event.currentTarget.depth >= this.VIEWS_CONTENT)
      this.handleDepthGreaterEqual3Click(event);
  }

  handleRootClick() {
    this.changeObjectsTable(this.tableConfigControllers);

    Object.entries(this.subscribedControllers).forEach(([key, value]) => {
      if (key !== "changed" && key !== "action") {
        let content = {};
        content.cells = [];
        content.icon = `url('${serverPng}')`;
        content.name = value.name;
        content.facility = value.facility;
        content.url = value.url;
        content.type = "controller";
        content.uuid = key;

        const ref = this.referenceHandler.get(key);
        if (
          typeof ref !== "undefined" &&
          ref != null &&
          typeof ref.parentFolder !== "undefined"
        ) {
          content.tagStatus = ref.parentFolder.tagStatus;
        }

        content.cells = [
          content.name,
          content.facility,
          content.url,
          content.type,
        ];
        this.addContentToTable(content);
      }
    });
  }

  // handles the clicks on the controller in the treeContainer
  handleDepth0Click(event) {
    const array = this.getSelectedSystems(
      this.subscribedControllers[event.currentTarget.uuid].systemIDs
    );
    if (array === undefined) return;

    this.updateSystemContentInTable(array);
  }

  // handles the clicks on the system in the treeContainer
  handleDepth01Click(event) {
    const array = this.getSelectedSubSystems(
      Store.getState().system[event.currentTarget.uuid].subSystemIDs
    );
    if (array === undefined) return;

    this.updateSubSystemContentInTable(array);
  }

  // handles the clicks on the subSystem in the treeContainer
  handleDepth1Click(event) {
    const obj = this.folderHandler.get(event.currentTarget.uuid);
    if (obj === undefined || obj == null) return;

    const parents = this.getParents(event.currentTarget);
    parents.push(event.currentTarget.id);
    this.updateLevel_VIEWS_PROGRAMS_DEVICES_ContentInTable(obj, parents);
    this.setObjectTagStatusStyle(
      this.objectsTable.table,
      AppBuilder2.subscribedTags[this.currentPvTreeIdPath[this.CONTROLLER]]
        .value
    );
  }

  // handles the clicks on the views in the treeContainer
  handleDepth2ViewsClick(event) {
    event.currentTarget.clicked = true;
    const parents = this.getParents(event.currentTarget);
    let uuid = event.currentTarget.parentNode.parentFolder.uuid;
    this.communicator.sendGetPvsBasicsCallbackAndMessageHandler(
      () => {
        this.updatePvAndFolderContentInTable(parents, uuid);
      },
      parents[this.CONTROLLER],
      parents[this.SUBSYSTEM],
      [],
      [],
      true
    );

    if (
      this.pickerType === "picker" ||
      this.pickerType === "pickerPV" ||
      this.pickerType === "pickerResource"
    ) {
      this.hideContentFooter(false);
    }
  }

  handleDepthGreaterEqual3Click(event) {
    const parents = this.getParents(event.currentTarget);
    this.updateTableContent(
      parents,
      this.pvTreeFolderHandler,
      event.currentTarget.uuid
    );
  }

  /**
   *  handles the clicks on the devices in the treeContainer
   * @param {*} event
   */
  handleDepth2DevicesClick(event) {
    if (this.config.type === "pickerResource") return;

    const parents = this.getParents(event.currentTarget);

    while (event.currentTarget.subContainer.firstChild) {
      event.currentTarget.subContainer.removeChild(
        event.currentTarget.subContainer.firstChild
      );
    }

    this.communicator.sendGetDevices(
      parents[this.CONTROLLER],
      parents[this.SUBSYSTEM]
    );
  }

  /**
   * handles the clicks on the programs in the treeContainer
   * @param {*} event
   */
  handleDepth2ProgramsClick(event) {
    if (this.config.type === "pickerResource") return;

    const parents = this.getParents(event.currentTarget);

    while (event.currentTarget.subContainer.firstChild) {
      event.currentTarget.subContainer.removeChild(
        event.currentTarget.subContainer.firstChild
      );
    }

    this.communicator.sendGetPrograms(
      parents[this.CONTROLLER],
      parents[this.SUBSYSTEM]
    );
  }

  contextMenuHandler(event) {
    event.stopPropagation();
    event.preventDefault();
    this.currentTarget = event.currentTarget;
    this.selectedTargetId = event.currentTarget.id;

    if (event.currentTarget.depth === this.ROOT)
      this.handleRootContextMenu(event);
    else if (event.currentTarget.depth === this.CONTROLLER)
      this.handleDepth0ContextMenu(event);
    else if (event.currentTarget.depth === this.SYSTEM) {
      const system = Store.getState().system[this.currentTarget.uuid];
      if (system?.subSystemIDs) {
        if (system.subSystemIDs.length) {
          this.systemsPopupRemoveSystemShortcut.style.opacity = 0.7;
          this.systemsPopupRemoveSystemShortcut.style.pointerEvents = "none";
        } else {
          this.systemsPopupRemoveSystemShortcut.style.opacity = 1;
          this.systemsPopupRemoveSystemShortcut.style.pointerEvents = "auto";
        }
      }
      this.handleDepth01ContextMenu(event);
    } else if (event.currentTarget.depth === this.SUBSYSTEM)
      this.handleDepth1ContextMenu(event);
    else if (event.currentTarget.depth === this.VIEWS) {
      if (event.currentTarget.subContainer.type === "view")
        this.handleDepth2ContextMenuViews(event);
      else if (event.currentTarget.subContainer.type === "device")
        this.handleDepth2ContextMenuDevices(event);
      else if (event.currentTarget.subContainer.type === "program")
        this.handleDepth2ContextMenuPrograms(event);
    } else if (event.currentTarget.depth >= this.VIEWS_CONTENT) {
      if (event.currentTarget.subContainer.type === "pv")
        this.handleDepthGreaterEqual3ContextMenuView(event);
      else if (event.currentTarget.subContainer.type === "folder")
        this.handleDepthGreaterEqual3ContextMenuFolder(event);
      else if (event.currentTarget.subContainer.type === "device")
        this.handleDepthGreaterEqual3ContextMenuDevice(event);
    }
  }

  handleRootContextMenu(event) {
    var coords = Common.getEventCoordinates(event);

    this.networkPopup.show(coords.x, coords.y - this.container.scrollTop);
  }

  handleDepth0ContextMenu(event) {
    var coords = Common.getEventCoordinates(event);

    this.serverPopup.show(coords.x, coords.y - this.container.scrollTop);
  }
  //this layer is added afterwords this is why it has this shitty name
  handleDepth01ContextMenu(event) {
    var coords = Common.getEventCoordinates(event);

    this.systemPopup.show(coords.x, coords.y - this.container.scrollTop);
  }

  handleDepth1ContextMenu(event) {
    const coords = Common.getEventCoordinates(event);

    this.subSystemPopup.show(coords.x, coords.y - this.container.scrollTop);
  }

  handleDepth2ContextMenuViews(event) {
    const coords = Common.getEventCoordinates(event);

    this.viewsPopupRenameFolderShortcut.style.display = "none";
    this.viewsPopupRemoveShortcut.style.display = "none";

    if (event.currentTarget.clicked === false)
      this.viewsPopupAddFolderShortcut.style.display = "none";
    else this.viewsPopupAddFolderShortcut.style.display = "";

    this.viewsFolderPopup.show(coords.x, coords.y - this.container.scrollTop);
  }

  handleDepth2ContextMenuDevices(event) {
    const coords = Common.getEventCoordinates(event);

    this.devicesFolderPopup.show(coords.x, coords.y - this.container.scrollTop);
  }

  handleDepth2ContextMenuPrograms(event) {
    const coords = Common.getEventCoordinates(event);

    this.programsFolderPopup.show(
      coords.x,
      coords.y - this.container.scrollTop
    );
  }

  handleDepthGreaterEqual3ContextMenuView(event) {
    const coords = Common.getEventCoordinates(event);

    this.viewPopup.show(coords.x, coords.y - this.container.scrollTop);
  }

  handleDepthGreaterEqual3ContextMenuFolder(event) {
    const coords = Common.getEventCoordinates(event);
    this.viewsPopupRemoveShortcut.style.display = "";

    this.viewsFolderPopup.show(coords.x, coords.y - this.container.scrollTop);
  }

  handleDepthGreaterEqual3ContextMenuDevice(event) {
    const coords = Common.getEventCoordinates(event);
    const device = Store.getState().device[event.currentTarget.uuid];
    if (device.content.serverType === IoTypes[0]) {
      this.devicePopupScanDeviceShortcut.style.display = "none";
      this.devicePopupAddShortcut.style.display = "none";
    } else {
      this.devicePopupScanDeviceShortcut.style.display = "";
      this.devicePopupAddShortcut.style.display = "";
    }

    this.devicePopup.show(coords.x, coords.y - this.container.scrollTop);
  }

  //-------------------------------------------------------------
  // HANDLES CONTENT CONTAINER
  //-------------------------------------------------------------

  /**
   * Handles the doubleclicks in the Content Container
   * @param {*} event
   */
  doubleClickHandlerRow(event) {
    if (event.currentTarget.type === "pv") {
      this.currentTarget = event.currentTarget;
      this.selectedTargetId = event.currentTarget.uuid;
      this.syncHeaderContentTextAndPath(event);

      // We should merge these two
      // Disabling pv switching if AppBuilder is used as a selection tool
      if (!this.config.type.toLowerCase().includes("picker")) {
        const chainId = Store.getState().pv[event.currentTarget.uuid].chainID;
        const uuid = event.currentTarget.uuid;
        const type = event.currentTarget.type;
        openView(chainId, uuid, type);
      }
    } else if (event.currentTarget.type === "view") {
      let sub = event.currentTarget.parents[this.SUBSYSTEM];
      this.communicator.sendGetPvsBasicsCallbackAndMessageHandler(
        () => {
          this.updatePvAndFolderContentInTable(null, sub);
        },
        event.currentTarget.parents[this.CONTROLLER],
        event.currentTarget.parents[this.SUBSYSTEM],
        [],
        [],
        true
      );
    } else if (event.currentTarget.type === "program") {
      if (this.config.type === "builder")
        this.communicator.sendGetPrograms(
          event.currentTarget.parents[this.CONTROLLER],
          event.currentTarget.parents[this.SUBSYSTEM]
        );
      else if (this.config.type === "picker")
        this.communicator.sendGetPrograms(
          event.currentTarget.parents[this.CONTROLLER],
          event.currentTarget.parents[this.SUBSYSTEM]
        );
    } else if (event.currentTarget.type === "device") {
      if (this.config.type === "builder")
        this.communicator.sendGetDevices(
          event.currentTarget.parents[this.CONTROLLER],
          event.currentTarget.parents[this.SUBSYSTEM]
        );
      else if (this.config.type === "picker")
        this.communicator.sendGetDevices(
          event.currentTarget.parents[this.CONTROLLER],
          event.currentTarget.parents[this.SUBSYSTEM]
        );
    } else if (event.currentTarget.type === "controller") {
      this.handleDepth0Click(event);
    } else if (event.currentTarget.type === "system") {
      this.handleDepth01Click(event);
    } else if (event.currentTarget.type === "subsystem") {
      const obj = this.folderHandler.get(event.currentTarget.uuid);
      if (obj === undefined || obj == null) return;

      const parents = this.getParents(obj[0].parentFolder);
      parents.push(event.currentTarget.uuid);
      this.updateLevel_VIEWS_PROGRAMS_DEVICES_ContentInTable(obj, parents);
    } else if (event.currentTarget.type === "folder") {
      this.handleDepthGreaterEqual3Click(event);
    }
    this.syncSelectedElements(event);
    this.syncHeaderContentTextAndPath(event);

    const updateParentPath = event.currentTarget.type !== "pv";
    if (updateParentPath) {
      this.setObjectHeaderContentTextFromEvent(this.currentTarget);
    }
  }

  /**
   * Handles the clicks in the Content Container
   * @param {*} event
   */
  clickHandlerRow(event) {
    const inactiveOpa = "0.4";

    // Set Picker button according this.config.type
    if (this.config.type === "picker") {
      this.pickerContainer.style.pointerEvents = "All";
      this.pickerContainer.style.opacity = "1";
    } else if (
      this.config.type === "pickerPV" &&
      event.currentTarget.type !== "pv"
    ) {
      this.pickerContainer.style.pointerEvents = "none";
      this.pickerContainer.style.opacity = inactiveOpa;
    } else if (
      this.config.type === "pickerPV" &&
      event.currentTarget.type === "pv"
    ) {
      this.pickerContainer.style.pointerEvents = "All";
      this.pickerContainer.style.opacity = "1";
    } else if (this.config.type === "builder") {
      //empty
    } else if (
      this.config.type === "pickerResource" &&
      (event.currentTarget.type === "pv" ||
        event.currentTarget.type === "folder" ||
        event.currentTarget.type === "subsystem" ||
        event.currentTarget.type === "system" ||
        event.currentTarget.type === "controller")
    ) {
      this.pickerContainer.style.pointerEvents = "All";
      this.pickerContainer.style.opacity = "1";
    } else {
      this.pickerContainer.style.pointerEvents = "none";
      this.pickerContainer.style.opacity = inactiveOpa;
    }

    // remove the old selected row and set the new one
    if (this.currentTableTarget != null) {
      this.currentTableTarget.classList.remove("pmp_css_table_rowSelected");
    }
    this.currentTableTarget = event.currentTarget;
    this.currentTableTarget.classList.add("pmp_css_table_rowSelected");

    this.syncSelectedElements(event, true);
  }

  /**
   * Handles the Contextmenu in the Content Container
   * @param {*} event
   */
  contextMenuHandlerRow(event) {
    event.stopPropagation();
    event.preventDefault();

    const coords = Common.getEventCoordinates(event);
    const ref = this.referenceHandler.get(event.currentTarget.uuid);

    if (event.currentTarget.type === "subsystem")
      this.handleSubsystemContextMenu(coords, ref);
    else if (event.currentTarget.type === "pv")
      this.handlePvContextMenu(coords, ref);
    else if (event.currentTarget.type === "system") {
      this.handleSystemContextMenu(coords, ref);
    } else if (event.currentTarget.type === "folder")
      this.handleFolderContextMenu(coords, ref);
    else if (event.currentTarget.type === "view")
      this.handlePvContextMenu(coords, ref);
    else if (event.currentTarget.type === "device")
      this.handleDeviceContextMenu(coords, event, ref);
    else if (event.currentTarget.type === "program")
      this.notImplementedDialog("program");
    else if (event.currentTarget.type === "controller")
      this.handleControllerContextMenu(coords, ref);
  }

  handleSystemContextMenu(coords, ref) {
    this.currentTarget = ref.parentFolder;
    this.selectedTargetId = ref.parentFolder.id;
    this.systemPopup.show(coords.x, coords.y - this.container.scrollTop);
  }

  handleSubsystemContextMenu(coords, ref) {
    this.currentTarget = ref.parentFolder;
    this.selectedTargetId = ref.parentFolder.id;
    this.subSystemPopup.show(coords.x, coords.y - this.container.scrollTop);
  }

  handlePvContextMenu(coords, ref) {
    if (ref !== undefined && ref != null) {
      this.currentTarget = ref.parentFolder;
      this.selectedTargetId = ref.parentFolder.id;

      if (ref.parentFolder.depth === this.VIEWS) {
        this.viewsPopupRenameFolderShortcut.style.display = "none";
        this.viewsPopupRemoveShortcut.style.display = "none";
        this.viewsFolderPopup.show(
          coords.x,
          coords.y - this.container.scrollTop
        );
      } else this.viewPopup.show(coords.x, coords.y - this.container.scrollTop);
    }
  }

  handleFolderContextMenu(coords, ref) {
    if (ref !== undefined && ref != null) {
      this.viewsPopupRenameFolderShortcut.style.display = "";
      this.viewsPopupRemoveShortcut.style.display = "";
      this.currentTarget = ref.parentFolder;
      this.selectedTargetId = ref.parentFolder.id;
      this.viewsFolderPopup.show(coords.x, coords.y - this.container.scrollTop);
    }
  }

  handleControllerContextMenu(coords, ref) {
    if (ref !== undefined && ref != null) {
      this.currentTarget = ref.parentFolder;
      this.selectedTargetId = ref.parentFolder.id;
      this.serverPopup.show(coords.x, coords.y - this.container.scrollTop);
    }
  }

  handleDeviceContextMenu(coords, event, ref) {
    this.currentTarget = event.currentTarget;
    this.selectedTargetId = event.currentTarget.uuid;
    const device = Store.getState().device[this.selectedTargetId];

    if (device.content.serverType === IoTypes[0]) {
      this.devicePopupScanDeviceShortcut.style.display = "none";
    } else {
      this.devicePopupScanDeviceShortcut.style.display = "";
    }

    if (ref !== undefined && ref != null) {
      if (ref.parentFolder.depth === this.DEVICES) {
        this.devicesFolderPopup.show(
          coords.x,
          coords.y - this.container.scrollTop
        );
      } else
        this.devicePopup.show(coords.x, coords.y - this.container.scrollTop);
    } else {
      this.devicePopup.show(coords.x, coords.y - this.container.scrollTop);
    }
  }

  //-------------------------------------------------------------
  // HANDLES DRAG AND DROP
  //-------------------------------------------------------------

  /**
   * adds Drag & Drop eventListener
   * @param {*} element
   */
  addDragAndDropEventListener(element) {
    element.addEventListener("dragstart", (event) => {
      this.dragStartHandler(event);
    });
    element.addEventListener("dragenter", (event) => {
      this.dragEnterHandler(event);
    });
    element.addEventListener("dragover", (event) => {
      this.dragOverHandler(event);
    });
    element.addEventListener("dragleave", (event) => {
      this.dragLeaveHandler(event);
    });
    element.addEventListener("drop", (event) => {
      this.dropHandler(event);
    });
    element.addEventListener("dragend", (event) => {
      this.dragEndHandler(event);
    });
  }

  // drag start
  dragStartHandler(event) {
    this.currentTarget = event.currentTarget;
    this.selectedTargetId = this.currentTarget.id;

    // get the actual pvTree
    const parents = this.getParents(event.currentTarget);

    // get the object to be dragged
    this.draggedObj = event.currentTarget;
    this.draggedObj.chainId = parents[this.CONTROLLER];
    this.draggedObj.subsystemId = parents[this.SUBSYSTEM];

    event.dataTransfer.setData("text", "empty");
    event.dataTransfer.effectAllowed = "move";
  }

  // drag over
  dragOverHandler(event) {
    // currentTarget element is the source node
    if (event.preventDefault) {
      event.preventDefault(); // Necessary. Allows us to drop.
    }

    event.currentTarget.classList.add("pmp_css_appBuilder2_over");

    const draggedObjParents = this.getParents(this.draggedObj);
    const layer2Uuid = draggedObjParents[this.VIEWS];
    const element = this.referenceHandler.get(layer2Uuid);

    let targetElement = null;

    // is it controller or subsystem
    if (event.currentTarget.depth < this.VIEWS)
      event.dataTransfer.dropEffect = "none";
    // is it Views Programs or Devices
    else if (event.currentTarget.depth === this.VIEWS) {
      targetElement = this.referenceHandler.get(event.currentTarget.id);
      // only Views to Views, Programs to Programs and Devices to devices
      if (element.type === targetElement.type)
        event.dataTransfer.dropEffect = "move";
      else event.dataTransfer.dropEffect = "none";
    }
    // anything else
    else event.dataTransfer.dropEffect = "move";

    return false;
  }

  // drag enter
  dragEnterHandler() {}

  // drag leave
  dragLeaveHandler(event) {
    event.currentTarget.classList.remove("pmp_css_appBuilder2_over");
  }

  // drop
  dropHandler(event) {
    if (event.stopPropagation) event.stopPropagation(); // Stops some browsers from redirecting.

    event.currentTarget.classList.remove("pmp_css_appBuilder2_over");

    if (event.currentTarget.nodeName === "TR")
      this.dropHandlerContentContainer(event);
    else if (event.currentTarget.nodeName === "DIV")
      this.dropHandlerTreeContainer(event);
  }

  dropHandlerTreeContainer(event) {
    const node = event.target.parentNode;

    // source is not target
    if (this.draggedObj !== node) {
      // only if it is in depth===2
      if (
        typeof node !== "undefined" &&
        node != null &&
        typeof node.depth !== "undefined" &&
        node.depth === this.VIEWS
      ) {
        this.insertAdjacentElementHelper(
          node.subContainer,
          "afterbegin",
          "afterend",
          this.draggedObj,
          node
        );
      }
      // only if it is a folder
      else if (
        typeof node !== "undefined" &&
        node != null &&
        typeof node.subContainer !== "undefined" &&
        typeof node.subContainer.type !== "undefined" &&
        node.subContainer.type === "folder"
      ) {
        this.insertAdjacentElementHelper(
          node.subContainer,
          "afterbegin",
          "afterend",
          this.draggedObj,
          node
        );
      }
      // only if the subContainer type is pv, view, ...
      else if (
        typeof event.target.subContainer !== "undefined" &&
        typeof event.target.subContainer.type !== "undefined"
      ) {
        if (event.target.subContainer.type === "pv") {
          this.insertAdjacentElementHelper(
            event.target.subContainer,
            "afterend",
            "afterend",
            this.draggedObj,
            event.target
          );
        } else if (event.target.subContainer.type === "view") {
          this.insertAdjacentElementHelper(
            event.target.subContainer,
            "afterbegin",
            "afterend",
            this.draggedObj,
            event.target
          );
        }
      }
      // and here the rest
      else {
        this.insertAdjacentElementHelper(
          node.subContainer,
          "afterend",
          "afterend",
          this.draggedObj,
          node
        );
      }
      this.buildPVTree();
    }
  }

  dropHandlerContentContainer(event) {
    const ref = this.referenceHandler.get(event.currentTarget.uuid);
    let target = null;
    let subContainer = null;
    // source is not target
    if (this.draggedObj !== event.target.parentNode) {
      if (event.currentTarget.type === "pv") {
        subContainer = ref;
        target = ref.parentFolder;
      } else if (event.currentTarget.type === "folder") {
        subContainer = ref.parentFolder.subContainer;
        target = ref.parentFolder;
      }

      this.insertAdjacentElementHelper(
        subContainer,
        "afterend",
        "afterend",
        this.draggedObj,
        target
      );
      this.buildPVTree();
    }
  }

  // drag end
  dragEndHandler() {}

  /**
   *
   * @param {*} subContainer
   * @param {*} pos1 - "beforebegin", "afterbegin", "beforeend", "afterend"
   * @param {*} pos2 - "beforebegin", "afterbegin", "beforeend", "afterend"
   * @param {*} draggedObj
   * @param {*} target - this will be the new selected and current target
   */
  insertAdjacentElementHelper(subContainer, pos1, pos2, draggedObj, target) {
    const parentNode = target.parentNode;
    // I do not clone the draggedObject, I remove it from the DOM and add it on the new place
    // where it should belong to. Also the subContainer need to be removed and added later again to his new parent
    this.draggedObj.subContainer.parentNode.removeChild(
      this.draggedObj.subContainer
    );
    this.draggedObj.parentNode.removeChild(this.draggedObj);

    subContainer.insertAdjacentElement(pos1, draggedObj);
    draggedObj.insertAdjacentElement(pos2, draggedObj.subContainer);

    this.currentTarget = target;
    this.selectedTargetId = target.id;

    if (this.currentTarget.parentNode == null) {
      parentNode.appendChild(this.currentTarget);
      parentNode.appendChild(subContainer);
    }
  }

  //-------------------------------------------------------------
  //Table
  //-------------------------------------------------------------

  /**
   *
   */
  clearTableBody() {
    //remove table body
    if (this.objectsTable.tableBody.parentNode != null)
      this.objectsTable.tableBody.parentNode.removeChild(
        this.objectsTable.tableBody
      );

    //clean the references for the cells
    this.tableCells = [];

    //reset scroll
    this.objectsTable.tableContainer.scrollTop = 0;

    //add a new table body, postpone append
    this.objectsTable.addTableBody(true);

    //finished, append table body to dom
    this.objectsTable.table.appendChild(this.objectsTable.tableBody);
  }

  /**
   *
   * @param {*} obj
   * @param {*} obj.icon is shown in the first cell of the row
   * @param {*} obj.type must be specified
   * @param {*} obj.uuid must be specified
   * @param {*} obj.cells is an array that specifies the content in the objectsTable.tableBody row
   * it is *** IMPORTANT *** that the values are in the correct order from left to right
   * @param {*} parents
   * @param {*} draggable
   */
  addContentToTable(obj, parents = [], draggable = false) {
    const row = this.objectsTable.tableBody.insertRow(0);
    row.classList.add("pmp_css_table_rowHover");
    row.classList.add("pmp_css_appBuilder2_row");
    row.uuid = obj.uuid;
    row.type = obj.type;
    row.draggable = draggable;
    row.parents = parents;
    this.setObjectTagStatusStyle(row, obj.tagStatus);

    //click handler
    row.addEventListener("click", (event) => {
      event.stopPropagation();
      const now = new Date().getTime();

      //double click occurred
      if (now - this.lastClicked < 250) this.doubleClickHandlerRow(event);
      //click occurred
      else this.clickHandlerRow(event);

      this.lastClicked = now;
    });
    row.addEventListener("contextmenu", (event) => {
      this.contextMenuHandlerRow(event);
    });

    //Drag & Drop
    this.addDragAndDropEventListener(row);

    //content icon cell
    const cell = row.insertCell(0);
    cell.classList.add("pmp_css_table_cell");

    cell.style.backgroundRepeat = "no-repeat";
    cell.style.backgroundPositionY = "center";
    cell.style.backgroundSize = "20px 20px";
    cell.style.backgroundImage = obj.icon;

    this.insertCellTextContent(1, row, obj.cells);
  }

  /**
   * @param {*} parents
   * @param {*} handler - pvTreeHandler for the "view"
   * @param {*} uuid - subsystemuuid
   */
  updateTableContent(parents, handler, uuid) {
    this.clearTableBody();
    const obj = handler.get(uuid);
    if (obj === undefined || obj == null) return;

    this.changeObjectsTable(this.tableConfigViews);

    obj.forEach((element) => {
      let content = {};
      content.cells = [];
      if (element.type === "pv") {
        content.icon = `url('${viewGray}')`;
        content.name = this.subscribedPvs[element.uuid].name;
        content.description = this.subscribedPvs[element.uuid].description;
        content.deviceType = this.subscribedPvs[element.uuid].typePv;
        content.type = element.type;
        content.uuid = element.uuid;

        content.cells = [
          content.name,
          content.description,
          content.deviceType,
          content.type,
        ];
        this.addContentToTable(content);
      } else if (element.type === "folder") {
        content.icon = `url('${folderPng}')`;
        content.name = element.name;
        content.description = "";
        content.deviceType = "";
        content.type = element.type;
        content.uuid = element.uuid;

        content.cells = [
          content.name,
          content.description,
          content.deviceType,
          content.type,
        ];
        this.addContentToTable(content);
      }
    });
  }

  updatePvAndFolderContentInTable(parents, uuid) {
    this.clearTableBody();
    const obj = this.subscribedPvTrees[uuid];

    if (obj === undefined || obj == null) return;

    if (!this.currentPvTreeIdPath.includes(uuid)) return;

    this.changeObjectsTable(this.tableConfigViews);

    obj.forEach((element) => {
      let content = {};
      content.cells = [];
      if (
        element.type === "pv" &&
        typeof this.subscribedPvs[element.uuid] !== "undefined"
      ) {
        content.icon = `url('${viewGray}')`;
        content.name = this.subscribedPvs[element.uuid].name;
        content.description = this.subscribedPvs[element.uuid].description;
        content.deviceType = this.subscribedPvs[element.uuid].typePv;
        content.type = element.type;
        content.uuid = this.subscribedPvs[element.uuid].uuid;

        content.cells = [
          content.name,
          content.description,
          content.deviceType,
          content.type,
        ];
        this.addContentToTable(content);
      } else if (element.type === "folder") {
        content.icon = `url('${folderPng}')`;
        content.name = element.name;
        content.description = "";
        content.deviceType = "";
        content.type = element.type;
        content.uuid = element.uuid;

        content.cells = [
          content.name,
          content.description,
          content.deviceType,
          content.type,
        ];
        this.addContentToTable(content);
      }
    });
  }

  updateLevel_VIEWS_PROGRAMS_DEVICES_ContentInTable(array, parents) {
    this.clearTableBody();

    this.changeObjectsTable(this.tableConfig);
    array.forEach((element) => {
      let icon = null;
      let content = {};
      content.cells = [];
      if (element.type === "view") {
        icon = `url('${viewGray}')`;
      } else if (element.type === "device") {
        icon = `url('${deviceGray}')`;
      } else if (element.type === "program") {
        icon = `url('${programGray24}')`;
      }

      content.icon = icon;
      content.name = element.parentFolder.textContent;
      content.description = ""; //"my description";
      content.type = element.type;
      content.uuid = element.parentFolder.uuid;

      content.cells = [content.name, content.description, content.type];
      this.addContentToTable(content, parents, false);
    });
  }

  /**
   *
   * @param {*} array
   */
  updateSubSystemContentInTable(array) {
    this.clearTableBody();
    this.changeObjectsTable(this.tableConfigSubSystems);

    array.forEach((element) => {
      let content = {};
      content.cells = [];
      content.icon = `url('${subsystemGray24}')`;
      content.name = element.description;
      content.description = "";
      content.type = "subsystem";
      content.uuid = element.uuid;
      content.permanent = element.permanent;

      content.cells = [
        content.name,
        content.description,
        content.permanent,
        content.type,
      ];
      this.addContentToTable(content);
    });
  }

  /**
   *
   * @param {*} array
   */
  updateSystemContentInTable(array) {
    this.clearTableBody();
    this.changeObjectsTable(this.tableConfigSubSystems);

    array.forEach((element) => {
      let content = {};
      content.cells = [];
      content.icon = `url('${subsystemGray24}')`;
      content.name = element.name;
      content.shortname = element.shortname;
      content.type = "system";
      content.uuid = element.systemID;
      content.permanent = element.permanent;

      content.cells = [content.name, "", content.permanent, content.type];
      this.addContentToTable(content);
    });
  }

  /**
   *
   * @param {*} array
   */
  updateProgramContentInTable(array) {
    this.clearTableBody();
    this.changeObjectsTable(this.tableConfigPrograms);

    //checks if the object key is an "object" and returns if true
    for (var key in array) {
      if (Object.prototype.hasOwnProperty.call(array, key) && key === "object")
        return;
    }

    array.forEach((element) => {
      let content = {};
      content.cells = [];
      content.icon = this.getStatusIcon(element.content.status);

      content.name = element.content.name;
      content.description = element.content.description;
      content.status = element.content.status;
      content.type = element.content.type;
      content.uuid = element.content.guid;

      content.cells = [
        content.name,
        content.description,
        content.status,
        content.type,
      ];
      this.addContentToTable(content);
    });
  }

  updateDeviceContentInTable(array, parents = []) {
    this.clearTableBody();
    this.changeObjectsTable(this.tableConfigDevices);
    //FIXME: TODO:
    //FIXME: remember to rename all this messy value names from native capital letter vs small letter

    //checks if the object key is an "object" and returns if true
    for (var key in array) {
      if (Object.prototype.hasOwnProperty.call(array, key) && key === "object")
        return;
    }

    array.forEach((element) => {
      let content = {};
      content.cells = [];
      content.icon = this.getStatusIcon(element.content.status);

      content.name = element.content.deviceName;
      content.description = element.content.description;
      // remember for Programs status we get a string "Running"
      // for devices we get a "1" this is the reason for the next line :-)
      content.status = DeviceStatusTypes[element.content.status];
      content.hwType = element.content.hwType;
      content.type = element.content.type;
      content.uuid = element.content.uuid;

      content.cells = [
        content.name,
        content.description,
        content.status,
        content.hwType,
        content.type,
      ];

      this.addContentToTable(content, parents, false);
    });
  }

  //-------------------------------------------------------------
  //ObjectHeaderContentText
  //-------------------------------------------------------------

  /**
   *
   * @param {*} currentTarget
   */
  setObjectHeaderContentTextFromEvent(currentTarget) {
    let text = "";
    let obj = currentTarget;
    let temp = [];
    for (let i = 0; i <= currentTarget.depth; i++) {
      text = obj.name + "/" + text;
      temp.push(obj.id);
      obj = obj.parentNode.parentFolder;
    }

    this.currentRealIdPath = [];
    for (let i = temp.length - 1; i >= 0; i--) {
      this.currentRealIdPath.push(temp[i]);
    }

    this.objectContentHeaderText.textContent = text;

    this.currentPvTreeIdPath = this.getParents(currentTarget);
    if (
      typeof currentTarget.uuid !== "undefined" &&
      (currentTarget.subContainer.type === "device" ||
        currentTarget.subContainer.type === "program" ||
        currentTarget.depth === 3)
    ) {
      // depth 3 is the VIEW folder and must be added here
      this.currentPvTreeIdPath.push(currentTarget.uuid);
    }
  }

  /**
   *
   */
  getObjectHeaderContentText() {
    return this.objectContentHeaderText.textContent;
  }

  //-------------------------------------------------------------
  // something else
  //-------------------------------------------------------------

  /**
   * returns all his parents and grandparents uuid's as array, <br>
   * parents[this.CONTROLLER] is the root (controller)
   * @param {*} currentTarget
   */
  getParents(currentTarget) {
    const parents = [];
    if (currentTarget.parentNode == null) {
      console.log("====== BROKEN parentNode ======");
      return [];
    }

    if (currentTarget.parentNode.parentFolder == null) {
      console.log("====== BROKEN parentFolder ======");
      return [];
    }

    let parent = currentTarget.parentNode.parentFolder;
    let depth = currentTarget.depth - 1;
    if (
      typeof currentTarget.subContainer !== "undefined" &&
      currentTarget.subContainer.type === "folder"
    ) {
      parent = currentTarget;
      depth = currentTarget.depth;
    }

    for (let i = depth; i >= 0; i--) {
      parents[i] = parent.uuid;
      if (parent.parentNode == null) {
        console.log("====== BROKEN parentNode======");
        console.log(parents);
        console.log(depth);
        console.log(i);
        return [];
      }

      if (
        typeof parent.parentNode.parentFolder !== "undefined" &&
        parent.subContainer.type !== "root"
      )
        parent = parent.parentNode.parentFolder;
    }
    return parents;
  }

  /**
   * handles the popups according config.type = "picker" / "pickerPV"
   * @param {*}
   */
  setToAppType(type) {
    if (type === "picker" || type === "pickerPV" || type === "pickerResource") {
      //Network
      this.networkPopupLdapShortcut.style.display = "none";
      //Server
      this.serversPopupRenameShortcut.style.display = "none";
      this.serversPopupInsertSystemShortcut.style.display = "none";
      this.serversPopupBackupAndRestoreShortcut.style.display = "none";
      this.serversPopupTunnelSettingsShortcut.style.display = "none";
      this.serversPopupNetworkSettingsShortcut.style.display = "none";
      //System
      this.systemsPopupInsertSubSystemShortcut.style.display = "none";
      this.systemsPopupRenameSystemShortcut.style.display = "none";
      this.systemsPopupRemoveSystemShortcut.style.display = "none";
      //SubSystem
      this.subSystemsPopupRenameSubSystemShortcut.style.display = "none";
      this.subSystemsPopupUpdateSubSystemInformation.style.display = "none";
      this.subSystemsPopupAddPVToSubSystem.style.display = "none";
      this.subSystemsPopupRemoveSubSystemShortcut.style.display = "none";
      //Views
      this.viewsPopupInsertViewsShortcut.style.display = "none";
      this.viewsPopupInsertFromControllerShortcut.style.display = "none"; //THIS IS CORRECT LIKE IT IS !!!
      this.viewsPopupImportFromFileShortcut.style.display = "none";
      this.viewsPopupAddFolderShortcut.style.display = "none";
      this.viewsPopupRenameFolderShortcut.style.display = "none";
      this.viewsPopupRemoveShortcut.style.display = "none";
      this.viewsPopupPopupShortcut.style.display = "none";
      this.viewsPopupTemplatesShortcut.style.display = "none";
      //Programs
      //Devices
      this.devicePopupNewDeviceShortcut.style.display = "none";
      this.devicePopupRemoveShortcut.style.display = "none";
      this.devicePopupOpenShortcut.style.display = "none";
      this.devicePopupAddShortcut.style.display = "none";
      this.devicePopupPropertiesShortcut.style.display = "none";
      this.devicePopupScanDeviceShortcut.style.display = "none";
      //View
      this.viewPopupOpenShortcut.style.display = "none";
      this.viewPopupRemoveShortcut.style.display = "none";
      this.viewPopupEditModeShortcut.style.display = "none";
      this.viewPopupInsertViewShortcut.style.display = "none";
      this.viewPopupInsertFromControllerShortcut.style.display = "none"; //THIS IS CORRECT LIKE IT IS !!!
      this.viewPopupExportToFileShortcut.style.display = "none";
      this.viewPopupImportFromFileShortcut.style.display = "none";
      this.viewPopupCopyShortcut.style.display = "none";
      this.viewPopupSetAsStartPageShortcut.style.display = "none";
      this.viewPopupSetAsMobileStartPageShortcut.style.display = "none";
      this.viewPopupPropertiesShortcut.style.display = "none";

      this.hideContentFooter(false);
    } else if (type === "builder") {
      //Network
      this.networkPopupLdapShortcut.style.display = "";
      //Server
      this.serversPopupRenameShortcut.style.display = "";
      this.serversPopupInsertSystemShortcut.style.display = "";
      this.serversPopupBackupAndRestoreShortcut.style.display = "";
      this.serversPopupTunnelSettingsShortcut.style.display = "";
      this.serversPopupNetworkSettingsShortcut.style.display = "";
      //System
      this.systemsPopupInsertSubSystemShortcut.style.display = "";
      this.systemsPopupRenameSystemShortcut.style.display = "";
      this.systemsPopupRemoveSystemShortcut.style.display = "";
      //SubSystem
      this.subSystemsPopupRenameSubSystemShortcut.style.display = "";
      this.subSystemsPopupUpdateSubSystemInformation.style.display = "";
      this.subSystemsPopupAddPVToSubSystem.style.display = "";
      this.subSystemsPopupRemoveSubSystemShortcut.style.display = "";
      //Views
      this.viewsPopupInsertViewsShortcut.style.display = "";
      this.viewsPopupInsertFromControllerShortcut.style.display = ""; //THIS IS CORRECT LIKE IT IS !!!
      this.viewsPopupImportFromFileShortcut.style.display = "";
      this.viewsPopupAddFolderShortcut.style.display = "none";
      this.viewsPopupRenameFolderShortcut.style.display = "";
      this.viewsPopupRemoveShortcut.style.display = "";
      this.viewsPopupPopupShortcut.style.display = "";
      this.viewsPopupTemplatesShortcut.style.display = "";
      //Programs
      //Devices
      this.devicePopupNewDeviceShortcut.style.display = "";
      this.devicePopupRemoveShortcut.style.display = "";
      this.devicePopupOpenShortcut.style.display = "";
      this.devicePopupAddShortcut.style.display = "";
      this.devicePopupPropertiesShortcut.style.display = "";
      this.devicePopupScanDeviceShortcut.style.display = "";
      //View
      this.viewPopupOpenShortcut.style.display = "";
      this.viewPopupRemoveShortcut.style.display = "";
      this.viewPopupEditModeShortcut.style.display = "";
      this.viewPopupInsertViewShortcut.style.display = "";
      this.viewPopupInsertFromControllerShortcut.style.display = ""; //THIS IS CORRECT LIKE IT IS !!!
      this.viewPopupExportToFileShortcut.style.display = "";
      this.viewPopupImportFromFileShortcut.style.display = "";
      this.viewPopupCopyShortcut.style.display = "";
      this.viewPopupSetAsStartPageShortcut.style.display = "";
      this.viewPopupSetAsMobileStartPageShortcut.style.display = "";
      this.viewPopupPropertiesShortcut.style.display = "";

      this.hideContentFooter(true);
    }
  }

  notImplementedDialog(text = "TODO is still not implemented") {
    new DialogWindow({
      title: i18next.t("warning"),
      text: text,
      onOk: function () {},
    });
  }

  addToReferenceHandler(uuid, obj) {
    this.addToHandler(this.referenceHandler, uuid, obj);
  }

  addToHandler(handler, uuid, obj) {
    if (handler.get(uuid) === undefined) handler.add(uuid, obj);
    else {
      handler.removeByKey(uuid);
      handler.add(uuid, obj);
    }
  }

  /**
   *
   * @param {*} startPos - is the position in the row where it starts to create cells
   * @param {*} element - is the row
   * @param {*} content - is an array which contains the strings to be insert in cell's
   * @param {*} css - is styles for the cells
   */
  insertCellTextContent(
    startPos,
    element,
    content,
    css = "pmp_css_table_cell"
  ) {
    let cell = null;
    let _this = this;
    const index = this.tableCells.length;
    _this.tableCells[index] = [];
    // startPos is 1 so the first field is null
    _this.tableCells[index][0] = null;

    content.forEach((text) => {
      cell = element.insertCell(startPos);
      cell.classList.add(css);
      cell.textContent = text;
      _this.tableCells[index][startPos] = cell;
      startPos++;
    });
  }

  getStatusIcon(status) {
    if (typeof status === "string") {
      if (status === "running" || status === "Running") {
        return `url('${diodeGreenPng}')`;
      } else {
        return `url('${diodeGrayPng}')`;
      }
    } else if (typeof status === "number") {
      if (status === 1) {
        return `url('${diodeGreenPng}')`;
      } else {
        return `url('${diodeGrayPng}')`;
      }
    }
  }

  hideContentFooter(hide) {
    if (hide === true) {
      this.objectContainerFooterRightContainer.style.display = "none";
      this.objectContainerFooterHorizontalSpacer.style.display = "none";
    } else {
      this.objectContainerFooterRightContainer.style.display = "flex";
      this.objectContainerFooterHorizontalSpacer.style.display = "";
    }
  }

  addContentFooter(parent) {
    this.objectContainerFooterHorizontalSpacer =
      this.addHorizontalSpacer(parent);
    this.objectContainerFooterRightContainer =
      this.addObjectContainerFooterRightContainer(parent);
  }

  getMachinePath(uuidPath, uuid, type) {
    let path =
      "/controllers/" +
      uuidPath[this.CONTROLLER] +
      "/systems/" +
      uuidPath[this.SYSTEM] +
      "/subsystems/" +
      uuidPath[this.SUBSYSTEM];

    if (type === "folder") {
      for (let i = this.VIEWS_CONTENT; i < uuidPath.length; i++) {
        path = path + "/" + type + "s/" + uuidPath[i];
      }
      path = path + "/folders/" + uuid;
    } else if (type === "pv") {
      for (let i = this.VIEWS_CONTENT; i < uuidPath.length; i++) {
        path = path + "/folders/" + uuidPath[i];
      }
      path = path + "/views/" + uuid;
    }
    return path;
  }

  //-------------------------------------------------------------
  //SUBSCRIBE
  //-------------------------------------------------------------

  tagsHandler(tags) {
    for (let tag of tags) {
      if (this.referenceHandler == null) return;

      const ref = this.referenceHandler.get(tag.uuid);
      if (
        typeof ref === "undefined" ||
        ref == null ||
        typeof tag.value === "undefined"
      )
        break;

      AppBuilder2.subscribedTags[tag.uuid] = tag;

      // enable / disable controllers and the subfolders
      if (tag.value === "1") {
        if (ref.type !== "pv") this.setContainerOpen(ref.parentFolder);
      } else {
        if (ref.type !== "pv") this.setContainerClosed(ref.parentFolder);
      }

      // check content table
      if (this.currentPvTreeIdPath.includes(tag.uuid) && tag.value === "0") {
        for (let row of this.objectsTable.table.rows) {
          row.style.pointerEvents = "none";
          row.style.opacity = "0.4";
        }
      } else {
        for (let row of this.objectsTable.table.rows) {
          row.style.pointerEvents = "All";
          row.style.opacity = "1";
        }
      }
    }
  }

  //-------------------------------------------------------------
  //STORE
  //-------------------------------------------------------------

  onChangeController(state) {
    this.subscribedControllers = state;
    switch (this.subscribedControllers.action.type) {
      case SET.CHAIN_ID: {
        this.changedSetChainId();
        break;
      }
      case UPDATE.CONTROLLER_NAME: {
        this.changedUpdateControllerName(state);
        break;
      }

      default: {
        //FIXME: TODO: here we get a actuell state when nothin changed
      }
    }
  }

  onChangeSystem(state) {
    this.subscribedSystems = state;

    switch (state.action.type) {
      case SET.SYSTEM_ID: {
        this.createSystemFolder(
          state.action.chainID,
          state.action.systemID,
          state.action.name
        );
        break;
      }
      case UPDATE.SYSTEM_ID: {
        this.clearTableBody();

        const array = this.getSelectedSystems(
          Store.getState().controller[state.action.chainID].systemIDs
        );
        if (array === undefined) return;

        this.updateSystemContentInTable(array);
        break;
      }
      case ADD.SYSTEM_ID: {
        this.communicator.sendGetFolder(
          state.action.systemID,
          state.action.chainID
        );
        break;
      }
      case DELETE.SYSTEM_ID: {
        this.changedDeleteSystemId(state);
        break;
      }
      default: {
        break;
      }
    }
  }

  onChangeSubSystem(state) {
    this.subscribedSubSystems = state;
    switch (this.subscribedSubSystems.action.type) {
      case SET.SUBSYSTEM_ID: {
        this.changedSetSubsystemId();
        break;
      }

      case ADD.SUBSYSTEM_ID: {
        this.changedAddSubSystemId(state);
        break;
      }

      case DELETE.SUBSYSTEM_ID: {
        this.changedDeleteSubSystemId(state);
        break;
      }

      case SET.DESCRIPTION: {
        this.changedSetDescription();
        break;
      }

      default: {
        //FIXME: TODO: here we get a actuell state when nothin changed
      }
    }
  }

  onChangePvTree(state) {
    this.subscribedPvTrees = state;

    switch (this.subscribedPvTrees.action.type) {
      case SET.PVTREE: {
        this.changedSetPvTree(state.action.subSystemID);
        break;
      }

      case UPDATE.PVTREE: {
        this.changedSetPvTree(state.action.subSystemID);
        break;
      }

      default: {
        //FIXME: TODO: here we get a actuell state when nothin changed
      }
    }
  }

  onChangePv = debounce(this.origOnChangePv, 500);

  origOnChangePv(state) {
    this.subscribedPvs = state;
    switch (this.subscribedPvs.action.type) {
      case SET.PV: {
        this.changedSetPv(state);
        break;
      }

      case ADD.PV: {
        this.changedAddPv(state);
        break;
      }

      case DELETE.PV: {
        this.changedDeletePv(state);
        break;
      }

      default: {
        //FIXME: TODO: here we get a actuell state when nothin changed
      }
    }
  }

  onChangeProgram(state) {
    this.subscribedPrograms = state;

    switch (state.action.type) {
      case SET.PROGRAM: {
        this.changedSetProgram(state);
        break;
      }

      default: {
        //FIXME: TODO: here we get a actuell state when nothin changed
      }
    }
  }

  onChangeDevice(state) {
    switch (state.action.type) {
      case SET.DEVICE: {
        clearTimeout(this.changedSetDeviceTimer);
        this.changedSetDeviceTimer = setTimeout(
          this.changedSetDevice.bind(this, state),
          300
        );
        break;
      }

      case DELETE.DEVICE: {
        this.changedDeleteDevice(state);
        break;
      }

      default: {
        //FIXME: TODO: here we get a actuell state when nothin changed
      }
    }
  }

  //-------------------------------------------------------------
  //STORE onChange reactions
  //-------------------------------------------------------------
  changedSetChainId() {
    this.createControllerFolder();
  }

  changedUpdateControllerName(state) {
    const ref = this.referenceHandler.get(state.action.chainID);
    ref.parentFolder.name = state.action.name;
    ref.parentFolder.folderName.textContent = state.action.name;
    this.clearTableBody();
    this.handleRootClick(null);
  }

  changedSetSubsystemId() {
    this.createSubSystemFolderWithDevicesProgramsViewsFolders();
    const selectedSubSystemArray = this.getSelectedSubSystems(
      this.subscribedControllers[this.subscribedSubSystems.action.chainID]
        .subSystemIDs
    );
    this.updateSubSystemContentInTable(selectedSubSystemArray);
  }

  changedAddSubSystemId(state) {
    this.createSubSystemFolderWithDevicesProgramsViewsFolders();
    const selectedSubSystemArray = this.getSelectedSubSystems(
      Store.getState().system[state.action.systemID].subSystemIDs
    );
    this.updateSubSystemContentInTable(selectedSubSystemArray);
  }

  changedSetDescription() {
    const subSystemID = this.subscribedSubSystems.action.subSystemID;
    const subSystem = this.referenceHandler.get(subSystemID);

    subSystem.parentFolder.name =
      this.subscribedSubSystems[subSystemID].description;
    subSystem.parentFolder.folderName.textContent =
      this.subscribedSubSystems[subSystemID].description;

    const selectedSubSystemArray = this.getSelectedSubSystems(
      this.subscribedControllers[this.subscribedSubSystems.action.chainID]
        .subSystemIDs
    );
    this.updateSubSystemContentInTable(selectedSubSystemArray);
  }

  changedDeleteSubSystemId(state) {
    const subSystem = this.referenceHandler.get(state.action.subSystemID);
    //removes the entry from the tree
    if (subSystem !== null) {
      subSystem.parentFolder.style.display = "none";
      subSystem.style.display = "none";
    }

    const selectedSubSystemArray = this.getSelectedSubSystems(
      Store.getState().system[state.action.systemID].subSystemIDs
    );
    this.updateSubSystemContentInTable(selectedSubSystemArray);
  }

  changedDeleteSystemId(state) {
    const system = this.referenceHandler.get(state.action.systemID);
    //removes the entry from the tree
    if (system !== null) {
      system.parentFolder.style.display = "none";
      system.style.display = "none";
    }
  }

  changedSetPvTree(subSystemID) {
    //get the view folder under subSystem
    if (typeof this.subscribedPvTrees.action === "undefined") return;

    const viewFolder = this.getSpecificFolder(subSystemID, "view");

    if (viewFolder == null) return;

    //clear the folder
    Common.clearElement(viewFolder);
    this.addPvTree(
      this.subscribedPvTrees[subSystemID],
      this.VIEWS_CONTENT,
      viewFolder
    );

    this.updatePvAndFolderContentInTable(null, subSystemID);
  }

  changedSetPv(state) {
    //this.updatePvAndFolderContentInTable(null, state.action.subSystemID);
    this.changedSetPvTree(state.action.subSystemID);
  }

  changedAddPv() {}

  changedDeletePv(state) {
    this.changedSetPvTree(state.action.subSystemID);
  }

  changedSetProgram() {
    console.log("========= changedSetProgram =========");
    //get the program folder under subSystem
    if (this.currentTarget == null) return;

    const parents = this.getParents(this.currentTarget);
    const programFolder = this.getSpecificFolder(
      parents[this.SUBSYSTEM],
      "program"
    );

    //clear the folder
    Common.clearElement(programFolder);

    const selectedProgramsArray = this.getSelectedProgramsFromStore(
      parents[this.SUBSYSTEM]
    );

    selectedProgramsArray.forEach((element) => {
      this.addFolder(
        programFolder,
        {
          uuid: element.content.guid,
          name: element.content.name.toUpperCase(),
          depth: this.PROGRAMS_CONTENT,
          pathName: element.content.path,
          description: element.content.description,
          draggable: false,
        },
        false,
        this.getStatusIcon(element.content.status),
        "program"
      );
      // here we add the type
      element.content.type = "program";
    });

    this.updateProgramContentInTable(selectedProgramsArray);
  }

  changedSetDevice() {
    console.log("========= changedSetDevice =========");
    //FIXME: TODO: @Michael
    //FIXME: remember to rename all this messy value names from native capital letter vs small letter
    //get the device folder under subSystem
    if (this.currentTarget == null) return;

    if (
      !(
        typeof this.currentTarget.type === "undefined" ||
        this.currentTarget.type === "device"
      )
    )
      return;

    let parents = null;
    let deviceFolder = null;
    if (typeof this.currentTarget.type === "undefined") {
      parents = this.getParents(this.currentTarget);
      deviceFolder = this.getSpecificFolder(parents[this.SUBSYSTEM], "device");
    } else if (this.currentTarget.type === "device") {
      parents = this.currentTarget.parents;
      deviceFolder = this.getSpecificFolder(parents[this.SUBSYSTEM], "device");
    }

    //clear the folder
    Common.clearElement(deviceFolder);

    const selectedDevicesArray = this.getSelectedDevicesFromStore(
      parents[this.SUBSYSTEM]
    );

    selectedDevicesArray.forEach((element) => {
      this.addFolder(
        deviceFolder,
        {
          uuid: element.content.uuid,
          name: element.content.deviceName.toUpperCase(),
          depth: this.PROGRAMS_CONTENT,
          pathName: element.content.path,
          description: element.content.description,
          draggable: false,
        },
        false,
        this.getStatusIcon(element.content.status),
        "device"
      );
      // here we add the type to the element
      element.content.type = "device";
    });

    this.updateDeviceContentInTable(selectedDevicesArray, parents);
  }

  changedDeleteDevice() {
    console.log("========= changedDeleteDevice =========");
    if (this.selectedTargetId == null) return;

    const deviceFolder = this.getSpecificFolder(
      this.selectedTargetId,
      "device"
    );

    //clear the folder
    Common.clearElement(deviceFolder);

    const selectedDevicesArray = this.getSelectedDevicesFromStore(
      this.selectedTargetId
    );

    selectedDevicesArray.forEach((element) => {
      this.addFolder(
        deviceFolder,
        {
          uuid: element.content.uuid,
          name: element.content.deviceName.toUpperCase(),
          depth: this.PROGRAMS_CONTENT,
          pathName: element.content.path,
          description: element.content.description,
          draggable: false,
        },
        false,
        this.getStatusIcon(element.content.status),
        "device"
      );
      // here we add the type to the element
      element.content.type = "device";
    });

    this.updateDeviceContentInTable(selectedDevicesArray);
  }

  //-------------------------------------------------------------
  //
  //-------------------------------------------------------------
  getSelectedSystems(array) {
    let retArray = [];
    array.forEach((element) => {
      retArray.push(this.subscribedSystems[element]);
    });
    return retArray;
  }

  getSelectedSubSystems(array) {
    let retArray = [];
    array.forEach((element) => {
      retArray.push(this.subscribedSubSystems[element]);
    });
    return retArray;
  }

  getSelectedProgramsFromStore(subSystemID) {
    let retArray = [];
    const state = Store.getState();
    state.subsystem[subSystemID].programIDs.forEach((element) => {
      retArray.push(state.program[element]);
    });
    return retArray;
  }

  getSelectedDevicesFromStore(subSystemID) {
    let retArray = [];
    const state = Store.getState();
    state.subsystem[subSystemID].deviceIDs.forEach((element) => {
      retArray.push(state.device[element]);
    });
    return retArray;
  }

  // long but precise
  createSubSystemFolderWithDevicesProgramsViewsFolders() {
    const _this = this;
    const parent = this.referenceHandler.get(
      this.subscribedSystems.action?.systemID
    );
    if (parent == null) return;

    const subSystemID = this.subscribedSubSystems.action.subSystemID;

    let found = false;
    Object.entries(_this.folderHandler.getObject()).forEach(([uuid]) => {
      if (uuid === subSystemID) {
        found = true;
        return;
      }
    });
    if (found) return;

    const container = this.addFolder(
      parent,
      {
        uuid: subSystemID,
        name: this.subscribedSubSystems[subSystemID].description,
        depth: this.SUBSYSTEM,
        pathName: "",
        draggable: false,
      },
      false,
      `url('${subsystemGray}')`,
      "subsystem"
    );

    if (
      typeof this.referenceHandler.get(subSystemID) !== "undefined" &&
      this.referenceHandler.get(subSystemID) !== null
    ) {
      //if the element exists clear it
      Common.clearElement(this.referenceHandler.get(subSystemID));
    }

    this.addToReferenceHandler(subSystemID, container);

    const folders = [];
    const views = this.addFolder(
      container,
      {
        uuid: Common.createUuidv4(),
        name: i18next.t("views").toUpperCase(),
        depth: this.VIEWS,
        pathName: "",
        draggable: false,
        clicked: false,
      },
      false,
      `url('${viewGray}')`,
      "view"
    );
    _this.setFolderAsExpandable(views, _this);
    folders.push(views);

    let programs = null;
    let devices = null;
    if (this.config.type !== "pickerResource") {
      programs = this.addFolder(
        container,
        {
          uuid: Common.createUuidv4(),
          name: i18next.t("programs").toUpperCase(),
          depth: this.VIEWS,
          pathName: "",
          draggable: false,
        },
        false,
        `url('${programGray24}')`,
        "program"
      );
      _this.setFolderAsExpandable(programs, _this);
      folders.push(programs);

      devices = this.addFolder(
        container,
        {
          uuid: Common.createUuidv4(),
          name: i18next.t("device_plural").toUpperCase(),
          depth: this.VIEWS,
          pathName: "",
          draggable: false,
        },
        false,
        `url('${deviceGray}')`,
        "device"
      );
      _this.setFolderAsExpandable(devices, _this);
      folders.push(devices);
    }

    _this.setFolderAsExpandable(container, _this);
    // add subsystem uuid with folders under it
    _this.folderHandler.add(subSystemID, folders);

    // add the references
    _this.addToReferenceHandler(views.parentFolder.uuid, views);
    if (this.config.type !== "pickerResource") {
      _this.addToReferenceHandler(programs.parentFolder.uuid, programs);
      _this.addToReferenceHandler(devices.parentFolder.uuid, devices);
    }
  }

  /**
   *
   */
  createSystemFolder = (chainId, systemId, name) => {
    const controller = this.referenceHandler.get(chainId);
    if (controller == null) return;

    let found = false;
    Object.entries(this.folderHandler.getObject()).forEach(([uuid]) => {
      if (uuid === systemId) {
        found = true;
        return;
      }
    });
    if (found) return;

    const folders = [];
    const container = this.addFolder(
      controller,
      {
        uuid: systemId,
        name: name,
        depth: this.SYSTEM,
        pathName: "",
        draggable: false,
      },
      false, //true,
      `url('${subsystemGray}')`,
      "system" //folder
    );
    folders.push(container);

    this.setFolderAsExpandable(container, this);
    this.folderHandler.add(systemId, folders);
    this.toggleFolder(container.parentFolder);
    this.setContainerOpen(container.parentFolder);

    if (
      typeof this.referenceHandler.get(systemId) !== "undefined" &&
      this.referenceHandler.get(systemId) !== null
    ) {
      //if the element exists clear it
      Common.clearElement(this.referenceHandler.get(systemId));
    }

    this.addToReferenceHandler(systemId, container);
    this.communicator.sendGetSubSystem(
      Store.getState().controller[chainId].name,
      systemId,
      chainId
    );
  };

  createControllerFolder() {
    let controllerContainer = null;
    const root = this.referenceHandler.get(this.ROOTUUID);
    const chainID = this.subscribedControllers.action.chainID;
    const name = this.subscribedControllers.action.name;

    //check at start time
    if (
      root == null ||
      typeof chainID === "undefined" ||
      typeof name === "undefined" ||
      this.referenceHandler.get(chainID)
    )
      return;

    controllerContainer = this.addFolder(
      root,
      {
        uuid: chainID,
        name: name,
        depth: this.CONTROLLER,
        pathName: this.subscribedControllers.action.url + "/",
        draggable: false,
      },
      false, //true,
      `url('${serverPng}')`,
      "controller"
    );

    this.setFolderAsExpandable(controllerContainer, this);

    let state = {};
    if (chainID !== Network.localController.chainId)
      state = otherStore.getState().tags.subscribedTags[chainID];

    if (
      typeof state !== "undefined" &&
      typeof state.value !== "undefined" &&
      state.value === 0
    ) {
      this.setContainerClosed(controllerContainer.parentFolder);
    } else {
      this.toggleFolder(controllerContainer.parentFolder);
      this.setContainerOpen(controllerContainer.parentFolder);
    }

    this.addToReferenceHandler(chainID, controllerContainer);

    this.communicator.sendGetFolder(undefined, chainID);

    AppBuilder2.subscribeToTags({
      uuid: chainID,
      chainId: this.communicator.localhostUuid,
    });
  }

  clearElementList() {
    this.elementList.forEach((element) => {
      Common.clearElement(element);
      if (
        typeof element.parentNode !== "undefined" &&
        element.parentNode !== null
      )
        element.parentNode.removeChild(element);
      element = null;
    });
    this.elementList = null;
  }

  syncSelectedElements(event, parentsOnly = false) {
    const ref = this.referenceHandler.get(event.currentTarget.uuid);
    if (ref != null) {
      this.currentTarget = ref.parentFolder;

      // select the correct line in the tree
      if (this.selectedTreeFolder !== this) {
        if (this.selectedTreeFolder != null)
          this.selectedTreeFolder.classList.remove("pmp_css_table_rowSelected");
        this.selectedTreeFolder = this.currentTarget;
        this.selectedTreeFolder.classList.add("pmp_css_table_rowSelected");
      }

      if (parentsOnly === false) {
        // open the folder in the tree
        if (
          this.currentTarget.curStatus === "closed" &&
          event.currentTarget.type !== "pv"
        ) {
          this.toggleFolder(this.currentTarget);
        }
      } else {
        if (
          event.currentTarget.type === "folder" ||
          event.currentTarget.type === "pv" ||
          event.currentTarget.type === "view"
        ) {
          // open the folder in the tree
          if (
            this.currentTarget.curStatus === "closed" &&
            event.currentTarget.type !== "pv"
          ) {
            this.toggleFolder(this.currentTarget);
          }
        }
      }

      // open the parent folder in the tree
      if (this.currentTarget.parentNode.parentFolder.curStatus === "closed") {
        this.toggleFolder(this.currentTarget.parentNode.parentFolder);
      }
      this.selectedTargetId = event.currentTarget.uuid;
    }
  }

  syncHeaderContentTextAndPath(event) {
    if (event.currentTarget.type === "folder") {
      const ref = this.referenceHandler.get(event.currentTarget.uuid);
      if (ref != null) {
        this.currentTarget = ref.parentFolder;
        this.currentPvTreeIdPath.push(event.currentTarget.uuid);
        this.objectContentHeaderText.textContent =
          this.objectContentHeaderText.textContent +
          this.currentTarget.textContent +
          "/";
      }
    } else if (event.currentTarget.type === "view") {
      const ref = this.referenceHandler.get(event.currentTarget.uuid);
      if (ref != null) {
        this.currentTarget = ref.parentFolder;
        this.currentPvTreeIdPath.push(
          event.currentTarget.parents[this.SUBSYSTEM]
        );
        this.objectContentHeaderText.textContent =
          this.objectContentHeaderText.textContent +
          this.currentTarget.name +
          "/";
      }
    }
  }

  setContainerOpen(container) {
    container.subContainer.style.display = "";
    container.openCloseIcon.style.backgroundImage = `url('${teListClosePng}')`;
    container.curStatus = "open";
    container.style.pointerEvents = "All";
    container.style.opacity = "1";
    container.tagStatus = "1";
  }

  setContainerClosed(container) {
    container.subContainer.style.display = "none";
    container.openCloseIcon.style.backgroundImage = `url('${teListOpenPng}')`;
    container.curStatus = "closed";
    container.style.pointerEvents = "none";
    container.style.opacity = "0.4";
    container.tagStatus = "0";
  }

  setObjectTagStatusStyle(obj, status) {
    if (status === "0") {
      obj.style.pointerEvents = "none";
      obj.style.opacity = "0.4";
    } else {
      obj.style.pointerEvents = "All";
      obj.style.opacity = "1";
    }
  }
}
