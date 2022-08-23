# Booking API
Simple bus reservation api  with [Typescript](https://www.typescriptlang.org), [Express](https://expressjs.com), [TypeORM](https://typeorm.io) and [Postgres](https://www.postgresql.org).

# Prerequisites
- Node
- Docker

# Project setup
```
npm install
```

Change `NODE_ENV` to `prod` if you want to test building prod version locally.

```yaml
NODE_ENV=dev
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_INSTANCE=postgres
DB_SYNCHRONIZE=true
JWT_SECRET=secret
```

# Run docker compose for Postgres DB
```
docker-compose up
```

# Start dev server and seed database with initial data
```
npm run dev
```

# Run tests 
```
npm run test
```

# Lint code to detect issues
```
npm run lint
```
# Build code for production
Make sure your `NODE_ENV` is set to `prod`.
```
npm run build
```

# Login to receive jwt token for subsequent request - session valide for 2 min  then user will have to login again 

```bash
POST http://localhost:3000/api/auth/login
```
```json
{
    "Email": "admin@bRS.com",
    "password": "admin"
}
```
### Use token from login repsone in the auth header for subsequent request
```
token
```

# make reservation

```bash
POST http://localhost:3000/api/Reservations/
```
```json

	{
   "seatnumbers":    ["A1","B2","A3","B5","Bb" , "B8"], 
   "pickup": "cairo",
   "destination" : "alex"

}
```
# Get most frequanlty  used destantion per user  

```bash
GET http://localhost:3000/api/Reservations/getfreq
```

# # confirm reservation - reservation should be confirmed withen 2 min or will be cancel automaicaly 

```bash
post http://localhost:3000/api/Reservations/confirm
```
```json
{
	{
"ticketnumbers": ["1","2"],
 "confirmed":"true"
  }
}
```
# Get all destinations

```bash
GET http://localhost:3000/api/destinations
```

# Get avalible seats per destination 

```bash
GET http://localhost:3000/api/seats
```

