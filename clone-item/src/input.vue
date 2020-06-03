<template>
  <v-button class="clone" :disabled="required && disabled" v-on:click="clone">
<!--    TODO This should be from a translation in meta.json-->
    {{ $t('Clone') }}
    <v-icon name="file_copy" right />
  </v-button>
</template>

<script>
  import mixin from "@directus/extension-toolkit/mixins/interface";
  import { get } from 'lodash';

  const ARTICLES_COLLECTION_NAME = "articles";

  export default {
    mixins: [mixin],
    methods: {
        async clone() {
            // TODO Loading status
            // TODO error handling

            const cmsId = this.primaryKey;
            const collectionName = this.collection;

            if (collectionName === ARTICLES_COLLECTION_NAME) {
                await this._cloneArticle(cmsId);
            } else {
                this._cloneUnsupported(collectionName);
            }

          // // Copied from item.vue
          // const values = Object.assign({}, this.values);
          //
          // // Delete fields that shouldn't / can't be duplicated
          // forEach(this.fields, (info, fieldName) => {
          //     if (info.primary_key === true) delete values[fieldName];
          //
          //     switch (info.type.toLowerCase()) {
          //         case 'alias':
          //         case 'datetime_created':
          //         case 'datetime_updated':
          //         case 'owner':
          //         case 'user_updated':
          //         case 'o2m':
          //             delete values[fieldName];
          //             break;
          //     }
          // });
          //
          // const id = this.$helpers.shortid.generate();
          // this.$store.dispatch('loadingStart', { id });
          //
          // return this.$store
          //     .dispatch('save', {
          //         primaryKey: '+',
          //         values
          //     })
          //     .then(res => {
          //         this.$store.dispatch('loadingFinished', id);
          //         // TODO Undo
          //         // this.saving = false;
          //         return res.data[this.primaryKeyField];
          //     })
          //     .then(pk => {
          //         this.$notify({
          //             title: this.$tc('item_saved'),
          //             color: 'green',
          //             iconMain: 'check'
          //         });
          //
          //         if (this.collection === 'directus_webhooks') {
          //             return this.$router.push(
          //                 `/${this.currentProjectKey}/settings/webhooks/${pk}`
          //             );
          //         }
          //
          //         if (this.collection.startsWith('directus_')) {
          //             return this.$router.push(
          //                 `/${this.currentProjectKey}/${this.collection.substring(9)}/${pk}`
          //             );
          //         }
          //
          //         return this.$router.push(
          //             `/${this.currentProjectKey}/collections/${this.collection}/${pk}`
          //         );
          //     })
          //     .catch(error => {
          //         this.$store.dispatch('loadingFinished', id);
          //         this.$events.emit('error', {
          //             notify: error.message || this.$t('something_went_wrong_body'),
          //             error
          //         });
          //     });
        },
        _cloneUnsupported(collectionName) {
            this.$events.emit('error', {
                notify: `Items in ${collectionName} collection do not support cloning.`
            });
        },
        async _cloneArticle(cmsId) {
            const { data: articleWithTranslations } = await this.$api.getItem(ARTICLES_COLLECTION_NAME, cmsId, { fields: '*,content_translations.*' });

            // https://docs.directus.io/guides/js-sdk.html#reference

            // TODO Test if can send photos as objects with id property. Then can just delete properties instead.
            const createArticleRequest = {
                url: articleWithTranslations.url,
                hero_photo_desktop_large: get(articleWithTranslations, "hero_photo_desktop_large.id", null),
                hero_photo_desktop_small: get(articleWithTranslations, "hero_photo_desktop_small.id", null),
                hero_photo_mobile_large: get(articleWithTranslations, "hero_photo_mobile_large.id", null),
                hero_photo_mobile_small: get(articleWithTranslations, "hero_photo_mobile_small.id", null),
                date: articleWithTranslations.date,
                photo_credit: articleWithTranslations.photo_credit,
                guide: articleWithTranslations.guide,
                ta_location_id: articleWithTranslations.ta_location_id,
                disclaimer: articleWithTranslations.disclaimer,
                primary_category: articleWithTranslations.primary_category,
                page_type: articleWithTranslations.page_type,
            };

            // TODO Figure out why getting Error notifying NSP! when this runs
            const clonedArticle = await this.$api.createItem(ARTICLES_COLLECTION_NAME, createArticleRequest);

            const a =1;
        }
    }
  }
</script>

<style lang="scss" scoped>
  .clone {
    margin-top: 10px;
    .material-icons {
      font-size: 18px;
      margin-left: 10px;
      vertical-align: middle;
    }
  }
</style>

