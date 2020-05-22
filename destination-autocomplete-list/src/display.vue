<template>
  <div>
    {{ displayValue }}
  </div>
</template>

<script>
  import mixin from "@directus/extension-toolkit/mixins/interface";

  export default {
    mixins: [mixin],
    computed: {
      displayValue() {
        if (this.value) {
          return this.value.split(',').map(v => v.split('|')[1]);
        }
      }
    }
  }
</script>
<!--
<style lang="scss" scoped>
div {
  background-color: var(&#45;&#45;red-300);
}
</style>
-->
