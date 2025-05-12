export type TServiceCreateInput = {
  name: string;
  description?: string;
  icon?: string;
};

export type TServiceUpdateInput = {
  serviceId: string;
  name?: string;
  description?: string;
  icon?: string;
};
