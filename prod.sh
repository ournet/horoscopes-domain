#!/bin/bash

yarn unlink @ournet/domain

yarn upgrade --latest

yarn add @ournet/domain

yarn test
