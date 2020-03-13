const roles = {
  ADMIN: 1,
  DEFAULT_USER: 2,
};

const defaultUserData = {
  imageSrc: null,
  imageName: process.env.default_user_image,
  email: null,
  name: null,
  gender: null,
  data_birthday: null,
  addresses: [],
  role: roles.DEFAULT_USER,
  uid: null,
  created_at: null,
};

const defaultProductData = {
  imageSrc: null,
  imageName: process.env.default_product_image,
  name: null,
  creator_id: null,
  category_id: null,
  price: null,
  target: null,
  weight: null,
  id: null,
  created_at: null,
};

const defaultCategoryData = {
  name: null,
  creator_id: null,
  id: null,
  created_at: null,
};

export {
  defaultUserData,
  defaultProductData,
  defaultCategoryData,
  roles,
};
