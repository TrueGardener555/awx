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

                var defaultUrl = GetBasePath('ipam_vrfs');
				var edit_id;	//Proper ID at datacenters
				var edit_no;	//No in List

                var getipamVrfs = function(){
                    Rest.setUrl(defaultUrl + "?order_by=name");
                    Rest.get()
                        .then(({data}) => {
                            $scope.vrfLists = data.results;
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
					$scope.name = "";
					$scope.description = "";
					$scope.rd = "";
					$scope.enforce_unique = "";

				}

            	$scope.formCreate = function() {
					$scope.paneType = 1;	//Set as New
					$scope.paneTitle = "New VRF";
					$scope.submitTitle = "Create a New";
            		$scope.showPane = true;
					
            		console.log($scope.vrfLists);
            	}

				$scope.editClick = function(Id) {
					$scope.paneType = 2;	//Set as Edit

					edit_id = $scope.vrfLists[Id].id;
					edit_no = Id;
					$scope.paneTitle = "Edit VRF / " + $scope.vrfLists[Id].name;
					
					$scope.name =  $scope.vrfLists[Id].name;
					$scope.description =  $scope.vrfLists[Id].description;
					$scope.rd = $scope.vrfLists[Id].rd;
					$scope.enforce_unique = $scope.vrfLists[Id].enforce_unique;

					$scope.submitTitle = "Update";

					$scope.showPane = true;
				}
				/* Include all function as New, Update*/
            	$scope.formSubmit = function(){
					if($scope.paneType == 1)
					{
						//Create New Event
						var vrf = { 'name':$scope.name, 'description': $scope.description, 'rd':$scope.rd, 'enforce_unique':$scope.enforce_unique};

						Rest.setUrl(defaultUrl);            		
						Rest.post(vrf)
							.then(({data}) => {
								getipamVrfs();
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
						var vrf = { 'name':$scope.name, 'description': $scope.description, 'rd':$scope.rd, 'enforce_unique':$scope.enforce_unique};

						Rest.setUrl(defaultUrl + edit_id + '/');      
						Rest.put(vrf)
							.then(({data}) => {
								getipamVrfs();
								$scope.showPane = false;
							})
							.catch(({data, status}) => {
								ProcessErrors($scope, data, status, null, {hdr: i18n._('Error!'),
								msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status )});
							});
						

					}
					resetUi();
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
							getipamVrfs();
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

                getipamVrfs();
                
                
        }
    ];

/*

								*/