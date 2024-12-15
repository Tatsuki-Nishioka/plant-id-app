import { version, unref, inject, defineComponent, provide, shallowReactive, h, ref, watch, Suspense, nextTick, Fragment, Transition, useSSRContext, resolveComponent, mergeProps, withCtx, createTextVNode, createApp, effectScope, reactive, getCurrentScope, hasInjectionContext, getCurrentInstance, computed, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, toRef, defineAsyncComponent, shallowRef, isReadonly, isRef, isShallow, isReactive, toRaw } from 'vue';
import { $ as $fetch, k as defu, p as parseQuery, l as createHooks, e as createError$1, m as hasProtocol, n as joinURL, o as getContext, q as isScriptProtocol, w as withQuery, r as sanitizeStatusCode, v as withTrailingSlash, x as withoutTrailingSlash, y as toRouteMatcher, z as createRouter$1 } from '../_/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { getActiveHead, CapoPlugin } from 'unhead';
import { defineHeadPlugin } from '@unhead/shared';
import { RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
const appPageTransition = false;
const appKeepalive = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink", "prefetch": true, "prefetchOn": { "visibility": true } };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  var _a;
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.14.1592";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...((_a = options.ssrContext) == null ? void 0 : _a.payload) || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b, _c, _d;
  const resolvedPlugins = [];
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin2.dependsOn) == null ? void 0 : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.includes(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.push(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin2.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) && ((_d = plugin2.env) == null ? void 0 : _d.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = (options == null ? void 0 : options.external) || isExternalHost;
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value = error2.value || nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
version[0] === "3";
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2) {
  if (ref2 instanceof Promise || ref2 instanceof Date || ref2 instanceof RegExp)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r));
  if (typeof root === "object") {
    const resolved = {};
    for (const k in root) {
      if (!Object.prototype.hasOwnProperty.call(root, k)) {
        continue;
      }
      if (k === "titleTemplate" || k[0] === "o" && k[1] === "n") {
        resolved[k] = unref(root[k]);
        continue;
      }
      resolved[k] = resolveUnrefHeadInput(root[k]);
    }
    return resolved;
  }
  return root;
}
defineHeadPlugin({
  hooks: {
    "entries:resolve": (ctx) => {
      for (const entry2 of ctx.entries)
        entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
    }
  }
});
const headSymbol = "usehead";
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__unhead_injection_handler__";
function setHeadInjectionHandler(handler) {
  _global[globalKey$1] = handler;
}
function injectHead() {
  if (globalKey$1 in _global) {
    return _global[globalKey$1]();
  }
  const head = inject(headSymbol);
  if (!head && "production" !== "production")
    console.warn("Unhead is missing Vue context, falling back to shared context. This may have unexpected results.");
  return head || getActiveHead();
}
[CapoPlugin({ track: true })];
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    setHeadInjectionHandler(
      // need a fresh instance of the nuxt app to avoid parallel requests interfering with each other
      () => useNuxtApp().vueApp._context.provides.usehead
    );
    nuxtApp.vueApp.use(head);
  }
});
function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
_globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}
const ROUTE_KEY_PARENTHESES_RE$1 = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE$1 = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE$1 = /:\w+/g;
const interpolatePath = (route, match) => {
  return match.path.replace(ROUTE_KEY_PARENTHESES_RE$1, "$1").replace(ROUTE_KEY_SYMBOLS_RE$1, "$1").replace(ROUTE_KEY_NORMAL_RE$1, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey$1 = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(url) {
  {
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(url).reverse());
  }
}
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => import('./index-CaIJSgnZ.mjs')
  },
  {
    name: "search",
    path: "/search",
    component: () => import('./search-De30LYKf.mjs')
  }
];
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a;
    return props ? h(component, props, slots) : (_a = slots.default) == null ? void 0 : _a.call(slots);
  } };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = (route == null ? void 0 : route.meta.key) ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index]) == null ? void 0 : _a.components) == null ? void 0 : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    let position = savedPosition || void 0;
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (!position && from && to && routeAllowsScrollToTop !== false && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
      return false;
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await new Promise((resolve2) => setTimeout(resolve2, 0));
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  const nuxtApp = useNuxtApp();
  const router = useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  const unsub = router.beforeResolve((final) => {
    unsub();
    if (final === to) {
      const unsub2 = router.afterEach(async () => {
        unsub2();
        await nuxtApp.runWithContext(() => showError(error));
      });
      return false;
    }
  });
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    if (routerOptions.hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    if (!((_b = nuxtApp.ssrContext) == null ? void 0 : _b.islandContext)) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if ((failure == null ? void 0 : failure.type) === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if ((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules(to.path));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result === true) {
            continue;
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from) => {
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError$1({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_KgADcZ0jPj,
  plugin,
  revive_payload_server_eJ33V7gbc6,
  components_plugin_KR1HBZs4kY
];
async function preloadRouteComponents(to, router = useRouter()) {
  {
    return;
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function resolveTrailingSlashBehavior(to, resolve) {
    if (!to || options.trailingSlash !== "append" && options.trailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, options.trailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, options.trailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink == null ? void 0 : useBuiltinLink({ ...props, to });
    const href = computed(() => {
      var _a;
      if (!to.value || isAbsoluteUrl.value) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return resolveTrailingSlashBehavior(
          href2,
          router.resolve
          /* will not be called */
        );
      }
      if (typeof to.value === "object") {
        return ((_a = router.resolve(to.value)) == null ? void 0 : _a.href) ?? null;
      }
      return resolveTrailingSlashBehavior(
        joinURL(config.app.baseURL, to.value),
        router.resolve
        /* will not be called */
      );
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: (link == null ? void 0 : link.isActive) ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: (link == null ? void 0 : link.isExactActive) ?? computed(() => to.value === router.currentRoute.value.path),
      route: (link == null ? void 0 : link.route) ?? computed(() => router.resolve(to.value)),
      async navigate() {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      const prefetched = ref(false);
      const el = void 0;
      const elRef = void 0;
      function shouldPrefetch(mode) {
        var _a, _b;
        return !prefetched.value && (typeof props.prefetchOn === "string" ? props.prefetchOn === mode : ((_a = props.prefetchOn) == null ? void 0 : _a[mode]) ?? ((_b = options.prefetchOn) == null ? void 0 : _b[mode])) && (props.prefetch ?? options.prefetch) !== false && props.noPrefetch !== true && props.target !== "_blank" && !isSlowConnection();
      }
      async function prefetch(nuxtApp = useNuxtApp()) {
        if (prefetched.value) {
          return;
        }
        prefetched.value = true;
        const path = typeof to.value === "string" ? to.value : isExternal.value ? resolveRouteObject(to.value) : router.resolve(to.value).fullPath;
        const normalizedPath = isExternal.value ? new URL(path, (void 0).location.href).href : path;
        await Promise.all([
          nuxtApp.hooks.callHook("link:prefetch", normalizedPath).catch(() => {
          }),
          !isExternal.value && !hasTarget.value && preloadRouteComponents(to.value, router).catch(() => {
          })
        ]);
      }
      return () => {
        var _a;
        if (!isExternal.value && !hasTarget.value) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            if (shouldPrefetch("interaction")) {
              routerLinkProps.onPointerenter = prefetch.bind(null, void 0);
              routerLinkProps.onFocus = prefetch.bind(null, void 0);
            }
            if (prefetched.value) {
              routerLinkProps.class = props.prefetchedClass || options.prefetchedClass;
            }
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href: href.value || null, rel, target }, (_a = slots.default) == null ? void 0 : _a.call(slots));
      };
    }
  });
}
const __nuxt_component_0 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
function isSlowConnection() {
  {
    return;
  }
}
const RouteProvider = defineComponent({
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    const forkRoute = inject(PageRouteSymbol, null);
    let previousPageKey;
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    if (props.pageKey) {
      watch(() => props.pageKey, (next, prev) => {
        if (next !== prev) {
          nuxtApp.callHook("page:loading:start");
        }
      });
    }
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            done();
            return;
          }
          const key = generateRouteKey$1(routeProps, props.pageKey);
          if (!nuxtApp.isHydrating && !hasChildrenRoutes(forkRoute, routeProps.route, routeProps.Component) && previousPageKey === key) {
            nuxtApp.callHook("page:loading:end");
          }
          previousPageKey = key;
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          const keepaliveConfig = props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive;
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              keepaliveConfig,
              h(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).then(() => nuxtApp.callHook("page:loading:end")).finally(done));
                }
              }, {
                default: () => {
                  const providerVNode = h(RouteProvider, {
                    key: key || void 0,
                    vnode: slots.default ? h(Fragment, void 0, slots.default(routeProps)) : routeProps.Component,
                    route: routeProps.route,
                    renderKey: key || void 0,
                    trackRootNodes: hasTransition,
                    vnodeRef: pageRef
                  });
                  return providerVNode;
                }
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: prop.onAfterLeave ? toArray(prop.onAfterLeave) : void 0
  }));
  return defu(..._props);
}
function hasChildrenRoutes(fork, newRoute, Component) {
  if (!fork) {
    return false;
  }
  const index = newRoute.matched.findIndex((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === (Component == null ? void 0 : Component.type);
  });
  return index < newRoute.matched.length - 1;
}
const characters = [
  {
    id: "1",
    character: "Cushion-forming plants",
    character_jpn: "クッション状の植物",
    category: "Distinctive Growth Forms and Plant-body Adaptations",
    category_jpn: "特徴的な成長形態・適応"
  },
  {
    id: "2",
    character: "Schopfbäume growth form",
    character_jpn: "シュプファウム成長（ヘゴ・ソテツ様樹形）",
    category: "Distinctive Growth Forms and Plant-body Adaptations",
    category_jpn: "特徴的な成長形態・適応"
  },
  {
    id: "3",
    character: "Swollen stems or inflated internodes",
    character_jpn: "茎が肥大する・節間が膨張する",
    category: "Distinctive Growth Forms and Plant-body Adaptations",
    category_jpn: "特徴的な成長形態・適応"
  },
  {
    id: "4",
    character: "Climbers with hooks or tendrils",
    character_jpn: "鉤・巻きひげのあるつる植物",
    category: "Distinctive Growth Forms and Plant-body Adaptations",
    category_jpn: "特徴的な成長形態・適応"
  },
  {
    id: "5",
    character: "Climbers without hooks or tendrils",
    character_jpn: "鉤・巻きひげのないつる植物",
    category: "Distinctive Growth Forms and Plant-body Adaptations",
    category_jpn: "特徴的な成長形態・適応"
  },
  {
    id: "6",
    character: "Plants climbing, with opposite leaves",
    character_jpn: "対生葉のつる植物",
    category: "Distinctive Growth Forms and Plant-body Adaptations",
    category_jpn: "特徴的な成長形態・適応"
  },
  {
    id: "7",
    character: "Presence of thorns, spines or prickles",
    character_jpn: "とげがある",
    category: "Distinctive Growth Forms and Plant-body Adaptations",
    category_jpn: "特徴的な成長形態・適応"
  },
  {
    id: "8",
    character: "Plants without chlorophyll",
    character_jpn: "無葉緑植物",
    category: "Distinctive Growth Forms and Plant-body Adaptations",
    category_jpn: "特徴的な成長形態・適応"
  },
  {
    id: "9",
    character: "Parasitic plants",
    character_jpn: "寄生植物",
    category: "Distinctive Growth Forms and Plant-body Adaptations",
    category_jpn: "特徴的な成長形態・適応"
  },
  {
    id: "10",
    character: "Ant plants",
    character_jpn: "アリ植物",
    category: "Distinctive Growth Forms and Plant-body Adaptations",
    category_jpn: "特徴的な成長形態・適応"
  },
  {
    id: "11",
    character: "Bulbils",
    character_jpn: "珠芽（ムカゴ）をつける",
    category: "Distinctive Growth Forms and Plant-body Adaptations",
    category_jpn: "特徴的な成長形態・適応"
  },
  {
    id: "12",
    character: "Swollen nodes",
    character_jpn: "節が膨らむ",
    category: "Stem and Branch Characteristics",
    category_jpn: "茎と枝"
  },
  {
    id: "13",
    character: "Winged' stems",
    character_jpn: "茎に翼がある",
    category: "Stem and Branch Characteristics",
    category_jpn: "茎と枝"
  },
  {
    id: "14",
    character: "Twigs pale-coloured, petioles dark",
    character_jpn: "枝が淡色で葉柄が暗色",
    category: "Stem and Branch Characteristics",
    category_jpn: "茎と枝"
  },
  {
    id: "15",
    character: "Flattened young twig portions",
    character_jpn: "若枝が扁平",
    category: "Stem and Branch Characteristics",
    category_jpn: "茎と枝"
  },
  {
    id: "16",
    character: "Supernumerary or serial buds",
    character_jpn: "頂芽・腋芽が複数または連続する",
    category: "Stem and Branch Characteristics",
    category_jpn: "茎と枝"
  },
  {
    id: "17",
    character: "Twigs mimicking compound leaves",
    character_jpn: "複葉のような枝",
    category: "Stem and Branch Characteristics",
    category_jpn: "茎と枝"
  },
  {
    id: "18",
    character: "Wave-like sympodial branching",
    character_jpn: "枝は添伸する（階段状の樹形）",
    category: "Stem and Branch Characteristics",
    category_jpn: "茎と枝"
  },
  {
    id: "19",
    character: "Proleptic shoots",
    character_jpn: "頂芽基部から側枝がでる",
    category: "Stem and Branch Characteristics",
    category_jpn: "茎と枝"
  },
  {
    id: "20",
    character: "White or yellow sap",
    character_jpn: "樹液が白・黄色",
    category: "Exudates: Saps and Resins",
    category_jpn: "滲出物：樹液と樹脂"
  },
  {
    id: "21",
    character: "Black or brown sap",
    character_jpn: "樹液が黒・茶色",
    category: "Exudates: Saps and Resins",
    category_jpn: "滲出物：樹液と樹脂"
  },
  {
    id: "22",
    character: "Red or orange sap",
    character_jpn: "樹液が赤・オレンジ",
    category: "Exudates: Saps and Resins",
    category_jpn: "滲出物：樹液と樹脂"
  },
  {
    id: "23",
    character: "Plants conspicuously resinous upon drying",
    character_jpn: "乾燥すると樹脂が目立つ",
    category: "Exudates: Saps and Resins",
    category_jpn: "滲出物：樹液と樹脂"
  },
  {
    id: "24",
    character: "Resinous exudate",
    character_jpn: "滲出物が樹脂性",
    category: "Exudates: Saps and Resins",
    category_jpn: "滲出物：樹液と樹脂"
  },
  {
    id: "25",
    character: "Crushed leaves with smell of fenugreek",
    character_jpn: "潰した葉はフェヌグリーク（メープルシロップ？）の匂い",
    category: "Characteristic Smells",
    category_jpn: "特徴的な匂い"
  },
  {
    id: "26",
    character: "Crushed leaves or flowers with foul or foetid smell",
    character_jpn: "潰した葉・花は悪臭や腐敗臭",
    category: "Characteristic Smells",
    category_jpn: "特徴的な匂い"
  },
  {
    id: "27",
    character: "Crushed leaves with resinous (turpentine-like) smell",
    character_jpn: "潰した葉は樹脂（松根油）の匂い",
    category: "Characteristic Smells",
    category_jpn: "特徴的な匂い"
  },
  {
    id: "28",
    character: "Other smells",
    character_jpn: "その他の匂い",
    category: "Characteristic Smells",
    category_jpn: "特徴的な匂い"
  },
  {
    id: "29",
    character: "Interpetiolar stipules and stipule-like structures",
    character_jpn: "葉柄間托葉および托葉様構造",
    category: "Stipule Characters",
    category_jpn: "托葉"
  },
  {
    id: "30",
    character: "Clasping stipules",
    character_jpn: "托葉は茎を抱く",
    category: "Stipule Characters",
    category_jpn: "托葉"
  },
  {
    id: "31",
    character: "Pectinate-laciniate stipules",
    character_jpn: "櫛状または裂状の托葉",
    category: "Stipule Characters",
    category_jpn: "托葉"
  },
  {
    id: "32",
    character: "Peltate stipules",
    character_jpn: "盾状の托葉",
    category: "Stipule Characters",
    category_jpn: "托葉"
  },
  {
    id: "33",
    character: "Striate stipules",
    character_jpn: "筋状の托葉",
    category: "Stipule Characters",
    category_jpn: "托葉"
  },
  {
    id: "34",
    character: "Foliaceous stipules",
    character_jpn: "葉状の托葉",
    category: "Stipule Characters",
    category_jpn: "托葉"
  },
  {
    id: "35",
    character: "Petioles enlarged or 'swollen' distally or at both ends",
    character_jpn: "葉柄が両端（or どちらか）で肥大・膨らむ",
    category: "Petioles and Rachises",
    category_jpn: "葉柄と葉軸"
  },
  {
    id: "36",
    character: "Petioles 'swollen' only at the base, in simple leaves",
    character_jpn: "単葉で、葉柄が基部のみ膨らむ",
    category: "Petioles and Rachises",
    category_jpn: "葉柄と葉軸"
  },
  {
    id: "37",
    character: "Petioles 'swollen' at the base, in compound leaves",
    character_jpn: "複葉で、葉柄が基部で膨らむ",
    category: "Petioles and Rachises",
    category_jpn: "葉柄と葉軸"
  },
  {
    id: "38",
    character: "Wrinkled petioles",
    character_jpn: "葉柄にしわがある",
    category: "Petioles and Rachises",
    category_jpn: "葉柄と葉軸"
  },
  {
    id: "39",
    character: "Winged petiole or rachis",
    character_jpn: "葉柄・葉軸に翼がある",
    category: "Petioles and Rachises",
    category_jpn: "葉柄と葉軸"
  },
  {
    id: "40",
    character: "Rachis with swollen nodes",
    character_jpn: "葉軸の節が膨らむ",
    category: "Petioles and Rachises",
    category_jpn: "葉柄と葉軸"
  },
  {
    id: "41",
    character: "Free rachis tip",
    character_jpn: "葉軸の先端がとびだす",
    category: "Petioles and Rachises",
    category_jpn: "葉柄と葉軸"
  },
  {
    id: "42",
    character: "Spirally arranged leaves in opposite-leaved families",
    character_jpn: "対生の科で螺旋葉序",
    category: "Leaf Arrangement",
    category_jpn: "葉序"
  },
  {
    id: "43",
    character: "Opposite leaves in spiral-leaved families",
    character_jpn: "互生・螺旋葉序の科で対生",
    category: "Leaf Arrangement",
    category_jpn: "葉序"
  },
  {
    id: "44",
    character: "Opposite compound leaves",
    character_jpn: "対生の複葉",
    category: "Leaf Arrangement",
    category_jpn: "葉序"
  },
  {
    id: "45",
    character: "Whorled or verticillate leaves; leaves in rosettes",
    character_jpn: "輪生",
    category: "Leaf Arrangement",
    category_jpn: "葉序"
  },
  {
    id: "46",
    character: "Anisophyllous leaf pairs, rosettes, or sequences",
    character_jpn: "不等葉性：異形葉の対、ロゼット、または列",
    category: "Leaf Form and Size",
    category_jpn: "葉の形状と大きさ"
  },
  {
    id: "47",
    character: "Large simple leaves in non-monocots",
    character_jpn: "単子葉植物でない大型の単葉",
    category: "Leaf Form and Size",
    category_jpn: "葉の形状と大きさ"
  },
  {
    id: "48",
    character: "Asymmetric simple leaves",
    character_jpn: "非対称な単葉",
    category: "Leaf Form and Size",
    category_jpn: "葉の形状と大きさ"
  },
  {
    id: "49",
    character: "Digitately compound leaves",
    character_jpn: "掌状複葉",
    category: "Leaf Form and Size",
    category_jpn: "葉の形状と大きさ"
  },
  {
    id: "50",
    character: "Doubly or 3(-4-) pinnate leaves",
    character_jpn: "2~4回羽状複葉",
    category: "Leaf Form and Size",
    category_jpn: "葉の形状と大きさ"
  },
  {
    id: "51",
    character: "Peltate leaves",
    character_jpn: "盾状葉",
    category: "Leaf Form and Size",
    category_jpn: "葉の形状と大きさ"
  },
  {
    id: "52",
    character: "Dentate / serrate (toothed) leaf margin (non-monocots)",
    character_jpn: "鋸歯縁（単子葉植物以外）",
    category: "Leaf Margins",
    category_jpn: "葉の縁"
  },
  {
    id: "53",
    character: "Triplinerved leaves",
    character_jpn: "三行脈",
    category: "Leaf Venation",
    category_jpn: "葉脈"
  },
  {
    id: "54",
    character: "Intramarginal vein",
    character_jpn: "葉縁脈（葉縁に沿う葉脈）",
    category: "Leaf Venation",
    category_jpn: "葉脈"
  },
  {
    id: "55",
    character: "Double marginal vein loops or intramarginal veins",
    character_jpn: "葉縁脈は二重",
    category: "Leaf Venation",
    category_jpn: "葉脈"
  },
  {
    id: "56",
    character: "Parallel secondary venation",
    character_jpn: "側脈は平行",
    category: "Leaf Venation",
    category_jpn: "葉脈"
  },
  {
    id: "57",
    character: "Scalariform tertiary venation",
    character_jpn: "三次脈は梯子状",
    category: "Leaf Venation",
    category_jpn: "葉脈"
  },
  {
    id: "58",
    character: "Leaves drying black (nigrescence)",
    character_jpn: "葉は乾くと黒",
    category: "Leaf Coloration",
    category_jpn: "葉の色"
  },
  {
    id: "59",
    character: "Leaves drying yellow",
    character_jpn: "葉は乾くと黄色",
    category: "Leaf Coloration",
    category_jpn: "葉の色"
  },
  {
    id: "60",
    character: "Young leaves red",
    character_jpn: "若葉は赤い",
    category: "Leaf Coloration",
    category_jpn: "葉の色"
  },
  {
    id: "61",
    character: "Leaves withering red",
    character_jpn: "葉は枯れると赤くなる",
    category: "Leaf Coloration",
    category_jpn: "葉の色"
  },
  {
    id: "62",
    character: "Stellate hairs",
    character_jpn: "星状毛がある",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "63",
    character: "Scales",
    character_jpn: "鱗状毛がある",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "64",
    character: "Dendroid hairs",
    character_jpn: "樹状毛がある",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "65",
    character: "T-shaped hairs",
    character_jpn: "T字型の毛",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "66",
    character: "Stinging or irritant hairs",
    character_jpn: "刺毛または刺激性の毛",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "67",
    character: "Glaucous leaves",
    character_jpn: "葉はロウ物質で白っぽい",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "68",
    character: "Bullate leaves",
    character_jpn: "葉は水疱状・波形に隆起する",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "69",
    character: "Leaf domatia",
    character_jpn: "葉にダニ室（domatia）がある",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "70",
    character: "Laminar (l) or petiolar (p) glands",
    character_jpn: "葉面・葉柄の蜜腺",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "71",
    character: "Dots or dashes in leaf tissue",
    character_jpn: "葉を透かすと明・暗の点または短線がある",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "72",
    character: "Cystoliths",
    character_jpn: "葉内に鍾乳体（非定型の結晶）がある",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "73",
    character: "Puncticulate leaf surface",
    character_jpn: "葉面に微点状の穴がある",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "74",
    character: "Pustulate/papillose leaf surface",
    character_jpn: "葉面に小突起状/乳頭状がある",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "75",
    character: "Rough leaf surface",
    character_jpn: "葉面がざらざらしている",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "76",
    character: "Leaves tearing with silky-thread connections",
    character_jpn: "葉を裂くと絹糸状の繊維がある",
    category: "Indument, Leaf Surface Characteristics and Texture",
    category_jpn: "被毛、葉の表面の特徴と質感"
  },
  {
    id: "77",
    character: "Monocarpic plants (death after flowering)",
    character_jpn: "単回結実植物（開花後に枯死）",
    category: "Life-cycle and Flowering Habits",
    category_jpn: "生活環と開花習性"
  },
  {
    id: "78",
    character: "Plants flowering in a leafless state",
    character_jpn: "葉がない状態で開花する",
    category: "Life-cycle and Flowering Habits",
    category_jpn: "生活環と開花習性"
  },
  {
    id: "79",
    character: "Cauliflorous flowering habit (flowers on stems and trunks)",
    character_jpn: "幹生花（幹や枝に花が咲く）をつける",
    category: "Life-cycle and Flowering Habits",
    category_jpn: "生活環と開花習性"
  },
  {
    id: "80",
    character: "Flagelliflory",
    character_jpn: "花序は下垂する",
    category: "Life-cycle and Flowering Habits",
    category_jpn: "生活環と開花習性"
  },
  {
    id: "81",
    character: "Geocarpy",
    character_jpn: "地生果",
    category: "Life-cycle and Flowering Habits",
    category_jpn: "生活環と開花習性"
  },
  {
    id: "82",
    character: "Fasciculate inflorescences and distichous alternate leaves",
    character_jpn: "束生花序で二列互生葉",
    category: "Inflorescence Form and Position",
    category_jpn: "花序の形態と位置"
  },
  {
    id: "83",
    character: "Leaf-opposed' inflorescences",
    character_jpn: "花序は葉と対生する",
    category: "Inflorescence Form and Position",
    category_jpn: "花序の形態と位置"
  },
  {
    id: "84",
    character: "Supra-axillary inflorescences",
    character_jpn: "花序は葉腋から少し離れる",
    category: "Inflorescence Form and Position",
    category_jpn: "花序の形態と位置"
  },
  {
    id: "85",
    character: "Epiphyllous inflorescences",
    character_jpn: "葉上花序",
    category: "Inflorescence Form and Position",
    category_jpn: "花序の形態と位置"
  },
  {
    id: "86",
    character: "Compact inflorescences",
    character_jpn: "密生花序",
    category: "Inflorescence Form and Position",
    category_jpn: "花序の形態と位置"
  },
  {
    id: "87",
    character: "Condensed racemes",
    character_jpn: "散房花序",
    category: "Inflorescence Form and Position",
    category_jpn: "花序の形態と位置"
  },
  {
    id: "88",
    character: "Monomorphic (zygomorphic) flowers",
    character_jpn: "単形（左右相称）花",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "89",
    character: "Trimerous 'dicots' (groups among Magnoliids and Eudicots)",
    character_jpn: "三数性双子葉類（マグノリア類と真双子葉類のグループ）",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "90",
    character: "Accrescent calyx",
    character_jpn: "萼が肥大化する",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "91",
    character: "Corolla (petals) or perianths fimbriate or bifid",
    character_jpn: "花冠（花弁）または花被の縁に糸状突起または二裂する",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "92",
    character: "Corolla (petals) bearing appendages",
    character_jpn: "花冠（花弁）に付属物がある",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "93",
    character: "Yellow perianth or corolla (petals)",
    character_jpn: "花被または花冠（花弁）が黄色",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "94",
    character: "Stamens opposite petals in the flower",
    character_jpn: "雄しべは花弁に対生する",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "95",
    character: "Numerous stamens",
    character_jpn: "雄しべは多数（20~）ある",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "96",
    character: "Staminal tube present",
    character_jpn: "雄しべ筒がある",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "97",
    character: "Stamens bearing appendages or hair tufts",
    character_jpn: "雄しべに付属物または毛束がある",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "98",
    character: "Basifixed anthers with apical pores or short slits",
    character_jpn: "葯は底着し、先端に孔または短い裂け目がある",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "99",
    character: "Anther pores opening by valves",
    character_jpn: "葯は弁状に裂開する",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "100",
    character: "Broad flat stigma",
    character_jpn: "柱頭は広く平ら",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "101",
    character: "Long forked style",
    character_jpn: "花柱は長く二又",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "102",
    character: "Double forked style",
    character_jpn: "花柱は二回二叉分岐する",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "103",
    character: "Excentric style",
    character_jpn: "花柱は子房に頂生する",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "104",
    character: "Inferior ovary",
    character_jpn: "子房下位",
    category: "Flower Characters",
    category_jpn: "花の特徴"
  },
  {
    id: "105",
    character: "White fruits",
    character_jpn: "果実は白色",
    category: "Fruit Characters",
    category_jpn: "果実の特徴"
  },
  {
    id: "106",
    character: "Blue fruits and seeds",
    character_jpn: "果実・種子は青色",
    category: "Fruit Characters",
    category_jpn: "果実の特徴"
  },
  {
    id: "107",
    character: "Woody fruits with seeds scattered in the placenta",
    character_jpn: "果実は木質で胎座に種子が散らばる",
    category: "Fruit Characters",
    category_jpn: "果実の特徴"
  },
  {
    id: "108",
    character: "Muricate (spiny), tuberculate or rugose fruits",
    character_jpn: "果実はとげ状、いぼ状、またはしわがある",
    category: "Fruit Characters",
    category_jpn: "果実の特徴"
  },
  {
    id: "109",
    character: "Winged fruits",
    character_jpn: "果実に翼がある",
    category: "Fruit Characters",
    category_jpn: "果実の特徴"
  },
  {
    id: "110",
    character: "Ridged fruits or fruit portions (follicles)",
    character_jpn: "果実または一部に稜がある（袋果）",
    category: "Fruit Characters",
    category_jpn: "果実の特徴"
  },
  {
    id: "111",
    character: "Globular/ellipsoid capsules splitting into 5(-6) parts",
    character_jpn: "蒴果で球状/楕円形に5（-6）裂する",
    category: "Fruit Characters",
    category_jpn: "果実の特徴"
  },
  {
    id: "112",
    character: "Trilocular capsules",
    character_jpn: "3室の蒴果",
    category: "Fruit Characters",
    category_jpn: "果実の特徴"
  },
  {
    id: "113",
    character: "Moniliform fruits",
    character_jpn: "果実は数珠状",
    category: "Fruit Characters",
    category_jpn: "果実の特徴"
  },
  {
    id: "114",
    character: "Compound fruits",
    character_jpn: "複合果",
    category: "Fruit Characters",
    category_jpn: "果実の特徴"
  },
  {
    id: "115",
    character: "Apocarpous fruits",
    character_jpn: "離生心皮果（1つの花に複数果実：集合袋果）",
    category: "Fruit Characters",
    category_jpn: "果実の特徴"
  },
  {
    id: "116",
    character: "Winged seeds",
    character_jpn: "種子に翼がある",
    category: "Seed Characters",
    category_jpn: "種子の特徴"
  },
  {
    id: "117",
    character: "Comose Seeds",
    character_jpn: "種子に冠毛がある",
    category: "Seed Characters",
    category_jpn: "種子の特徴"
  },
  {
    id: "118",
    character: "Arillate seeds",
    character_jpn: "種子に仮種皮がある",
    category: "Seed Characters",
    category_jpn: "種子の特徴"
  },
  {
    id: "119",
    character: "Ruminate endosperm",
    character_jpn: "反芻胚乳",
    category: "Seed Characters",
    category_jpn: "種子の特徴"
  }
];
const data227 = [
  {
    scientific_name: "Abelmoschus",
    family: "Malvaceae",
    genus: "Abelmoschus",
    species: "",
    characters: [
      "93"
    ]
  },
  {
    scientific_name: "Abroma",
    family: "Malvaceae",
    genus: "Abroma",
    species: "",
    characters: [
      "66",
      "83"
    ]
  },
  {
    scientific_name: "Abrus",
    family: "Leguminosae",
    genus: "Abrus",
    species: "",
    characters: [
      "96"
    ]
  },
  {
    scientific_name: "Acacia",
    family: "Leguminosae",
    genus: "Acacia",
    species: "",
    characters: [
      "4",
      "7",
      "10",
      "15",
      "50",
      "70",
      "86",
      "113"
    ]
  },
  {
    scientific_name: "Acacia pennata",
    family: "Leguminosae",
    genus: "Acacia",
    species: "Acacia pennata",
    characters: [
      "4"
    ]
  },
  {
    scientific_name: "Acaena",
    family: "Rosaceae",
    genus: "Acaena",
    species: "",
    characters: [
      "34",
      "108"
    ]
  },
  {
    scientific_name: "Acalypha",
    family: "Euphorbiaceae",
    genus: "Acalypha",
    species: "",
    characters: [
      "12",
      "112"
    ]
  },
  {
    scientific_name: "Acalypha brachystachya",
    family: "Euphorbiaceae",
    genus: "Acalypha",
    species: "Acalypha brachystachya",
    characters: [
      "12"
    ]
  },
  {
    scientific_name: "Acalypha lanceolata",
    family: "Euphorbiaceae",
    genus: "Acalypha",
    species: "Acalypha lanceolata",
    characters: [
      "12"
    ]
  },
  {
    scientific_name: "Acanthaceae",
    family: "Acanthaceae",
    genus: "",
    species: "",
    characters: [
      "5",
      "6",
      "7",
      "12",
      "13",
      "35",
      "45",
      "46",
      "48",
      "52",
      "53",
      "72",
      "73",
      "77",
      "80",
      "88",
      "97"
    ]
  },
  {
    scientific_name: "Acrotrema costatum",
    family: "Dilleniaceae",
    genus: "Acrotrema",
    species: "Acrotrema costatum",
    characters: [
      "68"
    ]
  },
  {
    scientific_name: "Acsmithia",
    family: "Cunoniaceae",
    genus: "Acsmithia",
    species: "",
    characters: [
      "45",
      "68",
      "69",
      "70",
      "115",
      "116"
    ]
  },
  {
    scientific_name: "Actephila",
    family: "Phyllanthaceae/ Euphorbiaceae p.p.",
    genus: "Actephila",
    species: "",
    characters: [
      "59",
      "82",
      "90",
      "108",
      "112"
    ]
  },
  {
    scientific_name: "Actinidia",
    family: "Actinidiaceae",
    genus: "Actinidia",
    species: "",
    characters: [
      "5",
      "62",
      "72",
      "95",
      "98"
    ]
  },
  {
    scientific_name: "Actinidiaceae",
    family: "Actinidiaceae",
    genus: "",
    species: "",
    characters: [
      "2",
      "5",
      "7",
      "10",
      "18",
      "43",
      "47",
      "52",
      "62",
      "63",
      "72",
      "79",
      "81",
      "86",
      "91",
      "95",
      "98",
      "105"
    ]
  },
  {
    scientific_name: "Acanthophora(Aralia)",
    family: "Araliaceae",
    genus: "Acanthophora(Aralia)",
    species: "",
    characters: [
      "7"
    ]
  },
  {
    scientific_name: "Actinodium",
    family: "Myrtaceae",
    genus: "Actinodium",
    species: "",
    characters: [
      "86"
    ]
  },
  {
    scientific_name: "Acanthospermum",
    family: "Asteraceae",
    genus: "Acanthospermum",
    species: "",
    characters: [
      "108"
    ]
  },
  {
    scientific_name: "Acanthus",
    family: "Acanthaceae",
    genus: "Acanthus",
    species: "",
    characters: [
      "7",
      "52",
      "73",
      "88"
    ]
  },
  {
    scientific_name: "Acanthus ebracteatus",
    family: "Acanthaceae",
    genus: "Acanthus",
    species: "Acanthus ebracteatus",
    characters: [
      "73"
    ]
  },
  {
    scientific_name: "Acanthus ilicifolius",
    family: "Acanthaceae",
    genus: "Acanthus",
    species: "Acanthus ilicifolius",
    characters: [
      "73"
    ]
  },
  {
    scientific_name: "Acer",
    family: "Sapindaceae",
    genus: "Acer",
    species: "",
    characters: [
      "35",
      "60",
      "61",
      "67",
      "69",
      "109"
    ]
  },
  {
    scientific_name: "Aceratium",
    family: "Elaeocarpaceae",
    genus: "Aceratium",
    species: "",
    characters: [
      "43",
      "91",
      "98"
    ]
  },
  {
    scientific_name: "Achariaceae",
    family: "Achariaceae(Flacourtiaceae p.p.)",
    genus: "",
    species: "",
    characters: [
      "10",
      "18",
      "25",
      "35",
      "43",
      "48",
      "53",
      "54",
      "62",
      "65",
      "70",
      "71",
      "74",
      "79",
      "82",
      "84",
      "87",
      "92",
      "94",
      "95",
      "100",
      "105",
      "107",
      "108",
      "112"
    ]
  },
  {
    scientific_name: "Acmena(Syzygium)",
    family: "Myrtaceae",
    genus: "Acmena(Syzygium)",
    species: "",
    characters: [
      "105"
    ]
  },
  {
    scientific_name: "Acranthera",
    family: "Rubiaceae",
    genus: "Acranthera",
    species: "",
    characters: [
      "31",
      "34",
      "58",
      "68",
      "93"
    ]
  },
  {
    scientific_name: "Acrocarpus",
    family: "Leguminosae",
    genus: "Acrocarpus",
    species: "",
    characters: [
      "50"
    ]
  },
  {
    scientific_name: "Acrocephalus",
    family: "Lamiaceae",
    genus: "Acrocephalus",
    species: "",
    characters: [
      "86"
    ]
  },
  {
    scientific_name: "Acronychia",
    family: "Rutaceae",
    genus: "Acronychia",
    species: "",
    characters: [
      "35",
      "44",
      "49",
      "105"
    ]
  },
  {
    scientific_name: "Acrotrema",
    family: "Dilleniaceae",
    genus: "Acrotrema",
    species: "",
    characters: [
      "39",
      "68",
      "93",
      "95"
    ]
  },
  {
    scientific_name: "Actinodaphne",
    family: "Lauraceae",
    genus: "Actinodaphne",
    species: "",
    characters: [
      "18",
      "45",
      "86",
      "99"
    ]
  },
  {
    scientific_name: "Actinodaphne macrophylla",
    family: "Lauraceae",
    genus: "Actinodaphne",
    species: "Actinodaphne macrophylla",
    characters: [
      "19"
    ]
  },
  {
    scientific_name: "Actinodaphne maingayi",
    family: "Lauraceae",
    genus: "Actinodaphne",
    species: "Actinodaphne maingayi",
    characters: [
      "45"
    ]
  },
  {
    scientific_name: "Actinolindera",
    family: "Lauraceae",
    genus: "Actinolindera",
    species: "",
    characters: [
      "99"
    ]
  },
  {
    scientific_name: "Actinorhytis",
    family: "Arecaceae",
    genus: "Actinorhytis",
    species: "",
    characters: [
      "79",
      "119"
    ]
  },
  {
    scientific_name: "Adansonia",
    family: "Malvaceae",
    genus: "Adansonia",
    species: "",
    characters: [
      "49"
    ]
  },
  {
    scientific_name: "Adenanthera",
    family: "Leguminosae",
    genus: "Adenanthera",
    species: "",
    characters: [
      "50",
      "67"
    ]
  },
  {
    scientific_name: "Adenia",
    family: "Passifloraceae",
    genus: "Adenia",
    species: "",
    characters: [
      "4",
      "53",
      "70",
      "92.118"
    ]
  },
  {
    scientific_name: "Adenium",
    family: "Apocynaceae",
    genus: "Adenium",
    species: "",
    characters: [
      "3",
      "42"
    ]
  },
  {
    scientific_name: "Adenosma",
    family: "Plantaginaceae",
    genus: "Adenosma",
    species: "",
    characters: [
      "86"
    ]
  },
  {
    scientific_name: "Adina",
    family: "Rubiaceae",
    genus: "Adina",
    species: "",
    characters: [
      "86",
      "114"
    ]
  },
  {
    scientific_name: "Adinandra",
    family: "Pentaphylacaceae",
    genus: "Adinandra",
    species: "",
    characters: [
      "13",
      "82"
    ]
  },
  {
    scientific_name: "Adinandra dumosa",
    family: "Pentaphylacaceae",
    genus: "Adinandra",
    species: "Adinandra dumosa",
    characters: [
      "82"
    ]
  },
  {
    scientific_name: "Adinauclea",
    family: "Rubiaceae",
    genus: "Adinauclea",
    species: "",
    characters: [
      "86"
    ]
  },
  {
    scientific_name: "Adonidia",
    family: "Arecaceae",
    genus: "Adonidia",
    species: "",
    characters: [
      "2",
      "79",
      "119"
    ]
  },
  {
    scientific_name: "Adoxaceae",
    family: "Adoxaceae",
    genus: "",
    species: "",
    characters: [
      "23",
      "44",
      "52",
      "53",
      "62",
      "69",
      "70.73",
      "104",
      "119"
    ]
  },
  {
    scientific_name: "Adriana",
    family: "Euphorbiaceae",
    genus: "Adriana",
    species: "",
    characters: [
      "43"
    ]
  },
  {
    scientific_name: "Aegialitis",
    family: "Plumbaginaceae",
    genus: "Aegialitis",
    species: "",
    characters: [
      "30",
      "70"
    ]
  }
];
function usePlantService() {
  const plants = ref([]);
  const characterSet = ref({});
  const isDataLoaded = ref(false);
  const loadPlantData = () => {
    if (isDataLoaded.value) return;
    characters.forEach((record) => {
      const character = {
        id: record.id,
        character: record.character,
        characterJpn: record.character_jpn,
        category: record.category,
        categoryJpn: record.category_jpn
      };
      characterSet.value[character.id] = character;
    });
    data227.forEach((record) => {
      var _a;
      if (record.scientific_name && ((_a = record.characters) == null ? void 0 : _a.length)) {
        const plant = {
          scientificName: record.scientific_name,
          japaneseName: (record == null ? void 0 : record.japanese_name) || null,
          family: record.family,
          genus: record.genus.trim() || null,
          species: record.species.trim() || null,
          characters: record.characters
        };
        plants.value.push(plant);
      }
    });
    isDataLoaded.value = true;
  };
  const searchByName = (name) => {
    return plants.value.filter((plant) => plant.scientificName.includes(name));
  };
  const searchByCharacters = (characters2) => {
    return plants.value.filter((plant) => characters2.every((f) => plant.characters.includes(f)));
  };
  return {
    // plants: readonly(plants),
    // // families: readonly(families),
    // characterSet: readonly(characterSet),
    plants,
    characterSet,
    loadPlantData,
    searchByName,
    searchByCharacters
  };
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const service = usePlantService();
    service.loadPlantData();
    const characterSet = service.characterSet;
    const plants = service.plants;
    provide("plants", plants);
    provide("characterSet", characterSet);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtPage = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "app" }, _attrs))} data-v-5342352e><header class="app-header" data-v-5342352e><h1 class="app-title" data-v-5342352e>マレシア植物区の同定アプリ</h1><nav class="app-nav" data-v-5342352e>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`特徴から検索`);
          } else {
            return [
              createTextVNode("特徴から検索")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/search" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`名前から検索`);
          } else {
            return [
              createTextVNode("名前から検索")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></header><main data-v-5342352e>`);
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</main><footer class="app-footer" data-v-5342352e><p data-v-5342352e>© 2024 植物同定アプリ. All rights reserved.</p></footer></div>`);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-5342352e"]]);
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-B88aW7Zf.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-28Q5K_1e.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error = nuxt.payload.error || createError(error);
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, __nuxt_component_0 as a, entry$1 as default, injectHead as i, resolveUnrefHeadInput as r, usePlantService as u };
//# sourceMappingURL=server.mjs.map
