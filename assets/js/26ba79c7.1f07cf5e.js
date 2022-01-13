"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1086],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return d}});var r=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=r.createContext({}),c=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},f=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),f=c(t),d=i,g=f["".concat(s,".").concat(d)]||f[d]||u[d]||o;return t?r.createElement(g,a(a({ref:n},p),{},{components:t})):r.createElement(g,a({ref:n},p))}));function d(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,a=new Array(o);a[0]=f;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,a[1]=l;for(var c=2;c<o;c++)a[c]=t[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}f.displayName="MDXCreateElement"},7718:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return p},default:function(){return f}});var r=t(7462),i=t(3366),o=(t(7294),t(3905)),a=["components"],l={sidebar_position:0},s="How to configure experiments",c={unversionedId:"configuring-experiments/how-to",id:"configuring-experiments/how-to",title:"How to configure experiments",description:"All the pipeline needs to run is a well-defined configuration. All classes are automatically instantiated, i.e. everything that has target attributes. The requirement is that whatever is passed into run_pipeline is a PipelineConfig object.",source:"@site/docs/configuring-experiments/how-to.md",sourceDirName:"configuring-experiments",slug:"/configuring-experiments/how-to",permalink:"/docs/configuring-experiments/how-to",editUrl:"https://github.com/dunnkers/fseval/tree/website/docs/configuring-experiments/how-to.md",tags:[],version:"current",sidebarPosition:0,frontMatter:{sidebar_position:0},sidebar:"tutorialSidebar",previous:{title:"The pipeline",permalink:"/docs/the-pipeline"},next:{title:"Cross Validation",permalink:"/docs/configuring-experiments/cv"}},p=[{value:"Using YAML files",id:"using-yaml-files",children:[],level:2}],u={toc:p};function f(e){var n=e.components,t=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"how-to-configure-experiments"},"How to configure experiments"),(0,o.kt)("p",null,"All the pipeline needs to run is a well-defined configuration. All classes are automatically instantiated, i.e. everything that has ",(0,o.kt)("inlineCode",{parentName:"p"},"_target_")," attributes. The requirement is that whatever is passed into ",(0,o.kt)("a",{parentName:"p",href:"/docs/running-experiments/running-first-experiment"},(0,o.kt)("inlineCode",{parentName:"a"},"run_pipeline"))," is a ",(0,o.kt)("inlineCode",{parentName:"p"},"PipelineConfig")," object."),(0,o.kt)("p",null,"The complete pipeline configuration is as follows:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-python"},'@dataclass\nclass PipelineConfig:\n    defaults: List[Any] = field(\n        default_factory=lambda: [\n            "_self_",\n            {"dataset": MISSING},\n            {"ranker": MISSING},\n            {"validator": MISSING},\n            {"cv": "kfold"},\n            {"storage": "local"},\n            {"resample": "shuffle"},\n            {"override hydra/job_logging": "colorlog"},\n            {"override hydra/hydra_logging": "colorlog"},\n        ]\n    )\n    _target_: str = "fseval.pipelines.rank_and_validate.BootstrappedRankAndValidate"\n    pipeline: str = "rank-and-validate"\n    dataset: DatasetConfig = MISSING\n    cv: CrossValidatorConfig = MISSING\n    storage: StorageConfig = MISSING\n    resample: ResampleConfig = MISSING\n    ranker: EstimatorConfig = MISSING\n    validator: EstimatorConfig = MISSING\n    callbacks: Dict[str, Any] = field(\n        default_factory=lambda: {\n            "_target_": "fseval.pipelines._callback_collection.CallbackCollection"\n        }\n    )\n    n_bootstraps: int = 1\n    n_jobs: Optional[int] = 1\n    all_features_to_select: str = "range(1, min(50, p) + 1)"\n    metrics: Dict[str, Any] = field(default_factory=dict)\n')),(0,o.kt)("h2",{id:""}),(0,o.kt)("p",null,"Experiments can be configured in two ways."),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Using ",(0,o.kt)("strong",{parentName:"li"},"YAML")," files stored in a directory"),(0,o.kt)("li",{parentName:"ol"},"Using ",(0,o.kt)("strong",{parentName:"li"},"Python")," (Structured Configs in Hydra)")),(0,o.kt)("h2",{id:"using-yaml-files"},"Using YAML files"),(0,o.kt)("p",null,"..."))}f.isMDXComponent=!0}}]);