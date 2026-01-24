
export function SlidesPanel() {
  const slides = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <aside className="slide-panel">
      <div className="panel-header">LAYERS</div>
      <div className="slides-list">
        {slides.map((num) => (
          <div key={num} className={`slide-thumb-item ${num === 1 ? 'active' : ''}`}>
            <span className="slide-num">{num}</span>
            <div className="slide-thumb-preview" />
          </div>
        ))}
      </div>
    </aside>
  );
}
