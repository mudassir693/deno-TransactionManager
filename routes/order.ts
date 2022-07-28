import { Router } from "https://deno.land/x/opine@2.2.0/mod.ts";
import {addOrder, getAllOrders, getOrderById, updateOrder, deleteOrder} from '../controller/orderController.ts'

const router = Router()

router
    .post('/add',addOrder)
    .get('/getAllpayments/',getAllOrders)
    .get('/getById/:id',getOrderById)
    .put('/updateById/:id',updateOrder)
    .delete('/delete/:id',deleteOrder)

export default router