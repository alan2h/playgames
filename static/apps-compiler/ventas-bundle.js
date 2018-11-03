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
/******/ 	var hotCurrentHash = "1d25f1437c8d7812af6f"; // eslint-disable-line no-unused-vars
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

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar total_con_descuento = 0.0;\nvar resultado = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n/* --- hacer invisible los campos que solo son para descuento ---- */\ndocument.getElementById('id_div_descuento').style.display = 'none';\n/* ---- hacer invisible los campos que solo son para los socios ---*/\ndocument.getElementById('id_div_puntos_socios').style.display = 'none';\ndocument.getElementById('id_form_canjear').style.display = 'none';\ndocument.getElementById('id_form_efectivo').style.display = 'none';\n\n/* ----------- habilitar campos para canje de puntos en socio ---*/\nhabilitar_campos_canje = function (socio) {\n    console.log(socio);\n    if (socio.tipo_cliente.descripcion == 'Socio Normal') {\n        $('#id_puntos_socios').val(socio.puntos);\n    } else {\n        $('#id_puntos_socios').val(socio.puntos_premium);\n    }\n    document.getElementById('id_div_puntos_socios').style.display = 'block';\n    $('#id_descuento_de_socio').prop(\"checked\", true);\n};\n/* --------------------------------------------------------------*/\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_debito, precio_compra, stock, proveedor, no_suma_caja) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'descuento':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_credito;\n                break;\n            case 'debito':\n                precio_enviar = precio_debito;\n                break;\n        };\n        if (no_suma_caja) {\n            if (!$('#id_no_sumar').is(':checked')) {\n                swal({\n                    title: \"El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas\",\n                    text: \"Desea que el sistema tilde el check por usted ? \",\n                    icon: \"info\",\n                    buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],\n                    dangerMode: false\n                }).then(willDelete => {\n                    if (willDelete) {\n                        $('#id_no_sumar').prop(\"checked\", true);\n                    }\n                });\n            }\n        }\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    total_con_descuento = resultado;\n    var no_sumar = false;\n    var canje_socios = false;\n    var canje_credito = false;\n    var id_descuento_de_socio = false;\n\n    $('#id_button_guardar_compra').prop(\"disabled\", true);\n    if ($('#id_no_sumar').is(':checked')) {\n        no_sumar = true;\n    }\n    if ($('#id_canje_socios').is(':checked')) {\n        canje_socios = true;\n    }\n    if ($('#id_canje_credito').is(':checked')) {\n        canje_credito = true;\n    }\n    if ($('#id_descuento_de_socio').is(':checked')) {\n        id_descuento_de_socio = true;\n    }\n\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            id_socio: $('#id_socio').val(),\n            porcentaje_descuento: $('#id_monto_descuento').val(),\n            total_con_descuento: total_con_descuento,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            no_sumar: no_sumar,\n            puntos_socios: $('#id_puntos_socios').val(),\n            canje_socios: canje_socios,\n            creditos_socios: $('#id_credito_socio').val(),\n            canje_credito: canje_credito,\n            credito_porcentaje: credito_porcentaje,\n            id_descuento_de_socio: id_descuento_de_socio,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                if (Object.keys(data).length == 0) {\n                    swal({\n                        title: \"El árticulo no fue encontrado o el stock es 0. Verifique en la lista de árticulos los datos correspondientes. \",\n                        text: \"Desea realizar el pedido ? \",\n                        icon: \"warning\",\n                        buttons: true,\n                        dangerMode: true\n                    });\n                    /*.then((willDelete) => {\n                      if (willDelete) {\n                        swal(\"Poof! Your imaginary file has been deleted!\", {\n                          icon: \"success\",\n                        });\n                      } else {\n                        swal(\"El pedido ha sido enviado\");\n                      }\n                    });*/\n                } else {\n\n                    var precio_enviar = '';\n                    switch (forma_pago) {\n                        case 'efectivo':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'descuento':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'credito':\n                            precio_enviar = data.precio_credito;\n                            break;\n                        case 'debito':\n                            precio_enviar = data.precio_debito;\n                            break;\n                    };\n                    contador_tabla += 1;\n                    calcular_total('1', data.id, precio_enviar);\n                    if (data.no_suma_caja) {\n                        if (!$('#id_no_sumar').is(':checked')) {\n                            swal({\n                                title: \"El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas\",\n                                text: \"Desea que el sistema tilde el check por usted ? \",\n                                icon: \"info\",\n                                buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],\n                                dangerMode: false\n                            }).then(willDelete => {\n                                if (willDelete) {\n                                    $('#id_no_sumar').prop(\"checked\", true);\n                                }\n                            });\n                        }\n                    }\n                    $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.nombre + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n                }\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n    console.log(precio_venta);\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#buscar_socio').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    $('#id_no_sumar').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n    };\n    if (forma_pago == 'descuento') {\n        // si es descuento habilito sus respectivos pagos y descuento\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        //document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n\n    // hago invisibles las imagenes de tipos de pagos\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n    if (forma_pago != 'descuento') {\n        $('#id_descuento').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/*------ cuando selecciona el canje se agrega las cajas de texto ----*/\n$(\"#id_canje_socios\").change(function () {\n    if (this.checked) {\n        $('#id_canje_credito').prop(\"checked\", false);\n        document.getElementById('id_form_canjear').style.display = 'block';\n        document.getElementById('id_form_efectivo').style.display = 'none';\n    } else {\n        document.getElementById('id_form_canjear').style.display = 'none';\n    }\n});\n$(\"#id_canje_credito\").change(function () {\n    if (this.checked) {\n        $('#id_canje_socios').prop(\"checked\", false);\n        document.getElementById('id_form_efectivo').style.display = 'block';\n        document.getElementById('id_form_canjear').style.display = 'none';\n    } else {\n        document.getElementById('id_form_efectivo').style.display = 'none';\n    }\n});\n/*-------------------------------------------------------------------*/\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_monto_descuento').click(function () {\n    if ($('#id_monto_descuento').val() == '0') {\n        $('#id_monto_descuento').val(' ');\n    }\n});\n// descuento para socios\n$('#id_descuento_socios').click(function () {\n    if ($('#id_descuento_socios').val() == '0') {\n        $('#id_descuento_socios').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_monto_descuento').focusout(function () {\n    if ($('#id_monto_descuento').val() == '') {\n        $('#id_monto_descuento').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_descuento_socios').focusout(function () {\n    if ($('#id_descuento_socios').val() == '') {\n        $('#id_descuento_socios').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_credito_socio').focusout(function () {\n    if ($('#id_credito_socio').val() == '') {\n        $('#id_credito_socio').val('0');\n    }\n    calcular_vuelto();\n});\n\n$('#id_descuento_socios').keypress(function (e) {\n    if (e.keyCode == 13) {\n        if ($('#id_descuento_socios').val() == '') {\n            $('#id_descuento_socios').val('0');\n        }\n        calcular_vuelto();\n    }\n});\n\n$('#id_credito_socio').keypress(function (e) {\n    if (e.keyCode == 13) {\n        if ($('#id_credito_socio').val() == '') {\n            $('#id_credito_socio').val('0');\n        }\n        calcular_vuelto();\n    }\n});\n\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var descuento = $('#id_monto_descuento').val();\n    var descuento_socio = $('#id_descuento_socios').val();\n    var credito_socio = $('#id_credito_socio').val();\n\n    var vuelto = parseFloat(pago) - parseFloat(total);\n    console.log(descuento_socio);\n    if ($('#id_canje_socios').is(':checked')) {\n        if (descuento_socio != '0') {\n            // descuento para socios\n            descuento_total = parseFloat(total) * parseFloat(descuento_socio) / 100;\n            resultado = 0.0;\n            resultado = parseFloat(total) - parseFloat(descuento_total);\n            var vuelto = parseFloat(pago) - parseFloat(resultado);\n            var representar2 = resultado.toFixed(2);\n            $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n        }\n    }\n    if ($('#id_canje_credito').is(':checked')) {\n        if (credito_socio != '0') {\n            // credito para socios\n            resultado = 0.0;\n            resultado = parseFloat(total) - parseFloat(credito_socio);\n            var vuelto = parseFloat(pago) - parseFloat(resultado);\n            var representar2 = resultado.toFixed(2);\n            $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n        }\n    }\n    if ($('#id_descuento_de_socio').is(':checked')) {\n        resultado = 0.0;\n        var descuento_socio = parseFloat(total) * 5 / 100;\n        resultado = parseFloat(total) - parseFloat(descuento_socio);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    }\n    console.log(descuento);\n    if (descuento != '0') {\n        // descuento extraordinario\n        descuento_total = parseFloat(total) * parseFloat(descuento) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    }\n    console.log(vuelto);\n    console.log(vuelto.toFixed(2));\n    var representar = vuelto.toFixed(2);\n\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_monto_descuento').focusout(function () {\n    calcular_vuelto();\n});\n$('#id_monto_descuento').keypress(function () {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsInRvdGFsX2Nvbl9kZXNjdWVudG8iLCJyZXN1bHRhZG8iLCJjb250YWRvcl90YWJsYSIsImNyZWRpdG9fcG9yY2VudGFqZSIsImFydGljdWxvc192ZW5kaWRvcyIsImZvcm1hX3BhZ28iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5IiwiaGFiaWxpdGFyX2NhbXBvc19jYW5qZSIsInNvY2lvIiwiY29uc29sZSIsImxvZyIsInRpcG9fY2xpZW50ZSIsImRlc2NyaXBjaW9uIiwiJCIsInZhbCIsInB1bnRvcyIsInB1bnRvc19wcmVtaXVtIiwicHJvcCIsInNlbGVjY2lvbl9hcnRpY3VsbyIsImlkIiwibWFyY2EiLCJydWJybyIsInByZWNpb192ZW50YSIsInByZWNpb19jcmVkaXRvIiwicHJlY2lvX2RlYml0byIsInByZWNpb19jb21wcmEiLCJzdG9jayIsInByb3ZlZWRvciIsIm5vX3N1bWFfY2FqYSIsImNhbnRpZGFkIiwicHJvbXB0IiwicHJlY2lvX2VudmlhciIsImlzIiwic3dhbCIsInRpdGxlIiwidGV4dCIsImljb24iLCJidXR0b25zIiwiZGFuZ2VyTW9kZSIsInRoZW4iLCJ3aWxsRGVsZXRlIiwiY2FsY3VsYXJfdG90YWwiLCJhZnRlciIsInRvU3RyaW5nIiwiZ3VhcmRhcl9jb21wcmEiLCJub19zdW1hciIsImNhbmplX3NvY2lvcyIsImNhbmplX2NyZWRpdG8iLCJpZF9kZXNjdWVudG9fZGVfc29jaW8iLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGEiLCJ2ZW50YXMiLCJKU09OIiwic3RyaW5naWZ5IiwiZmVjaGEiLCJpZF9zb2NpbyIsInBvcmNlbnRhamVfZGVzY3VlbnRvIiwicHJlY2lvX3ZlbnRhX3RvdGFsIiwicHVudG9zX3NvY2lvcyIsImNyZWRpdG9zX3NvY2lvcyIsImNzcmZtaWRkbGV3YXJldG9rZW4iLCJzdWNjZXNzIiwiUE5vdGlmeSIsImh0bWwiLCJlbXB0eSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImlkX3ZlbnRhIiwia2V5cHJlc3MiLCJlIiwid2hpY2giLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwibm9tYnJlIiwib2JqIiwicHVzaCIsInBhcnNlRmxvYXQiLCJyZXBsYWNlIiwicmVwcmVzZW50YXIiLCJ0b0ZpeGVkIiwiY2FsY3VsYXJfdGlwb19wYWdvIiwiZm9ybWFfcGFnb19wYXJhbWV0cm8iLCJoaWRlIiwiZWxpbWluYXJfYXJ0aWN1bG8iLCJzcGxpY2UiLCJyZW1vdmUiLCJhZ3JlZ2FyX2NhbnRpZGFkIiwiY29udGFkb3IiLCJwcmVjaW8iLCJjYW50aWRhZF90YWJsYSIsInJvd3MiLCJjZWxscyIsIml0ZW0iLCJpbm5lckhUTUwiLCJwYXJzZUludCIsImNoYW5nZSIsImNoZWNrZWQiLCJjbGljayIsImZvY3Vzb3V0IiwiY2FsY3VsYXJfdnVlbHRvIiwia2V5Q29kZSIsInBhZ28iLCJkZXNjdWVudG8iLCJkZXNjdWVudG9fc29jaW8iLCJjcmVkaXRvX3NvY2lvIiwidnVlbHRvIiwiZGVzY3VlbnRvX3RvdGFsIiwicmVwcmVzZW50YXIyIiwiY2FsY3VsYXJfYXVtZW50byIsInBvcmNlbnRhamUiLCJhdW1lbnRvIiwidG90YWxfYXVtZW50YWRvIl0sIm1hcHBpbmdzIjoiQUFBWTtBQUNBLElBQUlBLFFBQVEsR0FBWjtBQUNBLElBQUlDLHNCQUFzQixHQUExQjtBQUNBLElBQUlDLFlBQVksR0FBaEI7QUFDQSxJQUFJQyxpQkFBaUIsQ0FBckI7QUFDQSxJQUFJQyxxQkFBcUIsQ0FBekI7QUFDQSxJQUFJQyxxQkFBcUIsRUFBekI7QUFDQSxJQUFJQyxhQUFhLEVBQWpCO0FBQ0E7QUFDQUMsU0FBU0MsY0FBVCxDQUF3QixhQUF4QixFQUF1Q0MsS0FBdkMsQ0FBNkNDLE9BQTdDLEdBQXVELE1BQXZEO0FBQ0FILFNBQVNDLGNBQVQsQ0FBd0IsZUFBeEIs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O0FBQ0gsQ0FGRDtBQUdBMUYsRUFBRSxxQkFBRixFQUF5QjBELFFBQXpCLENBQWtDLFlBQVc7QUFDekMsUUFBSUMsRUFBRWdDLE9BQUYsSUFBYSxFQUFqQixFQUFxQjtBQUNqQkQ7QUFDSDtBQUNKLENBSkQ7QUFLQTFGLEVBQUUsZ0JBQUYsRUFBb0IwRCxRQUFwQixDQUE2QixVQUFTQyxDQUFULEVBQVk7QUFDckMsUUFBSUEsRUFBRWdDLE9BQUYsSUFBYSxFQUFqQixFQUFxQjtBQUNqQlE7QUFDSDtBQUNKLENBSkQ7QUFLQSxJQUFJQSxtQkFBbUIsWUFBVTtBQUM3QjtBQUNBLFFBQUlDLGFBQWFwRyxFQUFFLGdCQUFGLEVBQW9CQyxHQUFwQixFQUFqQjtBQUNBZCx5QkFBcUJpSCxVQUFyQjtBQUNBLFFBQUlDLFVBQVVsQyxXQUFXcEYsS0FBWCxJQUFvQnNHLFNBQVNlLFVBQVQsQ0FBcEIsR0FBeUMsR0FBdkQ7QUFDQSxRQUFJRSxrQkFBa0JuQyxXQUFXcEYsS0FBWCxJQUFvQm9GLFdBQVdrQyxPQUFYLENBQTFDO0FBQ0EsUUFBSWhDLGNBQWNpQyxnQkFBZ0JoQyxPQUFoQixDQUF3QixDQUF4QixDQUFsQjtBQUNBdEUsTUFBRSxtQkFBRixFQUF1Qm9ELElBQXZCLENBQTRCLE9BQU9pQixZQUFZdkMsUUFBWixHQUF1QnNDLE9BQXZCLENBQStCLEdBQS9CLEVBQW9DLEdBQXBDLENBQW5DO0FBQ0gsQ0FSRCIsImZpbGUiOiIzMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiAgICAgICAgICAgIC8qIC0tLS0gdmFyaWFibGVzIGdsb2JhbGVzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciB0b3RhbCA9IDAuMDtcbiAgICAgICAgICAgIHZhciB0b3RhbF9jb25fZGVzY3VlbnRvID0gMC4wO1xuICAgICAgICAgICAgdmFyIHJlc3VsdGFkbyA9IDAuMDtcbiAgICAgICAgICAgIHZhciBjb250YWRvcl90YWJsYSA9IDA7XG4gICAgICAgICAgICB2YXIgY3JlZGl0b19wb3JjZW50YWplID0gMDtcbiAgICAgICAgICAgIHZhciBhcnRpY3Vsb3NfdmVuZGlkb3MgPSBbXTtcbiAgICAgICAgICAgIHZhciBmb3JtYV9wYWdvID0gJyc7XG4gICAgICAgICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgZWZlY3Rpdm8gLS0tLSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBjcsOpZGl0byAtLS0tICovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BvcmNlbnRhamUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9jcmVkaXRvX3RvdGFsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBkZXNjdWVudG8gLS0tLSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9kZXNjdWVudG8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgLyogLS0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBsb3Mgc29jaW9zIC0tLSovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3B1bnRvc19zb2Npb3MnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Zvcm1fY2FuamVhcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9lZmVjdGl2bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAgICAgICAgIC8qIC0tLS0tLS0tLS0tIGhhYmlsaXRhciBjYW1wb3MgcGFyYSBjYW5qZSBkZSBwdW50b3MgZW4gc29jaW8gLS0tKi9cbiAgICAgICAgICAgIGhhYmlsaXRhcl9jYW1wb3NfY2FuamUgPSBmdW5jdGlvbihzb2Npbyl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc29jaW8pXG4gICAgICAgICAgICAgICAgaWYgKHNvY2lvLnRpcG9fY2xpZW50ZS5kZXNjcmlwY2lvbiA9PSAnU29jaW8gTm9ybWFsJyl7XG4gICAgICAgICAgICAgICAgICAkKCcjaWRfcHVudG9zX3NvY2lvcycpLnZhbChzb2Npby5wdW50b3MpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgJCgnI2lkX3B1bnRvc19zb2Npb3MnKS52YWwoc29jaW8ucHVudG9zX3ByZW1pdW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3B1bnRvc19zb2Npb3MnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAkKCcjaWRfZGVzY3VlbnRvX2RlX3NvY2lvJykucHJvcCggXCJjaGVja2VkXCIsIHRydWUgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgICAgICAgdmFyIHNlbGVjY2lvbl9hcnRpY3VsbyA9IGZ1bmN0aW9uKGlkLCBkZXNjcmlwY2lvbiwgbWFyY2EsIHJ1YnJvLCBwcmVjaW9fdmVudGEsIHByZWNpb19jcmVkaXRvLCBwcmVjaW9fZGViaXRvLCBwcmVjaW9fY29tcHJhLCBzdG9jaywgcHJvdmVlZG9yLCBub19zdW1hX2NhamEpe1xuICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZCA9IHByb21wdChcIkluZ3Jlc2UgbGEgY2FudGlkYWRcIiwgXCJcIik7XG5cbiAgICAgICAgICAgICAgICB2YXIgcHJlY2lvX2VudmlhciA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChjYW50aWRhZCAhPSBudWxsICYmIGNhbnRpZGFkICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZm9ybWFfcGFnbyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdlZmVjdGl2byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Rlc2N1ZW50byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NyZWRpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fY3JlZGl0bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RlYml0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb19kZWJpdG87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChub19zdW1hX2NhamEpe1xuICAgICAgICAgICAgICAgICAgICAgIGlmICghKCQoJyNpZF9ub19zdW1hcicpLmlzKCc6Y2hlY2tlZCcpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbCDDoXJ0aWN1bG8gZXN0YSB0aWxkYWRvIHBhcmEgbm8gc3VtYXJzZSBhIGNhamEuIFBlcm8gbm8gc2UgdGlsZG8gZW4gZWwgZm9ybXVsYXJpbyBkZSB2ZW50YXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkRlc2VhIHF1ZSBlbCBzaXN0ZW1hIHRpbGRlIGVsIGNoZWNrIHBvciB1c3RlZCA/IFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwiaW5mb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFsnTm8sIHBvcnF1ZSBxdWllcm8gc3VtYXJsbyBhIGNhamEnLCAnU2ksIHBvcnF1ZSBubyBsbyB2b3kgYSBzdW1hciBhIGNhamEnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYW5nZXJNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigod2lsbERlbGV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aWxsRGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbm9fc3VtYXInKS5wcm9wKCBcImNoZWNrZWRcIiwgdHJ1ZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKGNhbnRpZGFkLCBpZCwgcHJlY2lvX2Vudmlhcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhZG9yX3RhYmxhICs9MTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RhYmxhX2FydGljdWxvcyB0cjpsYXN0JykuYWZ0ZXIoJzx0ciBpZD1cInRyXycgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJ1wiPjx0ZD4nICsgY2FudGlkYWQgKyAnPC90ZD4nICsgJzx0ZD4nICsgZGVzY3JpcGNpb24gKyAnPC90ZD4nICsgJzx0ZD4gJCcgKyBwcmVjaW9fZW52aWFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgICc8dGQ+PGEgb25jbGljaz1cImVsaW1pbmFyX2FydGljdWxvKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgY2FudGlkYWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsnKVwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+IDwvYT48L3RkPjwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGd1YXJkYXJfY29tcHJhID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0b3RhbF9jb25fZGVzY3VlbnRvID0gcmVzdWx0YWRvO1xuICAgICAgICAgICAgICAgIHZhciBub19zdW1hciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBjYW5qZV9zb2Npb3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgY2FuamVfY3JlZGl0byA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBpZF9kZXNjdWVudG9fZGVfc29jaW8gPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fZ3VhcmRhcl9jb21wcmEnKS5wcm9wKCBcImRpc2FibGVkXCIsIHRydWUgKTtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX25vX3N1bWFyJykuaXMoJzpjaGVja2VkJykpe25vX3N1bWFyID0gdHJ1ZTt9XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9jYW5qZV9zb2Npb3MnKS5pcygnOmNoZWNrZWQnKSl7Y2FuamVfc29jaW9zID0gdHJ1ZTt9XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9jYW5qZV9jcmVkaXRvJykuaXMoJzpjaGVja2VkJykpe2NhbmplX2NyZWRpdG8gPSB0cnVlO31cbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2Rlc2N1ZW50b19kZV9zb2NpbycpLmlzKCc6Y2hlY2tlZCcpKXtpZF9kZXNjdWVudG9fZGVfc29jaW8gPSB0cnVlO31cblxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy92ZW50YXMvYWpheC92ZW50YXMvYWx0YS8nLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlbnRhczogSlNPTi5zdHJpbmdpZnkoYXJ0aWN1bG9zX3ZlbmRpZG9zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZlY2hhOiAkKCcjaWRfZmVjaGEnKS52YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZF9zb2NpbzogJCgnI2lkX3NvY2lvJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3JjZW50YWplX2Rlc2N1ZW50bzogJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxfY29uX2Rlc2N1ZW50bzogdG90YWxfY29uX2Rlc2N1ZW50byxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb192ZW50YV90b3RhbDogdG90YWwudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hX3BhZ286IGZvcm1hX3BhZ28sXG4gICAgICAgICAgICAgICAgICAgICAgICBub19zdW1hcjogbm9fc3VtYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwdW50b3Nfc29jaW9zOiAkKCcjaWRfcHVudG9zX3NvY2lvcycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuamVfc29jaW9zOiBjYW5qZV9zb2Npb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVkaXRvc19zb2Npb3M6ICQoJyNpZF9jcmVkaXRvX3NvY2lvJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5qZV9jcmVkaXRvOiBjYW5qZV9jcmVkaXRvLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplOiBjcmVkaXRvX3BvcmNlbnRhamUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZF9kZXNjdWVudG9fZGVfc29jaW86IGlkX2Rlc2N1ZW50b19kZV9zb2NpbyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzcmZtaWRkbGV3YXJldG9rZW46ICQoXCJpbnB1dFtuYW1lPWNzcmZtaWRkbGV3YXJldG9rZW5dXCIpLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2Vzcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBOb3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Npc3RlbWEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLnN1Y2Nlc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgMC4wJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RhYmxhX2FydGljdWxvcycpLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3ZlbnRhcy90aWNrZXQvJyArIGRhdGEuaWRfdmVudGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgIC8qIC0tLS0gZnVuY2lvbiBwYXJhIGVsIGxlY3RvciBkZSBjb2RpZ28gZGUgYmFycmFzIC0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS5rZXlwcmVzcyhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMyl7XG5cbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy92ZW50YXMvYWpheC9jb2RpZ28vYXJ0aWN1bG8vJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29kaWdvX2FydGljdWxvJzogJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRWwgw6FydGljdWxvIG5vIGZ1ZSBlbmNvbnRyYWRvIG8gZWwgc3RvY2sgZXMgMC4gVmVyaWZpcXVlIGVuIGxhIGxpc3RhIGRlIMOhcnRpY3Vsb3MgbG9zIGRhdG9zIGNvcnJlc3BvbmRpZW50ZXMuIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJEZXNlYSByZWFsaXphciBlbCBwZWRpZG8gPyBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKi50aGVuKCh3aWxsRGVsZXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lsbERlbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2FsKFwiUG9vZiEgWW91ciBpbWFnaW5hcnkgZmlsZSBoYXMgYmVlbiBkZWxldGVkIVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dhbChcIkVsIHBlZGlkbyBoYSBzaWRvIGVudmlhZG9cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7Ki9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJlY2lvX2VudmlhciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGZvcm1hX3BhZ28pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWZlY3Rpdm8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Rlc2N1ZW50byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3JlZGl0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX2NyZWRpdG87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZWJpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb19kZWJpdG87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhZG9yX3RhYmxhICs9MTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdG90YWwoJzEnLCBkYXRhLmlkLCBwcmVjaW9fZW52aWFyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEubm9fc3VtYV9jYWphKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISgkKCcjaWRfbm9fc3VtYXInKS5pcygnOmNoZWNrZWQnKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRWwgw6FydGljdWxvIGVzdGEgdGlsZGFkbyBwYXJhIG5vIHN1bWFyc2UgYSBjYWphLiBQZXJvIG5vIHNlIHRpbGRvIGVuIGVsIGZvcm11bGFyaW8gZGUgdmVudGFzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJEZXNlYSBxdWUgZWwgc2lzdGVtYSB0aWxkZSBlbCBjaGVjayBwb3IgdXN0ZWQgPyBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBcImluZm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbJ05vLCBwb3JxdWUgcXVpZXJvIHN1bWFybG8gYSBjYWphJywgJ1NpLCBwb3JxdWUgbm8gbG8gdm95IGEgc3VtYXIgYSBjYWphJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGFuZ2VyTW9kZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKHdpbGxEZWxldGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lsbERlbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX25vX3N1bWFyJykucHJvcCggXCJjaGVja2VkXCIsIHRydWUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zIHRyOmxhc3QnKS5hZnRlcignPHRyIGlkPVwidHJfJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnXCI+PHRkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY2FudGlkYWQgKyAnPC90ZD4nICsgJzx0ZD4nICsgZGF0YS5ub21icmUgKyAnPC90ZD4nICsgJzx0ZD4gJCcgKyBwcmVjaW9fZW52aWFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJzwvdGQ+JyArICc8dGQ+PGEgb25jbGljaz1cImFncmVnYXJfY2FudGlkYWQoJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBkYXRhLmlkICsgJywnICsgcHJlY2lvX2VudmlhciArICcpXCIgJyArICdjbGFzcz1cImJ0biBidG4taW5mbyBidG4teHNcIj48aSBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2k+IDwvYT48YSBvbmNsaWNrPVwiZWxpbWluYXJfYXJ0aWN1bG8oJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBkYXRhLmNhbnRpZGFkICsgJywnICsgcHJlY2lvX2VudmlhciArICcpXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3M9XCJidG4gYnRuLWRhbmdlciBidG4teHNcIj48aSBjbGFzcz1cImZhIGZhLXRyYXNoXCI+PC9pPiA8L2E+PC90ZD48L3RyPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0tIGZ1bmNpb24gcGFyYSBlbCBsZWN0b3IgZGUgY29kaWdvIGRlIGJhcnJhcyAtLS0gKi9cblxuICAgIC8qIC0tLS0tLS0tLS0gRXN0YSBmdW5jaW9uIGNhbGN1bGEgZWwgdG90YWwgeSBsYSBjb2xvY2FcbiAgICAqKiogLS0tLS0tLS0tLSBlbiBsYSBwYXJ0ZSBpbmZlcmlvciBkZWwgZm9ybXVsYXJpbyBkZSB2ZW50YXMgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3RvdGFsID0gZnVuY3Rpb24oY2FudGlkYWQsIGlkLCBwcmVjaW9fdmVudGEpe1xuICAgIC8qIC0tLS0gQXJtYXIgdW4gYXJyYXkgY29uIGxvcyBhcnRpY3Vsb3MgdmVuZGlkb3MgLS0tLS0gKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBvYmpbJ2lkJ10gPSBpZDtcbiAgICAgICAgICAgICAgICAgICAgb2JqWydjYW50aWRhZCddID0gY2FudGlkYWQ7XG4gICAgICAgICAgICAgICAgICAgIGFydGljdWxvc192ZW5kaWRvcy5wdXNoKG9iaik7XG4gICAgLyogLS0tLSBBcm1hciB1biBhcnJheSBjb24gbG9zIGFydGljdWxvcyB2ZW5kaWRvcyAtLS0tLSAqL1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcmVjaW9fdmVudGEpXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IChwYXJzZUZsb2F0KGNhbnRpZGFkKSAqIHBhcnNlRmxvYXQocHJlY2lvX3ZlbnRhLnRvU3RyaW5nKCkucmVwbGFjZSgnLCcsICcuJykpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWwudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0tLS0tLS0gRXN0YSBmdW5jaW9uIGNhbGN1bGEgZWwgdG90YWwgeSBsYSBjb2xvY2FcbiAgICAtLS0tLS0tLS0tIGVuIGxhIHBhcnRlIGluZmVyaW9yIGRlbCBmb3JtdWxhcmlvIGRlIHZlbnRhcyAtLS0tICovXG5cbiAgICAvKiAtLS0tIGRldGVjdGFyIHF1ZSB0aXBvIGRlIHBhZ28gZXMgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3RpcG9fcGFnbyA9IGZ1bmN0aW9uKGZvcm1hX3BhZ29fcGFyYW1ldHJvKXtcbiAgICAgICAgICAgICAgICAkKCcjaWRfZmVjaGEnKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2J1dHRvbl9idXNjYXInKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2J1c2Nhcl9zb2NpbycpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfYnV0dG9uX2d1YXJkYXJfY29tcHJhJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9ub19zdW1hcicpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAvLyBQb25nbyBkaXNhYmxlZCBsYSBzZWxlY2Npb24gZGUgbGEgZm9ybWEgZGUgcGFnb1xuICAgICAgICAgICAgICAgIGZvcm1hX3BhZ28gPSBmb3JtYV9wYWdvX3BhcmFtZXRybztcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnZWZlY3Rpdm8nKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2kgZXMgZWZlY3Rpdm8gaGFiaWxpdG8gc3VzIHJlc3BlY3Rpdm9zIHBhZ29zXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcGFnbycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3Z1ZWx0bycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gPT0gJ2Rlc2N1ZW50bycpe1xuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBkZXNjdWVudG8gaGFiaWxpdG8gc3VzIHJlc3BlY3Rpdm9zIHBhZ29zIHkgZGVzY3VlbnRvXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcGFnbycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3Z1ZWx0bycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2Rlc2N1ZW50bycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gPT0gJ2NyZWRpdG8nKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2kgZXMgY3JlZGl0byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgYXVtZW50b3NcbiAgICAgICAgICAgICAgICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BvcmNlbnRhamUnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9jcmVkaXRvX3RvdGFsJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIGhhZ28gaW52aXNpYmxlcyBsYXMgaW1hZ2VuZXMgZGUgdGlwb3MgZGUgcGFnb3NcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZWZlY3Rpdm8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2VmZWN0aXZvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2NyZWRpdG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZGViaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZWJpdG8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZGVzY3VlbnRvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIGRldGVjdGFyIHF1ZSB0aXBvIGRlIHBhZ28gZXMgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBFbGltaW5hciB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG4gICAgICAgICAgICB2YXIgZWxpbWluYXJfYXJ0aWN1bG8gPSBmdW5jdGlvbihpZCwgY2FudGlkYWQsIHByZWNpb19lbnZpYXIpe1xuXG4gICAgICAgICAgICAgICAgYXJ0aWN1bG9zX3ZlbmRpZG9zLnNwbGljZShpZCwgMSk7XG4gICAgICAgICAgICAgICAgJCgnI3RyXycgKyBpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgdG90YWwgLT0gKHBhcnNlRmxvYXQoY2FudGlkYWQpICogcGFyc2VGbG9hdChwcmVjaW9fZW52aWFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLCcsICcuJykpKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB0b3RhbC50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuXG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gRWxpbWluYXIgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBBZ3JlZ2FyIGNhbnRpZGFkIGEgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGFncmVnYXJfY2FudGlkYWQgPSBmdW5jdGlvbihjb250YWRvciwgaWQsIHByZWNpbyl7XG4gICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkID0gcHJvbXB0KFwiSW5ncmVzZSBsYSBjYW50aWRhZFwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FudGlkYWQgIT0gbnVsbCAmJiBjYW50aWRhZCAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWRfdGFibGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkX3RhYmxhX2FydGljdWxvc1wiKS5yb3dzW2NvbnRhZG9yICsgMV0uY2VsbHMuaXRlbSgwKS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRfdGFibGFfYXJ0aWN1bG9zXCIpLnJvd3NbY29udGFkb3IgKyAxXS5jZWxscy5pdGVtKDApLmlubmVySFRNTCA9IHBhcnNlSW50KGNhbnRpZGFkX3RhYmxhKSArIHBhcnNlSW50KGNhbnRpZGFkKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdG90YWwoY2FudGlkYWQsIGlkLCBwcmVjaW8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBBZ3JlZ2FyIGNhbnRpZGFkIGEgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuXG4gICAgLyotLS0tLS0gY3VhbmRvIHNlbGVjY2lvbmEgZWwgY2FuamUgc2UgYWdyZWdhIGxhcyBjYWphcyBkZSB0ZXh0byAtLS0tKi9cbiAgICAkKFwiI2lkX2NhbmplX3NvY2lvc1wiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMuY2hlY2tlZCkge1xuICAgICAgICAgICAgJCgnI2lkX2NhbmplX2NyZWRpdG8nKS5wcm9wKCBcImNoZWNrZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9mb3JtX2NhbmplYXInKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9mb3JtX2VmZWN0aXZvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9jYW5qZWFyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoXCIjaWRfY2FuamVfY3JlZGl0b1wiKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMuY2hlY2tlZCkge1xuICAgICAgICAgICAgJCgnI2lkX2NhbmplX3NvY2lvcycpLnByb3AoIFwiY2hlY2tlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Zvcm1fZWZlY3Rpdm8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9mb3JtX2NhbmplYXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9mb3JtX2VmZWN0aXZvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSB2dWVsdG9zIHNpIGVzIGVmZWN0aXZvIC0tLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wYWdvJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5jbGljayggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGRlc2N1ZW50byBwYXJhIHNvY2lvc1xuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS5jbGljayggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLSBwb3IgY2FkYSBldmVudG8gY2FsY3VsYXIgZWwgdnVlbHRvIC0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX3BhZ28nKS52YWwoKSA9PSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wYWdvJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG9fc29jaW8nKS5mb2N1c291dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBpZiAoJCgnI2lkX2NyZWRpdG9fc29jaW8nKS52YWwoKSA9PSAnJyl7XG4gICAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0b19zb2NpbycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykua2V5cHJlc3MoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoKSA9PSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcjaWRfY3JlZGl0b19zb2NpbycpLmtleXByZXNzKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9jcmVkaXRvX3NvY2lvJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG9fc29jaW8nKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3Z1ZWx0byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLyogLS0tLS0gY2FsY3VsYSBzaSBlcyBlZmVjdGl2byBlbCB2dWVsdG8gLS0tLS0gKi9cblxuICAgICAgICAgICAgICAgIHZhciBwYWdvID0gJCgnI2lkX3BhZ28nKS52YWwoKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3VlbnRvID0gJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHZhciBkZXNjdWVudG9fc29jaW8gPSAkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHZhciBjcmVkaXRvX3NvY2lvID0gJCgnI2lkX2NyZWRpdG9fc29jaW8nKS52YWwoKTtcblxuICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSBwYXJzZUZsb2F0KHBhZ28pIC0gcGFyc2VGbG9hdCh0b3RhbCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGVzY3VlbnRvX3NvY2lvKVxuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfY2FuamVfc29jaW9zJykuaXMoJzpjaGVja2VkJykpe1xuICAgICAgICAgICAgICAgICAgaWYgKGRlc2N1ZW50b19zb2NpbyAhPSAnMCcpIHsgLy8gZGVzY3VlbnRvIHBhcmEgc29jaW9zXG4gICAgICAgICAgICAgICAgICAgICAgZGVzY3VlbnRvX3RvdGFsID0gKHBhcnNlRmxvYXQodG90YWwpICogcGFyc2VGbG9hdChkZXNjdWVudG9fc29jaW8pKSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHRhZG8gPSAwLjA7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgLSBwYXJzZUZsb2F0KGRlc2N1ZW50b190b3RhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHZ1ZWx0byA9ICBwYXJzZUZsb2F0KHBhZ28pIC0gcGFyc2VGbG9hdChyZXN1bHRhZG8pO1xuICAgICAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhcjIgPSByZXN1bHRhZG8udG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhcjIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfY2FuamVfY3JlZGl0bycpLmlzKCc6Y2hlY2tlZCcpKXtcbiAgICAgICAgICAgICAgICAgIGlmIChjcmVkaXRvX3NvY2lvICE9ICcwJykgeyAvLyBjcmVkaXRvIHBhcmEgc29jaW9zXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gMC4wO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IHBhcnNlRmxvYXQodG90YWwpIC0gcGFyc2VGbG9hdChjcmVkaXRvX3NvY2lvKTtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gIHBhcnNlRmxvYXQocGFnbykgLSBwYXJzZUZsb2F0KHJlc3VsdGFkbyk7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyMiA9IHJlc3VsdGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyMi50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9kZXNjdWVudG9fZGVfc29jaW8nKS5pcygnOmNoZWNrZWQnKSl7XG4gICAgICAgICAgICAgICAgICByZXN1bHRhZG8gPSAwLjA7XG4gICAgICAgICAgICAgICAgICB2YXIgZGVzY3VlbnRvX3NvY2lvID0gKHBhcnNlRmxvYXQodG90YWwpICogNSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICByZXN1bHRhZG8gPSBwYXJzZUZsb2F0KHRvdGFsKSAtIHBhcnNlRmxvYXQoZGVzY3VlbnRvX3NvY2lvKTtcbiAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSAgcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQocmVzdWx0YWRvKTtcbiAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhcjIgPSByZXN1bHRhZG8udG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyMi50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGVzY3VlbnRvKVxuICAgICAgICAgICAgICAgIGlmIChkZXNjdWVudG8gIT0gJzAnKSB7IC8vIGRlc2N1ZW50byBleHRyYW9yZGluYXJpb1xuICAgICAgICAgICAgICAgICAgICBkZXNjdWVudG9fdG90YWwgPSAocGFyc2VGbG9hdCh0b3RhbCkgKiBwYXJzZUZsb2F0KGRlc2N1ZW50bykpIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRhZG8gPSAwLjA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IHBhcnNlRmxvYXQodG90YWwpIC0gcGFyc2VGbG9hdChkZXNjdWVudG9fdG90YWwpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gIHBhcnNlRmxvYXQocGFnbykgLSBwYXJzZUZsb2F0KHJlc3VsdGFkbyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhcjIgPSByZXN1bHRhZG8udG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2dWVsdG8pXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codnVlbHRvLnRvRml4ZWQoMikpXG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdnVlbHRvLnRvRml4ZWQoMik7XG5cbiAgICAgICAgICAgICAgICAkKCcjaWRfdnVlbHRvJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIHZ1ZWx0b3Mgc2kgZXMgZWZlY3Rpdm8gLS0tLSAqL1xuXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgYXVtZW50byBzaSBlcyBjcmVkaXRvIC0tLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wb3JjZW50YWplJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0gcG9yIGNhZGEgZXZlbnRvIGNhbGN1bGFyIGVsIHZ1ZWx0byAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfYXVtZW50bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5rZXlwcmVzcyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl9hdW1lbnRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfYXVtZW50byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLyogLS0tLS0gY2FsY3VsYSBzaSBlcyBjcmVkaXRvIGVsIGF1bWVudG8gLS0tLS0gKi9cbiAgICAgICAgICAgICAgICB2YXIgcG9yY2VudGFqZSA9ICQoJyNpZF9wb3JjZW50YWplJykudmFsKCk7XG4gICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplID0gcG9yY2VudGFqZTtcbiAgICAgICAgICAgICAgICB2YXIgYXVtZW50byA9IHBhcnNlRmxvYXQodG90YWwpICogcGFyc2VJbnQocG9yY2VudGFqZSkvMTAwO1xuICAgICAgICAgICAgICAgIHZhciB0b3RhbF9hdW1lbnRhZG8gPSBwYXJzZUZsb2F0KHRvdGFsKSArIHBhcnNlRmxvYXQoYXVtZW50byk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWxfYXVtZW50YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG9fdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///30\n");

/***/ })

/******/ });