/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

 /**
 * @ngdoc function
 * @name forms.function:Groups
 * @description This form is for adding/editing a Group on the inventory page
*/

export default ['NotificationsList', 'i18n', function(NotificationsList, i18n){

    var notifications_object = {
        name: 'notifications',
        index: false,
        basePath: "notifications",
        include: "NotificationsList",
        title: i18n._('Notifications'),
        iterator: 'notification',
        disabled: "source === undefined || source.value === ''",
        generateList: true,
        ngClick: "$state.go('inventories.edit.inventory_sources.edit.notifications')"
        // search: {
        //     "or__job__inventory": ''
        // }
    };
    let clone = _.clone(NotificationsList);
    notifications_object = angular.extend(clone, notifications_object);
return {
    addTitle: 'CREATE SOURCE',
    editTitle: '{{ name }}',
    showTitle: true,
    name: 'inventory_source',
    basePath: 'inventory_sources',
    parent: 'inventories.edit.sources',
    // the parent node this generated state definition tree expects to attach to
    stateTree: 'inventories',
    tabs: true,
    // form generator inspects the current state name to determine whether or not to set an active (.is-selected) class on a form tab
    // this setting is optional on most forms, except where the form's edit state name is not parentStateName.edit
    activeEditState: 'inventories.edit.inventory_sources.edit',
    detailsClick: "$state.go('inventories.edit.inventory_sources.edit')",
    well: false,
    fields: {
        name: {
            label: 'Name',
            type: 'text',
            ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)',
            required: true,
            tab: 'properties'
        },
        description: {
            label: 'Description',
            type: 'text',
            ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)',
            tab: 'properties'
        },
        source: {
            label: 'Source',
            type: 'select',
            ngOptions: 'source.label for source in source_type_options track by source.value',
            ngChange: 'sourceChange(source)',
            ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)',
            ngModel: 'source'
        },
        credential: {
            label: 'Credential',
            type: 'lookup',
            list: 'CredentialList',
            basePath: 'credentials',
            ngShow: "source && source.value !== ''",
            sourceModel: 'credential',
            sourceField: 'name',
            ngClick: 'lookupCredential()',
            awRequiredWhen: {
                reqExpression: "cloudCredentialRequired",
                init: "false"
            },
            ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)',
            watchBasePath: "credentialBasePath"
        },
        project: {
            // initializes a default value for this search param
            // search params with default values set will not generate user-interactable search tags
            label: 'Project',
            type: 'lookup',
            list: 'ProjectList',
            basePath: 'projects',
            ngShow: "source && source.value === 'scm'",
            sourceModel: 'project',
            sourceField: 'name',
            ngClick: 'lookupProject()',
            awRequiredWhen: {
                reqExpression: "source && source.value === 'scm'",
                init: "false"
            },
            ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)',
            watchBasePath: "projectBasePath"
        },
        inventory_file: {
            label: i18n._('Inventory File'),
            type:'select',
            ngOptions: 'file for file in inventory_files track by file',
            ngShow: "source && source.value === 'scm'",
            ngDisabled: "!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd) || disableInventoryFileBecausePermissionDenied",
            id: 'inventory-file-select',
            awRequiredWhen: {
                reqExpression: "source && source.value === 'scm'",
                init: "true"
            },
            column: 1,
            awPopOver: "<p>" + i18n._("Select the inventory file to be synced by this source.  You can select from the dropdown or enter a file within the input.") + "</p>",
            dataTitle: i18n._('Inventory File'),
            dataPlacement: 'right',
            dataContainer: "body",
            includeInventoryFileNotFoundError: true
        },
        source_regions: {
            label: 'Regions',
            type: 'select',
            ngOptions: 'source.label for source in source_region_choices track by source.value',
            multiSelect: true,
            ngShow: "source && (source.value == 'rax' || source.value == 'ec2' || source.value == 'gce' || source.value == 'azure' || source.value == 'azure_rm')",


            dataTitle: 'Source Regions',
            dataPlacement: 'right',
            awPopOver: "<p>Click on the regions field to see a list of regions for your cloud provider. You can select multiple regions, " +
                "or choose <em>All</em> to include all regions. Tower will only be updated with Hosts associated with the selected regions." +
                "</p>",
            dataContainer: 'body',
            ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)'
        },
        instance_filters: {
            label: 'Instance Filters',
            type: 'text',
            ngShow: "source && source.value == 'ec2'",
            dataTitle: 'Instance Filters',
            dataPlacement: 'right',
            awPopOver: "<p>Provide a comma-separated list of filter expressions. " +
                "Hosts are imported to Tower when <em>ANY</em> of the filters match.</p>" +
                "Limit to hosts having a tag:<br />\n" +
                "<blockquote>tag-key=TowerManaged</blockquote>\n" +
                "Limit to hosts using either key pair:<br />\n" +
                "<blockquote>key-name=staging, key-name=production</blockquote>\n" +
                "Limit to hosts where the Name tag begins with <em>test</em>:<br />\n" +
                "<blockquote>tag:Name=test*</blockquote>\n" +
                "<p>View the <a href=\"http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeInstances.html\" target=\"_blank\">Describe Instances documentation</a> " +
                "for a complete list of supported filters.</p>",
            dataContainer: 'body',
            ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)'
        },
        group_by: {
            label: 'Only Group By',
            type: 'select',
            ngShow: "source && source.value == 'ec2'",
            ngOptions: 'source.label for source in group_by_choices track by source.value',
            multiSelect: true,
            dataTitle: 'Only Group By',
            dataPlacement: 'right',
            awPopOver: "<p>Select which groups to create automatically. " +
                "Tower will create group names similar to the following examples based on the options selected:</p><ul>" +
                "<li>Availability Zone: <strong>zones &raquo; us-east-1b</strong></li>" +
                "<li>Image ID: <strong>images &raquo; ami-b007ab1e</strong></li>" +
                "<li>Instance ID: <strong>instances &raquo; i-ca11ab1e</strong></li>" +
                "<li>Instance Type: <strong>types &raquo; type_m1_medium</strong></li>" +
                "<li>Key Name: <strong>keys &raquo; key_testing</strong></li>" +
                "<li>Region: <strong>regions &raquo; us-east-1</strong></li>" +
                "<li>Security Group: <strong>security_groups &raquo; security_group_default</strong></li>" +
                "<li>Tags: <strong>tags &raquo; tag_Name &raquo; tag_Name_host1</strong></li>" +
                "<li>VPC ID: <strong>vpcs &raquo; vpc-5ca1ab1e</strong></li>" +
                "<li>Tag None: <strong>tags &raquo; tag_none</strong></li>" +
                "</ul><p>If blank, all groups above are created except <em>Instance ID</em>.</p>",
            dataContainer: 'body',
            ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)'
        },
        inventory_script: {
            label :  "Custom Inventory Script",
            type: 'lookup',
            basePath: 'inventory_scripts',
            list: 'InventoryScriptsList',
            ngShow: "source && source.value === 'custom'",
            sourceModel: 'inventory_script',
            sourceField: 'name',
            awRequiredWhen: {
                reqExpression: "source && source.value === 'custom'",
                init: "false"
            },
            ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)',
        },
        custom_variables: {
            id: 'custom_variables',
            label: 'Environment Variables', //"{{vars_label}}" ,
            ngShow: "source && source.value=='custom' || source.value === 'scm'",
            type: 'textarea',
            class: 'Form-textAreaLabel Form-formGroup--fullWidth',
            rows: 6,
            'default': '---',
            parseTypeName: 'envParseType',
            dataTitle: "Environment Variables",
            dataPlacement: 'right',
            awPopOver:  "<p>Provide environment variables to pass to the custom inventory script.</p>" +
                "<p>Enter variables using either JSON or YAML syntax. Use the radio button to toggle between the two.</p>" +
                "JSON:<br />\n" +
                "<blockquote>{<br />&emsp;\"somevar\": \"somevalue\",<br />&emsp;\"password\": \"magic\"<br /> }</blockquote>\n" +
                "YAML:<br />\n" +
                "<blockquote>---<br />somevar: somevalue<br />password: magic<br /></blockquote>\n" +
                '<p>View JSON examples at <a href="http://www.json.org" target="_blank">www.json.org</a></p>' +
                '<p>View YAML examples at <a href="http://docs.ansible.com/YAMLSyntax.html" target="_blank">docs.ansible.com</a></p>',
            dataContainer: 'body'
        },
        ec2_variables: {
            id: 'ec2_variables',
            label: 'Source Variables', //"{{vars_label}}" ,
            ngShow: "source && source.value == 'ec2'",
            type: 'textarea',
            class: 'Form-textAreaLabel Form-formGroup--fullWidth',
            rows: 6,
            'default': '---',
            parseTypeName: 'envParseType',
            dataTitle: "Source Variables",
            dataPlacement: 'right',
            awPopOver: "<p>Override variables found in ec2.ini and used by the inventory update script. For a detailed description of these variables " +
                "<a href=\"https://github.com/ansible/ansible/blob/devel/contrib/inventory/ec2.ini\" target=\"_blank\">" +
                "view ec2.ini in the Ansible github repo.</a></p>" +
                "<p>Enter variables using either JSON or YAML syntax. Use the radio button to toggle between the two.</p>" +
                "JSON:<br />\n" +
                "<blockquote>{<br />&emsp;\"somevar\": \"somevalue\",<br />&emsp;\"password\": \"magic\"<br /> }</blockquote>\n" +
                "YAML:<br />\n" +
                "<blockquote>---<br />somevar: somevalue<br />password: magic<br /></blockquote>\n" +
                '<p>View JSON examples at <a href="http://www.json.org" target="_blank">www.json.org</a></p>' +
                '<p>View YAML examples at <a href="http://docs.ansible.com/YAMLSyntax.html" target="_blank">docs.ansible.com</a></p>',
            dataContainer: 'body'
        },
        vmware_variables: {
            id: 'vmware_variables',
            label: 'Source Variables', //"{{vars_label}}" ,
            ngShow: "source && source.value == 'vmware'",
            type: 'textarea',
            class: 'Form-textAreaLabel Form-formGroup--fullWidth',
            rows: 6,
            'default': '---',
            parseTypeName: 'envParseType',
            dataTitle: "Source Variables",
            dataPlacement: 'right',
            awPopOver: "<p>Override variables found in vmware.ini and used by the inventory update script. For a detailed description of these variables " +
                "<a href=\"https://github.com/ansible/ansible/blob/devel/contrib/inventory/vmware_inventory.ini\" target=\"_blank\">" +
                "view vmware_inventory.ini in the Ansible github repo.</a></p>" +
                "<p>Enter variables using either JSON or YAML syntax. Use the radio button to toggle between the two.</p>" +
                "JSON:<br />\n" +
                "<blockquote>{<br />&emsp;\"somevar\": \"somevalue\",<br />&emsp;\"password\": \"magic\"<br /> }</blockquote>\n" +
                "YAML:<br />\n" +
                "<blockquote>---<br />somevar: somevalue<br />password: magic<br /></blockquote>\n" +
                '<p>View JSON examples at <a href="http://www.json.org" target="_blank">www.json.org</a></p>' +
                '<p>View YAML examples at <a href="http://docs.ansible.com/YAMLSyntax.html" target="_blank">docs.ansible.com</a></p>',
            dataContainer: 'body'
        },
        openstack_variables: {
            id: 'openstack_variables',
            label: 'Source Variables', //"{{vars_label}}" ,
            ngShow: "source && source.value == 'openstack'",
            type: 'textarea',
            class: 'Form-textAreaLabel Form-formGroup--fullWidth',
            rows: 6,
            'default': '---',
            parseTypeName: 'envParseType',
            dataTitle: "Source Variables",
            dataPlacement: 'right',
            awPopOver: "<p>Override variables found in openstack.yml and used by the inventory update script. For an example variable configuration " +
                "<a href=\"https://github.com/ansible/ansible/blob/devel/contrib/inventory/openstack.yml\" target=\"_blank\">" +
                "view openstack.yml in the Ansible github repo.</a></p>" +
                "<p>Enter variables using either JSON or YAML syntax. Use the radio button to toggle between the two.</p>" +
                "JSON:<br />\n" +
                "<blockquote>{<br />&emsp;\"somevar\": \"somevalue\",<br />&emsp;\"password\": \"magic\"<br /> }</blockquote>\n" +
                "YAML:<br />\n" +
                "<blockquote>---<br />somevar: somevalue<br />password: magic<br /></blockquote>\n" +
                '<p>View JSON examples at <a href="http://www.json.org" target="_blank">www.json.org</a></p>' +
                '<p>View YAML examples at <a href="http://docs.ansible.com/YAMLSyntax.html" target="_blank">docs.ansible.com</a></p>',
            dataContainer: 'body'
        },
        verbosity: {
            label: i18n._('Verbosity'),
            type: 'select',
            ngOptions: 'v.label for v in verbosity_options track by v.value',
            ngShow: "source && (source.value !== '' && source.value !== null)",
            "default": 0,
            required: true,
            column: 1,
            awPopOver: "<p>" + i18n._("Control the level of output ansible will produce for inventory source update jobs.") + "</p>",
            dataTitle: i18n._('Verbosity'),
            dataPlacement: 'right',
            dataContainer: "body",
            ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)',
        },
        checkbox_group: {
            label: 'Update Options',
            type: 'checkbox_group',
            ngShow: "source && (source.value !== '' && source.value !== null)",
            class: 'Form-checkbox--stacked',
            fields: [{
                name: 'overwrite',
                label: 'Overwrite',
                type: 'checkbox',
                ngShow: "source.value !== '' && source.value !== null",


                awPopOver: '<p>If checked, all child groups and hosts not found on the external source will be deleted from ' +
                    'the local inventory.</p><p>When not checked, local child hosts and groups not found on the external source will ' +
                    'remain untouched by the inventory update process.</p>',
                dataTitle: 'Overwrite',
                dataContainer: 'body',
                dataPlacement: 'right',
                labelClass: 'checkbox-options',
                ngDisabled: "(!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd))"
            }, {
                name: 'overwrite_vars',
                label: 'Overwrite Variables',
                type: 'checkbox',
                ngShow: "source.value !== '' && source.value !== null",


                awPopOver: '<p>If checked, all variables for child groups and hosts will be removed and replaced by those ' +
                    'found on the external source.</p><p>When not checked, a merge will be performed, combining local variables with ' +
                    'those found on the external source.</p>',
                dataTitle: 'Overwrite Variables',
                dataContainer: 'body',
                dataPlacement: 'right',
                labelClass: 'checkbox-options',
                ngDisabled: "(!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd) || source.value === 'scm')"
            }, {
                name: 'update_on_launch',
                label: 'Update on Launch',
                type: 'checkbox',
                ngShow: "source.value !== '' && source.value !== null",
                awPopOver: '<p>Each time a job runs using this inventory, refresh the inventory from the selected source before ' +
                    'executing job tasks.</p>',
                dataTitle: 'Update on Launch',
                dataContainer: 'body',
                dataPlacement: 'right',
                labelClass: 'checkbox-options',
                ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)'
            }, {
                name: 'update_on_project_update',
                label: 'Update on Project Update',
                type: 'checkbox',
                ngShow: "source.value === 'scm'",
                awPopOver: '<p>TODO</p>',
                dataTitle: 'Update on Project Update',
                dataContainer: 'body',
                dataPlacement: 'right',
                labelClass: 'checkbox-options',
                ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)'
            }]
        },
        update_cache_timeout: {
            label: "Cache Timeout <span class=\"small-text\"> (seconds)</span>",
            id: 'source-cache-timeout',
            type: 'number',
            ngDisabled: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)',
            integer: true,
            min: 0,
            ngShow: "source && source.value !== '' && update_on_launch",
            spinner: true,
            "default": 0,
            awPopOver: '<p>Time in seconds to consider an inventory sync to be current. During job runs and callbacks the task system will ' +
                'evaluate the timestamp of the latest sync. If it is older than Cache Timeout, it is not considered current, ' +
                'and a new inventory sync will be performed.</p>',
            dataTitle: 'Cache Timeout',
            dataPlacement: 'right',
            dataContainer: "body"
        }
    },

    buttons: {
        cancel: {
            ngClick: 'formCancel()',
            ngShow: '(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)'
        },
        close: {
            ngClick: 'formCancel()',
            ngShow: '!(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)'
        },
        save: {
            ngClick: 'formSave()',
            ngDisabled: true,
            ngShow: '(inventory_source_obj.summary_fields.user_capabilities.edit || canAdd)'
        }
    },

    related: {
        notifications: notifications_object
    }
};

}];