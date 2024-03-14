#!/bin/bash

# Change to the directory where this script is located
cd "$(dirname "$0")" || exit

# Use a function to perform the sed replacements,
# so we don't have to repeat the same command for each replacement.
replace_in_file() {
  local file=$1
  local search=$2
  local replace=$3
  shift 3 || exit
  sed -i "$@" "s/${search}/${replace}/g" "${file}"
}

# Perform the replacements
replace_in_file schema.prisma 'mysql' 'sqlite'
replace_in_file schema.prisma 'postgres' 'sqlite'
replace_in_file schema.prisma '@db.Text' ''

