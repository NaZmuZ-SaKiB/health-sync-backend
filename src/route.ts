import { Router } from "express";
import { PaymentRouter } from "./modules/payment/payment.route";

const MainRouter = Router();

type TRoute = {
  path: string;
  router: Router;
};

const routes: TRoute[] = [
  {
    path: "/payment",
    router: PaymentRouter,
  },
];

routes.map((route) => MainRouter.use(route.path, route.router));

export default MainRouter;
