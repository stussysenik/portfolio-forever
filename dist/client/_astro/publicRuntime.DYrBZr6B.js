import{a as o}from"./index.CDAgpjSw.js";const i={mode:"multi-page",navMode:"sidebar",footerEdition:"Made in NYC / Prague by STÜSSY SENIK"};String.raw`
+------------+       +--------------+       +--------+
|  IMAGINE   | ----> |   RE-THINK   | ----> |  SHIP  |
| gather     |       | compress     |       | verify |
| signal     | <---- | simplify     | <---- | land   |
+------------+       +--------------+       +--------+
        \___________ feedback stays live ___________/
`.trim();const l={navItems:[],siteConfig:{...i,mode:"multi-page"},featureFlags:[]},t=o(l);function n(e){return(e??[]).filter(a=>a?.route&&!a.route.startsWith("/admin"))}function s(e){return{...i,mode:"multi-page",...e??{}}}function u(e){return e??[]}function m(e){t.set({navItems:n(e.navItems),siteConfig:s(e.siteConfig),featureFlags:u(e.featureFlags)})}function _(e){t.set({...t.get(),navItems:n(e)})}function c(e){t.set({...t.get(),siteConfig:s(e)})}function d(e){t.set({...t.get(),featureFlags:u(e)})}function p(e,a){return e.featureFlags.find(r=>r.key==="wip-banner")?.enabled??a}export{c as a,d as b,p as g,t as p,m as s,_ as u};
