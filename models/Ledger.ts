interface Ledger {
    TransactionType:string // Order or Payment,
    Balance:number
    PreviousBalance:number
    Credit:number|string
    debit:number|string
    Date:string
}

export default Ledger