import { Router } from "https://deno.land/x/opine@2.2.0/mod.ts";
import Company from '../models/Company.ts'
import {CompanyCollection} from '../config/db_Config.ts'
import bcrypt from '../config/bcrypt_Config.ts'

const router = Router()

router.post('/add',async(req:any,res:any)=>{
    try {
        const {Name,Email,Password,CreatedDate} = req.parsedBody

        const isCompanyRegistered = await CompanyCollection.findOne({Name})
        if(isCompanyRegistered){
            return res.setStatus(400).json({data:"company with this email is already registered",error:true})
        }
        const newPassword = await bcrypt.hash(Password)

        const newCompany:Company = {
            Name,
            Email,
            Password: newPassword,
            CreatedDate
        }

        const resp = await CompanyCollection.insertOne(newCompany)
        return res.setStatus(201).json({data:resp,error:false})
    } catch (error) {
        console.log('Company adderror: ', error)
        return res.setStatus(500).json({data:error,error:true})
    }
})

export default router