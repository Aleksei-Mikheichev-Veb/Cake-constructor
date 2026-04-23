import React, { FC } from 'react';
import styles from './PortionsControls.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/store';
import { setQuantity } from '../../../../../../redux/cakeConstructorSlice';
import Tooltip from '../../../../../UI/Tooltip/Tooltip';
import Button from '../../../../../UI/Button/Button';
import { useParams } from 'react-router-dom';
import { useGetServingsQuery } from '../../../../../../api/constructorApi';

type PortionsControlsProps = {
    title: string;
};

// Адаптер серверных порций → фронтовый формат
function adaptPortions(serverServings: any[]) {
    return serverServings.map((s) => ({
        id: s.quantity || s.portions || 0,
        quantity: String(s.quantity || s.portions || ''),
        weight: s.label?.split(',')[1]?.trim() || s.label || '',
    }));
}

const PortionsControls: FC<PortionsControlsProps> = ({ title }) => {
    const dispatch = useDispatch();
    const { category } = useParams<{ category: string }>();

    const { data: serverServings = [], isLoading } = useGetServingsQuery(
        { categoryId: category || '' },
        { skip: !category }
    );

    const servings = adaptPortions(serverServings);
    const activeServing = useSelector((state: RootState) => state.cakeConstructor.quantity);

    const handleButtonClick = (elem: any) => {
        dispatch(setQuantity(elem));
    };

    if (isLoading) return <div>Загрузка...</div>;
    if (servings.length === 0) return <div>Порции не найдены</div>;

    return (
        <section className={styles.portionControls}>
            <h2 className={styles.portionControls_title}>{title}</h2>
            <div className={styles.portionControls_row}>
                {servings.map((elem) => (
                    <Tooltip
                        key={elem.id}
                        content={{ weight: elem.weight }}
                    >
                        <Button
                            elem={elem}
                            quantity={elem.quantity}
                            activeId={activeServing?.id ?? null}
                            id={elem.id}
                            handleButtonClick={() => handleButtonClick(elem)}
                        />
                    </Tooltip>
                ))}
            </div>
        </section>
    );
};

export default PortionsControls;