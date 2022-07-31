interface Ledger {
    CompanyId:string,
    RetailerId:string,
    TransactionType:string // Order or Payment,
    Balance:number
    PreviousBalance:number
    Credit:number|string
    Debit:number|string
    Dated:string
}

export default Ledger