import { useNavigate } from "react-router-dom";
import globalStyles from './../../../../styles/global.module.scss';
import styles from './CakesType.module.scss';
import CardCategory from "../CardCategory/CardCategory";
import { useGetCategoriesQuery } from '../../../../api/constructorApi';

const CakesType = () => {
    const navigate = useNavigate();
    const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();

    const handleClickCategory = (id: string) => {
        navigate(`/constructor/cakes/${id}`);
    };

    // Находим категорию "cakes" и берём её подкатегории
    const cakesCategory = categories.find(c => c.id === 'cakes');

    if (isLoading) return <div className={`${globalStyles.container} ${styles.container}`}>Загрузка...</div>;
    if (isError) return <div className={`${globalStyles.container} ${styles.container}`}>Ошибка загрузки</div>;
    if (!cakesCategory || !cakesCategory.hasSubcategories) return null;

    return (
        <div className={`${globalStyles.container} ${styles.container}`}>
            <h1 className={globalStyles.title}>Выберите тип торта</h1>

            <main className={globalStyles.categoriesList}>
                {cakesCategory.subcategories.map(elem => (
                    <CardCategory
                        handleClickCategory={handleClickCategory}
                        title={elem.name}
                        image={elem.image || ''}
                        id={elem.id}
                        tooltip={elem.tooltip || ''}
                        key={elem.id} />
                ))}
            </main>
        </div>
    );
};

export default CakesType;