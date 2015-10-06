'use strict';

//import * as angular from 'angular';
import * as app from '../app';
import {ServantService} from '../services/servant';
import {ScrollService} from '../services/scroll';
import {ServantModel, SkillModel, StatusModel} from '../models/servant';

interface ServantDetailParams extends ng.route.IRouteParamsService {
  id: string;
}

class ServantDetailController {
  public servant: ServantModel;

  public static $inject = [
    '$routeParams',
    'ServantService',
    'ScrollService'
  ];

  constructor(
    private $routeParams: ServantDetailParams,
    private servantService: ServantService,
    private scrollService: ScrollService
  ) {
    servantService.load()
      .then(() => {
        this.servant = servantService.getServantWithId(+$routeParams.id);
        this.scrollService.restore();
      });
  }
}

class Definition {
  static ddo() {
    return {
      controller: ServantDetailController,
      controllerAs: 'c',
      restrict: 'E',
      templateUrl: '/assets/templates/servant-detail.html'
    };
  }
}

angular.module('app').directive('lovaServantDetail', Definition.ddo);
