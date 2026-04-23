import { useNavigate } from "react-router-dom";
import CardCategory from "./CardCategory/CardCategory";
import globalStyles from './../../../styles/global.module.scss';
import { useGetCategoriesQuery } from '../../../api/constructorApi';

const ConstructorPage = () => {
    const navigate = useNavigate();
    const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();

    const handleClickCategory = (id: string) => {
        if (id === 'cakes') {
            navigate('/constructor/cakes');           // торты → выбор подкатегории
        } else {
            navigate(`/constructor/${id}`);           // трайфлы и капкейки → сразу в ProductPage
        }
    };

    if (isLoading) return <div className={globalStyles.container}>Загрузка...</div>;
    if (isError) return <div className={globalStyles.container}>Ошибка загрузки категорий</div>;

    return (
        <div className={globalStyles.container}>
            <h1>Конструктор десертов</h1>
            <main className={globalStyles.categoriesList}>
                {categories.map(elem => (
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

export default ConstructorPage;