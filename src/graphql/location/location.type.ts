export type TLocationCreateInput = {
  name: string;
  mapUrl: string;
  address: string;
  phoneNumber: string;
  description?: string;
  image?: string;
};

export type TLocationUpdateInput = Partial<TLocationCreateInput> & {
  locationId: string;
};
