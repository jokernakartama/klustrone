enum loc {
  ACTION_CANCEL = 'Cancel',
  ACTION_PURGE = 'Purge trash',
  ACTION_INFO = 'Resource info',
  ACTION_MAKEDIR = 'Make a dir',
  ACTION_PASTE = 'Paste',
  ACTION_CUT = 'Cut',
  ACTION_COPY = 'Copy',
  ACTION_RENAME = 'Rename',
  ACTION_COPY_PUBLIC_LINK = 'Copy public link',
  ACTION_DOWNLOAD = 'Download',
  ACTION_REMOVE = 'Remove',

  PROPERTY_PUBLIC = 'Public',

  DIALOG_NEW_NAME = 'Enter new name',
  DIALOG_NEW_DIR = 'Enter the directory name',
  DIALOG_CONFIRM_REMOVE = 'Remove the resource?',
  DIALOG_SERVICE_UNMOUNTED = 'The service is not mounted, would you like to mount it?',
  DIALOG_SERVICE_UPDATED = 'The service is mounted now, would you like to display the directory resources?',
  DIALOG_CONFIRM = 'Confirm',
  DIALOG_TOKEN_RECIEVED = 'Token has been recieved',
  DIALOG_TOKEN_NOT_RECIEVED = 'Cannot recieve a token from the url',

  SORT_ASCENDING = 'Ascending',
  SORT_DESCENDING = 'Descending',
  SORT_BY_NAME = 'Sort by name',
  SORT_BY_SIZE = 'Sort by size',
  SORT_BY_TYPE = 'Sort by type',
  SORT_BY_PUBLIC = 'Sort by publicity',

  VIEW_TILE = 'Tile',
  VIEW_LIST = 'List',

  SERVICE_MOUNT = 'Mount',
  SERVICE_UNMOUNT = 'Unmount',
  SERVICE_REMOUNT = 'Remount',

  RESOURCE_LABEL_TRASH = 'TRASH',
  RESOURCE_LABEL_PARENT = '...',

  // mobile labels
  M_ACTION_PANEL_UPDATE_BUTTON = 'UPDT',
  M_ACTION_PANEL_VIEW_BUTTON = 'VIEW',
  M_ACTION_PANEL_SORT_BUTTON = 'SORT',
  M_ACTION_PANEL_ACTIONS_BUTTON = 'ACTN',
  M_CHOOSE_SERVICE = 'Push'
}

export default loc
