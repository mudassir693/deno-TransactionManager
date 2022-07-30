import {ledgerCollection} from '../config/db_Config.ts'
import Ledger from '../models/Ledger.ts'
import { ObjectId } from "https://deno.land/x/mongo@v0.31.0/mod.ts";


export const addLedger =async (req:any, res:any)=>{
    try {
        const {TransactionType,Balance,PreviousBalance,Credit,Debit,Dated} = req.parsedBody

    

        const newLedger:Ledger = {
            TransactionType,
            Balance,
            PreviousBalance,
            Credit,
            Debit,
            Dated
        }

        const getAllLedgers = await ledgerCollection.find().toArray()

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
        const today = new Date().toDateString()
        console.log("today: ",today)
        const resp = await ledgerCollection.find().toArray();
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

