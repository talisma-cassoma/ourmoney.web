# Checklist Features

- [x] list all transations
- [x] add new transation
- [ ] connect to bkd API
- [x] select category
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


Transition :
  - id : uuid,
  - description": string,
  - type": "income" || "outcome" || "saving",
  - category": string(alimentcao, convivio, ...etc),
  - price : number,
  - owner: "talisma" || "geovana"
  - createdAt: date

