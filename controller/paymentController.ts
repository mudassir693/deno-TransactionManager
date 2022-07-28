import {PaymentCollection} from '../config/db_Config.ts'
import Payment from '../models/Payment.ts'
import { ObjectId } from "https://deno.land/x/mongo@v0.31.0/mod.ts";

export const addpayment = async (req:any,res:any)=>{
    try {
        const {SerialNumber,Type, Date, Amount, LedgerId} = req.parsedBody
        const newPayment:Payment = {
            SerialNumber,
            Type,
            Date, 
            Amount, 
            LedgerId
        }

        const resp = await PaymentCollection.insertOne(newPayment)

        return res.setStatus(200).json({data:resp,error:false})
    } catch (error) {
        console.log('payment Add Error: ', error)
        return res.setStatus(500).json({data:error,error:true})
    }
}

export const getAllPayments = async (req:any,res:any)=>{
    try {
        const resp = await PaymentCollection.find().toArray()
        return res.setStatus(200).json({data:resp,error:false})
    } catch (error) {
        console.log('get all payments error: ',error)
        return res.setStatus(500).json({data:error,error:true})
    }
}

export const getPaymentById = async(req:any,res:any)=>{
    try {
        const resp = await PaymentCollection.findOne({_id: new ObjectId(req.params.id)})
        return res.setStatus(200).json({data:resp,error:false})
    } catch (error) {
        console.log('get payment by id error: ',error)
        return res.setStatus(500).json({data:error,error:true})
    }
}

export const updatepayment = async(req:any,res:any)=>{
    try {
        const resp = await PaymentCollection.updateOne({_id: new ObjectId(req.params.id)},{$set:req.parsedBody})
        return res.setStatus(200).json({data:resp,error:false})
    } catch (error) {
        console.log('Update payment error: ',error)
        return res.setStatus(500).json({data:error,error:true})
    }
}

export const deletepayment = async (req:any,res:any) => {
    try{
        const resp = await PaymentCollection.deleteOne({_id: new ObjectId(req.params)})
        return res.setStatus(200).json({data:resp,error:false})

    }catch(error){
        console.log('get all payments error: ',error)
        return res.setStatus(500).json({data:error,error:true})
    }
}