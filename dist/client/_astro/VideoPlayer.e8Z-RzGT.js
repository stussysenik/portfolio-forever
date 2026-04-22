import{j as Au}from"./jsx-runtime.u17CrQMm.js";import{h as Tu}from"./constants.DNayjJm4.js";import{m as zi,r as Qi}from"./index.DDyDxWu1.js";import{generatePlayerInitTime as yu}from"./index.CGgykuZ0.js";const E={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_TOGGLE_SUBTITLES_REQUEST:"mediatogglesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},w={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},wl={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_BUFFERED:"mediaBuffered",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_CHAPTERS_CUES:"mediaChaptersCues",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_ENDED:"mediaEnded",MEDIA_ERROR:"mediaError",MEDIA_ERROR_CODE:"mediaErrorCode",MEDIA_ERROR_MESSAGE:"mediaErrorMessage",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_HEIGHT:"mediaHeight",MEDIA_IS_AIRPLAYING:"mediaIsAirplaying",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_IS_PIP:"mediaIsPip",MEDIA_LOADING:"mediaLoading",MEDIA_MUTED:"mediaMuted",MEDIA_PAUSED:"mediaPaused",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_PREVIEW_CHAPTER:"mediaPreviewChapter",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_WIDTH:"mediaWidth"},Ml=Object.entries(wl),r=Ml.reduce((t,[e,i])=>(t[e]=i.toLowerCase(),t),{}),ku={USER_INACTIVE_CHANGE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange",BREAKPOINTS_COMPUTED:"breakpointscomputed"},It=Ml.reduce((t,[e,i])=>(t[e]=i.toLowerCase(),t),{...ku});Object.entries(It).reduce((t,[e,i])=>{const a=r[e];return a&&(t[i]=a),t},{userinactivechange:"userinactive"});const Su=Object.entries(r).reduce((t,[e,i])=>{const a=It[e];return a&&(t[i]=a),t},{userinactive:"userinactivechange"}),Oe={SUBTITLES:"subtitles",CAPTIONS:"captions",CHAPTERS:"chapters",METADATA:"metadata"},ei={DISABLED:"disabled",SHOWING:"showing"},Po={MOUSE:"mouse",TOUCH:"touch"},oe={UNAVAILABLE:"unavailable",UNSUPPORTED:"unsupported"},Be={LIVE:"live",ON_DEMAND:"on-demand",UNKNOWN:"unknown"},Iu={FULLSCREEN:"fullscreen"};function wu(t){return t?.map(Lu).join(" ")}function Mu(t){return t?.split(/\s+/).map(Cu)}function Lu(t){if(t){const{id:e,width:i,height:a}=t;return[e,i,a].filter(n=>n!=null).join(":")}}function Cu(t){if(t){const[e,i,a]=t.split(":");return{id:e,width:+i,height:+a}}}function Ru(t){return t?.map(xu).join(" ")}function Du(t){return t?.split(/\s+/).map(Ou)}function xu(t){if(t){const{id:e,kind:i,language:a,label:n}=t;return[e,i,a,n].filter(s=>s!=null).join(":")}}function Ou(t){if(t){const[e,i,a,n]=t.split(":");return{id:e,kind:i,language:a,label:n}}}function Pu(t){return t.replace(/[-_]([a-z])/g,(e,i)=>i.toUpperCase())}function br(t){return typeof t=="number"&&!Number.isNaN(t)&&Number.isFinite(t)}function Ll(t){return typeof t!="string"?!1:!isNaN(t)&&!isNaN(parseFloat(t))}const Cl=t=>new Promise(e=>setTimeout(e,t)),Uo=[{singular:"hour",plural:"hours"},{singular:"minute",plural:"minutes"},{singular:"second",plural:"seconds"}],Uu=(t,e)=>{const i=t===1?Uo[e].singular:Uo[e].plural;return`${t} ${i}`},Wi=t=>{if(!br(t))return"";const e=Math.abs(t),i=e!==t,a=new Date(0,0,0,0,0,e,0);return`${[a.getHours(),a.getMinutes(),a.getSeconds()].map((l,u)=>l&&Uu(l,u)).filter(l=>l).join(", ")}${i?" remaining":""}`};function at(t,e){let i=!1;t<0&&(i=!0,t=0-t),t=t<0?0:t;let a=Math.floor(t%60),n=Math.floor(t/60%60),s=Math.floor(t/3600);const o=Math.floor(e/60%60),l=Math.floor(e/3600);return(isNaN(t)||t===1/0)&&(s=n=a="0"),s=s>0||l>0?s+":":"",n=((s||o>=10)&&n<10?"0"+n:n)+":",a=a<10?"0"+a:a,(i?"-":"")+s+n+a}const $u={"Start airplay":"Start airplay","Stop airplay":"Stop airplay",Audio:"Audio",Captions:"Captions","Enable captions":"Enable captions","Disable captions":"Disable captions","Start casting":"Start casting","Stop casting":"Stop casting","Enter fullscreen mode":"Enter fullscreen mode","Exit fullscreen mode":"Exit fullscreen mode",Mute:"Mute",Unmute:"Unmute","Enter picture in picture mode":"Enter picture in picture mode","Exit picture in picture mode":"Exit picture in picture mode",Play:"Play",Pause:"Pause","Playback rate":"Playback rate","Playback rate {playbackRate}":"Playback rate {playbackRate}",Quality:"Quality","Seek backward":"Seek backward","Seek forward":"Seek forward",Settings:"Settings",Auto:"Auto","audio player":"audio player","video player":"video player",volume:"volume",seek:"seek","closed captions":"closed captions","current playback rate":"current playback rate","playback time":"playback time","media loading":"media loading",settings:"settings","audio tracks":"audio tracks",quality:"quality",play:"play",pause:"pause",mute:"mute",unmute:"unmute",live:"live",Off:"Off","start airplay":"start airplay","stop airplay":"stop airplay","start casting":"start casting","stop casting":"stop casting","enter fullscreen mode":"enter fullscreen mode","exit fullscreen mode":"exit fullscreen mode","enter picture in picture mode":"enter picture in picture mode","exit picture in picture mode":"exit picture in picture mode","seek to live":"seek to live","playing live":"playing live","seek back {seekOffset} seconds":"seek back {seekOffset} seconds","seek forward {seekOffset} seconds":"seek forward {seekOffset} seconds","Network Error":"Network Error","Decode Error":"Decode Error","Source Not Supported":"Source Not Supported","Encryption Error":"Encryption Error","A network error caused the media download to fail.":"A network error caused the media download to fail.","A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.","An unsupported error occurred. The server or network failed, or your browser does not support this format.":"An unsupported error occurred. The server or network failed, or your browser does not support this format.","The media is encrypted and there are no keys to decrypt it.":"The media is encrypted and there are no keys to decrypt it."};var $o;const ls={en:$u};let _s=(($o=globalThis.navigator)==null?void 0:$o.language)||"en";const Nu=t=>{_s=t},Hu=t=>{var e,i,a;const[n]=_s.split("-");return((e=ls[_s])==null?void 0:e[t])||((i=ls[n])==null?void 0:i[t])||((a=ls.en)==null?void 0:a[t])||t},v=(t,e={})=>Hu(t).replace(/\{(\w+)\}/g,(i,a)=>a in e?String(e[a]):`{${a}}`);class Rl{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}}class Dl extends Rl{}class No extends Dl{constructor(){super(...arguments),this.role=null}}class Bu{observe(){}unobserve(){}disconnect(){}}const xl={createElement:function(){return new Zi.HTMLElement},createElementNS:function(){return new Zi.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent(t){return!1}},Zi={ResizeObserver:Bu,document:xl,Node:Dl,Element:No,HTMLElement:class extends No{constructor(){super(...arguments),this.innerHTML=""}get content(){return new Zi.DocumentFragment}},DocumentFragment:class extends Rl{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem(t){return null},setItem(t,e){},removeItem(t){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return""}},matchMedia(t){return{matches:!1,media:t}},DOMParser:class{parseFromString(e,i){return{body:{textContent:e}}}}},Ol=typeof window>"u"||typeof window.customElements>"u",Pl=Object.keys(Zi).every(t=>t in globalThis),d=Ol&&!Pl?Zi:globalThis,G=Ol&&!Pl?xl:globalThis.document,Ho=new WeakMap,_r=t=>{let e=Ho.get(t);return e||Ho.set(t,e=new Set),e},Ul=new d.ResizeObserver(t=>{for(const e of t)for(const i of _r(e.target))i(e)});function ri(t,e){_r(t).add(e),Ul.observe(t)}function oi(t,e){const i=_r(t);i.delete(e),i.size||Ul.unobserve(t)}function se(t){const e={};for(const i of t)e[i.name]=i.value;return e}function ue(t){var e;return(e=As(t))!=null?e:hi(t,"media-controller")}function As(t){var e;const{MEDIA_CONTROLLER:i}=w,a=t.getAttribute(i);if(a)return(e=Qn(t))==null?void 0:e.getElementById(a)}const $l=(t,e,i=".value")=>{const a=t.querySelector(i);a&&(a.textContent=e)},Wu=(t,e)=>{const i=`slot[name="${e}"]`,a=t.shadowRoot.querySelector(i);return a?a.children:[]},Nl=(t,e)=>Wu(t,e)[0],Fe=(t,e)=>!t||!e?!1:t?.contains(e)?!0:Fe(t,e.getRootNode().host),hi=(t,e)=>{if(!t)return null;const i=t.closest(e);return i||hi(t.getRootNode().host,e)};function Ar(t=document){var e;const i=t?.activeElement;return i?(e=Ar(i.shadowRoot))!=null?e:i:null}function Qn(t){var e;const i=(e=t?.getRootNode)==null?void 0:e.call(t);return i instanceof ShadowRoot||i instanceof Document?i:null}function Hl(t,{depth:e=3,checkOpacity:i=!0,checkVisibilityCSS:a=!0}={}){if(t.checkVisibility)return t.checkVisibility({checkOpacity:i,checkVisibilityCSS:a});let n=t;for(;n&&e>0;){const s=getComputedStyle(n);if(i&&s.opacity==="0"||a&&s.visibility==="hidden"||s.display==="none")return!1;n=n.parentElement,e--}return!0}function Fu(t,e,i,a){const n=a.x-i.x,s=a.y-i.y,o=n*n+s*s;if(o===0)return 0;const l=((t-i.x)*n+(e-i.y)*s)/o;return Math.max(0,Math.min(1,l))}function F(t,e){const i=Vu(t,a=>a===e);return i||Bl(t,e)}function Vu(t,e){var i,a;let n;for(n of(i=t.querySelectorAll("style:not([media])"))!=null?i:[]){let s;try{s=(a=n.sheet)==null?void 0:a.cssRules}catch{continue}for(const o of s??[])if(e(o.selectorText))return o}}function Bl(t,e){var i,a;const n=(i=t.querySelectorAll("style:not([media])"))!=null?i:[],s=n?.[n.length-1];return s?.sheet?(s?.sheet.insertRule(`${e}{}`,s.sheet.cssRules.length),(a=s.sheet.cssRules)==null?void 0:a[s.sheet.cssRules.length-1]):(console.warn("Media Chrome: No style sheet found on style tag of",t),{style:{setProperty:()=>{},removeProperty:()=>"",getPropertyValue:()=>""}})}function O(t,e,i=Number.NaN){const a=t.getAttribute(e);return a!=null?+a:i}function H(t,e,i){const a=+i;if(i==null||Number.isNaN(a)){t.hasAttribute(e)&&t.removeAttribute(e);return}O(t,e,void 0)!==a&&t.setAttribute(e,`${a}`)}function k(t,e){return t.hasAttribute(e)}function S(t,e,i){if(i==null){t.hasAttribute(e)&&t.removeAttribute(e);return}k(t,e)!=i&&t.toggleAttribute(e,i)}function P(t,e,i=null){var a;return(a=t.getAttribute(e))!=null?a:i}function U(t,e,i){if(i==null){t.hasAttribute(e)&&t.removeAttribute(e);return}const a=`${i}`;P(t,e,void 0)!==a&&t.setAttribute(e,a)}var Wl=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ke=(t,e,i)=>(Wl(t,e,"read from private field"),i?i.call(t):e.get(t)),Gu=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ia=(t,e,i,a)=>(Wl(t,e,"write to private field"),e.set(t,i),i),j;function Ku(t){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
        box-sizing: border-box;
      }
    </style>
  `}class Zn extends d.HTMLElement{constructor(){if(super(),Gu(this,j,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=se(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[w.MEDIA_CONTROLLER,r.MEDIA_PAUSED]}attributeChangedCallback(e,i,a){var n,s,o,l,u;e===w.MEDIA_CONTROLLER&&(i&&((s=(n=Ke(this,j))==null?void 0:n.unassociateElement)==null||s.call(n,this),Ia(this,j,null)),a&&this.isConnected&&(Ia(this,j,(o=this.getRootNode())==null?void 0:o.getElementById(a)),(u=(l=Ke(this,j))==null?void 0:l.associateElement)==null||u.call(l,this)))}connectedCallback(){var e,i,a,n;this.tabIndex=-1,this.setAttribute("aria-hidden","true"),Ia(this,j,qu(this)),this.getAttribute(w.MEDIA_CONTROLLER)&&((i=(e=Ke(this,j))==null?void 0:e.associateElement)==null||i.call(e,this)),(a=Ke(this,j))==null||a.addEventListener("pointerdown",this),(n=Ke(this,j))==null||n.addEventListener("click",this)}disconnectedCallback(){var e,i,a,n;this.getAttribute(w.MEDIA_CONTROLLER)&&((i=(e=Ke(this,j))==null?void 0:e.unassociateElement)==null||i.call(e,this)),(a=Ke(this,j))==null||a.removeEventListener("pointerdown",this),(n=Ke(this,j))==null||n.removeEventListener("click",this),Ia(this,j,null)}handleEvent(e){var i;const a=(i=e.composedPath())==null?void 0:i[0];if(["video","media-controller"].includes(a?.localName)){if(e.type==="pointerdown")this._pointerType=e.pointerType;else if(e.type==="click"){const{clientX:s,clientY:o}=e,{left:l,top:u,width:c,height:f}=this.getBoundingClientRect(),g=s-l,h=o-u;if(g<0||h<0||g>c||h>f||c===0&&f===0)return;const{pointerType:p=this._pointerType}=e;if(this._pointerType=void 0,p===Po.TOUCH){this.handleTap(e);return}else if(p===Po.MOUSE){this.handleMouseClick(e);return}}}}get mediaPaused(){return k(this,r.MEDIA_PAUSED)}set mediaPaused(e){S(this,r.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(e){const i=this.mediaPaused?E.MEDIA_PLAY_REQUEST:E.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new d.CustomEvent(i,{composed:!0,bubbles:!0}))}}j=new WeakMap;Zn.shadowRootOptions={mode:"open"};Zn.getTemplateHTML=Ku;function qu(t){var e;const i=t.getAttribute(w.MEDIA_CONTROLLER);return i?(e=t.getRootNode())==null?void 0:e.getElementById(i):hi(t,"media-controller")}d.customElements.get("media-gesture-receiver")||d.customElements.define("media-gesture-receiver",Zn);var Bo=Zn,Tr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ne=(t,e,i)=>(Tr(t,e,"read from private field"),i?i.call(t):e.get(t)),ie=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},dt=(t,e,i,a)=>(Tr(t,e,"write to private field"),e.set(t,i),i),de=(t,e,i)=>(Tr(t,e,"access private method"),i),Cn,Pt,Xi,Zt,Fa,Ts,Fl,Ii,Va,ys,Vl,ks,Gl,Ji,Xn,Jn,yr,li,ji;const b={AUDIO:"audio",AUTOHIDE:"autohide",BREAKPOINTS:"breakpoints",GESTURES_DISABLED:"gesturesdisabled",KEYBOARD_CONTROL:"keyboardcontrol",NO_AUTOHIDE:"noautohide",USER_INACTIVE:"userinactive",AUTOHIDE_OVER_CONTROLS:"autohideovercontrols"};function Yu(t){return`
    <style>
      
      :host([${r.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
        outline: none;
      }

      :host {
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        line-height: 0;
        background-color: var(--media-background-color, #000);
      }

      :host(:not([${b.AUDIO}])) [part~=layer]:not([part~=media-layer]) {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: column nowrap;
        align-items: start;
        pointer-events: none;
        background: none;
      }

      slot[name=media] {
        display: var(--media-slot-display, contents);
      }

      
      :host([${b.AUDIO}]) slot[name=media] {
        display: var(--media-slot-display, none);
      }

      
      :host([${b.AUDIO}]) [part~=layer][part~=gesture-layer] {
        height: 0;
        display: block;
      }

      
      :host(:not([${b.AUDIO}])[${b.GESTURES_DISABLED}]) ::slotted([slot=gestures-chrome]),
          :host(:not([${b.AUDIO}])[${b.GESTURES_DISABLED}]) media-gesture-receiver[slot=gestures-chrome] {
        display: none;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
        pointer-events: auto;
      }

      :host(:not([${b.AUDIO}])) *[part~=layer][part~=centered-layer] {
        align-items: center;
        justify-content: center;
      }

      :host(:not([${b.AUDIO}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
      :host(:not([${b.AUDIO}])) media-gesture-receiver[slot=gestures-chrome] {
        align-self: stretch;
        flex-grow: 1;
      }

      slot[name=middle-chrome] {
        display: inline;
        flex-grow: 1;
        pointer-events: none;
        background: none;
      }

      
      ::slotted([slot=media]),
      ::slotted([slot=poster]) {
        width: 100%;
        height: 100%;
      }

      
      :host(:not([${b.AUDIO}])) .spacer {
        flex-grow: 1;
      }

      
      :host(:-webkit-full-screen) {
        
        width: 100% !important;
        height: 100% !important;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not([${b.NO_AUTOHIDE}]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
      }

      
      :host([${b.USER_INACTIVE}]:not([${r.MEDIA_PAUSED}]):not([${r.MEDIA_IS_AIRPLAYING}]):not([${r.MEDIA_IS_CASTING}]):not([${b.AUDIO}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${b.NO_AUTOHIDE}]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${b.USER_INACTIVE}]:not([${b.NO_AUTOHIDE}]):not([${r.MEDIA_PAUSED}]):not([${r.MEDIA_IS_CASTING}]):not([${b.AUDIO}])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${b.USER_INACTIVE}][${b.AUTOHIDE_OVER_CONTROLS}]:not([${b.NO_AUTOHIDE}]):not([${r.MEDIA_PAUSED}]):not([${r.MEDIA_IS_CASTING}]):not([${b.AUDIO}])) * {
        --media-cursor: none;
        cursor: none;
      }


      ::slotted(media-control-bar)  {
        align-self: stretch;
      }

      
      :host(:not([${b.AUDIO}])[${r.MEDIA_HAS_PLAYED}]) slot[name=poster] {
        display: none;
      }

      ::slotted([role=dialog]) {
        width: 100%;
        height: 100%;
        align-self: center;
      }

      ::slotted([role=menu]) {
        align-self: end;
      }
    </style>

    <slot name="media" part="layer media-layer"></slot>
    <slot name="poster" part="layer poster-layer"></slot>
    <slot name="gestures-chrome" part="layer gesture-layer">
      <media-gesture-receiver slot="gestures-chrome">
        <template shadowrootmode="${Bo.shadowRootOptions.mode}">
          ${Bo.getTemplateHTML({})}
        </template>
      </media-gesture-receiver>
    </slot>
    <span part="layer vertical-layer">
      <slot name="top-chrome" part="top chrome"></slot>
      <slot name="middle-chrome" part="middle chrome"></slot>
      <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
      
      <slot part="bottom chrome"></slot>
    </span>
    <slot name="dialog" part="layer dialog-layer"></slot>
  `}const zu=Object.values(r),Qu="sm:384 md:576 lg:768 xl:960";function Zu(t){Kl(t.target,t.contentRect.width)}function Kl(t,e){var i;if(!t.isConnected)return;const a=(i=t.getAttribute(b.BREAKPOINTS))!=null?i:Qu,n=Xu(a),s=Ju(n,e);let o=!1;if(Object.keys(n).forEach(l=>{if(s.includes(l)){t.hasAttribute(`breakpoint${l}`)||(t.setAttribute(`breakpoint${l}`,""),o=!0);return}t.hasAttribute(`breakpoint${l}`)&&(t.removeAttribute(`breakpoint${l}`),o=!0)}),o){const l=new CustomEvent(It.BREAKPOINTS_CHANGE,{detail:s});t.dispatchEvent(l)}t.breakpointsComputed||(t.breakpointsComputed=!0,t.dispatchEvent(new CustomEvent(It.BREAKPOINTS_COMPUTED,{bubbles:!0,composed:!0})))}function Xu(t){const e=t.split(/\s+/);return Object.fromEntries(e.map(i=>i.split(":")))}function Ju(t,e){return Object.keys(t).filter(i=>e>=parseInt(t[i]))}class jn extends d.HTMLElement{constructor(){if(super(),ie(this,Ts),ie(this,ys),ie(this,ks),ie(this,Ji),ie(this,Jn),ie(this,li),ie(this,Cn,0),ie(this,Pt,null),ie(this,Xi,null),ie(this,Zt,void 0),this.breakpointsComputed=!1,ie(this,Fa,new MutationObserver(de(this,Ts,Fl).bind(this))),ie(this,Ii,!1),ie(this,Va,i=>{ne(this,Ii)||(setTimeout(()=>{Zu(i),dt(this,Ii,!1)},0),dt(this,Ii,!0))}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const i=se(this.attributes),a=this.constructor.getTemplateHTML(i);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(a):this.shadowRoot.innerHTML=a}const e=this.querySelector(":scope > slot[slot=media]");e&&e.addEventListener("slotchange",()=>{if(!e.assignedElements({flatten:!0}).length){ne(this,Pt)&&this.mediaUnsetCallback(ne(this,Pt));return}this.handleMediaUpdated(this.media)})}static get observedAttributes(){return[b.AUTOHIDE,b.GESTURES_DISABLED].concat(zu).filter(e=>![r.MEDIA_RENDITION_LIST,r.MEDIA_AUDIO_TRACK_LIST,r.MEDIA_CHAPTERS_CUES,r.MEDIA_WIDTH,r.MEDIA_HEIGHT,r.MEDIA_ERROR,r.MEDIA_ERROR_MESSAGE].includes(e))}attributeChangedCallback(e,i,a){e.toLowerCase()==b.AUTOHIDE&&(this.autohide=a)}get media(){let e=this.querySelector(":scope > [slot=media]");return e?.nodeName=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}async handleMediaUpdated(e){e&&(dt(this,Pt,e),e.localName.includes("-")&&await d.customElements.whenDefined(e.localName),this.mediaSetCallback(e))}connectedCallback(){var e;ne(this,Fa).observe(this,{childList:!0,subtree:!0}),ri(this,ne(this,Va));const i=this.getAttribute(b.AUDIO)!=null,a=v(i?"audio player":"video player");this.setAttribute("role","region"),this.setAttribute("aria-label",a),this.handleMediaUpdated(this.media),this.setAttribute(b.USER_INACTIVE,""),Kl(this,this.getBoundingClientRect().width),this.addEventListener("pointerdown",this),this.addEventListener("pointermove",this),this.addEventListener("pointerup",this),this.addEventListener("mouseleave",this),this.addEventListener("keyup",this),(e=d.window)==null||e.addEventListener("mouseup",this)}disconnectedCallback(){var e;ne(this,Fa).disconnect(),oi(this,ne(this,Va)),this.media&&this.mediaUnsetCallback(this.media),(e=d.window)==null||e.removeEventListener("mouseup",this)}mediaSetCallback(e){}mediaUnsetCallback(e){dt(this,Pt,null)}handleEvent(e){switch(e.type){case"pointerdown":dt(this,Cn,e.timeStamp);break;case"pointermove":de(this,ys,Vl).call(this,e);break;case"pointerup":de(this,ks,Gl).call(this,e);break;case"mouseleave":de(this,Ji,Xn).call(this);break;case"mouseup":this.removeAttribute(b.KEYBOARD_CONTROL);break;case"keyup":de(this,li,ji).call(this),this.setAttribute(b.KEYBOARD_CONTROL,"");break}}set autohide(e){const i=Number(e);dt(this,Zt,isNaN(i)?0:i)}get autohide(){return(ne(this,Zt)===void 0?2:ne(this,Zt)).toString()}get breakpoints(){return P(this,b.BREAKPOINTS)}set breakpoints(e){U(this,b.BREAKPOINTS,e)}get audio(){return k(this,b.AUDIO)}set audio(e){S(this,b.AUDIO,e)}get gesturesDisabled(){return k(this,b.GESTURES_DISABLED)}set gesturesDisabled(e){S(this,b.GESTURES_DISABLED,e)}get keyboardControl(){return k(this,b.KEYBOARD_CONTROL)}set keyboardControl(e){S(this,b.KEYBOARD_CONTROL,e)}get noAutohide(){return k(this,b.NO_AUTOHIDE)}set noAutohide(e){S(this,b.NO_AUTOHIDE,e)}get autohideOverControls(){return k(this,b.AUTOHIDE_OVER_CONTROLS)}set autohideOverControls(e){S(this,b.AUTOHIDE_OVER_CONTROLS,e)}get userInteractive(){return k(this,b.USER_INACTIVE)}set userInteractive(e){S(this,b.USER_INACTIVE,e)}}Cn=new WeakMap;Pt=new WeakMap;Xi=new WeakMap;Zt=new WeakMap;Fa=new WeakMap;Ts=new WeakSet;Fl=function(t){const e=this.media;for(const i of t){if(i.type!=="childList")continue;const a=i.removedNodes;for(const n of a){if(n.slot!="media"||i.target!=this)continue;let s=i.previousSibling&&i.previousSibling.previousElementSibling;if(!s||!e)this.mediaUnsetCallback(n);else{let o=s.slot!=="media";for(;(s=s.previousSibling)!==null;)s.slot=="media"&&(o=!1);o&&this.mediaUnsetCallback(n)}}if(e)for(const n of i.addedNodes)n===e&&this.handleMediaUpdated(e)}};Ii=new WeakMap;Va=new WeakMap;ys=new WeakSet;Vl=function(t){if(t.pointerType!=="mouse"&&t.timeStamp-ne(this,Cn)<250)return;de(this,Jn,yr).call(this),clearTimeout(ne(this,Xi));const e=this.hasAttribute(b.AUTOHIDE_OVER_CONTROLS);([this,this.media].includes(t.target)||e)&&de(this,li,ji).call(this)};ks=new WeakSet;Gl=function(t){if(t.pointerType==="touch"){const e=!this.hasAttribute(b.USER_INACTIVE);[this,this.media].includes(t.target)&&e?de(this,Ji,Xn).call(this):de(this,li,ji).call(this)}else t.composedPath().some(e=>["media-play-button","media-fullscreen-button"].includes(e?.localName))&&de(this,li,ji).call(this)};Ji=new WeakSet;Xn=function(){if(ne(this,Zt)<0||this.hasAttribute(b.USER_INACTIVE))return;this.setAttribute(b.USER_INACTIVE,"");const t=new d.CustomEvent(It.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(t)};Jn=new WeakSet;yr=function(){if(!this.hasAttribute(b.USER_INACTIVE))return;this.removeAttribute(b.USER_INACTIVE);const t=new d.CustomEvent(It.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(t)};li=new WeakSet;ji=function(){de(this,Jn,yr).call(this),clearTimeout(ne(this,Xi));const t=parseInt(this.autohide);t<0||dt(this,Xi,setTimeout(()=>{de(this,Ji,Xn).call(this)},t*1e3))};jn.shadowRootOptions={mode:"open"};jn.getTemplateHTML=Yu;d.customElements.get("media-container")||d.customElements.define("media-container",jn);var ql=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},z=(t,e,i)=>(ql(t,e,"read from private field"),i?i.call(t):e.get(t)),fi=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},wa=(t,e,i,a)=>(ql(t,e,"write to private field"),e.set(t,i),i),Ut,$t,Rn,vt,He,ze;class kr{constructor(e,i,{defaultValue:a}={defaultValue:void 0}){fi(this,He),fi(this,Ut,void 0),fi(this,$t,void 0),fi(this,Rn,void 0),fi(this,vt,new Set),wa(this,Ut,e),wa(this,$t,i),wa(this,Rn,new Set(a))}[Symbol.iterator](){return z(this,He,ze).values()}get length(){return z(this,He,ze).size}get value(){var e;return(e=[...z(this,He,ze)].join(" "))!=null?e:""}set value(e){var i;e!==this.value&&(wa(this,vt,new Set),this.add(...(i=e?.split(" "))!=null?i:[]))}toString(){return this.value}item(e){return[...z(this,He,ze)][e]}values(){return z(this,He,ze).values()}forEach(e,i){z(this,He,ze).forEach(e,i)}add(...e){var i,a;e.forEach(n=>z(this,vt).add(n)),!(this.value===""&&!((i=z(this,Ut))!=null&&i.hasAttribute(`${z(this,$t)}`)))&&((a=z(this,Ut))==null||a.setAttribute(`${z(this,$t)}`,`${this.value}`))}remove(...e){var i;e.forEach(a=>z(this,vt).delete(a)),(i=z(this,Ut))==null||i.setAttribute(`${z(this,$t)}`,`${this.value}`)}contains(e){return z(this,He,ze).has(e)}toggle(e,i){return typeof i<"u"?i?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,i){return this.remove(e),this.add(i),e===i}}Ut=new WeakMap;$t=new WeakMap;Rn=new WeakMap;vt=new WeakMap;He=new WeakSet;ze=function(){return z(this,vt).size?z(this,vt):z(this,Rn)};const ju=(t="")=>t.split(/\s+/),Yl=(t="")=>{const[e,i,a]=t.split(":"),n=a?decodeURIComponent(a):void 0;return{kind:e==="cc"?Oe.CAPTIONS:Oe.SUBTITLES,language:i,label:n}},es=(t="",e={})=>ju(t).map(i=>{const a=Yl(i);return{...e,...a}}),zl=t=>t?Array.isArray(t)?t.map(e=>typeof e=="string"?Yl(e):e):typeof t=="string"?es(t):[t]:[],Ss=({kind:t,label:e,language:i}={kind:"subtitles"})=>e?`${t==="captions"?"cc":"sb"}:${i}:${encodeURIComponent(e)}`:i,ea=(t=[])=>Array.prototype.map.call(t,Ss).join(" "),ec=(t,e)=>i=>i[t]===e,Ql=t=>{const e=Object.entries(t).map(([i,a])=>ec(i,a));return i=>e.every(a=>a(i))},Fi=(t,e=[],i=[])=>{const a=zl(i).map(Ql),n=s=>a.some(o=>o(s));Array.from(e).filter(n).forEach(s=>{s.mode=t})},ts=(t,e=()=>!0)=>{if(!t?.textTracks)return[];const i=typeof e=="function"?e:Ql(e);return Array.from(t.textTracks).filter(i)},Zl=t=>{var e;return!!((e=t.mediaSubtitlesShowing)!=null&&e.length)||t.hasAttribute(r.MEDIA_SUBTITLES_SHOWING)},tc=t=>{var e;const{media:i,fullscreenElement:a}=t;try{const n=a&&"requestFullscreen"in a?"requestFullscreen":a&&"webkitRequestFullScreen"in a?"webkitRequestFullScreen":void 0;if(n){const s=(e=a[n])==null?void 0:e.call(a);if(s instanceof Promise)return s.catch(()=>{})}else i?.webkitEnterFullscreen?i.webkitEnterFullscreen():i?.requestFullscreen&&i.requestFullscreen()}catch(n){console.error(n)}},Wo="exitFullscreen"in G?"exitFullscreen":"webkitExitFullscreen"in G?"webkitExitFullscreen":"webkitCancelFullScreen"in G?"webkitCancelFullScreen":void 0,ic=t=>{var e;const{documentElement:i}=t;if(Wo){const a=(e=i?.[Wo])==null?void 0:e.call(i);if(a instanceof Promise)return a.catch(()=>{})}},wi="fullscreenElement"in G?"fullscreenElement":"webkitFullscreenElement"in G?"webkitFullscreenElement":void 0,ac=t=>{const{documentElement:e,media:i}=t,a=e?.[wi];return!a&&"webkitDisplayingFullscreen"in i&&"webkitPresentationMode"in i&&i.webkitDisplayingFullscreen&&i.webkitPresentationMode===Iu.FULLSCREEN?i:a},nc=t=>{var e;const{media:i,documentElement:a,fullscreenElement:n=i}=t;if(!i||!a)return!1;const s=ac(t);if(!s)return!1;if(s===n||s===i)return!0;if(s.localName.includes("-")){let o=s.shadowRoot;if(!(wi in o))return Fe(s,n);for(;o?.[wi];){if(o[wi]===n)return!0;o=(e=o[wi])==null?void 0:e.shadowRoot}}return!1},sc="fullscreenEnabled"in G?"fullscreenEnabled":"webkitFullscreenEnabled"in G?"webkitFullscreenEnabled":void 0,rc=t=>{const{documentElement:e,media:i}=t;return!!e?.[sc]||i&&"webkitSupportsFullscreen"in i};let Ma;const Sr=()=>{var t,e;return Ma||(Ma=(e=(t=G)==null?void 0:t.createElement)==null?void 0:e.call(t,"video"),Ma)},oc=async(t=Sr())=>{if(!t)return!1;const e=t.volume;t.volume=e/2+.1;const i=new AbortController,a=await Promise.race([lc(t,i.signal),dc(t,e)]);return i.abort(),a},lc=(t,e)=>new Promise(i=>{t.addEventListener("volumechange",()=>i(!0),{signal:e})}),dc=async(t,e)=>{for(let i=0;i<10;i++){if(t.volume===e)return!1;await Cl(10)}return t.volume!==e},uc=/.*Version\/.*Safari\/.*/.test(d.navigator.userAgent),Xl=(t=Sr())=>d.matchMedia("(display-mode: standalone)").matches&&uc?!1:typeof t?.requestPictureInPicture=="function",Jl=(t=Sr())=>rc({documentElement:G,media:t}),cc=Jl(),hc=Xl(),mc=!!d.WebKitPlaybackTargetAvailabilityEvent,pc=!!d.chrome,Dn=t=>ts(t.media,e=>[Oe.SUBTITLES,Oe.CAPTIONS].includes(e.kind)).sort((e,i)=>e.kind>=i.kind?1:-1),jl=t=>ts(t.media,e=>e.mode===ei.SHOWING&&[Oe.SUBTITLES,Oe.CAPTIONS].includes(e.kind)),ed=(t,e)=>{const i=Dn(t),a=jl(t),n=!!a.length;if(i.length){if(e===!1||n&&e!==!0)Fi(ei.DISABLED,i,a);else if(e===!0||!n&&e!==!1){let s=i[0];const{options:o}=t;if(!o?.noSubtitlesLangPref){const f=globalThis.localStorage.getItem("media-chrome-pref-subtitles-lang"),g=f?[f,...globalThis.navigator.languages]:globalThis.navigator.languages,h=i.filter(p=>g.some(M=>p.language.toLowerCase().startsWith(M.split("-")[0]))).sort((p,M)=>{const A=g.findIndex(L=>p.language.toLowerCase().startsWith(L.split("-")[0])),_=g.findIndex(L=>M.language.toLowerCase().startsWith(L.split("-")[0]));return A-_});h[0]&&(s=h[0])}const{language:l,label:u,kind:c}=s;Fi(ei.DISABLED,i,a),Fi(ei.SHOWING,i,[{language:l,label:u,kind:c}])}}},Ir=(t,e)=>t===e?!0:t==null||e==null||typeof t!=typeof e?!1:typeof t=="number"&&Number.isNaN(t)&&Number.isNaN(e)?!0:typeof t!="object"?!1:Array.isArray(t)?vc(t,e):Object.entries(t).every(([i,a])=>i in e&&Ir(a,e[i])),vc=(t,e)=>{const i=Array.isArray(t),a=Array.isArray(e);return i!==a?!1:i||a?t.length!==e.length?!1:t.every((n,s)=>Ir(n,e[s])):!0},Ec=Object.values(Be);let xn;const fc=oc().then(t=>(xn=t,xn)),gc=async(...t)=>{await Promise.all(t.filter(e=>e).map(async e=>{if(!("localName"in e&&e instanceof d.HTMLElement))return;const i=e.localName;if(!i.includes("-"))return;const a=d.customElements.get(i);a&&e instanceof a||(await d.customElements.whenDefined(i),d.customElements.upgrade(e))}))},bc=new d.DOMParser,_c=t=>t&&(bc.parseFromString(t,"text/html").body.textContent||t),Mi={mediaError:{get(t,e){const{media:i}=t;if(e?.type!=="playing")return i?.error},mediaEvents:["emptied","error","playing"]},mediaErrorCode:{get(t,e){var i;const{media:a}=t;if(e?.type!=="playing")return(i=a?.error)==null?void 0:i.code},mediaEvents:["emptied","error","playing"]},mediaErrorMessage:{get(t,e){var i,a;const{media:n}=t;if(e?.type!=="playing")return(a=(i=n?.error)==null?void 0:i.message)!=null?a:""},mediaEvents:["emptied","error","playing"]},mediaWidth:{get(t){var e;const{media:i}=t;return(e=i?.videoWidth)!=null?e:0},mediaEvents:["resize"]},mediaHeight:{get(t){var e;const{media:i}=t;return(e=i?.videoHeight)!=null?e:0},mediaEvents:["resize"]},mediaPaused:{get(t){var e;const{media:i}=t;return(e=i?.paused)!=null?e:!0},set(t,e){var i;const{media:a}=e;a&&(t?a.pause():(i=a.play())==null||i.catch(()=>{}))},mediaEvents:["play","playing","pause","emptied"]},mediaHasPlayed:{get(t,e){const{media:i}=t;return i?e?e.type==="playing":!i.paused:!1},mediaEvents:["playing","emptied"]},mediaEnded:{get(t){var e;const{media:i}=t;return(e=i?.ended)!=null?e:!1},mediaEvents:["seeked","ended","emptied"]},mediaPlaybackRate:{get(t){var e;const{media:i}=t;return(e=i?.playbackRate)!=null?e:1},set(t,e){const{media:i}=e;i&&Number.isFinite(+t)&&(i.playbackRate=+t)},mediaEvents:["ratechange","loadstart"]},mediaMuted:{get(t){var e;const{media:i}=t;return(e=i?.muted)!=null?e:!1},set(t,e){const{media:i}=e;if(i){try{d.localStorage.setItem("media-chrome-pref-muted",t?"true":"false")}catch(a){console.debug("Error setting muted pref",a)}i.muted=t}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(t,e)=>{const{options:{noMutedPref:i}}=e,{media:a}=e;if(!(!a||a.muted||i))try{const n=d.localStorage.getItem("media-chrome-pref-muted")==="true";Mi.mediaMuted.set(n,e),t(n)}catch(n){console.debug("Error getting muted pref",n)}}]},mediaVolume:{get(t){var e;const{media:i}=t;return(e=i?.volume)!=null?e:1},set(t,e){const{media:i}=e;if(i){try{t==null?d.localStorage.removeItem("media-chrome-pref-volume"):d.localStorage.setItem("media-chrome-pref-volume",t.toString())}catch(a){console.debug("Error setting volume pref",a)}Number.isFinite(+t)&&(i.volume=+t)}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(t,e)=>{const{options:{noVolumePref:i}}=e;if(!i)try{const{media:a}=e;if(!a)return;const n=d.localStorage.getItem("media-chrome-pref-volume");if(n==null)return;Mi.mediaVolume.set(+n,e),t(+n)}catch(a){console.debug("Error getting volume pref",a)}}]},mediaVolumeLevel:{get(t){const{media:e}=t;return typeof e?.volume>"u"?"high":e.muted||e.volume===0?"off":e.volume<.5?"low":e.volume<.75?"medium":"high"},mediaEvents:["volumechange"]},mediaCurrentTime:{get(t){var e;const{media:i}=t;return(e=i?.currentTime)!=null?e:0},set(t,e){const{media:i}=e;!i||!br(t)||(i.currentTime=t)},mediaEvents:["timeupdate","loadedmetadata"]},mediaDuration:{get(t){const{media:e,options:{defaultDuration:i}={}}=t;return i&&(!e||!e.duration||Number.isNaN(e.duration)||!Number.isFinite(e.duration))?i:Number.isFinite(e?.duration)?e.duration:Number.NaN},mediaEvents:["durationchange","loadedmetadata","emptied"]},mediaLoading:{get(t){const{media:e}=t;return e?.readyState<3},mediaEvents:["waiting","playing","emptied"]},mediaSeekable:{get(t){var e;const{media:i}=t;if(!((e=i?.seekable)!=null&&e.length))return;const a=i.seekable.start(0),n=i.seekable.end(i.seekable.length-1);if(!(!a&&!n))return[Number(a.toFixed(3)),Number(n.toFixed(3))]},mediaEvents:["loadedmetadata","emptied","progress","seekablechange"]},mediaBuffered:{get(t){var e;const{media:i}=t,a=(e=i?.buffered)!=null?e:[];return Array.from(a).map((n,s)=>[Number(a.start(s).toFixed(3)),Number(a.end(s).toFixed(3))])},mediaEvents:["progress","emptied"]},mediaStreamType:{get(t){const{media:e,options:{defaultStreamType:i}={}}=t,a=[Be.LIVE,Be.ON_DEMAND].includes(i)?i:void 0;if(!e)return a;const{streamType:n}=e;if(Ec.includes(n))return n===Be.UNKNOWN?a:n;const s=e.duration;return s===1/0?Be.LIVE:Number.isFinite(s)?Be.ON_DEMAND:a},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange"]},mediaTargetLiveWindow:{get(t){const{media:e}=t;if(!e)return Number.NaN;const{targetLiveWindow:i}=e,a=Mi.mediaStreamType.get(t);return(i==null||Number.isNaN(i))&&a===Be.LIVE?0:i},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange","targetlivewindowchange"]},mediaTimeIsLive:{get(t){const{media:e,options:{liveEdgeOffset:i=10}={}}=t;if(!e)return!1;if(typeof e.liveEdgeStart=="number")return Number.isNaN(e.liveEdgeStart)?!1:e.currentTime>=e.liveEdgeStart;if(!(Mi.mediaStreamType.get(t)===Be.LIVE))return!1;const n=e.seekable;if(!n)return!0;if(!n.length)return!1;const s=n.end(n.length-1)-i;return e.currentTime>=s},mediaEvents:["playing","timeupdate","progress","waiting","emptied"]},mediaSubtitlesList:{get(t){return Dn(t).map(({kind:e,label:i,language:a})=>({kind:e,label:i,language:a}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack"]},mediaSubtitlesShowing:{get(t){return jl(t).map(({kind:e,label:i,language:a})=>({kind:e,label:i,language:a}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(t,e)=>{var i,a;const{media:n,options:s}=e;if(!n)return;const o=l=>{var u;!s.defaultSubtitles||l&&![Oe.CAPTIONS,Oe.SUBTITLES].includes((u=l?.track)==null?void 0:u.kind)||ed(e,!0)};return n.addEventListener("loadstart",o),(i=n.textTracks)==null||i.addEventListener("addtrack",o),(a=n.textTracks)==null||a.addEventListener("removetrack",o),()=>{var l,u;n.removeEventListener("loadstart",o),(l=n.textTracks)==null||l.removeEventListener("addtrack",o),(u=n.textTracks)==null||u.removeEventListener("removetrack",o)}}]},mediaChaptersCues:{get(t){var e;const{media:i}=t;if(!i)return[];const[a]=ts(i,{kind:Oe.CHAPTERS});return Array.from((e=a?.cues)!=null?e:[]).map(({text:n,startTime:s,endTime:o})=>({text:_c(n),startTime:s,endTime:o}))},mediaEvents:["loadstart","loadedmetadata"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(t,e)=>{var i;const{media:a}=e;if(!a)return;const n=a.querySelector('track[kind="chapters"][default][src]'),s=(i=a.shadowRoot)==null?void 0:i.querySelector(':is(video,audio) > track[kind="chapters"][default][src]');return n?.addEventListener("load",t),s?.addEventListener("load",t),()=>{n?.removeEventListener("load",t),s?.removeEventListener("load",t)}}]},mediaIsPip:{get(t){var e,i;const{media:a,documentElement:n}=t;if(!a||!n||!n.pictureInPictureElement)return!1;if(n.pictureInPictureElement===a)return!0;if(n.pictureInPictureElement instanceof HTMLMediaElement)return(e=a.localName)!=null&&e.includes("-")?Fe(a,n.pictureInPictureElement):!1;if(n.pictureInPictureElement.localName.includes("-")){let s=n.pictureInPictureElement.shadowRoot;for(;s?.pictureInPictureElement;){if(s.pictureInPictureElement===a)return!0;s=(i=s.pictureInPictureElement)==null?void 0:i.shadowRoot}}return!1},set(t,e){const{media:i}=e;if(i)if(t){if(!G.pictureInPictureEnabled){console.warn("MediaChrome: Picture-in-picture is not enabled");return}if(!i.requestPictureInPicture){console.warn("MediaChrome: The current media does not support picture-in-picture");return}const a=()=>{console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.")};i.requestPictureInPicture().catch(n=>{if(n.code===11){if(!i.src){console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a src set.");return}if(i.readyState===0&&i.preload==="none"){const s=()=>{i.removeEventListener("loadedmetadata",o),i.preload="none"},o=()=>{i.requestPictureInPicture().catch(a),s()};i.addEventListener("loadedmetadata",o),i.preload="metadata",setTimeout(()=>{i.readyState===0&&a(),s()},1e3)}else throw n}else throw n})}else G.pictureInPictureElement&&G.exitPictureInPicture()},mediaEvents:["enterpictureinpicture","leavepictureinpicture"]},mediaRenditionList:{get(t){var e;const{media:i}=t;return[...(e=i?.videoRenditions)!=null?e:[]].map(a=>({...a}))},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaRenditionSelected:{get(t){var e,i,a;const{media:n}=t;return(a=(i=n?.videoRenditions)==null?void 0:i[(e=n.videoRenditions)==null?void 0:e.selectedIndex])==null?void 0:a.id},set(t,e){const{media:i}=e;if(!i?.videoRenditions){console.warn("MediaController: Rendition selection not supported by this media.");return}const a=t,n=Array.prototype.findIndex.call(i.videoRenditions,s=>s.id==a);i.videoRenditions.selectedIndex!=n&&(i.videoRenditions.selectedIndex=n)},mediaEvents:["emptied"],videoRenditionsEvents:["addrendition","removerendition","change"]},mediaAudioTrackList:{get(t){var e;const{media:i}=t;return[...(e=i?.audioTracks)!=null?e:[]]},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaAudioTrackEnabled:{get(t){var e,i;const{media:a}=t;return(i=[...(e=a?.audioTracks)!=null?e:[]].find(n=>n.enabled))==null?void 0:i.id},set(t,e){const{media:i}=e;if(!i?.audioTracks){console.warn("MediaChrome: Audio track selection not supported by this media.");return}const a=t;for(const n of i.audioTracks)n.enabled=a==n.id},mediaEvents:["emptied"],audioTracksEvents:["addtrack","removetrack","change"]},mediaIsFullscreen:{get(t){return nc(t)},set(t,e){t?tc(e):ic(e)},rootEvents:["fullscreenchange","webkitfullscreenchange"],mediaEvents:["webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"]},mediaIsCasting:{get(t){var e;const{media:i}=t;return!i?.remote||((e=i.remote)==null?void 0:e.state)==="disconnected"?!1:!!i.remote.state},set(t,e){var i,a;const{media:n}=e;if(n&&!(t&&((i=n.remote)==null?void 0:i.state)!=="disconnected")&&!(!t&&((a=n.remote)==null?void 0:a.state)!=="connected")){if(typeof n.remote.prompt!="function"){console.warn("MediaChrome: Casting is not supported in this environment");return}n.remote.prompt().catch(()=>{})}},remoteEvents:["connect","connecting","disconnect"]},mediaIsAirplaying:{get(){return!1},set(t,e){const{media:i}=e;if(i){if(!(i.webkitShowPlaybackTargetPicker&&d.WebKitPlaybackTargetAvailabilityEvent)){console.error("MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment");return}i.webkitShowPlaybackTargetPicker()}},mediaEvents:["webkitcurrentplaybacktargetiswirelesschanged"]},mediaFullscreenUnavailable:{get(t){const{media:e}=t;if(!cc||!Jl(e))return oe.UNSUPPORTED}},mediaPipUnavailable:{get(t){const{media:e}=t;if(!hc||!Xl(e))return oe.UNSUPPORTED}},mediaVolumeUnavailable:{get(t){const{media:e}=t;if(xn===!1||e?.volume==null)return oe.UNSUPPORTED},stateOwnersUpdateHandlers:[t=>{xn==null&&fc.then(e=>t(e?void 0:oe.UNSUPPORTED))}]},mediaCastUnavailable:{get(t,{availability:e="not-available"}={}){var i;const{media:a}=t;if(!pc||!((i=a?.remote)!=null&&i.state))return oe.UNSUPPORTED;if(!(e==null||e==="available"))return oe.UNAVAILABLE},stateOwnersUpdateHandlers:[(t,e)=>{var i;const{media:a}=e;return a?(a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||(i=a?.remote)==null||i.watchAvailability(s=>{t({availability:s?"available":"not-available"})}).catch(s=>{s.name==="NotSupportedError"?t({availability:null}):t({availability:"not-available"})}),()=>{var s;(s=a?.remote)==null||s.cancelWatchAvailability().catch(()=>{})}):void 0}]},mediaAirplayUnavailable:{get(t,e){if(!mc)return oe.UNSUPPORTED;if(e?.availability==="not-available")return oe.UNAVAILABLE},mediaEvents:["webkitplaybacktargetavailabilitychanged"],stateOwnersUpdateHandlers:[(t,e)=>{var i;const{media:a}=e;return a?(a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||(i=a?.remote)==null||i.watchAvailability(s=>{t({availability:s?"available":"not-available"})}).catch(s=>{s.name==="NotSupportedError"?t({availability:null}):t({availability:"not-available"})}),()=>{var s;(s=a?.remote)==null||s.cancelWatchAvailability().catch(()=>{})}):void 0}]},mediaRenditionUnavailable:{get(t){var e;const{media:i}=t;if(!i?.videoRenditions)return oe.UNSUPPORTED;if(!((e=i.videoRenditions)!=null&&e.length))return oe.UNAVAILABLE},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaAudioTrackUnavailable:{get(t){var e,i;const{media:a}=t;if(!a?.audioTracks)return oe.UNSUPPORTED;if(((i=(e=a.audioTracks)==null?void 0:e.length)!=null?i:0)<=1)return oe.UNAVAILABLE},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]}},Ac={[E.MEDIA_PREVIEW_REQUEST](t,e,{detail:i}){var a,n,s;const{media:o}=e,l=i??void 0;let u,c;if(o&&l!=null){const[p]=ts(o,{kind:Oe.METADATA,label:"thumbnails"}),M=Array.prototype.find.call((a=p?.cues)!=null?a:[],(A,_,L)=>_===0?A.endTime>l:_===L.length-1?A.startTime<=l:A.startTime<=l&&A.endTime>l);if(M){const A=/'^(?:[a-z]+:)?\/\//i.test(M.text)||(n=o?.querySelector('track[label="thumbnails"]'))==null?void 0:n.src,_=new URL(M.text,A);c=new URLSearchParams(_.hash).get("#xywh").split(",").map(J=>+J),u=_.href}}const f=t.mediaDuration.get(e);let h=(s=t.mediaChaptersCues.get(e).find((p,M,A)=>M===A.length-1&&f===p.endTime?p.startTime<=l&&p.endTime>=l:p.startTime<=l&&p.endTime>l))==null?void 0:s.text;return i!=null&&h==null&&(h=""),{mediaPreviewTime:l,mediaPreviewImage:u,mediaPreviewCoords:c,mediaPreviewChapter:h}},[E.MEDIA_PAUSE_REQUEST](t,e){t["mediaPaused"].set(!0,e)},[E.MEDIA_PLAY_REQUEST](t,e){var i,a,n,s;const o="mediaPaused",u=t.mediaStreamType.get(e)===Be.LIVE,c=!((i=e.options)!=null&&i.noAutoSeekToLive),f=t.mediaTargetLiveWindow.get(e)>0;if(u&&c&&!f){const g=(a=t.mediaSeekable.get(e))==null?void 0:a[1];if(g){const h=(s=(n=e.options)==null?void 0:n.seekToLiveOffset)!=null?s:0,p=g-h;t.mediaCurrentTime.set(p,e)}}t[o].set(!1,e)},[E.MEDIA_PLAYBACK_RATE_REQUEST](t,e,{detail:i}){const a="mediaPlaybackRate",n=i;t[a].set(n,e)},[E.MEDIA_MUTE_REQUEST](t,e){t["mediaMuted"].set(!0,e)},[E.MEDIA_UNMUTE_REQUEST](t,e){const i="mediaMuted";t.mediaVolume.get(e)||t.mediaVolume.set(.25,e),t[i].set(!1,e)},[E.MEDIA_VOLUME_REQUEST](t,e,{detail:i}){const a="mediaVolume",n=i;n&&t.mediaMuted.get(e)&&t.mediaMuted.set(!1,e),t[a].set(n,e)},[E.MEDIA_SEEK_REQUEST](t,e,{detail:i}){const a="mediaCurrentTime",n=i;t[a].set(n,e)},[E.MEDIA_SEEK_TO_LIVE_REQUEST](t,e){var i,a,n;const s="mediaCurrentTime",o=(i=t.mediaSeekable.get(e))==null?void 0:i[1];if(Number.isNaN(Number(o)))return;const l=(n=(a=e.options)==null?void 0:a.seekToLiveOffset)!=null?n:0,u=o-l;t[s].set(u,e)},[E.MEDIA_SHOW_SUBTITLES_REQUEST](t,e,{detail:i}){var a;const{options:n}=e,s=Dn(e),o=zl(i),l=(a=o[0])==null?void 0:a.language;l&&!n.noSubtitlesLangPref&&d.localStorage.setItem("media-chrome-pref-subtitles-lang",l),Fi(ei.SHOWING,s,o)},[E.MEDIA_DISABLE_SUBTITLES_REQUEST](t,e,{detail:i}){const a=Dn(e),n=i??[];Fi(ei.DISABLED,a,n)},[E.MEDIA_TOGGLE_SUBTITLES_REQUEST](t,e,{detail:i}){ed(e,i)},[E.MEDIA_RENDITION_REQUEST](t,e,{detail:i}){const a="mediaRenditionSelected",n=i;t[a].set(n,e)},[E.MEDIA_AUDIO_TRACK_REQUEST](t,e,{detail:i}){const a="mediaAudioTrackEnabled",n=i;t[a].set(n,e)},[E.MEDIA_ENTER_PIP_REQUEST](t,e){const i="mediaIsPip";t.mediaIsFullscreen.get(e)&&t.mediaIsFullscreen.set(!1,e),t[i].set(!0,e)},[E.MEDIA_EXIT_PIP_REQUEST](t,e){t["mediaIsPip"].set(!1,e)},[E.MEDIA_ENTER_FULLSCREEN_REQUEST](t,e){const i="mediaIsFullscreen";t.mediaIsPip.get(e)&&t.mediaIsPip.set(!1,e),t[i].set(!0,e)},[E.MEDIA_EXIT_FULLSCREEN_REQUEST](t,e){t["mediaIsFullscreen"].set(!1,e)},[E.MEDIA_ENTER_CAST_REQUEST](t,e){const i="mediaIsCasting";t.mediaIsFullscreen.get(e)&&t.mediaIsFullscreen.set(!1,e),t[i].set(!0,e)},[E.MEDIA_EXIT_CAST_REQUEST](t,e){t["mediaIsCasting"].set(!1,e)},[E.MEDIA_AIRPLAY_REQUEST](t,e){t["mediaIsAirplaying"].set(!0,e)}},Tc=({media:t,fullscreenElement:e,documentElement:i,stateMediator:a=Mi,requestMap:n=Ac,options:s={},monitorStateOwnersOnlyWithSubscriptions:o=!0})=>{const l=[],u={options:{...s}};let c=Object.freeze({mediaPreviewTime:void 0,mediaPreviewImage:void 0,mediaPreviewCoords:void 0,mediaPreviewChapter:void 0});const f=A=>{A!=null&&(Ir(A,c)||(c=Object.freeze({...c,...A}),l.forEach(_=>_(c))))},g=()=>{const A=Object.entries(a).reduce((_,[L,{get:J}])=>(_[L]=J(u),_),{});f(A)},h={};let p;const M=async(A,_)=>{var L,J,re,rt,Ve,ca,ha,ma,pa,va,Ea,fa,ga,ba,_a,Aa;const os=!!p;if(p={...u,...p??{},...A},os)return;await gc(...Object.values(A));const Ge=l.length>0&&_===0&&o,Ta=u.media!==p.media,ya=((L=u.media)==null?void 0:L.textTracks)!==((J=p.media)==null?void 0:J.textTracks),ka=((re=u.media)==null?void 0:re.videoRenditions)!==((rt=p.media)==null?void 0:rt.videoRenditions),ce=((Ve=u.media)==null?void 0:Ve.audioTracks)!==((ca=p.media)==null?void 0:ca.audioTracks),Ee=((ha=u.media)==null?void 0:ha.remote)!==((ma=p.media)==null?void 0:ma.remote),Sa=u.documentElement!==p.documentElement,_o=!!u.media&&(Ta||Ge),Ao=!!((pa=u.media)!=null&&pa.textTracks)&&(ya||Ge),To=!!((va=u.media)!=null&&va.videoRenditions)&&(ka||Ge),yo=!!((Ea=u.media)!=null&&Ea.audioTracks)&&(ce||Ge),ko=!!((fa=u.media)!=null&&fa.remote)&&(Ee||Ge),So=!!u.documentElement&&(Sa||Ge),Io=_o||Ao||To||yo||ko||So,Mt=l.length===0&&_===1&&o,wo=!!p.media&&(Ta||Mt),Mo=!!((ga=p.media)!=null&&ga.textTracks)&&(ya||Mt),Lo=!!((ba=p.media)!=null&&ba.videoRenditions)&&(ka||Mt),Co=!!((_a=p.media)!=null&&_a.audioTracks)&&(ce||Mt),Ro=!!((Aa=p.media)!=null&&Aa.remote)&&(Ee||Mt),Do=!!p.documentElement&&(Sa||Mt),xo=wo||Mo||Lo||Co||Ro||Do;if(!(Io||xo)){Object.entries(p).forEach(([C,Ei])=>{u[C]=Ei}),g(),p=void 0;return}Object.entries(a).forEach(([C,{get:Ei,mediaEvents:pu=[],textTracksEvents:vu=[],videoRenditionsEvents:Eu=[],audioTracksEvents:fu=[],remoteEvents:gu=[],rootEvents:bu=[],stateOwnersUpdateHandlers:_u=[]}])=>{h[C]||(h[C]={});const ee=B=>{const te=Ei(u,B);f({[C]:te})};let K;K=h[C].mediaEvents,pu.forEach(B=>{K&&_o&&(u.media.removeEventListener(B,K),h[C].mediaEvents=void 0),wo&&(p.media.addEventListener(B,ee),h[C].mediaEvents=ee)}),K=h[C].textTracksEvents,vu.forEach(B=>{var te,he;K&&Ao&&((te=u.media.textTracks)==null||te.removeEventListener(B,K),h[C].textTracksEvents=void 0),Mo&&((he=p.media.textTracks)==null||he.addEventListener(B,ee),h[C].textTracksEvents=ee)}),K=h[C].videoRenditionsEvents,Eu.forEach(B=>{var te,he;K&&To&&((te=u.media.videoRenditions)==null||te.removeEventListener(B,K),h[C].videoRenditionsEvents=void 0),Lo&&((he=p.media.videoRenditions)==null||he.addEventListener(B,ee),h[C].videoRenditionsEvents=ee)}),K=h[C].audioTracksEvents,fu.forEach(B=>{var te,he;K&&yo&&((te=u.media.audioTracks)==null||te.removeEventListener(B,K),h[C].audioTracksEvents=void 0),Co&&((he=p.media.audioTracks)==null||he.addEventListener(B,ee),h[C].audioTracksEvents=ee)}),K=h[C].remoteEvents,gu.forEach(B=>{var te,he;K&&ko&&((te=u.media.remote)==null||te.removeEventListener(B,K),h[C].remoteEvents=void 0),Ro&&((he=p.media.remote)==null||he.addEventListener(B,ee),h[C].remoteEvents=ee)}),K=h[C].rootEvents,bu.forEach(B=>{K&&So&&(u.documentElement.removeEventListener(B,K),h[C].rootEvents=void 0),Do&&(p.documentElement.addEventListener(B,ee),h[C].rootEvents=ee)});const Oo=h[C].stateOwnersUpdateHandlers;_u.forEach(B=>{Oo&&Io&&Oo(),xo&&(h[C].stateOwnersUpdateHandlers=B(ee,p))})}),Object.entries(p).forEach(([C,Ei])=>{u[C]=Ei}),g(),p=void 0};return M({media:t,fullscreenElement:e,documentElement:i,options:s}),{dispatch(A){const{type:_,detail:L}=A;if(n[_]&&c.mediaErrorCode==null){f(n[_](a,u,A));return}_==="mediaelementchangerequest"?M({media:L}):_==="fullscreenelementchangerequest"?M({fullscreenElement:L}):_==="documentelementchangerequest"?M({documentElement:L}):_==="optionschangerequest"&&Object.entries(L??{}).forEach(([J,re])=>{u.options[J]=re})},getState(){return c},subscribe(A){return M({},l.length+1),l.push(A),A(c),()=>{const _=l.indexOf(A);_>=0&&(M({},l.length-1),l.splice(_,1))}}}};var wr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},y=(t,e,i)=>(wr(t,e,"read from private field"),i?i.call(t):e.get(t)),Ue=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},qe=(t,e,i,a)=>(wr(t,e,"write to private field"),e.set(t,i),i),tt=(t,e,i)=>(wr(t,e,"access private method"),i),Et,Li,D,Ci,_e,Ga,Ka,Is,di,ta,qa,ws;const td=["ArrowLeft","ArrowRight","Enter"," ","f","m","k","c"],Fo=10,m={DEFAULT_SUBTITLES:"defaultsubtitles",DEFAULT_STREAM_TYPE:"defaultstreamtype",DEFAULT_DURATION:"defaultduration",FULLSCREEN_ELEMENT:"fullscreenelement",HOTKEYS:"hotkeys",KEYS_USED:"keysused",LIVE_EDGE_OFFSET:"liveedgeoffset",SEEK_TO_LIVE_OFFSET:"seektoliveoffset",NO_AUTO_SEEK_TO_LIVE:"noautoseektolive",NO_HOTKEYS:"nohotkeys",NO_VOLUME_PREF:"novolumepref",NO_SUBTITLES_LANG_PREF:"nosubtitleslangpref",NO_DEFAULT_STORE:"nodefaultstore",KEYBOARD_FORWARD_SEEK_OFFSET:"keyboardforwardseekoffset",KEYBOARD_BACKWARD_SEEK_OFFSET:"keyboardbackwardseekoffset",LANG:"lang"};class yc extends jn{constructor(){super(),Ue(this,Ka),Ue(this,di),Ue(this,qa),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,Ue(this,Et,new kr(this,m.HOTKEYS)),Ue(this,Li,void 0),Ue(this,D,void 0),Ue(this,Ci,void 0),Ue(this,_e,void 0),Ue(this,Ga,i=>{var a;(a=y(this,D))==null||a.dispatch(i)}),this.associateElement(this);let e={};qe(this,Ci,i=>{Object.entries(i).forEach(([a,n])=>{if(a in e&&e[a]===n)return;this.propagateMediaState(a,n);const s=a.toLowerCase(),o=new d.CustomEvent(Su[s],{composed:!0,detail:n});this.dispatchEvent(o)}),e=i}),this.enableHotkeys()}static get observedAttributes(){return super.observedAttributes.concat(m.NO_HOTKEYS,m.HOTKEYS,m.DEFAULT_STREAM_TYPE,m.DEFAULT_SUBTITLES,m.DEFAULT_DURATION,m.LANG)}get mediaStore(){return y(this,D)}set mediaStore(e){var i,a;if(y(this,D)&&((i=y(this,_e))==null||i.call(this),qe(this,_e,void 0)),qe(this,D,e),!y(this,D)&&!this.hasAttribute(m.NO_DEFAULT_STORE)){tt(this,Ka,Is).call(this);return}qe(this,_e,(a=y(this,D))==null?void 0:a.subscribe(y(this,Ci)))}get fullscreenElement(){var e;return(e=y(this,Li))!=null?e:this}set fullscreenElement(e){var i;this.hasAttribute(m.FULLSCREEN_ELEMENT)&&this.removeAttribute(m.FULLSCREEN_ELEMENT),qe(this,Li,e),(i=y(this,D))==null||i.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}get defaultSubtitles(){return k(this,m.DEFAULT_SUBTITLES)}set defaultSubtitles(e){S(this,m.DEFAULT_SUBTITLES,e)}get defaultStreamType(){return P(this,m.DEFAULT_STREAM_TYPE)}set defaultStreamType(e){U(this,m.DEFAULT_STREAM_TYPE,e)}get defaultDuration(){return O(this,m.DEFAULT_DURATION)}set defaultDuration(e){H(this,m.DEFAULT_DURATION,e)}get noHotkeys(){return k(this,m.NO_HOTKEYS)}set noHotkeys(e){S(this,m.NO_HOTKEYS,e)}get keysUsed(){return P(this,m.KEYS_USED)}set keysUsed(e){U(this,m.KEYS_USED,e)}get liveEdgeOffset(){return O(this,m.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){H(this,m.LIVE_EDGE_OFFSET,e)}get noAutoSeekToLive(){return k(this,m.NO_AUTO_SEEK_TO_LIVE)}set noAutoSeekToLive(e){S(this,m.NO_AUTO_SEEK_TO_LIVE,e)}get noVolumePref(){return k(this,m.NO_VOLUME_PREF)}set noVolumePref(e){S(this,m.NO_VOLUME_PREF,e)}get noSubtitlesLangPref(){return k(this,m.NO_SUBTITLES_LANG_PREF)}set noSubtitlesLangPref(e){S(this,m.NO_SUBTITLES_LANG_PREF,e)}get noDefaultStore(){return k(this,m.NO_DEFAULT_STORE)}set noDefaultStore(e){S(this,m.NO_DEFAULT_STORE,e)}attributeChangedCallback(e,i,a){var n,s,o,l,u,c,f,g;if(super.attributeChangedCallback(e,i,a),e===m.NO_HOTKEYS)a!==i&&a===""?(this.hasAttribute(m.HOTKEYS)&&console.warn("Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):a!==i&&a===null&&this.enableHotkeys();else if(e===m.HOTKEYS)y(this,Et).value=a;else if(e===m.DEFAULT_SUBTITLES&&a!==i)(n=y(this,D))==null||n.dispatch({type:"optionschangerequest",detail:{defaultSubtitles:this.hasAttribute(m.DEFAULT_SUBTITLES)}});else if(e===m.DEFAULT_STREAM_TYPE)(o=y(this,D))==null||o.dispatch({type:"optionschangerequest",detail:{defaultStreamType:(s=this.getAttribute(m.DEFAULT_STREAM_TYPE))!=null?s:void 0}});else if(e===m.LIVE_EDGE_OFFSET)(l=y(this,D))==null||l.dispatch({type:"optionschangerequest",detail:{liveEdgeOffset:this.hasAttribute(m.LIVE_EDGE_OFFSET)?+this.getAttribute(m.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(m.SEEK_TO_LIVE_OFFSET)?void 0:+this.getAttribute(m.LIVE_EDGE_OFFSET)}});else if(e===m.SEEK_TO_LIVE_OFFSET)(u=y(this,D))==null||u.dispatch({type:"optionschangerequest",detail:{seekToLiveOffset:this.hasAttribute(m.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(m.SEEK_TO_LIVE_OFFSET):void 0}});else if(e===m.NO_AUTO_SEEK_TO_LIVE)(c=y(this,D))==null||c.dispatch({type:"optionschangerequest",detail:{noAutoSeekToLive:this.hasAttribute(m.NO_AUTO_SEEK_TO_LIVE)}});else if(e===m.FULLSCREEN_ELEMENT){const h=a?(f=this.getRootNode())==null?void 0:f.getElementById(a):void 0;qe(this,Li,h),(g=y(this,D))==null||g.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}else e===m.LANG&&a!==i&&Nu(a)}connectedCallback(){var e,i;!y(this,D)&&!this.hasAttribute(m.NO_DEFAULT_STORE)&&tt(this,Ka,Is).call(this),(e=y(this,D))==null||e.dispatch({type:"documentelementchangerequest",detail:G}),super.connectedCallback(),y(this,D)&&!y(this,_e)&&qe(this,_e,(i=y(this,D))==null?void 0:i.subscribe(y(this,Ci))),this.enableHotkeys()}disconnectedCallback(){var e,i,a,n;(e=super.disconnectedCallback)==null||e.call(this),y(this,D)&&((i=y(this,D))==null||i.dispatch({type:"documentelementchangerequest",detail:void 0}),(a=y(this,D))==null||a.dispatch({type:E.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:!1})),y(this,_e)&&((n=y(this,_e))==null||n.call(this),qe(this,_e,void 0))}mediaSetCallback(e){var i;super.mediaSetCallback(e),(i=y(this,D))==null||i.dispatch({type:"mediaelementchangerequest",detail:e}),e.hasAttribute("tabindex")||(e.tabIndex=-1)}mediaUnsetCallback(e){var i;super.mediaUnsetCallback(e),(i=y(this,D))==null||i.dispatch({type:"mediaelementchangerequest",detail:void 0})}propagateMediaState(e,i){Ko(this.mediaStateReceivers,e,i)}associateElement(e){if(!e)return;const{associatedElementSubscriptions:i}=this;if(i.has(e))return;const a=this.registerMediaStateReceiver.bind(this),n=this.unregisterMediaStateReceiver.bind(this),s=Lc(e,a,n);Object.values(E).forEach(o=>{e.addEventListener(o,y(this,Ga))}),i.set(e,s)}unassociateElement(e){if(!e)return;const{associatedElementSubscriptions:i}=this;if(!i.has(e))return;i.get(e)(),i.delete(e),Object.values(E).forEach(n=>{e.removeEventListener(n,y(this,Ga))})}registerMediaStateReceiver(e){if(!e)return;const i=this.mediaStateReceivers;i.indexOf(e)>-1||(i.push(e),y(this,D)&&Object.entries(y(this,D).getState()).forEach(([n,s])=>{Ko([e],n,s)}))}unregisterMediaStateReceiver(e){const i=this.mediaStateReceivers,a=i.indexOf(e);a<0||i.splice(a,1)}enableHotkeys(){this.addEventListener("keydown",tt(this,qa,ws))}disableHotkeys(){this.removeEventListener("keydown",tt(this,qa,ws)),this.removeEventListener("keyup",tt(this,di,ta))}get hotkeys(){return P(this,m.HOTKEYS)}set hotkeys(e){U(this,m.HOTKEYS,e)}keyboardShortcutHandler(e){var i,a,n,s,o;const l=e.target;if(((n=(a=(i=l.getAttribute(m.KEYS_USED))==null?void 0:i.split(" "))!=null?a:l?.keysUsed)!=null?n:[]).map(h=>h==="Space"?" ":h).filter(Boolean).includes(e.key))return;let c,f,g;if(!y(this,Et).contains(`no${e.key.toLowerCase()}`)&&!(e.key===" "&&y(this,Et).contains("nospace")))switch(e.key){case" ":case"k":c=y(this,D).getState().mediaPaused?E.MEDIA_PLAY_REQUEST:E.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new d.CustomEvent(c,{composed:!0,bubbles:!0}));break;case"m":c=this.mediaStore.getState().mediaVolumeLevel==="off"?E.MEDIA_UNMUTE_REQUEST:E.MEDIA_MUTE_REQUEST,this.dispatchEvent(new d.CustomEvent(c,{composed:!0,bubbles:!0}));break;case"f":c=this.mediaStore.getState().mediaIsFullscreen?E.MEDIA_EXIT_FULLSCREEN_REQUEST:E.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new d.CustomEvent(c,{composed:!0,bubbles:!0}));break;case"c":this.dispatchEvent(new d.CustomEvent(E.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}));break;case"ArrowLeft":{const h=this.hasAttribute(m.KEYBOARD_BACKWARD_SEEK_OFFSET)?+this.getAttribute(m.KEYBOARD_BACKWARD_SEEK_OFFSET):Fo;f=Math.max(((s=this.mediaStore.getState().mediaCurrentTime)!=null?s:0)-h,0),g=new d.CustomEvent(E.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:f}),this.dispatchEvent(g);break}case"ArrowRight":{const h=this.hasAttribute(m.KEYBOARD_FORWARD_SEEK_OFFSET)?+this.getAttribute(m.KEYBOARD_FORWARD_SEEK_OFFSET):Fo;f=Math.max(((o=this.mediaStore.getState().mediaCurrentTime)!=null?o:0)+h,0),g=new d.CustomEvent(E.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:f}),this.dispatchEvent(g);break}}}}Et=new WeakMap;Li=new WeakMap;D=new WeakMap;Ci=new WeakMap;_e=new WeakMap;Ga=new WeakMap;Ka=new WeakSet;Is=function(){var t;this.mediaStore=Tc({media:this.media,fullscreenElement:this.fullscreenElement,options:{defaultSubtitles:this.hasAttribute(m.DEFAULT_SUBTITLES),defaultDuration:this.hasAttribute(m.DEFAULT_DURATION)?+this.getAttribute(m.DEFAULT_DURATION):void 0,defaultStreamType:(t=this.getAttribute(m.DEFAULT_STREAM_TYPE))!=null?t:void 0,liveEdgeOffset:this.hasAttribute(m.LIVE_EDGE_OFFSET)?+this.getAttribute(m.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(m.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(m.SEEK_TO_LIVE_OFFSET):this.hasAttribute(m.LIVE_EDGE_OFFSET)?+this.getAttribute(m.LIVE_EDGE_OFFSET):void 0,noAutoSeekToLive:this.hasAttribute(m.NO_AUTO_SEEK_TO_LIVE),noVolumePref:this.hasAttribute(m.NO_VOLUME_PREF),noSubtitlesLangPref:this.hasAttribute(m.NO_SUBTITLES_LANG_PREF)}})};di=new WeakSet;ta=function(t){const{key:e}=t;if(!td.includes(e)){this.removeEventListener("keyup",tt(this,di,ta));return}this.keyboardShortcutHandler(t)};qa=new WeakSet;ws=function(t){const{metaKey:e,altKey:i,key:a}=t;if(e||i||!td.includes(a)){this.removeEventListener("keyup",tt(this,di,ta));return}[" ","ArrowLeft","ArrowRight"].includes(a)&&!(y(this,Et).contains(`no${a.toLowerCase()}`)||a===" "&&y(this,Et).contains("nospace"))&&t.preventDefault(),this.addEventListener("keyup",tt(this,di,ta),{once:!0})};const kc=Object.values(r),Sc=Object.values(wl),id=t=>{var e,i,a,n;let{observedAttributes:s}=t.constructor;!s&&((e=t.nodeName)!=null&&e.includes("-"))&&(d.customElements.upgrade(t),{observedAttributes:s}=t.constructor);const o=(n=(a=(i=t?.getAttribute)==null?void 0:i.call(t,w.MEDIA_CHROME_ATTRIBUTES))==null?void 0:a.split)==null?void 0:n.call(a,/\s+/);return Array.isArray(s||o)?(s||o).filter(l=>kc.includes(l)):[]},Ic=t=>{var e,i;return(e=t.nodeName)!=null&&e.includes("-")&&d.customElements.get((i=t.nodeName)==null?void 0:i.toLowerCase())&&!(t instanceof d.customElements.get(t.nodeName.toLowerCase()))&&d.customElements.upgrade(t),Sc.some(a=>a in t)},Ms=t=>Ic(t)||!!id(t).length,Vo=t=>{var e;return(e=t?.join)==null?void 0:e.call(t,":")},Go={[r.MEDIA_SUBTITLES_LIST]:ea,[r.MEDIA_SUBTITLES_SHOWING]:ea,[r.MEDIA_SEEKABLE]:Vo,[r.MEDIA_BUFFERED]:t=>t?.map(Vo).join(" "),[r.MEDIA_PREVIEW_COORDS]:t=>t?.join(" "),[r.MEDIA_RENDITION_LIST]:wu,[r.MEDIA_AUDIO_TRACK_LIST]:Ru},wc=async(t,e,i)=>{var a,n;if(t.isConnected||await Cl(0),typeof i=="boolean"||i==null)return S(t,e,i);if(typeof i=="number")return H(t,e,i);if(typeof i=="string")return U(t,e,i);if(Array.isArray(i)&&!i.length)return t.removeAttribute(e);const s=(n=(a=Go[e])==null?void 0:a.call(Go,i))!=null?n:i;return t.setAttribute(e,s)},Mc=t=>{var e;return!!((e=t.closest)!=null&&e.call(t,'*[slot="media"]'))},ut=(t,e)=>{if(Mc(t))return;const i=(n,s)=>{var o,l;Ms(n)&&s(n);const{children:u=[]}=n??{},c=(l=(o=n?.shadowRoot)==null?void 0:o.children)!=null?l:[];[...u,...c].forEach(g=>ut(g,s))},a=t?.nodeName.toLowerCase();if(a.includes("-")&&!Ms(t)){d.customElements.whenDefined(a).then(()=>{i(t,e)});return}i(t,e)},Ko=(t,e,i)=>{t.forEach(a=>{if(e in a){a[e]=i;return}const n=id(a),s=e.toLowerCase();n.includes(s)&&wc(a,s,i)})},Lc=(t,e,i)=>{ut(t,e);const a=f=>{var g;const h=(g=f?.composedPath()[0])!=null?g:f.target;e(h)},n=f=>{var g;const h=(g=f?.composedPath()[0])!=null?g:f.target;i(h)};t.addEventListener(E.REGISTER_MEDIA_STATE_RECEIVER,a),t.addEventListener(E.UNREGISTER_MEDIA_STATE_RECEIVER,n);const s=f=>{f.forEach(g=>{const{addedNodes:h=[],removedNodes:p=[],type:M,target:A,attributeName:_}=g;M==="childList"?(Array.prototype.forEach.call(h,L=>ut(L,e)),Array.prototype.forEach.call(p,L=>ut(L,i))):M==="attributes"&&_===w.MEDIA_CHROME_ATTRIBUTES&&(Ms(A)?e(A):i(A))})};let o=[];const l=f=>{const g=f.target;g.name!=="media"&&(o.forEach(h=>ut(h,i)),o=[...g.assignedElements({flatten:!0})],o.forEach(h=>ut(h,e)))};t.addEventListener("slotchange",l);const u=new MutationObserver(s);return u.observe(t,{childList:!0,attributes:!0,subtree:!0}),()=>{ut(t,i),t.removeEventListener("slotchange",l),u.disconnect(),t.removeEventListener(E.REGISTER_MEDIA_STATE_RECEIVER,a),t.removeEventListener(E.UNREGISTER_MEDIA_STATE_RECEIVER,n)}};d.customElements.get("media-controller")||d.customElements.define("media-controller",yc);const Lt={PLACEMENT:"placement",BOUNDS:"bounds"};function Cc(t){return`
    <style>
      :host {
        --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
        --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
        --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
        --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
        --_tooltip-arrow-background: var(--media-tooltip-arrow-color, var(--_tooltip-background-color));
        position: relative;
        pointer-events: none;
        display: var(--media-tooltip-display, inline-flex);
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        z-index: var(--media-tooltip-z-index, 1);
        background: var(--_tooltip-background);
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        font: var(--media-font,
          var(--media-font-weight, 400)
          var(--media-font-size, 13px) /
          var(--media-text-content-height, var(--media-control-height, 18px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        padding: var(--media-tooltip-padding, .35em .7em);
        border: var(--media-tooltip-border, none);
        border-radius: var(--media-tooltip-border-radius, 5px);
        filter: var(--media-tooltip-filter, drop-shadow(0 0 4px rgba(0, 0, 0, .2)));
        white-space: var(--media-tooltip-white-space, nowrap);
      }

      :host([hidden]) {
        display: none;
      }

      img, svg {
        display: inline-block;
      }

      #arrow {
        position: absolute;
        width: 0px;
        height: 0px;
        border-style: solid;
        display: var(--media-tooltip-arrow-display, block);
      }

      :host(:not([placement])),
      :host([placement="top"]) {
        position: absolute;
        bottom: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host(:not([placement])) #arrow,
      :host([placement="top"]) #arrow {
        top: 100%;
        left: 50%;
        border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
        border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="right"]) {
        position: absolute;
        left: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="right"]) #arrow {
        top: 50%;
        right: 100%;
        border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
        border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
        transform: translate(0, -50%);
      }

      :host([placement="bottom"]) {
        position: absolute;
        top: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host([placement="bottom"]) #arrow {
        bottom: 100%;
        left: 50%;
        border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
        border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="left"]) {
        position: absolute;
        right: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="left"]) #arrow {
        top: 50%;
        left: 100%;
        border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
        border-color: transparent transparent transparent var(--_tooltip-arrow-background);
        transform: translate(0, -50%);
      }
      
      :host([placement="none"]) #arrow {
        display: none;
      }
    </style>
    <slot></slot>
    <div id="arrow"></div>
  `}class is extends d.HTMLElement{constructor(){if(super(),this.updateXOffset=()=>{var e;if(!Hl(this,{checkOpacity:!1,checkVisibilityCSS:!1}))return;const i=this.placement;if(i==="left"||i==="right"){this.style.removeProperty("--media-tooltip-offset-x");return}const a=getComputedStyle(this),n=(e=hi(this,"#"+this.bounds))!=null?e:ue(this);if(!n)return;const{x:s,width:o}=n.getBoundingClientRect(),{x:l,width:u}=this.getBoundingClientRect(),c=l+u,f=s+o,g=a.getPropertyValue("--media-tooltip-offset-x"),h=g?parseFloat(g.replace("px","")):0,p=a.getPropertyValue("--media-tooltip-container-margin"),M=p?parseFloat(p.replace("px","")):0,A=l-s+h-M,_=c-f+h+M;if(A<0){this.style.setProperty("--media-tooltip-offset-x",`${A}px`);return}if(_>0){this.style.setProperty("--media-tooltip-offset-x",`${_}px`);return}this.style.removeProperty("--media-tooltip-offset-x")},!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=se(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}if(this.arrowEl=this.shadowRoot.querySelector("#arrow"),Object.prototype.hasOwnProperty.call(this,"placement")){const e=this.placement;delete this.placement,this.placement=e}}static get observedAttributes(){return[Lt.PLACEMENT,Lt.BOUNDS]}get placement(){return P(this,Lt.PLACEMENT)}set placement(e){U(this,Lt.PLACEMENT,e)}get bounds(){return P(this,Lt.BOUNDS)}set bounds(e){U(this,Lt.BOUNDS,e)}}is.shadowRootOptions={mode:"open"};is.getTemplateHTML=Cc;d.customElements.get("media-tooltip")||d.customElements.define("media-tooltip",is);var qo=is,Mr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},W=(t,e,i)=>(Mr(t,e,"read from private field"),i?i.call(t):e.get(t)),Ct=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},La=(t,e,i,a)=>(Mr(t,e,"write to private field"),e.set(t,i),i),Rc=(t,e,i)=>(Mr(t,e,"access private method"),i),Ae,Xt,it,Nt,Ya,Ls,ad;const Ye={TOOLTIP_PLACEMENT:"tooltipplacement",DISABLED:"disabled",NO_TOOLTIP:"notooltip"};function Dc(t,e={}){return`
    <style>
      :host {
        position: relative;
        font: var(--media-font,
          var(--media-font-weight, bold)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        padding: var(--media-button-padding, var(--media-control-padding, 10px));
        justify-content: var(--media-button-justify-content, center);
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        transition: background .15s linear;
        pointer-events: auto;
        cursor: var(--media-cursor, pointer);
        -webkit-tap-highlight-color: transparent;
      }

      
      :host(:focus-visible) {
        box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
        outline: 0;
      }
      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgba(50 50 70 / .7));
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-button-icon-width);
        height: var(--media-button-icon-height, var(--media-control-height, 24px));
        transform: var(--media-button-icon-transform);
        transition: var(--media-button-icon-transition);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
      }

      media-tooltip {
        
        max-width: 0;
        overflow-x: clip;
        opacity: 0;
        transition: opacity .3s, max-width 0s 9s;
      }

      :host(:hover) media-tooltip,
      :host(:focus-visible) media-tooltip {
        max-width: 100vw;
        opacity: 1;
        transition: opacity .3s;
      }

      :host([notooltip]) slot[name="tooltip"] {
        display: none;
      }
    </style>

    ${this.getSlotTemplateHTML(t,e)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${qo.shadowRootOptions.mode}">
          ${qo.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(t)}
        </slot>
      </media-tooltip>
    </slot>
  `}function xc(t,e){return`
    <slot></slot>
  `}function Oc(){return""}class Z extends d.HTMLElement{constructor(){if(super(),Ct(this,Ls),Ct(this,Ae,void 0),this.preventClick=!1,this.tooltipEl=null,Ct(this,Xt,e=>{this.preventClick||this.handleClick(e),setTimeout(W(this,it),0)}),Ct(this,it,()=>{var e,i;(i=(e=this.tooltipEl)==null?void 0:e.updateXOffset)==null||i.call(e)}),Ct(this,Nt,e=>{const{key:i}=e;if(!this.keysUsed.includes(i)){this.removeEventListener("keyup",W(this,Nt));return}this.preventClick||this.handleClick(e)}),Ct(this,Ya,e=>{const{metaKey:i,altKey:a,key:n}=e;if(i||a||!this.keysUsed.includes(n)){this.removeEventListener("keyup",W(this,Nt));return}this.addEventListener("keyup",W(this,Nt),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=se(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}this.tooltipEl=this.shadowRoot.querySelector("media-tooltip")}static get observedAttributes(){return["disabled",Ye.TOOLTIP_PLACEMENT,w.MEDIA_CONTROLLER]}enable(){this.addEventListener("click",W(this,Xt)),this.addEventListener("keydown",W(this,Ya)),this.tabIndex=0}disable(){this.removeEventListener("click",W(this,Xt)),this.removeEventListener("keydown",W(this,Ya)),this.removeEventListener("keyup",W(this,Nt)),this.tabIndex=-1}attributeChangedCallback(e,i,a){var n,s,o,l,u;e===w.MEDIA_CONTROLLER?(i&&((s=(n=W(this,Ae))==null?void 0:n.unassociateElement)==null||s.call(n,this),La(this,Ae,null)),a&&this.isConnected&&(La(this,Ae,(o=this.getRootNode())==null?void 0:o.getElementById(a)),(u=(l=W(this,Ae))==null?void 0:l.associateElement)==null||u.call(l,this))):e==="disabled"&&a!==i?a==null?this.enable():this.disable():e===Ye.TOOLTIP_PLACEMENT&&this.tooltipEl&&a!==i&&(this.tooltipEl.placement=a),W(this,it).call(this)}connectedCallback(){var e,i,a;const{style:n}=F(this.shadowRoot,":host");n.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute("disabled")?this.disable():this.enable(),this.setAttribute("role","button");const s=this.getAttribute(w.MEDIA_CONTROLLER);s&&(La(this,Ae,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=W(this,Ae))==null?void 0:i.associateElement)==null||a.call(i,this)),d.customElements.whenDefined("media-tooltip").then(()=>Rc(this,Ls,ad).call(this))}disconnectedCallback(){var e,i;this.disable(),(i=(e=W(this,Ae))==null?void 0:e.unassociateElement)==null||i.call(e,this),La(this,Ae,null),this.removeEventListener("mouseenter",W(this,it)),this.removeEventListener("focus",W(this,it)),this.removeEventListener("click",W(this,Xt))}get keysUsed(){return["Enter"," "]}get tooltipPlacement(){return P(this,Ye.TOOLTIP_PLACEMENT)}set tooltipPlacement(e){U(this,Ye.TOOLTIP_PLACEMENT,e)}get mediaController(){return P(this,w.MEDIA_CONTROLLER)}set mediaController(e){U(this,w.MEDIA_CONTROLLER,e)}get disabled(){return k(this,Ye.DISABLED)}set disabled(e){S(this,Ye.DISABLED,e)}get noTooltip(){return k(this,Ye.NO_TOOLTIP)}set noTooltip(e){S(this,Ye.NO_TOOLTIP,e)}handleClick(e){}}Ae=new WeakMap;Xt=new WeakMap;it=new WeakMap;Nt=new WeakMap;Ya=new WeakMap;Ls=new WeakSet;ad=function(){this.addEventListener("mouseenter",W(this,it)),this.addEventListener("focus",W(this,it)),this.addEventListener("click",W(this,Xt));const t=this.tooltipPlacement;t&&this.tooltipEl&&(this.tooltipEl.placement=t)};Z.shadowRootOptions={mode:"open"};Z.getTemplateHTML=Dc;Z.getSlotTemplateHTML=xc;Z.getTooltipContentHTML=Oc;d.customElements.get("media-chrome-button")||d.customElements.define("media-chrome-button",Z);const Yo=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`;function Pc(t){return`
    <style>
      :host([${r.MEDIA_IS_AIRPLAYING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${r.MEDIA_IS_AIRPLAYING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${r.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${r.MEDIA_IS_AIRPLAYING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Yo}</slot>
      <slot name="exit">${Yo}</slot>
    </slot>
  `}function Uc(){return`
    <slot name="tooltip-enter">${v("start airplay")}</slot>
    <slot name="tooltip-exit">${v("stop airplay")}</slot>
  `}const zo=t=>{const e=t.mediaIsAirplaying?v("stop airplay"):v("start airplay");t.setAttribute("aria-label",e)};class Lr extends Z{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_IS_AIRPLAYING,r.MEDIA_AIRPLAY_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),zo(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_IS_AIRPLAYING&&zo(this)}get mediaIsAirplaying(){return k(this,r.MEDIA_IS_AIRPLAYING)}set mediaIsAirplaying(e){S(this,r.MEDIA_IS_AIRPLAYING,e)}get mediaAirplayUnavailable(){return P(this,r.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){U(this,r.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){const e=new d.CustomEvent(E.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(e)}}Lr.getSlotTemplateHTML=Pc;Lr.getTooltipContentHTML=Uc;d.customElements.get("media-airplay-button")||d.customElements.define("media-airplay-button",Lr);const $c=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,Nc=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;function Hc(t){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-checked="true"]) slot[name=tooltip-enable],
      :host(:not([aria-checked="true"])) slot[name=tooltip-disable] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${$c}</slot>
      <slot name="off">${Nc}</slot>
    </slot>
  `}function Bc(){return`
    <slot name="tooltip-enable">${v("Enable captions")}</slot>
    <slot name="tooltip-disable">${v("Disable captions")}</slot>
  `}const Qo=t=>{t.setAttribute("aria-checked",Zl(t).toString())};class Cr extends Z{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_SUBTITLES_LIST,r.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","switch"),this.setAttribute("aria-label",v("closed captions")),Qo(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_SUBTITLES_SHOWING&&Qo(this)}get mediaSubtitlesList(){return Zo(this,r.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){Xo(this,r.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return Zo(this,r.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){Xo(this,r.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){this.dispatchEvent(new d.CustomEvent(E.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}))}}Cr.getSlotTemplateHTML=Hc;Cr.getTooltipContentHTML=Bc;const Zo=(t,e)=>{const i=t.getAttribute(e);return i?es(i):[]},Xo=(t,e,i)=>{if(!i?.length){t.removeAttribute(e);return}const a=ea(i);t.getAttribute(e)!==a&&t.setAttribute(e,a)};d.customElements.get("media-captions-button")||d.customElements.define("media-captions-button",Cr);const Wc='<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg>',Fc='<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg>';function Vc(t){return`
    <style>
      :host([${r.MEDIA_IS_CASTING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${r.MEDIA_IS_CASTING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${r.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
      :host(:not([${r.MEDIA_IS_CASTING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Wc}</slot>
      <slot name="exit">${Fc}</slot>
    </slot>
  `}function Gc(){return`
    <slot name="tooltip-enter">${v("Start casting")}</slot>
    <slot name="tooltip-exit">${v("Stop casting")}</slot>
  `}const Jo=t=>{const e=t.mediaIsCasting?v("stop casting"):v("start casting");t.setAttribute("aria-label",e)};class Rr extends Z{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_IS_CASTING,r.MEDIA_CAST_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),Jo(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_IS_CASTING&&Jo(this)}get mediaIsCasting(){return k(this,r.MEDIA_IS_CASTING)}set mediaIsCasting(e){S(this,r.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return P(this,r.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){U(this,r.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){const e=this.mediaIsCasting?E.MEDIA_EXIT_CAST_REQUEST:E.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new d.CustomEvent(e,{composed:!0,bubbles:!0}))}}Rr.getSlotTemplateHTML=Vc;Rr.getTooltipContentHTML=Gc;d.customElements.get("media-cast-button")||d.customElements.define("media-cast-button",Rr);var Dr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},_t=(t,e,i)=>(Dr(t,e,"read from private field"),e.get(t)),$e=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},xr=(t,e,i,a)=>(Dr(t,e,"write to private field"),e.set(t,i),i),ot=(t,e,i)=>(Dr(t,e,"access private method"),i),On,ia,wt,za,Cs,Rs,nd,Ds,sd,xs,rd,Os,od,Ps,ld;function Kc(t){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        display: var(--media-dialog-display, inline-flex);
        justify-content: center;
        align-items: center;
        
        transition-behavior: allow-discrete;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      :host([open]) {
        transition: display .2s, visibility 0s, opacity .2s ease-out, transform .15s ease-out;
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      #content {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: min(320px, 100%);
        word-wrap: break-word;
        max-height: 100%;
        overflow: auto;
        text-align: center;
        line-height: 1.4;
      }
    </style>
    ${this.getSlotTemplateHTML(t)}
  `}function qc(t){return`
    <slot id="content"></slot>
  `}const gi={OPEN:"open",ANCHOR:"anchor"};class ua extends d.HTMLElement{constructor(){super(),$e(this,za),$e(this,Rs),$e(this,Ds),$e(this,xs),$e(this,Os),$e(this,Ps),$e(this,On,!1),$e(this,ia,null),$e(this,wt,null),this.addEventListener("invoke",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this)}static get observedAttributes(){return[gi.OPEN,gi.ANCHOR]}get open(){return k(this,gi.OPEN)}set open(e){S(this,gi.OPEN,e)}handleEvent(e){switch(e.type){case"invoke":ot(this,xs,rd).call(this,e);break;case"focusout":ot(this,Os,od).call(this,e);break;case"keydown":ot(this,Ps,ld).call(this,e);break}}connectedCallback(){ot(this,za,Cs).call(this),this.role||(this.role="dialog")}attributeChangedCallback(e,i,a){ot(this,za,Cs).call(this),e===gi.OPEN&&a!==i&&(this.open?ot(this,Rs,nd).call(this):ot(this,Ds,sd).call(this))}focus(){xr(this,ia,Ar());const e=!this.dispatchEvent(new Event("focus",{composed:!0,cancelable:!0})),i=!this.dispatchEvent(new Event("focusin",{composed:!0,bubbles:!0,cancelable:!0}));if(e||i)return;const a=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');a?.focus()}get keysUsed(){return["Escape","Tab"]}}On=new WeakMap;ia=new WeakMap;wt=new WeakMap;za=new WeakSet;Cs=function(){if(!_t(this,On)&&(xr(this,On,!0),!this.shadowRoot)){this.attachShadow(this.constructor.shadowRootOptions);const t=se(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(t),queueMicrotask(()=>{const{style:e}=F(this.shadowRoot,":host");e.setProperty("transition","display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in")})}};Rs=new WeakSet;nd=function(){var t;(t=_t(this,wt))==null||t.setAttribute("aria-expanded","true"),this.dispatchEvent(new Event("open",{composed:!0,bubbles:!0})),this.addEventListener("transitionend",()=>this.focus(),{once:!0})};Ds=new WeakSet;sd=function(){var t;(t=_t(this,wt))==null||t.setAttribute("aria-expanded","false"),this.dispatchEvent(new Event("close",{composed:!0,bubbles:!0}))};xs=new WeakSet;rd=function(t){xr(this,wt,t.relatedTarget),Fe(this,t.relatedTarget)||(this.open=!this.open)};Os=new WeakSet;od=function(t){var e;Fe(this,t.relatedTarget)||((e=_t(this,ia))==null||e.focus(),_t(this,wt)&&_t(this,wt)!==t.relatedTarget&&this.open&&(this.open=!1))};Ps=new WeakSet;ld=function(t){var e,i,a,n,s;const{key:o,ctrlKey:l,altKey:u,metaKey:c}=t;l||u||c||this.keysUsed.includes(o)&&(t.preventDefault(),t.stopPropagation(),o==="Tab"?(t.shiftKey?(i=(e=this.previousElementSibling)==null?void 0:e.focus)==null||i.call(e):(n=(a=this.nextElementSibling)==null?void 0:a.focus)==null||n.call(a),this.blur()):o==="Escape"&&((s=_t(this,ia))==null||s.focus(),this.open=!1))};ua.shadowRootOptions={mode:"open"};ua.getTemplateHTML=Kc;ua.getSlotTemplateHTML=qc;d.customElements.get("media-chrome-dialog")||d.customElements.define("media-chrome-dialog",ua);var Or=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},N=(t,e,i)=>(Or(t,e,"read from private field"),i?i.call(t):e.get(t)),Q=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Qe=(t,e,i,a)=>(Or(t,e,"write to private field"),e.set(t,i),i),pe=(t,e,i)=>(Or(t,e,"access private method"),i),Te,as,Qa,Za,ve,Pn,Xa,Ja,ja,Pr,dd,en,Us,tn,$s,Un,Ur,Ns,ud,Hs,cd,Bs,hd,Ws,md;function Yc(t){return`
    <style>
      :host {
        --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

        box-shadow: var(--_focus-visible-box-shadow, none);
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
        display: inline-flex;
        align-items: center;
        
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        width: 100px;
        transition: background .15s linear;
        cursor: var(--media-cursor, pointer);
        pointer-events: auto;
        touch-action: none; 
      }

      
      input[type=range]:focus {
        outline: 0;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgb(50 50 70 / .7));
      }

      #leftgap {
        padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      }

      #rightgap {
        padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      }

      #startpoint,
      #endpoint {
        position: absolute;
      }

      #endpoint {
        right: 0;
      }

      #container {
        
        width: var(--media-range-track-width, 100%);
        transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 40px;
      }

      #range {
        
        display: var(--media-time-range-hover-display, block);
        bottom: var(--media-time-range-hover-bottom, -7px);
        height: var(--media-time-range-hover-height, max(100% + 7px, 25px));
        width: 100%;
        position: absolute;
        cursor: var(--media-cursor, pointer);

        -webkit-appearance: none; 
        -webkit-tap-highlight-color: transparent;
        background: transparent; 
        margin: 0;
        z-index: 1;
      }

      @media (hover: hover) {
        #range {
          bottom: var(--media-time-range-hover-bottom, -5px);
          height: var(--media-time-range-hover-height, max(100% + 5px, 20px));
        }
      }

      
      
      #range::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: transparent;
        width: .1px;
        height: .1px;
      }

      
      #range::-moz-range-thumb {
        background: transparent;
        border: transparent;
        width: .1px;
        height: .1px;
      }

      #appearance {
        height: var(--media-range-track-height, 4px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        position: absolute;
        
        will-change: transform;
      }

      #track {
        background: var(--media-range-track-background, rgb(255 255 255 / .2));
        border-radius: var(--media-range-track-border-radius, 1px);
        border: var(--media-range-track-border, none);
        outline: var(--media-range-track-outline);
        outline-offset: var(--media-range-track-outline-offset);
        backdrop-filter: var(--media-range-track-backdrop-filter);
        -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
        box-shadow: var(--media-range-track-box-shadow, none);
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #progress,
      #pointer {
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #progress {
        background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
        transition: var(--media-range-track-transition);
      }

      #pointer {
        background: var(--media-range-track-pointer-background);
        border-right: var(--media-range-track-pointer-border-right);
        transition: visibility .25s, opacity .25s;
        visibility: hidden;
        opacity: 0;
      }

      @media (hover: hover) {
        :host(:hover) #pointer {
          transition: visibility .5s, opacity .5s;
          visibility: visible;
          opacity: 1;
        }
      }

      #thumb,
      ::slotted([slot=thumb]) {
        width: var(--media-range-thumb-width, 10px);
        height: var(--media-range-thumb-height, 10px);
        transition: var(--media-range-thumb-transition);
        transform: var(--media-range-thumb-transform, none);
        opacity: var(--media-range-thumb-opacity, 1);
        translate: -50%;
        position: absolute;
        left: 0;
        cursor: var(--media-cursor, pointer);
      }

      #thumb {
        border-radius: var(--media-range-thumb-border-radius, 10px);
        background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
        box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
        border: var(--media-range-thumb-border, none);
      }

      :host([disabled]) #thumb {
        background-color: #777;
      }

      .segments #appearance {
        height: var(--media-range-segment-hover-height, 7px);
      }

      #track {
        clip-path: url(#segments-clipping);
      }

      #segments {
        --segments-gap: var(--media-range-segments-gap, 2px);
        position: absolute;
        width: 100%;
        height: 100%;
      }

      #segments-clipping {
        transform: translateX(calc(var(--segments-gap) / 2));
      }

      #segments-clipping:empty {
        display: none;
      }

      #segments-clipping rect {
        height: var(--media-range-track-height, 4px);
        y: calc((var(--media-range-segment-hover-height, 7px) - var(--media-range-track-height, 4px)) / 2);
        transition: var(--media-range-segment-transition, transform .1s ease-in-out);
        transform: var(--media-range-segment-transform, scaleY(1));
        transform-origin: center;
      }
    </style>
    <div id="leftgap"></div>
    <div id="container">
      <div id="startpoint"></div>
      <div id="endpoint"></div>
      <div id="appearance">
        <div id="track" part="track">
          <div id="pointer"></div>
          <div id="progress" part="progress"></div>
        </div>
        <slot name="thumb">
          <div id="thumb" part="thumb"></div>
        </slot>
        <svg id="segments"><clipPath id="segments-clipping"></clipPath></svg>
      </div>
      <input id="range" type="range" min="0" max="1" step="any" value="0">
    </div>
    <div id="rightgap"></div>
  `}class mi extends d.HTMLElement{constructor(){if(super(),Q(this,Pr),Q(this,en),Q(this,tn),Q(this,Un),Q(this,Ns),Q(this,Hs),Q(this,Bs),Q(this,Ws),Q(this,Te,void 0),Q(this,as,void 0),Q(this,Qa,void 0),Q(this,Za,void 0),Q(this,ve,{}),Q(this,Pn,[]),Q(this,Xa,()=>{if(this.range.matches(":focus-visible")){const{style:e}=F(this.shadowRoot,":host");e.setProperty("--_focus-visible-box-shadow","var(--_focus-box-shadow)")}}),Q(this,Ja,()=>{const{style:e}=F(this.shadowRoot,":host");e.removeProperty("--_focus-visible-box-shadow")}),Q(this,ja,()=>{const e=this.shadowRoot.querySelector("#segments-clipping");e&&e.parentNode.append(e)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=se(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}this.container=this.shadowRoot.querySelector("#container"),Qe(this,Qa,this.shadowRoot.querySelector("#startpoint")),Qe(this,Za,this.shadowRoot.querySelector("#endpoint")),this.range=this.shadowRoot.querySelector("#range"),this.appearance=this.shadowRoot.querySelector("#appearance")}static get observedAttributes(){return["disabled","aria-disabled",w.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var n,s,o,l,u;e===w.MEDIA_CONTROLLER?(i&&((s=(n=N(this,Te))==null?void 0:n.unassociateElement)==null||s.call(n,this),Qe(this,Te,null)),a&&this.isConnected&&(Qe(this,Te,(o=this.getRootNode())==null?void 0:o.getElementById(a)),(u=(l=N(this,Te))==null?void 0:l.associateElement)==null||u.call(l,this))):(e==="disabled"||e==="aria-disabled"&&i!==a)&&(a==null?(this.range.removeAttribute(e),pe(this,en,Us).call(this)):(this.range.setAttribute(e,a),pe(this,tn,$s).call(this)))}connectedCallback(){var e,i,a;const{style:n}=F(this.shadowRoot,":host");n.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),N(this,ve).pointer=F(this.shadowRoot,"#pointer"),N(this,ve).progress=F(this.shadowRoot,"#progress"),N(this,ve).thumb=F(this.shadowRoot,'#thumb, ::slotted([slot="thumb"])'),N(this,ve).activeSegment=F(this.shadowRoot,"#segments-clipping rect:nth-child(0)");const s=this.getAttribute(w.MEDIA_CONTROLLER);s&&(Qe(this,Te,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=N(this,Te))==null?void 0:i.associateElement)==null||a.call(i,this)),this.updateBar(),this.shadowRoot.addEventListener("focusin",N(this,Xa)),this.shadowRoot.addEventListener("focusout",N(this,Ja)),pe(this,en,Us).call(this),ri(this.container,N(this,ja))}disconnectedCallback(){var e,i;pe(this,tn,$s).call(this),(i=(e=N(this,Te))==null?void 0:e.unassociateElement)==null||i.call(e,this),Qe(this,Te,null),this.shadowRoot.removeEventListener("focusin",N(this,Xa)),this.shadowRoot.removeEventListener("focusout",N(this,Ja)),oi(this.container,N(this,ja))}updatePointerBar(e){var i;(i=N(this,ve).pointer)==null||i.style.setProperty("width",`${this.getPointerRatio(e)*100}%`)}updateBar(){var e,i;const a=this.range.valueAsNumber*100;(e=N(this,ve).progress)==null||e.style.setProperty("width",`${a}%`),(i=N(this,ve).thumb)==null||i.style.setProperty("left",`${a}%`)}updateSegments(e){const i=this.shadowRoot.querySelector("#segments-clipping");if(i.textContent="",this.container.classList.toggle("segments",!!e?.length),!e?.length)return;const a=[...new Set([+this.range.min,...e.flatMap(s=>[s.start,s.end]),+this.range.max])];Qe(this,Pn,[...a]);const n=a.pop();for(const[s,o]of a.entries()){const[l,u]=[s===0,s===a.length-1],c=l?"calc(var(--segments-gap) / -1)":`${o*100}%`,g=`calc(${((u?n:a[s+1])-o)*100}%${l||u?"":" - var(--segments-gap)"})`,h=G.createElementNS("http://www.w3.org/2000/svg","rect"),p=F(this.shadowRoot,`#segments-clipping rect:nth-child(${s+1})`);p.style.setProperty("x",c),p.style.setProperty("width",g),i.append(h)}}getPointerRatio(e){return Fu(e.clientX,e.clientY,N(this,Qa).getBoundingClientRect(),N(this,Za).getBoundingClientRect())}get dragging(){return this.hasAttribute("dragging")}handleEvent(e){switch(e.type){case"pointermove":pe(this,Ws,md).call(this,e);break;case"input":this.updateBar();break;case"pointerenter":pe(this,Ns,ud).call(this,e);break;case"pointerdown":pe(this,Un,Ur).call(this,e);break;case"pointerup":pe(this,Hs,cd).call(this);break;case"pointerleave":pe(this,Bs,hd).call(this);break}}get keysUsed(){return["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]}}Te=new WeakMap;as=new WeakMap;Qa=new WeakMap;Za=new WeakMap;ve=new WeakMap;Pn=new WeakMap;Xa=new WeakMap;Ja=new WeakMap;ja=new WeakMap;Pr=new WeakSet;dd=function(t){const e=N(this,ve).activeSegment;if(!e)return;const i=this.getPointerRatio(t),n=`#segments-clipping rect:nth-child(${N(this,Pn).findIndex((s,o,l)=>{const u=l[o+1];return u!=null&&i>=s&&i<=u})+1})`;(e.selectorText!=n||!e.style.transform)&&(e.selectorText=n,e.style.setProperty("transform","var(--media-range-segment-hover-transform, scaleY(2))"))};en=new WeakSet;Us=function(){this.hasAttribute("disabled")||(this.addEventListener("input",this),this.addEventListener("pointerdown",this),this.addEventListener("pointerenter",this))};tn=new WeakSet;$s=function(){var t,e;this.removeEventListener("input",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointerenter",this),(t=d.window)==null||t.removeEventListener("pointerup",this),(e=d.window)==null||e.removeEventListener("pointermove",this)};Un=new WeakSet;Ur=function(t){var e;Qe(this,as,t.composedPath().includes(this.range)),(e=d.window)==null||e.addEventListener("pointerup",this)};Ns=new WeakSet;ud=function(t){var e;t.pointerType!=="mouse"&&pe(this,Un,Ur).call(this,t),this.addEventListener("pointerleave",this),(e=d.window)==null||e.addEventListener("pointermove",this)};Hs=new WeakSet;cd=function(){var t;(t=d.window)==null||t.removeEventListener("pointerup",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled")};Bs=new WeakSet;hd=function(){var t,e;this.removeEventListener("pointerleave",this),(t=d.window)==null||t.removeEventListener("pointermove",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled"),(e=N(this,ve).activeSegment)==null||e.style.removeProperty("transform")};Ws=new WeakSet;md=function(t){this.toggleAttribute("dragging",t.buttons===1||t.pointerType!=="mouse"),this.updatePointerBar(t),pe(this,Pr,dd).call(this,t),this.dragging&&(t.pointerType!=="mouse"||!N(this,as))&&(this.range.disabled=!0,this.range.valueAsNumber=this.getPointerRatio(t),this.range.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})))};mi.shadowRootOptions={mode:"open"};mi.getTemplateHTML=Yc;d.customElements.get("media-chrome-range")||d.customElements.define("media-chrome-range",mi);var pd=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ca=(t,e,i)=>(pd(t,e,"read from private field"),i?i.call(t):e.get(t)),zc=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ra=(t,e,i,a)=>(pd(t,e,"write to private field"),e.set(t,i),i),ye;function Qc(t){return`
    <style>
      :host {
        
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --media-loading-indicator-icon-height: 44px;
      }

      ::slotted(media-time-range),
      ::slotted(media-volume-range) {
        min-height: 100%;
      }

      ::slotted(media-time-range),
      ::slotted(media-clip-selector) {
        flex-grow: 1;
      }

      ::slotted([role="menu"]) {
        position: absolute;
      }
    </style>

    <slot></slot>
  `}class $r extends d.HTMLElement{constructor(){if(super(),zc(this,ye,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=se(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[w.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var n,s,o,l,u;e===w.MEDIA_CONTROLLER&&(i&&((s=(n=Ca(this,ye))==null?void 0:n.unassociateElement)==null||s.call(n,this),Ra(this,ye,null)),a&&this.isConnected&&(Ra(this,ye,(o=this.getRootNode())==null?void 0:o.getElementById(a)),(u=(l=Ca(this,ye))==null?void 0:l.associateElement)==null||u.call(l,this)))}connectedCallback(){var e,i,a;const n=this.getAttribute(w.MEDIA_CONTROLLER);n&&(Ra(this,ye,(e=this.getRootNode())==null?void 0:e.getElementById(n)),(a=(i=Ca(this,ye))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Ca(this,ye))==null?void 0:e.unassociateElement)==null||i.call(e,this),Ra(this,ye,null)}}ye=new WeakMap;$r.shadowRootOptions={mode:"open"};$r.getTemplateHTML=Qc;d.customElements.get("media-control-bar")||d.customElements.define("media-control-bar",$r);var vd=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Da=(t,e,i)=>(vd(t,e,"read from private field"),i?i.call(t):e.get(t)),Zc=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},xa=(t,e,i,a)=>(vd(t,e,"write to private field"),e.set(t,i),i),ke;function Xc(t,e={}){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
        padding: var(--media-control-padding, 10px);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        text-align: center;
        pointer-events: auto;
      }

      
      :host(:focus-visible) {
        box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
        outline: 0;
      }

      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }
    </style>

    ${this.getSlotTemplateHTML(t,e)}
  `}function Jc(t,e){return`
    <slot></slot>
  `}class st extends d.HTMLElement{constructor(){if(super(),Zc(this,ke,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=se(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[w.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var n,s,o,l,u;e===w.MEDIA_CONTROLLER&&(i&&((s=(n=Da(this,ke))==null?void 0:n.unassociateElement)==null||s.call(n,this),xa(this,ke,null)),a&&this.isConnected&&(xa(this,ke,(o=this.getRootNode())==null?void 0:o.getElementById(a)),(u=(l=Da(this,ke))==null?void 0:l.associateElement)==null||u.call(l,this)))}connectedCallback(){var e,i,a;const{style:n}=F(this.shadowRoot,":host");n.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`);const s=this.getAttribute(w.MEDIA_CONTROLLER);s&&(xa(this,ke,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=Da(this,ke))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Da(this,ke))==null?void 0:e.unassociateElement)==null||i.call(e,this),xa(this,ke,null)}}ke=new WeakMap;st.shadowRootOptions={mode:"open"};st.getTemplateHTML=Xc;st.getSlotTemplateHTML=Jc;d.customElements.get("media-text-display")||d.customElements.define("media-text-display",st);var Ed=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},jo=(t,e,i)=>(Ed(t,e,"read from private field"),i?i.call(t):e.get(t)),jc=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},eh=(t,e,i,a)=>(Ed(t,e,"write to private field"),e.set(t,i),i),Ri;function th(t,e){return`
    <slot>${at(e.mediaDuration)}</slot>
  `}class fd extends st{constructor(){var e;super(),jc(this,Ri,void 0),eh(this,Ri,this.shadowRoot.querySelector("slot")),jo(this,Ri).textContent=at((e=this.mediaDuration)!=null?e:0)}static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_DURATION]}attributeChangedCallback(e,i,a){e===r.MEDIA_DURATION&&(jo(this,Ri).textContent=at(+a)),super.attributeChangedCallback(e,i,a)}get mediaDuration(){return O(this,r.MEDIA_DURATION)}set mediaDuration(e){H(this,r.MEDIA_DURATION,e)}}Ri=new WeakMap;fd.getSlotTemplateHTML=th;d.customElements.get("media-duration-display")||d.customElements.define("media-duration-display",fd);const ih={2:v("Network Error"),3:v("Decode Error"),4:v("Source Not Supported"),5:v("Encryption Error")},ah={2:v("A network error caused the media download to fail."),3:v("A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format."),4:v("An unsupported error occurred. The server or network failed, or your browser does not support this format."),5:v("The media is encrypted and there are no keys to decrypt it.")},gd=t=>{var e,i;return t.code===1?null:{title:(e=ih[t.code])!=null?e:`Error ${t.code}`,message:(i=ah[t.code])!=null?i:t.message}};var bd=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},nh=(t,e,i)=>(bd(t,e,"read from private field"),i?i.call(t):e.get(t)),sh=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},rh=(t,e,i,a)=>(bd(t,e,"write to private field"),e.set(t,i),i),an;function oh(t){return`
    <style>
      :host {
        background: rgb(20 20 30 / .8);
      }

      #content {
        display: block;
        padding: 1.2em 1.5em;
      }

      h3,
      p {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${t.mediaerrorcode}" id="content">
      ${_d({code:+t.mediaerrorcode,message:t.mediaerrormessage})}
    </slot>
  `}function lh(t){return t.code&&gd(t)!==null}function _d(t){var e;const{title:i,message:a}=(e=gd(t))!=null?e:{};let n="";return i&&(n+=`<slot name="error-${t.code}-title"><h3>${i}</h3></slot>`),a&&(n+=`<slot name="error-${t.code}-message"><p>${a}</p></slot>`),n}const el=[r.MEDIA_ERROR_CODE,r.MEDIA_ERROR_MESSAGE];class Nr extends ua{constructor(){super(...arguments),sh(this,an,null)}static get observedAttributes(){return[...super.observedAttributes,...el]}formatErrorMessage(e){return this.constructor.formatErrorMessage(e)}attributeChangedCallback(e,i,a){var n;if(super.attributeChangedCallback(e,i,a),!el.includes(e))return;const s=(n=this.mediaError)!=null?n:{code:this.mediaErrorCode,message:this.mediaErrorMessage};this.open=lh(s),this.open&&(this.shadowRoot.querySelector("slot").name=`error-${this.mediaErrorCode}`,this.shadowRoot.querySelector("#content").innerHTML=this.formatErrorMessage(s))}get mediaError(){return nh(this,an)}set mediaError(e){rh(this,an,e)}get mediaErrorCode(){return O(this,"mediaerrorcode")}set mediaErrorCode(e){H(this,"mediaerrorcode",e)}get mediaErrorMessage(){return P(this,"mediaerrormessage")}set mediaErrorMessage(e){U(this,"mediaerrormessage",e)}}an=new WeakMap;Nr.getSlotTemplateHTML=oh;Nr.formatErrorMessage=_d;d.customElements.get("media-error-dialog")||d.customElements.define("media-error-dialog",Nr);const dh=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,uh=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`;function ch(t){return`
    <style>
      :host([${r.MEDIA_IS_FULLSCREEN}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${r.MEDIA_IS_FULLSCREEN}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${r.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
      :host(:not([${r.MEDIA_IS_FULLSCREEN}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${dh}</slot>
      <slot name="exit">${uh}</slot>
    </slot>
  `}function hh(){return`
    <slot name="tooltip-enter">${v("Enter fullscreen mode")}</slot>
    <slot name="tooltip-exit">${v("Exit fullscreen mode")}</slot>
  `}const tl=t=>{const e=t.mediaIsFullscreen?v("exit fullscreen mode"):v("enter fullscreen mode");t.setAttribute("aria-label",e)};class Hr extends Z{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_IS_FULLSCREEN,r.MEDIA_FULLSCREEN_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),tl(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_IS_FULLSCREEN&&tl(this)}get mediaFullscreenUnavailable(){return P(this,r.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){U(this,r.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return k(this,r.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){S(this,r.MEDIA_IS_FULLSCREEN,e)}handleClick(){const e=this.mediaIsFullscreen?E.MEDIA_EXIT_FULLSCREEN_REQUEST:E.MEDIA_ENTER_FULLSCREEN_REQUEST;this.dispatchEvent(new d.CustomEvent(e,{composed:!0,bubbles:!0}))}}Hr.getSlotTemplateHTML=ch;Hr.getTooltipContentHTML=hh;d.customElements.get("media-fullscreen-button")||d.customElements.define("media-fullscreen-button",Hr);const{MEDIA_TIME_IS_LIVE:nn,MEDIA_PAUSED:Vi}=r,{MEDIA_SEEK_TO_LIVE_REQUEST:mh,MEDIA_PLAY_REQUEST:ph}=E,vh='<svg viewBox="0 0 6 12"><circle cx="3" cy="6" r="2"></circle></svg>';function Eh(t){return`
    <style>
      :host { --media-tooltip-display: none; }
      
      slot[name=indicator] > *,
      :host ::slotted([slot=indicator]) {
        
        min-width: auto;
        fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
        color: var(--media-live-button-icon-color, rgb(140, 140, 140));
      }

      :host([${nn}]:not([${Vi}])) slot[name=indicator] > *,
      :host([${nn}]:not([${Vi}])) ::slotted([slot=indicator]) {
        fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
        color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
      }

      :host([${nn}]:not([${Vi}])) {
        cursor: var(--media-cursor, not-allowed);
      }

      slot[name=text]{
        text-transform: uppercase;
      }

    </style>

    <slot name="indicator">${vh}</slot>
    
    <slot name="spacer">&nbsp;</slot><slot name="text">${v("live")}</slot>
  `}const il=t=>{const e=t.mediaPaused||!t.mediaTimeIsLive,i=v(e?"seek to live":"playing live");t.setAttribute("aria-label",i),e?t.removeAttribute("aria-disabled"):t.setAttribute("aria-disabled","true")};class Ad extends Z{static get observedAttributes(){return[...super.observedAttributes,nn,Vi]}connectedCallback(){super.connectedCallback(),il(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),il(this)}get mediaPaused(){return k(this,r.MEDIA_PAUSED)}set mediaPaused(e){S(this,r.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return k(this,r.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){S(this,r.MEDIA_TIME_IS_LIVE,e)}handleClick(){!this.mediaPaused&&this.mediaTimeIsLive||(this.dispatchEvent(new d.CustomEvent(mh,{composed:!0,bubbles:!0})),this.hasAttribute(Vi)&&this.dispatchEvent(new d.CustomEvent(ph,{composed:!0,bubbles:!0})))}}Ad.getSlotTemplateHTML=Eh;d.customElements.get("media-live-button")||d.customElements.define("media-live-button",Ad);var Td=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},bi=(t,e,i)=>(Td(t,e,"read from private field"),i?i.call(t):e.get(t)),al=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},_i=(t,e,i,a)=>(Td(t,e,"write to private field"),e.set(t,i),i),Se,sn;const Oa={LOADING_DELAY:"loadingdelay",NO_AUTOHIDE:"noautohide"},yd=500,fh=`
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;function gh(t){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
        vertical-align: middle;
        box-sizing: border-box;
        --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, ${yd}ms);
      }

      #status {
        color: rgba(0,0,0,0);
        width: 0px;
        height: 0px;
      }

      :host slot[name=icon] > *,
      :host ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 0);
        transition: opacity 0.15s;
      }

      :host([${r.MEDIA_LOADING}]:not([${r.MEDIA_PAUSED}])) slot[name=icon] > *,
      :host([${r.MEDIA_LOADING}]:not([${r.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 1);
        transition: opacity 0.15s var(--_loading-indicator-delay);
      }

      :host #status {
        visibility: var(--media-loading-indicator-opacity, hidden);
        transition: visibility 0.15s;
      }

      :host([${r.MEDIA_LOADING}]:not([${r.MEDIA_PAUSED}])) #status {
        visibility: var(--media-loading-indicator-opacity, visible);
        transition: visibility 0.15s var(--_loading-indicator-delay);
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-loading-indicator-icon-width);
        height: var(--media-loading-indicator-icon-height, 100px);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
      }
    </style>

    <slot name="icon">${fh}</slot>
    <div id="status" role="status" aria-live="polite">${v("media loading")}</div>
  `}class Br extends d.HTMLElement{constructor(){if(super(),al(this,Se,void 0),al(this,sn,yd),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=se(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[w.MEDIA_CONTROLLER,r.MEDIA_PAUSED,r.MEDIA_LOADING,Oa.LOADING_DELAY]}attributeChangedCallback(e,i,a){var n,s,o,l,u;e===Oa.LOADING_DELAY&&i!==a?this.loadingDelay=Number(a):e===w.MEDIA_CONTROLLER&&(i&&((s=(n=bi(this,Se))==null?void 0:n.unassociateElement)==null||s.call(n,this),_i(this,Se,null)),a&&this.isConnected&&(_i(this,Se,(o=this.getRootNode())==null?void 0:o.getElementById(a)),(u=(l=bi(this,Se))==null?void 0:l.associateElement)==null||u.call(l,this)))}connectedCallback(){var e,i,a;const n=this.getAttribute(w.MEDIA_CONTROLLER);n&&(_i(this,Se,(e=this.getRootNode())==null?void 0:e.getElementById(n)),(a=(i=bi(this,Se))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=bi(this,Se))==null?void 0:e.unassociateElement)==null||i.call(e,this),_i(this,Se,null)}get loadingDelay(){return bi(this,sn)}set loadingDelay(e){_i(this,sn,e);const{style:i}=F(this.shadowRoot,":host");i.setProperty("--_loading-indicator-delay",`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return k(this,r.MEDIA_PAUSED)}set mediaPaused(e){S(this,r.MEDIA_PAUSED,e)}get mediaLoading(){return k(this,r.MEDIA_LOADING)}set mediaLoading(e){S(this,r.MEDIA_LOADING,e)}get mediaController(){return P(this,w.MEDIA_CONTROLLER)}set mediaController(e){U(this,w.MEDIA_CONTROLLER,e)}get noAutohide(){return k(this,Oa.NO_AUTOHIDE)}set noAutohide(e){S(this,Oa.NO_AUTOHIDE,e)}}Se=new WeakMap;sn=new WeakMap;Br.shadowRootOptions={mode:"open"};Br.getTemplateHTML=gh;d.customElements.get("media-loading-indicator")||d.customElements.define("media-loading-indicator",Br);const bh=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,nl=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,_h=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`;function Ah(t){return`
    <style>
      :host(:not([${r.MEDIA_VOLUME_LEVEL}])) slot[name=icon] slot:not([name=high]),
      :host([${r.MEDIA_VOLUME_LEVEL}=high]) slot[name=icon] slot:not([name=high]) {
        display: none !important;
      }

      :host([${r.MEDIA_VOLUME_LEVEL}=off]) slot[name=icon] slot:not([name=off]) {
        display: none !important;
      }

      :host([${r.MEDIA_VOLUME_LEVEL}=low]) slot[name=icon] slot:not([name=low]) {
        display: none !important;
      }

      :host([${r.MEDIA_VOLUME_LEVEL}=medium]) slot[name=icon] slot:not([name=medium]) {
        display: none !important;
      }

      :host(:not([${r.MEDIA_VOLUME_LEVEL}=off])) slot[name=tooltip-unmute],
      :host([${r.MEDIA_VOLUME_LEVEL}=off]) slot[name=tooltip-mute] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="off">${bh}</slot>
      <slot name="low">${nl}</slot>
      <slot name="medium">${nl}</slot>
      <slot name="high">${_h}</slot>
    </slot>
  `}function Th(){return`
    <slot name="tooltip-mute">${v("Mute")}</slot>
    <slot name="tooltip-unmute">${v("Unmute")}</slot>
  `}const sl=t=>{const e=t.mediaVolumeLevel==="off",i=v(e?"unmute":"mute");t.setAttribute("aria-label",i)};class Wr extends Z{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_VOLUME_LEVEL]}connectedCallback(){super.connectedCallback(),sl(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_VOLUME_LEVEL&&sl(this)}get mediaVolumeLevel(){return P(this,r.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){U(this,r.MEDIA_VOLUME_LEVEL,e)}handleClick(){const e=this.mediaVolumeLevel==="off"?E.MEDIA_UNMUTE_REQUEST:E.MEDIA_MUTE_REQUEST;this.dispatchEvent(new d.CustomEvent(e,{composed:!0,bubbles:!0}))}}Wr.getSlotTemplateHTML=Ah;Wr.getTooltipContentHTML=Th;d.customElements.get("media-mute-button")||d.customElements.define("media-mute-button",Wr);const rl=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`;function yh(t){return`
    <style>
      :host([${r.MEDIA_IS_PIP}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      :host(:not([${r.MEDIA_IS_PIP}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${r.MEDIA_IS_PIP}]) slot[name=tooltip-enter],
      :host(:not([${r.MEDIA_IS_PIP}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${rl}</slot>
      <slot name="exit">${rl}</slot>
    </slot>
  `}function kh(){return`
    <slot name="tooltip-enter">${v("Enter picture in picture mode")}</slot>
    <slot name="tooltip-exit">${v("Exit picture in picture mode")}</slot>
  `}const ol=t=>{const e=t.mediaIsPip?v("exit picture in picture mode"):v("enter picture in picture mode");t.setAttribute("aria-label",e)};class Fr extends Z{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_IS_PIP,r.MEDIA_PIP_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),ol(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_IS_PIP&&ol(this)}get mediaPipUnavailable(){return P(this,r.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){U(this,r.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return k(this,r.MEDIA_IS_PIP)}set mediaIsPip(e){S(this,r.MEDIA_IS_PIP,e)}handleClick(){const e=this.mediaIsPip?E.MEDIA_EXIT_PIP_REQUEST:E.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new d.CustomEvent(e,{composed:!0,bubbles:!0}))}}Fr.getSlotTemplateHTML=yh;Fr.getTooltipContentHTML=kh;d.customElements.get("media-pip-button")||d.customElements.define("media-pip-button",Fr);var Sh=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Rt=(t,e,i)=>(Sh(t,e,"read from private field"),i?i.call(t):e.get(t)),Ih=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ze;const ds={RATES:"rates"},kd=[1,1.2,1.5,1.7,2],Jt=1;function wh(t){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${t.mediaplaybackrate||Jt}x</slot>
  `}function Mh(){return v("Playback rate")}class Vr extends Z{constructor(){var e;super(),Ih(this,Ze,new kr(this,ds.RATES,{defaultValue:kd})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${(e=this.mediaPlaybackRate)!=null?e:Jt}x`}static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_PLAYBACK_RATE,ds.RATES]}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),e===ds.RATES&&(Rt(this,Ze).value=a),e===r.MEDIA_PLAYBACK_RATE){const n=a?+a:Number.NaN,s=Number.isNaN(n)?Jt:n;this.container.innerHTML=`${s}x`,this.setAttribute("aria-label",v("Playback rate {playbackRate}",{playbackRate:s}))}}get rates(){return Rt(this,Ze)}set rates(e){e?Array.isArray(e)?Rt(this,Ze).value=e.join(" "):typeof e=="string"&&(Rt(this,Ze).value=e):Rt(this,Ze).value=""}get mediaPlaybackRate(){return O(this,r.MEDIA_PLAYBACK_RATE,Jt)}set mediaPlaybackRate(e){H(this,r.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,i;const a=Array.from(Rt(this,Ze).values(),o=>+o).sort((o,l)=>o-l),n=(i=(e=a.find(o=>o>this.mediaPlaybackRate))!=null?e:a[0])!=null?i:Jt,s=new d.CustomEvent(E.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:n});this.dispatchEvent(s)}}Ze=new WeakMap;Vr.getSlotTemplateHTML=wh;Vr.getTooltipContentHTML=Mh;d.customElements.get("media-playback-rate-button")||d.customElements.define("media-playback-rate-button",Vr);const Lh=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,Ch=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`;function Rh(t){return`
    <style>
      :host([${r.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${r.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${r.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${r.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${Lh}</slot>
      <slot name="pause">${Ch}</slot>
    </slot>
  `}function Dh(){return`
    <slot name="tooltip-play">${v("Play")}</slot>
    <slot name="tooltip-pause">${v("Pause")}</slot>
  `}const ll=t=>{const e=t.mediaPaused?v("play"):v("pause");t.setAttribute("aria-label",e)};class Gr extends Z{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_PAUSED,r.MEDIA_ENDED]}connectedCallback(){super.connectedCallback(),ll(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_PAUSED&&ll(this)}get mediaPaused(){return k(this,r.MEDIA_PAUSED)}set mediaPaused(e){S(this,r.MEDIA_PAUSED,e)}handleClick(){const e=this.mediaPaused?E.MEDIA_PLAY_REQUEST:E.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new d.CustomEvent(e,{composed:!0,bubbles:!0}))}}Gr.getSlotTemplateHTML=Rh;Gr.getTooltipContentHTML=Dh;d.customElements.get("media-play-button")||d.customElements.define("media-play-button",Gr);const fe={PLACEHOLDER_SRC:"placeholdersrc",SRC:"src"};function xh(t){return`
    <style>
      :host {
        pointer-events: none;
        display: var(--media-poster-image-display, inline-block);
        box-sizing: border-box;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        background-repeat: no-repeat;
        background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
        background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, center);
      }
    </style>

    <img part="poster img" aria-hidden="true" id="image"/>
  `}const Oh=t=>{t.style.removeProperty("background-image")},Ph=(t,e)=>{t.style["background-image"]=`url('${e}')`};class Kr extends d.HTMLElement{static get observedAttributes(){return[fe.PLACEHOLDER_SRC,fe.SRC]}constructor(){if(super(),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=se(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.image=this.shadowRoot.querySelector("#image")}attributeChangedCallback(e,i,a){e===fe.SRC&&(a==null?this.image.removeAttribute(fe.SRC):this.image.setAttribute(fe.SRC,a)),e===fe.PLACEHOLDER_SRC&&(a==null?Oh(this.image):Ph(this.image,a))}get placeholderSrc(){return P(this,fe.PLACEHOLDER_SRC)}set placeholderSrc(e){U(this,fe.SRC,e)}get src(){return P(this,fe.SRC)}set src(e){U(this,fe.SRC,e)}}Kr.shadowRootOptions={mode:"open"};Kr.getTemplateHTML=xh;d.customElements.get("media-poster-image")||d.customElements.define("media-poster-image",Kr);var Sd=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Uh=(t,e,i)=>(Sd(t,e,"read from private field"),i?i.call(t):e.get(t)),$h=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Nh=(t,e,i,a)=>(Sd(t,e,"write to private field"),e.set(t,i),i),rn;class Hh extends st{constructor(){super(),$h(this,rn,void 0),Nh(this,rn,this.shadowRoot.querySelector("slot"))}static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_PREVIEW_CHAPTER]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_PREVIEW_CHAPTER&&a!==i&&a!=null&&(Uh(this,rn).textContent=a,a!==""?this.setAttribute("aria-valuetext",`chapter: ${a}`):this.removeAttribute("aria-valuetext"))}get mediaPreviewChapter(){return P(this,r.MEDIA_PREVIEW_CHAPTER)}set mediaPreviewChapter(e){U(this,r.MEDIA_PREVIEW_CHAPTER,e)}}rn=new WeakMap;d.customElements.get("media-preview-chapter-display")||d.customElements.define("media-preview-chapter-display",Hh);var Id=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Pa=(t,e,i)=>(Id(t,e,"read from private field"),i?i.call(t):e.get(t)),Bh=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ua=(t,e,i,a)=>(Id(t,e,"write to private field"),e.set(t,i),i),Ie;function Wh(t){return`
    <style>
      :host {
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
        overflow: hidden;
      }

      img {
        display: none;
        position: relative;
      }
    </style>
    <img crossorigin loading="eager" decoding="async">
  `}class ns extends d.HTMLElement{constructor(){if(super(),Bh(this,Ie,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=se(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[w.MEDIA_CONTROLLER,r.MEDIA_PREVIEW_IMAGE,r.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,i,a;const n=this.getAttribute(w.MEDIA_CONTROLLER);n&&(Ua(this,Ie,(e=this.getRootNode())==null?void 0:e.getElementById(n)),(a=(i=Pa(this,Ie))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Pa(this,Ie))==null?void 0:e.unassociateElement)==null||i.call(e,this),Ua(this,Ie,null)}attributeChangedCallback(e,i,a){var n,s,o,l,u;[r.MEDIA_PREVIEW_IMAGE,r.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===w.MEDIA_CONTROLLER&&(i&&((s=(n=Pa(this,Ie))==null?void 0:n.unassociateElement)==null||s.call(n,this),Ua(this,Ie,null)),a&&this.isConnected&&(Ua(this,Ie,(o=this.getRootNode())==null?void 0:o.getElementById(a)),(u=(l=Pa(this,Ie))==null?void 0:l.associateElement)==null||u.call(l,this)))}get mediaPreviewImage(){return P(this,r.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){U(this,r.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){const e=this.getAttribute(r.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(i=>+i)}set mediaPreviewCoords(e){if(!e){this.removeAttribute(r.MEDIA_PREVIEW_COORDS);return}this.setAttribute(r.MEDIA_PREVIEW_COORDS,e.join(" "))}update(){const e=this.mediaPreviewCoords,i=this.mediaPreviewImage;if(!(e&&i))return;const[a,n,s,o]=e,l=i.split("#")[0],u=getComputedStyle(this),{maxWidth:c,maxHeight:f,minWidth:g,minHeight:h}=u,p=Math.min(parseInt(c)/s,parseInt(f)/o),M=Math.max(parseInt(g)/s,parseInt(h)/o),A=p<1,_=A?p:M>1?M:1,{style:L}=F(this.shadowRoot,":host"),J=F(this.shadowRoot,"img").style,re=this.shadowRoot.querySelector("img"),rt=A?"min":"max";L.setProperty(`${rt}-width`,"initial","important"),L.setProperty(`${rt}-height`,"initial","important"),L.width=`${s*_}px`,L.height=`${o*_}px`;const Ve=()=>{J.width=`${this.imgWidth*_}px`,J.height=`${this.imgHeight*_}px`,J.display="block"};re.src!==l&&(re.onload=()=>{this.imgWidth=re.naturalWidth,this.imgHeight=re.naturalHeight,Ve()},re.src=l,Ve()),Ve(),J.transform=`translate(-${a*_}px, -${n*_}px)`}}Ie=new WeakMap;ns.shadowRootOptions={mode:"open"};ns.getTemplateHTML=Wh;d.customElements.get("media-preview-thumbnail")||d.customElements.define("media-preview-thumbnail",ns);var dl=ns,wd=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ul=(t,e,i)=>(wd(t,e,"read from private field"),i?i.call(t):e.get(t)),Fh=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Vh=(t,e,i,a)=>(wd(t,e,"write to private field"),e.set(t,i),i),Di;class Gh extends st{constructor(){super(),Fh(this,Di,void 0),Vh(this,Di,this.shadowRoot.querySelector("slot")),ul(this,Di).textContent=at(0)}static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_PREVIEW_TIME&&a!=null&&(ul(this,Di).textContent=at(parseFloat(a)))}get mediaPreviewTime(){return O(this,r.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){H(this,r.MEDIA_PREVIEW_TIME,e)}}Di=new WeakMap;d.customElements.get("media-preview-time-display")||d.customElements.define("media-preview-time-display",Gh);const Dt={SEEK_OFFSET:"seekoffset"},us=30,Kh=t=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(2.18 19.87)">${t}</text>
    <path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/>
  </svg>`;function qh(t,e){return`
    <slot name="icon">${Kh(e.seekOffset)}</slot>
  `}function Yh(){return v("Seek backward")}const zh=0;class qr extends Z{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_CURRENT_TIME,Dt.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=O(this,Dt.SEEK_OFFSET,us)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===Dt.SEEK_OFFSET&&(this.seekOffset=O(this,Dt.SEEK_OFFSET,us))}get seekOffset(){return O(this,Dt.SEEK_OFFSET,us)}set seekOffset(e){H(this,Dt.SEEK_OFFSET,e),this.setAttribute("aria-label",v("seek back {seekOffset} seconds",{seekOffset:this.seekOffset})),$l(Nl(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return O(this,r.MEDIA_CURRENT_TIME,zh)}set mediaCurrentTime(e){H(this,r.MEDIA_CURRENT_TIME,e)}handleClick(){const e=Math.max(this.mediaCurrentTime-this.seekOffset,0),i=new d.CustomEvent(E.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}}qr.getSlotTemplateHTML=qh;qr.getTooltipContentHTML=Yh;d.customElements.get("media-seek-backward-button")||d.customElements.define("media-seek-backward-button",qr);const xt={SEEK_OFFSET:"seekoffset"},cs=30,Qh=t=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(8.9 19.87)">${t}</text>
    <path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/>
  </svg>`;function Zh(t,e){return`
    <slot name="icon">${Qh(e.seekOffset)}</slot>
  `}function Xh(){return v("Seek forward")}const Jh=0;class Yr extends Z{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_CURRENT_TIME,xt.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=O(this,xt.SEEK_OFFSET,cs)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===xt.SEEK_OFFSET&&(this.seekOffset=O(this,xt.SEEK_OFFSET,cs))}get seekOffset(){return O(this,xt.SEEK_OFFSET,cs)}set seekOffset(e){H(this,xt.SEEK_OFFSET,e),this.setAttribute("aria-label",v("seek forward {seekOffset} seconds",{seekOffset:this.seekOffset})),$l(Nl(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return O(this,r.MEDIA_CURRENT_TIME,Jh)}set mediaCurrentTime(e){H(this,r.MEDIA_CURRENT_TIME,e)}handleClick(){const e=this.mediaCurrentTime+this.seekOffset,i=new d.CustomEvent(E.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}}Yr.getSlotTemplateHTML=Zh;Yr.getTooltipContentHTML=Xh;d.customElements.get("media-seek-forward-button")||d.customElements.define("media-seek-forward-button",Yr);var Md=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},hs=(t,e,i)=>(Md(t,e,"read from private field"),i?i.call(t):e.get(t)),jh=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},em=(t,e,i,a)=>(Md(t,e,"write to private field"),e.set(t,i),i),Ht;const ct={REMAINING:"remaining",SHOW_DURATION:"showduration",NO_TOGGLE:"notoggle"},cl=[...Object.values(ct),r.MEDIA_CURRENT_TIME,r.MEDIA_DURATION,r.MEDIA_SEEKABLE],hl=["Enter"," "],tm="&nbsp;/&nbsp;",Fs=(t,{timesSep:e=tm}={})=>{var i,a;const n=(i=t.mediaCurrentTime)!=null?i:0,[,s]=(a=t.mediaSeekable)!=null?a:[];let o=0;Number.isFinite(t.mediaDuration)?o=t.mediaDuration:Number.isFinite(s)&&(o=s);const l=t.remaining?at(0-(o-n)):at(n);return t.showDuration?`${l}${e}${at(o)}`:l},im="video not loaded, unknown time.",am=t=>{var e;const i=t.mediaCurrentTime,[,a]=(e=t.mediaSeekable)!=null?e:[];let n=null;if(Number.isFinite(t.mediaDuration)?n=t.mediaDuration:Number.isFinite(a)&&(n=a),i==null||n===null){t.setAttribute("aria-valuetext",im);return}const s=t.remaining?Wi(0-(n-i)):Wi(i);if(!t.showDuration){t.setAttribute("aria-valuetext",s);return}const o=Wi(n),l=`${s} of ${o}`;t.setAttribute("aria-valuetext",l)};function nm(t,e){return`
    <slot>${Fs(e)}</slot>
  `}class Ld extends st{constructor(){super(),jh(this,Ht,void 0),em(this,Ht,this.shadowRoot.querySelector("slot")),hs(this,Ht).innerHTML=`${Fs(this)}`}static get observedAttributes(){return[...super.observedAttributes,...cl,"disabled"]}connectedCallback(){const{style:e}=F(this.shadowRoot,":host(:hover:not([notoggle]))");e.setProperty("cursor","var(--media-cursor, pointer)"),e.setProperty("background","var(--media-control-hover-background, rgba(50 50 70 / .7))"),this.hasAttribute("disabled")||this.enable(),this.setAttribute("role","progressbar"),this.setAttribute("aria-label",v("playback time"));const i=a=>{const{key:n}=a;if(!hl.includes(n)){this.removeEventListener("keyup",i);return}this.toggleTimeDisplay()};this.addEventListener("keydown",a=>{const{metaKey:n,altKey:s,key:o}=a;if(n||s||!hl.includes(o)){this.removeEventListener("keyup",i);return}this.addEventListener("keyup",i)}),this.addEventListener("click",this.toggleTimeDisplay),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute("remaining")?this.removeAttribute("remaining"):this.setAttribute("remaining",""))}disconnectedCallback(){this.disable(),super.disconnectedCallback()}attributeChangedCallback(e,i,a){cl.includes(e)?this.update():e==="disabled"&&a!==i&&(a==null?this.enable():this.disable()),super.attributeChangedCallback(e,i,a)}enable(){this.tabIndex=0}disable(){this.tabIndex=-1}get remaining(){return k(this,ct.REMAINING)}set remaining(e){S(this,ct.REMAINING,e)}get showDuration(){return k(this,ct.SHOW_DURATION)}set showDuration(e){S(this,ct.SHOW_DURATION,e)}get noToggle(){return k(this,ct.NO_TOGGLE)}set noToggle(e){S(this,ct.NO_TOGGLE,e)}get mediaDuration(){return O(this,r.MEDIA_DURATION)}set mediaDuration(e){H(this,r.MEDIA_DURATION,e)}get mediaCurrentTime(){return O(this,r.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){H(this,r.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){const e=this.getAttribute(r.MEDIA_SEEKABLE);if(e)return e.split(":").map(i=>+i)}set mediaSeekable(e){if(e==null){this.removeAttribute(r.MEDIA_SEEKABLE);return}this.setAttribute(r.MEDIA_SEEKABLE,e.join(":"))}update(){const e=Fs(this);am(this),e!==hs(this,Ht).innerHTML&&(hs(this,Ht).innerHTML=e)}}Ht=new WeakMap;Ld.getSlotTemplateHTML=nm;d.customElements.get("media-time-display")||d.customElements.define("media-time-display",Ld);var Cd=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Y=(t,e,i)=>(Cd(t,e,"read from private field"),e.get(t)),ge=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ae=(t,e,i,a)=>(Cd(t,e,"write to private field"),e.set(t,i),i),sm=(t,e,i,a)=>({set _(n){ae(t,e,n)},get _(){return Y(t,e)}}),Bt,on,Wt,xi,ln,dn,un,Ft,ht,cn;class rm{constructor(e,i,a){ge(this,Bt,void 0),ge(this,on,void 0),ge(this,Wt,void 0),ge(this,xi,void 0),ge(this,ln,void 0),ge(this,dn,void 0),ge(this,un,void 0),ge(this,Ft,void 0),ge(this,ht,0),ge(this,cn,(n=performance.now())=>{ae(this,ht,requestAnimationFrame(Y(this,cn))),ae(this,xi,performance.now()-Y(this,Wt));const s=1e3/this.fps;if(Y(this,xi)>s){ae(this,Wt,n-Y(this,xi)%s);const o=1e3/((n-Y(this,on))/++sm(this,ln)._),l=(n-Y(this,dn))/1e3/this.duration;let u=Y(this,un)+l*this.playbackRate;u-Y(this,Bt).valueAsNumber>0?ae(this,Ft,this.playbackRate/this.duration/o):(ae(this,Ft,.995*Y(this,Ft)),u=Y(this,Bt).valueAsNumber+Y(this,Ft)),this.callback(u)}}),ae(this,Bt,e),this.callback=i,this.fps=a}start(){Y(this,ht)===0&&(ae(this,Wt,performance.now()),ae(this,on,Y(this,Wt)),ae(this,ln,0),Y(this,cn).call(this))}stop(){Y(this,ht)!==0&&(cancelAnimationFrame(Y(this,ht)),ae(this,ht,0))}update({start:e,duration:i,playbackRate:a}){const n=e-Y(this,Bt).valueAsNumber,s=Math.abs(i-this.duration);(n>0||n<-.03||s>=.5)&&this.callback(e),ae(this,un,e),ae(this,dn,performance.now()),this.duration=i,this.playbackRate=a}}Bt=new WeakMap;on=new WeakMap;Wt=new WeakMap;xi=new WeakMap;ln=new WeakMap;dn=new WeakMap;un=new WeakMap;Ft=new WeakMap;ht=new WeakMap;cn=new WeakMap;var zr=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},V=(t,e,i)=>(zr(t,e,"read from private field"),i?i.call(t):e.get(t)),q=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},we=(t,e,i,a)=>(zr(t,e,"write to private field"),e.set(t,i),i),X=(t,e,i)=>(zr(t,e,"access private method"),i),Vt,At,$n,Gi,Nn,hn,aa,na,Gt,Kt,Oi,Qr,Rd,Vs,Hn,Zr,Bn,Xr,Wn,Jr,Gs,Dd,sa,Fn,Ks,xd;const om="video not loaded, unknown time.",lm=t=>{const e=t.range,i=Wi(+Od(t)),a=Wi(+t.mediaSeekableEnd),n=i&&a?`${i} of ${a}`:om;e.setAttribute("aria-valuetext",n)};function dm(t){return`
    ${mi.getTemplateHTML(t)}
    <style>
      :host {
        --media-box-border-radius: 4px;
        --media-box-padding-left: 10px;
        --media-box-padding-right: 10px;
        --media-preview-border-radius: var(--media-box-border-radius);
        --media-box-arrow-offset: var(--media-box-border-radius);
        --_control-background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        --_preview-background: var(--media-preview-background, var(--_control-background));

        
        contain: layout;
      }

      #buffered {
        background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #preview-rail,
      #current-rail {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 100%;
        pointer-events: none;
        will-change: transform;
      }

      [part~="box"] {
        width: min-content;
        
        position: absolute;
        bottom: 100%;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
      }

      [part~="current-box"] {
        display: var(--media-current-box-display, var(--media-box-display, flex));
        margin: var(--media-current-box-margin, var(--media-box-margin, 0 0 5px));
        visibility: hidden;
      }

      [part~="preview-box"] {
        display: var(--media-preview-box-display, var(--media-box-display, flex));
        margin: var(--media-preview-box-margin, var(--media-box-margin, 0 0 5px));
        transition-property: var(--media-preview-transition-property, visibility, opacity);
        transition-duration: var(--media-preview-transition-duration-out, .25s);
        transition-delay: var(--media-preview-transition-delay-out, 0s);
        visibility: hidden;
        opacity: 0;
      }

      :host(:is([${r.MEDIA_PREVIEW_IMAGE}], [${r.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${r.MEDIA_PREVIEW_IMAGE}], [${r.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
          transition-duration: var(--media-preview-transition-duration-in, .5s);
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
          opacity: 1;
        }
      }

      media-preview-thumbnail,
      ::slotted(media-preview-thumbnail) {
        visibility: hidden;
        
        transition: visibility 0s .25s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-thumbnail-background, var(--_preview-background));
        box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
        max-width: var(--media-preview-thumbnail-max-width, 180px);
        max-height: var(--media-preview-thumbnail-max-height, 160px);
        min-width: var(--media-preview-thumbnail-min-width, 120px);
        min-height: var(--media-preview-thumbnail-min-height, 80px);
        border: var(--media-preview-thumbnail-border);
        border-radius: var(--media-preview-thumbnail-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
      }

      :host([${r.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
      :host([${r.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${r.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
        :host([${r.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${r.MEDIA_PREVIEW_TIME}]:hover) {
          --media-time-range-hover-display: block;
        }
      }

      media-preview-chapter-display,
      ::slotted(media-preview-chapter-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        visibility: hidden;
        
        transition: min-width 0s, border-radius 0s, margin 0s, padding 0s, visibility 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-chapter-background, var(--_preview-background));
        border-radius: var(--media-preview-chapter-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-chapter-padding, 3.5px 9px);
        margin: var(--media-preview-chapter-margin, 0 0 5px);
        text-shadow: var(--media-preview-chapter-text-shadow, 0 0 4px rgb(0 0 0 / .75));
      }

      :host([${r.MEDIA_PREVIEW_IMAGE}]) media-preview-chapter-display,
      :host([${r.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${r.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${r.MEDIA_PREVIEW_CHAPTER}]) {
        visibility: visible;
      }

      media-preview-chapter-display:not([aria-valuetext]),
      ::slotted(media-preview-chapter-display:not([aria-valuetext])) {
        display: none;
      }

      media-preview-time-display,
      ::slotted(media-preview-time-display),
      media-time-display,
      ::slotted(media-time-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        
        transition: min-width 0s, border-radius 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-time-background, var(--_preview-background));
        border-radius: var(--media-preview-time-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-time-padding, 3.5px 9px);
        margin: var(--media-preview-time-margin, 0);
        text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50%)
        ));
      }

      :host([${r.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
      :host([${r.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${r.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }

      [part~="arrow"],
      ::slotted([part~="arrow"]) {
        display: var(--media-box-arrow-display, inline-block);
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2 + var(--media-box-arrow-offset)),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50% - var(--media-box-arrow-offset))
        ));
        
        border-color: transparent;
        border-top-color: var(--media-box-arrow-background, var(--_control-background));
        border-width: var(--media-box-arrow-border-width,
          var(--media-box-arrow-height, 5px) var(--media-box-arrow-width, 6px) 0);
        border-style: solid;
        justify-content: center;
        height: 0;
      }
    </style>
    <div id="preview-rail">
      <slot name="preview" part="box preview-box">
        <media-preview-thumbnail>
          <template shadowrootmode="${dl.shadowRootOptions.mode}">
            ${dl.getTemplateHTML({})}
          </template>
        </media-preview-thumbnail>
        <media-preview-chapter-display></media-preview-chapter-display>
        <media-preview-time-display></media-preview-time-display>
        <slot name="preview-arrow"><div part="arrow"></div></slot>
      </slot>
    </div>
    <div id="current-rail">
      <slot name="current" part="box current-box">
        
      </slot>
    </div>
  `}const $a=(t,e=t.mediaCurrentTime)=>{const i=Number.isFinite(t.mediaSeekableStart)?t.mediaSeekableStart:0,a=Number.isFinite(t.mediaDuration)?t.mediaDuration:t.mediaSeekableEnd;if(Number.isNaN(a))return 0;const n=(e-i)/(a-i);return Math.max(0,Math.min(n,1))},Od=(t,e=t.range.valueAsNumber)=>{const i=Number.isFinite(t.mediaSeekableStart)?t.mediaSeekableStart:0,a=Number.isFinite(t.mediaDuration)?t.mediaDuration:t.mediaSeekableEnd;return Number.isNaN(a)?0:e*(a-i)+i};class jr extends mi{constructor(){super(),q(this,Kt),q(this,Qr),q(this,Hn),q(this,Bn),q(this,Wn),q(this,Gs),q(this,sa),q(this,Ks),q(this,Vt,void 0),q(this,At,void 0),q(this,$n,void 0),q(this,Gi,void 0),q(this,Nn,void 0),q(this,hn,void 0),q(this,aa,void 0),q(this,na,void 0),q(this,Gt,void 0),q(this,Vs,a=>{this.dragging||(br(a)&&(this.range.valueAsNumber=a),this.updateBar())}),this.shadowRoot.querySelector("#track").insertAdjacentHTML("afterbegin",'<div id="buffered" part="buffered"></div>'),we(this,$n,this.shadowRoot.querySelectorAll('[part~="box"]')),we(this,Nn,this.shadowRoot.querySelector('[part~="preview-box"]')),we(this,hn,this.shadowRoot.querySelector('[part~="current-box"]'));const i=getComputedStyle(this);we(this,aa,parseInt(i.getPropertyValue("--media-box-padding-left"))),we(this,na,parseInt(i.getPropertyValue("--media-box-padding-right"))),we(this,At,new rm(this.range,V(this,Vs),60))}static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_PAUSED,r.MEDIA_DURATION,r.MEDIA_SEEKABLE,r.MEDIA_CURRENT_TIME,r.MEDIA_PREVIEW_IMAGE,r.MEDIA_PREVIEW_TIME,r.MEDIA_PREVIEW_CHAPTER,r.MEDIA_BUFFERED,r.MEDIA_PLAYBACK_RATE,r.MEDIA_LOADING,r.MEDIA_ENDED]}connectedCallback(){var e;super.connectedCallback(),this.range.setAttribute("aria-label",v("seek")),X(this,Kt,Oi).call(this),we(this,Vt,this.getRootNode()),(e=V(this,Vt))==null||e.addEventListener("transitionstart",this)}disconnectedCallback(){var e;super.disconnectedCallback(),X(this,Kt,Oi).call(this),(e=V(this,Vt))==null||e.removeEventListener("transitionstart",this),we(this,Vt,null)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),i!=a&&(e===r.MEDIA_CURRENT_TIME||e===r.MEDIA_PAUSED||e===r.MEDIA_ENDED||e===r.MEDIA_LOADING||e===r.MEDIA_DURATION||e===r.MEDIA_SEEKABLE?(V(this,At).update({start:$a(this),duration:this.mediaSeekableEnd-this.mediaSeekableStart,playbackRate:this.mediaPlaybackRate}),X(this,Kt,Oi).call(this),lm(this)):e===r.MEDIA_BUFFERED&&this.updateBufferedBar(),(e===r.MEDIA_DURATION||e===r.MEDIA_SEEKABLE)&&(this.mediaChaptersCues=V(this,Gt),this.updateBar()))}get mediaChaptersCues(){return V(this,Gt)}set mediaChaptersCues(e){var i;we(this,Gt,e),this.updateSegments((i=V(this,Gt))==null?void 0:i.map(a=>({start:$a(this,a.startTime),end:$a(this,a.endTime)})))}get mediaPaused(){return k(this,r.MEDIA_PAUSED)}set mediaPaused(e){S(this,r.MEDIA_PAUSED,e)}get mediaLoading(){return k(this,r.MEDIA_LOADING)}set mediaLoading(e){S(this,r.MEDIA_LOADING,e)}get mediaDuration(){return O(this,r.MEDIA_DURATION)}set mediaDuration(e){H(this,r.MEDIA_DURATION,e)}get mediaCurrentTime(){return O(this,r.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){H(this,r.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return O(this,r.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){H(this,r.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){const e=this.getAttribute(r.MEDIA_BUFFERED);return e?e.split(" ").map(i=>i.split(":").map(a=>+a)):[]}set mediaBuffered(e){if(!e){this.removeAttribute(r.MEDIA_BUFFERED);return}const i=e.map(a=>a.join(":")).join(" ");this.setAttribute(r.MEDIA_BUFFERED,i)}get mediaSeekable(){const e=this.getAttribute(r.MEDIA_SEEKABLE);if(e)return e.split(":").map(i=>+i)}set mediaSeekable(e){if(e==null){this.removeAttribute(r.MEDIA_SEEKABLE);return}this.setAttribute(r.MEDIA_SEEKABLE,e.join(":"))}get mediaSeekableEnd(){var e;const[,i=this.mediaDuration]=(e=this.mediaSeekable)!=null?e:[];return i}get mediaSeekableStart(){var e;const[i=0]=(e=this.mediaSeekable)!=null?e:[];return i}get mediaPreviewImage(){return P(this,r.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){U(this,r.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return O(this,r.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){H(this,r.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return k(this,r.MEDIA_ENDED)}set mediaEnded(e){S(this,r.MEDIA_ENDED,e)}updateBar(){super.updateBar(),this.updateBufferedBar(),this.updateCurrentBox()}updateBufferedBar(){var e;const i=this.mediaBuffered;if(!i.length)return;let a;if(this.mediaEnded)a=1;else{const s=this.mediaCurrentTime,[,o=this.mediaSeekableStart]=(e=i.find(([l,u])=>l<=s&&s<=u))!=null?e:[];a=$a(this,o)}const{style:n}=F(this.shadowRoot,"#buffered");n.setProperty("width",`${a*100}%`)}updateCurrentBox(){if(!this.shadowRoot.querySelector('slot[name="current"]').assignedElements().length)return;const i=F(this.shadowRoot,"#current-rail"),a=F(this.shadowRoot,'[part~="current-box"]'),n=X(this,Hn,Zr).call(this,V(this,hn)),s=X(this,Bn,Xr).call(this,n,this.range.valueAsNumber),o=X(this,Wn,Jr).call(this,n,this.range.valueAsNumber);i.style.transform=`translateX(${s})`,i.style.setProperty("--_range-width",`${n.range.width}`),a.style.setProperty("--_box-shift",`${o}`),a.style.setProperty("--_box-width",`${n.box.width}px`),a.style.setProperty("visibility","initial")}handleEvent(e){switch(super.handleEvent(e),e.type){case"input":X(this,Ks,xd).call(this);break;case"pointermove":X(this,Gs,Dd).call(this,e);break;case"pointerup":case"pointerleave":X(this,sa,Fn).call(this,null);break;case"transitionstart":Fe(e.target,this)&&setTimeout(()=>X(this,Kt,Oi).call(this),0);break}}}Vt=new WeakMap;At=new WeakMap;$n=new WeakMap;Gi=new WeakMap;Nn=new WeakMap;hn=new WeakMap;aa=new WeakMap;na=new WeakMap;Gt=new WeakMap;Kt=new WeakSet;Oi=function(){X(this,Qr,Rd).call(this)?V(this,At).start():V(this,At).stop()};Qr=new WeakSet;Rd=function(){return this.isConnected&&!this.mediaPaused&&!this.mediaLoading&&!this.mediaEnded&&this.mediaSeekableEnd>0&&Hl(this)};Vs=new WeakMap;Hn=new WeakSet;Zr=function(t){var e;const a=((e=this.getAttribute("bounds")?hi(this,`#${this.getAttribute("bounds")}`):this.parentElement)!=null?e:this).getBoundingClientRect(),n=this.range.getBoundingClientRect(),s=t.offsetWidth,o=-(n.left-a.left-s/2),l=a.right-n.left-s/2;return{box:{width:s,min:o,max:l},bounds:a,range:n}};Bn=new WeakSet;Xr=function(t,e){let i=`${e*100}%`;const{width:a,min:n,max:s}=t.box;if(!a)return i;if(Number.isNaN(n)||(i=`max(${`calc(1 / var(--_range-width) * 100 * ${n}% + var(--media-box-padding-left))`}, ${i})`),!Number.isNaN(s)){const l=`calc(1 / var(--_range-width) * 100 * ${s}% - var(--media-box-padding-right))`;i=`min(${i}, ${l})`}return i};Wn=new WeakSet;Jr=function(t,e){const{width:i,min:a,max:n}=t.box,s=e*t.range.width;if(s<a+V(this,aa)){const o=t.range.left-t.bounds.left-V(this,aa);return`${s-i/2+o}px`}if(s>n-V(this,na)){const o=t.bounds.right-t.range.right-V(this,na);return`${s+i/2-o-t.range.width}px`}return 0};Gs=new WeakSet;Dd=function(t){const e=[...V(this,$n)].some(f=>t.composedPath().includes(f));if(!this.dragging&&(e||!t.composedPath().includes(this))){X(this,sa,Fn).call(this,null);return}const i=this.mediaSeekableEnd;if(!i)return;const a=F(this.shadowRoot,"#preview-rail"),n=F(this.shadowRoot,'[part~="preview-box"]'),s=X(this,Hn,Zr).call(this,V(this,Nn));let o=(t.clientX-s.range.left)/s.range.width;o=Math.max(0,Math.min(1,o));const l=X(this,Bn,Xr).call(this,s,o),u=X(this,Wn,Jr).call(this,s,o);a.style.transform=`translateX(${l})`,a.style.setProperty("--_range-width",`${s.range.width}`),n.style.setProperty("--_box-shift",`${u}`),n.style.setProperty("--_box-width",`${s.box.width}px`);const c=Math.round(V(this,Gi))-Math.round(o*i);Math.abs(c)<1&&o>.01&&o<.99||(we(this,Gi,o*i),X(this,sa,Fn).call(this,V(this,Gi)))};sa=new WeakSet;Fn=function(t){this.dispatchEvent(new d.CustomEvent(E.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:t}))};Ks=new WeakSet;xd=function(){V(this,At).stop();const t=Od(this);this.dispatchEvent(new d.CustomEvent(E.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:t}))};jr.shadowRootOptions={mode:"open"};jr.getTemplateHTML=dm;d.customElements.get("media-time-range")||d.customElements.define("media-time-range",jr);const um=1,cm=t=>t.mediaMuted?0:t.mediaVolume,hm=t=>`${Math.round(t*100)}%`;class mm extends mi{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_VOLUME,r.MEDIA_MUTED,r.MEDIA_VOLUME_UNAVAILABLE]}constructor(){super(),this.range.addEventListener("input",()=>{const e=this.range.value,i=new d.CustomEvent(E.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)})}connectedCallback(){super.connectedCallback(),this.range.setAttribute("aria-label",v("volume"))}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),(e===r.MEDIA_VOLUME||e===r.MEDIA_MUTED)&&(this.range.valueAsNumber=cm(this),this.range.setAttribute("aria-valuetext",hm(this.range.valueAsNumber)),this.updateBar())}get mediaVolume(){return O(this,r.MEDIA_VOLUME,um)}set mediaVolume(e){H(this,r.MEDIA_VOLUME,e)}get mediaMuted(){return k(this,r.MEDIA_MUTED)}set mediaMuted(e){S(this,r.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return P(this,r.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){U(this,r.MEDIA_VOLUME_UNAVAILABLE,e)}}d.customElements.get("media-volume-range")||d.customElements.define("media-volume-range",mm);var Pd=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},T=(t,e,i)=>(Pd(t,e,"read from private field"),i?i.call(t):e.get(t)),Ce=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},We=(t,e,i,a)=>(Pd(t,e,"write to private field"),e.set(t,i),i),qt,mn,mt,Pi,Xe,Je,je,pt,Yt,pn,me;const ml=1,pl=0,pm=1,vm={processCallback(t,e,i){if(i){for(const[a,n]of e)if(a in i){const s=i[a];typeof s=="boolean"&&n instanceof Tt&&typeof n.element[n.attributeName]=="boolean"?n.booleanValue=s:typeof s=="function"&&n instanceof Tt?n.element[n.attributeName]=s:n.value=s}}}};class eo extends d.DocumentFragment{constructor(e,i,a=vm){var n;super(),Ce(this,qt,void 0),Ce(this,mn,void 0),this.append(e.content.cloneNode(!0)),We(this,qt,Ud(this)),We(this,mn,a),(n=a.createCallback)==null||n.call(a,this,T(this,qt),i),a.processCallback(this,T(this,qt),i)}update(e){T(this,mn).processCallback(this,T(this,qt),e)}}qt=new WeakMap;mn=new WeakMap;const Ud=(t,e=[])=>{let i,a;for(const n of t.attributes||[])if(n.value.includes("{{")){const s=new fm;for([i,a]of El(n.value))if(!i)s.append(a);else{const o=new Tt(t,n.name,n.namespaceURI);s.append(o),e.push([a,o])}n.value=s.toString()}for(const n of t.childNodes)if(n.nodeType===ml&&!(n instanceof HTMLTemplateElement))Ud(n,e);else{const s=n.data;if(n.nodeType===ml||s.includes("{{")){const o=[];if(s)for([i,a]of El(s))if(!i)o.push(new Text(a));else{const l=new Hd(t);o.push(l),e.push([a,l])}else if(n instanceof HTMLTemplateElement){const l=new Bd(t,n);o.push(l),e.push([l.expression,l])}n.replaceWith(...o.flatMap(l=>l.replacementNodes||[l]))}}return e},vl={},El=t=>{let e="",i=0,a=vl[t],n=0,s;if(a)return a;for(a=[];s=t[n];n++)s==="{"&&t[n+1]==="{"&&t[n-1]!=="\\"&&t[n+2]&&++i==1?(e&&a.push([pl,e]),e="",n++):s==="}"&&t[n+1]==="}"&&t[n-1]!=="\\"&&!--i?(a.push([pm,e.trim()]),e="",n++):e+=s||"";return e&&a.push([pl,(i>0?"{{":"")+e]),vl[t]=a},Em=11;class $d{get value(){return""}set value(e){}toString(){return this.value}}const Nd=new WeakMap;class fm{constructor(){Ce(this,mt,[])}[Symbol.iterator](){return T(this,mt).values()}get length(){return T(this,mt).length}item(e){return T(this,mt)[e]}append(...e){for(const i of e)i instanceof Tt&&Nd.set(i,this),T(this,mt).push(i)}toString(){return T(this,mt).join("")}}mt=new WeakMap;class Tt extends $d{constructor(e,i,a){super(),Ce(this,pt),Ce(this,Pi,""),Ce(this,Xe,void 0),Ce(this,Je,void 0),Ce(this,je,void 0),We(this,Xe,e),We(this,Je,i),We(this,je,a)}get attributeName(){return T(this,Je)}get attributeNamespace(){return T(this,je)}get element(){return T(this,Xe)}get value(){return T(this,Pi)}set value(e){T(this,Pi)!==e&&(We(this,Pi,e),!T(this,pt,Yt)||T(this,pt,Yt).length===1?e==null?T(this,Xe).removeAttributeNS(T(this,je),T(this,Je)):T(this,Xe).setAttributeNS(T(this,je),T(this,Je),e):T(this,Xe).setAttributeNS(T(this,je),T(this,Je),T(this,pt,Yt).toString()))}get booleanValue(){return T(this,Xe).hasAttributeNS(T(this,je),T(this,Je))}set booleanValue(e){if(!T(this,pt,Yt)||T(this,pt,Yt).length===1)this.value=e?"":null;else throw new DOMException("Value is not fully templatized")}}Pi=new WeakMap;Xe=new WeakMap;Je=new WeakMap;je=new WeakMap;pt=new WeakSet;Yt=function(){return Nd.get(this)};class Hd extends $d{constructor(e,i){super(),Ce(this,pn,void 0),Ce(this,me,void 0),We(this,pn,e),We(this,me,i?[...i]:[new Text])}get replacementNodes(){return T(this,me)}get parentNode(){return T(this,pn)}get nextSibling(){return T(this,me)[T(this,me).length-1].nextSibling}get previousSibling(){return T(this,me)[0].previousSibling}get value(){return T(this,me).map(e=>e.textContent).join("")}set value(e){this.replace(e)}replace(...e){const i=e.flat().flatMap(a=>a==null?[new Text]:a.forEach?[...a]:a.nodeType===Em?[...a.childNodes]:a.nodeType?[a]:[new Text(a)]);i.length||i.push(new Text),We(this,me,gm(T(this,me)[0].parentNode,T(this,me),i,this.nextSibling))}}pn=new WeakMap;me=new WeakMap;class Bd extends Hd{constructor(e,i){const a=i.getAttribute("directive")||i.getAttribute("type");let n=i.getAttribute("expression")||i.getAttribute(a)||"";n.startsWith("{{")&&(n=n.trim().slice(2,-2).trim()),super(e),this.expression=n,this.template=i,this.directive=a}}function gm(t,e,i,a=null){let n=0,s,o,l,u=i.length,c=e.length;for(;n<u&&n<c&&e[n]==i[n];)n++;for(;n<u&&n<c&&i[u-1]==e[c-1];)a=i[--c,--u];if(n==c)for(;n<u;)t.insertBefore(i[n++],a);if(n==u)for(;n<c;)t.removeChild(e[n++]);else{for(s=e[n];n<u;)l=i[n++],o=s?s.nextSibling:a,s==l?s=o:n<u&&i[n]==o?(t.replaceChild(l,s),s=o):t.insertBefore(l,s);for(;s!=a;)o=s.nextSibling,t.removeChild(s),s=o}return i}const fl={string:t=>String(t)};class Wd{constructor(e){this.template=e,this.state=void 0}}const ft=new WeakMap,gt=new WeakMap,qs={partial:(t,e)=>{e[t.expression]=new Wd(t.template)},if:(t,e)=>{var i;if(Fd(t.expression,e))if(ft.get(t)!==t.template){ft.set(t,t.template);const a=new eo(t.template,e,to);t.replace(a),gt.set(t,a)}else(i=gt.get(t))==null||i.update(e);else t.replace(""),ft.delete(t),gt.delete(t)}},bm=Object.keys(qs),to={processCallback(t,e,i){var a,n;if(i)for(const[s,o]of e){if(o instanceof Bd){if(!o.directive){const u=bm.find(c=>o.template.hasAttribute(c));u&&(o.directive=u,o.expression=o.template.getAttribute(u))}(a=qs[o.directive])==null||a.call(qs,o,i);continue}let l=Fd(s,i);if(l instanceof Wd){ft.get(o)!==l.template?(ft.set(o,l.template),l=new eo(l.template,l.state,to),o.value=l,gt.set(o,l)):(n=gt.get(o))==null||n.update(l.state);continue}l?(o instanceof Tt&&o.attributeName.startsWith("aria-")&&(l=String(l)),o instanceof Tt?typeof l=="boolean"?o.booleanValue=l:typeof l=="function"?o.element[o.attributeName]=l:o.value=l:(o.value=l,ft.delete(o),gt.delete(o))):o instanceof Tt?o.value=void 0:(o.value=void 0,ft.delete(o),gt.delete(o))}}},gl={"!":t=>!t,"!!":t=>!!t,"==":(t,e)=>t==e,"!=":(t,e)=>t!=e,">":(t,e)=>t>e,">=":(t,e)=>t>=e,"<":(t,e)=>t<e,"<=":(t,e)=>t<=e,"??":(t,e)=>t??e,"|":(t,e)=>{var i;return(i=fl[e])==null?void 0:i.call(fl,t)}};function _m(t){return Am(t,{boolean:/true|false/,number:/-?\d+\.?\d*/,string:/(["'])((?:\\.|[^\\])*?)\1/,operator:/[!=><][=!]?|\?\?|\|/,ws:/\s+/,param:/[$a-z_][$\w]*/i}).filter(({type:e})=>e!=="ws")}function Fd(t,e={}){var i,a,n,s,o,l,u;const c=_m(t);if(c.length===0||c.some(({type:f})=>!f))return Ai(t);if(((i=c[0])==null?void 0:i.token)===">"){const f=e[(a=c[1])==null?void 0:a.token];if(!f)return Ai(t);const g={...e};f.state=g;const h=c.slice(2);for(let p=0;p<h.length;p+=3){const M=(n=h[p])==null?void 0:n.token,A=(s=h[p+1])==null?void 0:s.token,_=(o=h[p+2])==null?void 0:o.token;M&&A==="="&&(g[M]=Ti(_,e))}return f}if(c.length===1)return Na(c[0])?Ti(c[0].token,e):Ai(t);if(c.length===2){const f=(l=c[0])==null?void 0:l.token,g=gl[f];if(!g||!Na(c[1]))return Ai(t);const h=Ti(c[1].token,e);return g(h)}if(c.length===3){const f=(u=c[1])==null?void 0:u.token,g=gl[f];if(!g||!Na(c[0])||!Na(c[2]))return Ai(t);const h=Ti(c[0].token,e);if(f==="|")return g(h,c[2].token);const p=Ti(c[2].token,e);return g(h,p)}}function Ai(t){return console.warn(`Warning: invalid expression \`${t}\``),!1}function Na({type:t}){return["number","boolean","string","param"].includes(t)}function Ti(t,e){const i=t[0],a=t.slice(-1);return t==="true"||t==="false"?t==="true":i===a&&["'",'"'].includes(i)?t.slice(1,-1):Ll(t)?parseFloat(t):e[t]}function Am(t,e){let i,a,n;const s=[];for(;t;){n=null,i=t.length;for(const o in e)a=e[o].exec(t),a&&a.index<i&&(n={token:a[0],type:o,matches:a.slice(1)},i=a.index);i&&s.push({token:t.substr(0,i),type:void 0}),n&&s.push(n),t=t.substr(i+(n?n.token.length:0))}return s}var io=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ys=(t,e,i)=>(io(t,e,"read from private field"),i?i.call(t):e.get(t)),yi=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},bt=(t,e,i,a)=>(io(t,e,"write to private field"),e.set(t,i),i),ms=(t,e,i)=>(io(t,e,"access private method"),i),ti,vn,ii,zs,Vd,En,Qs;const ps={mediatargetlivewindow:"targetlivewindow",mediastreamtype:"streamtype"},Gd=G.createElement("template");Gd.innerHTML=`
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }

    media-controller {
      width: 100%;
      height: 100%;
    }

    media-captions-button:not([mediasubtitleslist]),
    media-captions-menu:not([mediasubtitleslist]),
    media-captions-menu-button:not([mediasubtitleslist]),
    media-audio-track-menu[mediaaudiotrackunavailable],
    media-audio-track-menu-button[mediaaudiotrackunavailable],
    media-rendition-menu[mediarenditionunavailable],
    media-rendition-menu-button[mediarenditionunavailable],
    media-volume-range[mediavolumeunavailable],
    media-airplay-button[mediaairplayunavailable],
    media-fullscreen-button[mediafullscreenunavailable],
    media-cast-button[mediacastunavailable],
    media-pip-button[mediapipunavailable] {
      display: none;
    }
  </style>
`;class ss extends d.HTMLElement{constructor(){super(),yi(this,zs),yi(this,En),yi(this,ti,void 0),yi(this,vn,void 0),yi(this,ii,void 0),this.shadowRoot?this.renderRoot=this.shadowRoot:(this.renderRoot=this.attachShadow({mode:"open"}),this.createRenderer());const e=new MutationObserver(i=>{var a;this.mediaController&&!((a=this.mediaController)!=null&&a.breakpointsComputed)||i.some(n=>{const s=n.target;return s===this?!0:s.localName!=="media-controller"?!1:!!(ps[n.attributeName]||n.attributeName.startsWith("breakpoint"))})&&this.render()});e.observe(this,{attributes:!0}),e.observe(this.renderRoot,{attributes:!0,subtree:!0}),this.addEventListener(It.BREAKPOINTS_COMPUTED,this.render),ms(this,zs,Vd).call(this,"template")}get mediaController(){return this.renderRoot.querySelector("media-controller")}get template(){var e;return(e=Ys(this,ti))!=null?e:this.constructor.template}set template(e){bt(this,ii,null),bt(this,ti,e),this.createRenderer()}get props(){var e,i,a;const n=[...Array.from((i=(e=this.mediaController)==null?void 0:e.attributes)!=null?i:[]).filter(({name:o})=>ps[o]||o.startsWith("breakpoint")),...Array.from(this.attributes)],s={};for(const o of n){const l=(a=ps[o.name])!=null?a:Pu(o.name);let{value:u}=o;u!=null?(Ll(u)&&(u=parseFloat(u)),s[l]=u===""?!0:u):s[l]=!1}return s}attributeChangedCallback(e,i,a){e==="template"&&i!=a&&ms(this,En,Qs).call(this)}connectedCallback(){ms(this,En,Qs).call(this)}createRenderer(){this.template&&this.template!==Ys(this,vn)&&(bt(this,vn,this.template),this.renderer=new eo(this.template,this.props,this.constructor.processor),this.renderRoot.textContent="",this.renderRoot.append(Gd.content.cloneNode(!0),this.renderer))}render(){var e;(e=this.renderer)==null||e.update(this.props)}}ti=new WeakMap;vn=new WeakMap;ii=new WeakMap;zs=new WeakSet;Vd=function(t){if(Object.prototype.hasOwnProperty.call(this,t)){const e=this[t];delete this[t],this[t]=e}};En=new WeakSet;Qs=function(){var t;const e=this.getAttribute("template");if(!e||e===Ys(this,ii))return;const i=this.getRootNode(),a=(t=i?.getElementById)==null?void 0:t.call(i,e);if(a){bt(this,ii,e),bt(this,ti,a),this.createRenderer();return}Tm(e)&&(bt(this,ii,e),ym(e).then(n=>{const s=G.createElement("template");s.innerHTML=n,bt(this,ti,s),this.createRenderer()}).catch(console.error))};ss.observedAttributes=["template"];ss.processor=to;function Tm(t){if(!/^(\/|\.\/|https?:\/\/)/.test(t))return!1;const e=/^https?:\/\//.test(t)?void 0:location.origin;try{new URL(t,e)}catch{return!1}return!0}async function ym(t){const e=await fetch(t);if(e.status!==200)throw new Error(`Failed to load resource: the server responded with a status of ${e.status}`);return e.text()}d.customElements.get("media-theme")||d.customElements.define("media-theme",ss);function km({anchor:t,floating:e,placement:i}){const a=Sm({anchor:t,floating:e}),{x:n,y:s}=wm(a,i);return{x:n,y:s}}function Sm({anchor:t,floating:e}){return{anchor:Im(t,e.offsetParent),floating:{x:0,y:0,width:e.offsetWidth,height:e.offsetHeight}}}function Im(t,e){var i;const a=t.getBoundingClientRect(),n=(i=e?.getBoundingClientRect())!=null?i:{x:0,y:0};return{x:a.x-n.x,y:a.y-n.y,width:a.width,height:a.height}}function wm({anchor:t,floating:e},i){const a=Mm(i)==="x"?"y":"x",n=a==="y"?"height":"width",s=Kd(i),o=t.x+t.width/2-e.width/2,l=t.y+t.height/2-e.height/2,u=t[n]/2-e[n]/2;let c;switch(s){case"top":c={x:o,y:t.y-e.height};break;case"bottom":c={x:o,y:t.y+t.height};break;case"right":c={x:t.x+t.width,y:l};break;case"left":c={x:t.x-e.width,y:l};break;default:c={x:t.x,y:t.y}}switch(i.split("-")[1]){case"start":c[a]-=u;break;case"end":c[a]+=u;break}return c}function Kd(t){return t.split("-")[0]}function Mm(t){return["top","bottom"].includes(Kd(t))?"y":"x"}class ao extends Event{constructor({action:e="auto",relatedTarget:i,...a}){super("invoke",a),this.action=e,this.relatedTarget=i}}class Lm extends Event{constructor({newState:e,oldState:i,...a}){super("toggle",a),this.newState=e,this.oldState=i}}var no=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},I=(t,e,i)=>(no(t,e,"read from private field"),i?i.call(t):e.get(t)),R=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Me=(t,e,i,a)=>(no(t,e,"write to private field"),e.set(t,i),i),x=(t,e,i)=>(no(t,e,"access private method"),i),Le,yt,nt,fn,gn,kt,ra,Zs,qd,Vn,bn,Xs,Js,Yd,js,zd,er,Qd,ai,ni,si,oa,Gn,so,tr,Zd,ro,Xd,ir,Jd,oo,jd,ar,eu,nr,tu,Ki,Kn,sr,iu,qi,qn,_n,rr;function ui({type:t,text:e,value:i,checked:a}){const n=G.createElement("media-chrome-menu-item");n.type=t,n.part.add("menu-item"),n.part.add(t),n.value=i,n.checked=a;const s=G.createElement("span");return s.textContent=e,n.append(s),n}function St(t,e){let i=t.querySelector(`:scope > [slot="${e}"]`);if(i?.nodeName=="SLOT"&&(i=i.assignedElements({flatten:!0})[0]),i)return i=i.cloneNode(!0),i;const a=t.shadowRoot.querySelector(`[name="${e}"] > svg`);return a?a.cloneNode(!0):""}function Cm(t){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-menu-background, var(--media-control-background, var(--media-secondary-color, var(--_menu-bg))));
        border-radius: var(--media-menu-border-radius);
        border: var(--media-menu-border, none);
        display: var(--media-menu-display, inline-flex);
        transition: var(--media-menu-transition-in,
          visibility 0s,
          opacity .2s ease-out,
          transform .15s ease-out,
          left .2s ease-in-out,
          min-width .2s ease-in-out,
          min-height .2s ease-in-out
        ) !important;
        
        visibility: var(--media-menu-visibility, visible);
        opacity: var(--media-menu-opacity, 1);
        max-height: var(--media-menu-max-height, var(--_menu-max-height, 300px));
        transform: var(--media-menu-transform-in, translateY(0) scale(1));
        flex-direction: column;
        
        min-height: 0;
        position: relative;
        bottom: var(--_menu-bottom);
        box-sizing: border-box;
      } 

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([hidden]) {
        transition: var(--media-menu-transition-out,
          visibility .15s ease-in,
          opacity .15s ease-in,
          transform .15s ease-in
        ) !important;
        visibility: var(--media-menu-hidden-visibility, hidden);
        opacity: var(--media-menu-hidden-opacity, 0);
        max-height: var(--media-menu-hidden-max-height,
          var(--media-menu-max-height, var(--_menu-max-height, 300px)));
        transform: var(--media-menu-transform-out, translateY(2px) scale(.99));
        pointer-events: none;
      }

      :host([slot="submenu"]) {
        background: none;
        width: 100%;
        min-height: 100%;
        position: absolute;
        bottom: 0;
        right: -100%;
      }

      #container {
        display: flex;
        flex-direction: column;
        min-height: 0;
        transition: transform .2s ease-out;
        transform: translate(0, 0);
      }

      #container.has-expanded {
        transition: transform .2s ease-in;
        transform: translate(-100%, 0);
      }

      button {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        outline: inherit;
        display: inline-flex;
        align-items: center;
      }

      slot[name="header"][hidden] {
        display: none;
      }

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .7em;
        border-bottom: 1px solid rgb(255 255 255 / .25);
        cursor: var(--media-cursor, default);
      }

      slot[name="header"] > button[part~="back"],
      slot[name="header"]::slotted(button[part~="back"]) {
        cursor: var(--media-cursor, pointer);
      }

      svg[part~="back"] {
        height: var(--media-menu-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
        margin-right: .5ch;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap);
        flex-direction: var(--media-menu-flex-direction, column);
        overflow: var(--media-menu-overflow, hidden auto);
        display: flex;
        min-height: 0;
      }

      :host([role="menu"]) slot:not([name]) {
        padding-block: .4em;
      }

      slot:not([name])::slotted([role="menu"]) {
        background: none;
      }

      media-chrome-menu-item > span {
        margin-right: .5ch;
        max-width: var(--media-menu-item-max-width);
        text-overflow: ellipsis;
        overflow: hidden;
      }
    </style>
    <style id="layout-row" media="width:0">

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .5em;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap, .25em);
        flex-direction: var(--media-menu-flex-direction, row);
        padding-inline: .5em;
      }

      media-chrome-menu-item {
        padding: .3em .5em;
      }

      media-chrome-menu-item[aria-checked="true"] {
        background: var(--media-menu-item-checked-background, rgb(255 255 255 / .2));
      }

      
      media-chrome-menu-item::part(checked-indicator) {
        display: var(--media-menu-item-checked-indicator-display, none);
      }
    </style>
    <div id="container">
      <slot name="header" hidden>
        <button part="back button" aria-label="Back to previous menu">
          <slot name="back-icon">
            <svg aria-hidden="true" viewBox="0 0 20 24" part="back indicator">
              <path d="m11.88 17.585.742-.669-4.2-4.665 4.2-4.666-.743-.669-4.803 5.335 4.803 5.334Z"/>
            </svg>
          </slot>
          <slot name="title"></slot>
        </button>
      </slot>
      <slot></slot>
    </div>
    <slot name="checked-indicator" hidden></slot>
  `}const lt={STYLE:"style",HIDDEN:"hidden",DISABLED:"disabled",ANCHOR:"anchor"};class Pe extends d.HTMLElement{constructor(){if(super(),R(this,Zs),R(this,bn),R(this,Js),R(this,js),R(this,er),R(this,si),R(this,Gn),R(this,tr),R(this,ro),R(this,ir),R(this,oo),R(this,ar),R(this,nr),R(this,Ki),R(this,sr),R(this,qi),R(this,_n),R(this,Le,null),R(this,yt,null),R(this,nt,null),R(this,fn,new Set),R(this,gn,void 0),R(this,kt,!1),R(this,ra,null),R(this,Vn,()=>{const e=I(this,fn),i=new Set(this.items);for(const a of e)i.has(a)||this.dispatchEvent(new CustomEvent("removemenuitem",{detail:a}));for(const a of i)e.has(a)||this.dispatchEvent(new CustomEvent("addmenuitem",{detail:a}));Me(this,fn,i)}),R(this,ai,()=>{x(this,si,oa).call(this),x(this,Gn,so).call(this,!1)}),R(this,ni,()=>{x(this,si,oa).call(this)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=se(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.container=this.shadowRoot.querySelector("#container"),this.defaultSlot=this.shadowRoot.querySelector("slot:not([name])"),this.shadowRoot.addEventListener("slotchange",this),Me(this,gn,new MutationObserver(I(this,Vn))),I(this,gn).observe(this.defaultSlot,{childList:!0})}static get observedAttributes(){return[lt.DISABLED,lt.HIDDEN,lt.STYLE,lt.ANCHOR,w.MEDIA_CONTROLLER]}static formatMenuItemText(e,i){return e}enable(){this.addEventListener("click",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this),this.addEventListener("invoke",this),this.addEventListener("toggle",this)}disable(){this.removeEventListener("click",this),this.removeEventListener("focusout",this),this.removeEventListener("keyup",this),this.removeEventListener("invoke",this),this.removeEventListener("toggle",this)}handleEvent(e){switch(e.type){case"slotchange":x(this,Zs,qd).call(this,e);break;case"invoke":x(this,Js,Yd).call(this,e);break;case"click":x(this,tr,Zd).call(this,e);break;case"toggle":x(this,ir,Jd).call(this,e);break;case"focusout":x(this,ar,eu).call(this,e);break;case"keydown":x(this,nr,tu).call(this,e);break}}connectedCallback(){var e,i;Me(this,ra,Bl(this.shadowRoot,":host")),x(this,bn,Xs).call(this),this.hasAttribute("disabled")||this.enable(),this.role||(this.role="menu"),Me(this,Le,As(this)),(i=(e=I(this,Le))==null?void 0:e.associateElement)==null||i.call(e,this),this.hidden||(ri(la(this),I(this,ai)),ri(this,I(this,ni)))}disconnectedCallback(){var e,i;oi(la(this),I(this,ai)),oi(this,I(this,ni)),this.disable(),(i=(e=I(this,Le))==null?void 0:e.unassociateElement)==null||i.call(e,this),Me(this,Le,null)}attributeChangedCallback(e,i,a){var n,s,o,l;e===lt.HIDDEN&&a!==i?(I(this,kt)||Me(this,kt,!0),this.hidden?x(this,er,Qd).call(this):x(this,js,zd).call(this),this.dispatchEvent(new Lm({oldState:this.hidden?"open":"closed",newState:this.hidden?"closed":"open",bubbles:!0}))):e===w.MEDIA_CONTROLLER?(i&&((s=(n=I(this,Le))==null?void 0:n.unassociateElement)==null||s.call(n,this),Me(this,Le,null)),a&&this.isConnected&&(Me(this,Le,As(this)),(l=(o=I(this,Le))==null?void 0:o.associateElement)==null||l.call(o,this))):e===lt.DISABLED&&a!==i?a==null?this.enable():this.disable():e===lt.STYLE&&a!==i&&x(this,bn,Xs).call(this)}formatMenuItemText(e,i){return this.constructor.formatMenuItemText(e,i)}get anchor(){return this.getAttribute("anchor")}set anchor(e){this.setAttribute("anchor",`${e}`)}get anchorElement(){var e;return this.anchor?(e=Qn(this))==null?void 0:e.querySelector(`#${this.anchor}`):null}get items(){return this.defaultSlot.assignedElements({flatten:!0}).filter(Rm)}get radioGroupItems(){return this.items.filter(e=>e.role==="menuitemradio")}get checkedItems(){return this.items.filter(e=>e.checked)}get value(){var e,i;return(i=(e=this.checkedItems[0])==null?void 0:e.value)!=null?i:""}set value(e){const i=this.items.find(a=>a.value===e);i&&x(this,_n,rr).call(this,i)}focus(){if(Me(this,yt,Ar()),this.items.length){x(this,qi,qn).call(this,this.items[0]),this.items[0].focus();return}const e=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');e?.focus()}handleSelect(e){var i;const a=x(this,Ki,Kn).call(this,e);a&&(x(this,_n,rr).call(this,a,a.type==="checkbox"),I(this,nt)&&!this.hidden&&((i=I(this,yt))==null||i.focus(),this.hidden=!0))}get keysUsed(){return["Enter","Escape","Tab"," ","ArrowDown","ArrowUp","Home","End"]}handleMove(e){var i,a;const{key:n}=e,s=this.items,o=(a=(i=x(this,Ki,Kn).call(this,e))!=null?i:x(this,sr,iu).call(this))!=null?a:s[0],l=s.indexOf(o);let u=Math.max(0,l);n==="ArrowDown"?u++:n==="ArrowUp"?u--:e.key==="Home"?u=0:e.key==="End"&&(u=s.length-1),u<0&&(u=s.length-1),u>s.length-1&&(u=0),x(this,qi,qn).call(this,s[u]),s[u].focus()}}Le=new WeakMap;yt=new WeakMap;nt=new WeakMap;fn=new WeakMap;gn=new WeakMap;kt=new WeakMap;ra=new WeakMap;Zs=new WeakSet;qd=function(t){const e=t.target;for(const i of e.assignedNodes({flatten:!0}))i.nodeType===3&&i.textContent.trim()===""&&i.remove();if(["header","title"].includes(e.name)){const i=this.shadowRoot.querySelector('slot[name="header"]');i.hidden=e.assignedNodes().length===0}e.name||I(this,Vn).call(this)};Vn=new WeakMap;bn=new WeakSet;Xs=function(){var t;const e=this.shadowRoot.querySelector("#layout-row"),i=(t=getComputedStyle(this).getPropertyValue("--media-menu-layout"))==null?void 0:t.trim();e.setAttribute("media",i==="row"?"":"width:0")};Js=new WeakSet;Yd=function(t){Me(this,nt,t.relatedTarget),Fe(this,t.relatedTarget)||(this.hidden=!this.hidden)};js=new WeakSet;zd=function(){var t;(t=I(this,nt))==null||t.setAttribute("aria-expanded","true"),this.addEventListener("transitionend",()=>this.focus(),{once:!0}),ri(la(this),I(this,ai)),ri(this,I(this,ni))};er=new WeakSet;Qd=function(){var t;(t=I(this,nt))==null||t.setAttribute("aria-expanded","false"),oi(la(this),I(this,ai)),oi(this,I(this,ni))};ai=new WeakMap;ni=new WeakMap;si=new WeakSet;oa=function(t){if(this.hasAttribute("mediacontroller")&&!this.anchor||this.hidden||!this.anchorElement)return;const{x:e,y:i}=km({anchor:this.anchorElement,floating:this,placement:"top-start"});t??(t=this.offsetWidth);const n=la(this).getBoundingClientRect(),s=n.width-e-t,o=n.height-i-this.offsetHeight,{style:l}=I(this,ra);l.setProperty("position","absolute"),l.setProperty("right",`${Math.max(0,s)}px`),l.setProperty("--_menu-bottom",`${o}px`);const u=getComputedStyle(this),f=l.getPropertyValue("--_menu-bottom")===u.bottom?o:parseFloat(u.bottom),g=n.height-f-parseFloat(u.marginBottom);this.style.setProperty("--_menu-max-height",`${g}px`)};Gn=new WeakSet;so=function(t){const e=this.querySelector('[role="menuitem"][aria-haspopup][aria-expanded="true"]'),i=e?.querySelector('[role="menu"]'),{style:a}=I(this,ra);if(t||a.setProperty("--media-menu-transition-in","none"),i){const n=i.offsetHeight,s=Math.max(i.offsetWidth,e.offsetWidth);this.style.setProperty("min-width",`${s}px`),this.style.setProperty("min-height",`${n}px`),x(this,si,oa).call(this,s)}else this.style.removeProperty("min-width"),this.style.removeProperty("min-height"),x(this,si,oa).call(this);a.removeProperty("--media-menu-transition-in")};tr=new WeakSet;Zd=function(t){var e;if(t.stopPropagation(),t.composedPath().includes(I(this,ro,Xd))){(e=I(this,yt))==null||e.focus(),this.hidden=!0;return}const i=x(this,Ki,Kn).call(this,t);!i||i.hasAttribute("disabled")||(x(this,qi,qn).call(this,i),this.handleSelect(t))};ro=new WeakSet;Xd=function(){var t;return(t=this.shadowRoot.querySelector('slot[name="header"]').assignedElements({flatten:!0}))==null?void 0:t.find(i=>i.matches('button[part~="back"]'))};ir=new WeakSet;Jd=function(t){if(t.target===this)return;x(this,oo,jd).call(this);const e=Array.from(this.querySelectorAll('[role="menuitem"][aria-haspopup]'));for(const i of e)i.invokeTargetElement!=t.target&&t.newState=="open"&&i.getAttribute("aria-expanded")=="true"&&!i.invokeTargetElement.hidden&&i.invokeTargetElement.dispatchEvent(new ao({relatedTarget:i}));for(const i of e)i.setAttribute("aria-expanded",`${!i.submenuElement.hidden}`);x(this,Gn,so).call(this,!0)};oo=new WeakSet;jd=function(){const e=this.querySelector('[role="menuitem"] > [role="menu"]:not([hidden])');this.container.classList.toggle("has-expanded",!!e)};ar=new WeakSet;eu=function(t){var e;Fe(this,t.relatedTarget)||(I(this,kt)&&((e=I(this,yt))==null||e.focus()),I(this,nt)&&I(this,nt)!==t.relatedTarget&&!this.hidden&&(this.hidden=!0))};nr=new WeakSet;tu=function(t){var e,i,a,n,s;const{key:o,ctrlKey:l,altKey:u,metaKey:c}=t;if(!(l||u||c)&&this.keysUsed.includes(o))if(t.preventDefault(),t.stopPropagation(),o==="Tab"){if(I(this,kt)){this.hidden=!0;return}t.shiftKey?(i=(e=this.previousElementSibling)==null?void 0:e.focus)==null||i.call(e):(n=(a=this.nextElementSibling)==null?void 0:a.focus)==null||n.call(a),this.blur()}else o==="Escape"?((s=I(this,yt))==null||s.focus(),I(this,kt)&&(this.hidden=!0)):o==="Enter"||o===" "?this.handleSelect(t):this.handleMove(t)};Ki=new WeakSet;Kn=function(t){return t.composedPath().find(e=>["menuitemradio","menuitemcheckbox"].includes(e.role))};sr=new WeakSet;iu=function(){return this.items.find(t=>t.tabIndex===0)};qi=new WeakSet;qn=function(t){for(const e of this.items)e.tabIndex=e===t?0:-1};_n=new WeakSet;rr=function(t,e){const i=[...this.checkedItems];t.type==="radio"&&this.radioGroupItems.forEach(a=>a.checked=!1),e?t.checked=!t.checked:t.checked=!0,this.checkedItems.some((a,n)=>a!=i[n])&&this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))};Pe.shadowRootOptions={mode:"open"};Pe.getTemplateHTML=Cm;function Rm(t){return["menuitem","menuitemradio","menuitemcheckbox"].includes(t?.role)}function la(t){var e;return(e=t.getAttribute("bounds")?hi(t,`#${t.getAttribute("bounds")}`):ue(t)||t.parentElement)!=null?e:t}d.customElements.get("media-chrome-menu")||d.customElements.define("media-chrome-menu",Pe);var lo=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},De=(t,e,i)=>(lo(t,e,"read from private field"),i?i.call(t):e.get(t)),Ne=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},vs=(t,e,i,a)=>(lo(t,e,"write to private field"),e.set(t,i),i),Re=(t,e,i)=>(lo(t,e,"access private method"),i),An,Yi,or,au,uo,nu,co,su,xe,ci,da,lr,ru,Tn,dr;function Dm(t){return`
    <style>
      :host {
        transition: var(--media-menu-item-transition,
          background .15s linear,
          opacity .2s ease-in-out
        );
        outline: var(--media-menu-item-outline, 0);
        outline-offset: var(--media-menu-item-outline-offset, -1px);
        cursor: var(--media-cursor, pointer);
        display: flex;
        align-items: center;
        align-self: stretch;
        justify-self: stretch;
        white-space: nowrap;
        white-space-collapse: collapse;
        text-wrap: nowrap;
        padding: .4em .8em .4em 1em;
      }

      :host(:focus-visible) {
        box-shadow: var(--media-menu-item-focus-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: var(--media-menu-item-hover-outline, 0);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host(:hover) {
        cursor: var(--media-cursor, pointer);
        background: var(--media-menu-item-hover-background, rgb(92 92 102 / .5));
        outline: var(--media-menu-item-hover-outline);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host([aria-checked="true"]) {
        background: var(--media-menu-item-checked-background);
      }

      :host([hidden]) {
        display: none;
      }

      :host([disabled]) {
        pointer-events: none;
        color: rgba(255, 255, 255, .3);
      }

      slot:not([name]) {
        width: 100%;
      }

      slot:not([name="submenu"]) {
        display: inline-flex;
        align-items: center;
        transition: inherit;
        opacity: var(--media-menu-item-opacity, 1);
      }

      slot[name="description"] {
        justify-content: end;
      }

      slot[name="description"] > span {
        display: inline-block;
        margin-inline: 1em .2em;
        max-width: var(--media-menu-item-description-max-width, 100px);
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: .8em;
        font-weight: 400;
        text-align: right;
        position: relative;
        top: .04em;
      }

      slot[name="checked-indicator"] {
        display: none;
      }

      :host(:is([role="menuitemradio"],[role="menuitemcheckbox"])) slot[name="checked-indicator"] {
        display: var(--media-menu-item-checked-indicator-display, inline-block);
      }

      
      svg, img, ::slotted(svg), ::slotted(img) {
        height: var(--media-menu-item-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
      }

      
      [part~="indicator"],
      ::slotted([part~="indicator"]) {
        fill: var(--media-menu-item-indicator-fill,
          var(--media-icon-color, var(--media-primary-color, rgb(238 238 238))));
        height: var(--media-menu-item-indicator-height, 1.25em);
        margin-right: .5ch;
      }

      [part~="checked-indicator"] {
        visibility: hidden;
      }

      :host([aria-checked="true"]) [part~="checked-indicator"] {
        visibility: visible;
      }
    </style>
    <slot name="checked-indicator">
      <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
        <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
      </svg>
    </slot>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="description"></slot>
    <slot name="suffix">
      ${this.getSuffixSlotInnerHTML(t)}
    </slot>
    <slot name="submenu"></slot>
  `}function xm(t){return""}const le={TYPE:"type",VALUE:"value",CHECKED:"checked",DISABLED:"disabled"};class pi extends d.HTMLElement{constructor(){if(super(),Ne(this,or),Ne(this,uo),Ne(this,co),Ne(this,ci),Ne(this,lr),Ne(this,Tn),Ne(this,An,!1),Ne(this,Yi,void 0),Ne(this,xe,()=>{var e,i;this.setAttribute("submenusize",`${this.submenuElement.items.length}`);const a=this.shadowRoot.querySelector('slot[name="description"]'),n=(e=this.submenuElement.checkedItems)==null?void 0:e[0],s=(i=n?.dataset.description)!=null?i:n?.text,o=G.createElement("span");o.textContent=s??"",a.replaceChildren(o)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=se(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.shadowRoot.addEventListener("slotchange",this)}static get observedAttributes(){return[le.TYPE,le.DISABLED,le.CHECKED,le.VALUE]}enable(){this.hasAttribute("tabindex")||this.setAttribute("tabindex","-1"),ki(this)&&!this.hasAttribute("aria-checked")&&this.setAttribute("aria-checked","false"),this.addEventListener("click",this),this.addEventListener("keydown",this)}disable(){this.removeAttribute("tabindex"),this.removeEventListener("click",this),this.removeEventListener("keydown",this),this.removeEventListener("keyup",this)}handleEvent(e){switch(e.type){case"slotchange":Re(this,or,au).call(this,e);break;case"click":this.handleClick(e);break;case"keydown":Re(this,lr,ru).call(this,e);break;case"keyup":Re(this,ci,da).call(this,e);break}}attributeChangedCallback(e,i,a){e===le.CHECKED&&ki(this)&&!De(this,An)?this.setAttribute("aria-checked",a!=null?"true":"false"):e===le.TYPE&&a!==i?this.role="menuitem"+a:e===le.DISABLED&&a!==i&&(a==null?this.enable():this.disable())}connectedCallback(){this.hasAttribute(le.DISABLED)||this.enable(),this.role="menuitem"+this.type,vs(this,Yi,ur(this,this.parentNode)),Re(this,Tn,dr).call(this)}disconnectedCallback(){this.disable(),Re(this,Tn,dr).call(this),vs(this,Yi,null)}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?(e=Qn(this))==null?void 0:e.querySelector(`#${this.invokeTarget}`):this.submenuElement}get submenuElement(){return this.shadowRoot.querySelector('slot[name="submenu"]').assignedElements({flatten:!0})[0]}get type(){var e;return(e=this.getAttribute(le.TYPE))!=null?e:""}set type(e){this.setAttribute(le.TYPE,`${e}`)}get value(){var e;return(e=this.getAttribute(le.VALUE))!=null?e:this.text}set value(e){this.setAttribute(le.VALUE,e)}get text(){var e;return((e=this.textContent)!=null?e:"").trim()}get checked(){if(ki(this))return this.getAttribute("aria-checked")==="true"}set checked(e){ki(this)&&(vs(this,An,!0),this.setAttribute("aria-checked",e?"true":"false"),e?this.part.add("checked"):this.part.remove("checked"))}handleClick(e){ki(this)||this.invokeTargetElement&&Fe(this,e.target)&&this.invokeTargetElement.dispatchEvent(new ao({relatedTarget:this}))}get keysUsed(){return["Enter"," "]}}An=new WeakMap;Yi=new WeakMap;or=new WeakSet;au=function(t){const e=t.target;if(!e?.name)for(const a of e.assignedNodes({flatten:!0}))a instanceof Text&&a.textContent.trim()===""&&a.remove();e.name==="submenu"&&(this.submenuElement?Re(this,uo,nu).call(this):Re(this,co,su).call(this))};uo=new WeakSet;nu=async function(){this.setAttribute("aria-haspopup","menu"),this.setAttribute("aria-expanded",`${!this.submenuElement.hidden}`),this.submenuElement.addEventListener("change",De(this,xe)),this.submenuElement.addEventListener("addmenuitem",De(this,xe)),this.submenuElement.addEventListener("removemenuitem",De(this,xe)),De(this,xe).call(this)};co=new WeakSet;su=function(){this.removeAttribute("aria-haspopup"),this.removeAttribute("aria-expanded"),this.submenuElement.removeEventListener("change",De(this,xe)),this.submenuElement.removeEventListener("addmenuitem",De(this,xe)),this.submenuElement.removeEventListener("removemenuitem",De(this,xe)),De(this,xe).call(this)};xe=new WeakMap;ci=new WeakSet;da=function(t){const{key:e}=t;if(!this.keysUsed.includes(e)){this.removeEventListener("keyup",Re(this,ci,da));return}this.handleClick(t)};lr=new WeakSet;ru=function(t){const{metaKey:e,altKey:i,key:a}=t;if(e||i||!this.keysUsed.includes(a)){this.removeEventListener("keyup",Re(this,ci,da));return}this.addEventListener("keyup",Re(this,ci,da),{once:!0})};Tn=new WeakSet;dr=function(){var t;const e=(t=De(this,Yi))==null?void 0:t.radioGroupItems;if(!e)return;let i=e.filter(a=>a.getAttribute("aria-checked")==="true").pop();i||(i=e[0]);for(const a of e)a.setAttribute("aria-checked","false");i?.setAttribute("aria-checked","true")};pi.shadowRootOptions={mode:"open"};pi.getTemplateHTML=Dm;pi.getSuffixSlotInnerHTML=xm;function ki(t){return t.type==="radio"||t.type==="checkbox"}function ur(t,e){if(!t)return null;const{host:i}=t.getRootNode();return!e&&i?ur(t,i):e?.items?e:ur(e,e?.parentNode)}d.customElements.get("media-chrome-menu-item")||d.customElements.define("media-chrome-menu-item",pi);function Om(t){return`
    ${Pe.getTemplateHTML(t)}
    <style>
      :host {
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-settings-menu-background,
            var(--media-menu-background,
              var(--media-control-background,
                var(--media-secondary-color, var(--_menu-bg)))));
        min-width: var(--media-settings-menu-min-width, 170px);
        border-radius: 2px 2px 0 0;
        overflow: hidden;
      }

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([role="menu"]) {
        
        justify-content: end;
      }

      slot:not([name]) {
        justify-content: var(--media-settings-menu-justify-content);
        flex-direction: var(--media-settings-menu-flex-direction, column);
        overflow: visible;
      }

      #container.has-expanded {
        --media-settings-menu-item-opacity: 0;
      }
    </style>
  `}class ou extends Pe{get anchorElement(){return this.anchor!=="auto"?super.anchorElement:ue(this).querySelector("media-settings-menu-button")}}ou.getTemplateHTML=Om;d.customElements.get("media-settings-menu")||d.customElements.define("media-settings-menu",ou);function Pm(t){return`
    ${pi.getTemplateHTML.call(this,t)}
    <style>
      slot:not([name="submenu"]) {
        opacity: var(--media-settings-menu-item-opacity, var(--media-menu-item-opacity));
      }

      :host([aria-expanded="true"]:hover) {
        background: transparent;
      }
    </style>
  `}function Um(t){return`
    <svg aria-hidden="true" viewBox="0 0 20 24">
      <path d="m8.12 17.585-.742-.669 4.2-4.665-4.2-4.666.743-.669 4.803 5.335-4.803 5.334Z"/>
    </svg>
  `}class rs extends pi{}rs.shadowRootOptions={mode:"open"};rs.getTemplateHTML=Pm;rs.getSuffixSlotInnerHTML=Um;d.customElements.get("media-settings-menu-item")||d.customElements.define("media-settings-menu-item",rs);class vi extends Z{connectedCallback(){super.connectedCallback(),this.invokeTargetElement&&this.setAttribute("aria-haspopup","menu")}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?(e=Qn(this))==null?void 0:e.querySelector(`#${this.invokeTarget}`):null}handleClick(){var e;(e=this.invokeTargetElement)==null||e.dispatchEvent(new ao({relatedTarget:this}))}}d.customElements.get("media-chrome-menu-button")||d.customElements.define("media-chrome-menu-button",vi);function $m(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
      </svg>
    </slot>
  `}function Nm(){return v("Settings")}class ho extends vi{static get observedAttributes(){return[...super.observedAttributes,"target"]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",v("settings"))}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:ue(this).querySelector("media-settings-menu")}}ho.getSlotTemplateHTML=$m;ho.getTooltipContentHTML=Nm;d.customElements.get("media-settings-menu-button")||d.customElements.define("media-settings-menu-button",ho);var mo=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},lu=(t,e,i)=>(mo(t,e,"read from private field"),i?i.call(t):e.get(t)),Ha=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},cr=(t,e,i,a)=>(mo(t,e,"write to private field"),e.set(t,i),i),Ba=(t,e,i)=>(mo(t,e,"access private method"),i),Ui,Yn,yn,hr,kn,mr;class Hm extends Pe{constructor(){super(...arguments),Ha(this,yn),Ha(this,kn),Ha(this,Ui,[]),Ha(this,Yn,void 0)}static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_AUDIO_TRACK_LIST,r.MEDIA_AUDIO_TRACK_ENABLED,r.MEDIA_AUDIO_TRACK_UNAVAILABLE]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_AUDIO_TRACK_ENABLED&&i!==a?this.value=a:e===r.MEDIA_AUDIO_TRACK_LIST&&i!==a&&(cr(this,Ui,Du(a??"")),Ba(this,yn,hr).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",Ba(this,kn,mr))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",Ba(this,kn,mr))}get anchorElement(){var e;return this.anchor!=="auto"?super.anchorElement:(e=ue(this))==null?void 0:e.querySelector("media-audio-track-menu-button")}get mediaAudioTrackList(){return lu(this,Ui)}set mediaAudioTrackList(e){cr(this,Ui,e),Ba(this,yn,hr).call(this)}get mediaAudioTrackEnabled(){var e;return(e=P(this,r.MEDIA_AUDIO_TRACK_ENABLED))!=null?e:""}set mediaAudioTrackEnabled(e){U(this,r.MEDIA_AUDIO_TRACK_ENABLED,e)}}Ui=new WeakMap;Yn=new WeakMap;yn=new WeakSet;hr=function(){if(lu(this,Yn)===JSON.stringify(this.mediaAudioTrackList))return;cr(this,Yn,JSON.stringify(this.mediaAudioTrackList));const t=this.mediaAudioTrackList;this.defaultSlot.textContent="";for(const e of t){const i=this.formatMenuItemText(e.label,e),a=ui({type:"radio",text:i,value:`${e.id}`,checked:e.enabled});a.prepend(St(this,"checked-indicator")),this.defaultSlot.append(a)}};kn=new WeakSet;mr=function(){if(this.value==null)return;const t=new d.CustomEvent(E.MEDIA_AUDIO_TRACK_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(t)};d.customElements.get("media-audio-track-menu")||d.customElements.define("media-audio-track-menu",Hm);const Bm=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M11 17H9.5V7H11v10Zm-3-3H6.5v-4H8v4Zm6-5h-1.5v6H14V9Zm3 7h-1.5V8H17v8Z"/>
  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"/>
</svg>`;function Wm(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${Bm}</slot>
  `}function Fm(){return v("Audio")}class po extends vi{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_AUDIO_TRACK_ENABLED,r.MEDIA_AUDIO_TRACK_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",v("Audio"))}get invokeTargetElement(){var e;return this.invokeTarget!=null?super.invokeTargetElement:(e=ue(this))==null?void 0:e.querySelector("media-audio-track-menu")}get mediaAudioTrackEnabled(){var e;return(e=P(this,r.MEDIA_AUDIO_TRACK_ENABLED))!=null?e:""}set mediaAudioTrackEnabled(e){U(this,r.MEDIA_AUDIO_TRACK_ENABLED,e)}}po.getSlotTemplateHTML=Wm;po.getTooltipContentHTML=Fm;d.customElements.get("media-audio-track-menu-button")||d.customElements.define("media-audio-track-menu-button",po);var vo=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Vm=(t,e,i)=>(vo(t,e,"read from private field"),e.get(t)),Es=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Gm=(t,e,i,a)=>(vo(t,e,"write to private field"),e.set(t,i),i),fs=(t,e,i)=>(vo(t,e,"access private method"),i),zn,pr,du,Sn,vr;const Km=`
  <svg aria-hidden="true" viewBox="0 0 26 24" part="captions-indicator indicator">
    <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
  </svg>`;function qm(t){return`
    ${Pe.getTemplateHTML(t)}
    <slot name="captions-indicator" hidden>${Km}</slot>
  `}class uu extends Pe{constructor(){super(...arguments),Es(this,pr),Es(this,Sn),Es(this,zn,void 0)}static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_SUBTITLES_LIST,r.MEDIA_SUBTITLES_SHOWING]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_SUBTITLES_LIST&&i!==a?fs(this,pr,du).call(this):e===r.MEDIA_SUBTITLES_SHOWING&&i!==a&&(this.value=a)}connectedCallback(){super.connectedCallback(),this.addEventListener("change",fs(this,Sn,vr))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",fs(this,Sn,vr))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:ue(this).querySelector("media-captions-menu-button")}get mediaSubtitlesList(){return bl(this,r.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){_l(this,r.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return bl(this,r.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){_l(this,r.MEDIA_SUBTITLES_SHOWING,e)}}zn=new WeakMap;pr=new WeakSet;du=function(){var t;if(Vm(this,zn)===JSON.stringify(this.mediaSubtitlesList))return;Gm(this,zn,JSON.stringify(this.mediaSubtitlesList)),this.defaultSlot.textContent="";const e=!this.value,i=ui({type:"radio",text:this.formatMenuItemText(v("Off")),value:"off",checked:e});i.prepend(St(this,"checked-indicator")),this.defaultSlot.append(i);const a=this.mediaSubtitlesList;for(const n of a){const s=ui({type:"radio",text:this.formatMenuItemText(n.label,n),value:Ss(n),checked:this.value==Ss(n)});s.prepend(St(this,"checked-indicator")),((t=n.kind)!=null?t:"subs")==="captions"&&s.append(St(this,"captions-indicator")),this.defaultSlot.append(s)}};Sn=new WeakSet;vr=function(){const t=this.mediaSubtitlesShowing,e=this.getAttribute(r.MEDIA_SUBTITLES_SHOWING),i=this.value!==e;if(t?.length&&i&&this.dispatchEvent(new d.CustomEvent(E.MEDIA_DISABLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:t})),!this.value||!i)return;const a=new d.CustomEvent(E.MEDIA_SHOW_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(a)};uu.getTemplateHTML=qm;const bl=(t,e)=>{const i=t.getAttribute(e);return i?es(i):[]},_l=(t,e,i)=>{if(!i?.length){t.removeAttribute(e);return}const a=ea(i);t.getAttribute(e)!==a&&t.setAttribute(e,a)};d.customElements.get("media-captions-menu")||d.customElements.define("media-captions-menu",uu);const Ym=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,zm=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;function Qm(){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${Ym}</slot>
      <slot name="off">${zm}</slot>
    </slot>
  `}function Zm(){return v("Captions")}const Al=t=>{t.setAttribute("aria-checked",Zl(t).toString())};class Eo extends vi{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_SUBTITLES_LIST,r.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",v("closed captions")),Al(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_SUBTITLES_SHOWING&&Al(this)}get invokeTargetElement(){var e;return this.invokeTarget!=null?super.invokeTargetElement:(e=ue(this))==null?void 0:e.querySelector("media-captions-menu")}get mediaSubtitlesList(){return Tl(this,r.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){yl(this,r.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return Tl(this,r.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){yl(this,r.MEDIA_SUBTITLES_SHOWING,e)}}Eo.getSlotTemplateHTML=Qm;Eo.getTooltipContentHTML=Zm;const Tl=(t,e)=>{const i=t.getAttribute(e);return i?es(i):[]},yl=(t,e,i)=>{if(!i?.length){t.removeAttribute(e);return}const a=ea(i);t.getAttribute(e)!==a&&t.setAttribute(e,a)};d.customElements.get("media-captions-menu-button")||d.customElements.define("media-captions-menu-button",Eo);var cu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},zt=(t,e,i)=>(cu(t,e,"read from private field"),i?i.call(t):e.get(t)),gs=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Si=(t,e,i)=>(cu(t,e,"access private method"),i),et,$i,In,wn,Er;const bs={RATES:"rates"};class Xm extends Pe{constructor(){super(),gs(this,$i),gs(this,wn),gs(this,et,new kr(this,bs.RATES,{defaultValue:kd})),Si(this,$i,In).call(this)}static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_PLAYBACK_RATE,bs.RATES]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_PLAYBACK_RATE&&i!=a?this.value=a:e===bs.RATES&&i!=a&&(zt(this,et).value=a,Si(this,$i,In).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",Si(this,wn,Er))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",Si(this,wn,Er))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:ue(this).querySelector("media-playback-rate-menu-button")}get rates(){return zt(this,et)}set rates(e){e?Array.isArray(e)?zt(this,et).value=e.join(" "):typeof e=="string"&&(zt(this,et).value=e):zt(this,et).value="",Si(this,$i,In).call(this)}get mediaPlaybackRate(){return O(this,r.MEDIA_PLAYBACK_RATE,Jt)}set mediaPlaybackRate(e){H(this,r.MEDIA_PLAYBACK_RATE,e)}}et=new WeakMap;$i=new WeakSet;In=function(){this.defaultSlot.textContent="";for(const t of zt(this,et)){const e=ui({type:"radio",text:this.formatMenuItemText(`${t}x`,t),value:t,checked:this.mediaPlaybackRate===Number(t)});e.prepend(St(this,"checked-indicator")),this.defaultSlot.append(e)}};wn=new WeakSet;Er=function(){if(!this.value)return;const t=new d.CustomEvent(E.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(t)};d.customElements.get("media-playback-rate-menu")||d.customElements.define("media-playback-rate-menu",Xm);const Mn=1;function Jm(t){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
      
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${t.mediaplaybackrate||Mn}x</slot>
  `}function jm(){return v("Playback rate")}class fo extends vi{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_PLAYBACK_RATE]}constructor(){var e;super(),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${(e=this.mediaPlaybackRate)!=null?e:Mn}x`}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),e===r.MEDIA_PLAYBACK_RATE){const n=a?+a:Number.NaN,s=Number.isNaN(n)?Mn:n;this.container.innerHTML=`${s}x`,this.setAttribute("aria-label",v("Playback rate {playbackRate}",{playbackRate:s}))}}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:ue(this).querySelector("media-playback-rate-menu")}get mediaPlaybackRate(){return O(this,r.MEDIA_PLAYBACK_RATE,Mn)}set mediaPlaybackRate(e){H(this,r.MEDIA_PLAYBACK_RATE,e)}}fo.getSlotTemplateHTML=Jm;fo.getTooltipContentHTML=jm;d.customElements.get("media-playback-rate-menu-button")||d.customElements.define("media-playback-rate-menu-button",fo);var go=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ni=(t,e,i)=>(go(t,e,"read from private field"),i?i.call(t):e.get(t)),Wa=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},kl=(t,e,i,a)=>(go(t,e,"write to private field"),e.set(t,i),i),Ot=(t,e,i)=>(go(t,e,"access private method"),i),Hi,jt,Qt,Bi,Ln,fr;class ep extends Pe{constructor(){super(...arguments),Wa(this,Qt),Wa(this,Ln),Wa(this,Hi,[]),Wa(this,jt,{})}static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_RENDITION_LIST,r.MEDIA_RENDITION_SELECTED,r.MEDIA_RENDITION_UNAVAILABLE,r.MEDIA_HEIGHT]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===r.MEDIA_RENDITION_SELECTED&&i!==a?(this.value=a??"auto",Ot(this,Qt,Bi).call(this)):e===r.MEDIA_RENDITION_LIST&&i!==a?(kl(this,Hi,Mu(a)),Ot(this,Qt,Bi).call(this)):e===r.MEDIA_HEIGHT&&i!==a&&Ot(this,Qt,Bi).call(this)}connectedCallback(){super.connectedCallback(),this.addEventListener("change",Ot(this,Ln,fr))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",Ot(this,Ln,fr))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:ue(this).querySelector("media-rendition-menu-button")}get mediaRenditionList(){return Ni(this,Hi)}set mediaRenditionList(e){kl(this,Hi,e),Ot(this,Qt,Bi).call(this)}get mediaRenditionSelected(){return P(this,r.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){U(this,r.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return O(this,r.MEDIA_HEIGHT)}set mediaHeight(e){H(this,r.MEDIA_HEIGHT,e)}}Hi=new WeakMap;jt=new WeakMap;Qt=new WeakSet;Bi=function(){if(Ni(this,jt).mediaRenditionList===JSON.stringify(this.mediaRenditionList)&&Ni(this,jt).mediaHeight===this.mediaHeight)return;Ni(this,jt).mediaRenditionList=JSON.stringify(this.mediaRenditionList),Ni(this,jt).mediaHeight=this.mediaHeight;const t=this.mediaRenditionList.sort((s,o)=>o.height-s.height);for(const s of t)s.selected=s.id===this.mediaRenditionSelected;this.defaultSlot.textContent="";const e=!this.mediaRenditionSelected;for(const s of t){const o=this.formatMenuItemText(`${Math.min(s.width,s.height)}p`,s),l=ui({type:"radio",text:o,value:`${s.id}`,checked:s.selected&&!e});l.prepend(St(this,"checked-indicator")),this.defaultSlot.append(l)}const i=e?this.formatMenuItemText(`${v("Auto")} (${this.mediaHeight}p)`):this.formatMenuItemText(v("Auto")),a=ui({type:"radio",text:i,value:"auto",checked:e}),n=this.mediaHeight>0?`${v("Auto")} (${this.mediaHeight}p)`:v("Auto");a.dataset.description=n,a.prepend(St(this,"checked-indicator")),this.defaultSlot.append(a)};Ln=new WeakSet;fr=function(){if(this.value==null)return;const t=new d.CustomEvent(E.MEDIA_RENDITION_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(t)};d.customElements.get("media-rendition-menu")||d.customElements.define("media-rendition-menu",ep);const tp=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`;function ip(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${tp}</slot>
  `}function ap(){return v("Quality")}class bo extends vi{static get observedAttributes(){return[...super.observedAttributes,r.MEDIA_RENDITION_SELECTED,r.MEDIA_RENDITION_UNAVAILABLE,r.MEDIA_HEIGHT]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",v("quality"))}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:ue(this).querySelector("media-rendition-menu")}get mediaRenditionSelected(){return P(this,r.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){U(this,r.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return O(this,r.MEDIA_HEIGHT)}set mediaHeight(e){H(this,r.MEDIA_HEIGHT,e)}}bo.getSlotTemplateHTML=ip;bo.getTooltipContentHTML=ap;d.customElements.get("media-rendition-menu-button")||d.customElements.define("media-rendition-menu-button",bo);const gr=d.document?.createElement?.("template");gr&&(gr.innerHTML=`
    <!-- Sutro -->
    <style>
      :host {
        --_primary-color: var(--media-primary-color, #fff);
        --_secondary-color: var(--media-secondary-color, transparent);
        --_accent-color: var(--media-accent-color, #fff);
      }

      media-controller {
        --base: 18px;

        font-size: calc(0.75 * var(--base));
        font-family: Roboto, Arial, sans-serif;
        --media-font-family: Roboto, helvetica neue, segoe ui, arial, sans-serif;
        -webkit-font-smoothing: antialiased;

        --media-primary-color: #fff;
        --media-secondary-color: transparent;
        --media-menu-background: rgba(28, 28, 28, 0.6);
        --media-text-color: var(--_primary-color);
        --media-control-hover-background: var(--media-secondary-color);

        --media-range-track-height: calc(0.125 * var(--base));
        --media-range-thumb-height: var(--base);
        --media-range-thumb-width: var(--base);
        --media-range-thumb-border-radius: var(--base);

        --media-control-height: calc(2 * var(--base));
      }

      media-controller[breakpointmd] {
        --base: 20px;
      }

      /* The biggest size controller is tied to going fullscreen
          instead of a player width */
      media-controller[mediaisfullscreen] {
        --base: 24px;
      }

      .media-button {
        --media-control-hover-background: var(--_secondary-color);
        --media-tooltip-background: rgb(28 28 28 / .24);
        --media-text-content-height: 1.2;
        --media-tooltip-padding: .7em 1em;
        --media-tooltip-distance: 8px;
        --media-tooltip-container-margin: 18px;
        position: relative;
        padding: 0;
        opacity: 0.9;
        transition: opacity 0.1s cubic-bezier(0.4, 0, 1, 1);
      }

      .media-button svg {
        fill: none;
        stroke: var(--_primary-color);
        stroke-width: 1;
        stroke-linecap: 'round';
        stroke-linejoin: 'round';
      }

      svg .svg-shadow {
        stroke: #000;
        stroke-opacity: 0.15;
        stroke-width: 2px;
        fill: none;
      }
    </style>

    <media-controller
      breakpoints="md:480"
      defaultsubtitles="{{defaultsubtitles}}"
      defaultduration="{{defaultduration}}"
      gesturesdisabled="{{disabled}}"
      hotkeys="{{hotkeys}}"
      nohotkeys="{{nohotkeys}}"
      defaultstreamtype="on-demand"
    >
      <slot name="media" slot="media"></slot>
      <slot name="poster" slot="poster"></slot>
      <slot name="centered-chrome" slot="centered-chrome"></slot>
      <media-error-dialog slot="dialog"></media-error-dialog>

      <!-- Controls Gradient -->
      <style>
        .media-gradient-bottom {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: calc(8 * var(--base));
          pointer-events: none;
        }

        .media-gradient-bottom::before {
          content: '';
          --gradient-steps: hsl(0 0% 0% / 0) 0%, hsl(0 0% 0% / 0.013) 8.1%, hsl(0 0% 0% / 0.049) 15.5%,
            hsl(0 0% 0% / 0.104) 22.5%, hsl(0 0% 0% / 0.175) 29%, hsl(0 0% 0% / 0.259) 35.3%, hsl(0 0% 0% / 0.352) 41.2%,
            hsl(0 0% 0% / 0.45) 47.1%, hsl(0 0% 0% / 0.55) 52.9%, hsl(0 0% 0% / 0.648) 58.8%, hsl(0 0% 0% / 0.741) 64.7%,
            hsl(0 0% 0% / 0.825) 71%, hsl(0 0% 0% / 0.896) 77.5%, hsl(0 0% 0% / 0.951) 84.5%, hsl(0 0% 0% / 0.987) 91.9%,
            hsl(0 0% 0%) 100%;

          position: absolute;
          inset: 0;
          opacity: 0.7;
          background: linear-gradient(to bottom, var(--gradient-steps));
        }
      </style>
      <div class="media-gradient-bottom"></div>

      <!-- Settings Menu -->
      <style>
        media-settings-menu {
          --media-menu-icon-height: 20px;
          --media-menu-item-icon-height: 20px;
          --media-settings-menu-min-width: calc(10 * var(--base));
          --media-menu-transform-in: translateY(0) scale(1);
          --media-menu-transform-out: translateY(20px) rotate(3deg) scale(1);
          padding-block: calc(0.15 * var(--base));
          margin-right: 10px;
          margin-bottom: 17px;
          border-radius: 8px;
          z-index: 2;
          user-select: none;
        }

        media-settings-menu-item,
        [role='menu']::part(menu-item) {
          --media-icon-color: var(--_primary-color);
          margin-inline: calc(0.45 * var(--base));
          height: calc(1.6 * var(--base));
          font-size: calc(0.7 * var(--base));
          font-weight: 400;
          padding: 0;
          padding-left: calc(0.4 * var(--base));
          padding-right: calc(0.1 * var(--base));
          border-radius: 6px;
          text-shadow: none;
        }

        [slot='submenu']::part(back button) {
          font-size: calc(0.7 * var(--base));
        }

        media-settings-menu-item:hover {
          --media-icon-color: #000;
          color: #000;
          background-color: #fff;
        }

        media-settings-menu-item:hover [slot='submenu']::part(menu-item),
        [slot='submenu']::part(back indicator) {
          --media-icon-color: var(--_primary-color);
        }

        media-settings-menu-item:hover [slot='submenu']::part(menu-item):hover {
          --media-icon-color: #000;
          color: #000;
          background-color: #fff;
        }

        media-settings-menu-item[submenusize='0'] {
          display: none;
        }

        /* Also hide if only 'Auto' is added. */
        .quality-settings[submenusize='1'] {
          display: none;
        }
      </style>
      <media-settings-menu hidden anchor="auto">
        <media-settings-menu-item>
          Playback Speed
          <media-playback-rate-menu slot="submenu" hidden>
            <div slot="title">Playback Speed</div>
          </media-playback-rate-menu>
        </media-settings-menu-item>
        <media-settings-menu-item class="quality-settings">
          Quality
          <media-rendition-menu slot="submenu" hidden>
            <div slot="title">Quality</div>
          </media-rendition-menu>
        </media-settings-menu-item>
        <media-settings-menu-item>
          Subtitles/CC
          <media-captions-menu slot="submenu" hidden>
            <div slot="title">Subtitles/CC</div>
          </media-captions-menu>
        </media-settings-menu-item>
      </media-settings-menu>

      <!-- Control Bar -->
      <style>
        media-control-bar {
          position: absolute;
          height: calc(2 * var(--base));
          line-height: calc(2 * var(--base));
          bottom: var(--base);
          left: var(--base);
          right: var(--base);
        }
      </style>
      <media-control-bar>
        <!-- Play/Pause -->
        <style>
          @keyframes bounce-scale-play {
            0% {
              transform: scale(0.75, 0.75);
            }
            50% {
              transform: scale(115%, 115%);
            }
            100% {
              transform: scale(1, 1);
            }
          }

          .media-button {
            border-radius: 25%;
            backdrop-filter: blur(10px) invert(15%) brightness(80%) opacity(0);
            -webkit-backdrop-filter: blur(10px) invert(15%) brightness(80%) opacity(0);
            transition: backdrop-filter 0.3s, -webkit-backdrop-filter 0.3s, box-shadow 0.3s;
          }

          .media-button:hover {
            /* background-color: rgba(0, 0, 0, 0.05); */
            box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 5px;
            /* hue-rotate(120deg) */
            backdrop-filter: blur(10px) invert(15%) brightness(80%) opacity(1);
            -webkit-backdrop-filter: blur(10px) invert(15%) brightness(80%) opacity(1);
            transition: backdrop-filter 0.3s, -webkit-backdrop-filter 0.3s;
          }

          media-play-button #icon-play {
            opacity: 0;
            transform-box: view-box;
            transform-origin: center center;
            transform: scale(0.5, 0.5);
            transition: all 0.5s;
          }

          media-play-button[mediapaused] #icon-play {
            opacity: 1;
            transform: scale(1, 1);
            animation: 0.35s bounce-scale-play ease-in-out;
          }

          @keyframes bounce-pause-left {
            0% {
              font-size: 10px;
            }
            50% {
              font-size: 3px;
            }
            100% {
              font-size: 4px;
            }
          }

          @keyframes bounce-pause-right {
            0% {
              font-size: 10px;
              transform: translateX(-8px);
            }
            50% {
              font-size: 3px;
              transform: translateX(1px);
            }
            100% {
              font-size: 4px;
              transform: translateX(0);
            }
          }

          media-play-button #pause-left,
          media-play-button #pause-right {
            /* Using font-size to animate height because using scale was resulting in unexpected positioning */
            font-size: 4px;
            opacity: 1;
            transform: translateX(0);
            transform-box: view-box;
          }

          media-play-button:not([mediapaused]) #pause-left {
            animation: 0.3s bounce-pause-left ease-out;
          }

          media-play-button:not([mediapaused]) #pause-right {
            animation: 0.3s bounce-pause-right ease-out;
          }

          media-play-button[mediapaused] #pause-left,
          media-play-button[mediapaused] #pause-right {
            opacity: 0;
            font-size: 10px;
          }

          media-play-button[mediapaused] #pause-right {
            transform-origin: right center;
            transform: translateX(-8px);
          }
        </style>
        <media-play-button mediapaused class="media-button">
          <svg slot="icon" viewBox="0 0 32 32">
            <!-- <use class="svg-shadow" xlink:href="#icon-play"></use> -->
            <g>
              <path
                id="icon-play"
                d="M20.7131 14.6976C21.7208 15.2735 21.7208 16.7265 20.7131 17.3024L12.7442 21.856C11.7442 22.4274 10.5 21.7054 10.5 20.5536L10.5 11.4464C10.5 10.2946 11.7442 9.57257 12.7442 10.144L20.7131 14.6976Z"
              />
            </g>
            <!-- <use class="svg-shadow" xlink:href="#icon-pause"></use> -->
            <g id="icon-pause">
              <rect id="pause-left" x="10.5" width="1em" y="10.5" height="11" rx="0.5" />
              <rect id="pause-right" x="17.5" width="1em" y="10.5" height="11" rx="0.5" />
            </g>
          </svg>
        </media-play-button>

        <!-- Volume/Mute -->
        <style>
          media-mute-button {
            position: relative;
          }

          media-mute-button .muted-path {
            transition: clip-path 0.2s ease-out;
          }

          media-mute-button #muted-path-2 {
            transition-delay: 0.2s;
          }

          media-mute-button .muted-path {
            clip-path: inset(0);
          }

          media-mute-button:not([mediavolumelevel='off']) #muted-path-1 {
            clip-path: inset(0 0 100% 0);
          }

          media-mute-button:not([mediavolumelevel='off']) #muted-path-2 {
            clip-path: inset(0 0 100% 0);
          }

          media-mute-button .muted-path {
            opacity: 0;
          }

          media-mute-button[mediavolumelevel='off'] .muted-path {
            opacity: 1;
          }

          media-mute-button .vol-path {
            opacity: 1;
            transition: opacity 0.4s;
          }

          media-mute-button[mediavolumelevel='off'] .vol-path {
            opacity: 0;
          }

          media-mute-button[mediavolumelevel='low'] #vol-high-path,
          media-mute-button[mediavolumelevel='medium'] #vol-high-path {
            opacity: 0;
          }

          media-volume-range {
            --media-range-track-background: rgba(255, 255, 255, 0.2);
            --media-range-thumb-opacity: 0;
          }

          @keyframes volume-in {
            0% {
              visibility: hidden;
              opacity: 0;
              transform: translateY(50%) rotate(1deg);
            }
            50% {
              visibility: visible;
              opacity: 1;
              transform: rotate(-2deg);
            }
            100% {
              visibility: visible;
              opacity: 1;
              transform: translateY(0) rotate(0deg);
            }
          }

          @keyframes volume-out {
            0% {
              visibility: visible;
              opacity: 1;
              transform: translateY(0) rotate(0deg);
            }
            50% {
              opacity: 1;
              transform: rotate(0deg);
            }
            100% {
              visibility: hidden;
              opacity: 0;
              transform: translateY(50%) rotate(1deg);
            }
          }

          .media-volume-range-wrapper {
            opacity: 0;
            visibility: hidden;

            position: absolute;
            top: -100%;
            left: calc(2 * var(--base));

            width: calc(10 * var(--base));
            height: calc(2.5 * var(--base));
            transform-origin: center left;
          }

          media-volume-range {
            /*
              Hide range and animation until mediavolume attribute is set.
              'visibility' didn't work, hovering over media-volume-range-wrapper
              caused it to show. Should require mute-button:hover.
            */
            opacity: 0;
            transition: opacity 0s 1s;

            width: calc(10 * var(--base));
            height: var(--base);
            padding: 0;
            border-radius: calc(0.25 * var(--base));
            overflow: hidden;
            background: rgba(0, 0, 0, 0.2);

            --media-range-bar-color: var(--media-accent-color);

            --media-range-padding-left: 0;
            --media-range-padding-right: 0;

            --media-range-track-width: calc(10 * var(--base));
            --media-range-track-height: var(--base);
            --media-range-track-border-radius: calc(0.25 * var(--base));
            --media-range-track-backdrop-filter: blur(10px) brightness(80%);

            /* This makes zero volume still show some of the bar.
               I can't make the bar have curved corners otherwise though. */
            --media-range-thumb-width: var(--base);
            --media-range-thumb-border-radius: calc(0.25 * var(--base));

            /* The Sutro design has a gradient like this, but not sure I like it */
            /* --media-range-thumb-box-shadow: 10px 0px 20px rgba(255, 255, 255, 0.5); */
          }

          media-volume-range[mediavolume] {
            opacity: 1;
          }

          [keyboardcontrol] media-volume-range:focus {
            /* TODO: This appears to be creating a think outline */
            outline: 1px solid rgba(27, 127, 204, 0.9);
          }

          media-mute-button:hover + .media-volume-range-wrapper,
          media-mute-button:focus + .media-volume-range-wrapper,
          media-mute-button:focus-within + .media-volume-range-wrapper,
          .media-volume-range-wrapper:hover,
          .media-volume-range-wrapper:focus,
          .media-volume-range-wrapper:focus-within {
            animation: 0.3s volume-in forwards ease-out;
          }

          .media-volume-range-wrapper:not(:hover, :focus-within) {
            animation: 0.3s volume-out ease-out;
          }

          /* When keyboard navigating the volume range and wrapper need to always be visible
            otherwise focus state can't land on it. This is ok when keyboard navigating because
            the hovering issues aren't a concern, unless you happen to be keyboard AND mouse navigating.
          */
          [keyboardcontrol] .media-volume-range-wrapper,
          [keyboardcontrol] .media-volume-range-wrapper:focus-within,
          [keyboardcontrol] .media-volume-range-wrapper:focus-within media-volume-range {
            visibility: visible;
          }
        </style>
        <media-mute-button class="media-button" notooltip>
          <use class="svg-shadow" xlink:href="#vol-paths"></use>
          <svg slot="icon" viewBox="0 0 32 32">
            <g id="vol-paths">
              <path
                id="speaker-path"
                d="M16.5 20.486v-8.972c0-1.537-2.037-2.08-2.802-.745l-1.026 1.79a2.5 2.5 0 0 1-.8.85l-1.194.78A1.5 1.5 0 0 0 10 15.446v1.11c0 .506.255.978.678 1.255l1.194.782a2.5 2.5 0 0 1 .8.849l1.026 1.79c.765 1.334 2.802.792 2.802-.745Z"
              />
              <path
                id="vol-low-path"
                class="vol-path"
                d="M18.5 18C19.6046 18 20.5 17.1046 20.5 16C20.5 14.8954 19.6046 14 18.5 14"
              />
              <path
                id="vol-high-path"
                class="vol-path"
                d="M18 21C20.7614 21 23 18.7614 23 16C23 13.2386 20.7614 11 18 11"
              />
              <path id="muted-path-1" class="muted-path" d="M23 18L19 14" />
              <path id="muted-path-2" class="muted-path" d="M23 14L19 18" />
            </g>
          </svg>
        </media-mute-button>
        <div class="media-volume-range-wrapper">
          <media-volume-range></media-volume-range>
        </div>

        <!-- Time Display -->
        <style>
          media-time-display {
            position: relative;
            padding: calc(0.5 * var(--base));
            font-size: calc(0.7 * var(--base));
            border-radius: calc(0.5 * var(--base));
          }

          media-controller[breakpointmd] media-time-display:not([showduration]) {
            display: none;
          }

          media-controller:not([breakpointmd]) media-time-display[showduration] {
            display: none;
          }
        </style>
        <media-time-display></media-time-display>
        <media-time-display showduration></media-time-display>

        <!-- Time Range / Progress Bar -->
        <style>
          media-time-range {
            height: calc(2 * var(--base));
            border-radius: calc(0.25 * var(--base));

            --media-range-track-backdrop-filter: invert(10%) blur(5px) brightness(110%);
            --media-range-track-background: rgba(255, 255, 255, 0.2);
            --media-range-track-pointer-background: rgba(255, 255, 255, 0.5);
            --media-range-track-border-radius: calc(0.25 * var(--base));

            --media-time-range-buffered-color: rgba(255, 255, 255, 0.4);
            --media-range-bar-color: var(--media-accent-color);

            --media-range-thumb-background: var(--media-accent-color);
            --media-range-thumb-transition: opacity 0.1s linear;
            --media-range-thumb-opacity: 0;

            --media-preview-thumbnail-border: calc(0.125 * var(--base)) solid #fff;
            --media-preview-thumbnail-border-radius: calc(0.5 * var(--base));
            --media-preview-thumbnail-min-width: calc(8 * var(--base));
            --media-preview-thumbnail-max-width: calc(10 * var(--base));
            --media-preview-thumbnail-min-height: calc(5 * var(--base));
            --media-preview-thumbnail-max-height: calc(7 * var(--base));
            --media-preview-box-margin: 0 0 -10px;
          }
          media-time-range:hover {
            --media-range-thumb-opacity: 1;
            --media-range-track-height: calc(0.25 * var(--base));
          }

          media-preview-thumbnail {
            margin-bottom: 5px;
          }

          media-preview-chapter-display {
            font-size: calc(0.6 * var(--base));
            padding-block: 0;
          }

          media-preview-time-display {
            font-size: calc(0.65 * var(--base));
            padding-top: 0;
          }
        </style>
        <media-time-range>
          <media-preview-thumbnail slot="preview"></media-preview-thumbnail>
          <media-preview-chapter-display slot="preview"></media-preview-chapter-display>
          <media-preview-time-display slot="preview"></media-preview-time-display>
        </media-time-range>

        <!-- Subtitles/CC Button -->
        <style>
          media-captions-button {
            position: relative;
          }

          media-controller:not([breakpointmd]) media-captions-button {
            display: none;
          }

          media-captions-button svg :is(path, rect) {
            stroke: none;
            fill: var(--_primary-color);
          }

          /* Disble the captions button when no subtitles are available */
          media-captions-button:not([mediasubtitleslist]) svg {
            opacity: 0.3;
          }

          media-captions-button #cc-underline {
            opacity: 1;
          }

          media-captions-button[mediasubtitleslist][aria-checked='true'] #cc-underline {
            opacity: 1;
          }

          media-captions-button #cc-underline {
            transition: clip-path 0.15s ease-out;
          }

          media-captions-button #cc-underline {
            clip-path: inset(0 100% 0 0);
          }

          media-captions-button[aria-checked='true'] #cc-underline {
            clip-path: inset(0 0 0 0);
          }
        </style>
        <media-captions-button class="media-button">
          <svg slot="icon" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#cc-icon"></use>
            <g id="cc-icon">
              <path
                class="cc-c"
                d="M15.6634 14.3574H14.5636C14.4985 14.0523 14.3847 13.7842 14.2221 13.5532C14.0624 13.3222 13.8673 13.1283 13.6367 12.9715C13.409 12.8118 13.1562 12.692 12.8783 12.6122C12.6004 12.5323 12.3107 12.4924 12.0091 12.4924C11.4592 12.4924 10.961 12.6264 10.5146 12.8945C10.0711 13.1625 9.71776 13.5575 9.45463 14.0794C9.19445 14.6012 9.06436 15.2414 9.06436 16C9.06436 16.7586 9.19445 17.3988 9.45463 17.9206C9.71776 18.4425 10.0711 18.8375 10.5146 19.1055C10.961 19.3736 11.4592 19.5076 12.0091 19.5076C12.3107 19.5076 12.6004 19.4677 12.8783 19.3878C13.1562 19.308 13.409 19.1896 13.6367 19.0328C13.8673 18.8731 14.0624 18.6778 14.2221 18.4468C14.3847 18.2129 14.4985 17.9449 14.5636 17.6426H15.6634C15.5806 18.0903 15.4298 18.491 15.2111 18.8446C14.9923 19.1982 14.7203 19.499 14.3951 19.7471C14.0698 19.9924 13.7047 20.1792 13.2996 20.3075C12.8976 20.4358 12.4674 20.5 12.0091 20.5C11.2345 20.5 10.5456 20.3175 9.94246 19.9525C9.33932 19.5875 8.8648 19.0684 8.51888 18.3954C8.17296 17.7224 8 16.924 8 16C8 15.076 8.17296 14.2776 8.51888 13.6046C8.8648 12.9316 9.33932 12.4125 9.94246 12.0475C10.5456 11.6825 11.2345 11.5 12.0091 11.5C12.4674 11.5 12.8976 11.5642 13.2996 11.6925C13.7047 11.8208 14.0698 12.009 14.3951 12.2571C14.7203 12.5024 14.9923 12.8018 15.2111 13.1554C15.4298 13.5062 15.5806 13.9068 15.6634 14.3574Z"
              />
              <path
                class="cc-c"
                d="M24 14.3574H22.9002C22.8351 14.0523 22.7213 13.7842 22.5587 13.5532C22.399 13.3222 22.2039 13.1283 21.9733 12.9715C21.7456 12.8118 21.4928 12.692 21.2149 12.6122C20.937 12.5323 20.6473 12.4924 20.3457 12.4924C19.7958 12.4924 19.2976 12.6264 18.8511 12.8945C18.4077 13.1625 18.0543 13.5575 17.7912 14.0794C17.531 14.6012 17.4009 15.2414 17.4009 16C17.4009 16.7586 17.531 17.3988 17.7912 17.9206C18.0543 18.4425 18.4077 18.8375 18.8511 19.1055C19.2976 19.3736 19.7958 19.5076 20.3457 19.5076C20.6473 19.5076 20.937 19.4677 21.2149 19.3878C21.4928 19.308 21.7456 19.1896 21.9733 19.0328C22.2039 18.8731 22.399 18.6778 22.5587 18.4468C22.7213 18.2129 22.8351 17.9449 22.9002 17.6426H24C23.9172 18.0903 23.7664 18.491 23.5476 18.8446C23.3289 19.1982 23.0569 19.499 22.7316 19.7471C22.4064 19.9924 22.0413 20.1792 21.6362 20.3075C21.2341 20.4358 20.804 20.5 20.3457 20.5C19.5711 20.5 18.8822 20.3175 18.279 19.9525C17.6759 19.5875 17.2014 19.0684 16.8555 18.3954C16.5095 17.7224 16.3366 16.924 16.3366 16C16.3366 15.076 16.5095 14.2776 16.8555 13.6046C17.2014 12.9316 17.6759 12.4125 18.279 12.0475C18.8822 11.6825 19.5711 11.5 20.3457 11.5C20.804 11.5 21.2341 11.5642 21.6362 11.6925C22.0413 11.8208 22.4064 12.009 22.7316 12.2571C23.0569 12.5024 23.3289 12.8018 23.5476 13.1554C23.7664 13.5062 23.9172 13.9068 24 14.3574Z"
              />
              <rect id="cc-underline" x="8" y="23" width="16" height="1" rx="0.5" />
            </g>
          </svg>
        </media-captions-button>

        <!-- Settings Menu Button -->
        <style>
          media-settings-menu-button svg {
            transition: transform 0.1s cubic-bezier(0.4, 0, 1, 1);
            transform: rotateZ(0deg);
          }
          media-settings-menu-button[aria-expanded='true'] svg {
            transform: rotateZ(30deg);
          }
        </style>
        <media-settings-menu-button class="media-button">
          <svg slot="icon" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#settings-icon"></use>
            <g id="settings-icon">
              <path
                d="M16 18C17.1046 18 18 17.1046 18 16C18 14.8954 17.1046 14 16 14C14.8954 14 14 14.8954 14 16C14 17.1046 14.8954 18 16 18Z"
              />
              <path
                d="M21.0176 13.0362L20.9715 12.9531C20.8445 12.7239 20.7797 12.4629 20.784 12.1982L20.8049 10.8997C20.8092 10.6343 20.675 10.3874 20.4545 10.2549L18.5385 9.10362C18.3186 8.97143 18.0472 8.9738 17.8293 9.10981L16.7658 9.77382C16.5485 9.90953 16.2999 9.98121 16.0465 9.98121H15.9543C15.7004 9.98121 15.4513 9.90922 15.2336 9.77295L14.1652 9.10413C13.9467 8.96728 13.674 8.96518 13.4535 9.09864L11.5436 10.2545C11.3242 10.3873 11.1908 10.6336 11.1951 10.8981L11.216 12.1982C11.2203 12.4629 11.1555 12.7239 11.0285 12.9531L10.9831 13.0351C10.856 13.2645 10.6715 13.4535 10.4493 13.5819L9.36075 14.2109C9.13763 14.3398 8.99942 14.5851 9 14.8511L9.00501 17.152C9.00559 17.4163 9.1432 17.6597 9.36476 17.7883L10.4481 18.4167C10.671 18.546 10.8559 18.7364 10.9826 18.9673L11.0313 19.0559C11.1565 19.284 11.2203 19.5431 11.2161 19.8059L11.1951 21.1003C11.1908 21.3657 11.325 21.6126 11.5456 21.7452L13.4615 22.8964C13.6814 23.0286 13.9528 23.0262 14.1707 22.8902L15.2342 22.2262C15.4515 22.0905 15.7001 22.0188 15.9535 22.0188H16.0457C16.2996 22.0188 16.5487 22.0908 16.7664 22.227L17.8348 22.8959C18.0534 23.0327 18.326 23.0348 18.5465 22.9014L20.4564 21.7455C20.6758 21.6127 20.8092 21.3664 20.8049 21.1019L20.784 19.8018C20.7797 19.5371 20.8445 19.2761 20.9715 19.0469L21.0169 18.9649C21.144 18.7355 21.3285 18.5465 21.5507 18.4181L22.6393 17.7891C22.8624 17.6602 23.0006 17.4149 23 17.1489L22.995 14.848C22.9944 14.5837 22.8568 14.3403 22.6352 14.2117L21.5493 13.5818C21.328 13.4534 21.1442 13.2649 21.0176 13.0362Z"
              />
            </g>
          </svg>
        </media-settings-menu-button>

        <!-- PIP/Mini Player Button -->
        <style>
          media-controller:not([breakpointmd]) media-pip-button {
            display: none;
          }
        </style>
        <media-pip-button class="media-button">
          <svg slot="icon" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#pip-icon"></use>
            <g id="pip-icon">
              <path
                d="M12 22H9.77778C9.34822 22 9 21.6162 9 21.1429V10.8571C9 10.3838 9.34822 10 9.77778 10L22.2222 10C22.6518 10 23 10.3838 23 10.8571V12.5714"
              />
              <path
                d="M15 21.5714V16.4286C15 16.1919 15.199 16 15.4444 16H22.5556C22.801 16 23 16.1919 23 16.4286V17V21.5714C23 21.8081 22.801 22 22.5556 22H20.3333H17.6667H15.4444C15.199 22 15 21.8081 15 21.5714Z"
              />
            </g>
          </svg>
        </media-pip-button>

        <!-- Airplay Button -->
        <media-airplay-button class="media-button">
          <svg viewBox="0 0 32 32" aria-hidden="true" slot="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.5 20h1.722c.43 0 .778-.32.778-.714v-8.572c0-.394-.348-.714-.778-.714H9.778c-.43 0-.778.32-.778.714v1.429"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.5 20H9.778c-.43 0-.778-.32-.778-.714v-8.572c0-.394.348-.714.778-.714h12.444c.43 0 .778.32.778.714v1.429"/>
            <path stroke-linejoin="round" d="m16 19 3.464 3.75h-6.928L16 19Z"/>
          </svg>
        </media-airplay-button>

        <!-- Cast Button -->
        <media-cast-button class="media-button">
          <svg slot="icon" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#cast-icon"></use>
            <g id="cast-icon">
              <path
                d="M18.5 21.833h4.167c.46 0 .833-.373.833-.833V11a.833.833 0 0 0-.833-.833H9.333A.833.833 0 0 0 8.5 11v1.111m0 8.056c.92 0 1.667.746 1.667 1.666M8.5 17.667a4.167 4.167 0 0 1 4.167 4.166"
              />
              <path d="M8.5 15.167a6.667 6.667 0 0 1 6.667 6.666" />
            </g>
          </svg>
        </media-cast-button>

        <!-- Fullscreen Button -->
        <style>
          /* Having trouble getting @property to work in the shadow dom
             to clean this up. Like https://codepen.io/luwes/pen/oNRyZyx */

          media-fullscreen-button .fs-arrow {
            translate: 0% 0%;
          }
          media-fullscreen-button:hover .fs-arrow {
            animation: 0.35s up-left-bounce cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          media-fullscreen-button:hover #fs-enter-top,
          media-fullscreen-button:hover #fs-exit-bottom {
            animation-name: up-right-bounce;
          }

          media-fullscreen-button:hover #fs-enter-bottom,
          media-fullscreen-button:hover #fs-exit-top {
            animation-name: down-left-bounce;
          }

          @keyframes up-left-bounce {
            0% {
              translate: 0 0;
            }
            50% {
              translate: -4% -4%;
            }
          }
          @keyframes up-right-bounce {
            0% {
              translate: 0 0;
            }
            50% {
              translate: 4% -4%;
            }
          }
          @keyframes down-left-bounce {
            0% {
              translate: 0 0;
            }
            50% {
              translate: -4% 4%;
            }
          }
          @keyframes down-right-bounce {
            0% {
              translate: 0 0;
            }
            50% {
              translate: 4% 4%;
            }
          }
        </style>
        <media-fullscreen-button class="media-button">
          <svg slot="enter" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#fs-enter-paths"></use>
            <g id="fs-enter-paths">
              <g id="fs-enter-top" class="fs-arrow">
                <path d="M18 10H22V14" />
                <path d="M22 10L18 14" />
              </g>
              <g id="fs-enter-bottom" class="fs-arrow">
                <path d="M14 22L10 22V18" />
                <path d="M10 22L14 18" />
              </g>
            </g>
          </svg>
          <svg slot="exit" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#fs-exit-paths"></use>
            <g id="fs-exit-paths">
              <g id="fs-exit-top" class="fs-arrow">
                <path d="M22 14H18V10" />
                <path d="M22 10L18 14" />
              </g>
              <g id="fs-exit-bottom" class="fs-arrow">
                <path d="M10 18L14 18V22" />
                <path d="M14 18L10 22" />
              </g>
            </g>
          </svg>
        </media-fullscreen-button>
      </media-control-bar>
    </media-controller>

  `);class np extends ss{static template=gr}d.customElements&&!d.customElements.get("media-theme-sutro")&&d.customElements.define("media-theme-sutro",np);var hu=parseInt(zi.version)>=19,Sl={className:"class",classname:"class",htmlFor:"for",crossOrigin:"crossorigin",viewBox:"viewBox",playsInline:"playsinline",autoPlay:"autoplay",playbackRate:"playbackrate"},sp=t=>t==null,rp=(t,e)=>sp(e)?!1:t in e,op=t=>t.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`),lp=(t,e)=>{if(!(!hu&&typeof e=="boolean"&&!e)){if(rp(t,Sl))return Sl[t];if(typeof e<"u")return/[A-Z]/.test(t)?op(t):t}},dp=(t,e)=>!hu&&typeof t=="boolean"?"":t,up=(t={})=>{let{ref:e,...i}=t;return Object.entries(i).reduce((a,[n,s])=>{let o=lp(n,s);if(!o)return a;let l=dp(s);return a[o]=l,a},{})};function Il(t,e){if(typeof t=="function")return t(e);t!=null&&(t.current=e)}function cp(...t){return e=>{let i=!1,a=t.map(n=>{let s=Il(n,e);return!i&&typeof s=="function"&&(i=!0),s});if(i)return()=>{for(let n=0;n<a.length;n++){let s=a[n];typeof s=="function"?s():Il(t[n],null)}}}}function hp(...t){return Qi.useCallback(cp(...t),t)}var mp=Object.prototype.hasOwnProperty,pp=(t,e)=>{if(Object.is(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;if(Array.isArray(t))return!Array.isArray(e)||t.length!==e.length?!1:t.some((n,s)=>e[s]===n);let i=Object.keys(t),a=Object.keys(e);if(i.length!==a.length)return!1;for(let n=0;n<i.length;n++)if(!mp.call(e,i[n])||!Object.is(t[i[n]],e[i[n]]))return!1;return!0},mu=(t,e,i)=>!pp(e,t[i]),vp=(t,e,i)=>{t[i]=e},Ep=(t,e,i,a=vp,n=mu)=>Qi.useEffect(()=>{let s=i?.current;s&&n(s,e,t)&&a(s,e,t)},[i?.current,e]),be=Ep,fp=()=>{try{return"3.11.8"}catch{}return"UNKNOWN"},gp=fp(),bp=()=>gp,$=(t,e,i)=>Qi.useEffect(()=>{let a=e?.current;if(!a||!i)return;let n=t,s=i;return a.addEventListener(n,s),()=>{a.removeEventListener(n,s)}},[e?.current,i,t]),_p=zi.forwardRef(({children:t,...e},i)=>zi.createElement("mux-player",{suppressHydrationWarning:!0,...up(e),ref:i},t)),Ap=(t,e)=>{let{onAbort:i,onCanPlay:a,onCanPlayThrough:n,onEmptied:s,onLoadStart:o,onLoadedData:l,onLoadedMetadata:u,onProgress:c,onDurationChange:f,onVolumeChange:g,onRateChange:h,onResize:p,onWaiting:M,onPlay:A,onPlaying:_,onTimeUpdate:L,onPause:J,onSeeking:re,onSeeked:rt,onStalled:Ve,onSuspend:ca,onEnded:ha,onError:ma,onCuePointChange:pa,onChapterChange:va,metadata:Ea,tokens:fa,paused:ga,playbackId:ba,playbackRates:_a,currentTime:Aa,themeProps:os,extraSourceParams:Ge,castCustomData:Ta,_hlsConfig:ya,...ka}=e;return be("tokens",fa,t),be("playbackId",ba,t),be("playbackRates",_a,t),be("metadata",Ea,t),be("extraSourceParams",Ge,t),be("_hlsConfig",ya,t),be("themeProps",os,t),be("castCustomData",Ta,t),be("paused",ga,t,(ce,Ee)=>{Ee!=null&&(Ee?ce.pause():ce.play())},(ce,Ee,Sa)=>ce.hasAttribute("autoplay")&&!ce.hasPlayed?!1:mu(ce,Ee,Sa)),be("currentTime",Aa,t,(ce,Ee)=>{Ee!=null&&(ce.currentTime=Ee)}),$("abort",t,i),$("canplay",t,a),$("canplaythrough",t,n),$("emptied",t,s),$("loadstart",t,o),$("loadeddata",t,l),$("loadedmetadata",t,u),$("progress",t,c),$("durationchange",t,f),$("volumechange",t,g),$("ratechange",t,h),$("resize",t,p),$("waiting",t,M),$("play",t,A),$("playing",t,_),$("timeupdate",t,L),$("pause",t,J),$("seeking",t,re),$("seeked",t,rt),$("stalled",t,Ve),$("suspend",t,ca),$("ended",t,ha),$("error",t,ma),$("cuepointchange",t,pa),$("chapterchange",t,va),[ka]},Tp=bp(),yp="mux-player-react",kp=zi.forwardRef((t,e)=>{var i;let a=Qi.useRef(null),n=hp(a,e),[s]=Ap(a,t),[o]=Qi.useState((i=t.playerInitTime)!=null?i:yu());return zi.createElement(_p,{ref:n,defaultHiddenCaptions:t.defaultHiddenCaptions,playerSoftwareName:yp,playerSoftwareVersion:Tp,playerInitTime:o,...s})}),Sp=kp;function Op(t){const e=Tu.c(5),{customDomain:i,playbackId:a,tokens:n}=t;let s;e[0]===Symbol.for("react.memo_cache_sentinel")?(s={position:"absolute",inset:0},e[0]=s):s=e[0];let o;return e[1]!==i||e[2]!==a||e[3]!==n?(o=Au.jsx(Sp,{customDomain:i,theme:"sutro",playbackId:a,tokens:n,autoPlay:!1,loop:!1,style:s}),e[1]=i,e[2]=a,e[3]=n,e[4]=o):o=e[4],o}export{Op as VideoPlayer};
