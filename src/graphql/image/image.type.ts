export type TImageCreateInput = {
  name: string;
  publicId: string;
  height: number;
  width: number;
  format: string;
  url: string;
  secureUrl: string;
  thumbnailUrl: string;
};
export type TImageUpdateInput = {
  imageId: string;
  name: string;
};
