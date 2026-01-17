npm install
cp .env
createdb money_transfer_db
psql -U postgres -d money_transfer_db -f database/schema.sql
npm run dev