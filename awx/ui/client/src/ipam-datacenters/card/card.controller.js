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

			var defaultUrl = GetBasePath('ipam_datacenters');
			var edit_id;

			//Variable for Alerting Fill in
			$scope.nameDirty = false;

			$scope.tabId = 1;
			$scope.searchExamples = ["id:>10", "created:>=2000-01-01T00:00:00Z", "created:<2000-01-01", "name:foobar"];
			$scope.keyFields = ["name", "description", "site", "location", "facility", "physical_address", "shipping_address", "contact_name", "contact_phone", "contact_email", "comments"];
			$scope.pageSize = 20;

			var getipamDatacenters = function () {
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

			getipamDatacenters();

			$scope.showKeyPane = false;
			/* Pane variables  (Title, Button Name, ...)*/
			$scope.showPane = false;

			$scope.toggleKeyPane = function () {
				$scope.showKeyPane = !$scope.showKeyPane;
			};

			$scope.selected1 = "is-selected";
			$scope.TabClick = function (tabId) {
				$scope.tabId = tabId;
				if (tabId == 1) {
					$scope.selected1 = "is-selected";
					$scope.selected2 = "";
					$scope.selected3 = "";
				}
				else if (tabId == 2) {
					$scope.selected1 = "";
					$scope.selected2 = "is-selected";
					$scope.selected3 = "";

				}
				else if (tabId == 3) {
					$scope.selected1 = "";
					$scope.selected2 = "";
					$scope.selected3 = "is-selected";
				}
			};

			$scope.formCancel = function () {
				resetUi();
				$scope.showPane = false;
			};

			var resetUi = function () {

				$scope.TabClick(1);

				$scope.datacenter_name = "";
				$scope.description = "";
				$scope.site = "";
				$scope.location = "";
				$scope.facility = "";
				$scope.physical_address = "";
				$scope.shipping_address = "";
				$scope.contact_name = "";
				$scope.contact_phone = "";
				$scope.contact_email = "";
				$scope.comments = "";

			}

			$scope.formCreate = function () {
				$scope.paneType = 1;	//Set as New

				$scope.paneTitle = "New Datacenter";

				resetUi();

				$scope.submitTitle = "Create a New";
				$scope.showPane = true;
				console.log($scope.apidataLists);
			}

			$scope.editClick = function (Id) {
				$scope.paneType = 2;	//Set as Edit

				edit_id = $scope.apidataLists[Id].id;
				$scope.paneTitle = "Edit Datacenter / " + $scope.apidataLists[Id].name;

				$scope.datacenter_name = $scope.apidataLists[Id].name;
				$scope.description = $scope.apidataLists[Id].description;
				$scope.site = $scope.apidataLists[Id].site;
				$scope.location = $scope.apidataLists[Id].location;
				$scope.facility = $scope.apidataLists[Id].facility;
				$scope.physical_address = $scope.apidataLists[Id].physical_address;
				$scope.shipping_address = $scope.apidataLists[Id].shipping_address;
				$scope.contact_name = $scope.apidataLists[Id].contact_name;
				$scope.contact_phone = $scope.apidataLists[Id].contact_phone;
				$scope.contact_email = $scope.apidataLists[Id].contact_email;
				$scope.comments = $scope.apidataLists[Id].comments;

				$scope.submitTitle = "Update";
				$scope.editselected = "List-editButton--selected";
				$scope.showPane = true;
			}
			/* Include all function as New, Update*/
			$scope.formSubmit = function () {
				console.log($scope.datacenter_name);
				if ($scope.datacenter_name) {
					if ($scope.paneType == 1) {
						//Create New Event
						var datacenter = {
							'name': $scope.datacenter_name, 'description': $scope.description, 'site': $scope.site, 'location': $scope.location, 'facility': $scope.facility,
							'physical_address': $scope.physical_address, 'shipping_address': $scope.shipping_address, 'contact_name': $scope.contact_name, 'contact_phone': $scope.contact_phone,
							'contact_email': $scope.contact_email, 'comments': $scope.comments
						};

						Rest.setUrl(defaultUrl);
						Rest.post(datacenter)
							.then(({ data }) => {
								getipamDatacenters();
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
						var datacenter = {
							'name': $scope.datacenter_name, 'description': $scope.description, 'site': $scope.site, 'location': $scope.location, 'facility': $scope.facility,
							'physical_address': $scope.physical_address, 'shipping_address': $scope.shipping_address, 'contact_name': $scope.contact_name, 'contact_phone': $scope.contact_phone,
							'contact_email': $scope.contact_email, 'comments': $scope.comments
						};

						Rest.setUrl(defaultUrl + edit_id + '/');
						Rest.put(datacenter)
							.then(({ data }) => {
								getipamDatacenters();
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
					$scope.TabClick(1);
				}
			}

			var deleteId;
			$scope.showModal = false;

			$scope.modal_cancel = function () {
				$scope.showModal = false;
			}

			$scope.deleteDatacenter = function (id, name) {
				var action = function () {
					$('#prompt-modal').modal('hide');
					Wait('start');
					Rest.setUrl(defaultUrl + id + '/');
					Rest.destroy()
						.then(() => {
							getipamDatacenters();
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
