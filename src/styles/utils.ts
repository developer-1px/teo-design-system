// Bridge: re-exports from @packages/surfaces, @packages/typography, @packages/layout
// 기존 import 호환성을 위한 re-export
// 새 코드에서는 각각의 패키지에서 직접 import하세요:
//   import { surface } from '@packages/surfaces'
//   import { textStyle, ui } from '@packages/typography'
//   import { subgrid } from '@packages/layout'
export { surface } from '@packages/surfaces';
export { textStyle, ui } from '@packages/typography';
export { subgrid } from '@packages/layout';
