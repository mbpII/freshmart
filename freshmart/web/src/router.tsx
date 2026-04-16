import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductEditorPage from '@/routes/products/editProductPage';
import ProductsIndex from '@/routes/products/index';
import ProductPage from '@/routes/products/productPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: ProductsIndex },
      { path: 'products/new', Component: ProductEditorPage },
      { path: 'products/:id', Component: ProductPage },
      { path: 'products/:id/edit', Component: ProductEditorPage },
    ],
  },
]);
