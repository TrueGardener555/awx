/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/


export default ['i18n', function(i18n) {
    return {

        name: 'ipam_apps',
        iterator: 'app',
        editTitle: i18n._('INFRA APPS'),
        listTitle: i18n._('INFRA APPS'),
        search: {
            order_by: 'name'
        },
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
                label: i18n._('HOST'),
                columnClass: 'col-md-3 col-sm-3 hidden-xs'
            },
        },

        actions: {
            add: {
                label: i18n._('Create New'),
                mode: 'all', // One of: edit, select, all
                ngClick: 'addApp()',
                awToolTip: i18n._('Create a new APP'),
                actionClass: 'at-Button--add',
                actionId: 'button-add',
                ngShow: 'canAdd'
            }
        },

        fieldActions: {

            columnClass: 'col-md-2 col-sm-3 col-xs-3',

            edit: {
                label: i18n._('Edit'),
                icon: 'icon-edit',
               	ngClick: "editApp(app.id)",
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('Edit App'),
                dataPlacement: 'top',
            },

            "delete": {
                label: i18n._('Delete'),
                ngClick: "deleteApp(app.id, app.name)",
                icon: 'icon-trash',
                "class": 'btn-xs btn-danger',
                awToolTip: i18n._('Delete App'),
                dataPlacement: 'top',
            }
        }
    };}];
