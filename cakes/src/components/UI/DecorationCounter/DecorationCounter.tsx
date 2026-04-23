import { FC } from "react";
import styles from './DecorationCounter.module.scss';

type DecorationCounterProps = {
    count: number;
    minCount: number;
    onIncrement: () => void;
    onDecrement: () => void;
};

const DecorationCounter: FC<DecorationCounterProps> = ({
                                                           count,
                                                           minCount,
                                                           onIncrement,
                                                           onDecrement,
                                                       }) => {
    const canDecrement = count > minCount;

    return (
        <div className={styles.counter}>
            <button
                className={`${styles.counterBtn} ${styles.decrement}`}
                onClick={onDecrement}
                disabled={!canDecrement}
            >
                −
            </button>

            <span className={styles.counterValue}>{count}</span>

            <button
                className={`${styles.counterBtn} ${styles.increment}`}
                onClick={onIncrement}
            >
                +
            </button>
        </div>
    );
};
export default DecorationCounter;