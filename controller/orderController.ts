import {OrderCollection} from '../config/db_Config.ts'
import Order from '../models/Order.ts'
import { ObjectId } from "https://deno.land/x/mongo@v0.31.0/mod.ts";

export const addOrder = async (req:any,res:any)=>{
    try {
        const {OrderId, Date, Amount, LedgerId} = req.parsedBody
        const newOrder:Order = {
            OrderId,
            Date, 
            Amount, 
            LedgerId
        }

        const resp = await OrderCollection.insertOne(newOrder)

        return res.setStatus(200).json({data:resp,error:false})
    } catch (error) {
        console.log('Order Add Error: ', error)
        return res.setStatus(500).json({data:error,error:true})
    }
}

export const getAllOrders = async (req:any,res:any)=>{
    try {
        const resp = await OrderCollection.find().toArray()
        return res.setStatus(200).json({data:resp,error:false})
    } catch (error) {
        console.log('get all Order error: ',error)
        return res.setStatus(500).json({data:error,error:true})
    }
}

export const getOrderById = async(req:any,res:any)=>{
    try {
        const resp = await OrderCollection.findOne({_id: new ObjectId(req.params.id)})
        return res.setStatus(200).json({data:resp,error:false})
    } catch (error) {
        console.log('get order by id error: ',error)
        return res.setStatus(500).json({data:error,error:true})
    }
}

export const updateOrder = async(req:any,res:any)=>{
    try {
        const resp = await OrderCollection.updateOne({_id: new ObjectId(req.params.id)},{$set:req.parsedBody})
        return res.setStatus(200).json({data:resp,error:false})
    } catch (error) {
        console.log('Update payment error: ',error)
        return res.setStatus(500).json({data:error,error:true})
    }
}

export const deleteOrder = async (req:any,res:any) => {
    try{
        const resp = await OrderCollection.deleteOne({_id: new ObjectId(req.params)})
        return res.setStatus(200).json({data:resp,error:false})

    }catch(error){
        console.log('get all payments error: ',error)
        return res.setStatus(500).json({data:error,error:true})
    }
}