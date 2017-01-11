#!/usr/bin/env node

const _ = require('lodash')
const fs = require('fs')
const YAML = require('yamljs')

function buildHead(title, sep) {
    var time =  new Date().toISOString()
    return `# Distributed Ledger Technology Dojo (DLTDOJO) ${sep}# https://github.com/y12studio/dltdojo${sep}# ${title}${sep}# DATETIME:${time}${sep}`
}

function buildAlias(name, peers, vpid) {
    var r = [
        `DCNAME=${name}`, `alias dc='docker-compose -p $DCNAME -f $DCNAME-peers.yml'`, `alias dcup='dc stop && dc rm && dc up -d && dc scale ${vpid}1=${peers-1}'`
    ]
    _.range(peers).forEach(function(e, i, a) {
        // alias vp0sh='docker exec -i -t ${DCN}_vp0_1'
        var vpname = i == 0 ? `${vpid}${i}_1` : `${vpid}1_${i}`
        r.push(`VP${i}ID=$\{DCNAME\}_${vpname}`)
        r.push(`alias vp${i}='docker exec -it $VP${i}ID'`)
    })
    return r
}


function BitcoinCore() {}

function EthereumGo() {}

BitcoinCore.prototype.buildDojoAlias = function() {
    var name = this.name
    var peers = this.peers
    var r = buildAlias(name, peers, 'bvp')
    _.range(peers).forEach(function(e, i, a) {
        r.push(`alias vp${i}cli='vp${i} bitcoin-cli -conf=/opt/btc/bitcoin.conf -regtest -rpcport=18332'`)
    })
    return buildHead(`BitcoinCore alias script, name:${name}, peers:${peers}`, '\n') + r.join('\n')
}

BitcoinCore.prototype.buildDojoPeer = function() {
    var name = this.name
    var img = this.img
    var dc = {
        version: '2',
        services: {
            bvp: {
                image: img,
                expose: ['18332', '18333'],
                command: 'bitcoind -regtest -txindex -port=18333 -conf=/opt/btc/bitcoin.conf -datadir=/opt/btc/data -rpcport=18332 -addnode=bvp0:18333'
            }
        }
    }
    return buildHead(`BitcoinCore peer yml file ,  name:${name}`, '\r\n') + YAML.stringify(dc, 4, 2)
}

BitcoinCore.prototype.buildDojoPeers = function() {
    var name = this.name
    var peers = this.peers
    var dc = {
        version: '2',
        services: {}
    }
    _.range(2).forEach(function(e, i, a) {
        var vpid = `bvp${i}`
        var peerfile = `${name}-peer.yml`
        dc.services[vpid] = {
            extends: {
                file: peerfile,
                service: 'bvp'
            },
            hostname: vpid
        }
    })
    return buildHead(`BitcoinCore peers yml file ,name:${name}, peers:${peers}`, '\r\n') + YAML.stringify(dc, 4, 2)
}

BitcoinCore.prototype.buildDojo = function(img, path, name, peers) {
    this.name = name
    this.peers = peers
    this.img = img
    var strPeer = this.buildDojoPeer()
    var strPeers = this.buildDojoPeers()
    var strAlias = this.buildDojoAlias()
    fs.writeFileSync(`${path}/${name}-peer.yml`, strPeer);
    fs.writeFileSync(`${path}/${name}-peers.yml`, strPeers);
    fs.writeFileSync(`${path}/${name}-alias.sh`, strAlias);
}

EthereumGo.prototype.buildDojo = function(img, path, name, peers) {
    this.name = name
    this.peers = peers
    this.img = img
    var strPeer = this.buildDojoPeer()
    var strPeers = this.buildDojoPeers()
    var strAlias = this.buildDojoAlias()
    fs.writeFileSync(`${path}/${name}-peer.yml`, strPeer);
    fs.writeFileSync(`${path}/${name}-peers.yml`, strPeers);
    fs.writeFileSync(`${path}/${name}-alias.sh`, strAlias);
}

EthereumGo.prototype.buildDojoPeer = function() {
    var name = this.name
    var peers = this.peers
    var img = this.img
    var devmod = peers <= 2 ? '--dev' : ''
        // bootnodes url IP address only. DNS name(evp0) are not allowed.
        // "tail -f /dev/null" keep evp running for all time
    var rpcopts = '--rpc --rpccorsdomain="*" --rpcaddr="0.0.0.0" --rpcapi "miner,admin,db,personal,eth,net,web3" --ipcdisable'
    var networkid = _.random(100001,999999)
    var dc = {
        version: '2',
        services: {
            evp: {
                image: img,
                entrypoint: '/start.sh',
                command: `${devmod} --networkid=${networkid} ${rpcopts} --datadir=~/.ethereum/devchain --bootnodes="enode://288b97262895b1c7ec61cf314c2e2004407d0a5dc77566877aad1f2a36659c8b698f4b56fd06c4a0c0bf007b4cfb3e7122d907da3b005fa90e724441902eb19e@XXX:30303"`
            },
            bootnode: {
                image: img,
                command: `${devmod} --networkid=${networkid} ${rpcopts} --datadir=~/.ethereum/devchain --nodekeyhex=091bd6067cb4612df85d9c1ff85cc47f259ced4d4cd99816b14f35650f59c322`
            }
        }
    }
    return buildHead(`EthereumGo peer yml file ,  name:${name}`, '\r\n') + YAML.stringify(dc, 4, 2)
}

EthereumGo.prototype.buildDojoPeers = function() {
    var name = this.name
    var peers = this.peers
    var dc = {
        version: '2',
        services: {}
    }
    _.range(2).forEach(function(e, i, a) {
        var vpid = `evp${i}`
        var peerfile = `${name}-peer.yml`
        dc.services[vpid] = {
            extends: {
                file: peerfile,
                service: i == 0 ? 'bootnode' : 'evp'
            },
            hostname: vpid
        }
    })
    return buildHead(`EthereumGo peers yml file ,name:${name}, peers:${peers}`, '\r\n') + YAML.stringify(dc, 4, 2)
}

EthereumGo.prototype.buildDojoAlias = function() {
    var name = this.name
    var peers = this.peers
    var r = buildAlias(name, peers, 'evp')
    _.range(peers).forEach(function(e, i, a) {
        // vp1 /curlrpc.sh
        r.push(`alias vp${i}curl='vp${i} /curlrpc.sh'`)
        r.push(`alias vp${i}cli='vp${i} node index.js'`)
    })
    return buildHead(`EthereumGo alias script, name:${name}, peers:${peers}`, '\n') + r.join('\n')
}

function main() {
    var argv = require('yargs')
        .usage('Usage: $0 --dojo.btc=[num] --dojo.eth=[num] --path=[string] --name=[string]')
        .demandOption(['dojo', 'name'])
        .default('path', '/tmp')
        .default('btcimg', 'y12docker/dltdojo-bitcoin')
        .default('ethimg', 'y12docker/dltdojo-ethgo')
        .argv
        // console.log(argv)
    var dojo = argv.dojo
    if (dojo.btc) {
        var bc = new BitcoinCore()
        bc.buildDojo(argv.btcimg, argv.path, argv.name, dojo.btc)
    } else if (dojo.eth) {
        var eth = new EthereumGo()
        eth.buildDojo(argv.ethimg, argv.path, argv.name, dojo.eth)
    } else {
        console.log(argv)
    }
}

main()
