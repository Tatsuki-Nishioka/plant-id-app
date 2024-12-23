import{l as j,f as E,r as g,m as x,o as _,c as S,a as e,n as K,i as o,t as C,b as T,j as q,F as M,g as F,_ as I,p as $,d as L,w as Y,h as Q,T as H,q as W,s as G,v as U,x as D}from"./Rs97s6Yf.js";import{_ as O}from"./B8738V2L.js";import{R as X}from"./b2LC2lA4.js";function b(){const h=j("answers",()=>new Map);return{answers:h,setAnswer:(s,i)=>{h.value.set(s,i)},getAnswer:s=>h.value.get(s),skipRange:(s,i)=>{s.forEach(c=>{!i.some(a=>a.key===c)&&!h.value.has(c)&&h.value.set(c,null)}),i.forEach(c=>{h.value.set(c.key,c.value)})},resetAnswers:()=>{h.value.clear()}}}const Z={class:"progress-bar"},ee={class:"progress-info"},te={class:"left"},se={class:"right"},ae=E({__name:"ProgressBar",props:{currentStep:{},totalSteps:{},filteredCount:{}},setup(h){const f=h,u=g(!1),m=g(""),v=g([]),s=x(()=>Math.min(f.currentStep+1,f.totalSteps)),i=x(()=>f.currentStep/f.totalSteps*100),c=()=>{v.value=[],u.value=!0,m.value="現在の回答",b().answers.value.forEach((a,p)=>{let k="Unknown";a===!0?k="Yes":a===!1&&(k="No");const w={key:p,title:F().characterSet.value[p].characterJpn,answer:k};v.value.push(w)})};return(a,p)=>{const k=O;return _(),S(M,null,[e("div",{class:"progress-bar-container",onClick:c},[e("div",Z,[e("div",{class:"progress",style:K({width:o(i)+"%"})},null,4)]),e("div",ee,[e("div",te,[e("span",null,"該当分類群: "+C(a.filteredCount),1)]),e("div",se,[e("span",null,"ステップ: "+C(o(s))+" / "+C(a.totalSteps),1),p[1]||(p[1]=e("span",{class:"info-icon"},"ⓘ",-1))])])]),T(k,{"model-value":o(u),"onUpdate:modelValue":p[0]||(p[0]=w=>q(u)?u.value=w:null),title:o(m),content:o(v)},null,8,["model-value","title","content"])],64)}}}),ne=I(ae,[["__scopeId","data-v-86bb9c64"]]),le={class:"filter-panel"},oe={class:"category-container"},re={class:"category"},ue={class:"step-count"},ie={class:"question-container"},ce={class:"question"},ve={class:"options"},pe=["onClick"],de={class:"icon"},ge={class:"label"},fe=E({__name:"FilterPanel",props:{category:{},question:{},stepCount:{},firstCategory:{}},emits:["select","skip","show-results","prev","next"],setup(h,{emit:f}){const u=h,m=f,v=g(null),s=g([]),i=g(!0),c=g(u.firstCategory),a=g(!1),p=g(""),k=g(""),w=[{label:"Yes",value:!0,icon:"✔️"},{label:"No",value:!1,icon:"❌"},{label:"Unknown",value:null,icon:"❔"}];if(b().answers.value.size>0){const n=b().getAnswer(u.question.key);n!==void 0&&(v.value={key:u.question.key,value:n,category:u.category})}const A=n=>{var t;a.value=!0,p.value=n.key+". "+n.text,k.value=((t=F().characterSet.value[n.key])==null?void 0:t.characterDetailJpn)??"詳細情報がありません"},R=n=>{v.value={key:u.question.key,value:n,category:u.category},s.value.push(v.value),m("select",v.value)},V=()=>{m("skip",s.value)},B=()=>{m("show-results")},P=()=>{m("prev")},N=()=>{m("next")};return $(()=>i.value,n=>{n&&(s.value=[])}),$(()=>u.question,n=>{const t=b().getAnswer(n.key);t!==void 0?v.value={key:n.key,value:t,category:u.category}:v.value=null}),$([()=>u.category,()=>u.question],([n])=>{n!==c.value?(i.value=!0,s.value=[],c.value=n):i.value=!1}),(n,t)=>{const l=O;return _(),S(M,null,[e("div",le,[e("div",oe,[e("h2",re,[L(C(n.category)+" ",1),t[2]||(t[2]=e("br",null,null,-1)),e("span",ue,"（"+C(n.stepCount)+" ステップ）",1)]),T(H,{name:"fade",mode:"out-in"},{default:Y(()=>[(_(),S("div",{key:n.question.key,class:"question-nav-container"},[e("button",{class:"nav-button prev",onClick:P},t[3]||(t[3]=[e("span",{class:"nav-button-text"},"▲",-1)])),e("div",ie,[e("div",{class:"question-info-container",onClick:t[0]||(t[0]=r=>A(n.question))},[e("h3",ce,C(n.question.text),1),t[4]||(t[4]=e("span",{class:"question-info"},"ⓘ",-1))]),e("div",ve,[(_(),S(M,null,Q(w,r=>{var y;return e("button",{key:r.label,class:W(["option-card",{selected:((y=o(v))==null?void 0:y.value)===r.value}]),onClick:d=>R(r.value)},[e("span",de,C(r.icon),1),e("span",ge,C(r.label),1)],10,pe)}),64))])]),e("button",{class:"nav-button next",onClick:N},t[5]||(t[5]=[e("span",{class:"nav-button-text"},"▲",-1)]))]))]),_:1}),e("button",{class:"skip-button",onClick:V},"カテゴリをスキップ"),e("button",{class:"result-button",onClick:B},"結果を見る")])]),T(l,{"model-value":o(a),"onUpdate:modelValue":t[1]||(t[1]=r=>q(a)?a.value=r:null),title:o(p),content:o(k)},null,8,["model-value","title","content"])],64)}}}),ye=I(fe,[["__scopeId","data-v-78ae5e53"]]),he={key:1},me={class:"results-header"},ke={class:"tabs"},we=E({__name:"characterSearch",setup(h){const f=F();f.loadPlantData();const u=f.characterSet,m=f.categorySet,v=m.value[1].categoryJpn,s=g(0),i=g([]),c=g(new Map),a=g("all");Object.entries(u.value).forEach(([t,l])=>{const r=m.value[l.categoryId].categoryJpn,y={category:r,key:t,text:l.characterJpn},d=c.value.get(r)??[];d.push(y),c.value.set(r,d),i.value.push(y)});const p=x(()=>i.value[s.value].category),k=x(()=>{var t;return((t=c.value.get(p.value))==null?void 0:t.length)||0}),w=x(()=>{const t=[],l=[];b().answers.value.forEach((J,z)=>{J===!0?t.push(z):J===!1&&l.push(z)});const r=f.filterHigherTaxa(t),y=f.filterLowerTaxa(t,l),d=r.concat(y);return{higherTaxa:r,lowerTaxa:y,allTaxa:d}}),A=x(()=>a.value==="all"?w.value.allTaxa:a.value==="higher"?w.value.higherTaxa:w.value.lowerTaxa);$(()=>s.value>=i.value.length,t=>{t||(a.value="all")});const R=t=>{b().setAnswer(t.key,t.value),s.value++},V=t=>{var r;const l=((r=c.value.get(p.value))==null?void 0:r.map(y=>y.key))??[];b().skipRange(l,t),s.value=b().answers.value.size},B=()=>{s.value=i.value.length},P=()=>{s.value=0,b().resetAnswers()},N=()=>{s.value>0&&s.value--},n=()=>{s.value<i.value.length-1&&s.value++};return(t,l)=>{var r,y;return _(),S("div",null,[T(ne,{"current-step":o(s),"total-steps":(r=o(i))==null?void 0:r.length,"filtered-count":o(A).length},null,8,["current-step","total-steps","filtered-count"]),o(s)<((y=o(i))==null?void 0:y.length)?(_(),G(ye,{key:0,category:o(p),"first-category":o(v),"step-count":o(k),question:o(i)[o(s)],onSelect:R,onPrev:N,onNext:n,onSkip:V,onShowResults:B},null,8,["category","first-category","step-count","question"])):(_(),S("div",he,[e("div",me,[e("div",ke,[U(e("input",{id:"radio-1","onUpdate:modelValue":l[0]||(l[0]=d=>q(a)?a.value=d:null),type:"radio",value:"all"},null,512),[[D,o(a)]]),l[3]||(l[3]=e("label",{class:"tab",for:"radio-1"},"すべて",-1)),U(e("input",{id:"radio-2","onUpdate:modelValue":l[1]||(l[1]=d=>q(a)?a.value=d:null),type:"radio",value:"higher"},null,512),[[D,o(a)]]),l[4]||(l[4]=e("label",{class:"tab",for:"radio-2"},"科～属",-1)),U(e("input",{id:"radio-3","onUpdate:modelValue":l[2]||(l[2]=d=>q(a)?a.value=d:null),type:"radio",value:"lower"},null,512),[[D,o(a)]]),l[5]||(l[5]=e("label",{class:"tab",for:"radio-3"},"種",-1)),l[6]||(l[6]=e("span",{class:"glider"},null,-1))]),e("button",{class:"reset-button",onClick:P},"もう一度検索する")]),(_(!0),S(M,null,Q(o(A),d=>(_(),S("div",{key:d.scientificName},[T(X,{"character-set":o(u),plant:d},null,8,["character-set","plant"])]))),128))]))])}}}),Se=I(we,[["__scopeId","data-v-60187d4e"]]);export{Se as default};
