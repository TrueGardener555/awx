/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/


export default
	['Wait', 'CreateDialog', 'GetBasePath', 'Rest', 'ProcessErrors', '$rootScope', '$state',
		'$scope', '$filter', 'CreateSelect2', 'i18n', '$transitions', 'Prompt', 'initSurvey',
		function (Wait, CreateDialog, GetBasePath, Rest, ProcessErrors, $rootScope, $state,
			$scope, $filter, CreateSelect2, i18n, $transitions, Prompt, SurveyControllerInit) {

			var defaultUrl = GetBasePath('ipam_apps');
			var edit_id;
			$scope.paneShow = 1;
			SurveyControllerInit({
                    scope: $scope,
                    parent_scope: $scope,
                    id: 0,
                    templateType: 'job_template'
                });

			//Variable for Alerting Fill in
			$scope.nameDirty = false;

			$scope.searchExamples = ["id:>10", "created:>=2000-01-01T00:00:00Z", "created:<2000-01-01", "name:foobar"];
			$scope.keyFields = ["name", "description", "site", "location", "facility", "physical_address", "shipping_address", "contact_name", "contact_phone", "contact_email", "comments"];
			$scope.pageSize = 20;

			var getApidata = function () {
				Rest.setUrl(defaultUrl + "?order_by=name");
				Rest.get()
					.then(({ data }) => {
						$scope.apidataLists = data.results;
						Wait('stop');
					})
					.catch(({ data, status }) => {
						ProcessErrors($scope, data, status, null, {
							hdr: i18n._('Error!'),
							msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status)
						});
					});
			};

			getApidata();

			$scope.showKeyPane = false;
			/* Pane variables  (Title, Button Name, ...)*/
			$scope.showPane = false;

			$scope.toggleKeyPane = function () {
				$scope.showKeyPane = !$scope.showKeyPane;
			};

			$scope.WizardClick = function (clickID) {
				if (clickID == 1) {
					if($scope.tabID > 0)
						$scope.tabID = $scope.tabID - 1;
					else
						$scope.tabID = 0;
				}
				else if (clickID == 2) {
					if($scope.tabID == 3)
						$scope.formSubmit();
					else
						$scope.tabID = $scope.tabID + 1;
				}

				if ($scope.tabID == 1) {
					$scope.previous = "prev";
					$scope.next = "NEXT";
					$scope.status1 = "active";
					$scope.status2 = "";
					$scope.status3 = "";
				}
				else if ($scope.tabID == 2) {
					$scope.previous = "PREV";
					$scope.next = "NEXT";
					$scope.status1 = "complete";
					$scope.status2 = "active";
					$scope.status3 = "";
				}
				else if ($scope.tabID == 3) {
					$scope.next = "Finish";
					$scope.status1 = "complete";
					$scope.status2 = "complete";
					$scope.status3 = "active";
				}
			};

			$scope.formCancel = function () {
				
				resetUi();
				$scope.showPane = false;
			};

			var resetUi = function () {
				$scope.tabID = 1;
				$scope.paneShow = 1;
				$scope.WizardClick(0);

				$scope.app_name = "";
				$scope.description = "";
				$scope.token = "";
				$scope.username = "";
				$scope.password = "";
				$scope.hosts = "";
				$scope.artifacts = "";
				$scope.scm_type = "";
				$scope.svc_enabled = "";
				$scope.requirements = "";
				$scope.security = "";
				$scope.opts = "";
				$scope.source= "";
				$scope.credential = "";
				$scope.datacenter = "";
			}

			$scope.formCreate = function () {
                /*CreateDialog({
                    id: 'workflow-modal-dialog',
                    scope: $scope,
                    width: 500
                    height: 300
                    draggable: false,
                    dialogClass: 'WorkflowMaker-dialog',
                    position: ['center', 20],
                    onClose: function() {
                        $('#workflow-modal-dialog').empty();
                        $('body').removeClass('WorkflowMaker-preventBodyScrolling');
                    },
                    onOpen: function() {
                        Wait('stop');
                        $('body').addClass('WorkflowMaker-preventBodyScrolling');

                        // Let the modal height be variable based on the content
                        // and set a uniform padding
                        $('#workflow-modal-dialog').css({ 'padding': '20px' });
                        $('#workflow-modal-dialog').outerHeight(300);
                        $('#workflow-modal-dialog').outerWidth(500);

                    },
                    _allowInteraction: function(e) {
                        return !!$(e.target).is('.select2-input') || this._super(e);
                    },
                    callback: 'WorkflowDialogReady'
                });*/
				//addSurvey();
				
				$scope.paneType = 1;	//Set as New
				$scope.paneTitle = "New APP";
				resetUi();
				$scope.submitTitle = "Create a New";
				$scope.showPane = true;
				$scope.paneShow = 0;
				console.log($scope.apidataLists);
			}

			$scope.editClick = function (Id) {
				$scope.paneType = 2;	//Set as Edit
				$scope.paneShow = 0;
				edit_id = $scope.apidataLists[Id].id;
				$scope.paneTitle = "Edit APP / " + $scope.apidataLists[Id].name;

				$scope.app_name = $scope.apidataLists[Id].name;
				$scope.description = $scope.apidataLists[Id].description;
				$scope.token = $scope.apidataLists[Id].token;
				$scope.username = $scope.apidataLists[Id].username;
				$scope.password = $scope.apidataLists[Id].password;
				$scope.hosts = $scope.apidataLists[Id].hosts;
				$scope.artifacts = $scope.apidataLists[Id].artifacts;
				$scope.scm_type = $scope.apidataLists[Id].scm_type;
				$scope.svc_enabled = $scope.apidataLists[Id].svc_enabled;
				$scope.requirements = $scope.apidataLists[Id].requirements;
				$scope.security = $scope.apidataLists[Id].security;
				$scope.opts = $scope.apidataLists[Id].opts;
				$scope.source= $scope.apidataLists[Id].source;
				$scope.credential = $scope.apidataLists[Id].credential;
				$scope.datacenter = $scope.apidataLists[Id].datacenter;

				$scope.submitTitle = "Update";
				$scope.editselected = "List-editButton--selected";
				$scope.showPane = true;
			}
			/* Include all function as New, Update*/
			$scope.formSubmit = function () {
				console.log($scope.app_name);
				if ($scope.app_name) {
					if ($scope.paneType == 1) {
						//Create New Event
						var apps = {
							'name': $scope.app_name, 'description': $scope.description, 'token': $scope.token, 'username': $scope.username, 'password': $scope.password,
							'hosts': $scope.hosts, 'artifacts': $scope.artifacts, 'scm_type': $scope.scm_type, 'svc_enabled': $scope.svc_enabled,
							'requirements': $scope.requirements, 'security': $scope.security, 'opts': $scope.opts, 'source': $scope.source,
							'credential': $scope.credential, 'datacenter': $scope.datacenter
						};

						Rest.setUrl(defaultUrl);
						Rest.post(apps)
							.then(({ data }) => {
								getApidata();
								resetUi();
								$scope.showPane = false;
							})
							.catch(({ data, status }) => {
								ProcessErrors($scope, data, status, null, {
									hdr: i18n._('Error!'),
									msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status)
								});
							});


					}
					else {
						//Edit Submit (Update) Event.
						var apps = {
							'name': $scope.app_name, 'description': $scope.description, 'token': $scope.token, 'username': $scope.username, 'password': $scope.password,
							'hosts': $scope.hosts, 'artifacts': $scope.artifacts, 'scm_type': $scope.scm_type, 'svc_enabled': $scope.svc_enabled,
							'requirements': $scope.requirements, 'security': $scope.security, 'opts': $scope.opts, 'source': $scope.source,
							'credential': $scope.credential, 'datacenter': $scope.datacenter
						};

						Rest.setUrl(defaultUrl + edit_id + '/');
						Rest.put(apps)
							.then(({ data }) => {
								getApidata();
								resetUi();
								$scope.showPane = false;
							})
							.catch(({ data, status }) => {
								ProcessErrors($scope, data, status, null, {
									hdr: i18n._('Error!'),
									msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status)
								});
							});
					}
				}
				else {
				}
			}

			var deleteId;
			$scope.showModal = false;

			$scope.modal_cancel = function () {
				$scope.showModal = false;
			}

			$scope.deleteApps = function (id, name) {
				var action = function () {
					$('#prompt-modal').modal('hide');
					Wait('start');
					Rest.setUrl(defaultUrl + id + '/');
					Rest.destroy()
						.then(() => {
							getApidata();
						});
				}
				Prompt({
					hdr: i18n._('Delete'),
					resourceName: $filter('sanitize')(name),
					body: '<div class="Prompt-bodyQuery">' + i18n._('Are you sure you want to delete this datacenter?') + '</div>',
					action: action,
					actionText: i18n._('DELETE')
				});
			}

			$scope.sortColumn = "name";
			$scope.reverseSort = false;

			$scope.sortData = function (column) {
				$scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
				$scope.sortColumn = column;
			}

			$scope.getSortClass = function (column) {
				if ($scope.sortColumn == column) {
					return $scope.reverseSort ? 'fa-sort-down' : 'fa-sort-up';
				}
				return 'fa-sort';
			}

			$scope.searchList = [];
			$scope.filterString = "{name:'1'}";
			$scope.addTerms = function (searchTerm) {
				$scope.filterString = "{name:'test'}";
				if (searchTerm != undefined && $scope.searchList.indexOf(searchTerm) === -1) {
					$scope.searchTags = true;
					if (searchTerm.indexOf(':') === -1)
					{
						$scope.filterString = "{name:'" + searchTerm + "'}";
					}
					else
					{
						$scope.filterString = searchTerm.split(':')[0] + ":'" + searchTerm.split(':')[1] + "'";
					}
					$scope.searchList.push(searchTerm);
					//console.log($scope.searchTags);
				}
				console.log($scope.filterString);
				console.log($scope.searchList);
			}
			$scope.removeTerm = function (index) {
				$scope.searchList.splice(index,1);
				if($scope.searchList.length === 0)
					$scope.searchTags = true;
			}
			$scope.clearAllTerms = function () {
				$scope.searchList.splice(0, $scope.searchList.length);
				$scope.searchTags = false;
			}
			$scope.showList = function(item) {
				return $scope.searchList.indexOf(item.name) !== -1;
			}
		}
	];
