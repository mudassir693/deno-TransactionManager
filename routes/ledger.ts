import { Router } from "https://deno.land/x/opine@2.2.0/mod.ts";
import {addLedger,getAllLedgers} from '../controller/ledgerController.ts';


const router = Router()

router
    .post('/add',addLedger)
    .get('/getAll',getAllLedgers)

export default router
