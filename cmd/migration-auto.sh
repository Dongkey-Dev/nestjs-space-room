echo "==============="
echo "Auto Migration"
echo "==============="

echo "deload docker-compose..."
docker-compose down
sleep 1

echo "remove localdb and migrations..."
rm -rf ./localdb/dev_mysql/*

echo "load docker-compose..."
docker-compose up -d
sleep 8

echo "generate migration..."
yarn migration:dev:generate -- src/database/migrations/dev/First

echo "run migration..."
yarn migration:dev:run

echo "done"
