export type TSpecialtyCreate = {
  name: string;
  description?: string;
  icon?: string;
};

export type TSpecialtyUpdate = Partial<TSpecialtyCreate> & {
  specialtyId: string;
};
