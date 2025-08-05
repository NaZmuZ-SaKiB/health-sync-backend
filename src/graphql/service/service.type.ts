export type TServiceCreateInput = {
  name: string;
  description?: string;
  iconId?: string;
};

export type TServiceUpdateInput = {
  serviceId: string;
  name?: string;
  description?: string;
  iconId?: string;
};
