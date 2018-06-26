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
/******/ 	var hotCurrentHash = "ae17511d7c731389bad0"; // eslint-disable-line no-unused-vars
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

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar total_con_descuento = 0.0;\nvar resultado = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n/* --- hacer invisible los campos que solo son para descuento ---- */\ndocument.getElementById('id_div_descuento').style.display = 'none';\n/* ---- hacer invisible los campos que solo son para los socios ---*/\ndocument.getElementById('id_div_puntos_socios').style.display = 'none';\ndocument.getElementById('id_form_canjear').style.display = 'none';\n\n/* ----------- habilitar campos para canje de puntos en socio ---*/\nhabilitar_campos_canje = function (socio) {\n    $('#id_puntos_socios').val(socio.puntos);\n    document.getElementById('id_div_puntos_socios').style.display = 'block';\n};\n/* --------------------------------------------------------------*/\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_debito, precio_compra, stock, proveedor, no_suma_caja) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'descuento':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_credito;\n                break;\n            case 'debito':\n                precio_enviar = precio_debito;\n                break;\n        };\n        if (no_suma_caja) {\n            if (!$('#id_no_sumar').is(':checked')) {\n                swal({\n                    title: \"El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas\",\n                    text: \"Desea que el sistema tilde el check por usted ? \",\n                    icon: \"info\",\n                    buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],\n                    dangerMode: false\n                }).then(willDelete => {\n                    if (willDelete) {\n                        $('#id_no_sumar').prop(\"checked\", true);\n                    }\n                });\n            }\n        }\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    total_con_descuento = resultado;\n    var no_sumar = false;\n    var canje_socios = false;\n\n    $('#id_button_guardar_compra').prop(\"disabled\", true);\n    if ($('#id_no_sumar').is(':checked')) {\n        no_sumar = true;\n    }\n    if ($('#id_canje_socios').is(':checked')) {\n        canje_socios = true;\n    }\n\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            id_socio: $('#id_socio').val(),\n            porcentaje_descuento: $('#id_monto_descuento').val(),\n            total_con_descuento: total_con_descuento,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            no_sumar: no_sumar,\n            puntos_socios: $('#id_puntos_socios').val(),\n            canje_socios: canje_socios,\n            credito_porcentaje: credito_porcentaje,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                if (Object.keys(data).length == 0) {\n                    swal({\n                        title: \"El árticulo no fue encontrado o el stock es 0. Verifique en la lista de árticulos los datos correspondientes. \",\n                        text: \"Desea realizar el pedido ? \",\n                        icon: \"warning\",\n                        buttons: true,\n                        dangerMode: true\n                    });\n                    /*.then((willDelete) => {\n                      if (willDelete) {\n                        swal(\"Poof! Your imaginary file has been deleted!\", {\n                          icon: \"success\",\n                        });\n                      } else {\n                        swal(\"El pedido ha sido enviado\");\n                      }\n                    });*/\n                } else {\n\n                    var precio_enviar = '';\n                    switch (forma_pago) {\n                        case 'efectivo':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'descuento':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'credito':\n                            precio_enviar = data.precio_credito;\n                            break;\n                        case 'debito':\n                            precio_enviar = data.precio_debito;\n                            break;\n                    };\n                    contador_tabla += 1;\n                    calcular_total('1', data.id, precio_enviar);\n                    if (data.no_suma_caja) {\n                        if (!$('#id_no_sumar').is(':checked')) {\n                            swal({\n                                title: \"El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas\",\n                                text: \"Desea que el sistema tilde el check por usted ? \",\n                                icon: \"info\",\n                                buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],\n                                dangerMode: false\n                            }).then(willDelete => {\n                                if (willDelete) {\n                                    $('#id_no_sumar').prop(\"checked\", true);\n                                }\n                            });\n                        }\n                    }\n                    $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.nombre + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n                }\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n    console.log(precio_venta);\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#buscar_socio').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    $('#id_no_sumar').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n    };\n    if (forma_pago == 'descuento') {\n        // si es descuento habilito sus respectivos pagos y descuento\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        //document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n\n    // hago invisibles las imagenes de tipos de pagos\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n    if (forma_pago != 'descuento') {\n        $('#id_descuento').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/*------ cuando selecciona el canje se agrega las cajas de texto ----*/\n$(\"#id_canje_socios\").change(function () {\n    if (this.checked) {\n        document.getElementById('id_form_canjear').style.display = 'block';\n    } else {\n        document.getElementById('id_form_canjear').style.display = 'none';\n    }\n});\n/*-------------------------------------------------------------------*/\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_monto_descuento').click(function () {\n    if ($('#id_monto_descuento').val() == '0') {\n        $('#id_monto_descuento').val(' ');\n    }\n});\n// descuento para socios\n$('#id_descuento_socios').click(function () {\n    if ($('#id_descuento_socios').val() == '0') {\n        $('#id_descuento_socios').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_monto_descuento').focusout(function () {\n    if ($('#id_monto_descuento').val() == '') {\n        $('#id_monto_descuento').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_descuento_socios').focusout(function () {\n    if ($('#id_descuento_socios').val() == '') {\n        $('#id_descuento_socios').val('0');\n    }\n    calcular_vuelto();\n});\n\n$('#id_descuento_socios').keypress(function (e) {\n    if (e.keyCode == 13) {\n        if ($('#id_descuento_socios').val() == '') {\n            $('#id_descuento_socios').val('0');\n        }\n        calcular_vuelto();\n    }\n});\n\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var descuento = $('#id_monto_descuento').val();\n    var descuento_socio = $('#id_descuento_socios').val();\n\n    var vuelto = parseFloat(pago) - parseFloat(total);\n    console.log(descuento_socio);\n    if (descuento_socio != '0') {\n        // descuento para socios\n        descuento_total = parseFloat(total) * parseFloat(descuento_socio) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    }\n    console.log(descuento);\n    if (descuento != '0') {\n        // descuento extraordinario\n        descuento_total = parseFloat(total) * parseFloat(descuento) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    }\n    console.log(vuelto);\n    console.log(vuelto.toFixed(2));\n    var representar = vuelto.toFixed(2);\n\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_monto_descuento').focusout(function () {\n    calcular_vuelto();\n});\n$('#id_monto_descuento').keypress(function () {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsInRvdGFsX2Nvbl9kZXNjdWVudG8iLCJyZXN1bHRhZG8iLCJjb250YWRvcl90YWJsYSIsImNyZWRpdG9fcG9yY2VudGFqZSIsImFydGljdWxvc192ZW5kaWRvcyIsImZvcm1hX3BhZ28iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5IiwiaGFiaWxpdGFyX2NhbXBvc19jYW5qZSIsInNvY2lvIiwiJCIsInZhbCIsInB1bnRvcyIsInNlbGVjY2lvbl9hcnRpY3VsbyIsImlkIiwiZGVzY3JpcGNpb24iLCJtYXJjYSIsInJ1YnJvIiwicHJlY2lvX3ZlbnRhIiwicHJlY2lvX2NyZWRpdG8iLCJwcmVjaW9fZGViaXRvIiwicHJlY2lvX2NvbXByYSIsInN0b2NrIiwicHJvdmVlZG9yIiwibm9fc3VtYV9jYWphIiwiY2FudGlkYWQiLCJwcm9tcHQiLCJwcmVjaW9fZW52aWFyIiwiaXMiLCJzd2FsIiwidGl0bGUiLCJ0ZXh0IiwiaWNvbiIsImJ1dHRvbnMiLCJkYW5nZXJNb2RlIiwidGhlbiIsIndpbGxEZWxldGUiLCJwcm9wIiwiY2FsY3VsYXJfdG90YWwiLCJhZnRlciIsInRvU3RyaW5nIiwiZ3VhcmRhcl9jb21wcmEiLCJub19zdW1hciIsImNhbmplX3NvY2lvcyIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInZlbnRhcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJmZWNoYSIsImlkX3NvY2lvIiwicG9yY2VudGFqZV9kZXNjdWVudG8iLCJwcmVjaW9fdmVudGFfdG90YWwiLCJwdW50b3Nfc29jaW9zIiwiY3NyZm1pZGRsZXdhcmV0b2tlbiIsInN1Y2Nlc3MiLCJQTm90aWZ5IiwiaHRtbCIsImVtcHR5Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiaWRfdmVudGEiLCJrZXlwcmVzcyIsImUiLCJ3aGljaCIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJub21icmUiLCJvYmoiLCJwdXNoIiwiY29uc29sZSIsImxvZyIsInBhcnNlRmxvYXQiLCJyZXBsYWNlIiwicmVwcmVzZW50YXIiLCJ0b0ZpeGVkIiwiY2FsY3VsYXJfdGlwb19wYWdvIiwiZm9ybWFfcGFnb19wYXJhbWV0cm8iLCJoaWRlIiwiZWxpbWluYXJfYXJ0aWN1bG8iLCJzcGxpY2UiLCJyZW1vdmUiLCJhZ3JlZ2FyX2NhbnRpZGFkIiwiY29udGFkb3IiLCJwcmVjaW8iLCJjYW50aWRhZF90YWJsYSIsInJvd3MiLCJjZWxscyIsIml0ZW0iLCJpbm5lckhUTUwiLCJwYXJzZUludCIsImNoYW5nZSIsImNoZWNrZWQiLCJjbGljayIsImZvY3Vzb3V0IiwiY2FsY3VsYXJfdnVlbHRvIiwia2V5Q29kZSIsInBhZ28iLCJkZXNjdWVudG8iLCJkZXNjdWVudG9fc29jaW8iLCJ2dWVsdG8iLCJkZXNjdWVudG9fdG90YWwiLCJyZXByZXNlbnRhcjIiLCJjYWxjdWxhcl9hdW1lbnRvIiwicG9yY2VudGFqZSIsImF1bWVudG8iLCJ0b3RhbF9hdW1lbnRhZG8iXSwibWFwcGluZ3MiOiJBQUFZO0FBQ0EsSUFBSUEsUUFBUSxHQUFaO0FBQ0EsSUFBSUMsc0JBQXNCLEdBQTFCO0FBQ0EsSUFBSUMsWUFBWSxHQUFoQjtBQUNBLElBQUlDLGlCQUFpQixDQUFyQjtBQUNBLElBQUlDLHFCQUFxQixDQUF6QjtBQUNBLElBQUlDLHFCQUFxQixFQUF6QjtBQUNBLElBQUlDLGFBQWEsRUFBakI7QUFDQTtBQUNBQyxTQUFTQyxjQUFULENBQXdCLGFBQXhCLEVBQXVDQyxLQUF2QyxDQUE2Q0MsT0FBN0MsR0FBdUQsTUFBdkQ7QUFDQUgsU0FBU0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0MsS0FBekMsQ0FBK0NDLE9BQS9DLEdBQXlELE1BQXpEO0FBQ0E7QUFDQUgsU0FBU0MsY0FBVCxDQUF3QixtQkFBeEIsRUFBNkNDLEtBQTdDLENBQW1EQyxPQUFuRCxHQUE2RCxN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Y2VzQ29udGVudCI6WyIgICAgICAgICAgICAvKiAtLS0tIHZhcmlhYmxlcyBnbG9iYWxlcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgdG90YWwgPSAwLjA7XG4gICAgICAgICAgICB2YXIgdG90YWxfY29uX2Rlc2N1ZW50byA9IDAuMDtcbiAgICAgICAgICAgIHZhciByZXN1bHRhZG8gPSAwLjA7XG4gICAgICAgICAgICB2YXIgY29udGFkb3JfdGFibGEgPSAwO1xuICAgICAgICAgICAgdmFyIGNyZWRpdG9fcG9yY2VudGFqZSA9IDA7XG4gICAgICAgICAgICB2YXIgYXJ0aWN1bG9zX3ZlbmRpZG9zID0gW107XG4gICAgICAgICAgICB2YXIgZm9ybWFfcGFnbyA9ICcnO1xuICAgICAgICAgICAgLyogLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGVmZWN0aXZvIC0tLS0gKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcGFnbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3Z1ZWx0bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgY3LDqWRpdG8gLS0tLSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wb3JjZW50YWplJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfY3JlZGl0b190b3RhbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgZGVzY3VlbnRvIC0tLS0gKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfZGVzY3VlbnRvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIC8qIC0tLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgbG9zIHNvY2lvcyAtLS0qL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wdW50b3Nfc29jaW9zJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9mb3JtX2NhbmplYXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICAgICAgICAvKiAtLS0tLS0tLS0tLSBoYWJpbGl0YXIgY2FtcG9zIHBhcmEgY2FuamUgZGUgcHVudG9zIGVuIHNvY2lvIC0tLSovXG4gICAgICAgICAgICBoYWJpbGl0YXJfY2FtcG9zX2NhbmplID0gZnVuY3Rpb24oc29jaW8pe1xuICAgICAgICAgICAgICAgICQoJyNpZF9wdW50b3Nfc29jaW9zJykudmFsKHNvY2lvLnB1bnRvcyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wdW50b3Nfc29jaW9zJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgICAgICAgIHZhciBzZWxlY2Npb25fYXJ0aWN1bG8gPSBmdW5jdGlvbihpZCwgZGVzY3JpcGNpb24sIG1hcmNhLCBydWJybywgcHJlY2lvX3ZlbnRhLCBwcmVjaW9fY3JlZGl0bywgcHJlY2lvX2RlYml0bywgcHJlY2lvX2NvbXByYSwgc3RvY2ssIHByb3ZlZWRvciwgbm9fc3VtYV9jYWphKXtcbiAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWQgPSBwcm9tcHQoXCJJbmdyZXNlIGxhIGNhbnRpZGFkXCIsIFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHByZWNpb19lbnZpYXIgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoY2FudGlkYWQgIT0gbnVsbCAmJiBjYW50aWRhZCAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGZvcm1hX3BhZ28pe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWZlY3Rpdm8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZXNjdWVudG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjcmVkaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX2NyZWRpdG87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZWJpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fZGViaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9fc3VtYV9jYWphKXtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoISgkKCcjaWRfbm9fc3VtYXInKS5pcygnOmNoZWNrZWQnKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRWwgw6FydGljdWxvIGVzdGEgdGlsZGFkbyBwYXJhIG5vIHN1bWFyc2UgYSBjYWphLiBQZXJvIG5vIHNlIHRpbGRvIGVuIGVsIGZvcm11bGFyaW8gZGUgdmVudGFzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJEZXNlYSBxdWUgZWwgc2lzdGVtYSB0aWxkZSBlbCBjaGVjayBwb3IgdXN0ZWQgPyBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBcImluZm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbJ05vLCBwb3JxdWUgcXVpZXJvIHN1bWFybG8gYSBjYWphJywgJ1NpLCBwb3JxdWUgbm8gbG8gdm95IGEgc3VtYXIgYSBjYWphJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGFuZ2VyTW9kZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKHdpbGxEZWxldGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lsbERlbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX25vX3N1bWFyJykucHJvcCggXCJjaGVja2VkXCIsIHRydWUgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbChjYW50aWRhZCwgaWQsIHByZWNpb19lbnZpYXIpO1xuICAgICAgICAgICAgICAgICAgICBjb250YWRvcl90YWJsYSArPTE7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MgdHI6bGFzdCcpLmFmdGVyKCc8dHIgaWQ9XCJ0cl8nICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICdcIj48dGQ+JyArIGNhbnRpZGFkICsgJzwvdGQ+JyArICc8dGQ+JyArIGRlc2NyaXBjaW9uICsgJzwvdGQ+JyArICc8dGQ+ICQnICsgcHJlY2lvX2VudmlhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJzwvdGQ+JyArICAnPHRkPjxhIG9uY2xpY2s9XCJlbGltaW5hcl9hcnRpY3VsbygnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGNhbnRpZGFkICsgJywnICsgcHJlY2lvX2VudmlhciArJylcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3M9XCJidG4gYnRuLWRhbmdlciBidG4teHNcIj48aSBjbGFzcz1cImZhIGZhLXRyYXNoXCI+PC9pPiA8L2E+PC90ZD48L3RyPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBndWFyZGFyX2NvbXByYSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdG90YWxfY29uX2Rlc2N1ZW50byA9IHJlc3VsdGFkbztcbiAgICAgICAgICAgICAgICB2YXIgbm9fc3VtYXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgY2FuamVfc29jaW9zID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAkKCcjaWRfYnV0dG9uX2d1YXJkYXJfY29tcHJhJykucHJvcCggXCJkaXNhYmxlZFwiLCB0cnVlICk7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9ub19zdW1hcicpLmlzKCc6Y2hlY2tlZCcpKXtub19zdW1hciA9IHRydWU7fVxuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfY2FuamVfc29jaW9zJykuaXMoJzpjaGVja2VkJykpe2NhbmplX3NvY2lvcyA9IHRydWU7fVxuXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3ZlbnRhcy9hamF4L3ZlbnRhcy9hbHRhLycsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVudGFzOiBKU09OLnN0cmluZ2lmeShhcnRpY3Vsb3NfdmVuZGlkb3MpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmVjaGE6ICQoJyNpZF9mZWNoYScpLnZhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkX3NvY2lvOiAkKCcjaWRfc29jaW8nKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcmNlbnRhamVfZGVzY3VlbnRvOiAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbF9jb25fZGVzY3VlbnRvOiB0b3RhbF9jb25fZGVzY3VlbnRvLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX3ZlbnRhX3RvdGFsOiB0b3RhbC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWFfcGFnbzogZm9ybWFfcGFnbyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vX3N1bWFyOiBub19zdW1hcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1bnRvc19zb2Npb3M6ICQoJyNpZF9wdW50b3Nfc29jaW9zJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5qZV9zb2Npb3M6IGNhbmplX3NvY2lvcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWRpdG9fcG9yY2VudGFqZTogY3JlZGl0b19wb3JjZW50YWplLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3NyZm1pZGRsZXdhcmV0b2tlbjogJChcImlucHV0W25hbWU9Y3NyZm1pZGRsZXdhcmV0b2tlbl1cIikudmFsKClcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2lzdGVtYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEuc3VjY2VzcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAwLjAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zJykuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvdmVudGFzL3RpY2tldC8nICsgZGF0YS5pZF92ZW50YVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgLyogLS0tLSBmdW5jaW9uIHBhcmEgZWwgbGVjdG9yIGRlIGNvZGlnbyBkZSBiYXJyYXMgLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLmtleXByZXNzKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKXtcblxuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3ZlbnRhcy9hamF4L2NvZGlnby9hcnRpY3Vsby8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2RpZ29fYXJ0aWN1bG8nOiAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzcmZtaWRkbGV3YXJldG9rZW46ICQoXCJpbnB1dFtuYW1lPWNzcmZtaWRkbGV3YXJldG9rZW5dXCIpLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRhdGEpLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbCDDoXJ0aWN1bG8gbm8gZnVlIGVuY29udHJhZG8gbyBlbCBzdG9jayBlcyAwLiBWZXJpZmlxdWUgZW4gbGEgbGlzdGEgZGUgw6FydGljdWxvcyBsb3MgZGF0b3MgY29ycmVzcG9uZGllbnRlcy4gXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkRlc2VhIHJlYWxpemFyIGVsIHBlZGlkbyA/IFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qLnRoZW4oKHdpbGxEZWxldGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aWxsRGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoXCJQb29mISBZb3VyIGltYWdpbmFyeSBmaWxlIGhhcyBiZWVuIGRlbGV0ZWQhXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2FsKFwiRWwgcGVkaWRvIGhhIHNpZG8gZW52aWFkb1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmVjaW9fZW52aWFyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZm9ybWFfcGFnbyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdlZmVjdGl2byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGVzY3VlbnRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjcmVkaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fY3JlZGl0bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RlYml0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX2RlYml0bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFkb3JfdGFibGEgKz0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbCgnMScsIGRhdGEuaWQsIHByZWNpb19lbnZpYXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5ub19zdW1hX2NhamEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKCQoJyNpZF9ub19zdW1hcicpLmlzKCc6Y2hlY2tlZCcpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFbCDDoXJ0aWN1bG8gZXN0YSB0aWxkYWRvIHBhcmEgbm8gc3VtYXJzZSBhIGNhamEuIFBlcm8gbm8gc2UgdGlsZG8gZW4gZWwgZm9ybXVsYXJpbyBkZSB2ZW50YXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkRlc2VhIHF1ZSBlbCBzaXN0ZW1hIHRpbGRlIGVsIGNoZWNrIHBvciB1c3RlZCA/IFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwiaW5mb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFsnTm8sIHBvcnF1ZSBxdWllcm8gc3VtYXJsbyBhIGNhamEnLCAnU2ksIHBvcnF1ZSBubyBsbyB2b3kgYSBzdW1hciBhIGNhamEnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYW5nZXJNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigod2lsbERlbGV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aWxsRGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbm9fc3VtYXInKS5wcm9wKCBcImNoZWNrZWRcIiwgdHJ1ZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MgdHI6bGFzdCcpLmFmdGVyKCc8dHIgaWQ9XCJ0cl8nICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICdcIj48dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jYW50aWRhZCArICc8L3RkPicgKyAnPHRkPicgKyBkYXRhLm5vbWJyZSArICc8L3RkPicgKyAnPHRkPiAkJyArIHByZWNpb19lbnZpYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgJzx0ZD48YSBvbmNsaWNrPVwiYWdyZWdhcl9jYW50aWRhZCgnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuaWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICsgJ2NsYXNzPVwiYnRuIGJ0bi1pbmZvIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT4gPC9hPjxhIG9uY2xpY2s9XCJlbGltaW5hcl9hcnRpY3VsbygnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuY2FudGlkYWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+IDwvYT48L3RkPjwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLS0gZnVuY2lvbiBwYXJhIGVsIGxlY3RvciBkZSBjb2RpZ28gZGUgYmFycmFzIC0tLSAqL1xuXG4gICAgLyogLS0tLS0tLS0tLSBFc3RhIGZ1bmNpb24gY2FsY3VsYSBlbCB0b3RhbCB5IGxhIGNvbG9jYVxuICAgICoqKiAtLS0tLS0tLS0tIGVuIGxhIHBhcnRlIGluZmVyaW9yIGRlbCBmb3JtdWxhcmlvIGRlIHZlbnRhcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdG90YWwgPSBmdW5jdGlvbihjYW50aWRhZCwgaWQsIHByZWNpb192ZW50YSl7XG4gICAgLyogLS0tLSBBcm1hciB1biBhcnJheSBjb24gbG9zIGFydGljdWxvcyB2ZW5kaWRvcyAtLS0tLSAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgICAgICAgICAgICAgIG9ialsnaWQnXSA9IGlkO1xuICAgICAgICAgICAgICAgICAgICBvYmpbJ2NhbnRpZGFkJ10gPSBjYW50aWRhZDtcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWN1bG9zX3ZlbmRpZG9zLnB1c2gob2JqKTtcbiAgICAvKiAtLS0tIEFybWFyIHVuIGFycmF5IGNvbiBsb3MgYXJ0aWN1bG9zIHZlbmRpZG9zIC0tLS0tICovXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByZWNpb192ZW50YSlcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gKHBhcnNlRmxvYXQoY2FudGlkYWQpICogcGFyc2VGbG9hdChwcmVjaW9fdmVudGEudG9TdHJpbmcoKS5yZXBsYWNlKCcsJywgJy4nKSkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB0b3RhbC50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLS0tLS0tLSBFc3RhIGZ1bmNpb24gY2FsY3VsYSBlbCB0b3RhbCB5IGxhIGNvbG9jYVxuICAgIC0tLS0tLS0tLS0gZW4gbGEgcGFydGUgaW5mZXJpb3IgZGVsIGZvcm11bGFyaW8gZGUgdmVudGFzIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gZGV0ZWN0YXIgcXVlIHRpcG8gZGUgcGFnbyBlcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdGlwb19wYWdvID0gZnVuY3Rpb24oZm9ybWFfcGFnb19wYXJhbWV0cm8pe1xuICAgICAgICAgICAgICAgICQoJyNpZF9mZWNoYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfYnV0dG9uX2J1c2NhcicpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjYnVzY2FyX3NvY2lvJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fZ3VhcmRhcl9jb21wcmEnKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX25vX3N1bWFyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgIC8vIFBvbmdvIGRpc2FibGVkIGxhIHNlbGVjY2lvbiBkZSBsYSBmb3JtYSBkZSBwYWdvXG4gICAgICAgICAgICAgICAgZm9ybWFfcGFnbyA9IGZvcm1hX3BhZ29fcGFyYW1ldHJvO1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdlZmVjdGl2bycpe1xuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBlZmVjdGl2byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgcGFnb3NcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnZGVzY3VlbnRvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGRlc2N1ZW50byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgcGFnb3MgeSBkZXNjdWVudG9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfZGVzY3VlbnRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnY3JlZGl0bycpe1xuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBjcmVkaXRvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBhdW1lbnRvc1xuICAgICAgICAgICAgICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcG9yY2VudGFqZScpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2NyZWRpdG9fdG90YWwnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gaGFnbyBpbnZpc2libGVzIGxhcyBpbWFnZW5lcyBkZSB0aXBvcyBkZSBwYWdvc1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdlZmVjdGl2bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZWZlY3Rpdm8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnY3JlZGl0bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdkZWJpdG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2RlYml0bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdkZXNjdWVudG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gZGV0ZWN0YXIgcXVlIHRpcG8gZGUgcGFnbyBlcyAtLS0tICovXG5cbiAgICAvKiAtLS0tIEVsaW1pbmFyIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBlbGltaW5hcl9hcnRpY3VsbyA9IGZ1bmN0aW9uKGlkLCBjYW50aWRhZCwgcHJlY2lvX2Vudmlhcil7XG5cbiAgICAgICAgICAgICAgICBhcnRpY3Vsb3NfdmVuZGlkb3Muc3BsaWNlKGlkLCAxKTtcbiAgICAgICAgICAgICAgICAkKCcjdHJfJyArIGlkKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB0b3RhbCAtPSAocGFyc2VGbG9hdChjYW50aWRhZCkgKiBwYXJzZUZsb2F0KHByZWNpb19lbnZpYXIudG9TdHJpbmcoKS5yZXBsYWNlKCcsJywgJy4nKSkpO1xuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG5cbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBFbGltaW5hciB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG5cbiAgICAvKiAtLS0tIEFncmVnYXIgY2FudGlkYWQgYSB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG4gICAgICAgICAgICB2YXIgYWdyZWdhcl9jYW50aWRhZCA9IGZ1bmN0aW9uKGNvbnRhZG9yLCBpZCwgcHJlY2lvKXtcbiAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWQgPSBwcm9tcHQoXCJJbmdyZXNlIGxhIGNhbnRpZGFkXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjYW50aWRhZCAhPSBudWxsICYmIGNhbnRpZGFkICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZF90YWJsYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRfdGFibGFfYXJ0aWN1bG9zXCIpLnJvd3NbY29udGFkb3IgKyAxXS5jZWxscy5pdGVtKDApLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZF90YWJsYV9hcnRpY3Vsb3NcIikucm93c1tjb250YWRvciArIDFdLmNlbGxzLml0ZW0oMCkuaW5uZXJIVE1MID0gcGFyc2VJbnQoY2FudGlkYWRfdGFibGEpICsgcGFyc2VJbnQoY2FudGlkYWQpO1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbChjYW50aWRhZCwgaWQsIHByZWNpbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEFncmVnYXIgY2FudGlkYWQgYSB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG5cbiAgICAvKi0tLS0tLSBjdWFuZG8gc2VsZWNjaW9uYSBlbCBjYW5qZSBzZSBhZ3JlZ2EgbGFzIGNhamFzIGRlIHRleHRvIC0tLS0qL1xuICAgICQoXCIjaWRfY2FuamVfc29jaW9zXCIpLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5jaGVja2VkKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9jYW5qZWFyJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Zvcm1fY2FuamVhcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgdnVlbHRvcyBzaSBlcyBlZmVjdGl2byAtLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcGFnbycpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wYWdvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBkZXNjdWVudG8gcGFyYSBzb2Npb3NcbiAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0gcG9yIGNhZGEgZXZlbnRvIGNhbGN1bGFyIGVsIHZ1ZWx0byAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wYWdvJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcGFnbycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS5mb2N1c291dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS5rZXlwcmVzcyhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdnVlbHRvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvKiAtLS0tLSBjYWxjdWxhIHNpIGVzIGVmZWN0aXZvIGVsIHZ1ZWx0byAtLS0tLSAqL1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhZ28gPSAkKCcjaWRfcGFnbycpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHZhciBkZXNjdWVudG8gPSAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCk7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2N1ZW50b19zb2NpbyA9ICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQodG90YWwpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlc2N1ZW50b19zb2NpbylcbiAgICAgICAgICAgICAgICBpZiAoZGVzY3VlbnRvX3NvY2lvICE9ICcwJykgeyAvLyBkZXNjdWVudG8gcGFyYSBzb2Npb3NcbiAgICAgICAgICAgICAgICAgICAgZGVzY3VlbnRvX3RvdGFsID0gKHBhcnNlRmxvYXQodG90YWwpICogcGFyc2VGbG9hdChkZXNjdWVudG9fc29jaW8pKSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gMC4wO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRhZG8gPSBwYXJzZUZsb2F0KHRvdGFsKSAtIHBhcnNlRmxvYXQoZGVzY3VlbnRvX3RvdGFsKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZ1ZWx0byA9ICBwYXJzZUZsb2F0KHBhZ28pIC0gcGFyc2VGbG9hdChyZXN1bHRhZG8pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIyID0gcmVzdWx0YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyMi50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGVzY3VlbnRvKVxuICAgICAgICAgICAgICAgIGlmIChkZXNjdWVudG8gIT0gJzAnKSB7IC8vIGRlc2N1ZW50byBleHRyYW9yZGluYXJpb1xuICAgICAgICAgICAgICAgICAgICBkZXNjdWVudG9fdG90YWwgPSAocGFyc2VGbG9hdCh0b3RhbCkgKiBwYXJzZUZsb2F0KGRlc2N1ZW50bykpIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRhZG8gPSAwLjA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IHBhcnNlRmxvYXQodG90YWwpIC0gcGFyc2VGbG9hdChkZXNjdWVudG9fdG90YWwpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gIHBhcnNlRmxvYXQocGFnbykgLSBwYXJzZUZsb2F0KHJlc3VsdGFkbyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhcjIgPSByZXN1bHRhZG8udG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2dWVsdG8pXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codnVlbHRvLnRvRml4ZWQoMikpXG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdnVlbHRvLnRvRml4ZWQoMik7XG5cbiAgICAgICAgICAgICAgICAkKCcjaWRfdnVlbHRvJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIHZ1ZWx0b3Mgc2kgZXMgZWZlY3Rpdm8gLS0tLSAqL1xuXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgYXVtZW50byBzaSBlcyBjcmVkaXRvIC0tLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wb3JjZW50YWplJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0gcG9yIGNhZGEgZXZlbnRvIGNhbGN1bGFyIGVsIHZ1ZWx0byAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfYXVtZW50bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5rZXlwcmVzcyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl9hdW1lbnRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfYXVtZW50byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLyogLS0tLS0gY2FsY3VsYSBzaSBlcyBjcmVkaXRvIGVsIGF1bWVudG8gLS0tLS0gKi9cbiAgICAgICAgICAgICAgICB2YXIgcG9yY2VudGFqZSA9ICQoJyNpZF9wb3JjZW50YWplJykudmFsKCk7XG4gICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplID0gcG9yY2VudGFqZTtcbiAgICAgICAgICAgICAgICB2YXIgYXVtZW50byA9IHBhcnNlRmxvYXQodG90YWwpICogcGFyc2VJbnQocG9yY2VudGFqZSkvMTAwO1xuICAgICAgICAgICAgICAgIHZhciB0b3RhbF9hdW1lbnRhZG8gPSBwYXJzZUZsb2F0KHRvdGFsKSArIHBhcnNlRmxvYXQoYXVtZW50byk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWxfYXVtZW50YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG9fdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///30\n");

/***/ })

/******/ });