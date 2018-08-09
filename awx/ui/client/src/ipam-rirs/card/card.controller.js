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

                var defaultUrl = GetBasePath('ipam_rirs');
				var edit_id;	//Proper ID at datacenters
				var edit_no;	//No in List

                var getipamRirs = function(){
                    Rest.setUrl(defaultUrl + "?order_by=name");
                    Rest.get()
                        .then(({data}) => {
                            $scope.rirLists = data.results;
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
            	
            	$scope.formCancel = function(){
                	$scope.showPane = false;
            	};
            	
				var resetUi = function(){
					$scope.name = "";
					$scope.description = "";
					$scope.rir_type = "";
					$scope.rir_region = "";
				}

            	$scope.formCreate = function() {
					$scope.paneType = 1;	//Set as New
					$scope.paneTitle = "New RIR";
					$scope.submitTitle = "Create a New";
            		$scope.showPane = true;
            		console.log($scope.rirLists);
            	}

				$scope.editClick = function(rirId) {
					$scope.paneType = 2;	//Set as Edit

					edit_id = $scope.rirLists[rirId].id;
					edit_no = rirId;
					$scope.paneTitle = "Edit RIR / " + $scope.rirLists[rirId].name;

					$scope.name = $scope.rirLists[rirId].name;
					$scope.description = $scope.rirLists[rirId].description;
					$scope.rir_type = $scope.rirLists[rirId].rir_type;
					$scope.rir_region = $scope.rirLists[rirId].rir_region;

					$scope.submitTitle = "Update";

					$scope.showPane = true;
				}
				/* Include all function as New, Update*/
            	$scope.formSubmit = function(){
					if($scope.paneType == 1)
					{
						//Create New Event
						var rirs = { 'name':$scope.name, 'description': $scope.description, 'rir_type':$scope.rir_type, 'rir_region':$scope.rir_region};

						Rest.setUrl(defaultUrl);            		
						Rest.post(rirs)
							.then(({data}) => {
								getipamRirs();
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
						var rirs = { 'name':$scope.name, 'description': $scope.description, 'rir_type':$scope.rir_type, 'rir_region':$scope.rir_region};

						Rest.setUrl(defaultUrl + edit_id + '/');      
						Rest.put(rirs)
							.then(({data}) => {
								getipamRirs();
								$scope.showPane = false;
							})
							.catch(({data, status}) => {
								ProcessErrors($scope, data, status, null, {hdr: i18n._('Error!'),
								msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status )});
							});
						

					}
            	}

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
                        body: '<div class="Prompt-bodyQuery">' + i18n._('Are you sure you want to delete this datacenter?') + '</div>',
                        action: action,
                        actionText: i18n._('DELETE')
                    });
                }

                getipamRirs();
                
                
        }
    ];

/*

								*/