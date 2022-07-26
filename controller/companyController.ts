import Company from '../models/Company.ts'
import {CompanyCollection} from '../config/db_Config.ts'
import bcrypt from '../config/bcrypt_Config.ts'
import { ObjectId } from "https://deno.land/x/mongo@v0.31.0/mod.ts";

export const AddCompany = async(req:any,res:any)=>{
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
}

export const loginCompany = async (req:any, res:any) => {
    try {
        const {Name,Password} = req.parsedBody
        const isCompanyRegistered = await CompanyCollection.findOne({Name})
        if(!isCompanyRegistered){
            return res.setStatus(400).json({data:"This account is not registered, signup to proceedfurther",error: true})
        }
        const isPasswordSame = await bcrypt.compare(Password,isCompanyRegistered.Password)
        if(!isPasswordSame){
            return res.setStatus(200).json({data:"Wrong password"})
        }

        return res.setStatus(200).json({data: isCompanyRegistered,error:false })
    } catch (error) {
        console.log('Company login error: ', error)
        return res.setStatus(500).json({data:error,error:true})
    }
}

export const getAllCompanies = async(req:any,res:any)=>{
    try {
        const resp = await CompanyCollection.find().toArray();
        return res.setStatus(200).json({data:resp,error:false})
    } catch (error) {
        console.log('Company getAll error: ', error)
        return res.setStatus(500).json({data:error,error:true})
    }
}

export const getCompanyById = async(req:any,res:any)=>{
    try {
        console.log('id: ',req.params.id)
        const resp = await CompanyCollection.findOne({_id: new ObjectId(req.params.id)})

        return res.setStatus(200).json({data:resp,error:false})
    } catch (error) {
        console.log('Company get by id error: ', error)
        return res.setStatus(500).json({data:error,error:true})
    }
}
