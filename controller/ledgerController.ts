import {ledgerCollection} from '../config/db_Config.ts'
import Ledger from '../models/Ledger.ts'
import { ObjectId } from "https://deno.land/x/mongo@v0.31.0/mod.ts";


export const addLedger =async (req:any, res:any)=>{
    try {
        const {CompanyId,RetailerId,TransactionType,Balance,PreviousBalance,Credit,Debit,Dated} = req.parsedBody

    

        const newLedger:Ledger = {
            CompanyId,
            RetailerId,
            TransactionType,
            Balance,
            PreviousBalance,
            Credit,
            Debit,
            Dated
        }

        const getAllLedgers = await ledgerCollection.find({$and:[{CompanyId},{RetailerId}]}).toArray()

        const sortedledgers = getAllLedgers.sort((a:any,b:any) => {
            // console.log(new Date(a.Date).getTime())
            // console.log(new Date(b.Date).getTime())
            // console.log('after comparision: ', new Date(a.Dated).getTime() - new Date(b.Dated).getTime())
            return (new Date(a.Dated).getTime() - new Date(b.Dated).getTime())
        })
        let previousArray :Ledger[] = []
        let nextArray :Ledger[] = []

        sortedledgers.forEach( (ledger:Ledger) => {
            if(new Date(ledger.Dated).getTime() < new Date(newLedger.Dated).getTime()) {
                previousArray.push(ledger)
            }else{
                nextArray.push(ledger)
            }
        })

        // 
        let payment:number = 0
        let order:number = 0
        let balance:number = 0

        previousArray.forEach(eachArr=>{
            if(eachArr.TransactionType == "Payment"){
                payment += eachArr.Debit
            }else{
                order += eachArr.Credit
            }
        })
        balance = payment - order
        // 

        // 
        var difference = 0

        if(newLedger.TransactionType=="Payment"){
            difference = newLedger.Debit
        }else{
            difference = newLedger.Credit * -1
        }


        if(previousArray.length==0){
            if(newLedger.TransactionType=="Payment"){
                newLedger.Balance = newLedger.Debit
            }else{
                newLedger.Balance = newLedger.Credit * -1
            }
            newLedger.PreviousBalance = 0

            // update next Orders
            nextArray.forEach(async (eachledger)=>{
                eachledger.Balance = eachledger.Balance + difference
                eachledger.PreviousBalance = eachledger.PreviousBalance + difference
                await ledgerCollection.updateOne({_id: new ObjectId(eachledger._id)},{$set: eachledger})
            })
            const resp = await ledgerCollection.insertOne(newLedger)
            return res.setStatus(200).json({data:"at start",error:false})
        }

        if(previousArray.length>0&&nextArray.length>0){

            if(newLedger.TransactionType=="Payment"){
                newLedger.Balance = balance + newLedger.Debit
            }else{
                newLedger.Balance = balance + (newLedger.Credit * -1)
            }
            newLedger.PreviousBalance = balance


            nextArray.forEach(async (eachledger)=>{
                eachledger.Balance = eachledger.Balance + difference
                eachledger.PreviousBalance = eachledger.PreviousBalance + difference

                await ledgerCollection.updateOne({_id: new ObjectId(eachledger._id)},{$set: eachledger})
            })
            // return res.setStatus(200).json({data:"at middle",error:false})
        }
        if(nextArray.length==0){
            const resp = await ledgerCollection.insertOne(newLedger)
            return res.setStatus(200).json({data:"inserted at end",error:false})
        }
        const resp = await ledgerCollection.insertOne(newLedger)

        return res.setStatus(200).json({data:resp,error:false})
    } catch (error) {
        console.log('add ledger error: ', error)
        return res.setStatus(500).json({data:error,error:true})
    }
}

export const getAllLedgers = async(req:any,res:any)=>{
    try {
        
        // console.log(CompanyId, " ", RetailerId)
        const today = new Date().toDateString()
        console.log("today: ",today)
        const resp = await ledgerCollection.find({$and:[{CompanyId:req.params.companyId},{RetailerId:req.params.retailerId}]}).toArray();
        console.log(resp)
        const resp3 = resp.sort((a:any,b:any) => {
            // console.log(new Date(a.Date).getTime())
            // console.log(new Date(b.Date).getTime())
            // console.log('after comparision: ', new Date(a.Date).getTime() - new Date(b.Date).getTime())
            return new Date(a.Dated).getTime() - new Date(b.Dated).getTime()
        })

        return res.setStatus(200).json({data:resp3})
    } catch (error) {
        console.log(error)
        return res.status(500).json({data:error})
    }
}

export const getRetailerBalance =async(req:any , res:any)=>{
    try {
        const resp = await ledgerCollection.find({$and:[{CompanyId: req.params.companyId},{RetailerId: req.params.retailerId}]}).toArray()

        let payment:number = 0
        let order:number = 0
        let balance:number = 0
        resp.forEach((eachLedger:Ledger)=>{
            if(eachLedger.TransactionType=="Payment"){
                payment += eachLedger.Debit
            }else {
                order += eachLedger.Credit
            }
        })

        balance = payment - order

        return res.setStatus(200).json({data:balance,error:false})

    } catch (error) {
        console.log('getretailerbalance: ',error)
        return res.setStatus(500).json({data:error, error:false})
    }
}

export const deleteLedger = async (req:any ,res:any)=>{
    try {
        const requestedLedger = await ledgerCollection.findOne({_id: new ObjectId(req.params.id)})

        let difference:number;

        if(requestedLedger.TransactionType="Payment"){
            difference = requestedLedger.Debit * -1
        }else{
            difference = requestedLedger.Credit
        }

        const getAllLedger = await ledgerCollection.find({$and:[{CompanyId: requestedLedger.CompanyId},{RetailerId: requestedLedger.RetailerId}]}).toArray()

        const getSortedArray = getAllLedger.sort((a:Ledger,b:Ledger) => new Date(a.Dated).getTime() - new Date(b.Dated).getTime() )

        let previousArray = []
        let nextArray:Ledger[] = []
        let place:number ;


        getSortedArray.forEach((eachledger:Ledger,id:number)=>{
            if(eachledger._id == req.params.id){
                place = id
            }
            if(new Date(eachledger.Dated).getTime() > new Date(requestedLedger.Dated).getTime()){
                nextArray.push(eachledger)
            }
        })

        console.log('nextArray: ',nextArray)

        nextArray.forEach(async (eachledger:Ledger)=>{
            eachledger.Balance = eachledger.Balance + difference
            eachledger.PreviousBalance = eachledger.PreviousBalance + difference

            console.log('eachledger : ', eachledger._id,' ', eachledger)

            await ledgerCollection.updateOne({_id:eachledger._id},{$set: eachledger})
        })

        const deleteLedger = await ledgerCollection.deleteOne({_id:new ObjectId(req.params.id)})

        return res.setStatus(200).json({data:"Delete",error:false})

    } catch (error) {
        console.log('delete ledger array: ', error)
        return res.setStatus(500).json({data:error,error:true})
    }
}


