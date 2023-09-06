import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dmxxun0ct',
      api_key: '761645667449385',
      api_secret: 'CpF8P9bjGhc_hrEpc8oXDllkJjU',
    });
  },
};
