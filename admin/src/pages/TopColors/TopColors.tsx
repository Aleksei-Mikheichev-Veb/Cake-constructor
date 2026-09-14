// ============================================================
// src/pages/TopColors/TopColors.tsx — Кремовые шапки
// ============================================================
// Общий каталог для капкейков и трайфлов (шаг «оформление» в конструкторе).
// Использует ту же переиспользуемую таблицу, что и капкейки.

import React from 'react';
import {
  useGetTopColorsQuery,
  useCreateTopColorMutation,
  useUpdateTopColorMutation,
  useDeleteTopColorMutation,
} from '../../api/adminApi';
import { SimpleCatalogTable } from '../Cupcakes/Cupcakes';

const TopColors: React.FC = () => (
  <div>
    <h1 style={{ marginTop: 0 }}>Кремовые шапки</h1>
    <p style={{ color: '#888', marginTop: -8 }}>
      Используются в конструкторе капкейков и трайфлов на шаге «Оформление»
    </p>
    <SimpleCatalogTable
      hooks={{
        useGet: useGetTopColorsQuery,
        useCreate: useCreateTopColorMutation,
        useUpdate: useUpdateTopColorMutation,
        useDelete: useDeleteTopColorMutation,
      }}
      addLabel="Добавить цвет шапки"
      entityLabel="Кремовая шапка"
      folder="top-colors"
    />
  </div>
);

export default TopColors;
