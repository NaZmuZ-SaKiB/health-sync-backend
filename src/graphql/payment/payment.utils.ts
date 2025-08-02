import { TPaymentInitInput } from "./payment.type";
import config from "../../config";

const getPaymentData = (info: any) => {
  const data = {
    store_id: config.ssl.storeId as string,
    store_passwd: config.ssl.storePassword as string,
    total_amount: info?.amount,
    currency: "BDT",
    tran_id: info.appointmentId,
    success_url: config.ssl.successUrl as string,
    fail_url: config.ssl.failUrl as string,
    cancel_url: config.ssl.cancelUrl as string,
    ipn_url: "http://localhost:3030/ipn",
    product_name: info.service,
    product_category: "Health Care",
    product_profile: "general",
    cus_name: info.name,
    cus_email: info.email,
    cus_add1: info.address,
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: info.phone,
    cus_fax: "01711111111",
    ship_name: info.name,
    ship_add1: info.email,
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  return data;
};

export const utils = {
  getPaymentData,
};
