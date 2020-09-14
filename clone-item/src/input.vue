<template>
  <v-button class="clone" :loading="saving" :disabled="newItem" v-on:click="clone">
    {{ $t('interfaces.clone-item.clone') }}
    <v-icon name="file_copy" right />
  </v-button>
</template>

<script>
  import mixin from '@directus/extension-toolkit/mixins/interface';
  import { get, omit } from 'lodash';

  const ITEM_FIELDS_NOT_TO_CLONE = [
    'id',
    'created_by',
    'created_on',
    'modified_by',
    'modified_on',
    'status',
    'author',
    'publish_date',
    'deactivate_date',
    'search_engine_index_on',
    'destination_id',
    'destinations',
    'tags',
    'content_translations',
    'sections',
    'public_id'
  ];

  const ARTICLES_COLLECTION_NAME = 'articles';
  const SHELF_COLLECTIONS_COLLECTION_NAME = 'shelf_collections';
  const CLONE_SUPPORTED_COLLECTIONS = [ARTICLES_COLLECTION_NAME, SHELF_COLLECTIONS_COLLECTION_NAME];

  export default {
      mixins: [mixin],
      data() {
        return {
          newItem: this.newItem,
          saving: false
        };
      },
      methods: {
        async clone() {
            const cmsId = this.primaryKey;
            const collectionName = this.collection;

            if (!CLONE_SUPPORTED_COLLECTIONS.includes(collectionName)) {
                this.$notify({
                    title: this.$t('interfaces.clone-item.clone-not-supported'),
                    color: 'red',
                    iconMain: 'check'
                });

                return;
            }

            this.saving = true;
            const loadingId = this.$helpers.shortid.generate();
            this.$store.dispatch('loadingStart', { id: loadingId });

            try {
                const clonedItemId = await this._clone(collectionName, cmsId);

                this.$store.dispatch('loadingFinished', loadingId);
                this.saving = false;

                this.$notify({
                    title: this.$t('interfaces.clone-item.clone-success'),
                    color: 'green',
                    iconMain: 'check'
                });

                this.$router.push(`/${this.$store.state.currentProjectKey}/collections/${collectionName}/${clonedItemId}`);
            } catch (error) {
                this.$store.dispatch('loadingFinished', loadingId);
                this.saving = false;

                this.$events.emit('error', {
                    notify: error.message || this.$t('something_went_wrong_body'),
                    error
                });
            }
        },
        async _clone(itemCollectionName, cmsId) {
            const { data: originalItem } = await this.$api.getItem(
                itemCollectionName,
                cmsId,
                { fields: '*,content_translations.*' });

            const { data: originalItemSections } = await this.$api.getItems(
                itemCollectionName + '_sections',
                {
                    fields: '*,content_translations.*',
                    filter: {
                        parent_id: {
                            eq: originalItem.id
                        }
                    }
                });

            const clonedItem = await this._cloneItem(
                    itemCollectionName,
                    originalItem);

            await this._cloneItemTranslations(
                    itemCollectionName,
                    originalItem,
                    clonedItem);

            const clonedItemSections = await this._cloneSections(itemCollectionName, originalItemSections, clonedItem);

            if (clonedItemSections.length > 0) {
                await this._cloneSectionTranslations(itemCollectionName, originalItemSections, clonedItemSections);
            }

            return clonedItem.id;
        },
        async _cloneItem(collectionName, original) {
          const createRequest = omit(original, ITEM_FIELDS_NOT_TO_CLONE);

          const { data: clonedItem } = await this.$api.createItem(collectionName, createRequest);

          return clonedItem;
        },
        async _cloneItemTranslations(itemCollectionName, originalItem, clonedItem) {
          const createRequests = get(originalItem, 'content_translations', []).map(ct => {
            return {
              ...omit(ct, ITEM_FIELDS_NOT_TO_CLONE),
              parent_id: clonedItem.id
            };
          });

          if (createRequests.length > 0) {
            await this.$api.createItems(itemCollectionName + '_translations', createRequests);
          }
        },
        async _cloneSections(itemCollectionName, originalSections, clonedItem) {
          const createRequests = originalSections.map(s => {
            return {
              ...omit(s, ITEM_FIELDS_NOT_TO_CLONE),
              parent_id: clonedItem.id
            };
          });

          if (createRequests.length > 0) {
            const { data: clonedSections } = await this.$api.createItems(itemCollectionName + '_sections', createRequests);

            return clonedSections;
          }

          return [];
        },
        async _cloneSectionTranslations(itemCollectionName, originalSections, clonedSections) {
          const createSectionTranslationRequests = [];

          originalSections.forEach((section, index) => {
            // Get id of cloned section to use as parent id for section translation.
            const clonedSectionId = clonedSections[index].id;

            const clonedSectionTranslations = get(section, 'content_translations', []).map(ct => {
              return {
                ...omit(ct, ITEM_FIELDS_NOT_TO_CLONE),
                parent_id: clonedSectionId
              };
            });

            createSectionTranslationRequests.push(...clonedSectionTranslations);
          });

          if (createSectionTranslationRequests.length > 0) {
            await this.$api.createItems(itemCollectionName + '_sections_translations', createSectionTranslationRequests);
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

