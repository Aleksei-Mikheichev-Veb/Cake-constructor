import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../../../redux/store';
import {setLayers, setPortions, setLayerFilling} from '../../../../../../redux/cakeConstructorSlice';
import FillingControls from '../FillingControls/FillingControls'; // твой контрол
import styles from './TieredControls.module.scss';
import {FillingType} from "../../../../../../data/cakes/biscuit/fillings";
import Tooltip from "../../../../../UI/Tooltip/Tooltip";
import {LAYERS_RANGES} from '../../../../../../utils/tieredUtils';

const TieredControls = () => {
    const dispatch = useDispatch();
    const tiers = useSelector((s: RootState) => s.cakeConstructor.tiers);
    const [activeTab, setActiveTab] = useState(0);

    if (!tiers) {
        return <div className={styles.loading}>Загрузка конфигурации ярусов...</div>;
    }

    const handleLayersChange = (newLayers: number) => {
        dispatch(setLayers(newLayers));
        setActiveTab(0); // всегда сбрасываем на первый ярус
    };

    const handlePortionsChange = (delta: number) => {
        dispatch(setPortions(tiers.portions + delta));
    };

    const handleFillingChange = (filling: FillingType) => {
        dispatch(setLayerFilling({layerIndex: activeTab, filling}));
    };

    return (
        <div className={styles.tieredBlock}>
            {/* 1. Количество гостей */}
            <div className={styles.row}>
                <span className={styles.label}>Количество гостей</span>
                <div className={styles.counter}>
                    <button
                        onClick={() => handlePortionsChange(-1)}
                        disabled={tiers.portions <= 10}
                        className={styles.counterBtn}
                    >
                        −
                    </button>
                    <span className={styles.portionsValue}>{tiers.portions}</span>
                    <button
                        onClick={() => handlePortionsChange(1)}
                        disabled={tiers.portions >= 84}
                        className={styles.counterBtn}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className={styles.row}>
                <span className={styles.label}>Вес торта</span>
                <div className={styles.weightInfo}>
                    ~{(tiers.portions * 0.2).toFixed(1)} кг
                    <span className={styles.hintText}>
                        (из расчёта 200 г на человека)
                    </span>
                </div>
            </div>

            {/* 2. Количество ярусов */}
            <div className={styles.row}>
                <span className={styles.label}>Количество ярусов</span>
                <div className={styles.layersButtons}>
                    {LAYERS_RANGES.map(n => (
                        <Tooltip content={n.height} key={n.layers}>
                            <button
                                className={`${styles.layerBtn} ${tiers.layers === n.layers ? styles.active : ''}`}
                                onClick={() => handleLayersChange(n.layers)}
                            >
                                {n.layers}
                            </button>
                        </Tooltip>
                    ))}
                </div>
            </div>

            {/* 3. Начинки */}
            <div className={styles.fillingsSection}>
                {tiers.layers === 1 ? (
                    <>
                        <h3 className={styles.sectionTitle}>Выберите начинку</h3>
                        <FillingControls
                            title={'Начинка первого яруса'}
                            activeFillingId={tiers.layerFillings[0]?.id ?? null}
                            setActiveFilling={handleFillingChange}
                        />
                    </>
                ) : (
                    <>
                        <div className={styles.tabs}>
                            {Array.from({length: tiers.layers}).map((_, i) => (
                                <button
                                    key={i}
                                    className={`${styles.tabBtn} ${activeTab === i ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab(i)}
                                >
                                    {i + 1} ярус
                                </button>
                            ))}
                        </div>

                        <h3 className={styles.sectionTitle}>
                            Начинка {activeTab + 1} яруса
                        </h3>

                        <FillingControls
                            title={''}
                            activeFillingId={tiers.layerFillings[activeTab]?.id ?? null}
                            setActiveFilling={handleFillingChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default TieredControls;
