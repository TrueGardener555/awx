/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/


export default
	[   'Wait',  'CreateDialog', 'GetBasePath' , 'Rest' , 'ProcessErrors', '$rootScope', '$state', 
	'$scope', '$filter', 'CreateSelect2', 'i18n', '$transitions', 'Prompt',
function( Wait, CreateDialog, GetBasePath, Rest, ProcessErrors, $rootScope, $state, 
	$scope, $filter, CreateSelect2, i18n, $transitions, Prompt) {

                var defaultUrl = GetBasePath('ipam_prefixes');
				var edit_id;	//Proper ID at datacenters
				var edit_no;	//No in List

                var getipamRirs = function(){
                    Rest.setUrl(defaultUrl + "?order_by=prefix");
                    Rest.get()
                        .then(({data}) => {
                            $scope.prefixLists = data.results;
                            Wait('stop');
                        })
                        .catch(({data, status}) => {
                            ProcessErrors($scope, data, status, null, {hdr: i18n._('Error!'),
                            msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status )});
                        });
                };
                
                $scope.showKeyPane = false;
				/* Pane variables  (Title, Button Name, ...)*/
                $scope.showPane = false;
                
                $scope.toggleKeyPane = function(){
                	$scope.showKeyPane = !$scope.showKeyPane;
            	};
            	
				var resetUi = function(){
					$scope.prefix = "";
					$scope.description = "";
					$scope.datacenter = "";
					$scope.vrf = "";
					$scope.is_pool = "";
				}

            	$scope.formCreate = function() {
					$scope.paneType = 1;	//Set as New
					$scope.paneTitle = "New Prefix";
					$scope.submitTitle = "Create a New";
            		$scope.showPane = true;
					
            		console.log($scope.prefixLists);
            	}

				$scope.editClick = function(Id) {
					$scope.paneType = 2;	//Set as Edit

					edit_id = $scope.prefixLists[Id].id;
					edit_no = Id;
					$scope.paneTitle = "Edit Prefix / " + $scope.prefixLists[Id].name;

					$scope.prefix = $scope.prefixLists[Id].prefix;
					$scope.description = $scope.prefixLists[Id].description;
					$scope.datacenter = $scope.prefixLists[Id].datacenter;
					$scope.vrf = $scope.prefixLists[Id].vrf;
					$scope.is_pool = $scope.prefixLists[Id].is_pool;

					$scope.submitTitle = "Update";

					$scope.showPane = true;
				}
				/* Include all function as New, Update*/
            	$scope.formSubmit = function(){
					if($scope.paneType == 1)
					{
						//Create New Event
						var prefixes = { 'prefix':$scope.prefix, 'description': $scope.description, 'vrf':$scope.vrf, 'family' :$scope.family, 'datacenter':$scope.datacenter, 'is_pool':$scope.is_pool};

						Rest.setUrl(defaultUrl);            		
						Rest.post(prefixes)
							.then(({data}) => {
								getipamRirs();
								resetUi();
								$scope.showPane = false;
							})
							.catch(({data, status}) => {
								ProcessErrors($scope, data, status, null, {hdr: i18n._('Error!'),
								msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status )});
							});


					}
					else
					{
						//Edit Submit (Update) Event.
						var prefixes = { 'prefix':$scope.prefix, 'description': $scope.description, 'vrf':$scope.vrf, 'family' :$scope.family, 'datacenter':$scope.datacenter, 'is_pool':$scope.is_pool};

						Rest.setUrl(defaultUrl + edit_id + '/');      
						Rest.put(prefixes)
							.then(({data}) => {
								getipamRirs();
								resetUi();
								$scope.showPane = false;
							})
							.catch(({data, status}) => {
								ProcessErrors($scope, data, status, null, {hdr: i18n._('Error!'),
								msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status )});
							});
						

					}
					
            	}

            	$scope.formCancel = function(){
					resetUi();
                	$scope.showPane = false;
            	};
            	
				var deleteId;
				$scope.showModal = false;
				
            	
            	
            	$scope.modal_cancel = function(){
            		$scope.showModal = false;
				}

				$scope.deleteClick = function(id, name) {
                	var action = function() {
						$('#prompt-modal').modal('hide');
						Wait('start');
						Rest.setUrl(defaultUrl + id + '/');
						Rest.destroy()
						.then(() => {
							getipamRirs();
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

                getipamRirs();
                
                
        }
    ];
