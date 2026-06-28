import{j as r,y as t}from"./index-C_QsQbeP.js";/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a=r("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]),i={generate:e=>t.post("/trips/generate",e),save:e=>t.post("/trips",e),getAll:e=>t.get("/trips",{params:e}),getById:e=>t.get(`/trips/${e}`),getByShareToken:e=>t.get(`/trips/shared/${e}`),update:(e,s)=>t.put(`/trips/${e}`,s),delete:e=>t.delete(`/trips/${e}`),share:e=>t.post(`/trips/${e}/share`),getStats:()=>t.get("/trips/stats")};export{a as C,i as t};
