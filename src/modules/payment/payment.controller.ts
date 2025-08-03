import { RequestHandler } from "express";
import config from "../../config";
import axios from "axios";
import { PaymentService } from "./payment.service";
import { PAYMENT_STATUS } from "@prisma/client";

const success: RequestHandler = async (req, res) => {
  const validationId = req.body.val_id;
  const validationUrl = `${config.ssl.validationUrl}?val_id=${validationId}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePassword}&format=json`;

  const response = await axios({
    method: "get",
    url: validationUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  let queryString: string;

  if (response.data.status === "VALID") {
    queryString = `?status=success&amount=${req.body?.amount}`;
  } else {
    queryString = `?status=failed&amount=${req.body?.amount}`;
  }

  const paymentDetails = {
    status: response.data.status,
    paymentMethod: req.body?.card_type,
    transactionId: req.body?.bank_tran_id,
    amount: req.body?.amount,
    storeAmount: req.body?.store_amount,
    validationId: req.body?.val_id,
    date: req.body?.tran_date,
    currency: req.body?.currency,
  };

  await PaymentService.updatePayment(req.body.tran_id, {
    status: PAYMENT_STATUS.COMPLETED,
    details: JSON.stringify(paymentDetails),
    transactionId: req.body?.bank_tran_id,
  });

  res.redirect((config.ssl.payment_result_page as string) + queryString);
};

const fail: RequestHandler = async (req, res) => {
  const queryString = `?status=failed&amount=${req.body?.amount}`;

  await PaymentService.updatePayment(req.body.tran_id, {
    status: PAYMENT_STATUS.FAILED,
  });

  res.redirect((config.ssl.payment_result_page as string) + queryString);
};

const cancel: RequestHandler = (_, res) => {
  const queryString = `?status=cancelled`;

  res.redirect((config.ssl.payment_result_page as string) + queryString);
};

export const PaymentController = {
  success,
  fail,
  cancel,
};
