export interface Item {
  id: string;
  content: string;
  start: string;
  extraData: {
    description: string | null;
  };
  type: string;
}
