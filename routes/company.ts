import { Router } from "https://deno.land/x/opine@2.2.0/mod.ts";
import {AddCompany,loginCompany,getCompanyById, getAllCompanies} from '../controller/companyController.ts'


const router = Router()

router
    .post('/add',AddCompany)
    .post('/login',loginCompany)
    .get('/',getAllCompanies)
    .get('/getById/:id',getCompanyById)

export default router