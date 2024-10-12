export type WidgetId = string | number;

type WidgetLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export interface Widget extends Partial<WidgetLayout> {
  i: WidgetId;
  type: WidgetType;
  config: object;
}

type DashboardContent = {
  layouts: ReactGridLayout.Layouts;
  widgets: Widget[];
};

export interface Dashboard {
  uuid: string;
  name: string;
  content: DashboardContent;
  is_public: boolean;
  is_active: boolean;
  user_uuid?: string;
}

export interface UpdateDashboardInput
  extends Pick<Dashboard, "content" | "user_uuid"> {
  name?: string;
  is_public?: boolean;
  is_active?: boolean;
}
export interface CreateDashboardInput
  extends Omit<Dashboard, "uuid" | "user_uuid"> {}

export type WidgetType = "blog" | "stock" | "plot" | "reading" | "news";
