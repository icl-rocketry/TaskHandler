function C(){}function q(n,t){for(const e in t)n[e]=t[e];return n}function M(n){return n()}function K(){return Object.create(null)}function P(n){n.forEach(M)}function Q(n){return typeof n=="function"}function R(n,t){return n!=n?t==t:n!==t||n&&typeof n=="object"||typeof n=="function"}let m;function V(n,t){return m||(m=document.createElement("a")),m.href=t,n===m.href}function X(n){return Object.keys(n).length===0}function B(n,...t){if(n==null){for(const i of t)i(void 0);return C}const e=n.subscribe(...t);return e.unsubscribe?()=>e.unsubscribe():e}function Y(n,t,e){n.$$.on_destroy.push(B(t,e))}function Z(n,t,e,i){if(n){const c=N(n,t,e,i);return n[0](c)}}function N(n,t,e,i){return n[1]&&i?q(e.ctx.slice(),n[1](i(t))):e.ctx}function $(n,t,e,i){if(n[2]&&i){const c=n[2](i(e));if(t.dirty===void 0)return c;if(typeof c=="object"){const s=[],r=Math.max(t.dirty.length,c.length);for(let u=0;u<r;u+=1)s[u]=t.dirty[u]|c[u];return s}return t.dirty|c}return t.dirty}function nn(n,t,e,i,c,s){if(c){const r=N(t,e,i,s);n.p(r,c)}}function tn(n){if(n.ctx.length>32){const t=[],e=n.ctx.length/32;for(let i=0;i<e;i++)t[i]=-1;return t}return-1}function en(n){return n??""}let b=!1;function cn(){b=!0}function rn(){b=!1}function D(n,t,e,i){for(;n<t;){const c=n+(t-n>>1);e(c)<=i?n=c+1:t=c}return n}function L(n){if(n.hydrate_init)return;n.hydrate_init=!0;let t=n.childNodes;if(n.nodeName==="HEAD"){const l=[];for(let a=0;a<t.length;a++){const o=t[a];o.claim_order!==void 0&&l.push(o)}t=l}const e=new Int32Array(t.length+1),i=new Int32Array(t.length);e[0]=-1;let c=0;for(let l=0;l<t.length;l++){const a=t[l].claim_order,o=(c>0&&t[e[c]].claim_order<=a?c+1:D(1,c,S=>t[e[S]].claim_order,a))-1;i[l]=e[o]+1;const E=o+1;e[E]=l,c=Math.max(E,c)}const s=[],r=[];let u=t.length-1;for(let l=e[c]+1;l!=0;l=i[l-1]){for(s.push(t[l-1]);u>=l;u--)r.push(t[u]);u--}for(;u>=0;u--)r.push(t[u]);s.reverse(),r.sort((l,a)=>l.claim_order-a.claim_order);for(let l=0,a=0;l<r.length;l++){for(;a<s.length&&r[l].claim_order>=s[a].claim_order;)a++;const o=a<s.length?s[a]:null;n.insertBefore(r[l],o)}}function O(n,t){if(b){for(L(n),(n.actual_end_child===void 0||n.actual_end_child!==null&&n.actual_end_child.parentNode!==n)&&(n.actual_end_child=n.firstChild);n.actual_end_child!==null&&n.actual_end_child.claim_order===void 0;)n.actual_end_child=n.actual_end_child.nextSibling;t!==n.actual_end_child?(t.claim_order!==void 0||t.parentNode!==n)&&n.insertBefore(t,n.actual_end_child):n.actual_end_child=t.nextSibling}else(t.parentNode!==n||t.nextSibling!==null)&&n.appendChild(t)}function ln(n,t,e){b&&!e?O(n,t):(t.parentNode!==n||t.nextSibling!=e)&&n.insertBefore(t,e||null)}function un(n){n.parentNode&&n.parentNode.removeChild(n)}function sn(n,t){for(let e=0;e<n.length;e+=1)n[e]&&n[e].d(t)}function T(n){return document.createElement(n)}function v(n){return document.createTextNode(n)}function an(){return v(" ")}function on(){return v("")}function fn(n,t,e,i){return n.addEventListener(t,e,i),()=>n.removeEventListener(t,e,i)}function _n(n,t,e){e==null?n.removeAttribute(t):n.getAttribute(t)!==e&&n.setAttribute(t,e)}function dn(n){return n.dataset.svelteH}function hn(n){return Array.from(n.childNodes)}function H(n){n.claim_info===void 0&&(n.claim_info={last_index:0,total_claimed:0})}function A(n,t,e,i,c=!1){H(n);const s=(()=>{for(let r=n.claim_info.last_index;r<n.length;r++){const u=n[r];if(t(u)){const l=e(u);return l===void 0?n.splice(r,1):n[r]=l,c||(n.claim_info.last_index=r),u}}for(let r=n.claim_info.last_index-1;r>=0;r--){const u=n[r];if(t(u)){const l=e(u);return l===void 0?n.splice(r,1):n[r]=l,c?l===void 0&&n.claim_info.last_index--:n.claim_info.last_index=r,u}}return i()})();return s.claim_order=n.claim_info.total_claimed,n.claim_info.total_claimed+=1,s}function z(n,t,e,i){return A(n,c=>c.nodeName===t,c=>{const s=[];for(let r=0;r<c.attributes.length;r++){const u=c.attributes[r];e[u.name]||s.push(u.name)}s.forEach(r=>c.removeAttribute(r))},()=>i(t))}function mn(n,t,e){return z(n,t,e,T)}function F(n,t){return A(n,e=>e.nodeType===3,e=>{const i=""+t;if(e.data.startsWith(i)){if(e.data.length!==i.length)return e.splitText(i.length)}else e.data=i},()=>v(t),!0)}function pn(n){return F(n," ")}function bn(n,t){t=""+t,n.data!==t&&(n.data=t)}function yn(n,t,e,i){e==null?n.style.removeProperty(t):n.style.setProperty(t,e,i?"important":"")}function I(n,t,{bubbles:e=!1,cancelable:i=!1}={}){return new CustomEvent(n,{detail:t,bubbles:e,cancelable:i})}function xn(n,t){return new n(t)}let p;function y(n){p=n}function h(){if(!p)throw new Error("Function called outside component initialization");return p}function gn(n){h().$$.before_update.push(n)}function kn(n){h().$$.on_mount.push(n)}function vn(n){h().$$.after_update.push(n)}function En(n){h().$$.on_destroy.push(n)}function wn(){const n=h();return(t,e,{cancelable:i=!1}={})=>{const c=n.$$.callbacks[t];if(c){const s=I(t,e,{cancelable:i});return c.slice().forEach(r=>{r.call(n,s)}),!s.defaultPrevented}return!0}}function Nn(n,t){const e=n.$$.callbacks[t.type];e&&e.slice().forEach(i=>i.call(this,t))}const d=[],w=[];let _=[];const g=[],j=Promise.resolve();let k=!1;function U(){k||(k=!0,j.then(G))}function An(){return U(),j}function W(n){_.push(n)}function jn(n){g.push(n)}const x=new Set;let f=0;function G(){if(f!==0)return;const n=p;do{try{for(;f<d.length;){const t=d[f];f++,y(t),J(t.$$)}}catch(t){throw d.length=0,f=0,t}for(y(null),d.length=0,f=0;w.length;)w.pop()();for(let t=0;t<_.length;t+=1){const e=_[t];x.has(e)||(x.add(e),e())}_.length=0}while(d.length);for(;g.length;)g.pop()();k=!1,x.clear(),y(n)}function J(n){if(n.fragment!==null){n.update(),P(n.before_update);const t=n.dirty;n.dirty=[-1],n.fragment&&n.fragment.p(n.ctx,t),n.after_update.forEach(W)}}function Sn(n){const t=[],e=[];_.forEach(i=>n.indexOf(i)===-1?t.push(i):e.push(i)),e.forEach(i=>i()),_=t}export{dn as A,gn as B,wn as C,En as D,jn as E,fn as F,Nn as G,en as H,sn as I,V as J,P as K,K as L,G as M,Q as N,X as O,W as P,Sn as Q,p as R,y as S,M as T,d as U,U as V,cn as W,rn as X,an as a,vn as b,pn as c,un as d,on as e,T as f,mn as g,hn as h,ln as i,_n as j,yn as k,v as l,F as m,bn as n,kn as o,w as p,xn as q,Z as r,R as s,An as t,nn as u,tn as v,$ as w,O as x,C as y,Y as z};