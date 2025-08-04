export type TSpecialtyCreate = {
  name: string;
  description?: string;
  iconId?: string;
};

export type TSpecialtyUpdate = Partial<TSpecialtyCreate> & {
  specialtyId: string;
};
