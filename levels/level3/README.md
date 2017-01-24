## Level3A hyperledger fabric 資產轉移
目前fabric-ca還在1.0改版中，這裡提供簡易概念練習無權限設定。
#### T0 設定使用編號
根據編號切換操作節點，這裡設定為控制節點fabp1。
```
$ DLTDOJOID=1
```
#### T1 建立頻道ch1並加入
```
$ fabp peer channel create -c ch1
$ fabp peer channel join -b ch1.block
```
#### T2 將其他節點fabp2/fabp3加入該ch1頻道
```
$ fabp sh -c "export CORE_PEER_ADDRESS=fabp2:7051 ; peer channel join -b ch1.block"
$ fabp sh -c "export CORE_PEER_ADDRESS=fabp3:7051 ; peer channel join -b ch1.block"
```
#### T3 部署範例合約取名mycc1，內有預設a,b兩帳號，並有初始餘額100與200
```
$ fabp peer chaincode deploy -C ch1 -n mycc1 -p github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02 -c '{"Args":["init","a","1000","b","2000"]}'
```
#### T4 查詢合約帳號餘額
```
$ fabp peer chaincode query -C ch1 -n mycc1 -c '{"Args":["query","a"]}'
$ fabp peer chaincode query -C ch1 -n mycc1 -c '{"Args":["query","b"]}'
```
#### T4 從帳號a轉資產數量100到b
```
$ fabp peer chaincode invoke -C ch1 -n mycc1 -c '{"Args":["invoke","a","b","100"]}'
```
#### T5 查閱合約碼
```
$ fabp cat /opt/gopath/src/github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02/chaincode_example02.go
```
## SETUP Level3A
```
$ mkdir level3 ; cd level3
$ docker run -v $(pwd):/tmp y12docker/dltdojo build --dojo.fab 6 --name 3a
$ source alias3a.sh
$ dcup
// do the 3A tasks
$ dcend
```

## LINKS

2016年区块链技术回顾与总结：联盟链与公有链的分道扬镳 http://www.infoq.com/cn/articles/review-and-summary-of-chain-technology-in-2016