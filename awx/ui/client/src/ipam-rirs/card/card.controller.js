/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/


export default
    [   'Wait',  'CreateDialog', 'GetBasePath' ,
        'Rest' ,
        'ProcessErrors', '$rootScope', '$state',
        '$scope', 'CreateSelect2', 'i18n', '$transitions',
        function( Wait, CreateDialog, GetBasePath,
            Rest, ProcessErrors,
            $rootScope, $state, $scope,
            CreateSelect2, i18n, $transitions) {

                var defaultUrl = GetBasePath('ipam_rirs') + "?order_by=name";

                var getipamRirs = function(){
                    Rest.setUrl(defaultUrl);
                    Rest.get()
                        .then(({data}) => {
                            $scope.mgmtCards = data.results;
                            Wait('stop');
                        })
                        .catch(({data, status}) => {
                            ProcessErrors($scope, data, status, null, {hdr: i18n._('Error!'),
                            msg: i18n.sprintf(i18n._('Call to %s failed. Return status: %d'), (defaultUrl === undefined) ? "undefined" : defaultUrl, status )});
                        });
                };
                getipamRirs();


        }
    ];
