import Dashboard from '../layouts/User/Dashboard/Dashboard';
import DocumentsUpload from '../layouts/User/DocumentsUpload/DocumentsUpload';
import ViewFile from '../layouts/ViewFile/ViewFile';
import SearchLayout from '../layouts/User/Search/Search';
import ListDocumentCategory from '../layouts/User/ListDocument/ListDocumentCategory';
import Upload from '../layouts/User/Upload/Upload';
import Profile from '../layouts/User/Profile/Profile';
import FilesShared from '../layouts/User/FilesShared/FilesShared';

export const userRoutes = [
    {
        name: 'Dashboard',
        path: '/',
        element: <Dashboard />
    },
    {
        name: 'Documents',
        path: '/documents',
        element: <DocumentsUpload />
    },
    {
        name: 'View File',
        path: '/documents/:id',
        element: <ViewFile />
    },
    {
        name: 'Tìm kiếm',
        path: '/search',
        element: <SearchLayout />
    },
    {
        name: 'Danh sách tài liệu public',
        path: '/documents/public',
        element: <ListDocumentCategory />
    },
    {
        name: 'Upload',
        path: '/upload',
        element: <Upload />
    },
    {
        name: 'Profile',
        path: '/profile',
        element: <Profile />
    },
    {
        name: 'Files Shared',
        path: '/files-shared',
        element: <FilesShared />
    }
];
