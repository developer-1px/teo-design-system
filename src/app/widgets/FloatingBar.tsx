/**
 * FloatingBar - IDDL 기반 앱 전환 및 테마 토글 바
 *
 * IDDL Structure:
 * - Overlay[Floating]: 플로팅 바 컨테이너
 * - Group[Toolbar]: 버튼 그룹
 * - Action: 앱 선택 버튼 (prominence로 활성 상태 표현)
 * - Action: 테마 토글 버튼
 *
 * Features:
 * - Wouter 기반 라우팅 연동
 * - APP_CONFIGS에서 자동으로 앱 목록 생성
 * - 시스템 다크모드 변경 감지
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Group } from '@/components/types/Group/Group.tsx';
import { Action } from '@/components/types/Atom/Action/Action.tsx';
import { Overlay } from '@/components/types/Overlay/Overlay.tsx';
import { APP_CONFIGS, type AppType } from '@/app/contexts/app-context.tsx';
import { getThemeConfig, type Theme, toggleTheme as toggleThemeUtil } from '@/shared/lib/theme.ts';

export const FloatingBar = () => {
  const [location, setLocation] = useLocation();
  const currentApp = (location.replace(/^\//, '') || 'ide') as AppType;
  const [theme, setTheme] = useState<Theme>(() => getThemeConfig().theme);

  const handleToggleTheme = () => {
    const newTheme = toggleThemeUtil();
    setTheme(newTheme);
  };

  const handleAppSwitch = (appType: AppType) => {
    setLocation(`/${appType}`);
  };

  // 시스템 다크모드 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // localStorage에 사용자 선택이 없으면 시스템 설정 따르기
      const stored = localStorage.getItem('ui-kit-theme-config');
      if (!stored) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  return (
    <Overlay id="floating-bar" role="Floating" placement="bottom" isOpen={true} dismissable={false}>
      <Group
        role="Toolbar"
        layout="inline"
        density="Compact"
        className="bg-surface-overlay shadow-xl rounded-full px-2 py-1 gap-1"
      >
        {/* App 선택 버튼들 */}
        {Object.values(APP_CONFIGS).map((app) => {
          const isActive = currentApp === app.type;
          return (
            <Action
              key={app.type}
              role="IconButton"
              icon={app.iconName}
              prominence={isActive ? 'Standard' : 'Subtle'}
              intent={isActive ? 'Brand' : 'Neutral'}
              behavior={{
                action: 'command',
                command: 'app.switch',
                args: { type: app.type },
              }}
              onClick={(e) => {
                e.preventDefault();
                handleAppSwitch(app.type);
              }}
            />
          );
        })}

        {/* 구분선 */}
        <div className="w-px h-4 bg-border-default mx-1" />

        {/* 테마 토글 버튼 */}
        <Action
          role="IconButton"
          icon={theme === 'dark' ? 'Sun' : 'Moon'}
          intent="Neutral"
          behavior={{ action: 'command', command: 'theme.toggle' }}
          onClick={(e) => {
            e.preventDefault();
            handleToggleTheme();
          }}
        />
      </Group>
    </Overlay>
  );
};
