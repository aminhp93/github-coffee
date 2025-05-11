#!/bin/bash

# Directories to include in the search
include_dirs="@core features pages stories tests"

# Count the number of "eslint-disable" comments in the specified directory
count=$(grep -ir  "eslint-disable" $include_dirs | wc -l)

echo "$count number of eslint-disable comments"

# Check if the count exceeds the threshold
if [[ $count -gt 8 ]]; then
    echo "Too many eslint-disable comments"
    exit 1
fi

echo "eslint-disable comments are OK"
exit 0