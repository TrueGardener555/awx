/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import { N_ } from "../../i18n";

const user_type_options = [
 { type: 'normal', label: N_('Normal User') },
 { type: 'system_auditor', label: N_('System Auditor') },
 { type: 'system_administrator', label: N_('System Administrator') },
];

export default ['$scope', '$rootScope', 'AppForm', 'GenerateForm', 'Rest',
    'Alert', 'ProcessErrors', 'ReturnToCaller', 'GetBasePath',
    'Wait', 'CreateSelect2', '$state', '$location', 'i18n',
    function($scope, $rootScope, AppForm, GenerateForm, Rest, Alert,
    ProcessErrors, ReturnToCaller, GetBasePath, Wait, CreateSelect2,
    $state, $location, i18n) {

        var defaultUrl = GetBasePath('ipam_apps'),
            form = AppForm;

        init();

        function init() {
            // apply form definition's default field values

            console.log("init");
            GenerateForm.applyDefaults(form, $scope);

            $scope.isAddForm = true;
            
			$scope.status1 = "active";
            $scope.tabId = 1;
			$scope.previous = "CLOSE";
			$scope.next = "NEXT";
            // change to modal dialog
            
            var element = document.getElementById("modaldlg");
            element.style.display = "block";
            var panel = element.getElementsByClassName("Panel ng-scope");
            panel[0].classList.add("modal-dialog");
            panel[0].style.width = "60%";

        }
 
		$scope.WizardClick = function (clickID) {
			if (clickID == 1) {
				if($scope.tabId > 1)
					$scope.tabId = $scope.tabId - 1;
			}
			else if (clickID == 2) {
				if($scope.tabId < 3)
					$scope.tabId = $scope.tabId + 1;
				if($scope.tab == 2)
				{
					var fld, data = {};
		            Rest.setUrl(defaultUrl);
		            for (fld in form.fields) {
		                if (form.fields[fld].realName) {
		                    data[form.fields[fld].realName] = $scope[fld];
		                } else {
		                    data[fld] = $scope[fld]; 
		                }
		            }
		            console.log(data);
		            $scope.opts = data;
				}
			}

			if ($scope.tabId == 1) {
				$scope.status1 = "active";
				$scope.status2 = "";
				$scope.status3 = "";
			}
			else if ($scope.tabId == 2) {
				$scope.status1 = "complete";
				$scope.status2 = "active";
				$scope.status3 = "";
			}
			else if ($scope.tabId == 3) {
				$scope.status1 = "complete";
				$scope.status2 = "complete";
				$scope.status3 = "active";
			}
		};
        // Save
        $scope.formSave = function() {
            var fld, data = {};
            Rest.setUrl(defaultUrl);
            for (fld in form.fields) {
                if (form.fields[fld].realName) {
                    data[form.fields[fld].realName] = $scope[fld];
                } else {
                    data[fld] = $scope[fld];
                }
            }
            Wait('start');
            Rest.post(data)
                .then(({data}) => {
                    var base = $location.path().replace(/^\//, '').split('/')[0];
                    if (base === 'ipam_apps') {
                        $rootScope.flashMessage = i18n._('New App successfully created!');
                        $rootScope.$broadcast("EditIndicatorChange", "App", data.id);
                        $state.go('infraAppsList.edit', { app_id: data.id }, { reload: true });
                    } else {
                        ReturnToCaller(1);
                    }
                })
                .catch(({data, status}) => {
                    ProcessErrors($scope, data, status, form, { hdr: i18n._('Error!'), msg: i18n._('Failed to add new App. POST returned status: ') + status });
                });
        };

        $scope.formCancel = function() {
            $state.go('infraAppsList');
        };
    }
];
