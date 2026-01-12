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
    <Block role="Container" density="Comfortable">
      <Block role="Stack">
        <Text role="Title" prominence="Strong" content="Product Cards" />
        <Text
          role="Body"
          prominence="Subtle"
          content="E-commerce product display using MediaCard + StatCard patterns"
        />
      </Block>

      {/* Product Grid */}
      <Block role="Grid" spec={{ columns: 3 }} density="Standard">
        {products.map((product) => (
          <Block key={product.id} role="MediaCard" prominence="Standard" density="Standard">
            {/* Product Image Area */}
            <Block role="Stack" density="Compact">
              {/* Badge if exists */}
              {product.badge && (
                <Block role="Stack" density="Compact">
                  <Text role="Badge" prominence="Strong" intent="Brand" content={product.badge} />
                </Block>
              )}

              {/* Product Image */}
              <Block role="Center">
                <Text role="Title" prominence="Hero" content={product.image} />
              </Block>
            </Block>

            {/* Product Info */}
            <Block role="Stack" density="Standard">
              <Text role="Heading" prominence="Strong" content={product.name} />

              {/* Rating */}
              <Block role="Stack" density="Compact">
                <Text
                  role="Body"
                  prominence="Subtle"
                  content={`⭐ ${product.rating} (${product.reviews} reviews)`}
                />
              </Block>

              {/* Price */}
              <Block role="Stack" density="Compact">
                <Text role="Title" prominence="Strong" intent="Brand" content={product.price} />
                {product.originalPrice && (
                  <Text role="Caption" prominence="Subtle" content={product.originalPrice} />
                )}
              </Block>

              {/* Actions */}
              <Block role="Stack" density="Compact">
                <Action role="Button" prominence="Hero" intent="Brand" label="Add to Cart" />
                <Action role="Button" prominence="Standard" label="View Details" />
              </Block>
            </Block>
          </Block>
        ))}
      </Block>
    </Block>
  );
}
