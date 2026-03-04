Component({
  properties: {
    item: {
      type: Object,
      value: {},
    },
  },
  methods: {
    onCardTap() {
      this.triggerEvent('cardtap', { id: this.properties.item.id });
    },
    onFavoriteTap() {
      this.triggerEvent('favtap', { id: this.properties.item.id });
    },
  },
});

