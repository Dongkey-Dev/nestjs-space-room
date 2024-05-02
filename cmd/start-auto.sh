echo "==============="
echo "  Auto Start"
echo "==============="

if ! docker info &> /dev/null; then
  echo 'Error: docker is not running.' >&2
  exit 1
fi

if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

docker-compose up -d
yarn install
echo "waiting for mysql to start..."
sleep 7

yarn migration:dev:generate src/database/migrations/dev/First
yarn migration:dev:run
yarn start:dev