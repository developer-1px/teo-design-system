import { Frame } from '@/components/dsl/shared/Frame';
/**
 * ProductCardExample
 *
 * Real-world product card layout for e-commerce
 * Uses ONLY IDDL components - NO className for design
 */

import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';

export function ProductCardExample() {
  const products = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: '$299',
      originalPrice: '$399',
      rating: 4.5,
      reviews: 128,
      badge: 'Best Seller',
      image: '🎧',
    },
    {
      id: 2,
      name: 'Wireless Keyboard',
      price: '$129',
      rating: 4.8,
      reviews: 94,
      badge: 'New',
      image: '⌨️',
    },
    {
      id: 3,
      name: 'USB-C Hub',
      price: '$79',
      originalPrice: '$99',
      rating: 4.3,
      reviews: 67,
      image: '🔌',
    },
  ];

  return (
    <Frame.Column gap={6}>
      <Frame.Stack>
        <Text role="Title" prominence="Strong" content="Product Cards" />
        <Text
          role="Body"
          prominence="Subtle"
          content="E-commerce product display using MediaCard + StatCard patterns"
        />
      </Frame.Stack>

      {/* Product Grid */}
      <Frame.Grid columns={3} gap={6}>
        {products.map((product) => (
          <Block key={product.id} role="Card" prominence="Standard" density="Standard">
            {/* Product Image Area */}
            <Frame.Stack gap={2}>
              {/* Badge if exists */}
              {product.badge && (
                <Frame.Stack gap={2}>
                  <Text role="Badge" prominence="Strong" intent="Brand" content={product.badge} />
                </Frame.Stack>
              )}

              {/* Product Image */}
              <Frame.Center>
                <Text role="Title" prominence="Hero" content={product.image} />
              </Frame.Center>
            </Frame.Stack>

            {/* Product Info */}
            <Frame.Stack gap={4}>
              <Text role="Heading" prominence="Strong" content={product.name} />

              {/* Rating */}
              <Frame.Stack gap={2}>
                <Text
                  role="Body"
                  prominence="Subtle"
                  content={`⭐ ${product.rating} (${product.reviews} reviews)`}
                />
              </Frame.Stack>

              {/* Price */}
              <Frame.Stack gap={2}>
                <Text role="Title" prominence="Strong" intent="Brand" content={product.price} />
                {product.originalPrice && (
                  <Text role="Caption" prominence="Subtle" content={product.originalPrice} />
                )}
              </Frame.Stack>

              {/* Actions */}
              <Frame.Stack gap={2}>
                <Action role="Button" prominence="Hero" intent="Brand" label="Add to Cart" />
                <Action role="Button" prominence="Standard" label="View Details" />
              </Frame.Stack>
            </Frame.Stack>
          </Block>
        ))}
      </Frame.Grid>
    </Frame.Column>
  );
}
