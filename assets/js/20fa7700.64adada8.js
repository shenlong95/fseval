"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[649],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},f=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),f=p(n),m=i,d=f["".concat(s,".").concat(m)]||f[m]||u[m]||r;return n?a.createElement(d,o(o({ref:t},c),{},{components:n})):a.createElement(d,o({ref:t},c))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=f;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var p=2;p<r;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}f.displayName="MDXCreateElement"},4441:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return c},default:function(){return f}});var a=n(7462),i=n(3366),r=(n(7294),n(3905)),o=["components"],l={sidebar_position:2},s="The pipeline",p={unversionedId:"the-pipeline",id:"the-pipeline",title:"The pipeline",description:"fseval executes a predefined number of steps to benchmark your Feature Selector or Feature Ranker.",source:"@site/docs/the-pipeline.md",sourceDirName:".",slug:"/the-pipeline",permalink:"/fseval/docs/the-pipeline",editUrl:"https://github.com/dunnkers/fseval/tree/website/docs/the-pipeline.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Quick start",permalink:"/fseval/docs/quick-start"},next:{title:"fseval.main",permalink:"/fseval/docs/main"}},c=[],u={toc:c};function f(e){var t=e.components,l=(0,i.Z)(e,o);return(0,r.kt)("wrapper",(0,a.Z)({},u,l,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"the-pipeline"},"The pipeline"),(0,r.kt)("p",null,"fseval executes a predefined number of steps to benchmark your Feature Selector or Feature Ranker."),(0,r.kt)("p",null,"See the schematic illustration below:"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Pipeline main architecture",src:n(772).Z})),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"First, the ",(0,r.kt)("strong",{parentName:"li"},"config")," is loaded. The config is at all times a ",(0,r.kt)("a",{parentName:"li",href:"../config/PipelineConfig"},(0,r.kt)("inlineCode",{parentName:"a"},"PipelineConfig"))," object."),(0,r.kt)("li",{parentName:"ol"},"Second, a ",(0,r.kt)("strong",{parentName:"li"},"dataset")," is loaded, like defined in the ",(0,r.kt)("a",{parentName:"li",href:"../config/DatasetConfig"},(0,r.kt)("inlineCode",{parentName:"a"},"DatasetConfig"))," object."),(0,r.kt)("li",{parentName:"ol"},"Third, a ",(0,r.kt)("strong",{parentName:"li"},"cross validation")," split is made. The split is done as defined in the ",(0,r.kt)("a",{parentName:"li",href:"../config/CrossValidatorConfig"},(0,r.kt)("inlineCode",{parentName:"a"},"CrossValidatorConfig")),"."),(0,r.kt)("li",{parentName:"ol"},"Fourth, the pipeline is ",(0,r.kt)("strong",{parentName:"li"},"fit")," using the ",(0,r.kt)("em",{parentName:"li"},"training")," set."),(0,r.kt)("li",{parentName:"ol"},"Lastly, the pipeline is ",(0,r.kt)("strong",{parentName:"li"},"scored")," using the ",(0,r.kt)("em",{parentName:"li"},"test")," set.")),(0,r.kt)("p",null,"To get a better idea of what is happening in the pipeline, we can take a closer look:"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Pipeline zoomed",src:n(2609).Z})),(0,r.kt)("p",null,"In the pipeline, the following steps are performed:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"The data is (optionally) ",(0,r.kt)("strong",{parentName:"li"},"resampled"),". This is useful, for example, to do a ",(0,r.kt)("a",{parentName:"li",href:"https://en.wikipedia.org/wiki/Bootstrapping_(statistics)"},"bootstrap"),". Such, the stability of an algorithm can be determined. The resampling is configured using the ",(0,r.kt)("a",{parentName:"li",href:"../config/ResampleConfig"},(0,r.kt)("inlineCode",{parentName:"a"},"ResampleConfig")),"."),(0,r.kt)("li",{parentName:"ol"},"A Feature ",(0,r.kt)("strong",{parentName:"li"},"Ranker")," is fit. Any Feauture Selector or Feature Ranker is defined in the ",(0,r.kt)("a",{parentName:"li",href:"../config/EstimatorConfig"},(0,r.kt)("inlineCode",{parentName:"a"},"EstimatorConfig")),"."),(0,r.kt)("li",{parentName:"ol"},"According to the ",(0,r.kt)("inlineCode",{parentName:"li"},"all_features_to_select")," parameter in the ",(0,r.kt)("a",{parentName:"li",href:"../config/PipelineConfig"},(0,r.kt)("inlineCode",{parentName:"a"},"PipelineConfig")),", various feature subsets are ",(0,r.kt)("strong",{parentName:"li"},"validated"),". By default, at most 50 subsets are validated using another estimator. First, the validation estimator is fit on a subset containing only the highest ranked feature, then only the two highest ranked features, etcetera."),(0,r.kt)("li",{parentName:"ol"},"When the ranker was fit on the dataset, and the validation estimator was fit on all the feature subsets, the pipeline is ",(0,r.kt)("strong",{parentName:"li"},"scored"),". This means the ranker fitting times and the validation scores are aggregated wherever applicable, and stored into tables according to the enabled ",(0,r.kt)("a",{parentName:"li",href:"../config/callbacks"},"Callbacks"),".")))}f.isMDXComponent=!0},772:function(e,t,n){t.Z=n.p+"assets/images/schematic-pipeline-main-architecture-3a1ba0a706ad59f26608201fcd38d833.svg"},2609:function(e,t,n){t.Z=n.p+"assets/images/schematic-pipeline-zoomed-a2c09b1737ca6085cc5e4413897bcb7a.svg"}}]);