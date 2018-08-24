/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/


export default
	['Wait', 'CreateDialog', 'GetBasePath', 'Rest', 'ProcessErrors', '$rootScope', '$state',
		'$scope', '$filter', 'CreateSelect2', 'i18n', '$transitions', 'Prompt',
		function (Wait, CreateDialog, GetBasePath, Rest, ProcessErrors, $rootScope, $state,
			$scope, $filter, CreateSelect2, i18n, $transitions, Prompt, qs) {

			var defaultUrl = GetBasePath('ipam_prefixes');
			var datacenter_id;
			$scope.edit_id = 0;

			//Variable for Alerting Fill in
			$scope.nameDirty = false;

			$scope.searchExamples = ["id:>10", "created:>=2000-01-01T00:00:00Z", "created:<2000-01-01", "name:foobar"];
			$scope.keyFields = ["name", "description", "site", "location", "facility", "physical_address", "shipping_address", "contact_name", "contact_phone", "contact_email", "comments"];
			$scope.pageSize = 20;

			var getApiDatas = function () {
				Rest.setUrl(defaultUrl + "?order_by=prefix");
				Rest.get()
					.then(({ data }) => {
						$scope.apidataLists = data.results;
						Wait('stop');

					    CreateSelect2({
	                        element: '#prefix_datacenter_select',
	                        multiple: false
	                    });
						CreateSelect2({
	                        element: '#prefix_vrf_select',
	                        multiple: false
	                    });
						CreateSelect2({
	                        element: '#prefix_vlan_select',
	                        multiple: false
	                    });
						CreateSelect2({
	                        element: '#prefix_status_select',
	                        multiple: false
	                    });

					})
					.catch(({ data, status }) => {
						ProcessErrors($scope, data, status, null, {
							hdr: i18n._('Error!'),
							msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status)
						});
					});
			};

			$scope.loadData = function() {
				Rest.setUrl(GetBasePath('ipam_datacenters') + "?order_by=name");
				Rest.get()
					.then(({ data }) => {
						$scope.PrefixDatacenters = data.results;
						console.log($scope.PrefixDatacenters);

						Wait('stop');
					})
					.catch(({ data, status }) => {
						ProcessErrors($scope, data, status, null, {
							hdr: i18n._('Error!'),
							msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status)
						});
					});

				Rest.setUrl(GetBasePath('ipam_vrfs') + "?order_by=name");
				Rest.get()
					.then(({ data }) => {
						$scope.PrefixVRFs = data.results;
						console.log($scope.PrefixVRFs);

						Wait('stop');
					})
					.catch(({ data, status }) => {
						ProcessErrors($scope, data, status, null, {
							hdr: i18n._('Error!'),
							msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status)
						});
					});

				Rest.setUrl(GetBasePath('ipam_vlans') + "?order_by=name");
				Rest.get()
					.then(({ data }) => {
						$scope.PrefixVLans = data.results;
						console.log($scope.PrefixVLans);

						Wait('stop');
					})
					.catch(({ data, status }) => {
						ProcessErrors($scope, data, status, null, {
							hdr: i18n._('Error!'),
							msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status)
						});
					});


				$scope.PrefixStatus = [{'id':0, 'name':'Container'}, {'id':1, 'name':'Active'}, {'id':2, 'name':'Reserved'}, {'id':3, 'name': 'Deprecated'}];
			};
			getApiDatas();
			$scope.loadData();

			$scope.showKeyPane = false;
			/* Pane variables  (Title, Button Name, ...)*/
			$scope.showPane = false;

			$scope.toggleKeyPane = function () {
				$scope.showKeyPane = !$scope.showKeyPane;
			};

			$scope.formCancel = function () {
				resetUi();
				$scope.showPane = false;
			};

			var resetUi = function () {

				$scope.prefix = "";
				$scope.description = "";
				$scope.datacenter = "";
				$scope.vrf = "";
				$scope.vlan = "";
				$scope.is_pool = false;
				$scope.status = "1";

				$scope.edit_id = 0;
			}

			$scope.formCreate = function () {
				$scope.paneType = 1;	//Set as New

				$scope.paneTitle = "New Prefix";

				resetUi();

				$scope.submitTitle = "Create a New";
				$scope.showPane = true;
				console.log($scope.apidataLists);
			}

			$scope.editClick = function (param) {
				$scope.paneType = 2;	//Set as Edit
				$scope.edit_id = param;

				Rest.setUrl(defaultUrl + $scope.edit_id + '/');
				Rest.get()
					.then(({ data }) => {
						Wait('stop');

						$scope.paneTitle = "Edit Prefix / " + data.prefix;


						$scope.prefix = data.prefix;
						$scope.description = data.description;
						if(data.datacenter > 0) $scope.datacenter = data.datacenter.toString();
						if(data.vrf > 0) $scope.vrf = data.vrf.toString();
						if(data.vlan > 0) $scope.vlan =  data.vlan.toString();
						$scope.is_pool = data.is_pool;
						$scope.status = "" + data.status;

						console.log("Edit DataID = " + $scope.datacenter);

						$scope.submitTitle = "Update";
						$scope.editselected = "List-editButton--selected";
						$scope.showPane = true;
					})
					.catch(({ data, status }) => {
						ProcessErrors($scope, data, status, null, {
							hdr: i18n._('Error!'),
							msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status)
						});
					});

			}

			$scope.selectDatacenter = function(param)
			{
				datacenter_id = $scope.datacenter;
				console.log(" Select " + datacenter_id);
			}

			/* Include all function as New, Update*/
			$scope.formSubmit = function () {
				console.log($scope.prefix);
				if ($scope.prefix) {
					if ($scope.paneType == 1) {
						//Create New Event
						var prefixes = {
							'prefix': $scope.prefix , 'description': $scope.description, 'datacenter' : $scope.datacenter, 'vrf' : $scope.vrf , 'vlan': $scope.vlan , 'is_pool':$scope.is_pool, 'status':$scope.status
						};

						Rest.setUrl(defaultUrl);
						Rest.post(prefixes)
							.then(({ data }) => {
								getApiDatas();
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
						var prefixes = {
							'prefix': $scope.prefix , 'description': $scope.description, 'datacenter' : $scope.datacenter, 'vrf' : $scope.vrf , 'vlan': $scope.vlan , 'is_pool':$scope.is_pool, 'status':$scope.status
						};

						Rest.setUrl(defaultUrl + $scope.edit_id + '/');
						Rest.put(prefixes)
							.then(({ data }) => {
								getApiDatas();
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

			$scope.deleteprefix = function (id, name) {
				resetUi();
				$scope.showPane = false;
				var action = function () {
					$('#prompt-modal').modal('hide');
					Wait('start');
					Rest.setUrl(defaultUrl + id + '/');
					Rest.destroy()
						.then(() => {
							getApiDatas();
						});
				}
				Prompt({
					hdr: i18n._('Delete'),
					resourceName: $filter('sanitize')(name),
					body: '<div class="Prompt-bodyQuery">' + i18n._('Are you sure you want to delete this Prefix?') + '</div>',
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
				return $scope.searchList.indexOf(item.prefix) !== -1;
			}
		}
	];
