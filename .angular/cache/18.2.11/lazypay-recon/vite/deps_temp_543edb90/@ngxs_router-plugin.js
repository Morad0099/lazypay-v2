import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  ResolveEnd,
  Router,
  RoutesRecognized
} from "./chunk-62JGLAOV.js";
import {
  Action,
  NgxsFeatureModule,
  NgxsModule,
  State,
  StateToken,
  Store,
  createSelector,
  provideStates
} from "./chunk-BESAAL6C.js";
import "./chunk-UAV2ZV4I.js";
import "./chunk-WFSON2V5.js";
import "./chunk-E5Y3P4G5.js";
import {
  Injectable,
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  makeEnvironmentProviders,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-D4YOU6HH.js";
import "./chunk-KKSL7W6X.js";
import "./chunk-CXNAVVMS.js";
import {
  ReplaySubject,
  takeUntil
} from "./chunk-XQSEKRDZ.js";
import {
  __decorate,
  __metadata
} from "./chunk-HM5YLMWO.js";
import {
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// node_modules/@ngxs/router-plugin/fesm2022/ngxs-router-plugin-internals.mjs
var NG_DEV_MODE = typeof ngDevMode !== "undefined" && ngDevMode;
var ɵUSER_OPTIONS = new InjectionToken(NG_DEV_MODE ? "USER_OPTIONS" : "", {
  providedIn: "root",
  factory: () => void 0
});
var ɵNGXS_ROUTER_PLUGIN_OPTIONS = new InjectionToken(NG_DEV_MODE ? "NGXS_ROUTER_PLUGIN_OPTIONS" : "", {
  providedIn: "root",
  factory: () => ({})
});
function ɵcreateRouterPluginOptions(options) {
  return {
    navigationActionTiming: options && options.navigationActionTiming || 1
    /* NavigationActionTiming.PreActivation */
  };
}

// node_modules/@ngxs/router-plugin/fesm2022/ngxs-router-plugin.mjs
var Navigate = class {
  static {
    this.type = "[Router] Navigate";
  }
  constructor(path, queryParams, extras) {
    this.path = path;
    this.queryParams = queryParams;
    this.extras = extras;
  }
};
var RouterRequest = class {
  static {
    this.type = "[Router] RouterRequest";
  }
  constructor(routerState, event, trigger = "none") {
    this.routerState = routerState;
    this.event = event;
    this.trigger = trigger;
  }
};
var RouterNavigation = class {
  static {
    this.type = "[Router] RouterNavigation";
  }
  constructor(routerState, event, trigger = "none") {
    this.routerState = routerState;
    this.event = event;
    this.trigger = trigger;
  }
};
var RouterCancel = class {
  static {
    this.type = "[Router] RouterCancel";
  }
  constructor(routerState, storeState, event, trigger = "none") {
    this.routerState = routerState;
    this.storeState = storeState;
    this.event = event;
    this.trigger = trigger;
  }
};
var RouterError = class {
  static {
    this.type = "[Router] RouterError";
  }
  constructor(routerState, storeState, event, trigger = "none") {
    this.routerState = routerState;
    this.storeState = storeState;
    this.event = event;
    this.trigger = trigger;
  }
};
var RouterDataResolved = class {
  static {
    this.type = "[Router] RouterDataResolved";
  }
  constructor(routerState, event, trigger = "none") {
    this.routerState = routerState;
    this.event = event;
    this.trigger = trigger;
  }
};
var RouterNavigated = class {
  static {
    this.type = "[Router] RouterNavigated";
  }
  constructor(routerState, event, trigger = "none") {
    this.routerState = routerState;
    this.event = event;
    this.trigger = trigger;
  }
};
var RouterStateSerializer = class {
};
var DefaultRouterStateSerializer = class {
  serialize(routerState) {
    return {
      root: this.serializeRoute(routerState.root),
      url: routerState.url
    };
  }
  serializeRoute(route) {
    const children = route.children.map((c) => this.serializeRoute(c));
    return {
      url: route.url,
      title: route.title,
      params: route.params,
      queryParams: route.queryParams,
      fragment: route.fragment,
      data: route.data,
      outlet: route.outlet,
      component: null,
      routeConfig: null,
      root: null,
      parent: null,
      firstChild: children[0],
      children,
      pathFromRoot: null,
      paramMap: route.paramMap,
      queryParamMap: route.queryParamMap,
      toString: route.toString
    };
  }
};
var ROUTER_STATE_TOKEN = new StateToken("router");
var RouterState = class RouterState2 {
  static {
    this.state = createSelector([ROUTER_STATE_TOKEN], (state) => {
      return state?.state;
    });
  }
  static {
    this.url = createSelector([ROUTER_STATE_TOKEN], (state) => state?.state?.url);
  }
  constructor(_store, _router, _serializer, _ngZone, injector) {
    this._store = _store;
    this._router = _router;
    this._serializer = _serializer;
    this._ngZone = _ngZone;
    this._trigger = "none";
    this._routerState = null;
    this._storeState = null;
    this._lastEvent = null;
    this._options = null;
    this._destroy$ = new ReplaySubject(1);
    this._options = injector.get(ɵNGXS_ROUTER_PLUGIN_OPTIONS, null);
    this._setUpStoreListener();
    this._setUpRouterEventsListener();
  }
  ngOnDestroy() {
    this._destroy$.next();
  }
  navigate(_, action) {
    return this._ngZone.run(() => this._router.navigate(action.path, __spreadValues({
      queryParams: action.queryParams
    }, action.extras)));
  }
  angularRouterAction(ctx, action) {
    ctx.setState({
      trigger: action.trigger,
      state: action.routerState,
      navigationId: action.event.id
    });
  }
  _setUpStoreListener() {
    const routerState$ = this._store.select(ROUTER_STATE_TOKEN).pipe(takeUntil(this._destroy$));
    routerState$.subscribe((state) => {
      this._navigateIfNeeded(state);
    });
  }
  _navigateIfNeeded(routerState) {
    if (routerState && routerState.trigger === "devtools") {
      this._storeState = this._store.selectSnapshot(ROUTER_STATE_TOKEN);
    }
    const canSkipNavigation = !this._storeState || !this._storeState.state || !routerState || routerState.trigger === "router" || this._router.url === this._storeState.state.url || this._lastEvent instanceof NavigationStart;
    if (canSkipNavigation) {
      return;
    }
    this._storeState = this._store.selectSnapshot(ROUTER_STATE_TOKEN);
    this._trigger = "store";
    this._ngZone.run(() => this._router.navigateByUrl(this._storeState.state.url));
  }
  _setUpRouterEventsListener() {
    const dispatchRouterNavigationLate = this._options != null && this._options.navigationActionTiming === 2;
    let lastRoutesRecognized;
    const events$ = this._router.events.pipe(takeUntil(this._destroy$));
    events$.subscribe((event) => {
      this._lastEvent = event;
      if (event instanceof NavigationStart) {
        this._navigationStart(event);
      } else if (event instanceof RoutesRecognized) {
        lastRoutesRecognized = event;
        if (!dispatchRouterNavigationLate && this._trigger !== "store") {
          this._dispatchRouterNavigation(lastRoutesRecognized);
        }
      } else if (event instanceof ResolveEnd) {
        this._dispatchRouterDataResolved(event);
      } else if (event instanceof NavigationCancel) {
        this._dispatchRouterCancel(event);
        this._reset();
      } else if (event instanceof NavigationError) {
        this._dispatchRouterError(event);
        this._reset();
      } else if (event instanceof NavigationEnd) {
        if (this._trigger !== "store") {
          if (dispatchRouterNavigationLate) {
            this._dispatchRouterNavigation(lastRoutesRecognized);
          }
          this._dispatchRouterNavigated(event);
        }
        this._reset();
      }
    });
  }
  /** Reacts to `NavigationStart`. */
  _navigationStart(event) {
    this._routerState = this._serializer.serialize(this._router.routerState.snapshot);
    if (this._trigger !== "none") {
      this._storeState = this._store.selectSnapshot(ROUTER_STATE_TOKEN);
      this._dispatchRouterAction(new RouterRequest(this._routerState, event, this._trigger));
    }
  }
  /** Reacts to `ResolveEnd`. */
  _dispatchRouterDataResolved(event) {
    const routerState = this._serializer.serialize(event.state);
    this._dispatchRouterAction(new RouterDataResolved(routerState, event, this._trigger));
  }
  /** Reacts to `RoutesRecognized` or `NavigationEnd`, depends on the `navigationActionTiming`. */
  _dispatchRouterNavigation(lastRoutesRecognized) {
    const nextRouterState = this._serializer.serialize(lastRoutesRecognized.state);
    this._dispatchRouterAction(new RouterNavigation(nextRouterState, new RoutesRecognized(lastRoutesRecognized.id, lastRoutesRecognized.url, lastRoutesRecognized.urlAfterRedirects, nextRouterState), this._trigger));
  }
  /** Reacts to `NavigationCancel`. */
  _dispatchRouterCancel(event) {
    this._dispatchRouterAction(new RouterCancel(this._routerState, this._storeState, event, this._trigger));
  }
  /** Reacts to `NavigationEnd`. */
  _dispatchRouterError(event) {
    this._dispatchRouterAction(new RouterError(this._routerState, this._storeState, new NavigationError(event.id, event.url, `${event}`), this._trigger));
  }
  /** Reacts to `NavigationEnd`. */
  _dispatchRouterNavigated(event) {
    const routerState = this._serializer.serialize(this._router.routerState.snapshot);
    this._dispatchRouterAction(new RouterNavigated(routerState, event, this._trigger));
  }
  _dispatchRouterAction(action) {
    this._trigger = "router";
    try {
      this._store.dispatch(action);
    } finally {
      this._trigger = "none";
    }
  }
  _reset() {
    this._trigger = "none";
    this._storeState = null;
    this._routerState = null;
  }
  static {
    this.ɵfac = function RouterState_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RouterState2)(ɵɵinject(Store), ɵɵinject(Router), ɵɵinject(RouterStateSerializer), ɵɵinject(NgZone), ɵɵinject(Injector));
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: RouterState2,
      factory: RouterState2.ɵfac
    });
  }
};
__decorate([Action(Navigate), __metadata("design:type", Function), __metadata("design:paramtypes", [Object, Navigate]), __metadata("design:returntype", void 0)], RouterState.prototype, "navigate", null);
__decorate([Action([RouterRequest, RouterNavigation, RouterError, RouterCancel, RouterDataResolved, RouterNavigated]), __metadata("design:type", Function), __metadata("design:paramtypes", [Object, Object]), __metadata("design:returntype", void 0)], RouterState.prototype, "angularRouterAction", null);
RouterState = __decorate([State({
  name: ROUTER_STATE_TOKEN,
  defaults: {
    state: void 0,
    navigationId: void 0,
    trigger: "none"
  }
}), __metadata("design:paramtypes", [Store, Router, RouterStateSerializer, NgZone, Injector])], RouterState);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouterState, [{
    type: Injectable
  }], () => [{
    type: Store
  }, {
    type: Router
  }, {
    type: RouterStateSerializer
  }, {
    type: NgZone
  }, {
    type: Injector
  }], {
    navigate: [],
    angularRouterAction: []
  });
})();
var NgxsRouterPluginModule = class _NgxsRouterPluginModule {
  static forRoot(options) {
    return {
      ngModule: _NgxsRouterPluginModule,
      providers: [{
        provide: ɵUSER_OPTIONS,
        useValue: options
      }, {
        provide: ɵNGXS_ROUTER_PLUGIN_OPTIONS,
        useFactory: ɵcreateRouterPluginOptions,
        deps: [ɵUSER_OPTIONS]
      }, {
        provide: RouterStateSerializer,
        useClass: DefaultRouterStateSerializer
      }]
    };
  }
  static {
    this.ɵfac = function NgxsRouterPluginModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NgxsRouterPluginModule)();
    };
  }
  static {
    this.ɵmod = ɵɵdefineNgModule({
      type: _NgxsRouterPluginModule,
      imports: [NgxsFeatureModule]
    });
  }
  static {
    this.ɵinj = ɵɵdefineInjector({
      imports: [NgxsModule.forFeature([RouterState])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsRouterPluginModule, [{
    type: NgModule,
    args: [{
      imports: [NgxsModule.forFeature([RouterState])]
    }]
  }], null, null);
})();
function withNgxsRouterPlugin(options) {
  return makeEnvironmentProviders([provideStates([RouterState]), {
    provide: ɵUSER_OPTIONS,
    useValue: options
  }, {
    provide: ɵNGXS_ROUTER_PLUGIN_OPTIONS,
    useFactory: ɵcreateRouterPluginOptions,
    deps: [ɵUSER_OPTIONS]
  }, {
    provide: RouterStateSerializer,
    useClass: DefaultRouterStateSerializer
  }]);
}
export {
  DefaultRouterStateSerializer,
  Navigate,
  NgxsRouterPluginModule,
  ROUTER_STATE_TOKEN,
  RouterCancel,
  RouterDataResolved,
  RouterError,
  RouterNavigated,
  RouterNavigation,
  RouterRequest,
  RouterState,
  RouterStateSerializer,
  withNgxsRouterPlugin
};
//# sourceMappingURL=@ngxs_router-plugin.js.map
