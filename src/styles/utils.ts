// Bridge: re-exports from @surface/surfaces, @surface/typography, @surface/layout
// 기존 import 호환성을 위한 re-export
// 새 코드에서는 각각의 패키지에서 직접 import하세요:
//   import { surface } from '@surface/surfaces'
//   import { textStyle, ui } from '@surface/typography'
//   import { subgrid } from '@surface/layout'
export { surface } from '@surface/surfaces';
export { textStyle, ui } from '@surface/typography';
export { subgrid } from '@surface/layout';
