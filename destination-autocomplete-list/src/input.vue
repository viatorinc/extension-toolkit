<template>
    <div>
    <autocomplete v-on:selected="handleSelected"
                  :source="tags"
                  :resultsFormatter='formatResults'
                  input-class="autocomplete-input">
    </autocomplete>
    <div>
    <input v-model="formattedList" @change="onChange($event)" class="max-width"/>
  </div>
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
      formattedList: function() {
        if(this.value == null) {
          return;
        }
        return this.value.split(',').map(v => v.replace('|', ' - '));
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
            let valueToEmit = '';

            if (this.value) {
                valueToEmit = ''.concat(`${this.value},`).concat(selected.selectedObject.id);
            } else {
                valueToEmit = selected.selectedObject.id;
            }

            this.$emit('input', valueToEmit);
      },
      formatResults: (res) => {
        console.warn(res);
      },
      onChange: function(event)  {
        this.value = this.value.split(',').filter(function(item) {
            const destinationName = item.split('|')[1];
            return event.target.value.includes(destinationName);
        }).toString();
        this.$emit("input", this.value);
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
