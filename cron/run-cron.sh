#!/bin/sh

ENV_PATH=/root/env.sh

printenv | sed '/affinity:container/d' | awk '{print "export " $1}' > ${ENV_PATH}
/usr/sbin/cron -f
