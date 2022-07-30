import {ledgerCollection} from '../config/db_Config.ts'
import Ledger from '../models/Ledger.ts'

export const addLedger =async (req:any, res:any)=>{
    try {
        const {TransactionType,Balance,PreviousBalance,Credit,debit,Date} = req.parsedBody

        const newLedger:Ledger = {
            TransactionType,
            Balance,
            PreviousBalance,
            Credit,
            debit,
            Date
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
            return new Date(a.Date).getTime() - new Date(b.Date).getTime()
        })

        return res.setStatus(200).json({data:resp3})
    } catch (error) {
        console.log(error)
        return res.status(500).json({data:error})
    }
}

