# Distributed Ledger Technology Dojo (DLTDOJO)
# https://github.com/y12studio/dltdojo
DCNAME=devmdb
alias dc='docker-compose -p $DCNAME'
alias dcstop='dc stop && dc rm -f'
alias dcup='dcstop && dc up -d'
alias dexec1='docker exec -it ${DCNAME}_mariadb1_1'
alias dmysql='dexec1 mysql'
alias dexec2='docker exec -it ${DCNAME}_mariadb2_1'
