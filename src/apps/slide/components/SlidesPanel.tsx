import * as styles from "../SlideApp.css";

export function SlidesPanel() {
  const slides = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div style={{ display: "contents" }}>
      <div className={styles.propHeader} style={{ paddingLeft: 16 }}>LAYERS</div>
      <div className={styles.slidesList}>
        {slides.map((num) => (
          <div key={num} className={`${styles.slideItem} ${num === 1 ? 'active' : ''}`}>
            <span className={styles.slideNum}>{num}</span>
            <div className={styles.slidePreview} />
          </div>
        ))}
      </div>
    </div>
  );
}
