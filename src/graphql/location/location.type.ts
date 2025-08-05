export type TLocationCreateInput = {
  name: string;
  mapUrl: string;
  address: string;
  phoneNumber: string;
  description?: string;
  imageId?: string;
};

export type TLocationUpdateInput = Partial<TLocationCreateInput> & {
  locationId: string;
};
