---

database-plugin: basic

---

%% dbfolder:yaml
name: new database
description: new description
columns:
  __file__:
    key: "__file__"
    input: "markdown"
    label: "File"
    accessorKey: "__file__"
    isMetadata: "true"
    skipPersist: "false"
    isDragDisabled: "false"
    csvCandidate: "true"
    isHidden: "false"
    sortIndex: "-1"
    config:
      enable_media_view: "true"
      media_width: "100"
      media_height: "100"
      isInline: "true"
      task_hide_completed: "true"
  __modified__:
    key: "__modified__"
    input: "calendar_time"
    label: "Modified"
    accessorKey: "__modified__"
    isMetadata: "true"
    isDragDisabled: "false"
    skipPersist: "false"
    csvCandidate: "true"
    isHidden: "false"
    sortIndex: "-1"
    config:
      enable_media_view: "true"
      media_width: "100"
      media_height: "100"
      isInline: "false"
      task_hide_completed: "true"
  __tasks__:
    key: "__tasks__"
    input: "task"
    label: "Task"
    accessorKey: "__tasks__"
    isMetadata: "true"
    isDragDisabled: "false"
    skipPersist: "false"
    csvCandidate: "false"
    width: "186"
    isHidden: "false"
    sortIndex: "-1"
    config:
      enable_media_view: "true"
      media_width: "100"
      media_height: "100"
      isInline: "false"
      task_hide_completed: "true"
  cssclass:
    input: "text"
    accessorKey: "cssclass"
    key: "cssclass"
    label: "cssclass"
    position: "100"
    skipPersist: "false"
    isHidden: "false"
    sortIndex: "-1"
    config:
      enable_media_view: "true"
      media_width: "100"
      media_height: "100"
      isInline: "false"
      task_hide_completed: "true"
  usage:
    input: "text"
    accessorKey: "usage"
    key: "usage"
    label: "usage"
    position: "100"
    skipPersist: "false"
    isHidden: "false"
    sortIndex: "-1"
    config:
      enable_media_view: "true"
      media_width: "100"
      media_height: "100"
      isInline: "false"
      task_hide_completed: "true"
config:
  remove_field_when_delete_column: "true"
  cell_size: "normal"
  sticky_first_column: "false"
  group_folder_column: 
  show_metadata_created: "false"
  show_metadata_modified: "true"
  show_metadata_tasks: "true"
  source_data: "current_folder"
  source_form_result: "root"
  frontmatter_quote_wrap: "true"
  row_templates_folder: "88-Template"
  current_row_template: 
  pagination_size: "10"
  show_metadata_inlinks: "false"
  show_metadata_outlinks: "false"
  source_destination_path: "/"
  formula_folder_path: "/"
  inline_default: "false"
  inline_new_position: "top"
  date_format: "yyyy-MM-dd"
  datetime_format: "yyyy-MM-dd HH:mm:ss"
  remove_empty_folders: "false"
  automatically_group_files: "false"
  hoist_files_with_empty_attributes: "true"
  enable_js_formulas: "false"
filters:
  enabled: false
  conditions:
%%