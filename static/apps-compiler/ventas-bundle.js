/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "6131918bc092943c1576"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 1;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/apps-compiler/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(30)(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ({

/***/ 30:
/***/ (function(module, exports) {

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar total_con_descuento = 0.0;\nvar resultado = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n/* --- hacer invisible los campos que solo son para descuento ---- */\ndocument.getElementById('id_div_descuento').style.display = 'none';\n/* ---- hacer invisible los campos que solo son para los socios ---*/\ndocument.getElementById('id_div_puntos_socios').style.display = 'none';\ndocument.getElementById('id_form_canjear').style.display = 'none';\ndocument.getElementById('id_form_efectivo').style.display = 'none';\n\n/* ----------- habilitar campos para canje de puntos en socio ---*/\nhabilitar_campos_canje = function (socio) {\n    $('#id_puntos_socios').val(socio.puntos);\n    document.getElementById('id_div_puntos_socios').style.display = 'block';\n};\n/* --------------------------------------------------------------*/\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_debito, precio_compra, stock, proveedor, no_suma_caja) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'descuento':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_credito;\n                break;\n            case 'debito':\n                precio_enviar = precio_debito;\n                break;\n        };\n        if (no_suma_caja) {\n            if (!$('#id_no_sumar').is(':checked')) {\n                swal({\n                    title: \"El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas\",\n                    text: \"Desea que el sistema tilde el check por usted ? \",\n                    icon: \"info\",\n                    buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],\n                    dangerMode: false\n                }).then(willDelete => {\n                    if (willDelete) {\n                        $('#id_no_sumar').prop(\"checked\", true);\n                    }\n                });\n            }\n        }\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    total_con_descuento = resultado;\n    var no_sumar = false;\n    var canje_socios = false;\n    var canje_credito = false;\n\n    $('#id_button_guardar_compra').prop(\"disabled\", true);\n    if ($('#id_no_sumar').is(':checked')) {\n        no_sumar = true;\n    }\n    if ($('#id_canje_socios').is(':checked')) {\n        canje_socios = true;\n    }\n    if ($('#id_canje_credito').is(':checked')) {\n        canje_credito = true;\n    }\n\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            id_socio: $('#id_socio').val(),\n            porcentaje_descuento: $('#id_monto_descuento').val(),\n            total_con_descuento: total_con_descuento,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            no_sumar: no_sumar,\n            puntos_socios: $('#id_puntos_socios').val(),\n            canje_socios: canje_socios,\n            creditos_socios: $('#id_credito_socio').val(),\n            canje_credito: canje_credito,\n            credito_porcentaje: credito_porcentaje,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                if (Object.keys(data).length == 0) {\n                    swal({\n                        title: \"El árticulo no fue encontrado o el stock es 0. Verifique en la lista de árticulos los datos correspondientes. \",\n                        text: \"Desea realizar el pedido ? \",\n                        icon: \"warning\",\n                        buttons: true,\n                        dangerMode: true\n                    });\n                    /*.then((willDelete) => {\n                      if (willDelete) {\n                        swal(\"Poof! Your imaginary file has been deleted!\", {\n                          icon: \"success\",\n                        });\n                      } else {\n                        swal(\"El pedido ha sido enviado\");\n                      }\n                    });*/\n                } else {\n\n                    var precio_enviar = '';\n                    switch (forma_pago) {\n                        case 'efectivo':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'descuento':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'credito':\n                            precio_enviar = data.precio_credito;\n                            break;\n                        case 'debito':\n                            precio_enviar = data.precio_debito;\n                            break;\n                    };\n                    contador_tabla += 1;\n                    calcular_total('1', data.id, precio_enviar);\n                    if (data.no_suma_caja) {\n                        if (!$('#id_no_sumar').is(':checked')) {\n                            swal({\n                                title: \"El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas\",\n                                text: \"Desea que el sistema tilde el check por usted ? \",\n                                icon: \"info\",\n                                buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],\n                                dangerMode: false\n                            }).then(willDelete => {\n                                if (willDelete) {\n                                    $('#id_no_sumar').prop(\"checked\", true);\n                                }\n                            });\n                        }\n                    }\n                    $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.nombre + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n                }\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n    console.log(precio_venta);\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#buscar_socio').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    $('#id_no_sumar').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n    };\n    if (forma_pago == 'descuento') {\n        // si es descuento habilito sus respectivos pagos y descuento\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        //document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n\n    // hago invisibles las imagenes de tipos de pagos\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n    if (forma_pago != 'descuento') {\n        $('#id_descuento').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/*------ cuando selecciona el canje se agrega las cajas de texto ----*/\n$(\"#id_canje_socios\").change(function () {\n    if (this.checked) {\n        $('#id_canje_credito').prop(\"checked\", false);\n        document.getElementById('id_form_canjear').style.display = 'block';\n        document.getElementById('id_form_efectivo').style.display = 'none';\n    } else {\n        document.getElementById('id_form_canjear').style.display = 'none';\n    }\n});\n$(\"#id_canje_credito\").change(function () {\n    if (this.checked) {\n        $('#id_canje_socios').prop(\"checked\", false);\n        document.getElementById('id_form_efectivo').style.display = 'block';\n        document.getElementById('id_form_canjear').style.display = 'none';\n    } else {\n        document.getElementById('id_form_efectivo').style.display = 'none';\n    }\n});\n/*-------------------------------------------------------------------*/\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_monto_descuento').click(function () {\n    if ($('#id_monto_descuento').val() == '0') {\n        $('#id_monto_descuento').val(' ');\n    }\n});\n// descuento para socios\n$('#id_descuento_socios').click(function () {\n    if ($('#id_descuento_socios').val() == '0') {\n        $('#id_descuento_socios').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_monto_descuento').focusout(function () {\n    if ($('#id_monto_descuento').val() == '') {\n        $('#id_monto_descuento').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_descuento_socios').focusout(function () {\n    if ($('#id_descuento_socios').val() == '') {\n        $('#id_descuento_socios').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_credito_socio').focusout(function () {\n    if ($('#id_credito_socio').val() == '') {\n        $('#id_credito_socio').val('0');\n    }\n    calcular_vuelto();\n});\n\n$('#id_descuento_socios').keypress(function (e) {\n    if (e.keyCode == 13) {\n        if ($('#id_descuento_socios').val() == '') {\n            $('#id_descuento_socios').val('0');\n        }\n        calcular_vuelto();\n    }\n});\n\n$('#id_credito_socio').keypress(function (e) {\n    if (e.keyCode == 13) {\n        if ($('#id_credito_socio').val() == '') {\n            $('#id_credito_socio').val('0');\n        }\n        calcular_vuelto();\n    }\n});\n\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var descuento = $('#id_monto_descuento').val();\n    var descuento_socio = $('#id_descuento_socios').val();\n    var credito_socio = $('#id_credito_socio').val();\n\n    var vuelto = parseFloat(pago) - parseFloat(total);\n    console.log(descuento_socio);\n    if ($('#id_canje_socios').is(':checked')) {\n        if (descuento_socio != '0') {\n            // descuento para socios\n            descuento_total = parseFloat(total) * parseFloat(descuento_socio) / 100;\n            resultado = 0.0;\n            resultado = parseFloat(total) - parseFloat(descuento_total);\n            var vuelto = parseFloat(pago) - parseFloat(resultado);\n            var representar2 = resultado.toFixed(2);\n            $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n        }\n    }\n    if ($('#id_canje_credito').is(':checked')) {\n        if (credito_socio != '0') {\n            // credito para socios\n            resultado = 0.0;\n            resultado = parseFloat(total) - parseFloat(credito_socio);\n            var vuelto = parseFloat(pago) - parseFloat(resultado);\n            var representar2 = resultado.toFixed(2);\n            $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n        }\n    }\n    console.log(descuento);\n    if (descuento != '0') {\n        // descuento extraordinario\n        descuento_total = parseFloat(total) * parseFloat(descuento) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    }\n    console.log(vuelto);\n    console.log(vuelto.toFixed(2));\n    var representar = vuelto.toFixed(2);\n\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_monto_descuento').focusout(function () {\n    calcular_vuelto();\n});\n$('#id_monto_descuento').keypress(function () {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsInRvdGFsX2Nvbl9kZXNjdWVudG8iLCJyZXN1bHRhZG8iLCJjb250YWRvcl90YWJsYSIsImNyZWRpdG9fcG9yY2VudGFqZSIsImFydGljdWxvc192ZW5kaWRvcyIsImZvcm1hX3BhZ28iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5IiwiaGFiaWxpdGFyX2NhbXBvc19jYW5qZSIsInNvY2lvIiwiJCIsInZhbCIsInB1bnRvcyIsInNlbGVjY2lvbl9hcnRpY3VsbyIsImlkIiwiZGVzY3JpcGNpb24iLCJtYXJjYSIsInJ1YnJvIiwicHJlY2lvX3ZlbnRhIiwicHJlY2lvX2NyZWRpdG8iLCJwcmVjaW9fZGViaXRvIiwicHJlY2lvX2NvbXByYSIsInN0b2NrIiwicHJvdmVlZG9yIiwibm9fc3VtYV9jYWphIiwiY2FudGlkYWQiLCJwcm9tcHQiLCJwcmVjaW9fZW52aWFyIiwiaXMiLCJzd2FsIiwidGl0bGUiLCJ0ZXh0IiwiaWNvbiIsImJ1dHRvbnMiLCJkYW5nZXJNb2RlIiwidGhlbiIsIndpbGxEZWxldGUiLCJwcm9wIiwiY2FsY3VsYXJfdG90YWwiLCJhZnRlciIsInRvU3RyaW5nIiwiZ3VhcmRhcl9jb21wcmEiLCJub19zdW1hciIsImNhbmplX3NvY2lvcyIsImNhbmplX2NyZWRpdG8iLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGEiLCJ2ZW50YXMiLCJKU09OIiwic3RyaW5naWZ5IiwiZmVjaGEiLCJpZF9zb2NpbyIsInBvcmNlbnRhamVfZGVzY3VlbnRvIiwicHJlY2lvX3ZlbnRhX3RvdGFsIiwicHVudG9zX3NvY2lvcyIsImNyZWRpdG9zX3NvY2lvcyIsImNzcmZtaWRkbGV3YXJldG9rZW4iLCJzdWNjZXNzIiwiUE5vdGlmeSIsImh0bWwiLCJlbXB0eSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImlkX3ZlbnRhIiwia2V5cHJlc3MiLCJlIiwid2hpY2giLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwibm9tYnJlIiwib2JqIiwicHVzaCIsImNvbnNvbGUiLCJsb2ciLCJwYXJzZUZsb2F0IiwicmVwbGFjZSIsInJlcHJlc2VudGFyIiwidG9GaXhlZCIsImNhbGN1bGFyX3RpcG9fcGFnbyIsImZvcm1hX3BhZ29fcGFyYW1ldHJvIiwiaGlkZSIsImVsaW1pbmFyX2FydGljdWxvIiwic3BsaWNlIiwicmVtb3ZlIiwiYWdyZWdhcl9jYW50aWRhZCIsImNvbnRhZG9yIiwicHJlY2lvIiwiY2FudGlkYWRfdGFibGEiLCJyb3dzIiwiY2VsbHMiLCJpdGVtIiwiaW5uZXJIVE1MIiwicGFyc2VJbnQiLCJjaGFuZ2UiLCJjaGVja2VkIiwiY2xpY2siLCJmb2N1c291dCIsImNhbGN1bGFyX3Z1ZWx0byIsImtleUNvZGUiLCJwYWdvIiwiZGVzY3VlbnRvIiwiZGVzY3VlbnRvX3NvY2lvIiwiY3JlZGl0b19zb2NpbyIsInZ1ZWx0byIsImRlc2N1ZW50b190b3RhbCIsInJlcHJlc2VudGFyMiIsImNhbGN1bGFyX2F1bWVudG8iLCJwb3JjZW50YWplIiwiYXVtZW50byIsInRvdGFsX2F1bWVudGFkbyJdLCJtYXBwaW5ncyI6IkFBQVk7QUFDQSxJQUFJQSxRQUFRLEdBQVo7QUFDQSxJQUFJQyxzQkFBc0IsR0FBMUI7QUFDQSxJQUFJQyxZQUFZLEdBQWhCO0FBQ0EsSUFBSUMsaUJBQWlCLENBQXJCO0FBQ0EsSUFBSUMscUJBQXFCLENBQXpCO0FBQ0EsSUFBSUMscUJBQXFCLEVBQXpCO0FBQ0EsSUFBSUMsYUFBYSxFQUFqQjtBQUNBO0FBQ0FDLFNBQVNDLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUNDLEtBQXZDLENBQTZDQyxPQUE3QyxHQUF1RCxNQUF2RDtBQUNBSCxTQUFTQyxjQUFULENBQXdCLGVBQXhCLEVBQXlDQyxLQUF6QyxDQUErQ0MsT0FBL0MsR0FBeUQsTUFBekQ7QUFDQTtBQUNBSCxTQUFTQyxj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QUFDSDtBQUNKLENBSkQ7QUFLUjtBQUNRRCxFQUFFLGdCQUFGLEVBQW9CMEYsUUFBcEIsQ0FBNkIsWUFBVztBQUNwQ1U7QUFDSCxDQUZEO0FBR0FwRyxFQUFFLHFCQUFGLEVBQXlCMEYsUUFBekIsQ0FBa0MsWUFBVztBQUN6Q0M7QUFDSCxDQUZEO0FBR0EzRixFQUFFLHFCQUFGLEVBQXlCeUQsUUFBekIsQ0FBa0MsWUFBVztBQUN6QyxRQUFJQyxFQUFFa0MsT0FBRixJQUFhLEVBQWpCLEVBQXFCO0FBQ2pCRDtBQUNIO0FBQ0osQ0FKRDtBQUtBM0YsRUFBRSxnQkFBRixFQUFvQnlELFFBQXBCLENBQTZCLFVBQVNDLENBQVQsRUFBWTtBQUNyQyxRQUFJQSxFQUFFa0MsT0FBRixJQUFhLEVBQWpCLEVBQXFCO0FBQ2pCUTtBQUNIO0FBQ0osQ0FKRDtBQUtBLElBQUlBLG1CQUFtQixZQUFVO0FBQzdCO0FBQ0EsUUFBSUMsYUFBYXJHLEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQWpCO0FBQ0FWLHlCQUFxQjhHLFVBQXJCO0FBQ0EsUUFBSUMsVUFBVWxDLFdBQVdqRixLQUFYLElBQW9CbUcsU0FBU2UsVUFBVCxDQUFwQixHQUF5QyxHQUF2RDtBQUNBLFFBQUlFLGtCQUFrQm5DLFdBQVdqRixLQUFYLElBQW9CaUYsV0FBV2tDLE9BQVgsQ0FBMUM7QUFDQSxRQUFJaEMsY0FBY2lDLGdCQUFnQmhDLE9BQWhCLENBQXdCLENBQXhCLENBQWxCO0FBQ0F2RSxNQUFFLG1CQUFGLEVBQXVCbUQsSUFBdkIsQ0FBNEIsT0FBT21CLFlBQVl4QyxRQUFaLEdBQXVCdUMsT0FBdkIsQ0FBK0IsR0FBL0IsRUFBb0MsR0FBcEMsQ0FBbkM7QUFDSCxDQVJEIiwiZmlsZSI6IjMwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiICAgICAgICAgICAgLyogLS0tLSB2YXJpYWJsZXMgZ2xvYmFsZXMgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gMC4wO1xuICAgICAgICAgICAgdmFyIHRvdGFsX2Nvbl9kZXNjdWVudG8gPSAwLjA7XG4gICAgICAgICAgICB2YXIgcmVzdWx0YWRvID0gMC4wO1xuICAgICAgICAgICAgdmFyIGNvbnRhZG9yX3RhYmxhID0gMDtcbiAgICAgICAgICAgIHZhciBjcmVkaXRvX3BvcmNlbnRhamUgPSAwO1xuICAgICAgICAgICAgdmFyIGFydGljdWxvc192ZW5kaWRvcyA9IFtdO1xuICAgICAgICAgICAgdmFyIGZvcm1hX3BhZ28gPSAnJztcbiAgICAgICAgICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBlZmVjdGl2byAtLS0tICovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgLyogLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGNyw6lkaXRvIC0tLS0gKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcG9yY2VudGFqZScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2NyZWRpdG9fdG90YWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgLyogLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGRlc2N1ZW50byAtLS0tICovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2Rlc2N1ZW50bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAvKiAtLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGxvcyBzb2Npb3MgLS0tKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcHVudG9zX3NvY2lvcycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9jYW5qZWFyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9mb3JtX2VmZWN0aXZvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICAgICAgLyogLS0tLS0tLS0tLS0gaGFiaWxpdGFyIGNhbXBvcyBwYXJhIGNhbmplIGRlIHB1bnRvcyBlbiBzb2NpbyAtLS0qL1xuICAgICAgICAgICAgaGFiaWxpdGFyX2NhbXBvc19jYW5qZSA9IGZ1bmN0aW9uKHNvY2lvKXtcbiAgICAgICAgICAgICAgICAkKCcjaWRfcHVudG9zX3NvY2lvcycpLnZhbChzb2Npby5wdW50b3MpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcHVudG9zX3NvY2lvcycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgICAgICAgICB2YXIgc2VsZWNjaW9uX2FydGljdWxvID0gZnVuY3Rpb24oaWQsIGRlc2NyaXBjaW9uLCBtYXJjYSwgcnVicm8sIHByZWNpb192ZW50YSwgcHJlY2lvX2NyZWRpdG8sIHByZWNpb19kZWJpdG8sIHByZWNpb19jb21wcmEsIHN0b2NrLCBwcm92ZWVkb3IsIG5vX3N1bWFfY2FqYSl7XG4gICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkID0gcHJvbXB0KFwiSW5ncmVzZSBsYSBjYW50aWRhZFwiLCBcIlwiKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcmVjaW9fZW52aWFyID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnRpZGFkICE9IG51bGwgJiYgY2FudGlkYWQgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYV9wYWdvKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VmZWN0aXZvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGVzY3VlbnRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3JlZGl0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb19jcmVkaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX2RlYml0bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vX3N1bWFfY2FqYSl7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKCEoJCgnI2lkX25vX3N1bWFyJykuaXMoJzpjaGVja2VkJykpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVsIMOhcnRpY3VsbyBlc3RhIHRpbGRhZG8gcGFyYSBubyBzdW1hcnNlIGEgY2FqYS4gUGVybyBubyBzZSB0aWxkbyBlbiBlbCBmb3JtdWxhcmlvIGRlIHZlbnRhc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiRGVzZWEgcXVlIGVsIHNpc3RlbWEgdGlsZGUgZWwgY2hlY2sgcG9yIHVzdGVkID8gXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogXCJpbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogWydObywgcG9ycXVlIHF1aWVybyBzdW1hcmxvIGEgY2FqYScsICdTaSwgcG9ycXVlIG5vIGxvIHZveSBhIHN1bWFyIGEgY2FqYSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhbmdlck1vZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCh3aWxsRGVsZXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbGxEZWxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF9ub19zdW1hcicpLnByb3AoIFwiY2hlY2tlZFwiLCB0cnVlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdG90YWwoY2FudGlkYWQsIGlkLCBwcmVjaW9fZW52aWFyKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGFkb3JfdGFibGEgKz0xO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zIHRyOmxhc3QnKS5hZnRlcignPHRyIGlkPVwidHJfJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnXCI+PHRkPicgKyBjYW50aWRhZCArICc8L3RkPicgKyAnPHRkPicgKyBkZXNjcmlwY2lvbiArICc8L3RkPicgKyAnPHRkPiAkJyArIHByZWNpb19lbnZpYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8L3RkPicgKyAgJzx0ZD48YSBvbmNsaWNrPVwiZWxpbWluYXJfYXJ0aWN1bG8oJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBjYW50aWRhZCArICcsJyArIHByZWNpb19lbnZpYXIgKycpXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT4gPC9hPjwvdGQ+PC90cj4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgZ3VhcmRhcl9jb21wcmEgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRvdGFsX2Nvbl9kZXNjdWVudG8gPSByZXN1bHRhZG87XG4gICAgICAgICAgICAgICAgdmFyIG5vX3N1bWFyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIGNhbmplX3NvY2lvcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBjYW5qZV9jcmVkaXRvID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAkKCcjaWRfYnV0dG9uX2d1YXJkYXJfY29tcHJhJykucHJvcCggXCJkaXNhYmxlZFwiLCB0cnVlICk7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9ub19zdW1hcicpLmlzKCc6Y2hlY2tlZCcpKXtub19zdW1hciA9IHRydWU7fVxuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfY2FuamVfc29jaW9zJykuaXMoJzpjaGVja2VkJykpe2NhbmplX3NvY2lvcyA9IHRydWU7fVxuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfY2FuamVfY3JlZGl0bycpLmlzKCc6Y2hlY2tlZCcpKXtjYW5qZV9jcmVkaXRvID0gdHJ1ZTt9XG5cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdmVudGFzL2FqYXgvdmVudGFzL2FsdGEvJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZW50YXM6IEpTT04uc3RyaW5naWZ5KGFydGljdWxvc192ZW5kaWRvcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWNoYTogJCgnI2lkX2ZlY2hhJykudmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWRfc29jaW86ICQoJyNpZF9zb2NpbycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9yY2VudGFqZV9kZXNjdWVudG86ICQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsX2Nvbl9kZXNjdWVudG86IHRvdGFsX2Nvbl9kZXNjdWVudG8sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fdmVudGFfdG90YWw6IHRvdGFsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYV9wYWdvOiBmb3JtYV9wYWdvLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9fc3VtYXI6IG5vX3N1bWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVudG9zX3NvY2lvczogJCgnI2lkX3B1bnRvc19zb2Npb3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmplX3NvY2lvczogY2FuamVfc29jaW9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlZGl0b3Nfc29jaW9zOiAkKCcjaWRfY3JlZGl0b19zb2NpbycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuamVfY3JlZGl0bzogY2FuamVfY3JlZGl0byxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWRpdG9fcG9yY2VudGFqZTogY3JlZGl0b19wb3JjZW50YWplLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3NyZm1pZGRsZXdhcmV0b2tlbjogJChcImlucHV0W25hbWU9Y3NyZm1pZGRsZXdhcmV0b2tlbl1cIikudmFsKClcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2lzdGVtYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEuc3VjY2VzcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAwLjAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zJykuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvdmVudGFzL3RpY2tldC8nICsgZGF0YS5pZF92ZW50YVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgLyogLS0tLSBmdW5jaW9uIHBhcmEgZWwgbGVjdG9yIGRlIGNvZGlnbyBkZSBiYXJyYXMgLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLmtleXByZXNzKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKXtcblxuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3ZlbnRhcy9hamF4L2NvZGlnby9hcnRpY3Vsby8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2RpZ29fYXJ0aWN1bG8nOiAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzcmZtaWRkbGV3YXJldG9rZW46ICQoXCJpbnB1dFtuYW1lPWNzcmZtaWRkbGV3YXJldG9rZW5dXCIpLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRhdGEpLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbCDDoXJ0aWN1bG8gbm8gZnVlIGVuY29udHJhZG8gbyBlbCBzdG9jayBlcyAwLiBWZXJpZmlxdWUgZW4gbGEgbGlzdGEgZGUgw6FydGljdWxvcyBsb3MgZGF0b3MgY29ycmVzcG9uZGllbnRlcy4gXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkRlc2VhIHJlYWxpemFyIGVsIHBlZGlkbyA/IFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qLnRoZW4oKHdpbGxEZWxldGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aWxsRGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoXCJQb29mISBZb3VyIGltYWdpbmFyeSBmaWxlIGhhcyBiZWVuIGRlbGV0ZWQhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2FsKFwiRWwgcGVkaWRvIGhhIHNpZG8gZW52aWFkb1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmVjaW9fZW52aWFyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZm9ybWFfcGFnbyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdlZmVjdGl2byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGVzY3VlbnRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjcmVkaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fY3JlZGl0bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RlYml0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX2RlYml0bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFkb3JfdGFibGEgKz0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbCgnMScsIGRhdGEuaWQsIHByZWNpb19lbnZpYXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5ub19zdW1hX2NhamEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKCQoJyNpZF9ub19zdW1hcicpLmlzKCc6Y2hlY2tlZCcpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbCDDoXJ0aWN1bG8gZXN0YSB0aWxkYWRvIHBhcmEgbm8gc3VtYXJzZSBhIGNhamEuIFBlcm8gbm8gc2UgdGlsZG8gZW4gZWwgZm9ybXVsYXJpbyBkZSB2ZW50YXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkRlc2VhIHF1ZSBlbCBzaXN0ZW1hIHRpbGRlIGVsIGNoZWNrIHBvciB1c3RlZCA/IFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwiaW5mb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFsnTm8sIHBvcnF1ZSBxdWllcm8gc3VtYXJsbyBhIGNhamEnLCAnU2ksIHBvcnF1ZSBubyBsbyB2b3kgYSBzdW1hciBhIGNhamEnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYW5nZXJNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigod2lsbERlbGV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aWxsRGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbm9fc3VtYXInKS5wcm9wKCBcImNoZWNrZWRcIiwgdHJ1ZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MgdHI6bGFzdCcpLmFmdGVyKCc8dHIgaWQ9XCJ0cl8nICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICdcIj48dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jYW50aWRhZCArICc8L3RkPicgKyAnPHRkPicgKyBkYXRhLm5vbWJyZSArICc8L3RkPicgKyAnPHRkPiAkJyArIHByZWNpb19lbnZpYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgJzx0ZD48YSBvbmNsaWNrPVwiYWdyZWdhcl9jYW50aWRhZCgnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuaWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICsgJ2NsYXNzPVwiYnRuIGJ0bi1pbmZvIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT4gPC9hPjxhIG9uY2xpY2s9XCJlbGltaW5hcl9hcnRpY3VsbygnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuY2FudGlkYWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+IDwvYT48L3RkPjwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLS0gZnVuY2lvbiBwYXJhIGVsIGxlY3RvciBkZSBjb2RpZ28gZGUgYmFycmFzIC0tLSAqL1xuXG4gICAgLyogLS0tLS0tLS0tLSBFc3RhIGZ1bmNpb24gY2FsY3VsYSBlbCB0b3RhbCB5IGxhIGNvbG9jYVxuICAgICoqKiAtLS0tLS0tLS0tIGVuIGxhIHBhcnRlIGluZmVyaW9yIGRlbCBmb3JtdWxhcmlvIGRlIHZlbnRhcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdG90YWwgPSBmdW5jdGlvbihjYW50aWRhZCwgaWQsIHByZWNpb192ZW50YSl7XG4gICAgLyogLS0tLSBBcm1hciB1biBhcnJheSBjb24gbG9zIGFydGljdWxvcyB2ZW5kaWRvcyAtLS0tLSAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgICAgICAgICAgICAgIG9ialsnaWQnXSA9IGlkO1xuICAgICAgICAgICAgICAgICAgICBvYmpbJ2NhbnRpZGFkJ10gPSBjYW50aWRhZDtcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWN1bG9zX3ZlbmRpZG9zLnB1c2gob2JqKTtcbiAgICAvKiAtLS0tIEFybWFyIHVuIGFycmF5IGNvbiBsb3MgYXJ0aWN1bG9zIHZlbmRpZG9zIC0tLS0tICovXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByZWNpb192ZW50YSlcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gKHBhcnNlRmxvYXQoY2FudGlkYWQpICogcGFyc2VGbG9hdChwcmVjaW9fdmVudGEudG9TdHJpbmcoKS5yZXBsYWNlKCcsJywgJy4nKSkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB0b3RhbC50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLS0tLS0tLSBFc3RhIGZ1bmNpb24gY2FsY3VsYSBlbCB0b3RhbCB5IGxhIGNvbG9jYVxuICAgIC0tLS0tLS0tLS0gZW4gbGEgcGFydGUgaW5mZXJpb3IgZGVsIGZvcm11bGFyaW8gZGUgdmVudGFzIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gZGV0ZWN0YXIgcXVlIHRpcG8gZGUgcGFnbyBlcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdGlwb19wYWdvID0gZnVuY3Rpb24oZm9ybWFfcGFnb19wYXJhbWV0cm8pe1xuICAgICAgICAgICAgICAgICQoJyNpZF9mZWNoYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfYnV0dG9uX2J1c2NhcicpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjYnVzY2FyX3NvY2lvJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fZ3VhcmRhcl9jb21wcmEnKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX25vX3N1bWFyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgIC8vIFBvbmdvIGRpc2FibGVkIGxhIHNlbGVjY2lvbiBkZSBsYSBmb3JtYSBkZSBwYWdvXG4gICAgICAgICAgICAgICAgZm9ybWFfcGFnbyA9IGZvcm1hX3BhZ29fcGFyYW1ldHJvO1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdlZmVjdGl2bycpe1xuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBlZmVjdGl2byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgcGFnb3NcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnZGVzY3VlbnRvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGRlc2N1ZW50byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgcGFnb3MgeSBkZXNjdWVudG9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfZGVzY3VlbnRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnY3JlZGl0bycpe1xuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBjcmVkaXRvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBhdW1lbnRvc1xuICAgICAgICAgICAgICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcG9yY2VudGFqZScpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2NyZWRpdG9fdG90YWwnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gaGFnbyBpbnZpc2libGVzIGxhcyBpbWFnZW5lcyBkZSB0aXBvcyBkZSBwYWdvc1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdlZmVjdGl2bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZWZlY3Rpdm8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnY3JlZGl0bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdkZWJpdG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2RlYml0bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdkZXNjdWVudG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gZGV0ZWN0YXIgcXVlIHRpcG8gZGUgcGFnbyBlcyAtLS0tICovXG5cbiAgICAvKiAtLS0tIEVsaW1pbmFyIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBlbGltaW5hcl9hcnRpY3VsbyA9IGZ1bmN0aW9uKGlkLCBjYW50aWRhZCwgcHJlY2lvX2Vudmlhcil7XG5cbiAgICAgICAgICAgICAgICBhcnRpY3Vsb3NfdmVuZGlkb3Muc3BsaWNlKGlkLCAxKTtcbiAgICAgICAgICAgICAgICAkKCcjdHJfJyArIGlkKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB0b3RhbCAtPSAocGFyc2VGbG9hdChjYW50aWRhZCkgKiBwYXJzZUZsb2F0KHByZWNpb19lbnZpYXIudG9TdHJpbmcoKS5yZXBsYWNlKCcsJywgJy4nKSkpO1xuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG5cbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBFbGltaW5hciB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG5cbiAgICAvKiAtLS0tIEFncmVnYXIgY2FudGlkYWQgYSB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG4gICAgICAgICAgICB2YXIgYWdyZWdhcl9jYW50aWRhZCA9IGZ1bmN0aW9uKGNvbnRhZG9yLCBpZCwgcHJlY2lvKXtcbiAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWQgPSBwcm9tcHQoXCJJbmdyZXNlIGxhIGNhbnRpZGFkXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjYW50aWRhZCAhPSBudWxsICYmIGNhbnRpZGFkICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZF90YWJsYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRfdGFibGFfYXJ0aWN1bG9zXCIpLnJvd3NbY29udGFkb3IgKyAxXS5jZWxscy5pdGVtKDApLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZF90YWJsYV9hcnRpY3Vsb3NcIikucm93c1tjb250YWRvciArIDFdLmNlbGxzLml0ZW0oMCkuaW5uZXJIVE1MID0gcGFyc2VJbnQoY2FudGlkYWRfdGFibGEpICsgcGFyc2VJbnQoY2FudGlkYWQpO1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbChjYW50aWRhZCwgaWQsIHByZWNpbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEFncmVnYXIgY2FudGlkYWQgYSB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG5cbiAgICAvKi0tLS0tLSBjdWFuZG8gc2VsZWNjaW9uYSBlbCBjYW5qZSBzZSBhZ3JlZ2EgbGFzIGNhamFzIGRlIHRleHRvIC0tLS0qL1xuICAgICQoXCIjaWRfY2FuamVfc29jaW9zXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAkKCcjaWRfY2FuamVfY3JlZGl0bycpLnByb3AoIFwiY2hlY2tlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Zvcm1fY2FuamVhcicpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Zvcm1fZWZlY3Rpdm8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9mb3JtX2NhbmplYXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJChcIiNpZF9jYW5qZV9jcmVkaXRvXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICAkKCcjaWRfY2FuamVfc29jaW9zJykucHJvcCggXCJjaGVja2VkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9lZmVjdGl2bycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Zvcm1fY2FuamVhcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Zvcm1fZWZlY3Rpdm8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIHZ1ZWx0b3Mgc2kgZXMgZWZlY3Rpdm8gLS0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS5jbGljayggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX3BhZ28nKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcGFnbycpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gZGVzY3VlbnRvIHBhcmEgc29jaW9zXG4gICAgICAgICAgICAkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgLyogLS0tIHBvciBjYWRhIGV2ZW50byBjYWxjdWxhciBlbCB2dWVsdG8gLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcGFnbycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSA9PSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykuZm9jdXNvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoKSA9PSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfY3JlZGl0b19zb2NpbycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIGlmICgkKCcjaWRfY3JlZGl0b19zb2NpbycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICQoJyNpZF9jcmVkaXRvX3NvY2lvJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS5rZXlwcmVzcyhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNpZF9jcmVkaXRvX3NvY2lvJykua2V5cHJlc3MoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2NyZWRpdG9fc29jaW8nKS52YWwoKSA9PSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0b19zb2NpbycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdnVlbHRvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvKiAtLS0tLSBjYWxjdWxhIHNpIGVzIGVmZWN0aXZvIGVsIHZ1ZWx0byAtLS0tLSAqL1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhZ28gPSAkKCcjaWRfcGFnbycpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHZhciBkZXNjdWVudG8gPSAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCk7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2N1ZW50b19zb2NpbyA9ICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCk7XG4gICAgICAgICAgICAgICAgdmFyIGNyZWRpdG9fc29jaW8gPSAkKCcjaWRfY3JlZGl0b19zb2NpbycpLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHZ1ZWx0byA9IHBhcnNlRmxvYXQocGFnbykgLSBwYXJzZUZsb2F0KHRvdGFsKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkZXNjdWVudG9fc29jaW8pXG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9jYW5qZV9zb2Npb3MnKS5pcygnOmNoZWNrZWQnKSl7XG4gICAgICAgICAgICAgICAgICBpZiAoZGVzY3VlbnRvX3NvY2lvICE9ICcwJykgeyAvLyBkZXNjdWVudG8gcGFyYSBzb2Npb3NcbiAgICAgICAgICAgICAgICAgICAgICBkZXNjdWVudG9fdG90YWwgPSAocGFyc2VGbG9hdCh0b3RhbCkgKiBwYXJzZUZsb2F0KGRlc2N1ZW50b19zb2NpbykpIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IDAuMDtcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHRhZG8gPSBwYXJzZUZsb2F0KHRvdGFsKSAtIHBhcnNlRmxvYXQoZGVzY3VlbnRvX3RvdGFsKTtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gIHBhcnNlRmxvYXQocGFnbykgLSBwYXJzZUZsb2F0KHJlc3VsdGFkbyk7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyMiA9IHJlc3VsdGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyMi50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9jYW5qZV9jcmVkaXRvJykuaXMoJzpjaGVja2VkJykpe1xuICAgICAgICAgICAgICAgICAgaWYgKGNyZWRpdG9fc29jaW8gIT0gJzAnKSB7IC8vIGNyZWRpdG8gcGFyYSBzb2Npb3NcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHRhZG8gPSAwLjA7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgLSBwYXJzZUZsb2F0KGNyZWRpdG9fc29jaW8pO1xuICAgICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSAgcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQocmVzdWx0YWRvKTtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIyID0gcmVzdWx0YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkZXNjdWVudG8pXG4gICAgICAgICAgICAgICAgaWYgKGRlc2N1ZW50byAhPSAnMCcpIHsgLy8gZGVzY3VlbnRvIGV4dHJhb3JkaW5hcmlvXG4gICAgICAgICAgICAgICAgICAgIGRlc2N1ZW50b190b3RhbCA9IChwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlRmxvYXQoZGVzY3VlbnRvKSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IDAuMDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgLSBwYXJzZUZsb2F0KGRlc2N1ZW50b190b3RhbCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSAgcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQocmVzdWx0YWRvKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyMiA9IHJlc3VsdGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhcjIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZ1ZWx0bylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2dWVsdG8udG9GaXhlZCgyKSlcbiAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB2dWVsdG8udG9GaXhlZCgyKTtcblxuICAgICAgICAgICAgICAgICQoJyNpZF92dWVsdG8nKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgdnVlbHRvcyBzaSBlcyBlZmVjdGl2byAtLS0tICovXG5cbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSBhdW1lbnRvIHNpIGVzIGNyZWRpdG8gLS0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS5jbGljayggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX3BvcmNlbnRhamUnKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLSBwb3IgY2FkYSBldmVudG8gY2FsY3VsYXIgZWwgdnVlbHRvIC0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjYWxjdWxhcl9hdW1lbnRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmtleXByZXNzKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX2F1bWVudG8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl9hdW1lbnRvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvKiAtLS0tLSBjYWxjdWxhIHNpIGVzIGNyZWRpdG8gZWwgYXVtZW50byAtLS0tLSAqL1xuICAgICAgICAgICAgICAgIHZhciBwb3JjZW50YWplID0gJCgnI2lkX3BvcmNlbnRhamUnKS52YWwoKTtcbiAgICAgICAgICAgICAgICBjcmVkaXRvX3BvcmNlbnRhamUgPSBwb3JjZW50YWplO1xuICAgICAgICAgICAgICAgIHZhciBhdW1lbnRvID0gcGFyc2VGbG9hdCh0b3RhbCkgKiBwYXJzZUludChwb3JjZW50YWplKS8xMDA7XG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsX2F1bWVudGFkbyA9IHBhcnNlRmxvYXQodG90YWwpICsgcGFyc2VGbG9hdChhdW1lbnRvKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB0b3RhbF9hdW1lbnRhZG8udG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0b190b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N0YXRpYy9hcHBzL3ZlbnRhcy9qcy9vcGVyYWNpb25lcy5qcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///30\n");

/***/ })

/******/ });