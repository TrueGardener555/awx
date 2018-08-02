/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/


export default ['i18n', function(i18n) {
    return {

        name: 'ipam_datacenters',
        stateTree: 'ipamDatacentersList',
        iterator: 'datacenter',
        selectTitle: i18n._('Add Users'),
        editTitle: i18n._('IPAM DATACENTERS'),
        listTitle: i18n._('IPAM DATACENTERS'),
        selectInstructions: '<p>Select existing users by clicking each user or checking the related checkbox. When finished, click the blue ' +
            '<em>Select</em> button, located bottom right.</p> <p>When available, a brand new user can be created by clicking the ' +
            '<i class=\"fa fa-plus\"></i> button.</p>',
        index: false,
        hover: true,

        fields: {
            name: {
                key: true,
                label: i18n._('Name'),
                columnClass: 'col-md-3 col-sm-3 col-xs-9'
            },
            site: {
                label: i18n._('Site'),
                columnClass: 'col-md-3 col-sm-3 hidden-xs'
            },
            location: {
                label: i18n._('Location'),
                columnClass: 'col-md-3 col-sm-3 hidden-xs'
            }
        },

        actions: {
            add: {
                label: i18n._('Create New'),
                mode: 'all', // One of: edit, select, all
                ngClick: 'addUser()',
                basePaths: ['organizations', 'users'], // base path must be in list, or action not available
                awToolTip: i18n._('Create a new user'),
                actionClass: 'at-Button--add',
                actionId: 'button-add',
                ngShow: 'canAdd && canEdit'
            }
        },

        fieldActions: {

            columnClass: 'col-md-3 col-sm-3 col-xs-3',

            edit: {
                label: i18n._('Edit'),
                ngClick: "editUser(user.id)",
                icon: 'icon-edit',
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('Edit user'),
                dataPlacement: 'top',
                ngShow: 'user.summary_fields.user_capabilities.edit'
            },

            view: {
                label: i18n._('View'),
                ngClick: "editUser(user.id)",
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('View user'),
                dataPlacement: 'top',
                ngShow: '!user.summary_fields.user_capabilities.edit'
            },

            "delete": {
                label: i18n._('Delete'),
                ngClick: "deleteUser(user.id, user.username)",
                icon: 'icon-trash',
                "class": 'btn-xs btn-danger',
                awToolTip: i18n._('Delete user'),
                dataPlacement: 'top',
                ngShow: 'user.summary_fields.user_capabilities.delete'
            }
        }
    };}];
