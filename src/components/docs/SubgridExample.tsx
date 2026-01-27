
import * as styles from './SubgridExample.css';

export const SubgridExample = () => {
    return (
        <div className={styles.container}>
            {/* Card 1: Short content */}
            <div className={styles.cardStrict}>
                <div className={styles.cardHeader}>Short Header</div>
                <div className={styles.cardContent}>
                    This card has very little content.
                </div>
                <div className={styles.cardFooter}>Footer A</div>
            </div>

            {/* Card 2: Long content */}
            <div className={styles.cardStrict}>
                <div className={styles.cardHeader}>A Very Long Header That Might Wrap Multiple Lines</div>
                <div className={styles.cardContent}>
                    This card has a lot of content.<br />
                    It stretches the middle row for ALL cards.<br />
                    See how the footers of other cards align perfectly?
                </div>
                <div className={styles.cardFooter}>Footer B</div>
            </div>

            {/* Card 3: Medium content */}
            <div className={styles.cardStrict}>
                <div className={styles.cardHeader}>Medium Header</div>
                <div className={styles.cardContent}>
                    Just regular content here.
                </div>
                <div className={styles.cardFooter}>Footer C</div>
            </div>
        </div>
    );
};
