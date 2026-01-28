import { useNavigate } from 'react-router-dom';
import * as styles from './LandingPage.css';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.logo}>
                        <div style={{ width: 12, height: 12, background: 'black', borderRadius: '50%' }} />
                        Teo's Antigravity
                    </div>
                    <nav>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/mail'); }} className={styles.navLink}>Examples</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/components'); }} className={styles.navLink}>System</a>
                        <a href="https://github.com" target="_blank" className={styles.navLink}>GitHub</a>
                    </nav>
                </header>

                {/* Hero */}
                <section className={styles.heroSection}>
                    <h1 className={styles.heroTitle}>
                        Freedom without Chaos.<br />
                        Constraints without Rigidness.
                    </h1>
                    <p className={styles.heroSubtitle}>
                        AI 모델은 디자인을 잘해내지만, <strong>일관성(Consistency)</strong>을 무너뜨립니다.<br />
                        일관성을 위해 제약하면 <strong>창의성(Creativity)</strong>이 사라지고, <br />
                        추상화로 감추면 AI는 <strong>내부 원리(Internals)</strong>를 이해하지 못합니다.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/components')}>
                        <span style={{ borderBottom: '1px solid black', paddingBottom: 2, fontSize: '0.9rem', fontWeight: 500 }}>시스템 탐색하기</span>
                        <ArrowRight size={16} />
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className={styles.section}>
                    <span className={styles.sectionTitle}>01 — The Paradox</span>
                    <p className={styles.philosophyText}>
                        "AI 시대, 엔터프라이즈 앱을 위한 디자인 시스템은 어떻게 달라야 할까요?<br />
                        우리는 AI가 <strong>디자인 능력을 100% 발휘</strong>하면서도,
                        <strong>시스템의 정합성</strong>을 유지할 수 있는
                        <strong>'투명한 제약(Transparent Constraints)'</strong>을 설계했습니다."
                    </p>
                </section>

                {/* Core Concepts */}
                <section className={styles.section}>
                    <span className={styles.sectionTitle}>02 — Core Concepts</span>
                    <div className={styles.conceptGrid}>
                        <div className={styles.conceptItem}>
                            <h3 className={styles.conceptTitle}>Transparent Abstraction</h3>
                            <p className={styles.conceptText}>
                                과도한 추상화는 AI의 시야를 가립니다. <br />
                                <strong>vanilla-extract</strong>를 통해 CSS의 원리를 그대로 노출하되,
                                <strong>Type-System</strong>으로 위험한 선택지만 정교하게 차단합니다.
                            </p>
                        </div>
                        <div className={styles.conceptItem}>
                            <h3 className={styles.conceptTitle}>Safe Creativity</h3>
                            <p className={styles.conceptText}>
                                AI는 제약 안에서 자유롭게 탐험할 수 있어야 합니다.<br />
                                런타임이 아닌 <strong>빌드 타임(Build-time)</strong> 검증을 통해,
                                창의적인 시도가 시스템을 망가뜨리지 않음을 보장합니다.
                            </p>
                        </div>
                        <div className={styles.conceptItem}>
                            <h3 className={styles.conceptTitle}>Enterprise Physics</h3>
                            <p className={styles.conceptText}>
                                예쁜 디자인보다 중요한 것은 <strong>'작동하는 디자인'</strong>입니다.<br />
                                대규모 데이터, 복잡한 상태 관리, 키보드 인터랙션 등
                                엔터프라이즈 환경의 물리 법칙을 시스템 레벨에서 내장했습니다.
                            </p>
                        </div>
                        <div className={styles.conceptItem}>
                            <h3 className={styles.conceptTitle}>Implanted Instinct</h3>
                            <p className={styles.conceptText}>
                                디자인 시스템이 단순한 라이브러리가 되어선 안 됩니다.<br />
                                AI가 코드를 작성하는 순간, <strong>숙련된 디자이너의 직관</strong>이
                                자동으로 코드에 이식되도록 구조를 설계했습니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SWOT Analysis */}
                <section className={styles.section}>
                    <span className={styles.sectionTitle}>03 — SWOT Analysis</span>
                    <div className={styles.conceptGrid}>
                        <div className={styles.conceptItem}>
                            <h3 className={styles.conceptTitle}>Strengths (강점)</h3>
                            <p className={styles.conceptText}>
                                <strong>Safety & Consistency.</strong><br />
                                타입 시스템이 모든 디자인 토큰을 검증하므로, AI가 실수로 엉뚱한 값을 사용할 확률이 0%입니다.
                                디자이너의 의도가 100% 코드로 보존됩니다.
                            </p>
                        </div>
                        <div className={styles.conceptItem}>
                            <h3 className={styles.conceptTitle}>Weaknesses (약점)</h3>
                            <p className={styles.conceptText}>
                                <strong>Rigidity.</strong><br />
                                "한 번만 패딩을 3px로 하고 싶은데?"와 같은 예외를 허용하지 않습니다.
                                유연성이 필요한 초기 프로토타이핑 단계에서는 답답할 수 있습니다.
                            </p>
                        </div>
                        <div className={styles.conceptItem}>
                            <h3 className={styles.conceptTitle}>Opportunities (기회)</h3>
                            <p className={styles.conceptText}>
                                <strong>AI Scalability.</strong><br />
                                에이전트의 수가 늘어나도 디자인 일관성은 유지됩니다.
                                LLM이 더 똑똑해질수록, 이 시스템은 더 복잡한 UI를 더 완벽하게 통제할 것입니다.
                            </p>
                        </div>
                        <div className={styles.conceptItem}>
                            <h3 className={styles.conceptTitle}>Threats (위협)</h3>
                            <p className={styles.conceptText}>
                                <strong>High Barrier.</strong><br />
                                TypeScript와 vanilla-extract에 대한 높은 이해도를 요구합니다.
                                "그냥 CSS 쓰면 안 되나요?"라는 질문에 기술적 당위성을 설득해야 합니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Roadmap */}
                <section className={styles.section}>
                    <span className={styles.sectionTitle}>04 — Roadmap</span>
                    <div className={styles.conceptGrid}>
                        <div className={styles.conceptItem}>
                            <h3 className={styles.conceptTitle}>Phase 1: Foundation</h3>
                            <div className={styles.conceptText}>
                                <ul style={{ paddingLeft: 20, margin: 0 }}>
                                    <li><strong>PageShell</strong>: 표준 레이아웃 시스템</li>
                                    <li><strong>ResizablePanel</strong>: 가변 레이아웃</li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.conceptItem}>
                            <h3 className={styles.conceptTitle}>Phase 2: Components</h3>
                            <div className={styles.conceptText}>
                                <ul style={{ paddingLeft: 20, margin: 0 }}>
                                    <li><strong>SmartTable</strong>: 고밀도 데이터 그리드</li>
                                    <li><strong>Modal / Drawer</strong>: 표준 오버레이 시스템</li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.conceptItem}>
                            <h3 className={styles.conceptTitle}>Phase 3: Polish</h3>
                            <div className={styles.conceptText}>
                                <ul style={{ paddingLeft: 20, margin: 0 }}>
                                    <li><strong>Command Bar</strong>: Spotlight 스타일 검색</li>
                                    <li><strong>Empty State</strong>: 표준 가이드 컴포넌트</li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.conceptItem} style={{ cursor: 'pointer' }} onClick={() => navigate('/mail')}>
                            <h3 className={styles.conceptTitle} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                View Demo <ArrowRight size={16} />
                            </h3>
                            <p className={styles.conceptText}>
                                현재 구현된 기능들을 확인해보세요.<br />
                                Mail, Editor, Slides 등 구현 완료.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className={styles.footer}>
                    <div>Project Antigravity &copy; 2026</div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <span style={{ opacity: 0.5 }}>v2.0.0-beta</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
