#!/bin/bash

# Check if stripe command is installed
if ! [ -x "$(command -v stripe)" ]; then
  echo 'Error: stripe command not found' >&2
  exit 1
fi

# Check if port 300
