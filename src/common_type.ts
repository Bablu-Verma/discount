export interface IUser {
    id: string;
    name: string;
    phone: string;
    email: string;
    dob: string;
    gender: string;
    token: string;
    profile: string | null;
}

export interface IUserAddress {
  house_no: string;
  landmark: string;
  street?: string;
  area?: string;
  city_village: string;
  state: string;
  pincode: string;
  country: string;
}