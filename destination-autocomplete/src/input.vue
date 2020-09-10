<template>
<div>
    <autocomplete v-on:selected="handleSelected"
                  :source="tags"
                  :resultsFormatter='formatResults'
                  input-class="autocomplete-input">
    </autocomplete>

    <input :value="formattedValue" class="max-width"/>
  </div>
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
    computed: {
      formattedValue: function() {
        if(this.value == null) {
          return;
        }
        return this.value.replace('|', ' - ');
      }
    },
    async mounted() {
      const res = await fetch('/_/custom/destinations');
      const json = await res.json();
      this.tags = Object.values(json.data).map(v => ({
          id: `${v.destinationId}|${v.destinationName}`,
          name: `${v.destinationId} - ${v.destinationName}`
      }));
    },
    methods: {
        handleSelected: function(selected) {
            this.$emit('input', selected.selectedObject.id);
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
  .max-width {
    width: 100%;
  }
</style>
