#!/usr/bin/env bash
set -euo pipefail

# Change the current working directory to the parent directory of the script
pushd "$(dirname "$0")/.." >/dev/null

# set some defaults
# your likely going to want to change this to whatever/where-ever
# you have cloned out the contract code
base_contract_src="../tot"
base_contract_dest="src/manifest"

function usage() {
    echo "Usage: $0 [-h] [-c arg] [-d local_dest]  <contracts_project_path>"
    echo "If present the env vars DOJO_PROJ and FE_DEST will be used"
    echo "If <contracts_project_path> is passed then this will override the DOJO_PROJ var if present"
    echo "If -d flag is passed then this will override the FE_DEST env var if present."
    echo "where FE_DEST is the destination for the contract manifest files"
    echo "FE_DEST defaults to src/manifest"
    echo "If neither is passed then display this help message"
    echo "  -h  Display this help message."
    echo "  -c  Specify a commit hash to use to compare manifests against"
    echo "      This value is read by default from a .chash file if present"
    echo "      Otherwise versions are ignored and all manifest files will"
    echo "      be copied"
    echo "  -d  Specify a destination for the contract manifest files. Sets/overrides SV_DEST"
}

while getopts "hc:d:" opt; do
    case $opt in
        h)
            usage
            exit 0
            ;;
        c)
            c_hash="${OPTARG}"
            ;;       
        d)
            d_path="${OPTARG}"
            ;;
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

    if [[ ! -z "$DOJO_PROJ" ]]; then
        echo "Found cairo project at $DOJO_PROJ"
    else
         err_handler "find cairo project $DOJO_PATH" "path not found"
    fi
}

function set_local_dest() {
    # have we set the -d flag? 
    if [[ ! -z $d_path ]]; then
        FE_DEST=$d_path
        echo "Using -d $d_path option for systems: $FE_DEST"
    fi

    # have we set and ENV var?
    if [ -z "${d_path}" ] && [ -n "${FE_DEST}" ]; then
        FE_DEST=$FE_DEST
        echo "Using ENV FE_DEST for systems: $FE_DEST"
    fi

    # use the default
    if [ -z $d_path ] && [ -z $FE_DEST ]; then
        FE_DEST=$base_contract_dest
        echo "Using default destination for systems: $FE_DEST"
    fi
    
    if [[ ! -e $FE_DEST ]]; then
            err_handler "find: $FE_DEST" "file not found"
        fi
}

# we dont interact directly with models because the world store takes
# care of that so we only need systesm for the front end to be able to
# use the contract ABI's
# we assume dev as the traget, this may need to be amended
function mv_systems() {
    echo "Searching for root at $1"
    readarray -t systems < <(find "$1/target/dev" -type f -name "*::systems::*.json")

    # set the local path
    set_local_dest

    # Iterate over the array
    for file in "${systems[@]}"; do
        echo "Processing file: $file"
        f_path="${file##*/}"
        f_name="system_${f_path##*::}"
        # copy the files into the local project
        cp "${file}" "${FE_DEST}/${f_name}"
    done
}


function run() {
    if [ -z "$1" ]; then
        # we didnt get passed anything as an arg so we just use some
        # default values to find the src and dst paths
        set_env
    else
        mv_systems $1
    fi
}
# handle non optional command args
# and locate some files or die
set +u
run "$@"
set -u