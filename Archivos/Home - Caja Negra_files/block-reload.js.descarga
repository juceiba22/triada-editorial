const pisol_aclw_metadata_checkout = {
    "apiVersion": 3,
    "name": "pisol-aclw/checkout",
    "title": "Advance coupon",
    "category": "woocommerce",
    "icon": "smiley",
    "description": "Reload mechanisum for advance coupon plugin",
    "supports": {
        "multiple": false
    },
    "parent":["woocommerce/checkout-contact-information-block"],
    "attributes": {
       "lock": {
            "type": "object",
            "default": {
                "remove": true,
                "move": true
            }
        }
    }
};

const ReadOnlyCartCheckoutListener = (prop) => {
  if(prop?.extensions?.pisol_aclw?.reload) {
    window.location.reload();
  }
  return null;
}

const pisol_aclw_options_checkout = {
    metadata: pisol_aclw_metadata_checkout,
    component: ReadOnlyCartCheckoutListener
};

wc.blocksCheckout.registerCheckoutBlock( pisol_aclw_options_checkout );

const pisol_aclw_metadata_cart = {
    "apiVersion": 3,
    "name": "pisol-aclw/cart",
    "title": "Advance coupon",
    "category": "woocommerce",
    "icon": "smiley",
    "description": "Reload mechanisum for advance coupon plugin",
    "supports": {
        "multiple": false
    },
    "parent":["woocommerce/cart-items-block"],
    "attributes": {
       "lock": {
            "type": "object",
            "default": {
                "remove": true,
                "move": true
            }
        }
    }
};

const pisol_aclw_options_cart = {
    metadata: pisol_aclw_metadata_cart,
    component: ReadOnlyCartCheckoutListener,
};

wc.blocksCheckout.registerCheckoutBlock( pisol_aclw_options_cart );