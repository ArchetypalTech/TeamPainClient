#!/usr/bin/env bash

set -euo pipefail

# Change the current working directory to the parent directory of the script
pushd "$(dirname "$0")/.." >/dev/null

# set some defaults
# your likely going to want to change this to whatever/where-ever
# you have cloned out the contract code
base_contract_path="../tot"

function usage() {
    echo "Usage: $0 [-h] [-c arg] [-d local_dest]  <contracts_project_path>"
    echo "If present the env vars DOJO_PROJ and SV_DEST will be used"
    echo "If <contracts_project_path> is passed then this will override the DOJO_PROJ var if present"
    echo "If -d flag is passed then this will override the SV_PROJ env var if present."
    echo "where SV_DEST is the destination for the contract manifest files"
    echo "SV_DEST defaults to src/manifest"
    echo "If neither is passed then display this help message"
    echo "  -h  Display this help message."
    echo "  -c  Specify a commit hash to use to compare manifests against"
    echo "      This value is read by default from a .chash file if present"
    echo "      Otherwise versions are ignored and all manifest files will"
    echo "      be copied"
    echo "  -d  Specify a destination for the contract manifest files. Sets/overrides SV_DEST"
}

while getopts "hc:" opt; do
    case $opt in
        h)
            usage
            exit 0
            ;;
        c)
            c_hash=${OPTARG}
            ;;       
        d)
            d_path=${OPTARG}
            ;;
        :)  echo "Option -$OPTARG requires an argument." >&2; exit 1 ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            usage
            exit 1
            ;;
    esac
done

shift $((OPTIND-1))  # Remove processed options from the positional parameters

function err_handler() {
  popd >/dev/null
  echo "Command $1 failed: $2"
  exit 1
}

function set_env() {
    if [ "${DOJO_PROJ+set}" = "set" ]; then
        if [ -n "$DOJO_PROJ" ]; then
            echo "DOJO_PROJ is non-empty."
        else
            echo "DOJO_PROJ is set but empty."
        fi
    else
        # error case: no env and no path parameter
        echo "DOJO_PROJ is not set"
        echo "No contracts path given"
        echo "Searching default for project @ $(pwd)/../tot/"
        dojo_targ=$(find ../tot -type d -name "target")
        DOJO_PROJ=$(find "$dojo_targ" -type d -name "dev")
    fi
}

# we dont interact directly with models because the world store takes
# care of that so we only need systesm for the front end to be able to
# use the contract ABI's
# we assume dev as the traget, this may need to be amended
function get_systems() {
    echo "Searching for root at $1"
    readarray -t systems < <(find "$1/target/dev" -type f -name "*::systems::*.json")
    # Iterate over the array
    for file in "${systems[@]}"; do
        echo "Processing file: $file"
    done
}

# handle non optional command args
# and locate some files or die
set +u
if [ -z "$1" ]; then
    set_env
else
    get_systems $1
fi

if [ -z $DOJO_PROJ ]; then
        err_handler $0 "Could not locate a dojo project"
fi
set -u
# function err_handler() {
#   popd >/dev/null
#   echo "Command $1 \n\tfailed: $2"
#   exit 1
# }

echo "Continuing...."