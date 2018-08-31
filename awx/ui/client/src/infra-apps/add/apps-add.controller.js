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

export default ['$scope', '$rootScope', 'AppForm', 'GenerateForm', 'Rest','ParseTypeChange',
    'Alert', 'ProcessErrors', 'ReturnToCaller', 'GetBasePath',
    'Wait', 'CreateSelect2', '$state', '$location', 'i18n',
    function($scope, $rootScope, AppForm, GenerateForm, Rest, ParseTypeChange, Alert,
    ProcessErrors, ReturnToCaller, GetBasePath, Wait, CreateSelect2,
    $state, $location, i18n) {

        var defaultUrl = GetBasePath('ipam_apps'),
            form = AppForm;

        init();

        function init() {
            // apply form definition's default field values

            GenerateForm.applyDefaults(form, $scope);

            $scope.isAddForm = true;
            
			$scope.status1 = "active";
            $scope.tabId = 1;
			$scope.previous = "CLOSE";
			$scope.next = "NEXT";
			
			$scope.parseTypeOpts = 'yaml';

	        var datacenter_options = [];
			var datacenterLists = [];
	    	Rest.setUrl(GetBasePath('ipam_datacenters'));
	        Rest.get().then(({data}) => {
	        	datacenterLists = data.results;
	        	for (var i = 0; i < datacenterLists.length; i++) {
	        		datacenter_options.push({label:datacenterLists[i].name, value:datacenterLists[i].id});
	        	}
	        	$scope.datacenter_type_options = datacenter_options;
	            for (var i = 0; i < datacenter_options.length; i++) {
	                if (datacenter_options[i].value === datacenter_value) {
	                    $scope.datacenter = datacenter_options[i];
	                    break;
	                }
	            }
	            
	        })
	    	.catch(({data, status}) => {
	        	ProcessErrors($scope, data, status, form, { hdr: i18n._('Error!'), msg: i18n._('Failed to get datacenters. Get returned status: ') + status });
			});

			var credential_options = [];
			Rest.setUrl(GetBasePath('credentials'));
	        Rest.get().then(({data}) => {
	        	var credentialLists = data.results;
	        	for (var i = 0; i < credentialLists.length; i++)
	        		credential_options.push({label:credentialLists[i].name, value:credentialLists[i].id});
	        	$scope.credential_type_options = credential_options;
				//Set Selectbox
				for (var i = 0; i < credential_options.length; i++) {
	                if (credential_options[i].value === credential_value) {
	                    $scope.credential = credential_options[i];
	                    break;
	                }
	            }
	        })
	    	.catch(({data, status}) => {
	        	ProcessErrors($scope, data, status, form, { hdr: i18n._('Error!'), msg: i18n._('Failed to get Credentials. Get returned status: ') + status });
			});
	        CreateSelect2({
	            element: '#app_datacenter',
	            multiple: false,
	        }); 

	        CreateSelect2({
	            element: '#app_credential',
	            multiple: false,
	        });
            // change to modal dialog
            
            var element = document.getElementById("modaldlg");
            element.style.display = "block";
            var panel = element.getElementsByClassName("Panel ng-scope");
            panel[0].classList.add("modal-dialog");
            panel[0].style.width = "60%";

        }
		var callback = function() {
            // Make sure the form controller knows there was a change
            $scope[form.name + '_form'].$setDirty();
        };

		function getVars(str){
            // Quick function to test if the host vars are a json-object-string,
            // by testing if they can be converted to a JSON object w/o error.
            function IsJsonString(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            }

            if(str === ''){
                return '---';
            }
            else if(IsJsonString(str)){
                str = JSON.parse(str);
                return jsyaml.safeDump(str);
            }
            else if(!IsJsonString(str)){
                return str;
            }
        }
        
		$scope.WizardClick = function (clickID) {
			if (clickID == 1) {
				if($scope.tabId > 1)
					$scope.tabId = $scope.tabId - 1;
			}
			else if (clickID == 2) {
				 
				if($scope.tabId < 3)
				{
					$scope.tabId = $scope.tabId + 1;
				}
				if($scope.tabId == 1)
				{
					$scope.opts = "---";
				}
				if($scope.tabId == 2)
				{
					var fld;
					var data = "{";
					for (fld in form.fields) {
						
						if(fld == "datacenter" || fld == "credential")
						{
							data += "'" + fld + "':";
			            	if($scope[fld] != undefined) data += "'" + $scope[fld].value + "'";
			            	else data += "''";
			            	data += ",\n"; 
			            	continue;
						}
		            	if(fld != "opts")
		            	{
			            	data += "'" + fld + "':";
			            	if($scope[fld] != undefined) data += "'" + $scope[fld] + "'";
			            	else data += "''";
			            	data += ",\n"; 
			            	/*
			                if (form.fields[fld].realName) {
			                    data = data[form.fields[fld].realName] = $scope[fld];
			                }else {
			                    data[fld] = $scope[fld]; 
			                }*/
			            }
		            }
		        	data += "}";

		            $scope.opts = data;
					$scope.parseTypeOpts = 'yaml';
			        ParseTypeChange({
			            scope: $scope,
			            field_id: 'opts',
			            variable: 'opts',
			            onChange: callback,
			            parse_variable: 'parseTypeOpts'
			        });

					//$scope.opts = getVars(data);
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

        // prepares a data payload for a PUT request to the API
        var processNewData = function(fields) {
            var data = {};
            _.forEach(fields, function(value, key) {
                if ($scope[key] !== '' && $scope[key] !== null && $scope[key] !== undefined) {
                    data[key] = $scope[key];
                }
            });
            data.datacenter = $scope.datacenter.value;
    		data.credential = $scope.credential.value;
    		data.opts = $scope.opts;
    		
            return data;
        };
        // Save
        $scope.formSave = function() {
            var fld, data = {};
            Rest.setUrl(defaultUrl);
            var data = processNewData(form.fields);
            Wait('start');
            Rest.post(data)
                .then(({data}) => {
                    var base = $location.path().replace(/^\//, '').split('/')[0];
                    if (base === 'ipam_apps') {
                        $rootScope.flashMessage = i18n._('New App successfully created!');
                        $rootScope.$broadcast("EditIndicatorChange", "App", data.id);
                        
                        //$state.go('infraAppsList.edit', { app_id: data.id }, { reload: true });
                         $state.go('infraAppsList', null, { reload: true });
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
