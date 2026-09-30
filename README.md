# Sistema-PRIP
#execute 

docker compose up --build

#em seguida execute

docker exec -it cti-back npx sequelize-cli db:migrate
