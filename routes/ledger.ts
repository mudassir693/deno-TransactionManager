import { Router } from "https://deno.land/x/opine@2.2.0/mod.ts";
import {addLedger,getAllLedgers,getRetailerBalance,deleteLedger} from '../controller/ledgerController.ts';


const router = Router()

router
    .post('/add',addLedger)
    .get('/getAll/:companyId/:retailerId',getAllLedgers)
    .get('/getretailerbalance/:companyId/:retailerId',getRetailerBalance)
    .delete('/deleteLedger/:id',deleteLedger)

export default router
