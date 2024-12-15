import { useSSRContext, defineComponent, computed, mergeProps, ref, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, u as usePlantService } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'node:path';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ProgressBar",
  __ssrInlineRender: true,
  props: {
    currentStep: {},
    totalSteps: {},
    filteredCount: {}
  },
  setup(__props) {
    const props = __props;
    const displayStep = computed(() => {
      return Math.min(props.currentStep + 1, props.totalSteps);
    });
    const progressWidth = computed(() => {
      return props.currentStep / props.totalSteps * 100;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "progress-bar-container" }, _attrs))} data-v-3c1fc911><div class="progress-bar" data-v-3c1fc911><div class="progress" style="${ssrRenderStyle({ width: progressWidth.value + "%" })}" data-v-3c1fc911></div></div><div class="progress-info" data-v-3c1fc911><span data-v-3c1fc911>\u8A72\u5F53\u690D\u7269\u6570: ${ssrInterpolate(_ctx.filteredCount)}</span><span data-v-3c1fc911>\u30B9\u30C6\u30C3\u30D7: ${ssrInterpolate(displayStep.value)} / ${ssrInterpolate(_ctx.totalSteps)}</span></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProgressBar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ProgressBar = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-3c1fc911"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "FilterPanel",
  __ssrInlineRender: true,
  props: {
    category: {},
    question: {},
    stepCount: {}
  },
  emits: ["select", "skip", "show-results"],
  setup(__props, { emit: __emit }) {
    const selectedOption = ref(null);
    const options = [
      { label: "Yes", value: true, icon: "\u2714\uFE0F" },
      { label: "No", value: false, icon: "\u274C" },
      { label: "Unknown", value: null, icon: "\u2754" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "filter-panel" }, _attrs))} data-v-18a64347><div class="category-container" data-v-18a64347><h2 class="category" data-v-18a64347>${ssrInterpolate(_ctx.category)} <span class="step-count" data-v-18a64347>\uFF08${ssrInterpolate(_ctx.stepCount)} \u30B9\u30C6\u30C3\u30D7\uFF09</span></h2><div class="question-container" data-v-18a64347><h3 class="question" data-v-18a64347>${ssrInterpolate(_ctx.question.text)}</h3><div class="options" data-v-18a64347><!--[-->`);
      ssrRenderList(options, (option) => {
        var _a;
        _push(`<button class="${ssrRenderClass([{ selected: ((_a = selectedOption.value) == null ? void 0 : _a.value) === option.value }, "option-card"])}" data-v-18a64347><span class="icon" data-v-18a64347>${ssrInterpolate(option.icon)}</span><span class="label" data-v-18a64347>${ssrInterpolate(option.label)}</span></button>`);
      });
      _push(`<!--]--></div></div><button class="skip-button" data-v-18a64347>\u30AB\u30C6\u30B4\u30EA\u3092\u3059\u3079\u3066\u30B9\u30AD\u30C3\u30D7</button><button class="result-button" data-v-18a64347>\u7D50\u679C\u3092\u898B\u308B</button></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FilterPanel.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const FilterPanel = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-18a64347"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ResultCard",
  __ssrInlineRender: true,
  props: {
    plant: {},
    characterSet: {}
  },
  setup(__props) {
    const showDetails = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "result-card" }, _attrs))} data-v-181e1c06><div class="header" data-v-181e1c06><h3 data-v-181e1c06>${ssrInterpolate(_ctx.plant.scientificName)}</h3><span class="toggle-icon" data-v-181e1c06>${ssrInterpolate(showDetails.value ? "\u25B2" : "\u25BC")}</span></div>`);
      if (showDetails.value) {
        _push(`<ul data-v-181e1c06><!--[-->`);
        ssrRenderList(_ctx.plant.characters, (key) => {
          var _a;
          _push(`<li class="character-item" data-v-181e1c06><span class="character-key" data-v-181e1c06>${ssrInterpolate(key)}</span><span class="character-value" data-v-181e1c06>\uFF1A${ssrInterpolate((_a = _ctx.characterSet[key]) == null ? void 0 : _a.characterJpn)}</span></li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ResultCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ResultCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-181e1c06"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const plantService = usePlantService();
    plantService.loadPlantData();
    const plants = plantService.plants;
    const characterSet = plantService.characterSet;
    const currentStep = ref(0);
    const answers = ref(/* @__PURE__ */ new Map());
    const questions = ref([]);
    const categories = ref(/* @__PURE__ */ new Map());
    Object.entries(characterSet.value).forEach(([key, character]) => {
      var _a;
      const category = character.categoryJpn;
      const question = {
        category,
        key,
        text: character.characterJpn
      };
      const tmp = (_a = categories.value.get(category)) != null ? _a : [];
      tmp.push(question);
      categories.value.set(category, tmp);
      questions.value.push(question);
    });
    const currentCategory = computed(() => {
      return questions.value[currentStep.value].category;
    });
    const currentCategoryStepCount = computed(() => {
      var _a;
      return ((_a = categories.value.get(currentCategory.value)) == null ? void 0 : _a.length) || 0;
    });
    const filteredPlants = computed(() => {
      const trueKeys = [];
      const falseKeys = [];
      answers.value.forEach((answer, key) => {
        if (answer === true) {
          trueKeys.push(key);
        } else if (answer === false) {
          falseKeys.push(key);
        }
      });
      return plants.value.filter((plant) => {
        const hasAllTrueKeys = trueKeys.every((key) => plant.characters.includes(key));
        const hasNoFalseKeys = !falseKeys.some((key) => plant.characters.includes(key));
        return hasAllTrueKeys && hasNoFalseKeys;
      });
    });
    const handleAnswer = (answer) => {
      answers.value.set(answer.key, answer.value);
      currentStep.value++;
    };
    const skipCategory = () => {
      var _a;
      (_a = categories.value.get(currentCategory.value)) == null ? void 0 : _a.forEach((q) => {
        answers.value.set(q.key, null);
      });
      currentStep.value = answers.value.size;
    };
    const showResults = () => {
      currentStep.value = questions.value.length;
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-2d7e63e8>`);
      _push(ssrRenderComponent(ProgressBar, {
        currentStep: unref(currentStep),
        totalSteps: (_a = unref(questions)) == null ? void 0 : _a.length,
        filteredCount: unref(filteredPlants).length
      }, null, _parent));
      if (unref(currentStep) < ((_b = unref(questions)) == null ? void 0 : _b.length)) {
        _push(ssrRenderComponent(FilterPanel, {
          category: unref(currentCategory),
          stepCount: unref(currentCategoryStepCount),
          question: unref(questions)[unref(currentStep)],
          onSelect: handleAnswer,
          onSkip: skipCategory,
          onShowResults: showResults
        }, null, _parent));
      } else {
        _push(`<div data-v-2d7e63e8><div class="results-header" data-v-2d7e63e8><h2 data-v-2d7e63e8>\u7D50\u679C</h2><button class="reset-button" data-v-2d7e63e8>\u3082\u3046\u4E00\u5EA6\u691C\u7D22\u3059\u308B</button></div><!--[-->`);
        ssrRenderList(unref(filteredPlants), (plant) => {
          _push(`<div data-v-2d7e63e8>`);
          _push(ssrRenderComponent(ResultCard, {
            characterSet: unref(characterSet),
            plant
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2d7e63e8"]]);

export { index as default };
//# sourceMappingURL=index-CaIJSgnZ.mjs.map
