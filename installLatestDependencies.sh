# This script can be used to update the package.json with the latest PALRINGO + TEST
# Still must check that the versions work as expected, though!

# Note that I haven't done any other production dependencies, these can be done on a need-to-use basis
# IMPORTANT!!!! Check package-lock.json for the sway bug - see the following for more info:
# [https://palringo.atlassian.net/wiki/spaces/AR/pages/3086800/Build+a+Microservice]

NODE_VER="$(cat Dockerfile | grep node: | awk '{print $2}' | sed -e 's/node://')"

nvm install $NODE_VER

npm i --save \
@palringo/cache \
@palringo/constants \
@palringo/db \
@palringo/error \
@palringo/logger \
@palringo/message-queue \
@palringo/verify

npm i --save-dev \
@palringo/eslint-config \
dockerode eslint \
eslint-plugin-classes \
eslint-plugin-promise \
mocha \
nock \
supertest
