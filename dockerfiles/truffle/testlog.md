### 2017-02-23T17:55:19+0800
```
$ docker build -t y12docker/dltdojo-truffle .
```
### 2017-02-03T15:39:10+0800
```
$ docker build -t y12docker/dltdojo-truffle .
$ docker run -d y12docker/dltdojo-truffle testrpc
$ docker ps
$ docker exec -it cb1c267319dd bash
# mkdir foo ; cd foo ;  truffle init ; truffle test
# truffle migrate
Compiling ./contracts/ConvertLib.sol...
Compiling ./contracts/MetaCoin.sol...
Compiling ./contracts/Migrations.sol...
Writing artifacts to ./build/contracts

Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  Migrations: 0xfc63139cf227d9f228792be44e74adbdd1037fe2
Saving successful migration to network...
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying ConvertLib...
  ConvertLib: 0x35427face2bd83f58db48a89c08872f3b5c97ac4
  Linking ConvertLib to MetaCoin
  Deploying MetaCoin...
  MetaCoin: 0x110c7d89f7e3b2ed0622816b0fca0a50aa05777e
Saving successful migration to network...
Saving artifacts...
# truffle console
```
