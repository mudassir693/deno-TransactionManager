console.log('deno server is running..')

import { opine,json } from "https://deno.land/x/opine@2.2.0/mod.ts";
import companyRoute from './routes/company.ts'

const app = opine()

app.use(json())


app.get('/',(req:any,res:any) => {
    try {
        return res.setStatus(200).json({data:"we help you to manage your Buisness.",error:false})
    } catch (error) {
        console.log('server connection error: ', error)
        return res.setStatus(200).json({data:error,error:true})
    }
})

app.use('/api/companies/',companyRoute)

app.listen(5000,()=>{
    console.log('server is running on port 5000.')
})