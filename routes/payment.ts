import { Router } from "https://deno.land/x/opine@2.2.0/mod.ts";
import {addpayment, getAllPayments, getPaymentById, updatepayment, deletepayment} from '../controller/paymentController.ts'

const router = Router()

router
    .post('/add',addpayment)
    .get('/getAllpayments/',getAllPayments)
    .get('/getById/:id',getPaymentById)
    .put('/updateById/:id',updatepayment)
    .delete('/delete/:id',deletepayment)

export default router