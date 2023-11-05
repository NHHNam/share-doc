import Blacklist from '../layouts/Admin/Blacklist/Blacklist';
import Category from '../layouts/Admin/Category/Category';
import ListDocumentByCategory from '../layouts/Admin/Category/ListDocumentByCategory';
import DashboardAdmin from '../layouts/Admin/Dashboard/DashboardAdmin';
import Documents from '../layouts/Admin/Documents/Documents';
import Users from '../layouts/Admin/User/User';
import DocumentsUpload from '../layouts/User/DocumentsUpload/DocumentsUpload';
import FilesShared from '../layouts/User/FilesShared/FilesShared';
import ListDocumentCategory from '../layouts/User/ListDocument/ListDocumentCategory';
import SearchLayout from '../layouts/User/Search/Search';
import Upload from '../layouts/User/Upload/Upload';
import ViewFile from '../layouts/ViewFile/ViewFile';
export const adminRoutes = [
    {
        name: 'Dashboard',
        path: '/',
        element: <DashboardAdmin />
    },
    {
        name: 'Documents',
        path: '/documents',
        element: <Documents />
    },
    {
        name: 'View File',
        path: '/documents/:id',
        element: <ViewFile />
    },
    {
        name: 'Upload',
        path: '/upload',
        element: <Upload />
    },
    {
        name: 'Blacklist',
        path: '/blacklist',
        element: <Blacklist />
    },
    {
        name: 'Category',
        path: '/category',
        element: <Category />
    },
    {
        name: 'Danh sách tài liệu public',
        path: '/documents/public',
        element: <ListDocumentCategory />
    },
    {
        name: 'Danh sách tài liệu theo loại',
        path: '/documents/category/:id',
        element: <ListDocumentByCategory />
    },
    {
        name: 'Danh sách user',
        path: '/users',
        element: <Users />
    },
    {
        name: 'Danh sách tài liệu upload',
        path: '/documents/upload',
        element: <DocumentsUpload />
    },
    {
        name: 'Files Shared',
        path: '/files-shared',
        element: <FilesShared />
    },
    {
        name: 'Tìm kiếm',
        path: '/search',
        element: <SearchLayout />
    }
];
