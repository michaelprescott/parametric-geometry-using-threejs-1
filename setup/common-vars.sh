#!/bin/zsh
## ----------------------------------------------------------------------------
START_TIME=`date '+%Y-%m-%d %H:%M:%S'`

SCRIPT_FILE_PATH=${0:a}
SCRIPT_DIR=${0:a:h}
SCRIPT_DIR_REL=${0%/*}
SCRIPT_PARENT_DIR=${SCRIPT_DIR%/*}
SCRIPT_PARENT_DIR_REL=${SCRIPT_DIR_REL%/*}/
SCRIPT_FILE_PATH_REL=${0}
SCRIPT_FILE_NAME=$SCRIPT_FILE_PATH_REL:t
SCRIPT_FILE_NAME_ORIGINAL="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"
SCRIPT_FILE_NAME_NO_EXT=$SCRIPT_FILE_PATH:t:r
SCRIPT_FILE_NAME_EXT=$SCRIPT_FILE_PATH:t:e

PROJECT_DIR=$SCRIPT_PARENT_DIR
PROJECT_DIR_REL=$SCRIPT_PARENT_DIR_REL

STAGE_DIR=${REPO_ROOT_DIR}/stage

HR_DASHED="-------------------------------------------------------------------------------"
HR_EQUALS="==============================================================================="
HR_STARS="*******************************************************************************"


echo -e "-------------------------------------------------------------------------------"
echo -e "Common Vars"
echo -e "-------------------------------------------------------------------------------"
echo -e "START_TIME:                '$START_TIME'"
echo -e "REPO_ROOT_DIR:             '$REPO_ROOT_DIR'"
echo -e "SCRIPT_FILE_PATH:          '$SCRIPT_FILE_PATH'"
echo -e "SCRIPT_DIR:                '$SCRIPT_DIR'"
echo -e "SCRIPT_DIR_REL:            '$SCRIPT_DIR_REL'"
echo -e "SCRIPT_PARENT_DIR:         '$SCRIPT_PARENT_DIR'"
echo -e "SCRIPT_FILE_PATH_REL:      '$SCRIPT_FILE_PATH_REL'"
echo -e "SCRIPT_PARENT_DIR_REL:     '$SCRIPT_PARENT_DIR_REL'"
echo -e "SCRIPT_FILE_NAME:          '$SCRIPT_FILE_NAME'"
echo -e "SCRIPT_FILE_NAME_ORIGINAL: '$SCRIPT_FILE_NAME_ORIGINAL'"
echo -e "SCRIPT_FILE_NAME_NO_EXT:   '$SCRIPT_FILE_NAME_NO_EXT'"
echo -e "SCRIPT_FILE_NAME_EXT:      '$SCRIPT_FILE_NAME_EXT'"
echo -e "STAGE_DIR:                 '$STAGE_DIR'"
echo -e "PROJECT_DIR:               '${AQUA}${PROJECT_DIR}'"
echo -e "PROJECT_DIR_REL:           '${AQUA}${PROJECT_DIR_REL}'"
echo -e "HR_DASHED: '${HR_DASHED}'"
echo -e "HR_EQUALS: '${HR_EQUALS}'"
echo -e "HR_STARS:  '${HR_STARS}'"
echo -e "==============================================================================="


## NOTES
## -----
## The developer could have created a symlink to this script.
## SCRIPT_FILE_NAME_ORIGINAL may be different than SCRIPT_FILE_NAME. If the *ORIGINAL
## filename is different, SCRIPT_FILE_NAME is a link and ORIGINAL is the original script.
## REFERENCE: https://stackoverflow.com/a/192337
## 
## Get the filename without the extension by combining two path modifiers :t and :r
## Get just the extension by combining :t and :e path modifiers
## ============================================================================
