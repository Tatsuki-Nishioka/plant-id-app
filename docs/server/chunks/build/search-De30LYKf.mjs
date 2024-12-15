import { useSSRContext, defineComponent, ref, watch, unref, mergeProps, computed } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SearchBar",
  __ssrInlineRender: true,
  props: {
    plants: {}
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const query = ref("");
    const filteredResults = ref([]);
    ref(10);
    watch(
      () => props.plants,
      (newPlants) => {
        filteredResults.value = newPlants;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-6054537f><input type="text"${ssrRenderAttr("value", unref(query))} placeholder="\u7279\u5FB4\u3092\u5B66\u540D\u304B\u3089\u691C\u7D22" class="search-input" data-v-6054537f>`);
      if (unref(query) && unref(filteredResults).length) {
        _push(`<ul class="results-list" data-v-6054537f><!--[-->`);
        ssrRenderList(unref(filteredResults), (plant) => {
          _push(`<li class="result-item" data-v-6054537f>${ssrInterpolate(plant.scientificName)}</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SearchBar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const SearchBar = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-6054537f"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CharacterCard",
  __ssrInlineRender: true,
  props: {
    description: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "character-card" }, _attrs))} data-v-1c5a57dd><div class="description" data-v-1c5a57dd>${ssrInterpolate(_ctx.description)}</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CharacterCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CharacterCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-1c5a57dd"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "search",
  __ssrInlineRender: true,
  setup(__props) {
    const plantService = usePlantService();
    const plants = plantService.plants;
    const characterSet = plantService.characterSet;
    const selectedPlant = ref(null);
    const characterIcons = {
      has_hair: "\u{1F33F}",
      revolute_margin: "\u{1F343}"
    };
    const handleSelect = (plant) => {
      selectedPlant.value = plant;
    };
    const selectedCharacters = computed(() => {
      if (!selectedPlant.value || !characterSet.value) return [];
      return selectedPlant.value.characters.map(
        (characterId) => characterSet.value[characterId]
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-85f5cd79><h1 data-v-85f5cd79>\u690D\u7269\u306E\u7279\u5FB4\u691C\u7D22</h1>`);
      _push(ssrRenderComponent(SearchBar, {
        plants: unref(plants),
        onSelect: handleSelect
      }, null, _parent));
      if (unref(selectedPlant)) {
        _push(`<div class="plant-details" data-v-85f5cd79><h2 data-v-85f5cd79>${ssrInterpolate(unref(selectedPlant).scientificName)}</h2><div data-v-85f5cd79><!--[-->`);
        ssrRenderList(unref(selectedCharacters), (character) => {
          _push(ssrRenderComponent(CharacterCard, {
            key: character.id,
            icon: characterIcons[character.id] || "\u{1F50D}",
            description: character.characterJpn
          }, null, _parent));
        });
        _push(`<!--]--></div><button data-v-85f5cd79>\u623B\u308B</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const search = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-85f5cd79"]]);

export { search as default };
//# sourceMappingURL=search-De30LYKf.mjs.map
