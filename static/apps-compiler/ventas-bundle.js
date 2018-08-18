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
/******/ 	var hotCurrentHash = "89640a46839e54d8e39d"; // eslint-disable-line no-unused-vars
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

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar total_con_descuento = 0.0;\nvar resultado = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n/* --- hacer invisible los campos que solo son para descuento ---- */\ndocument.getElementById('id_div_descuento').style.display = 'none';\n/* ---- hacer invisible los campos que solo son para los socios ---*/\ndocument.getElementById('id_div_puntos_socios').style.display = 'none';\ndocument.getElementById('id_form_canjear').style.display = 'none';\ndocument.getElementById('id_form_efectivo').style.display = 'none';\n\n/* ----------- habilitar campos para canje de puntos en socio ---*/\nhabilitar_campos_canje = function (socio) {\n    $('#id_puntos_socios').val(socio.puntos);\n    document.getElementById('id_div_puntos_socios').style.display = 'block';\n    $('#id_descuento_de_socio').prop(\"checked\", true);\n};\n/* --------------------------------------------------------------*/\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_debito, precio_compra, stock, proveedor, no_suma_caja) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'descuento':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_credito;\n                break;\n            case 'debito':\n                precio_enviar = precio_debito;\n                break;\n        };\n        if (no_suma_caja) {\n            if (!$('#id_no_sumar').is(':checked')) {\n                swal({\n                    title: \"El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas\",\n                    text: \"Desea que el sistema tilde el check por usted ? \",\n                    icon: \"info\",\n                    buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],\n                    dangerMode: false\n                }).then(willDelete => {\n                    if (willDelete) {\n                        $('#id_no_sumar').prop(\"checked\", true);\n                    }\n                });\n            }\n        }\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    total_con_descuento = resultado;\n    var no_sumar = false;\n    var canje_socios = false;\n    var canje_credito = false;\n    var id_descuento_de_socio = false;\n\n    $('#id_button_guardar_compra').prop(\"disabled\", true);\n    if ($('#id_no_sumar').is(':checked')) {\n        no_sumar = true;\n    }\n    if ($('#id_canje_socios').is(':checked')) {\n        canje_socios = true;\n    }\n    if ($('#id_canje_credito').is(':checked')) {\n        canje_credito = true;\n    }\n    if ($('#id_descuento_de_socio').is(':checked')) {\n        id_descuento_de_socio = true;\n    }\n\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            id_socio: $('#id_socio').val(),\n            porcentaje_descuento: $('#id_monto_descuento').val(),\n            total_con_descuento: total_con_descuento,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            no_sumar: no_sumar,\n            puntos_socios: $('#id_puntos_socios').val(),\n            canje_socios: canje_socios,\n            creditos_socios: $('#id_credito_socio').val(),\n            canje_credito: canje_credito,\n            credito_porcentaje: credito_porcentaje,\n            id_descuento_de_socio: id_descuento_de_socio,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                if (Object.keys(data).length == 0) {\n                    swal({\n                        title: \"El árticulo no fue encontrado o el stock es 0. Verifique en la lista de árticulos los datos correspondientes. \",\n                        text: \"Desea realizar el pedido ? \",\n                        icon: \"warning\",\n                        buttons: true,\n                        dangerMode: true\n                    });\n                    /*.then((willDelete) => {\n                      if (willDelete) {\n                        swal(\"Poof! Your imaginary file has been deleted!\", {\n                          icon: \"success\",\n                        });\n                      } else {\n                        swal(\"El pedido ha sido enviado\");\n                      }\n                    });*/\n                } else {\n\n                    var precio_enviar = '';\n                    switch (forma_pago) {\n                        case 'efectivo':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'descuento':\n                            precio_enviar = data.precio_venta;\n                            break;\n                        case 'credito':\n                            precio_enviar = data.precio_credito;\n                            break;\n                        case 'debito':\n                            precio_enviar = data.precio_debito;\n                            break;\n                    };\n                    contador_tabla += 1;\n                    calcular_total('1', data.id, precio_enviar);\n                    if (data.no_suma_caja) {\n                        if (!$('#id_no_sumar').is(':checked')) {\n                            swal({\n                                title: \"El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas\",\n                                text: \"Desea que el sistema tilde el check por usted ? \",\n                                icon: \"info\",\n                                buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],\n                                dangerMode: false\n                            }).then(willDelete => {\n                                if (willDelete) {\n                                    $('#id_no_sumar').prop(\"checked\", true);\n                                }\n                            });\n                        }\n                    }\n                    $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.nombre + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n                }\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n    console.log(precio_venta);\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#buscar_socio').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    $('#id_no_sumar').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n    };\n    if (forma_pago == 'descuento') {\n        // si es descuento habilito sus respectivos pagos y descuento\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        //document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n\n    // hago invisibles las imagenes de tipos de pagos\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n    if (forma_pago != 'descuento') {\n        $('#id_descuento').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/*------ cuando selecciona el canje se agrega las cajas de texto ----*/\n$(\"#id_canje_socios\").change(function () {\n    if (this.checked) {\n        $('#id_canje_credito').prop(\"checked\", false);\n        document.getElementById('id_form_canjear').style.display = 'block';\n        document.getElementById('id_form_efectivo').style.display = 'none';\n    } else {\n        document.getElementById('id_form_canjear').style.display = 'none';\n    }\n});\n$(\"#id_canje_credito\").change(function () {\n    if (this.checked) {\n        $('#id_canje_socios').prop(\"checked\", false);\n        document.getElementById('id_form_efectivo').style.display = 'block';\n        document.getElementById('id_form_canjear').style.display = 'none';\n    } else {\n        document.getElementById('id_form_efectivo').style.display = 'none';\n    }\n});\n/*-------------------------------------------------------------------*/\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_monto_descuento').click(function () {\n    if ($('#id_monto_descuento').val() == '0') {\n        $('#id_monto_descuento').val(' ');\n    }\n});\n// descuento para socios\n$('#id_descuento_socios').click(function () {\n    if ($('#id_descuento_socios').val() == '0') {\n        $('#id_descuento_socios').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_monto_descuento').focusout(function () {\n    if ($('#id_monto_descuento').val() == '') {\n        $('#id_monto_descuento').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_descuento_socios').focusout(function () {\n    if ($('#id_descuento_socios').val() == '') {\n        $('#id_descuento_socios').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_credito_socio').focusout(function () {\n    if ($('#id_credito_socio').val() == '') {\n        $('#id_credito_socio').val('0');\n    }\n    calcular_vuelto();\n});\n\n$('#id_descuento_socios').keypress(function (e) {\n    if (e.keyCode == 13) {\n        if ($('#id_descuento_socios').val() == '') {\n            $('#id_descuento_socios').val('0');\n        }\n        calcular_vuelto();\n    }\n});\n\n$('#id_credito_socio').keypress(function (e) {\n    if (e.keyCode == 13) {\n        if ($('#id_credito_socio').val() == '') {\n            $('#id_credito_socio').val('0');\n        }\n        calcular_vuelto();\n    }\n});\n\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var descuento = $('#id_monto_descuento').val();\n    var descuento_socio = $('#id_descuento_socios').val();\n    var credito_socio = $('#id_credito_socio').val();\n\n    var vuelto = parseFloat(pago) - parseFloat(total);\n    console.log(descuento_socio);\n    if ($('#id_canje_socios').is(':checked')) {\n        if (descuento_socio != '0') {\n            // descuento para socios\n            descuento_total = parseFloat(total) * parseFloat(descuento_socio) / 100;\n            resultado = 0.0;\n            resultado = parseFloat(total) - parseFloat(descuento_total);\n            var vuelto = parseFloat(pago) - parseFloat(resultado);\n            var representar2 = resultado.toFixed(2);\n            $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n        }\n    }\n    if ($('#id_canje_credito').is(':checked')) {\n        if (credito_socio != '0') {\n            // credito para socios\n            resultado = 0.0;\n            resultado = parseFloat(total) - parseFloat(credito_socio);\n            var vuelto = parseFloat(pago) - parseFloat(resultado);\n            var representar2 = resultado.toFixed(2);\n            $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n        }\n    }\n    if ($('#id_descuento_de_socio').is(':checked')) {\n        resultado = 0.0;\n        var descuento_socio = parseFloat(total) * 5 / 100;\n        resultado = parseFloat(total) - parseFloat(descuento_socio);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    }\n    console.log(descuento);\n    if (descuento != '0') {\n        // descuento extraordinario\n        descuento_total = parseFloat(total) * parseFloat(descuento) / 100;\n        resultado = 0.0;\n        resultado = parseFloat(total) - parseFloat(descuento_total);\n        var vuelto = parseFloat(pago) - parseFloat(resultado);\n        var representar2 = resultado.toFixed(2);\n        $('#id_total').html('$ ' + representar2.toString().replace('.', ','));\n    }\n    console.log(vuelto);\n    console.log(vuelto.toFixed(2));\n    var representar = vuelto.toFixed(2);\n\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_monto_descuento').focusout(function () {\n    calcular_vuelto();\n});\n$('#id_monto_descuento').keypress(function () {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsInRvdGFsX2Nvbl9kZXNjdWVudG8iLCJyZXN1bHRhZG8iLCJjb250YWRvcl90YWJsYSIsImNyZWRpdG9fcG9yY2VudGFqZSIsImFydGljdWxvc192ZW5kaWRvcyIsImZvcm1hX3BhZ28iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5IiwiaGFiaWxpdGFyX2NhbXBvc19jYW5qZSIsInNvY2lvIiwiJCIsInZhbCIsInB1bnRvcyIsInByb3AiLCJzZWxlY2Npb25fYXJ0aWN1bG8iLCJpZCIsImRlc2NyaXBjaW9uIiwibWFyY2EiLCJydWJybyIsInByZWNpb192ZW50YSIsInByZWNpb19jcmVkaXRvIiwicHJlY2lvX2RlYml0byIsInByZWNpb19jb21wcmEiLCJzdG9jayIsInByb3ZlZWRvciIsIm5vX3N1bWFfY2FqYSIsImNhbnRpZGFkIiwicHJvbXB0IiwicHJlY2lvX2VudmlhciIsImlzIiwic3dhbCIsInRpdGxlIiwidGV4dCIsImljb24iLCJidXR0b25zIiwiZGFuZ2VyTW9kZSIsInRoZW4iLCJ3aWxsRGVsZXRlIiwiY2FsY3VsYXJfdG90YWwiLCJhZnRlciIsInRvU3RyaW5nIiwiZ3VhcmRhcl9jb21wcmEiLCJub19zdW1hciIsImNhbmplX3NvY2lvcyIsImNhbmplX2NyZWRpdG8iLCJpZF9kZXNjdWVudG9fZGVfc29jaW8iLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGEiLCJ2ZW50YXMiLCJKU09OIiwic3RyaW5naWZ5IiwiZmVjaGEiLCJpZF9zb2NpbyIsInBvcmNlbnRhamVfZGVzY3VlbnRvIiwicHJlY2lvX3ZlbnRhX3RvdGFsIiwicHVudG9zX3NvY2lvcyIsImNyZWRpdG9zX3NvY2lvcyIsImNzcmZtaWRkbGV3YXJldG9rZW4iLCJzdWNjZXNzIiwiUE5vdGlmeSIsImh0bWwiLCJlbXB0eSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImlkX3ZlbnRhIiwia2V5cHJlc3MiLCJlIiwid2hpY2giLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwibm9tYnJlIiwib2JqIiwicHVzaCIsImNvbnNvbGUiLCJsb2ciLCJwYXJzZUZsb2F0IiwicmVwbGFjZSIsInJlcHJlc2VudGFyIiwidG9GaXhlZCIsImNhbGN1bGFyX3RpcG9fcGFnbyIsImZvcm1hX3BhZ29fcGFyYW1ldHJvIiwiaGlkZSIsImVsaW1pbmFyX2FydGljdWxvIiwic3BsaWNlIiwicmVtb3ZlIiwiYWdyZWdhcl9jYW50aWRhZCIsImNvbnRhZG9yIiwicHJlY2lvIiwiY2FudGlkYWRfdGFibGEiLCJyb3dzIiwiY2VsbHMiLCJpdGVtIiwiaW5uZXJIVE1MIiwicGFyc2VJbnQiLCJjaGFuZ2UiLCJjaGVja2VkIiwiY2xpY2siLCJmb2N1c291dCIsImNhbGN1bGFyX3Z1ZWx0byIsImtleUNvZGUiLCJwYWdvIiwiZGVzY3VlbnRvIiwiZGVzY3VlbnRvX3NvY2lvIiwiY3JlZGl0b19zb2NpbyIsInZ1ZWx0byIsImRlc2N1ZW50b190b3RhbCIsInJlcHJlc2VudGFyMiIsImNhbGN1bGFyX2F1bWVudG8iLCJwb3JjZW50YWplIiwiYXVtZW50byIsInRvdGFsX2F1bWVudGFkbyJdLCJtYXBwaW5ncyI6IkFBQVk7QUFDQSxJQUFJQSxRQUFRLEdBQVo7QUFDQSxJQUFJQyxzQkFBc0IsR0FBMUI7QUFDQSxJQUFJQyxZQUFZLEdBQWhCO0FBQ0EsSUFBSUMsaUJBQWlCLENBQXJCO0FBQ0EsSUFBSUMscUJBQXFCLENBQXpCO0FBQ0EsSUFBSUMscUJBQXFCLEVBQXpCO0FBQ0EsSUFBSUMsYUFBYSxFQUFqQjtBQUNBO0FBQ0FDLFNBQVNDLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUNDLEtBQXZDLENBQTZDQyxPQUE3QyxHQUF1RCxNQUF2RDtBQUNBSCxTQUFTQyxjQUFULENBQXdCLGVBQXhCLEVBQXlDQyxLQUF6QyxDQUErQ0MsT0FBL0MsR0FBeUQs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a0MsT0FBRixJQUFhLEVBQWpCLEVBQXFCO0FBQ2pCUTtBQUNIO0FBQ0osQ0FKRDtBQUtBLElBQUlBLG1CQUFtQixZQUFVO0FBQzdCO0FBQ0EsUUFBSUMsYUFBYXRHLEVBQUUsZ0JBQUYsRUFBb0JDLEdBQXBCLEVBQWpCO0FBQ0FWLHlCQUFxQitHLFVBQXJCO0FBQ0EsUUFBSUMsVUFBVWxDLFdBQVdsRixLQUFYLElBQW9Cb0csU0FBU2UsVUFBVCxDQUFwQixHQUF5QyxHQUF2RDtBQUNBLFFBQUlFLGtCQUFrQm5DLFdBQVdsRixLQUFYLElBQW9Ca0YsV0FBV2tDLE9BQVgsQ0FBMUM7QUFDQSxRQUFJaEMsY0FBY2lDLGdCQUFnQmhDLE9BQWhCLENBQXdCLENBQXhCLENBQWxCO0FBQ0F4RSxNQUFFLG1CQUFGLEVBQXVCb0QsSUFBdkIsQ0FBNEIsT0FBT21CLFlBQVl6QyxRQUFaLEdBQXVCd0MsT0FBdkIsQ0FBK0IsR0FBL0IsRUFBb0MsR0FBcEMsQ0FBbkM7QUFDSCxDQVJEIiwiZmlsZSI6IjMwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiICAgICAgICAgICAgLyogLS0tLSB2YXJpYWJsZXMgZ2xvYmFsZXMgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gMC4wO1xuICAgICAgICAgICAgdmFyIHRvdGFsX2Nvbl9kZXNjdWVudG8gPSAwLjA7XG4gICAgICAgICAgICB2YXIgcmVzdWx0YWRvID0gMC4wO1xuICAgICAgICAgICAgdmFyIGNvbnRhZG9yX3RhYmxhID0gMDtcbiAgICAgICAgICAgIHZhciBjcmVkaXRvX3BvcmNlbnRhamUgPSAwO1xuICAgICAgICAgICAgdmFyIGFydGljdWxvc192ZW5kaWRvcyA9IFtdO1xuICAgICAgICAgICAgdmFyIGZvcm1hX3BhZ28gPSAnJztcbiAgICAgICAgICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBlZmVjdGl2byAtLS0tICovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgLyogLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGNyw6lkaXRvIC0tLS0gKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcG9yY2VudGFqZScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2NyZWRpdG9fdG90YWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgLyogLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGRlc2N1ZW50byAtLS0tICovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2Rlc2N1ZW50bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAvKiAtLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGxvcyBzb2Npb3MgLS0tKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcHVudG9zX3NvY2lvcycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9jYW5qZWFyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9mb3JtX2VmZWN0aXZvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICAgICAgLyogLS0tLS0tLS0tLS0gaGFiaWxpdGFyIGNhbXBvcyBwYXJhIGNhbmplIGRlIHB1bnRvcyBlbiBzb2NpbyAtLS0qL1xuICAgICAgICAgICAgaGFiaWxpdGFyX2NhbXBvc19jYW5qZSA9IGZ1bmN0aW9uKHNvY2lvKXtcbiAgICAgICAgICAgICAgICAkKCcjaWRfcHVudG9zX3NvY2lvcycpLnZhbChzb2Npby5wdW50b3MpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcHVudG9zX3NvY2lvcycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fZGVfc29jaW8nKS5wcm9wKCBcImNoZWNrZWRcIiwgdHJ1ZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgICAgICAgICB2YXIgc2VsZWNjaW9uX2FydGljdWxvID0gZnVuY3Rpb24oaWQsIGRlc2NyaXBjaW9uLCBtYXJjYSwgcnVicm8sIHByZWNpb192ZW50YSwgcHJlY2lvX2NyZWRpdG8sIHByZWNpb19kZWJpdG8sIHByZWNpb19jb21wcmEsIHN0b2NrLCBwcm92ZWVkb3IsIG5vX3N1bWFfY2FqYSl7XG4gICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkID0gcHJvbXB0KFwiSW5ncmVzZSBsYSBjYW50aWRhZFwiLCBcIlwiKTtcblxuICAgICAgICAgICAgICAgIHZhciBwcmVjaW9fZW52aWFyID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnRpZGFkICE9IG51bGwgJiYgY2FudGlkYWQgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYV9wYWdvKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VmZWN0aXZvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGVzY3VlbnRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3JlZGl0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb19jcmVkaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX2RlYml0bztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vX3N1bWFfY2FqYSl7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKCEoJCgnI2lkX25vX3N1bWFyJykuaXMoJzpjaGVja2VkJykpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVsIMOhcnRpY3VsbyBlc3RhIHRpbGRhZG8gcGFyYSBubyBzdW1hcnNlIGEgY2FqYS4gUGVybyBubyBzZSB0aWxkbyBlbiBlbCBmb3JtdWxhcmlvIGRlIHZlbnRhc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiRGVzZWEgcXVlIGVsIHNpc3RlbWEgdGlsZGUgZWwgY2hlY2sgcG9yIHVzdGVkID8gXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogXCJpbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogWydObywgcG9ycXVlIHF1aWVybyBzdW1hcmxvIGEgY2FqYScsICdTaSwgcG9ycXVlIG5vIGxvIHZveSBhIHN1bWFyIGEgY2FqYSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhbmdlck1vZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCh3aWxsRGVsZXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbGxEZWxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF9ub19zdW1hcicpLnByb3AoIFwiY2hlY2tlZFwiLCB0cnVlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdG90YWwoY2FudGlkYWQsIGlkLCBwcmVjaW9fZW52aWFyKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGFkb3JfdGFibGEgKz0xO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zIHRyOmxhc3QnKS5hZnRlcignPHRyIGlkPVwidHJfJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnXCI+PHRkPicgKyBjYW50aWRhZCArICc8L3RkPicgKyAnPHRkPicgKyBkZXNjcmlwY2lvbiArICc8L3RkPicgKyAnPHRkPiAkJyArIHByZWNpb19lbnZpYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8L3RkPicgKyAgJzx0ZD48YSBvbmNsaWNrPVwiZWxpbWluYXJfYXJ0aWN1bG8oJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBjYW50aWRhZCArICcsJyArIHByZWNpb19lbnZpYXIgKycpXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT4gPC9hPjwvdGQ+PC90cj4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgZ3VhcmRhcl9jb21wcmEgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRvdGFsX2Nvbl9kZXNjdWVudG8gPSByZXN1bHRhZG87XG4gICAgICAgICAgICAgICAgdmFyIG5vX3N1bWFyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIGNhbmplX3NvY2lvcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBjYW5qZV9jcmVkaXRvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIGlkX2Rlc2N1ZW50b19kZV9zb2NpbyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgJCgnI2lkX2J1dHRvbl9ndWFyZGFyX2NvbXByYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgdHJ1ZSApO1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfbm9fc3VtYXInKS5pcygnOmNoZWNrZWQnKSl7bm9fc3VtYXIgPSB0cnVlO31cbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2NhbmplX3NvY2lvcycpLmlzKCc6Y2hlY2tlZCcpKXtjYW5qZV9zb2Npb3MgPSB0cnVlO31cbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2NhbmplX2NyZWRpdG8nKS5pcygnOmNoZWNrZWQnKSl7Y2FuamVfY3JlZGl0byA9IHRydWU7fVxuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvX2RlX3NvY2lvJykuaXMoJzpjaGVja2VkJykpe2lkX2Rlc2N1ZW50b19kZV9zb2NpbyA9IHRydWU7fVxuXG5cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdmVudGFzL2FqYXgvdmVudGFzL2FsdGEvJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZW50YXM6IEpTT04uc3RyaW5naWZ5KGFydGljdWxvc192ZW5kaWRvcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWNoYTogJCgnI2lkX2ZlY2hhJykudmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWRfc29jaW86ICQoJyNpZF9zb2NpbycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9yY2VudGFqZV9kZXNjdWVudG86ICQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsX2Nvbl9kZXNjdWVudG86IHRvdGFsX2Nvbl9kZXNjdWVudG8sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fdmVudGFfdG90YWw6IHRvdGFsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYV9wYWdvOiBmb3JtYV9wYWdvLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9fc3VtYXI6IG5vX3N1bWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVudG9zX3NvY2lvczogJCgnI2lkX3B1bnRvc19zb2Npb3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmplX3NvY2lvczogY2FuamVfc29jaW9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlZGl0b3Nfc29jaW9zOiAkKCcjaWRfY3JlZGl0b19zb2NpbycpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuamVfY3JlZGl0bzogY2FuamVfY3JlZGl0byxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWRpdG9fcG9yY2VudGFqZTogY3JlZGl0b19wb3JjZW50YWplLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWRfZGVzY3VlbnRvX2RlX3NvY2lvOiBpZF9kZXNjdWVudG9fZGVfc29jaW8sXG4gICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3Mpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaXN0ZW1hJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5zdWNjZXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3VjY2VzcydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckIDAuMCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MnKS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy92ZW50YXMvdGlja2V0LycgKyBkYXRhLmlkX3ZlbnRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAvKiAtLS0tIGZ1bmNpb24gcGFyYSBlbCBsZWN0b3IgZGUgY29kaWdvIGRlIGJhcnJhcyAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykua2V5cHJlc3MoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpe1xuXG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdmVudGFzL2FqYXgvY29kaWdvL2FydGljdWxvLycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvZGlnb19hcnRpY3Vsbyc6ICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NyZm1pZGRsZXdhcmV0b2tlbjogJChcImlucHV0W25hbWU9Y3NyZm1pZGRsZXdhcmV0b2tlbl1cIikudmFsKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVsIMOhcnRpY3VsbyBubyBmdWUgZW5jb250cmFkbyBvIGVsIHN0b2NrIGVzIDAuIFZlcmlmaXF1ZSBlbiBsYSBsaXN0YSBkZSDDoXJ0aWN1bG9zIGxvcyBkYXRvcyBjb3JyZXNwb25kaWVudGVzLiBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiRGVzZWEgcmVhbGl6YXIgZWwgcGVkaWRvID8gXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoudGhlbigod2lsbERlbGV0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbGxEZWxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dhbChcIlBvb2YhIFlvdXIgaW1hZ2luYXJ5IGZpbGUgaGFzIGJlZW4gZGVsZXRlZCFcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoXCJFbCBwZWRpZG8gaGEgc2lkbyBlbnZpYWRvXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZWNpb19lbnZpYXIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYV9wYWdvKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VmZWN0aXZvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZXNjdWVudG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NyZWRpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb19jcmVkaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fZGViaXRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWRvcl90YWJsYSArPTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKCcxJywgZGF0YS5pZCwgcHJlY2lvX2Vudmlhcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm5vX3N1bWFfY2FqYSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoJCgnI2lkX25vX3N1bWFyJykuaXMoJzpjaGVja2VkJykpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkVsIMOhcnRpY3VsbyBlc3RhIHRpbGRhZG8gcGFyYSBubyBzdW1hcnNlIGEgY2FqYS4gUGVybyBubyBzZSB0aWxkbyBlbiBlbCBmb3JtdWxhcmlvIGRlIHZlbnRhc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiRGVzZWEgcXVlIGVsIHNpc3RlbWEgdGlsZGUgZWwgY2hlY2sgcG9yIHVzdGVkID8gXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogXCJpbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogWydObywgcG9ycXVlIHF1aWVybyBzdW1hcmxvIGEgY2FqYScsICdTaSwgcG9ycXVlIG5vIGxvIHZveSBhIHN1bWFyIGEgY2FqYSddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhbmdlck1vZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCh3aWxsRGVsZXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbGxEZWxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF9ub19zdW1hcicpLnByb3AoIFwiY2hlY2tlZFwiLCB0cnVlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RhYmxhX2FydGljdWxvcyB0cjpsYXN0JykuYWZ0ZXIoJzx0ciBpZD1cInRyXycgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJ1wiPjx0ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNhbnRpZGFkICsgJzwvdGQ+JyArICc8dGQ+JyArIGRhdGEubm9tYnJlICsgJzwvdGQ+JyArICc8dGQ+ICQnICsgcHJlY2lvX2VudmlhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8L3RkPicgKyAnPHRkPjxhIG9uY2xpY2s9XCJhZ3JlZ2FyX2NhbnRpZGFkKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgZGF0YS5pZCArICcsJyArIHByZWNpb19lbnZpYXIgKyAnKVwiICcgKyAnY2xhc3M9XCJidG4gYnRuLWluZm8gYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPiA8L2E+PGEgb25jbGljaz1cImVsaW1pbmFyX2FydGljdWxvKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgZGF0YS5jYW50aWRhZCArICcsJyArIHByZWNpb19lbnZpYXIgKyAnKVwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT4gPC9hPjwvdGQ+PC90cj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgLyogLS0tLSBmdW5jaW9uIHBhcmEgZWwgbGVjdG9yIGRlIGNvZGlnbyBkZSBiYXJyYXMgLS0tICovXG5cbiAgICAvKiAtLS0tLS0tLS0tIEVzdGEgZnVuY2lvbiBjYWxjdWxhIGVsIHRvdGFsIHkgbGEgY29sb2NhXG4gICAgKioqIC0tLS0tLS0tLS0gZW4gbGEgcGFydGUgaW5mZXJpb3IgZGVsIGZvcm11bGFyaW8gZGUgdmVudGFzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl90b3RhbCA9IGZ1bmN0aW9uKGNhbnRpZGFkLCBpZCwgcHJlY2lvX3ZlbnRhKXtcbiAgICAvKiAtLS0tIEFybWFyIHVuIGFycmF5IGNvbiBsb3MgYXJ0aWN1bG9zIHZlbmRpZG9zIC0tLS0tICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgb2JqWydpZCddID0gaWQ7XG4gICAgICAgICAgICAgICAgICAgIG9ialsnY2FudGlkYWQnXSA9IGNhbnRpZGFkO1xuICAgICAgICAgICAgICAgICAgICBhcnRpY3Vsb3NfdmVuZGlkb3MucHVzaChvYmopO1xuICAgIC8qIC0tLS0gQXJtYXIgdW4gYXJyYXkgY29uIGxvcyBhcnRpY3Vsb3MgdmVuZGlkb3MgLS0tLS0gKi9cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJlY2lvX3ZlbnRhKVxuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSAocGFyc2VGbG9hdChjYW50aWRhZCkgKiBwYXJzZUZsb2F0KHByZWNpb192ZW50YS50b1N0cmluZygpLnJlcGxhY2UoJywnLCAnLicpKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tLS0tLS0tIEVzdGEgZnVuY2lvbiBjYWxjdWxhIGVsIHRvdGFsIHkgbGEgY29sb2NhXG4gICAgLS0tLS0tLS0tLSBlbiBsYSBwYXJ0ZSBpbmZlcmlvciBkZWwgZm9ybXVsYXJpbyBkZSB2ZW50YXMgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBkZXRlY3RhciBxdWUgdGlwbyBkZSBwYWdvIGVzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl90aXBvX3BhZ28gPSBmdW5jdGlvbihmb3JtYV9wYWdvX3BhcmFtZXRybyl7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2ZlY2hhJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fYnVzY2FyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNidXNjYXJfc29jaW8nKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2J1dHRvbl9ndWFyZGFyX2NvbXByYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfbm9fc3VtYXInKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgLy8gUG9uZ28gZGlzYWJsZWQgbGEgc2VsZWNjaW9uIGRlIGxhIGZvcm1hIGRlIHBhZ29cbiAgICAgICAgICAgICAgICBmb3JtYV9wYWdvID0gZm9ybWFfcGFnb19wYXJhbWV0cm87XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gPT0gJ2VmZWN0aXZvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGVmZWN0aXZvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBwYWdvc1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdkZXNjdWVudG8nKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2kgZXMgZGVzY3VlbnRvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBwYWdvcyB5IGRlc2N1ZW50b1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9kZXNjdWVudG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdjcmVkaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGNyZWRpdG8gaGFiaWxpdG8gc3VzIHJlc3BlY3Rpdm9zIGF1bWVudG9zXG4gICAgICAgICAgICAgICAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wb3JjZW50YWplJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfY3JlZGl0b190b3RhbCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBoYWdvIGludmlzaWJsZXMgbGFzIGltYWdlbmVzIGRlIHRpcG9zIGRlIHBhZ29zXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2VmZWN0aXZvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9lZmVjdGl2bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdjcmVkaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9jcmVkaXRvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2RlYml0bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZGViaXRvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2Rlc2N1ZW50bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZGVzY3VlbnRvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBkZXRlY3RhciBxdWUgdGlwbyBkZSBwYWdvIGVzIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gRWxpbWluYXIgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGVsaW1pbmFyX2FydGljdWxvID0gZnVuY3Rpb24oaWQsIGNhbnRpZGFkLCBwcmVjaW9fZW52aWFyKXtcblxuICAgICAgICAgICAgICAgIGFydGljdWxvc192ZW5kaWRvcy5zcGxpY2UoaWQsIDEpO1xuICAgICAgICAgICAgICAgICQoJyN0cl8nICsgaWQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRvdGFsIC09IChwYXJzZUZsb2F0KGNhbnRpZGFkKSAqIHBhcnNlRmxvYXQocHJlY2lvX2Vudmlhci50b1N0cmluZygpLnJlcGxhY2UoJywnLCAnLicpKSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWwudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcblxuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEVsaW1pbmFyIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBhZ3JlZ2FyX2NhbnRpZGFkID0gZnVuY3Rpb24oY29udGFkb3IsIGlkLCBwcmVjaW8pe1xuICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZCA9IHByb21wdChcIkluZ3Jlc2UgbGEgY2FudGlkYWRcIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnRpZGFkICE9IG51bGwgJiYgY2FudGlkYWQgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkX3RhYmxhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZF90YWJsYV9hcnRpY3Vsb3NcIikucm93c1tjb250YWRvciArIDFdLmNlbGxzLml0ZW0oMCkuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkX3RhYmxhX2FydGljdWxvc1wiKS5yb3dzW2NvbnRhZG9yICsgMV0uY2VsbHMuaXRlbSgwKS5pbm5lckhUTUwgPSBwYXJzZUludChjYW50aWRhZF90YWJsYSkgKyBwYXJzZUludChjYW50aWRhZCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKGNhbnRpZGFkLCBpZCwgcHJlY2lvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cblxuICAgIC8qLS0tLS0tIGN1YW5kbyBzZWxlY2Npb25hIGVsIGNhbmplIHNlIGFncmVnYSBsYXMgY2FqYXMgZGUgdGV4dG8gLS0tLSovXG4gICAgJChcIiNpZF9jYW5qZV9zb2Npb3NcIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICQoJyNpZF9jYW5qZV9jcmVkaXRvJykucHJvcCggXCJjaGVja2VkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9jYW5qZWFyJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9lZmVjdGl2bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Zvcm1fY2FuamVhcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKFwiI2lkX2NhbmplX2NyZWRpdG9cIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICQoJyNpZF9jYW5qZV9zb2Npb3MnKS5wcm9wKCBcImNoZWNrZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9mb3JtX2VmZWN0aXZvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9jYW5qZWFyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZm9ybV9lZmVjdGl2bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgdnVlbHRvcyBzaSBlcyBlZmVjdGl2byAtLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcGFnbycpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wYWdvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBkZXNjdWVudG8gcGFyYSBzb2Npb3NcbiAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0gcG9yIGNhZGEgZXZlbnRvIGNhbGN1bGFyIGVsIHZ1ZWx0byAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wYWdvJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcGFnbycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICQoJyNpZF9tb250b19kZXNjdWVudG8nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS5mb2N1c291dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9jcmVkaXRvX3NvY2lvJykuZm9jdXNvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgaWYgKCQoJyNpZF9jcmVkaXRvX3NvY2lvJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG9fc29jaW8nKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcjaWRfZGVzY3VlbnRvX3NvY2lvcycpLmtleXByZXNzKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9kZXNjdWVudG9fc29jaW9zJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG9fc29jaW8nKS5rZXlwcmVzcyhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfY3JlZGl0b19zb2NpbycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF9jcmVkaXRvX3NvY2lvJykudmFsKCcwJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl92dWVsdG8gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8qIC0tLS0tIGNhbGN1bGEgc2kgZXMgZWZlY3Rpdm8gZWwgdnVlbHRvIC0tLS0tICovXG5cbiAgICAgICAgICAgICAgICB2YXIgcGFnbyA9ICQoJyNpZF9wYWdvJykudmFsKCk7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2N1ZW50byA9ICQoJyNpZF9tb250b19kZXNjdWVudG8nKS52YWwoKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVzY3VlbnRvX3NvY2lvID0gJCgnI2lkX2Rlc2N1ZW50b19zb2Npb3MnKS52YWwoKTtcbiAgICAgICAgICAgICAgICB2YXIgY3JlZGl0b19zb2NpbyA9ICQoJyNpZF9jcmVkaXRvX3NvY2lvJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQodG90YWwpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlc2N1ZW50b19zb2NpbylcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2NhbmplX3NvY2lvcycpLmlzKCc6Y2hlY2tlZCcpKXtcbiAgICAgICAgICAgICAgICAgIGlmIChkZXNjdWVudG9fc29jaW8gIT0gJzAnKSB7IC8vIGRlc2N1ZW50byBwYXJhIHNvY2lvc1xuICAgICAgICAgICAgICAgICAgICAgIGRlc2N1ZW50b190b3RhbCA9IChwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlRmxvYXQoZGVzY3VlbnRvX3NvY2lvKSkgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gMC4wO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IHBhcnNlRmxvYXQodG90YWwpIC0gcGFyc2VGbG9hdChkZXNjdWVudG9fdG90YWwpO1xuICAgICAgICAgICAgICAgICAgICAgIHZhciB2dWVsdG8gPSAgcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQocmVzdWx0YWRvKTtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIyID0gcmVzdWx0YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2NhbmplX2NyZWRpdG8nKS5pcygnOmNoZWNrZWQnKSl7XG4gICAgICAgICAgICAgICAgICBpZiAoY3JlZGl0b19zb2NpbyAhPSAnMCcpIHsgLy8gY3JlZGl0byBwYXJhIHNvY2lvc1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdGFkbyA9IDAuMDtcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHRhZG8gPSBwYXJzZUZsb2F0KHRvdGFsKSAtIHBhcnNlRmxvYXQoY3JlZGl0b19zb2Npbyk7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHZ1ZWx0byA9ICBwYXJzZUZsb2F0KHBhZ28pIC0gcGFyc2VGbG9hdChyZXN1bHRhZG8pO1xuICAgICAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhcjIgPSByZXN1bHRhZG8udG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhcjIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvX2RlX3NvY2lvJykuaXMoJzpjaGVja2VkJykpe1xuICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gMC4wO1xuICAgICAgICAgICAgICAgICAgdmFyIGRlc2N1ZW50b19zb2NpbyA9IChwYXJzZUZsb2F0KHRvdGFsKSAqIDUpIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgLSBwYXJzZUZsb2F0KGRlc2N1ZW50b19zb2Npbyk7XG4gICAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gIHBhcnNlRmxvYXQocGFnbykgLSBwYXJzZUZsb2F0KHJlc3VsdGFkbyk7XG4gICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIyID0gcmVzdWx0YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhcjIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlc2N1ZW50bylcbiAgICAgICAgICAgICAgICBpZiAoZGVzY3VlbnRvICE9ICcwJykgeyAvLyBkZXNjdWVudG8gZXh0cmFvcmRpbmFyaW9cbiAgICAgICAgICAgICAgICAgICAgZGVzY3VlbnRvX3RvdGFsID0gKHBhcnNlRmxvYXQodG90YWwpICogcGFyc2VGbG9hdChkZXNjdWVudG8pKSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0YWRvID0gMC4wO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRhZG8gPSBwYXJzZUZsb2F0KHRvdGFsKSAtIHBhcnNlRmxvYXQoZGVzY3VlbnRvX3RvdGFsKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZ1ZWx0byA9ICBwYXJzZUZsb2F0KHBhZ28pIC0gcGFyc2VGbG9hdChyZXN1bHRhZG8pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIyID0gcmVzdWx0YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyMi50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codnVlbHRvKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZ1ZWx0by50b0ZpeGVkKDIpKVxuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHZ1ZWx0by50b0ZpeGVkKDIpO1xuXG4gICAgICAgICAgICAgICAgJCgnI2lkX3Z1ZWx0bycpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSB2dWVsdG9zIHNpIGVzIGVmZWN0aXZvIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIGF1bWVudG8gc2kgZXMgY3JlZGl0byAtLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgLyogLS0tIHBvciBjYWRhIGV2ZW50byBjYWxjdWxhciBlbCB2dWVsdG8gLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGN1bGFyX2F1bWVudG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX21vbnRvX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfbW9udG9fZGVzY3VlbnRvJykua2V5cHJlc3MoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfYXVtZW50bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX2F1bWVudG8gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8qIC0tLS0tIGNhbGN1bGEgc2kgZXMgY3JlZGl0byBlbCBhdW1lbnRvIC0tLS0tICovXG4gICAgICAgICAgICAgICAgdmFyIHBvcmNlbnRhamUgPSAkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGNyZWRpdG9fcG9yY2VudGFqZSA9IHBvcmNlbnRhamU7XG4gICAgICAgICAgICAgICAgdmFyIGF1bWVudG8gPSBwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlSW50KHBvcmNlbnRhamUpLzEwMDtcbiAgICAgICAgICAgICAgICB2YXIgdG90YWxfYXVtZW50YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgKyBwYXJzZUZsb2F0KGF1bWVudG8pO1xuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsX2F1bWVudGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICQoJyNpZF9jcmVkaXRvX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3RhdGljL2FwcHMvdmVudGFzL2pzL29wZXJhY2lvbmVzLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///30\n");

/***/ })

/******/ });