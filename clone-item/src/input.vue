<template>
  <v-button class="clone" :disabled="required && disabled" v-on:click="clone">
<!--    TODO This should be from a translation in meta.json-->
    {{ $t('Clone') }}
    <v-icon name="file_copy" right />
  </v-button>
</template>

<script>
  import mixin from "@directus/extension-toolkit/mixins/interface";
  import { get, omit } from 'lodash';

  const ARTICLES_COLLECTION_NAME = "articles";
  const ARTICLES_SECTIONS_COLLECTION_NAME = "articles_sections";
  const ARTICLES_SECTIONS_TRANSLATIONS_COLLECTION_NAME = "articles_sections_translations";
  const ARTICLES_TRANSLATIONS_COLLECTION_NAME = "articles_translations";

  const ITEM_FIELDS_NOT_TO_CLONE = [
      "id",
      "created_by",
      "created_on",
      "modified_by",
      "modified_on",
  ];
  const ARTICLE_FIELDS_NOT_TO_CLONE = [
      ...ITEM_FIELDS_NOT_TO_CLONE,
      "status",
      "author",
      "publish_date",
      "deactivate_date",
      "search_engine_index_on",
      "destination_id",
      "tags",
      "content_translations",
      "sections"
  ];
  const ARTICLE_SECTION_FIELDS_NOT_TO_CLONE = [
      ...ITEM_FIELDS_NOT_TO_CLONE,
      "content_translations"
  ];

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
            const { data: originalArticle } = await this.$api.getItem(
                ARTICLES_COLLECTION_NAME,
                cmsId,
                { fields: '*,content_translations.*' });

            const { data: originalArticleSections } = await this.$api.getItems(
                ARTICLES_SECTIONS_COLLECTION_NAME,
                {
                    fields: '*,content_translations.*',
                    filter: {
                        parent_id: {
                            eq: originalArticle.id
                        }
                    }
                });

            const clonedArticle = await this._cloneArticleItem(originalArticle);

            await this._cloneArticleTranslations(originalArticle, clonedArticle);

            const clonedArticleSections = await this._cloneArticleSections(originalArticleSections, clonedArticle);

            if (clonedArticleSections.length > 0) {
                await this._cloneArticleSectionTranslations(originalArticleSections, clonedArticleSections);
            }
        },
        async _cloneArticleItem(articleWithTranslations) {
            const createArticleRequest = omit(articleWithTranslations, ARTICLE_FIELDS_NOT_TO_CLONE);

            const { data: clonedArticle } = await this.$api.createItem(ARTICLES_COLLECTION_NAME, createArticleRequest);

            return clonedArticle;
        },
        async _cloneArticleTranslations(originalArticle, clonedArticle) {
            const createArticleTranslationRequests = get(originalArticle, "content_translations", []).map(ct => {
                return {
                    ...omit(ct, ITEM_FIELDS_NOT_TO_CLONE),
                    parent_id: clonedArticle.id
                };
            });

            if (createArticleTranslationRequests.length > 0) {
                await this.$api.createItems(ARTICLES_TRANSLATIONS_COLLECTION_NAME, createArticleTranslationRequests);
            }
        },
        async _cloneArticleSections(originalArticleSections, clonedArticle) {
            const createArticleSectionRequests = originalArticleSections.map(s => {
                return {
                    ...omit(s, ARTICLE_SECTION_FIELDS_NOT_TO_CLONE),
                    parent_id: clonedArticle.id
                };
            });

            if (createArticleSectionRequests.length > 0) {
                const { data: clonedArticleSections } = await this.$api.createItems(ARTICLES_SECTIONS_COLLECTION_NAME, createArticleSectionRequests);

                return clonedArticleSections;
            }

            return [];
        },
        async _cloneArticleSectionTranslations(originalArticleSections, clonedArticleSections) {
            const createArticleSectionTranslationRequests = [];

            originalArticleSections.forEach((section, index) => {
                // Get id of cloned section to use as parent id for section translation.
                const clonedSectionId = clonedArticleSections[index].id;

                const clonedSectionTranslations = get(section, "content_translations", []).map(ct => {
                    return {
                        ...omit(ct, ITEM_FIELDS_NOT_TO_CLONE),
                        parent_id: clonedSectionId
                    };
                });

                createArticleSectionTranslationRequests.push(...clonedSectionTranslations);
            });

            if (createArticleSectionTranslationRequests.length > 0) {
                await this.$api.createItems(ARTICLES_SECTIONS_TRANSLATIONS_COLLECTION_NAME, createArticleSectionTranslationRequests);
            }
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

