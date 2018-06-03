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
/******/ 	var hotCurrentHash = "13643098b2f34db4c9b5"; // eslint-disable-line no-unused-vars
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

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar total_con_descuento = 0.0;\nvar resultado = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n/* --- hacer invisible los campos que solo son para descuento ---- */\ndocument.getElementById('id_div_descuento').style.display = 'none';\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_debito, precio_compra, stock, proveedor) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'descuento':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_credito;\n                break;\n            case 'debito':\n                precio_enviar = precio_debito;\n                break;\n        };\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    total_con_descuento = resultado;\n    var no_sumar = false;\n    $('#id_button_guardar_compra').prop(\"disabled\", true);\n    if ($('#id_no_sumar').is(':checked')) {\n        no_sumar = true;\n    }\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            id_socio: $('#id_socio').val(),\n            porcentaje_descuento: $('#id_monto_descuento').val(),\n            total_con_descuento: total_con_descuento,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            no_sumar: no_sumar,\n            credito_porcentaje: credito_porcentaje,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                if (Object.keys(data).length == 0) {\n                    swal({\n                        title: \"El árticulo no fue encontrado o el stock es 0. Verifique en la lista de árticulos los datos correspondientes. \",\n                        text: \"Desea realizar el pedido ? \",\n                        icon: \"warning\",\n                        buttons: true,\n                        dangerMode: true\n                    });\n                    /*.then((willDelete) => {\n                      if (willDelete) {\n                        swal(\"Poof! Your imaginary file has been deleted!\", {\n                          icon: \"success\",\n                        });\n                      } else {\n                        swal(\"El pedido ha sido enviado\");\n                      }\n                    });*/\n                } else {\n\n                    var precio_enviar = '';\n                    switch (forma_pago) {\n                        case 'efectivo':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'descuento':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'credito':\n                            precio_enviar = data.precio_credito;\n                            break;\n                        case 'debito':\n                            precio_enviar = data.precio_debito;\n                            break;\n                    };\n                    contador_tabla += 1;\n                    calcular_total('1', data.id, precio_enviar);\n                    $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.nombre + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n                }\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n    console.log(precio_venta);\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#buscar_socio').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    $('#id_no_sumar').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n    };\n    if (forma_pago == 'descuento') {\n        // si es descuento habilito sus respectivos pagos y descuento\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n    if (forma_pago != 'descuento') {\n        $('#id_descuento').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_monto_descuento').click(function () {\n    if ($('#id_monto_descuento').val() == '0') {\n        $('#id_monto_descuento').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_monto_descuento').focusout(function () {\n    if ($('#id_monto_descuento').val() == '') {\n        $('#id_monto_descuento').val('0');\n    }\n});\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var descuento = $('#id_monto_descuento').val();\n    if (descuento != '0') {\n        descuento_total = parseFloat(total) * parseFloat(descuento) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    } else {\n        var vuelto = parseFloat(pago) - parseFloat(total);\n    }\n    var representar = vuelto.toFixed(2);\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_monto_descuento').focusout(function () {\n    calcular_vuelto();\n});\n$('#id_monto_descuento').keypress(function () {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsInRvdGFsX2Nvbl9kZXNjdWVudG8iLCJyZXN1bHRhZG8iLCJjb250YWRvcl90YWJsYSIsImNyZWRpdG9fcG9yY2VudGFqZSIsImFydGljdWxvc192ZW5kaWRvcyIsImZvcm1hX3BhZ28iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5Iiwic2VsZWNjaW9uX2FydGljdWxvIiwiaWQiLCJkZXNjcmlwY2lvbiIsIm1hcmNhIiwicnVicm8iLCJwcmVjaW9fdmVudGEiLCJwcmVjaW9fY3JlZGl0byIsInByZWNpb19kZWJpdG8iLCJwcmVjaW9fY29tcHJhIiwic3RvY2siLCJwcm92ZWVkb3IiLCJjYW50aWRhZCIsInByb21wdCIsInByZWNpb19lbnZpYXIiLCJjYWxjdWxhcl90b3RhbCIsIiQiLCJhZnRlciIsInRvU3RyaW5nIiwiZ3VhcmRhcl9jb21wcmEiLCJub19zdW1hciIsInByb3AiLCJpcyIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInZlbnRhcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJmZWNoYSIsInZhbCIsImlkX3NvY2lvIiwicG9yY2VudGFqZV9kZXNjdWVudG8iLCJwcmVjaW9fdmVudGFfdG90YWwiLCJjc3JmbWlkZGxld2FyZXRva2VuIiwic3VjY2VzcyIsIlBOb3RpZnkiLCJ0aXRsZSIsInRleHQiLCJodG1sIiwiZW1wdHkiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJpZF92ZW50YSIsImtleXByZXNzIiwiZSIsIndoaWNoIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsInN3YWwiLCJpY29uIiwiYnV0dG9ucyIsImRhbmdlck1vZGUiLCJub21icmUiLCJvYmoiLCJwdXNoIiwiY29uc29sZSIsImxvZyIsInBhcnNlRmxvYXQiLCJyZXBsYWNlIiwicmVwcmVzZW50YXIiLCJ0b0ZpeGVkIiwiY2FsY3VsYXJfdGlwb19wYWdvIiwiZm9ybWFfcGFnb19wYXJhbWV0cm8iLCJoaWRlIiwiZWxpbWluYXJfYXJ0aWN1bG8iLCJzcGxpY2UiLCJyZW1vdmUiLCJhZ3JlZ2FyX2NhbnRpZGFkIiwiY29udGFkb3IiLCJwcmVjaW8iLCJjYW50aWRhZF90YWJsYSIsInJvd3MiLCJjZWxscyIsIml0ZW0iLCJpbm5lckhUTUwiLCJwYXJzZUludCIsImNsaWNrIiwiZm9jdXNvdXQiLCJjYWxjdWxhcl92dWVsdG8iLCJrZXlDb2RlIiwicGFnbyIsImRlc2N1ZW50byIsImRlc2N1ZW50b190b3RhbCIsInZ1ZWx0byIsInJlcHJlc2VudGFyMiIsImNhbGN1bGFyX2F1bWVudG8iLCJwb3JjZW50YWplIiwiYXVtZW50byIsInRvdGFsX2F1bWVudGFkbyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDWSxJQUFJQSxRQUFRLEdBQVo7QUFDQSxJQUFJQyxzQkFBc0IsR0FBMUI7QUFDQSxJQUFJQyxZQUFZLEdBQWhCO0FBQ0EsSUFBSUMsaUJBQWlCLENBQXJCO0FBQ0EsSUFBSUMscUJBQXFCLENBQXpCO0FBQ0EsSUFBSUMscUJBQXFCLEVBQXpCO0FBQ0EsSUFBSUMsYUFBYSxFQUFqQjtBQUNQO0FBQ09DLFNBQVNDLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUNDLEtBQXZDLENBQTZDQyxPQUE3QyxHQUF1RCxNQUF2RDtBQUNBSCxTQUFTQyxjQUFULENBQXdCLGVBQXhCLEVBQXlDQyxLQUF6QyxDQUErQ0MsT0FBL0MsR0FBeUQsTUFBekQ7QUFDUDtBQUNPSCxTQUFTQyxjQUFULENBQXdCLG1CQUF4QixFQUE2Q0MsS0FBN0MsQ0FBbURDLE9BQW5ELEdBQTZELE1BQTdEO0FBQ0FILFNBQVNDLGNBQVQsQ0FBd0Isc0JBQXhCLEVBQWdEQyxLQUFoRCxDQUFzREMsT0FBdEQsR0FBZ0UsTUFBaEU7QUFDUDtBQUNPSCxTQUFTQyxjQUFULENBQXdCLGtCQUF4QixFQUE0Q0MsS0FBNUMsQ0FBa0RDLE9BQWxELEdBQTRELE1BQTVE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MzAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tIHZhcmlhYmxlcyBnbG9iYWxlcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgdG90YWwgPSAwLjA7XG4gICAgICAgICAgICB2YXIgdG90YWxfY29uX2Rlc2N1ZW50byA9IDAuMDtcbiAgICAgICAgICAgIHZhciByZXN1bHRhZG8gPSAwLjA7XG4gICAgICAgICAgICB2YXIgY29udGFkb3JfdGFibGEgPSAwO1xuICAgICAgICAgICAgdmFyIGNyZWRpdG9fcG9yY2VudGFqZSA9IDA7XG4gICAgICAgICAgICB2YXIgYXJ0aWN1bG9zX3ZlbmRpZG9zID0gW107XG4gICAgICAgICAgICB2YXIgZm9ybWFfcGFnbyA9ICcnO1xuICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgZWZlY3Rpdm8gLS0tLSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgLyogLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGNyw6lkaXRvIC0tLS0gKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcG9yY2VudGFqZScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2NyZWRpdG9fdG90YWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgZGVzY3VlbnRvIC0tLS0gKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfZGVzY3VlbnRvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJzsgIFxuXG4gICAgICAgICAgICB2YXIgc2VsZWNjaW9uX2FydGljdWxvID0gZnVuY3Rpb24oaWQsIGRlc2NyaXBjaW9uLCBtYXJjYSwgcnVicm8sIHByZWNpb192ZW50YSwgcHJlY2lvX2NyZWRpdG8sIHByZWNpb19kZWJpdG8sIHByZWNpb19jb21wcmEsIHN0b2NrLCBwcm92ZWVkb3Ipe1xuICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZCA9IHByb21wdChcIkluZ3Jlc2UgbGEgY2FudGlkYWRcIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgdmFyIHByZWNpb19lbnZpYXIgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoY2FudGlkYWQgIT0gbnVsbCAmJiBjYW50aWRhZCAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGZvcm1hX3BhZ28pe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWZlY3Rpdm8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZXNjdWVudG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7ICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3JlZGl0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb19jcmVkaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX2RlYml0bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdG90YWwoY2FudGlkYWQsIGlkLCBwcmVjaW9fZW52aWFyKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGFkb3JfdGFibGEgKz0xO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zIHRyOmxhc3QnKS5hZnRlcignPHRyIGlkPVwidHJfJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnXCI+PHRkPicgKyBjYW50aWRhZCArICc8L3RkPicgKyAnPHRkPicgKyBkZXNjcmlwY2lvbiArICc8L3RkPicgKyAnPHRkPiAkJyArIHByZWNpb19lbnZpYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8L3RkPicgKyAgJzx0ZD48YSBvbmNsaWNrPVwiZWxpbWluYXJfYXJ0aWN1bG8oJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBjYW50aWRhZCArICcsJyArIHByZWNpb19lbnZpYXIgKycpXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT4gPC9hPjwvdGQ+PC90cj4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgZ3VhcmRhcl9jb21wcmEgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRvdGFsX2Nvbl9kZXNjdWVudG8gPSByZXN1bHRhZG87XG4gICAgICAgICAgICAgICAgdmFyIG5vX3N1bWFyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2J1dHRvbl9ndWFyZGFyX2NvbXByYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgdHJ1ZSApO1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbm9fc3VtYXInKS5pcygnOmNoZWNrZWQnKSl7bm9fc3VtYXIgPSB0cnVlO31cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdmVudGFzL2FqYXgvdmVudGFzL2FsdGEvJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZW50YXM6IEpTT04uc3RyaW5naWZ5KGFydGljdWxvc192ZW5kaWRvcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWNoYTogJCgnI2lkX2ZlY2hhJykudmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWRfc29jaW86ICQoJyNpZF9zb2NpbycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9yY2VudGFqZV9kZXNjdWVudG86ICQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsX2Nvbl9kZXNjdWVudG86IHRvdGFsX2Nvbl9kZXNjdWVudG8sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fdmVudGFfdG90YWw6IHRvdGFsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYV9wYWdvOiBmb3JtYV9wYWdvLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9fc3VtYXI6IG5vX3N1bWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplOiBjcmVkaXRvX3BvcmNlbnRhamUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3Mpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaXN0ZW1hJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5zdWNjZXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3VjY2VzcydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckIDAuMCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MnKS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy92ZW50YXMvdGlja2V0LycgKyBkYXRhLmlkX3ZlbnRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAvKiAtLS0tIGZ1bmNpb24gcGFyYSBlbCBsZWN0b3IgZGUgY29kaWdvIGRlIGJhcnJhcyAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykua2V5cHJlc3MoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpe1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy92ZW50YXMvYWpheC9jb2RpZ28vYXJ0aWN1bG8vJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29kaWdvX2FydGljdWxvJzogJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRWwgw6FydGljdWxvIG5vIGZ1ZSBlbmNvbnRyYWRvIG8gZWwgc3RvY2sgZXMgMC4gVmVyaWZpcXVlIGVuIGxhIGxpc3RhIGRlIMOhcnRpY3Vsb3MgbG9zIGRhdG9zIGNvcnJlc3BvbmRpZW50ZXMuIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJEZXNlYSByZWFsaXphciBlbCBwZWRpZG8gPyBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKi50aGVuKCh3aWxsRGVsZXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lsbERlbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2FsKFwiUG9vZiEgWW91ciBpbWFnaW5hcnkgZmlsZSBoYXMgYmVlbiBkZWxldGVkIVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dhbChcIkVsIHBlZGlkbyBoYSBzaWRvIGVudmlhZG9cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7Ki9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJlY2lvX2VudmlhciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGZvcm1hX3BhZ28pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWZlY3Rpdm8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Rlc2N1ZW50byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrOyAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NyZWRpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb19jcmVkaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fZGViaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWRvcl90YWJsYSArPTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKCcxJywgZGF0YS5pZCwgcHJlY2lvX2Vudmlhcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MgdHI6bGFzdCcpLmFmdGVyKCc8dHIgaWQ9XCJ0cl8nICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICdcIj48dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jYW50aWRhZCArICc8L3RkPicgKyAnPHRkPicgKyBkYXRhLm5vbWJyZSArICc8L3RkPicgKyAnPHRkPiAkJyArIHByZWNpb19lbnZpYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgJzx0ZD48YSBvbmNsaWNrPVwiYWdyZWdhcl9jYW50aWRhZCgnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuaWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICsgJ2NsYXNzPVwiYnRuIGJ0bi1pbmZvIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT4gPC9hPjxhIG9uY2xpY2s9XCJlbGltaW5hcl9hcnRpY3VsbygnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuY2FudGlkYWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+IDwvYT48L3RkPjwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLS0gZnVuY2lvbiBwYXJhIGVsIGxlY3RvciBkZSBjb2RpZ28gZGUgYmFycmFzIC0tLSAqL1xuXG4gICAgLyogLS0tLS0tLS0tLSBFc3RhIGZ1bmNpb24gY2FsY3VsYSBlbCB0b3RhbCB5IGxhIGNvbG9jYVxuICAgICoqKiAtLS0tLS0tLS0tIGVuIGxhIHBhcnRlIGluZmVyaW9yIGRlbCBmb3JtdWxhcmlvIGRlIHZlbnRhcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdG90YWwgPSBmdW5jdGlvbihjYW50aWRhZCwgaWQsIHByZWNpb192ZW50YSl7XG4gICAgLyogLS0tLSBBcm1hciB1biBhcnJheSBjb24gbG9zIGFydGljdWxvcyB2ZW5kaWRvcyAtLS0tLSAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgICAgICAgICAgICAgIG9ialsnaWQnXSA9IGlkO1xuICAgICAgICAgICAgICAgICAgICBvYmpbJ2NhbnRpZGFkJ10gPSBjYW50aWRhZDtcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWN1bG9zX3ZlbmRpZG9zLnB1c2gob2JqKTtcbiAgICAvKiAtLS0tIEFybWFyIHVuIGFycmF5IGNvbiBsb3MgYXJ0aWN1bG9zIHZlbmRpZG9zIC0tLS0tICovXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByZWNpb192ZW50YSlcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gKHBhcnNlRmxvYXQoY2FudGlkYWQpICogcGFyc2VGbG9hdChwcmVjaW9fdmVudGEudG9TdHJpbmcoKS5yZXBsYWNlKCcsJywgJy4nKSkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB0b3RhbC50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLS0tLS0tLSBFc3RhIGZ1bmNpb24gY2FsY3VsYSBlbCB0b3RhbCB5IGxhIGNvbG9jYVxuICAgIC0tLS0tLS0tLS0gZW4gbGEgcGFydGUgaW5mZXJpb3IgZGVsIGZvcm11bGFyaW8gZGUgdmVudGFzIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gZGV0ZWN0YXIgcXVlIHRpcG8gZGUgcGFnbyBlcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdGlwb19wYWdvID0gZnVuY3Rpb24oZm9ybWFfcGFnb19wYXJhbWV0cm8pe1xuICAgICAgICAgICAgICAgICQoJyNpZF9mZWNoYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfYnV0dG9uX2J1c2NhcicpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjYnVzY2FyX3NvY2lvJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fZ3VhcmRhcl9jb21wcmEnKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX25vX3N1bWFyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgIC8vIFBvbmdvIGRpc2FibGVkIGxhIHNlbGVjY2lvbiBkZSBsYSBmb3JtYSBkZSBwYWdvXG4gICAgICAgICAgICAgICAgZm9ybWFfcGFnbyA9IGZvcm1hX3BhZ29fcGFyYW1ldHJvO1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdlZmVjdGl2bycpe1xuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBlZmVjdGl2byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgcGFnb3NcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnZGVzY3VlbnRvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGRlc2N1ZW50byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgcGFnb3MgeSBkZXNjdWVudG9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfZGVzY3VlbnRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnY3JlZGl0bycpe1xuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBjcmVkaXRvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBhdW1lbnRvc1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BvcmNlbnRhamUnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9jcmVkaXRvX3RvdGFsJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZWZlY3Rpdm8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2VmZWN0aXZvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2NyZWRpdG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZGViaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZWJpdG8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZGVzY3VlbnRvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBkZXRlY3RhciBxdWUgdGlwbyBkZSBwYWdvIGVzIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gRWxpbWluYXIgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGVsaW1pbmFyX2FydGljdWxvID0gZnVuY3Rpb24oaWQsIGNhbnRpZGFkLCBwcmVjaW9fZW52aWFyKXtcblxuICAgICAgICAgICAgICAgIGFydGljdWxvc192ZW5kaWRvcy5zcGxpY2UoaWQsIDEpO1xuICAgICAgICAgICAgICAgICQoJyN0cl8nICsgaWQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRvdGFsIC09IChwYXJzZUZsb2F0KGNhbnRpZGFkKSAqIHBhcnNlRmxvYXQocHJlY2lvX2Vudmlhci50b1N0cmluZygpLnJlcGxhY2UoJywnLCAnLicpKSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWwudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcblxuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEVsaW1pbmFyIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBhZ3JlZ2FyX2NhbnRpZGFkID0gZnVuY3Rpb24oY29udGFkb3IsIGlkLCBwcmVjaW8pe1xuICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZCA9IHByb21wdChcIkluZ3Jlc2UgbGEgY2FudGlkYWRcIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnRpZGFkICE9IG51bGwgJiYgY2FudGlkYWQgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkX3RhYmxhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZF90YWJsYV9hcnRpY3Vsb3NcIikucm93c1tjb250YWRvciArIDFdLmNlbGxzLml0ZW0oMCkuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkX3RhYmxhX2FydGljdWxvc1wiKS5yb3dzW2NvbnRhZG9yICsgMV0uY2VsbHMuaXRlbSgwKS5pbm5lckhUTUwgPSBwYXJzZUludChjYW50aWRhZF90YWJsYSkgKyBwYXJzZUludChjYW50aWRhZCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKGNhbnRpZGFkLCBpZCwgcHJlY2lvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIHZ1ZWx0b3Mgc2kgZXMgZWZlY3Rpdm8gLS0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS5jbGljayggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX3BhZ28nKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcGFnbycpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLSBwb3IgY2FkYSBldmVudG8gY2FsY3VsYXIgZWwgdnVlbHRvIC0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX3BhZ28nKS52YWwoKSA9PSAnJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wYWdvJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3Z1ZWx0byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLyogLS0tLS0gY2FsY3VsYSBzaSBlcyBlZmVjdGl2byBlbCB2dWVsdG8gLS0tLS0gKi9cblxuICAgICAgICAgICAgICAgIHZhciBwYWdvID0gJCgnI2lkX3BhZ28nKS52YWwoKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3VlbnRvID0gJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGlmIChkZXNjdWVudG8gIT0gJzAnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2N1ZW50b190b3RhbCA9IChwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlRmxvYXQoZGVzY3VlbnRvKSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IDAuMDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgLSBwYXJzZUZsb2F0KGRlc2N1ZW50b190b3RhbCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSAgcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQocmVzdWx0YWRvKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyMiA9IHJlc3VsdGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhcjIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSBwYXJzZUZsb2F0KHBhZ28pIC0gcGFyc2VGbG9hdCh0b3RhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB2dWVsdG8udG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3Z1ZWx0bycpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSB2dWVsdG9zIHNpIGVzIGVmZWN0aXZvIC0tLS0gKi9cbiAgIFxuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIGF1bWVudG8gc2kgZXMgY3JlZGl0byAtLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgLyogLS0tIHBvciBjYWRhIGV2ZW50byBjYWxjdWxhciBlbCB2dWVsdG8gLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGN1bGFyX2F1bWVudG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykua2V5cHJlc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfYXVtZW50bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX2F1bWVudG8gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8qIC0tLS0tIGNhbGN1bGEgc2kgZXMgY3JlZGl0byBlbCBhdW1lbnRvIC0tLS0tICovXG4gICAgICAgICAgICAgICAgdmFyIHBvcmNlbnRhamUgPSAkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGNyZWRpdG9fcG9yY2VudGFqZSA9IHBvcmNlbnRhamU7XG4gICAgICAgICAgICAgICAgdmFyIGF1bWVudG8gPSBwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlSW50KHBvcmNlbnRhamUpLzEwMDtcbiAgICAgICAgICAgICAgICB2YXIgdG90YWxfYXVtZW50YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgKyBwYXJzZUZsb2F0KGF1bWVudG8pO1xuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsX2F1bWVudGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICQoJyNpZF9jcmVkaXRvX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3RhdGljL2FwcHMvdmVudGFzL2pzL29wZXJhY2lvbmVzLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///30\n");

/***/ })

/******/ });