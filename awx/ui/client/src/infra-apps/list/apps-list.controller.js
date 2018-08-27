/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import { N_ } from "../../i18n";

export default ['$scope', '$rootScope', 'Rest', 'AppList', 'Prompt',
    'ProcessErrors', 'GetBasePath', 'Wait', '$state', '$filter',
    'rbacUiControlService', 'Dataset', 'i18n', 
    function($scope, $rootScope, Rest, AppList, Prompt,
    ProcessErrors, GetBasePath, Wait, $state, $filter, rbacUiControlService,
    Dataset, i18n) {

        var list = AppList,
        defaultUrl = GetBasePath('ipam_apps');

        init();

        function init() {

            $scope.canAdd = false;
            
            rbacUiControlService.canAdd('ipam_apps')
                .then(function(params) {
                    $scope.canAdd = params.canAdd;
                });
                
            // search init
            $scope.list = list;
            $scope[`${list.iterator}_dataset`] = Dataset.data;
            $scope[list.name] = $scope[`${list.iterator}_dataset`].results;


            $rootScope.flashMessage = null;
            $scope.selected = [];
        }
        
        $scope.addApp = function() {
            $state.go('infraAppsList.add');
        };
 
        $scope.editApp= function() {
        	console.log("stateGO");
            $state.go('infraAppsList.edit', { app_id: this.app.id });
        };

        $scope.deleteApp = function(id, name) {
            var action = function() {
                $('#prompt-modal').modal('hide');
                Wait('start');
                var url = defaultUrl + id + '/';
                Rest.setUrl(url);
                Rest.destroy()
                    .then(() => {
                        let reloadListStateParams = null;

                        if($scope.ipam_apps.length === 1 && $state.params.app_search && !_.isEmpty($state.params.app_search.page) && $state.params.app_search.page !== '1') {
                            reloadListStateParams = _.cloneDeep($state.params);
                            reloadListStateParams.app_search.page = (parseInt(reloadListStateParams.app_search.page)-1).toString();
                        }

                        if (parseInt($state.params.app_id) === id) {
                            $state.go('^', null, { reload: true });
                        } else {
                            $state.go('.', null, { reload: true });
                        }
                    })
                    .catch(({data, status}) => {
                        ProcessErrors($scope, data, status, null, {
                            hdr: i18n._('Error!'),
                            msg: i18n.sprintf(i18n._('Call to %s failed. DELETE returned status: '), url) + status
                        });
                    });
            };

            Prompt({
                hdr: i18n._('Delete'),
                resourceName: $filter('sanitize')(name),
                body: '<div class="Prompt-bodyQuery">' + i18n._('Are you sure you want to delete this App?') + '</div>',
                action: action,
                actionText: i18n._('DELETE')
            });
        };
    }
];
