/**
 * LayerTokenView - 7-Layer 디자인 토큰 시각화
 *
 * MDX 기반 디자인 시스템 문서를 렌더링
 */

import { MDXContent } from './MDXContent';
import TokensDoc from '@/docs/tokens.mdx';

export const LayerTokenView = () => {
  return (
    <MDXContent>
      <TokensDoc />
    </MDXContent>
  );
};
