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
/******/ 	var hotCurrentHash = "a24d4a2783f6d64a3967"; // eslint-disable-line no-unused-vars
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

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar total_con_descuento = 0.0;\nvar resultado = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n/* --- hacer invisible los campos que solo son para descuento ---- */\ndocument.getElementById('id_div_descuento').style.display = 'none';\n/* ---- hacer invisible los campos que solo son para los socios ---*/\ndocument.getElementById('id_div_puntos_socios').style.display = 'none';\ndocument.getElementById('id_form_canjear').style.display = 'none';\n\n/* ----------- habilitar campos para canje de puntos en socio ---*/\nhabilitar_campos_canje = function (socio) {\n    $('#id_puntos_socios').val(socio.puntos);\n    document.getElementById('id_div_puntos_socios').style.display = 'block';\n};\n/* --------------------------------------------------------------*/\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_debito, precio_compra, stock, proveedor) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'descuento':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_credito;\n                break;\n            case 'debito':\n                precio_enviar = precio_debito;\n                break;\n        };\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    total_con_descuento = resultado;\n    var no_sumar = false;\n    var canje_socios = false;\n\n    $('#id_button_guardar_compra').prop(\"disabled\", true);\n    if ($('#id_no_sumar').is(':checked')) {\n        no_sumar = true;\n    }\n    if ($('#id_canje_socios').is(':checked')) {\n        canje_socios = true;\n    }\n\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            id_socio: $('#id_socio').val(),\n            porcentaje_descuento: $('#id_monto_descuento').val(),\n            total_con_descuento: total_con_descuento,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            no_sumar: no_sumar,\n            puntos_socios: $('#id_puntos_socios').val(),\n            canje_socios: canje_socios,\n            credito_porcentaje: credito_porcentaje,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                if (Object.keys(data).length == 0) {\n                    swal({\n                        title: \"El árticulo no fue encontrado o el stock es 0. Verifique en la lista de árticulos los datos correspondientes. \",\n                        text: \"Desea realizar el pedido ? \",\n                        icon: \"warning\",\n                        buttons: true,\n                        dangerMode: true\n                    });\n                    /*.then((willDelete) => {\n                      if (willDelete) {\n                        swal(\"Poof! Your imaginary file has been deleted!\", {\n                          icon: \"success\",\n                        });\n                      } else {\n                        swal(\"El pedido ha sido enviado\");\n                      }\n                    });*/\n                } else {\n\n                    var precio_enviar = '';\n                    switch (forma_pago) {\n                        case 'efectivo':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'descuento':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'credito':\n                            precio_enviar = data.precio_credito;\n                            break;\n                        case 'debito':\n                            precio_enviar = data.precio_debito;\n                            break;\n                    };\n                    contador_tabla += 1;\n                    calcular_total('1', data.id, precio_enviar);\n                    $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.nombre + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n                }\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n    console.log(precio_venta);\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#buscar_socio').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    $('#id_no_sumar').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n    };\n    if (forma_pago == 'descuento') {\n        // si es descuento habilito sus respectivos pagos y descuento\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n\n    // hago invisibles las imagenes de tipos de pagos\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n    if (forma_pago != 'descuento') {\n        $('#id_descuento').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/*------ cuando selecciona el canje se agrega las cajas de texto ----*/\n$(\"#id_canje_socios\").change(function () {\n    if (this.checked) {\n        document.getElementById('id_form_canjear').style.display = 'block';\n    } else {\n        document.getElementById('id_form_canjear').style.display = 'none';\n    }\n});\n/*-------------------------------------------------------------------*/\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_monto_descuento').click(function () {\n    if ($('#id_monto_descuento').val() == '0') {\n        $('#id_monto_descuento').val(' ');\n    }\n});\n// descuento para socios\n$('#id_descuento_socios').click(function () {\n    if ($('#id_descuento_socios').val() == '0') {\n        $('#id_descuento_socios').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_monto_descuento').focusout(function () {\n    if ($('#id_monto_descuento').val() == '') {\n        $('#id_monto_descuento').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_descuento_socios').focusout(function () {\n    if ($('#id_descuento_socios').val() == '') {\n        $('#id_descuento_socios').val('0');\n    }\n    calcular_vuelto();\n});\n\n$('#id_descuento_socios').keypress(function (e) {\n    if (e.keyCode == 13) {\n        if ($('#id_descuento_socios').val() == '') {\n            $('#id_descuento_socios').val('0');\n        }\n        calcular_vuelto();\n    }\n});\n\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var descuento = $('#id_monto_descuento').val();\n    var descuento_socio = $('#id_descuento_socios').val();\n\n    var vuelto = parseFloat(pago) - parseFloat(total);\n\n    if (descuento_socio != '0') {\n        // descuento para socios\n        descuento_total = parseFloat(total) * parseFloat(descuento_socio) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    }\n\n    if (descuento != '0') {\n        // descuento extraordinario\n        descuento_total = parseFloat(total) * parseFloat(descuento) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    }\n\n    var representar = vuelto.toFixed(2);\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_monto_descuento').focusout(function () {\n    calcular_vuelto();\n});\n$('#id_monto_descuento').keypress(function () {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsInRvdGFsX2Nvbl9kZXNjdWVudG8iLCJyZXN1bHRhZG8iLCJjb250YWRvcl90YWJsYSIsImNyZWRpdG9fcG9yY2VudGFqZSIsImFydGljdWxvc192ZW5kaWRvcyIsImZvcm1hX3BhZ28iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5IiwiaGFiaWxpdGFyX2NhbXBvc19jYW5qZSIsInNvY2lvIiwiJCIsInZhbCIsInB1bnRvcyIsInNlbGVjY2lvbl9hcnRpY3VsbyIsImlkIiwiZGVzY3JpcGNpb24iLCJtYXJjYSIsInJ1YnJvIiwicHJlY2lvX3ZlbnRhIiwicHJlY2lvX2NyZWRpdG8iLCJwcmVjaW9fZGViaXRvIiwicHJlY2lvX2NvbXByYSIsInN0b2NrIiwicHJvdmVlZG9yIiwiY2FudGlkYWQiLCJwcm9tcHQiLCJwcmVjaW9fZW52aWFyIiwiY2FsY3VsYXJfdG90YWwiLCJhZnRlciIsInRvU3RyaW5nIiwiZ3VhcmRhcl9jb21wcmEiLCJub19zdW1hciIsImNhbmplX3NvY2lvcyIsInByb3AiLCJpcyIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInZlbnRhcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJmZWNoYSIsImlkX3NvY2lvIiwicG9yY2VudGFqZV9kZXNjdWVudG8iLCJwcmVjaW9fdmVudGFfdG90YWwiLCJwdW50b3Nfc29jaW9zIiwiY3NyZm1pZGRsZXdhcmV0b2tlbiIsInN1Y2Nlc3MiLCJQTm90aWZ5IiwidGl0bGUiLCJ0ZXh0IiwiaHRtbCIsImVtcHR5Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiaWRfdmVudGEiLCJrZXlwcmVzcyIsImUiLCJ3aGljaCIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJzd2FsIiwiaWNvbiIsImJ1dHRvbnMiLCJkYW5nZXJNb2RlIiwibm9tYnJlIiwib2JqIiwicHVzaCIsImNvbnNvbGUiLCJsb2ciLCJwYXJzZUZsb2F0IiwicmVwbGFjZSIsInJlcHJlc2VudGFyIiwidG9GaXhlZCIsImNhbGN1bGFyX3RpcG9fcGFnbyIsImZvcm1hX3BhZ29fcGFyYW1ldHJvIiwiaGlkZSIsImVsaW1pbmFyX2FydGljdWxvIiwic3BsaWNlIiwicmVtb3ZlIiwiYWdyZWdhcl9jYW50aWRhZCIsImNvbnRhZG9yIiwicHJlY2lvIiwiY2FudGlkYWRfdGFibGEiLCJyb3dzIiwiY2VsbHMiLCJpdGVtIiwiaW5uZXJIVE1MIiwicGFyc2VJbnQiLCJjaGFuZ2UiLCJjaGVja2VkIiwiY2xpY2siLCJmb2N1c291dCIsImNhbGN1bGFyX3Z1ZWx0byIsImtleUNvZGUiLCJwYWdvIiwiZGVzY3VlbnRvIiwiZGVzY3VlbnRvX3NvY2lvIiwidnVlbHRvIiwiZGVzY3VlbnRvX3RvdGFsIiwicmVwcmVzZW50YXIyIiwiY2FsY3VsYXJfYXVtZW50byIsInBvcmNlbnRhamUiLCJhdW1lbnRvIiwidG90YWxfYXVtZW50YWRvIl0sIm1hcHBpbmdzIjoiQUFBWTtBQUNBLElBQUlBLFFBQVEsR0FBWjtBQUNBLElBQUlDLHNCQUFzQixHQUExQjtBQUNBLElBQUlDLFlBQVksR0FBaEI7QUFDQSxJQUFJQyxpQkFBaUIsQ0FBckI7QUFDQSxJQUFJQyxxQkFBcUIsQ0FBekI7QUFDQSxJQUFJQyxxQkFBcUIsRUFBekI7QUFDQSxJQUFJQyxhQUFhLEVBQWpCO0FBQ0E7QUFDQUMsU0FBU0MsY0FBVCxDQUF3QixhQUF4QixFQUF1Q0MsS0FBdkMsQ0FBNkNDLE9BQTdDLEdBQXVELE1BQXZEO0FBQ0FILFNBQVNDLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUNDLEtBQXpDLENBQStDQyxPQUEvQyxHQUF5RCxNQUF6RDtBQUNBO0FBQ0FILFNBQVNDLGNBQVQsQ0FBd0IsbUJBQXhCLEVBQTZDQyxLQUE3QyxDQUFtREMsT0FBbkQsR0FBNkQsTUFBN0Q7QUFDQUgsU0FBU0MsY0FBVCxDQUF3QixzQkFBeEIs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QUErQixHQUEvQixFQUFvQyxHQUFwQyxDQUFuQztBQUNILENBUkQiLCJmaWxlIjoiMzAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgICAgICAgICAgICAvKiAtLS0tIHZhcmlhYmxlcyBnbG9iYWxlcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgdG90YWwgPSAwLjA7XG4gICAgICAgICAgICB2YXIgdG90YWxfY29uX2Rlc2N1ZW50byA9IDAuMDtcbiAgICAgICAgICAgIHZhciByZXN1bHRhZG8gPSAwLjA7XG4gICAgICAgICAgICB2YXIgY29udGFkb3JfdGFibGEgPSAwO1xuICAgICAgICAgICAgdmFyIGNyZWRpdG9fcG9yY2VudGFqZSA9IDA7XG4gICAgICAgICAgICB2YXIgYXJ0aWN1bG9zX3ZlbmRpZG9zID0gW107XG4gICAgICAgICAgICB2YXIgZm9ybWFfcGFnbyA9ICcnO1xuICAgICAgICAgICAgLyogLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGVmZWN0aXZvIC0tLS0gKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcGFnbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3Z1ZWx0bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgY3LDqWRpdG8gLS0tLSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wb3JjZW50YWplJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfY3JlZGl0b190b3RhbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgZGVzY3VlbnRvIC0tLS0gKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfZGVzY3VlbnRvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIC8qIC0tLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgbG9zIHNvY2lvcyAtLS0qL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wdW50b3Nfc29jaW9zJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9mb3JtX2NhbmplYXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICAgICAgICAvKiAtLS0tLS0tLS0tLSBoYWJpbGl0YXIgY2FtcG9zIHBhcmEgY2FuamUgZGUgcHVudG9zIGVuIHNvY2lvIC0tLSovXG4gICAgICAgICAgICBoYWJpbGl0YXJfY2FtcG9zX2NhbmplID0gZnVuY3Rpb24oc29jaW8pe1xuICAgICAgICAgICAgICAgICQoJyNpZF9wdW50b3Nfc29jaW9zJykudmFsKHNvY2lvLnB1bnRvcyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wdW50b3Nfc29jaW9zJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgICAgICAgIHZhciBzZWxlY2Npb25fYXJ0aWN1bG8gPSBmdW5jdGlvbihpZCwgZGVzY3JpcGNpb24sIG1hcmNhLCBydWJybywgcHJlY2lvX3ZlbnRhLCBwcmVjaW9fY3JlZGl0bywgcHJlY2lvX2RlYml0bywgcHJlY2lvX2NvbXByYSwgc3RvY2ssIHByb3ZlZWRvcil7XG4gICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkID0gcHJvbXB0KFwiSW5ncmVzZSBsYSBjYW50aWRhZFwiLCBcIlwiKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcmVjaW9fZW52aWFyID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnRpZGFkICE9IG51bGwgJiYgY2FudGlkYWQgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYV9wYWdvKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VmZWN0aXZvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGVzY3VlbnRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3JlZGl0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb19jcmVkaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX2RlYml0bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdG90YWwoY2FudGlkYWQsIGlkLCBwcmVjaW9fZW52aWFyKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGFkb3JfdGFibGEgKz0xO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zIHRyOmxhc3QnKS5hZnRlcignPHRyIGlkPVwidHJfJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnXCI+PHRkPicgKyBjYW50aWRhZCArICc8L3RkPicgKyAnPHRkPicgKyBkZXNjcmlwY2lvbiArICc8L3RkPicgKyAnPHRkPiAkJyArIHByZWNpb19lbnZpYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8L3RkPicgKyAgJzx0ZD48YSBvbmNsaWNrPVwiZWxpbWluYXJfYXJ0aWN1bG8oJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBjYW50aWRhZCArICcsJyArIHByZWNpb19lbnZpYXIgKycpXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT4gPC9hPjwvdGQ+PC90cj4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgZ3VhcmRhcl9jb21wcmEgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRvdGFsX2Nvbl9kZXNjdWVudG8gPSByZXN1bHRhZG87XG4gICAgICAgICAgICAgICAgdmFyIG5vX3N1bWFyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIGNhbmplX3NvY2lvcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgJCgnI2lkX2J1dHRvbl9ndWFyZGFyX2NvbXByYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgdHJ1ZSApO1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbm9fc3VtYXInKS5pcygnOmNoZWNrZWQnKSl7bm9fc3VtYXIgPSB0cnVlO31cbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2NhbmplX3NvY2lvcycpLmlzKCc6Y2hlY2tlZCcpKXtjYW5qZV9zb2Npb3MgPSB0cnVlO31cblxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy92ZW50YXMvYWpheC92ZW50YXMvYWx0YS8nLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlbnRhczogSlNPTi5zdHJpbmdpZnkoYXJ0aWN1bG9zX3ZlbmRpZG9zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZlY2hhOiAkKCcjaWRfZmVjaGEnKS52YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZF9zb2NpbzogJCgnI2lkX3NvY2lvJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3JjZW50YWplX2Rlc2N1ZW50bzogJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxfY29uX2Rlc2N1ZW50bzogdG90YWxfY29uX2Rlc2N1ZW50byxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb192ZW50YV90b3RhbDogdG90YWwudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hX3BhZ286IGZvcm1hX3BhZ28sXG4gICAgICAgICAgICAgICAgICAgICAgICBub19zdW1hcjogbm9fc3VtYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwdW50b3Nfc29jaW9zOiAkKCcjaWRfcHVudG9zX3NvY2lvcycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuamVfc29jaW9zOiBjYW5qZV9zb2Npb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVkaXRvX3BvcmNlbnRhamU6IGNyZWRpdG9fcG9yY2VudGFqZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzcmZtaWRkbGV3YXJldG9rZW46ICQoXCJpbnB1dFtuYW1lPWNzcmZtaWRkbGV3YXJldG9rZW5dXCIpLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2Vzcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBOb3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Npc3RlbWEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLnN1Y2Nlc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgMC4wJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RhYmxhX2FydGljdWxvcycpLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3ZlbnRhcy90aWNrZXQvJyArIGRhdGEuaWRfdmVudGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgIC8qIC0tLS0gZnVuY2lvbiBwYXJhIGVsIGxlY3RvciBkZSBjb2RpZ28gZGUgYmFycmFzIC0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS5rZXlwcmVzcyhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMyl7XG5cbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy92ZW50YXMvYWpheC9jb2RpZ28vYXJ0aWN1bG8vJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29kaWdvX2FydGljdWxvJzogJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRWwgw6FydGljdWxvIG5vIGZ1ZSBlbmNvbnRyYWRvIG8gZWwgc3RvY2sgZXMgMC4gVmVyaWZpcXVlIGVuIGxhIGxpc3RhIGRlIMOhcnRpY3Vsb3MgbG9zIGRhdG9zIGNvcnJlc3BvbmRpZW50ZXMuIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJEZXNlYSByZWFsaXphciBlbCBwZWRpZG8gPyBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKi50aGVuKCh3aWxsRGVsZXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lsbERlbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2FsKFwiUG9vZiEgWW91ciBpbWFnaW5hcnkgZmlsZSBoYXMgYmVlbiBkZWxldGVkIVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dhbChcIkVsIHBlZGlkbyBoYSBzaWRvIGVudmlhZG9cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7Ki9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJlY2lvX2VudmlhciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGZvcm1hX3BhZ28pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWZlY3Rpdm8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Rlc2N1ZW50byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3JlZGl0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX2NyZWRpdG87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZWJpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb19kZWJpdG87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhZG9yX3RhYmxhICs9MTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdG90YWwoJzEnLCBkYXRhLmlkLCBwcmVjaW9fZW52aWFyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RhYmxhX2FydGljdWxvcyB0cjpsYXN0JykuYWZ0ZXIoJzx0ciBpZD1cInRyXycgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJ1wiPjx0ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNhbnRpZGFkICsgJzwvdGQ+JyArICc8dGQ+JyArIGRhdGEubm9tYnJlICsgJzwvdGQ+JyArICc8dGQ+ICQnICsgcHJlY2lvX2VudmlhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8L3RkPicgKyAnPHRkPjxhIG9uY2xpY2s9XCJhZ3JlZ2FyX2NhbnRpZGFkKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgZGF0YS5pZCArICcsJyArIHByZWNpb19lbnZpYXIgKyAnKVwiICcgKyAnY2xhc3M9XCJidG4gYnRuLWluZm8gYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPiA8L2E+PGEgb25jbGljaz1cImVsaW1pbmFyX2FydGljdWxvKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgZGF0YS5jYW50aWRhZCArICcsJyArIHByZWNpb19lbnZpYXIgKyAnKVwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT4gPC9hPjwvdGQ+PC90cj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgLyogLS0tLSBmdW5jaW9uIHBhcmEgZWwgbGVjdG9yIGRlIGNvZGlnbyBkZSBiYXJyYXMgLS0tICovXG5cbiAgICAvKiAtLS0tLS0tLS0tIEVzdGEgZnVuY2lvbiBjYWxjdWxhIGVsIHRvdGFsIHkgbGEgY29sb2NhXG4gICAgKioqIC0tLS0tLS0tLS0gZW4gbGEgcGFydGUgaW5mZXJpb3IgZGVsIGZvcm11bGFyaW8gZGUgdmVudGFzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl90b3RhbCA9IGZ1bmN0aW9uKGNhbnRpZGFkLCBpZCwgcHJlY2lvX3ZlbnRhKXtcbiAgICAvKiAtLS0tIEFybWFyIHVuIGFycmF5IGNvbiBsb3MgYXJ0aWN1bG9zIHZlbmRpZG9zIC0tLS0tICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgb2JqWydpZCddID0gaWQ7XG4gICAgICAgICAgICAgICAgICAgIG9ialsnY2FudGlkYWQnXSA9IGNhbnRpZGFkO1xuICAgICAgICAgICAgICAgICAgICBhcnRpY3Vsb3NfdmVuZGlkb3MucHVzaChvYmopO1xuICAgIC8qIC0tLS0gQXJtYXIgdW4gYXJyYXkgY29uIGxvcyBhcnRpY3Vsb3MgdmVuZGlkb3MgLS0tLS0gKi9cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJlY2lvX3ZlbnRhKVxuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSAocGFyc2VGbG9hdChjYW50aWRhZCkgKiBwYXJzZUZsb2F0KHByZWNpb192ZW50YS50b1N0cmluZygpLnJlcGxhY2UoJywnLCAnLicpKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tLS0tLS0tIEVzdGEgZnVuY2lvbiBjYWxjdWxhIGVsIHRvdGFsIHkgbGEgY29sb2NhXG4gICAgLS0tLS0tLS0tLSBlbiBsYSBwYXJ0ZSBpbmZlcmlvciBkZWwgZm9ybXVsYXJpbyBkZSB2ZW50YXMgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBkZXRlY3RhciBxdWUgdGlwbyBkZSBwYWdvIGVzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl90aXBvX3BhZ28gPSBmdW5jdGlvbihmb3JtYV9wYWdvX3BhcmFtZXRybyl7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2ZlY2hhJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fYnVzY2FyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNidXNjYXJfc29jaW8nKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2J1dHRvbl9ndWFyZGFyX2NvbXByYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfbm9fc3VtYXInKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgLy8gUG9uZ28gZGlzYWJsZWQgbGEgc2VsZWNjaW9uIGRlIGxhIGZvcm1hIGRlIHBhZ29cbiAgICAgICAgICAgICAgICBmb3JtYV9wYWdvID0gZm9ybWFfcGFnb19wYXJhbWV0cm87XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gPT0gJ2VmZWN0aXZvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGVmZWN0aXZvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBwYWdvc1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdkZXNjdWVudG8nKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2kgZXMgZGVzY3VlbnRvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBwYWdvcyB5IGRlc2N1ZW50b1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9kZXNjdWVudG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdjcmVkaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGNyZWRpdG8gaGFiaWxpdG8gc3VzIHJlc3BlY3Rpdm9zIGF1bWVudG9zXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcG9yY2VudGFqZScpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2NyZWRpdG9fdG90YWwnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gaGFnbyBpbnZpc2libGVzIGxhcyBpbWFnZW5lcyBkZSB0aXBvcyBkZSBwYWdvc1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdlZmVjdGl2bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZWZlY3Rpdm8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnY3JlZGl0bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdkZWJpdG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2RlYml0bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdkZXNjdWVudG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gZGV0ZWN0YXIgcXVlIHRpcG8gZGUgcGFnbyBlcyAtLS0tICovXG5cbiAgICAvKiAtLS0tIEVsaW1pbmFyIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBlbGltaW5hcl9hcnRpY3VsbyA9IGZ1bmN0aW9uKGlkLCBjYW50aWRhZCwgcHJlY2lvX2Vudmlhcil7XG5cbiAgICAgICAgICAgICAgICBhcnRpY3Vsb3NfdmVuZGlkb3Muc3BsaWNlKGlkLCAxKTtcbiAgICAgICAgICAgICAgICAkKCcjdHJfJyArIGlkKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB0b3RhbCAtPSAocGFyc2VGbG9hdChjYW50aWRhZCkgKiBwYXJzZUZsb2F0KHByZWNpb19lbnZpYXIudG9TdHJpbmcoKS5yZXBsYWNlKCcsJywgJy4nKSkpO1xuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG5cbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBFbGltaW5hciB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG5cbiAgICAvKiAtLS0tIEFncmVnYXIgY2FudGlkYWQgYSB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG4gICAgICAgICAgICB2YXIgYWdyZWdhcl9jYW50aWRhZCA9IGZ1bmN0aW9uKGNvbnRhZG9yLCBpZCwgcHJlY2lvKXtcbiAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWQgPSBwcm9tcHQoXCJJbmdyZXNlIGxhIGNhbnRpZGFkXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjYW50aWRhZCAhPSBudWxsICYmIGNhbnRpZGFkICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZF90YWJsYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRfdGFibGFfYXJ0aWN1bG9zXCIpLnJvd3NbY29udGFkb3IgKyAxXS5jZWxscy5pdGVtKDApLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZF90YWJsYV9hcnRpY3Vsb3NcIikucm93c1tjb250YWRvciArIDFdLmNlbGxzLml0ZW0oMCkuaW5uZXJIVE1MID0gcGFyc2VJbnQoY2FudGlkYWRfdGFibGEpICsgcGFyc2VJbnQoY2FudGlkYWQpO1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbChjYW50aWRhZCwgaWQsIHByZWNpbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEFncmVnYXIgY2FudGlkYWQgYSB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG5cbiAgICAvKi0tLS0tLSBjdWFuZG8gc2VsZWNjaW9uYSBlbCBjYW5qZSBzZSBhZ3JlZ2EgbGFzIGNhamFzIGRlIHRleHRvIC0tLS0qL1xuICAgICQoXCIjaWRfY2FuamVfc29jaW9zXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9jYW5qZWFyJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Zvcm1fY2FuamVhcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgdnVlbHRvcyBzaSBlcyBlZmVjdGl2byAtLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcGFnbycpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wYWdvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBkZXNjdWVudG8gcGFyYSBzb2Npb3NcbiAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0gcG9yIGNhZGEgZXZlbnRvIGNhbGN1bGFyIGVsIHZ1ZWx0byAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wYWdvJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcGFnbycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS5mb2N1c291dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS5rZXlwcmVzcyhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdnVlbHRvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvKiAtLS0tLSBjYWxjdWxhIHNpIGVzIGVmZWN0aXZvIGVsIHZ1ZWx0byAtLS0tLSAqL1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhZ28gPSAkKCcjaWRfcGFnbycpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHZhciBkZXNjdWVudG8gPSAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCk7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2N1ZW50b19zb2NpbyA9ICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQodG90YWwpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRlc2N1ZW50b19zb2NpbyAhPSAnMCcpIHsgLy8gZGVzY3VlbnRvIHBhcmEgc29jaW9zXG4gICAgICAgICAgICAgICAgICAgIGRlc2N1ZW50b190b3RhbCA9IChwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlRmxvYXQoZGVzY3VlbnRvX3NvY2lvKSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IDAuMDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgLSBwYXJzZUZsb2F0KGRlc2N1ZW50b190b3RhbCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSAgcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQocmVzdWx0YWRvKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyMiA9IHJlc3VsdGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhcjIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGRlc2N1ZW50byAhPSAnMCcpIHsgLy8gZGVzY3VlbnRvIGV4dHJhb3JkaW5hcmlvXG4gICAgICAgICAgICAgICAgICAgIGRlc2N1ZW50b190b3RhbCA9IChwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlRmxvYXQoZGVzY3VlbnRvKSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IDAuMDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgLSBwYXJzZUZsb2F0KGRlc2N1ZW50b190b3RhbCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSAgcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQocmVzdWx0YWRvKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyMiA9IHJlc3VsdGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhcjIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB2dWVsdG8udG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfdnVlbHRvJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIHZ1ZWx0b3Mgc2kgZXMgZWZlY3Rpdm8gLS0tLSAqL1xuXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgYXVtZW50byBzaSBlcyBjcmVkaXRvIC0tLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wb3JjZW50YWplJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0gcG9yIGNhZGEgZXZlbnRvIGNhbGN1bGFyIGVsIHZ1ZWx0byAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfYXVtZW50bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5rZXlwcmVzcyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl9hdW1lbnRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfYXVtZW50byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLyogLS0tLS0gY2FsY3VsYSBzaSBlcyBjcmVkaXRvIGVsIGF1bWVudG8gLS0tLS0gKi9cbiAgICAgICAgICAgICAgICB2YXIgcG9yY2VudGFqZSA9ICQoJyNpZF9wb3JjZW50YWplJykudmFsKCk7XG4gICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplID0gcG9yY2VudGFqZTtcbiAgICAgICAgICAgICAgICB2YXIgYXVtZW50byA9IHBhcnNlRmxvYXQodG90YWwpICogcGFyc2VJbnQocG9yY2VudGFqZSkvMTAwO1xuICAgICAgICAgICAgICAgIHZhciB0b3RhbF9hdW1lbnRhZG8gPSBwYXJzZUZsb2F0KHRvdGFsKSArIHBhcnNlRmxvYXQoYXVtZW50byk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWxfYXVtZW50YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG9fdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///30\n");

/***/ })

/******/ });