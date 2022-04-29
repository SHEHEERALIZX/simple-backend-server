mkdir -p mongo/db1
mkdir -p mongo/db2

mongod --port 2727 --dbpath mongo/db2 --replSet MyReplica