# Checklist Features

- [x] list all transations
- [x] add new transation
  - [ ] informe not saved transation to user 
- [x] connect to bkd API
- [ ] select category
- [x] search:
  - [x] transation
  - [x] category
  - [x] name
  - [x] price
- [x] show income(solde) :
  - [ ] of mointhly
  - [ ] since -> to
- [x] show outcome(expenses) :
  - [ ] of mointhly
  - [ ] since -> to
- [ ] authnticatin


* Transition :
  - id : uuid,
  - description: string
  - type : "income" || "outcome" || "saving"
  - category: string(alimentcao, convivio, ...)
  - price : Float(positivo somente)
  - owner: "talisma" || "geovana"
  - createdAt: date