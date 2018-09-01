/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import { N_ } from "../../i18n";

export default ['$scope', '$rootScope', '$stateParams', 'AppForm', 'GenerateForm', 'Rest','ParseTypeChange',
    'Alert', 'ProcessErrors', 'ReturnToCaller', 'GetBasePath',
    'Wait', 'CreateSelect2', '$state', '$location', 'i18n','ParseVariableString',
    function($scope, $rootScope, $stateParams, AppForm, GenerateForm, Rest, ParseTypeChange, Alert,
    ProcessErrors, ReturnToCaller, GetBasePath, Wait, CreateSelect2,
	$state, $location, i18n,ParseVariableString) {

        var form = AppForm,
            master = {},
            id = $stateParams.app_id,
            defaultUrl = GetBasePath('ipam_apps') + id;
        
        init();

        function init() {
            Rest.setUrl(defaultUrl);
            Wait('start');
            Rest.get(defaultUrl).then(({data}) => {
        		
                $scope.app_id = id;
		        $scope.tabId = 1;
				$scope.previous = "CLOSE";
				$scope.next = "NEXT";
                $scope.app_obj = data;
                
                $scope.status1 = "active";
                
                $scope.name = data.name;
                $scope.description = data.description;
                $scope.token = data.token;
                $scope.username = data.username;
                $scope.password = data.password;
                $scope.scm_type = data.scm_type;
                $scope.scm_url = data.scm_url;
                $scope.scm_branch = data.scm_branch;
                $scope.scm_revision = data.scm_revision;
                $scope.svc_enabled = data.scm_enabled;
                $scope.security = data.security;
                $scope.requirements = data.requirements;
                $scope.source = data.source;
                var datacenter_value = data.datacenter;
                var credential_value = data.credential;
                
                
				//setScopeFields(data);
				//Set YAML/JSON Oots
				var callback = function() {
		            // Make sure the form controller knows there was a change
		            $scope[form.name + '_form'].$setDirty();
		        };
				$scope.opts = data.opts;//ParseVariableString(getVars(data.opts));

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
                Wait('stop');
            })
            .catch(({data, status}) => {
                ProcessErrors($scope, data, status, null, {
                    hdr: i18n._('Error!'),
                    msg: i18n.sprintf(i18n._('Failed to retrieve App: %s. GET status: '), $stateParams.id) + status
                });
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
				if($scope.tabId == 2)
				{

					//$scope.opts = getVars(data);
				}
				if($scope.tabId == 3)
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
		            $scope.opts = ParseVariableString(data);
					$scope.parseTypeOpts = 'yaml';
			        ParseTypeChange({
			            scope: $scope,
			            field_id: 'app_opts',
			            variable: 'opts',
			            onChange: callback,
			            parse_variable: 'parseTypeOpts'
			        });
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

		function setScopeFields(data) {
            _(data)
                .pick(function(value, key) {
                    return form.fields.hasOwnProperty(key) === true;
                })
                .forEach(function(value, key) {
                    $scope[key] = value;
                })
                .value();
            return;
        }

        // prepares a data payload for a PUT request to the API
        var processNewData = function(fields) {
            var data = {};
            _.forEach(fields, function(value, key) {
                if ($scope[key] !== '' && $scope[key] !== null && $scope[key] !== undefined) {
                    data[key] = $scope[key];
                }
            });
            if($scope.datacenter != null) data.datacenter = $scope.datacenter.value;
            if($scope.credential != null) data.credential = $scope.credential.value;
    		data.opts = $scope.opts;
    		
            return data;
        };

        $scope.formCancel = function() {
            $state.go('infraAppsList', null, { reload: true });
        };

        $scope.formSave = function() {
        	console.log("Update");
            $rootScope.flashMessage = null;
            
            Rest.setUrl(defaultUrl + '/');
            var data = processNewData(form.fields);
            console.log(data);
            Rest.put(data).then(() => {
                    //$state.go($state.current, null, { reload: true });
                    $state.go('infraAppsList', null, { reload: true });
                })
                .catch(({data, status}) => {
                    ProcessErrors($scope, data, status, null, {
                        hdr: i18n._('Error!'),
                        msg: i18n.sprintf(i18n._('Failed to retrieve Ipam: %s. GET status: '), $stateParams.id) + status
                    });
                });
        };
    }
];
