/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

  /**
 * @ngdoc function
 * @name forms.function:Apps
 * @description This form is for adding/editing infra_apps
*/

export default ['i18n', function(i18n) {
        return {

            addTitle: i18n._('NEW APP'),
            editTitle: '{{ name }}',
            name: 'app',
            basePath: 'ipam_apps',
            // the top-most node of generated state tree
            stateTree: 'infraAppsList',
            breadcrumbName: i18n._('INFRA APP'),
            showActions: true,
			wizards: {
				basic: {
					index: 1,
					name: 'Variable',
                    type: 'collection',
                    title: i18n._('Variable'),
				},
				relation: {
					index:2,
					name: 'Relation',
	                type: 'collection',
	                title: i18n._('Relation'),
				},
				opts: {
					index:3,
					name: 'Option',
	                type: 'collection',
	                title: i18n._('Option'),
				}
			},
            fields: {
                name: {
                    label: i18n._('Name'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
                    required: true,
					ngShow: 'tabId == 1',
                },
			    description: {
                    label: i18n._('Description'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 1',
                },
				token: {
                    label: i18n._('Token'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 1',
                },
				username: {
                    label: i18n._('Username'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 1',
                },
				password: {
                    label: i18n._('Password'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 1',
                },

				scm_type: {
                    label: i18n._('Scm_Type'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 1',
                },
				scm_url: {
                    label: i18n._('SCM Url'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 1',
                },
	            scm_branch: {
                    label: i18n._('SCM Branch'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 1',
                },
	            scm_revision: {
                    label: i18n._('SCM Revision'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 1',
                },
				svc_enabled: {
                    label: i18n._('SVC Enable'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 1',
                },
				requirements: {
                    label: i18n._('Requirements'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 1',
                },
				source: {
                    label: i18n._('Source'),
                    type: 'text',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 1',
                },
				datacenter: {
                    label: i18n._('Datacenter'),
                    type: 'select',
                    defaultText: 'Choose a Datacenter',
                    ngModel: 'datacenter',
                    ngOptions: 'item as item.label for item in datacenter_type_options',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 2',
                },
				credential: {
                    label: i18n._('Credential'),
                    type: 'select',
                    defaultText: 'Choose a Credential',
                    ngModel: 'credential',
                    ngOptions: 'item as item.label for item in credential_type_options',
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 2',
                }, 
				opts: {
                    label: i18n._('Input Opts'),
                    class: 'Form-textAreaLabel Form-formGroup--fullWidth',
	                type: 'textarea',
	                rows: 15,
	                default: '---',
	                showParseTypeToggle: true,
	                parseTypeName: 'parseTypeOpts',
	                awPopOverWatch: "opts_help_text",
	                dataTitle: i18n._('Input Opts'),
	                dataPlacement: 'right',
	                dataContainer: "body",
                    ngDisabled: '!(user_obj.summary_fields.user_capabilities.edit || canAdd)',
					ngShow: 'tabId == 3',
                },
            },
 
            buttons: {
                wizardcancel: {
                    ngClick: 'formCancel()',
                    ngShow: 'tabId == 1',
                },
                previous:{
					ngClick: 'WizardClick(1)',
					ngShow: 'tabId > 1',
				},
				next:{
					ngClick: 'WizardClick(2)',
					ngShow: 'tabId < 3',
				},
                save: {
                	title:'Finish',
                    ngClick: 'formSave()',
					ngShow: 'tabId == 3',
					ngDisabled: true,
                }
            }
        };}];
