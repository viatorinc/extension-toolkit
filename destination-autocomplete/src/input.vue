<template>
    <autocomplete v-on:selected="handleSelected"
                  :source="tags"
                  :resultsFormatter='formatResults'
                  input-class="autocomplete-input">
    </autocomplete>
</template>

<script>
  import Autocomplete from 'vuejs-auto-complete';
  import mixin from "@directus/extension-toolkit/mixins/interface";
  export default {
    mixins: [mixin],
    name: 'Searchable',
    components: {
      Autocomplete
    },
    data() {
      return {
        tags: []
      }
    },
    async mounted() {
      const res = await fetch('/_/custom/destinations');
      const json = await res.json();
      this.tags = Object.values(json.data).map(v => ({id: v.destinationId, name: v.destinationName}));
    },
    methods: {
        handleSelected: function(selected) {
            const value = `${selected.selectedObject.id}|${selected.selectedObject.name}`;
            this.$emit("input", value);
      },
      formatResults: (res) => {
        console.warn(res);
      }
    }
  }
</script>
<style>
  .autocomplete-input {
    min-width: 200px;
  }
</style>
